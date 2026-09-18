import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { BottomNav } from '@/components/Navigation';
import { Message, Profile } from '@/types';
import { ShieldCheck, Send, ArrowLeft, Search } from 'lucide-react';

interface Conversation {
  partnerId: string;
  partner: Profile;
  messages: Message[];
  lastMessage: Message;
  itemName?: string;
}

export function MessagesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activePartnerId, setActivePartnerId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    async function loadMessages() {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user!.id},recipient_id.eq.${user!.id}`)
        .order('created_at', { ascending: true });

      if (!data || data.length === 0) {
        setLoading(false);
        return;
      }

      const allMessages = data as Message[];
      const partnerIds = new Set<string>();
      allMessages.forEach((m) => {
        if (m.sender_id === user!.id) partnerIds.add(m.recipient_id);
        else partnerIds.add(m.sender_id);
      });

      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .in('id', Array.from(partnerIds));

      const profileMap: Record<string, Profile> = {};
      (profiles as Profile[] ?? []).forEach((p) => { profileMap[p.id] = p; });

      // Get item names for messages
      const lostItemIds = allMessages.filter(m => m.item_type === 'lost' && m.item_id).map(m => m.item_id!);
      const foundItemIds = allMessages.filter(m => m.item_type === 'found' && m.item_id).map(m => m.item_id!);

      const itemNameMap: Record<string, string> = {};
      if (lostItemIds.length > 0) {
        const { data: lostItems } = await supabase.from('lost_items').select('id, item_name').in('id', lostItemIds);
        (lostItems ?? []).forEach((i: any) => { itemNameMap[i.id] = i.item_name; });
      }
      if (foundItemIds.length > 0) {
        const { data: foundItems } = await supabase.from('found_items').select('id, item_name').in('id', foundItemIds);
        (foundItems ?? []).forEach((i: any) => { itemNameMap[i.id] = i.item_name; });
      }

      const convos: Conversation[] = [];
      partnerIds.forEach((pid) => {
        const msgs = allMessages.filter(m => m.sender_id === pid || m.recipient_id === pid);
        if (msgs.length === 0) return;
        const lastMsg = msgs[msgs.length - 1];
        convos.push({
          partnerId: pid,
          partner: profileMap[pid],
          messages: msgs,
          lastMessage: lastMsg,
          itemName: lastMsg.item_id ? itemNameMap[lastMsg.item_id] : undefined,
        });
      });

      convos.sort((a, b) => new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime());
      setConversations(convos);
      setLoading(false);
    }
    loadMessages();
  }, [user]);

  // Mark messages as read when opening a conversation
  useEffect(() => {
    if (!user || !activePartnerId) return;
    const unread = conversations
      .find((c) => c.partnerId === activePartnerId)
      ?.messages.filter((m) => m.recipient_id === user.id && !m.read_at) ?? [];
    if (unread.length > 0) {
      supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .in('id', unread.map((m) => m.id));
    }
  }, [activePartnerId, user, conversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activePartnerId, conversations]);

  const handleSend = async () => {
    if (!user || !activePartnerId || !newMessage.trim()) return;
    const activeConvo = conversations.find((c) => c.partnerId === activePartnerId);
    const msg: Message = {
      id: crypto.randomUUID(),
      sender_id: user.id,
      recipient_id: activePartnerId,
      item_id: activeConvo?.lastMessage.item_id ?? null,
      item_type: activeConvo?.lastMessage.item_type ?? null,
      body: newMessage.trim(),
      read_at: null,
      created_at: new Date().toISOString(),
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.partnerId === activePartnerId
          ? { ...c, messages: [...c.messages, msg], lastMessage: msg }
          : c
      )
    );
    setNewMessage('');

    await supabase.from('messages').insert({
      sender_id: user.id,
      recipient_id: activePartnerId,
      item_id: msg.item_id,
      item_type: msg.item_type,
      body: msg.body,
    });
  };

  const activeConvo = activePartnerId ? conversations.find((c) => c.partnerId === activePartnerId) : null;

  // Chat View
  if (activeConvo) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <div className="max-w-md mx-auto w-full flex flex-col flex-1">
          {/* Chat Header */}
          <header className="sticky top-0 z-20 bg-white border-b border-neutral-100 px-4 h-14 flex items-center gap-3">
            <button onClick={() => setActivePartnerId(null)} className="-ml-2 p-2 rounded-full hover:bg-neutral-100">
              <ArrowLeft className="w-5 h-5 text-neutral-700" />
            </button>
            <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
              {activeConvo.partner?.full_name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <p className="font-semibold text-sm text-neutral-800 truncate">{activeConvo.partner?.full_name ?? 'Unknown'}</p>
                {activeConvo.partner?.is_verified && <ShieldCheck className="w-3.5 h-3.5 text-secondary-500" />}
              </div>
              <p className="text-[10px] text-neutral-400">{activeConvo.partner?.trust_level}</p>
            </div>
          </header>

          {/* Item Context */}
          {activeConvo.itemName && (
            <div className="bg-secondary-50 border-b border-secondary-100 px-4 py-2 text-center">
              <p className="text-xs text-secondary-800">Re: <span className="font-semibold">{activeConvo.itemName}</span></p>
            </div>
          )}

          {/* Privacy Notice */}
          <div className="bg-accent-50 px-4 py-1.5 text-center">
            <p className="text-[10px] text-accent-800 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Messages are private. Phone numbers & emails are never shared.
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
            {activeConvo.messages.map((m, i) => {
              const isMine = m.sender_id === user?.id;
              const showTime = i === 0 || new Date(activeConvo.messages[i - 1].created_at).getTime() + 300000 < new Date(m.created_at).getTime();
              return (
                <div key={m.id}>
                  {showTime && (
                    <p className="text-center text-[10px] text-neutral-400 my-2">
                      {new Date(m.created_at).toLocaleString('en-ZA', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                    </p>
                  )}
                  <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                      isMine
                        ? 'bg-primary-500 text-white rounded-br-md'
                        : 'bg-white text-neutral-800 border border-neutral-100 rounded-bl-md'
                    }`}>
                      {m.body}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-neutral-100 bg-white px-4 py-3 flex items-center gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="input flex-1"
            />
            <button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className="w-11 h-11 rounded-full bg-primary-500 text-white flex items-center justify-center disabled:opacity-40 active:scale-90 transition-transform"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Conversation List View
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-md mx-auto pb-24">
        <header className="sticky top-0 z-20 bg-white border-b border-neutral-100 px-5 pt-6 pb-3">
          <h1 className="font-display font-bold text-xl text-neutral-800 mb-3">Messages</h1>
          <div className="bg-accent-50 rounded-xl px-3 py-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-accent-700" />
            <p className="text-xs text-accent-800">All communication stays in the app. Your phone number and email are never shared.</p>
          </div>
        </header>

        <div className="px-5 pt-4">
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card p-4 animate-pulse">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 bg-neutral-100 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-neutral-100 rounded w-1/2" />
                      <div className="h-3 bg-neutral-100 rounded w-3/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="card p-8 text-center mt-4">
              <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3">
                <Search className="w-7 h-7 text-neutral-300" />
              </div>
              <p className="text-sm font-medium text-neutral-600">No messages yet</p>
              <p className="text-xs text-neutral-400 mt-1">When you contact someone about an item, conversations will appear here</p>
              <button onClick={() => navigate('/browse')} className="btn-primary mt-4">Browse Items</button>
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map((c) => {
                const lastMsg = c.lastMessage;
                const isMine = lastMsg.sender_id === user?.id;
                const unread = c.messages.filter(m => m.recipient_id === user?.id && !m.read_at).length;
                return (
                  <button
                    key={c.partnerId}
                    onClick={() => setActivePartnerId(c.partnerId)}
                    className="card p-4 w-full text-left flex items-center gap-3 active:scale-[0.98] transition-transform hover:shadow-md"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold flex-shrink-0">
                      {c.partner?.full_name?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-sm text-neutral-800 truncate">{c.partner?.full_name ?? 'Unknown'}</p>
                          {c.partner?.is_verified && <ShieldCheck className="w-3.5 h-3.5 text-secondary-500" />}
                        </div>
                        <span className="text-[10px] text-neutral-400 flex-shrink-0">
                          {new Date(lastMsg.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      {c.itemName && (
                        <p className="text-[10px] text-secondary-500 font-medium truncate">Re: {c.itemName}</p>
                      )}
                      <p className={`text-xs truncate ${unread > 0 ? 'font-semibold text-neutral-700' : 'text-neutral-500'}`}>
                        {isMine ? 'You: ' : ''}{lastMsg.body}
                      </p>
                    </div>
                    {unread > 0 && (
                      <div className="w-5 h-5 rounded-full bg-primary-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                        {unread}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

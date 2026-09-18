import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { MessageSquare, AlertTriangle } from 'lucide-react';

interface ContactButtonProps {
  itemId: string;
  itemType: 'lost' | 'found';
  ownerId: string;
  ownerName: string;
  itemName: string;
}

export function ContactButton({ itemId, itemType, ownerId, ownerName, itemName }: ContactButtonProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const handleContact = async () => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    if (user.id === ownerId) {
      return;
    }

    setLoading(true);

    const existing = await supabase
      .from('messages')
      .select('id')
      .eq('sender_id', user.id)
      .eq('recipient_id', ownerId)
      .eq('item_id', itemId)
      .maybeSingle();

    if (existing.data) {
      navigate('/messages');
      return;
    }

    await supabase.from('messages').insert({
      sender_id: user.id,
      recipient_id: ownerId,
      item_id: itemId,
      item_type: itemType,
      body: `Hi! I'm reaching out about the ${itemName.toLowerCase()} you posted. I'd like to discuss this further.`,
    });

    navigate('/messages');
  };

  if (user?.id === ownerId) {
    return (
      <div className="badge-primary">
        <MessageSquare className="w-3.5 h-3.5" />
        This is your listing
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleContact}
        disabled={loading}
        className="btn-secondary flex-1"
      >
        <MessageSquare className="w-4 h-4" />
        {loading ? 'Connecting...' : 'Contact Safely'}
      </button>
      <button
        onClick={() => navigate('/report-user', { state: { reportedUserId: ownerId, itemId, itemType } })}
        className="btn-outline !px-3"
        title="Report user"
      >
        <AlertTriangle className="w-4 h-4 text-neutral-400" />
      </button>
    </div>
  );
}

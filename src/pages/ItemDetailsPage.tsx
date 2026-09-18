import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { PageContainer, TopBar } from '@/components/Navigation';
import { ContactButton } from '@/components/ContactButton';
import { CategoryBadge, CategoryCircle } from '@/components/CategoryIcon';
import { LostItem, FoundItem, Profile } from '@/types';
import {
  MapPin, Calendar, Gift, User, ShieldCheck, MessageSquare,
  AlertTriangle, PackageX, PackageCheck, Clock,
} from 'lucide-react';

export function ItemDetailsPage() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<LostItem | FoundItem | null>(null);
  const [reporter, setReporter] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !type) return;
    async function load() {
      const table = type === 'lost' ? 'lost_items' : 'found_items';
      const { data, error } = await supabase.from(table).select('*').eq('id', id).maybeSingle();
      if (error || !data) {
        setLoading(false);
        return;
      }
      setItem(data as LostItem | FoundItem);
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', (data as LostItem | FoundItem).user_id).maybeSingle();
      setReporter(profile as Profile | null);
      setLoading(false);
    }
    load();
  }, [id, type]);

  if (loading) {
    return (
      <PageContainer>
        <TopBar title="Item Details" showBack />
        <div className="px-5 pt-4">
          <div className="card p-6 animate-pulse">
            <div className="w-16 h-16 bg-neutral-100 rounded-2xl mb-4" />
            <div className="h-5 bg-neutral-100 rounded w-3/4 mb-3" />
            <div className="h-4 bg-neutral-100 rounded w-1/2 mb-4" />
            <div className="h-20 bg-neutral-100 rounded" />
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!item) {
    return (
      <PageContainer>
        <TopBar title="Item Details" showBack />
        <div className="px-5 pt-10 text-center">
          <p className="text-neutral-500">Item not found.</p>
          <button onClick={() => navigate('/browse')} className="btn-primary mt-4">Browse Items</button>
        </div>
      </PageContainer>
    );
  }

  const isLost = type === 'lost';
  const location = isLost ? (item as LostItem).last_seen_location : (item as FoundItem).found_location;
  const date = isLost ? (item as LostItem).date_lost : (item as FoundItem).date_found;
  const reward = isLost ? (item as LostItem).reward_offered : 0;
  const questions = isLost ? (item as LostItem).verification_questions : [];

  return (
    <PageContainer>
      <TopBar title="Item Details" showBack />

      <div className="px-5 pt-4 space-y-4">
        {/* Status Banner */}
        <div className={`rounded-2xl p-4 flex items-center gap-3 ${isLost ? 'bg-error-50' : 'bg-success-50'}`}>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isLost ? 'bg-error-100' : 'bg-success-100'}`}>
            {isLost ? <PackageX className="w-6 h-6 text-error-600" /> : <PackageCheck className="w-6 h-6 text-success-600" />}
          </div>
          <div>
            <p className={`font-bold text-sm ${isLost ? 'text-error-700' : 'text-success-700'}`}>
              {isLost ? 'LOST ITEM' : 'FOUND ITEM'}
            </p>
            <p className="text-xs text-neutral-500">Status: {item.status === 'active' ? 'Active' : 'Resolved'}</p>
          </div>
        </div>

        {/* Main Info Card */}
        <div className="card p-5">
          <div className="flex items-start gap-4 mb-4">
            <CategoryCircle category={item.category} size="lg" />
            <div className="flex-1">
              <h2 className="font-display font-bold text-lg text-neutral-800">{item.item_name}</h2>
              <div className="mt-1.5">
                <CategoryBadge category={item.category} />
              </div>
            </div>
          </div>

          {item.description && (
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">Description</h3>
              <p className="text-sm text-neutral-700 leading-relaxed">{item.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-neutral-100">
            <InfoRow icon={<MapPin className="w-4 h-4" />} label="Location" value={location ?? 'Not specified'} />
            <InfoRow icon={<Calendar className="w-4 h-4" />} label={isLost ? 'Date Lost' : 'Date Found'} value={new Date(date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })} />
            <InfoRow icon={<Clock className="w-4 h-4" />} label="Reported" value={new Date(item.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })} />
            {isLost && (
              <InfoRow
                icon={<Gift className="w-4 h-4" />}
                label="Reward"
                value={reward > 0 ? `R${reward}` : 'None offered'}
              />
            )}
          </div>
        </div>

        {/* Reward Banner */}
        {reward > 0 && (
          <div className="bg-gradient-to-r from-accent-400 to-accent-500 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
              <Gift className="w-6 h-6 text-neutral-900" />
            </div>
            <div>
              <p className="font-display font-bold text-neutral-900">R{reward} Reward Offered</p>
              <p className="text-xs text-neutral-800/70">For the safe return of this item</p>
            </div>
          </div>
        )}

        {/* Verification Questions (Lost items only, shown to finders) */}
        {isLost && questions.length > 0 && (
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-secondary-600" />
              <h3 className="font-semibold text-sm text-neutral-800">Ownership Verification</h3>
            </div>
            <p className="text-xs text-neutral-500 mb-3">
              The owner has set verification questions. Be prepared to answer these when claiming the item.
            </p>
            <div className="space-y-2">
              {questions.map((q, i) => (
                <div key={i} className="bg-secondary-50 rounded-xl p-3">
                  <p className="text-sm font-medium text-secondary-900">Q{i + 1}: {q.question}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reporter Info */}
        {reporter && (
          <div className="card p-4">
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">Reported By</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                {reporter.full_name[0]?.toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-sm text-neutral-800">{reporter.full_name}</p>
                  {reporter.is_verified && (
                    <ShieldCheck className="w-4 h-4 text-secondary-500" />
                  )}
                </div>
                <p className="text-xs text-neutral-500">{reporter.trust_level} · {reporter.trust_score} pts</p>
              </div>
            </div>
          </div>
        )}

        {/* Safety Tip */}
        <div className="bg-secondary-50 border border-secondary-100 rounded-xl p-3 flex items-start gap-2">
          <ShieldCheck className="w-5 h-5 text-secondary-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-secondary-800">
            Always meet at a verified collection point. Never share personal contact details. Verify ownership before handing over items.
          </p>
        </div>

        {/* Action Button */}
        <div className="sticky bottom-24">
          <ContactButton
            itemId={item.id}
            itemType={type as 'lost' | 'found'}
            ownerId={item.user_id}
            ownerName={reporter?.full_name ?? 'Reporter'}
            itemName={item.item_name}
          />
        </div>
      </div>
    </PageContainer>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1.5 text-neutral-400">
        {icon}
        <span className="text-[10px] uppercase tracking-wide font-medium">{label}</span>
      </div>
      <p className="text-sm font-medium text-neutral-700">{value}</p>
    </div>
  );
}

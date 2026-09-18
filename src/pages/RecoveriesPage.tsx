import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PageContainer, TopBar } from '@/components/Navigation';
import { CategoryIcon } from '@/components/CategoryIcon';
import { Recovery, Profile } from '@/types';
import { TrendingUp, Heart, Award } from 'lucide-react';

export function RecoveriesPage() {
  const [recoveries, setRecoveries] = useState<(Recovery & { owner?: Profile; finder?: Profile })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('recoveries').select('*').order('created_at', { ascending: false });
      const recs = (data ?? []) as Recovery[];
      const userIds = [...new Set([...recs.map((r) => r.owner_id), ...recs.map((r) => r.finder_id)])];
      let userMap: Record<string, Profile> = {};
      if (userIds.length > 0) {
        const { data: users } = await supabase.from('profiles').select('*').in('id', userIds);
        userMap = Object.fromEntries((users as Profile[] ?? []).map((u) => [u.id, u]));
      }
      setRecoveries(recs.map((r) => ({ ...r, owner: userMap[r.owner_id], finder: userMap[r.finder_id] })));
      setLoading(false);
    }
    load();
  }, []);

  return (
    <PageContainer>
      <TopBar title="Recovery Stories" showBack />

      <div className="px-5 pt-4 space-y-4">
        <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg">Community Heroes</h2>
              <p className="text-primary-100 text-xs">Real stories of items reunited with owners</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <TrendingUp className="w-5 h-5 text-accent-300" />
            <p className="text-2xl font-display font-bold text-white">{recoveries.length}</p>
            <p className="text-primary-100 text-sm">successful recoveries</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-4 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-14 h-14 bg-neutral-100 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-neutral-100 rounded w-1/2" />
                    <div className="h-3 bg-neutral-100 rounded w-3/4" />
                    <div className="h-3 bg-neutral-100 rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : recoveries.length === 0 ? (
          <div className="card p-8 text-center">
            <Heart className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
            <p className="text-sm text-neutral-400">No recovery stories yet. Be the first!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recoveries.map((r, i) => (
              <div key={r.id} className="card p-4 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 rounded-xl bg-success-50 flex items-center justify-center flex-shrink-0">
                    <CategoryIcon category={r.category} size={26} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-neutral-800">{r.item_name}</h3>
                    <p className="text-xs text-neutral-500">
                      {new Date(r.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="badge-accent">
                    <Award className="w-3 h-3" />
                    +{r.points_awarded}
                  </div>
                </div>

                {r.story && (
                  <p className="text-sm text-neutral-600 leading-relaxed mb-3">{r.story}</p>
                )}

                <div className="flex items-center gap-2 pt-3 border-t border-neutral-100">
                  <div className="flex items-center gap-1.5">
                    <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs">
                      {r.owner?.full_name?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <span className="text-xs text-neutral-600">{r.owner?.full_name ?? 'Owner'}</span>
                  </div>
                  <span className="text-neutral-300 text-xs">←</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-7 h-7 rounded-full bg-success-100 flex items-center justify-center text-success-700 font-bold text-xs">
                      {r.finder?.full_name?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <span className="text-xs text-neutral-600">{r.finder?.full_name ?? 'Finder'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { BottomNav } from '@/components/Navigation';
import { CategoryIcon } from '@/components/CategoryIcon';
import {
  Search, PackageX, PackageCheck, Compass, MessageSquare,
  TrendingUp, Award, MapPin, ChevronRight, ShieldCheck, Trophy,
  Search as SearchIcon,
} from 'lucide-react';
import { Recovery, Profile } from '@/types';

export function DashboardPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [stats, setStats] = useState({ lost: 0, found: 0, recoveries: 0 });
  const [recentRecoveries, setRecentRecoveries] = useState<Recovery[]>([]);
  const [leaders, setLeaders] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [lostR, foundR, recR, leadersR] = await Promise.all([
        supabase.from('lost_items').select('id', { count: 'exact', head: true }),
        supabase.from('found_items').select('id', { count: 'exact', head: true }),
        supabase.from('recoveries').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('profiles').select('*').order('trust_score', { ascending: false }).limit(5),
      ]);

      setStats({
        lost: lostR.count ?? 0,
        found: foundR.count ?? 0,
        recoveries: recR.count ?? 0,
      });
      setRecentRecoveries((recR.data ?? []) as Recovery[]);
      setLeaders((leadersR.data ?? []) as Profile[]);
      setLoading(false);
    }
    load();
  }, []);

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there';

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-md mx-auto pb-24">
        {/* Header */}
        <div className="bg-gradient-to-b from-primary-600 to-primary-700 px-5 pt-10 pb-6 rounded-b-3xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-primary-100 text-sm">Hello,</p>
              <h1 className="text-2xl font-display font-bold text-white">{firstName}!</h1>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="w-11 h-11 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white font-bold text-lg border-2 border-white/30"
            >
              {firstName[0]?.toUpperCase()}
            </button>
          </div>

          {/* Trust Score Badge */}
          {profile && (
            <div className="bg-white/15 backdrop-blur rounded-2xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent-400 flex items-center justify-center">
                <Award className="w-5 h-5 text-neutral-900" />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">{profile.trust_level}</p>
                <p className="text-primary-100 text-xs">{profile.trust_score} trust points · {profile.points_balance} reward points</p>
              </div>
              <ChevronRight className="w-5 h-5 text-white/60" onClick={() => navigate('/profile')} />
            </div>
          )}

          {/* Search Bar */}
          <div className="mt-4">
            <button
              onClick={() => navigate('/browse')}
              className="w-full bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3 shadow-sm active:scale-[0.98] transition-transform"
            >
              <SearchIcon className="w-5 h-5 text-neutral-400" />
              <span className="text-neutral-400 text-sm">Search lost & found items...</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="px-5 -mt-4">
          <div className="grid grid-cols-3 gap-3">
            <StatCard
              icon={<PackageX className="w-5 h-5" />}
              value={loading ? '—' : stats.lost}
              label="Lost Items"
              color="bg-error-50 text-error-600"
            />
            <StatCard
              icon={<PackageCheck className="w-5 h-5" />}
              value={loading ? '—' : stats.found}
              label="Found Items"
              color="bg-success-50 text-success-600"
            />
            <StatCard
              icon={<TrendingUp className="w-5 h-5" />}
              value={loading ? '—' : stats.recoveries}
              label="Recovered"
              color="bg-secondary-50 text-secondary-600"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-5 mt-6">
          <h2 className="font-display font-bold text-base text-neutral-800 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <QuickActionCard
              icon={<PackageX className="w-6 h-6" />}
              title="Report Lost"
              subtitle="Lost something?"
              color="from-error-500 to-error-600"
              onClick={() => navigate('/report-lost')}
            />
            <QuickActionCard
              icon={<PackageCheck className="w-6 h-6" />}
              title="Report Found"
              subtitle="Found something?"
              color="from-success-500 to-success-600"
              onClick={() => navigate('/report-found')}
            />
            <QuickActionCard
              icon={<Compass className="w-6 h-6" />}
              title="Browse Items"
              subtitle="Search & filter"
              color="from-secondary-500 to-secondary-600"
              onClick={() => navigate('/browse')}
            />
            <QuickActionCard
              icon={<MessageSquare className="w-6 h-6" />}
              title="Messages"
              subtitle="Safe in-app chat"
              color="from-primary-500 to-primary-600"
              onClick={() => navigate('/messages')}
            />
          </div>
        </div>

        {/* Recent Recoveries */}
        <div className="px-5 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-base text-neutral-800">Recent Recoveries</h2>
            <button onClick={() => navigate('/recoveries')} className="text-primary-600 text-xs font-semibold">View all</button>
          </div>
          <div className="space-y-2.5">
            {recentRecoveries.slice(0, 3).map((r) => (
              <div key={r.id} className="card p-4 flex items-center gap-3 animate-fade-in">
                <div className="w-11 h-11 rounded-xl bg-success-50 flex items-center justify-center flex-shrink-0">
                  <CategoryIcon category={r.category} size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-neutral-800 truncate">{r.item_name}</p>
                  <p className="text-xs text-neutral-500 truncate">{r.story?.slice(0, 50)}...</p>
                </div>
                <div className="badge-success flex-shrink-0">
                  +{r.points_awarded} pts
                </div>
              </div>
            ))}
            {recentRecoveries.length === 0 && !loading && (
              <div className="card p-6 text-center">
                <p className="text-sm text-neutral-400">No recoveries yet. Be the first!</p>
              </div>
            )}
          </div>
        </div>

        {/* Community Trust Leaderboard */}
        <div className="px-5 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-base text-neutral-800 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-accent-500" />
              Trust Leaderboard
            </h2>
          </div>
          <div className="card overflow-hidden">
            {leaders.map((l, i) => (
              <div
                key={l.id}
                className={`flex items-center gap-3 px-4 py-3 ${i < leaders.length - 1 ? 'border-b border-neutral-100' : ''}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  i === 0 ? 'bg-accent-100 text-accent-700' :
                  i === 1 ? 'bg-neutral-200 text-neutral-700' :
                  i === 2 ? 'bg-amber-100 text-amber-700' :
                  'bg-neutral-100 text-neutral-500'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-neutral-800 truncate">{l.full_name}</p>
                  <p className="text-xs text-neutral-500">{l.trust_level}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-sm text-primary-600">{l.trust_score}</p>
                  <p className="text-[10px] text-neutral-400">pts</p>
                </div>
                {l.is_verified && (
                  <ShieldCheck className="w-4 h-4 text-secondary-500 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Safety Banner */}
        <div className="px-5 mt-6">
          <button
            onClick={() => navigate('/safety-tips')}
            className="w-full bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-2xl p-4 flex items-center gap-3 active:scale-[0.98] transition-transform"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div className="text-left flex-1">
              <p className="font-semibold text-white text-sm">Stay Safe</p>
              <p className="text-secondary-100 text-xs">Read safety tips & find collection points</p>
            </div>
            <ChevronRight className="w-5 h-5 text-white/60" />
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

function StatCard({ icon, value, label, color }: { icon: React.ReactNode; value: string | number; label: string; color: string }) {
  return (
    <div className="card p-3 text-center">
      <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mx-auto mb-1.5`}>
        {icon}
      </div>
      <p className="font-display font-bold text-xl text-neutral-800">{value}</p>
      <p className="text-[10px] text-neutral-500 font-medium">{label}</p>
    </div>
  );
}

function QuickActionCard({ icon, title, subtitle, color, onClick }: {
  icon: React.ReactNode; title: string; subtitle: string; color: string; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl p-4 text-left bg-gradient-to-br ${color} active:scale-95 transition-transform shadow-sm`}
    >
      <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full" />
      <div className="relative">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white mb-2">
          {icon}
        </div>
        <p className="font-display font-bold text-white text-sm">{title}</p>
        <p className="text-white/70 text-xs">{subtitle}</p>
      </div>
    </button>
  );
}

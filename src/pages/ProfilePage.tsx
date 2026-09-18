import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { BottomNav } from '@/components/Navigation';
import { Profile, LostItem, FoundItem, Reward, RewardRedemption, BADGE_INFO, TRUST_LEVELS } from '@/types';
import { CategoryIcon } from '@/components/CategoryIcon';
import {
  Award, Trophy, Gift, ShieldCheck, Settings, LogOut, ChevronRight,
  PackageX, PackageCheck, Star, Coins, ShoppingBag, X, Check, Bell, FileText,
} from 'lucide-react';

export function ProfilePage() {
  const navigate = useNavigate();
  const { profile, user, signOut, refreshProfile } = useAuth();
  const [myLost, setMyLost] = useState<LostItem[]>([]);
  const [myFound, setMyFound] = useState<FoundItem[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [myRedemptions, setMyRedemptions] = useState<RewardRedemption[]>([]);
  const [showRewards, setShowRewards] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<'lost' | 'found'>('lost');
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    if (!user) return;
    async function load() {
      const [lostR, foundR, rewardsR, redemptionsR] = await Promise.all([
        supabase.from('lost_items').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }),
        supabase.from('found_items').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }),
        supabase.from('rewards').select('*').order('points_cost', { ascending: true }),
        supabase.from('reward_redemptions').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }),
      ]);
      setMyLost((lostR.data ?? []) as LostItem[]);
      setMyFound((foundR.data ?? []) as FoundItem[]);
      setRewards((rewardsR.data ?? []) as Reward[]);
      setMyRedemptions((redemptionsR.data ?? []) as RewardRedemption[]);
      setLoading(false);
    }
    load();
  }, [user]);

  const handleRedeem = async (reward: Reward) => {
    if (!profile || !user) return;
    if (profile.points_balance < reward.points_cost) return;
    setRedeeming(true);
    await supabase.from('reward_redemptions').insert({
      user_id: user.id,
      reward_id: reward.id,
      points_spent: reward.points_cost,
      status: 'claimed',
    });
    await supabase.from('profiles').update({
      points_balance: profile.points_balance - reward.points_cost,
    }).eq('id', user.id);
    await refreshProfile();
    const { data: newRedemptions } = await supabase.from('reward_redemptions').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    setMyRedemptions((newRedemptions ?? []) as RewardRedemption[]);
    setRedeeming(false);
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  const trustLevel = TRUST_LEVELS[profile.trust_level as keyof typeof TRUST_LEVELS] ?? TRUST_LEVELS['Bronze Helper'];
  const nextLevelEntry = Object.entries(TRUST_LEVELS).find(([, v]) => v.min > profile.trust_score);
  const nextLevel = nextLevelEntry ? nextLevelEntry[0] : null;
  const nextLevelMin = nextLevelEntry ? nextLevelEntry[1].min : null;
  const progressPercent = nextLevelMin ? Math.min(100, (profile.trust_score / nextLevelMin) * 100) : 100;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-md mx-auto pb-24">
        {/* Header */}
        <div className="bg-gradient-to-b from-primary-600 to-primary-700 px-5 pt-10 pb-6 rounded-b-3xl">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-white font-display font-bold text-lg">My Profile</h1>
            <button onClick={() => setShowSettings(true)} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white font-display font-bold text-3xl border-4 border-white/30">
              {profile.full_name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <h2 className="font-display font-bold text-xl text-white">{profile.full_name}</h2>
                {profile.is_verified && <ShieldCheck className="w-5 h-5 text-secondary-300" />}
              </div>
              <div className={`inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${trustLevel.color} text-white`}>
                <Trophy className="w-3.5 h-3.5" />
                {profile.trust_level}
              </div>
              <p className="text-primary-100 text-xs mt-1.5">
                <Star className="w-3 h-3 inline mr-1" />
                {profile.trust_score} trust points
              </p>
            </div>
          </div>

          {/* Progress to next level */}
          {nextLevel && (
            <div className="mt-4">
              <div className="flex justify-between text-[10px] text-primary-100 mb-1">
                <span>{profile.trust_level}</span>
                <span>{nextLevel} ({nextLevelMin! - profile.trust_score} to go)</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-accent-400 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="px-5 -mt-4">
          <div className="grid grid-cols-3 gap-3">
            <StatBox icon={<Trophy className="w-5 h-5" />} value={profile.trust_score} label="Trust Points" color="bg-accent-50 text-accent-600" />
            <StatBox icon={<Coins className="w-5 h-5" />} value={profile.points_balance} label="Reward Points" color="bg-secondary-50 text-secondary-600" />
            <StatBox icon={<PackageCheck className="w-5 h-5" />} value={myLost.length + myFound.length} label="Total Reports" color="bg-primary-50 text-primary-600" />
          </div>
        </div>

        {/* Badges */}
        <div className="px-5 mt-6">
          <h2 className="font-display font-bold text-base text-neutral-800 mb-3">Badges Earned</h2>
          <div className="grid grid-cols-2 gap-3">
            {profile.badges.map((badge) => {
              const info = BADGE_INFO[badge];
              return (
                <div key={badge} className="card p-4 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-accent-100 flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-accent-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-neutral-800 truncate">{badge}</p>
                    <p className="text-[10px] text-neutral-500 truncate">{info?.description ?? 'Special achievement'}</p>
                  </div>
                </div>
              );
            })}
            {profile.badges.length === 0 && (
              <div className="col-span-2 card p-6 text-center">
                <Award className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                <p className="text-sm text-neutral-400">No badges yet. Help recover items to earn badges!</p>
              </div>
            )}
          </div>
        </div>

        {/* Rewards Marketplace */}
        <div className="px-5 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-base text-neutral-800 flex items-center gap-2">
              <Gift className="w-5 h-5 text-accent-500" />
              Rewards Marketplace
            </h2>
            <button onClick={() => setShowRewards(true)} className="text-primary-600 text-xs font-semibold">View all</button>
          </div>
          <div className="card p-4 bg-gradient-to-br from-accent-50 to-accent-100">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-accent-800 font-medium">Your Points Balance</p>
                <p className="font-display font-bold text-2xl text-accent-900">{profile.points_balance}</p>
              </div>
              <Coins className="w-10 h-10 text-accent-600" />
            </div>
            <button onClick={() => setShowRewards(true)} className="w-full bg-accent-500 text-neutral-900 font-semibold py-2.5 rounded-xl text-sm active:scale-95 transition-transform">
              Redeem Rewards
            </button>
          </div>
        </div>

        {/* My Reports */}
        <div className="px-5 mt-6">
          <h2 className="font-display font-bold text-base text-neutral-800 mb-3">My Reports</h2>
          <div className="flex bg-neutral-100 rounded-xl p-1 mb-3">
            <button
              onClick={() => setActiveTab('lost')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'lost' ? 'bg-white text-error-600 shadow-sm' : 'text-neutral-500'}`}
            >
              Lost ({myLost.length})
            </button>
            <button
              onClick={() => setActiveTab('found')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'found' ? 'bg-white text-success-600 shadow-sm' : 'text-neutral-500'}`}
            >
              Found ({myFound.length})
            </button>
          </div>

          {loading ? (
            <div className="card p-6 text-center text-sm text-neutral-400">Loading...</div>
          ) : activeTab === 'lost' ? (
            myLost.length === 0 ? (
              <div className="card p-6 text-center">
                <PackageX className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                <p className="text-sm text-neutral-400">No lost items reported yet</p>
                <button onClick={() => navigate('/report-lost')} className="btn-primary mt-3">Report Lost Item</button>
              </div>
            ) : (
              <div className="space-y-2">
                {myLost.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => navigate(`/item/lost/${item.id}`)}
                    className="card p-3 w-full text-left flex items-center gap-3 active:scale-[0.98] transition-transform"
                  >
                    <div className="w-10 h-10 rounded-xl bg-error-50 flex items-center justify-center flex-shrink-0">
                      <CategoryIcon category={item.category} size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-neutral-800 truncate">{item.item_name}</p>
                      <p className="text-xs text-neutral-500 truncate">{item.last_seen_location}</p>
                    </div>
                    <span className={`badge ${item.status === 'active' ? 'badge-error' : 'badge-success'}`}>
                      {item.status === 'active' ? 'Active' : 'Found'}
                    </span>
                  </button>
                ))}
              </div>
            )
          ) : (
            myFound.length === 0 ? (
              <div className="card p-6 text-center">
                <PackageCheck className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                <p className="text-sm text-neutral-400">No found items reported yet</p>
                <button onClick={() => navigate('/report-found')} className="btn-primary mt-3">Report Found Item</button>
              </div>
            ) : (
              <div className="space-y-2">
                {myFound.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => navigate(`/item/found/${item.id}`)}
                    className="card p-3 w-full text-left flex items-center gap-3 active:scale-[0.98] transition-transform"
                  >
                    <div className="w-10 h-10 rounded-xl bg-success-50 flex items-center justify-center flex-shrink-0">
                      <CategoryIcon category={item.category} size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-neutral-800 truncate">{item.item_name}</p>
                      <p className="text-xs text-neutral-500 truncate">{item.found_location}</p>
                    </div>
                    <span className={`badge ${item.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>
                      {item.status === 'active' ? 'Active' : 'Returned'}
                    </span>
                  </button>
                ))}
              </div>
            )
          )}
        </div>

        {/* Quick Links */}
        <div className="px-5 mt-6 space-y-2">
          <LinkRow icon={<ShieldCheck className="w-5 h-5" />} label="Safety Tips" onClick={() => navigate('/safety-tips')} color="text-secondary-600" />
          <LinkRow icon={<ShoppingBag className="w-5 h-5" />} label="Collection Points" onClick={() => navigate('/collection-points')} color="text-primary-600" />
          <LinkRow icon={<Bell className="w-5 h-5" />} label="Recovery Stories" onClick={() => navigate('/recoveries')} color="text-accent-600" />
          <LinkRow icon={<FileText className="w-5 h-5" />} label="Download Presentation" onClick={() => navigate('/presentation')} color="text-secondary-600" />
        </div>
      </div>

      {/* Rewards Modal */}
      {showRewards && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 animate-fade-in" onClick={() => setShowRewards(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-white px-5 pt-4 pb-3 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="font-display font-bold text-lg text-neutral-800">Rewards Marketplace</h2>
              <button onClick={() => setShowRewards(false)} className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center">
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>
            <div className="px-5 py-4">
              <div className="bg-accent-50 rounded-xl p-3 mb-4 flex items-center gap-3">
                <Coins className="w-8 h-8 text-accent-600" />
                <div>
                  <p className="text-xs text-accent-800">Available Points</p>
                  <p className="font-bold text-xl text-accent-900">{profile.points_balance}</p>
                </div>
              </div>

              {/* My Redemptions */}
              {myRedemptions.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-neutral-500 uppercase mb-2">Your Redemptions</p>
                  <div className="space-y-2">
                    {myRedemptions.slice(0, 3).map((r) => {
                      const reward = rewards.find((rw) => rw.id === r.reward_id);
                      return (
                        <div key={r.id} className="flex items-center gap-3 bg-neutral-50 rounded-xl p-3">
                          <Check className="w-5 h-5 text-success-500" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-neutral-800">{reward?.name ?? 'Reward'}</p>
                            <p className="text-xs text-neutral-400">{r.points_spent} points · {new Date(r.created_at).toLocaleDateString('en-ZA')}</p>
                          </div>
                          <span className="badge-success">Claimed</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {rewards.map((reward) => {
                  const canAfford = profile.points_balance >= reward.points_cost;
                  return (
                    <div key={reward.id} className={`card p-4 ${!canAfford ? 'opacity-60' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center flex-shrink-0">
                          <Gift className="w-6 h-6 text-accent-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-neutral-800">{reward.name}</p>
                          <p className="text-xs text-neutral-500">{reward.description}</p>
                          {reward.partner && <p className="text-[10px] text-neutral-400 mt-0.5">Partner: {reward.partner}</p>}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="badge-accent">
                          <Coins className="w-3 h-3" />
                          {reward.points_cost} points
                        </span>
                        <button
                          onClick={() => handleRedeem(reward)}
                          disabled={!canAfford || redeeming}
                          className={canAfford ? 'btn-accent !py-2 !px-4 text-xs' : 'btn-outline !py-2 !px-4 text-xs opacity-50'}
                        >
                          {canAfford ? 'Redeem' : 'Not enough points'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 animate-fade-in" onClick={() => setShowSettings(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl max-h-[70vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-white px-5 pt-4 pb-3 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="font-display font-bold text-lg text-neutral-800">Account Settings</h2>
              <button onClick={() => setShowSettings(false)} className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center">
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div className="card p-4">
                <p className="text-xs font-semibold text-neutral-500 uppercase mb-2">Account Info</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-neutral-500">Name</span><span className="font-medium text-neutral-800">{profile.full_name}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-500">Email</span><span className="font-medium text-neutral-800 text-xs">{user?.email}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-500">Phone</span><span className="font-medium text-neutral-800">{profile.phone ?? 'Not set'}</span></div>
                </div>
              </div>

              <div className="card p-4">
                <p className="text-xs font-semibold text-neutral-500 uppercase mb-2">Verification Status</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Email Verified</span>
                    {profile.email_verified ? <Check className="w-4 h-4 text-success-500" /> : <X className="w-4 h-4 text-neutral-300" />}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Phone Verified</span>
                    {profile.phone_verified ? <Check className="w-4 h-4 text-success-500" /> : <X className="w-4 h-4 text-neutral-300" />}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Verified Badge</span>
                    {profile.is_verified ? <ShieldCheck className="w-4 h-4 text-secondary-500" /> : <X className="w-4 h-4 text-neutral-300" />}
                  </div>
                </div>
              </div>

              <button
                onClick={async () => { await signOut(); navigate('/'); }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-error-50 text-error-600 font-semibold text-sm active:scale-95 transition-transform"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}

      <BottomNav />
    </div>
  );
}

function StatBox({ icon, value, label, color }: { icon: React.ReactNode; value: number; label: string; color: string }) {
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

function LinkRow({ icon, label, onClick, color }: { icon: React.ReactNode; label: string; onClick: () => void; color: string }) {
  return (
    <button onClick={onClick} className="card p-4 w-full flex items-center gap-3 active:scale-[0.98] transition-transform">
      <div className={`w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <span className="flex-1 text-left font-medium text-sm text-neutral-700">{label}</span>
      <ChevronRight className="w-5 h-5 text-neutral-300" />
    </button>
  );
}

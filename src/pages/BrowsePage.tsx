import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { BottomNav } from '@/components/Navigation';
import { CATEGORIES } from '@/types';
import { CategoryIcon, CategoryBadge } from '@/components/CategoryIcon';
import { LostItem, FoundItem, Profile } from '@/types';
import { Search, SlidersHorizontal, Gift, MapPin, Calendar, X } from 'lucide-react';

type Tab = 'lost' | 'found';

export function BrowsePage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('lost');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState('');
  const [rewardOnly, setRewardOnly] = useState(false);
  const [lostItems, setLostItems] = useState<(LostItem & { reporter?: Profile })[]>([]);
  const [foundItems, setFoundItems] = useState<(FoundItem & { reporter?: Profile })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [lostR, foundR] = await Promise.all([
        supabase.from('lost_items').select('*').order('created_at', { ascending: false }),
        supabase.from('found_items').select('*').order('created_at', { ascending: false }),
      ]);

      const lostData = (lostR.data ?? []) as LostItem[];
      const foundData = (foundR.data ?? []) as FoundItem[];

      const allUserIds = [...new Set([...lostData.map(d => d.user_id), ...foundData.map(d => d.user_id)])];
      let userMap: Record<string, Profile> = {};
      if (allUserIds.length > 0) {
        const { data: users } = await supabase.from('profiles').select('*').in('id', allUserIds);
        userMap = Object.fromEntries((users as Profile[] ?? []).map(u => [u.id, u]));
      }

      setLostItems(lostData.map(d => ({ ...d, reporter: userMap[d.user_id] })));
      setFoundItems(foundData.map(d => ({ ...d, reporter: userMap[d.user_id] })));
      setLoading(false);
    }
    load();
  }, []);

  const filteredItems = useMemo(() => {
    const source = tab === 'lost' ? lostItems : foundItems;
    return source.filter((item) => {
      if (search && !item.item_name.toLowerCase().includes(search.toLowerCase()) &&
          !(item.description?.toLowerCase().includes(search.toLowerCase()))) return false;
      if (categoryFilter && item.category !== categoryFilter) return false;
      if (locationFilter) {
        const loc = tab === 'lost' ? (item as LostItem).last_seen_location : (item as FoundItem).found_location;
        if (!loc?.toLowerCase().includes(locationFilter.toLowerCase())) return false;
      }
      if (rewardOnly && tab === 'lost' && (item as LostItem).reward_offered <= 0) return false;
      return true;
    });
  }, [tab, lostItems, foundItems, search, categoryFilter, locationFilter, rewardOnly]);

  const clearFilters = () => {
    setCategoryFilter(null);
    setLocationFilter('');
    setRewardOnly(false);
  };

  const activeFilterCount = (categoryFilter ? 1 : 0) + (locationFilter ? 1 : 0) + (rewardOnly ? 1 : 0);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-md mx-auto pb-24">
        {/* Header */}
        <div className="bg-white border-b border-neutral-100 sticky top-0 z-20">
          <div className="px-5 pt-6 pb-3">
            <h1 className="font-display font-bold text-xl text-neutral-800 mb-3">Browse Items</h1>

            {/* Search */}
            <div className="relative">
              <Search className="w-5 h-5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or description..."
                className="input pl-11 pr-11"
              />
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 relative"
              >
                <SlidersHorizontal className="w-5 h-5" />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Tabs */}
            <div className="flex bg-neutral-100 rounded-xl p-1 mt-3">
              <button
                onClick={() => setTab('lost')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  tab === 'lost' ? 'bg-white text-error-600 shadow-sm' : 'text-neutral-500'
                }`}
              >
                Lost Items
              </button>
              <button
                onClick={() => setTab('found')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  tab === 'found' ? 'bg-white text-success-600 shadow-sm' : 'text-neutral-500'
                }`}
              >
                Found Items
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="px-5 pb-4 border-t border-neutral-100 pt-3 animate-slide-down">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm text-neutral-700">Filters</h3>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="text-xs text-error-500 font-medium flex items-center gap-1">
                    <X className="w-3 h-3" /> Clear all
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-3">
                <p className="text-xs text-neutral-500 mb-1.5">Category</p>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(categoryFilter === cat ? null : cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        categoryFilter === cat
                          ? 'bg-primary-500 text-white'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div className="mb-3">
                <p className="text-xs text-neutral-500 mb-1.5">Location</p>
                <input
                  type="text"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  placeholder="e.g. Johannesburg, Cape Town..."
                  className="input"
                />
              </div>

              {/* Reward Filter (lost only) */}
              {tab === 'lost' && (
                <div>
                  <button
                    onClick={() => setRewardOnly(!rewardOnly)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      rewardOnly ? 'bg-accent-100 text-accent-700' : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    <Gift className="w-4 h-4" />
                    Reward offered only
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="px-5 pt-4 space-y-3">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card p-4 animate-pulse">
                  <div className="flex gap-3">
                    <div className="w-14 h-14 bg-neutral-100 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-neutral-100 rounded w-3/4" />
                      <div className="h-3 bg-neutral-100 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="card p-8 text-center mt-4">
              <Search className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-neutral-600">No items found</p>
              <p className="text-xs text-neutral-400 mt-1">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                type={tab}
                onClick={() => navigate(`/item/${tab}/${item.id}`)}
              />
            ))
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

function ItemCard({ item, type, onClick }: { item: LostItem | FoundItem; type: Tab; onClick: () => void }) {
  const isLost = type === 'lost';
  const location = isLost ? (item as LostItem).last_seen_location : (item as FoundItem).found_location;
  const date = isLost ? (item as LostItem).date_lost : (item as FoundItem).date_found;
  const reward = isLost ? (item as LostItem).reward_offered : 0;

  return (
    <button
      onClick={onClick}
      className="card p-4 w-full text-left active:scale-[0.98] transition-transform hover:shadow-md"
    >
      <div className="flex gap-3">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isLost ? 'bg-error-50' : 'bg-success-50'
        }`}>
          <CategoryIcon category={item.category} size={26} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm text-neutral-800 truncate">{item.item_name}</h3>
            <span className={`badge flex-shrink-0 ${isLost ? 'badge-error' : 'badge-success'}`}>
              {isLost ? 'Lost' : 'Found'}
            </span>
          </div>
          <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">{item.description}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-neutral-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span className="truncate max-w-[120px]">{location}</span>
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
            </span>
          </div>
          {reward > 0 && (
            <div className="mt-2">
              <span className="badge-accent">
                <Gift className="w-3 h-3" />
                R{reward} reward
              </span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

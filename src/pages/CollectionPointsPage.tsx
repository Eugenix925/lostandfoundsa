import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PageContainer, TopBar } from '@/components/Navigation';
import { CollectionPoint } from '@/types';
import {
  ShieldCheck, MapPin, Clock, Phone, Search, Building2, GraduationCap,
  ShoppingBag, Users, Landmark,
} from 'lucide-react';

const TYPE_ICONS: Record<string, typeof ShieldCheck> = {
  'Police Station': ShieldCheck,
  'University': GraduationCap,
  'School': GraduationCap,
  'Shopping Centre': ShoppingBag,
  'Community Centre': Users,
};

const TYPE_COLORS: Record<string, string> = {
  'Police Station': 'bg-secondary-100 text-secondary-600',
  'University': 'bg-primary-100 text-primary-600',
  'School': 'bg-primary-100 text-primary-600',
  'Shopping Centre': 'bg-accent-100 text-accent-700',
  'Community Centre': 'bg-purple-100 text-purple-600',
};

export function CollectionPointsPage() {
  const [points, setPoints] = useState<CollectionPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('collection_points').select('*').order('city', { ascending: true });
      setPoints((data ?? []) as CollectionPoint[]);
      setLoading(false);
    }
    load();
  }, []);

  const types = [...new Set(points.map((p) => p.type))];
  const filtered = points.filter((p) => {
    if (search) {
      const q = search.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.city.toLowerCase().includes(q) && !p.province.toLowerCase().includes(q)) return false;
    }
    if (typeFilter && p.type !== typeFilter) return false;
    return true;
  });

  return (
    <PageContainer>
      <TopBar title="Collection Points" showBack />

      <div className="px-5 pt-4 space-y-4">
        <div className="bg-secondary-50 border border-secondary-100 rounded-xl p-3 flex items-start gap-2">
          <ShieldCheck className="w-5 h-5 text-secondary-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-secondary-800">
            These are verified, safe locations where you can meet to hand over found items. Always prefer these over private meetings.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-5 h-5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by city or name..."
            className="input pl-11"
          />
        </div>

        {/* Type Filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setTypeFilter(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium flex-shrink-0 transition-all ${typeFilter === null ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-600'}`}
          >
            All Types
          </button>
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(typeFilter === t ? null : t)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium flex-shrink-0 transition-all ${typeFilter === t ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-600'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Points */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-4 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-neutral-100 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-neutral-100 rounded w-3/4" />
                    <div className="h-3 bg-neutral-100 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-8 text-center">
            <MapPin className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
            <p className="text-sm text-neutral-400">No collection points found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((p) => {
              const Icon = TYPE_ICONS[p.type] ?? Landmark;
              const color = TYPE_COLORS[p.type] ?? 'bg-neutral-100 text-neutral-600';
              return (
                <div key={p.id} className="card p-4 animate-fade-in">
                  <div className="flex gap-3">
                    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-sm text-neutral-800">{p.name}</h3>
                        {p.verified && <ShieldCheck className="w-4 h-4 text-secondary-500 flex-shrink-0" />}
                      </div>
                      <span className="badge-neutral mt-1">{p.type}</span>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-start gap-1.5 text-xs text-neutral-500">
                          <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                          <span>{p.address}, {p.city}, {p.province}</span>
                        </div>
                        {p.hours && (
                          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{p.hours}</span>
                          </div>
                        )}
                        {p.phone && (
                          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                            <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{p.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageContainer>
  );
}

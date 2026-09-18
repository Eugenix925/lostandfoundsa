export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  phone: string | null;
  trust_score: number;
  points_balance: number;
  trust_level: string;
  badges: string[];
  email_verified: boolean;
  phone_verified: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface VerificationQuestion {
  question: string;
  answer: string;
}

export interface LostItem {
  id: string;
  user_id: string;
  item_name: string;
  category: string;
  description: string | null;
  photo_urls: string[];
  date_lost: string;
  last_seen_location: string | null;
  reward_offered: number;
  verification_questions: VerificationQuestion[];
  status: string;
  created_at: string;
}

export interface FoundItem {
  id: string;
  user_id: string;
  item_name: string;
  category: string;
  description: string | null;
  photo_urls: string[];
  date_found: string;
  found_location: string | null;
  status: string;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  item_id: string | null;
  item_type: string | null;
  body: string;
  read_at: string | null;
  created_at: string;
}

export interface CollectionPoint {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  province: string;
  latitude: number | null;
  longitude: number | null;
  hours: string;
  phone: string;
  verified: boolean;
  created_at: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string | null;
  points_cost: number;
  category: string;
  partner: string | null;
  icon: string | null;
  created_at: string;
}

export interface RewardRedemption {
  id: string;
  user_id: string;
  reward_id: string;
  points_spent: number;
  status: string;
  created_at: string;
}

export interface UserReport {
  id: string;
  reporter_id: string;
  reported_user_id: string | null;
  item_id: string | null;
  item_type: string | null;
  reason: string;
  description: string | null;
  status: string;
  created_at: string;
}

export interface Recovery {
  id: string;
  lost_item_id: string | null;
  found_item_id: string | null;
  owner_id: string;
  finder_id: string;
  item_name: string;
  category: string;
  points_awarded: number;
  story: string | null;
  created_at: string;
}

export const CATEGORIES = [
  'Phones',
  'Wallets',
  'IDs',
  'Bank Cards',
  'Laptops',
  'Keys',
  'Backpacks',
  'Electronics',
  'Clothing',
  'Documents',
  'Other',
] as const;

export const TRUST_LEVELS = {
  'Bronze Helper': { min: 0, color: 'from-amber-600 to-amber-800', icon: 'Bronze' },
  'Silver Helper': { min: 500, color: 'from-gray-400 to-gray-600', icon: 'Silver' },
  'Gold Helper': { min: 1000, color: 'from-yellow-400 to-yellow-600', icon: 'Gold' },
  'Community Hero': { min: 1500, color: 'from-primary-400 to-primary-600', icon: 'Hero' },
} as const;

export const BADGE_INFO: Record<string, { description: string; color: string }> = {
  'Honest Helper': { description: 'Returned your first item', color: 'bg-primary-100 text-primary-700' },
  'Trusted Finder': { description: 'Returned 3+ items successfully', color: 'bg-secondary-100 text-secondary-700' },
  'Community Hero': { description: 'Reached Community Hero trust level', color: 'bg-accent-100 text-accent-700' },
  'Top Contributor': { description: 'Among the top community members', color: 'bg-purple-100 text-purple-700' },
};

export const POINTS_BY_CATEGORY: Record<string, number> = {
  'IDs': 50,
  'Wallets': 100,
  'Phones': 200,
  'Laptops': 500,
  'Bank Cards': 50,
  'Keys': 50,
  'Backpacks': 100,
  'Electronics': 150,
  'Clothing': 50,
  'Documents': 50,
  'Other': 50,
};

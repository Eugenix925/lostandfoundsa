/*
# Lost & Found SA — Core Schema

## Overview
Creates the full database for a community lost & found platform with auth, profiles,
item reports (lost + found), messaging, collection points, rewards, reports, and recovery stories.

## Tables Created
1. **profiles** — user display data (name, avatar, trust score, points, trust level, badges, verification)
2. **lost_items** — lost item reports with category, photos, location, reward, verification questions, status
3. **found_items** — found item reports with category, photos, location, status
4. **messages** — in-app messages between users (no phone/email sharing)
5. **collection_points** — verified safe handover locations
6. **rewards** — marketplace rewards that users can redeem with points
7. **reward_redemptions** — records of points redeemed for rewards
8. **user_reports** — reports of suspicious activity, fraud, harassment
9. **recoveries** — successful recovery stories (links lost + found items)

## Security
- RLS enabled on every table
- Owner-scoped policies using auth.uid() for user-owned data
- Public read on collection_points, rewards, recoveries (community-visible content)
- All policies scoped TO authenticated (app has sign-in)
*/

-- ============= PROFILES =============
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  avatar_url text,
  phone text,
  trust_score int NOT NULL DEFAULT 0,
  points_balance int NOT NULL DEFAULT 0,
  trust_level text NOT NULL DEFAULT 'Bronze Helper',
  badges text[] NOT NULL DEFAULT '{}',
  email_verified boolean NOT NULL DEFAULT false,
  phone_verified boolean NOT NULL DEFAULT false,
  is_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "read_all_profiles" ON profiles;
CREATE POLICY "read_all_profiles" ON profiles FOR SELECT
  TO authenticated USING (true);

-- ============= LOST ITEMS =============
CREATE TABLE IF NOT EXISTS lost_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  item_name text NOT NULL,
  category text NOT NULL DEFAULT 'Other',
  description text,
  photo_urls text[] NOT NULL DEFAULT '{}',
  date_lost date NOT NULL DEFAULT CURRENT_DATE,
  last_seen_location text,
  reward_offered int NOT NULL DEFAULT 0,
  verification_questions jsonb NOT NULL DEFAULT '[]',
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE lost_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_all_lost" ON lost_items;
CREATE POLICY "select_all_lost" ON lost_items FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_lost" ON lost_items;
CREATE POLICY "insert_own_lost" ON lost_items FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_lost" ON lost_items;
CREATE POLICY "update_own_lost" ON lost_items FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_lost" ON lost_items;
CREATE POLICY "delete_own_lost" ON lost_items FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_lost_items_category ON lost_items(category);
CREATE INDEX IF NOT EXISTS idx_lost_items_status ON lost_items(status);
CREATE INDEX IF NOT EXISTS idx_lost_items_user ON lost_items(user_id);

-- ============= FOUND ITEMS =============
CREATE TABLE IF NOT EXISTS found_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  item_name text NOT NULL,
  category text NOT NULL DEFAULT 'Other',
  description text,
  photo_urls text[] NOT NULL DEFAULT '{}',
  date_found date NOT NULL DEFAULT CURRENT_DATE,
  found_location text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE found_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_all_found" ON found_items;
CREATE POLICY "select_all_found" ON found_items FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_found" ON found_items;
CREATE POLICY "insert_own_found" ON found_items FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_found" ON found_items;
CREATE POLICY "update_own_found" ON found_items FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_found" ON found_items;
CREATE POLICY "delete_own_found" ON found_items FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_found_items_category ON found_items(category);
CREATE INDEX IF NOT EXISTS idx_found_items_status ON found_items(status);
CREATE INDEX IF NOT EXISTS idx_found_items_user ON found_items(user_id);

-- ============= MESSAGES =============
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id uuid,
  item_type text,
  body text NOT NULL,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_messages" ON messages;
CREATE POLICY "select_own_messages" ON messages FOR SELECT
  TO authenticated USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

DROP POLICY IF EXISTS "insert_own_messages" ON messages;
CREATE POLICY "insert_own_messages" ON messages FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "delete_own_messages" ON messages;
CREATE POLICY "delete_own_messages" ON messages FOR DELETE
  TO authenticated USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);

-- ============= COLLECTION POINTS =============
CREATE TABLE IF NOT EXISTS collection_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  province text NOT NULL,
  latitude float8,
  longitude float8,
  hours text,
  phone text,
  verified boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE collection_points ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_collection_points" ON collection_points;
CREATE POLICY "read_collection_points" ON collection_points FOR SELECT
  TO authenticated USING (true);

-- ============= REWARDS =============
CREATE TABLE IF NOT EXISTS rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  points_cost int NOT NULL,
  category text NOT NULL DEFAULT 'food',
  partner text,
  icon text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_rewards" ON rewards;
CREATE POLICY "read_rewards" ON rewards FOR SELECT
  TO authenticated USING (true);

-- ============= REWARD REDEMPTIONS =============
CREATE TABLE IF NOT EXISTS reward_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_id uuid NOT NULL REFERENCES rewards(id) ON DELETE CASCADE,
  points_spent int NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE reward_redemptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_redemptions" ON reward_redemptions;
CREATE POLICY "select_own_redemptions" ON reward_redemptions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_redemptions" ON reward_redemptions;
CREATE POLICY "insert_own_redemptions" ON reward_redemptions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- ============= USER REPORTS =============
CREATE TABLE IF NOT EXISTS user_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  reported_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id uuid,
  item_type text,
  reason text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_reports" ON user_reports;
CREATE POLICY "select_own_reports" ON user_reports FOR SELECT
  TO authenticated USING (auth.uid() = reporter_id);

DROP POLICY IF EXISTS "insert_own_reports" ON user_reports;
CREATE POLICY "insert_own_reports" ON user_reports FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = reporter_id);

-- ============= RECOVERIES =============
CREATE TABLE IF NOT EXISTS recoveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lost_item_id uuid REFERENCES lost_items(id) ON DELETE SET NULL,
  found_item_id uuid REFERENCES found_items(id) ON DELETE SET NULL,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  finder_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_name text NOT NULL,
  category text NOT NULL,
  points_awarded int NOT NULL DEFAULT 0,
  story text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE recoveries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_all_recoveries" ON recoveries;
CREATE POLICY "read_all_recoveries" ON recoveries FOR SELECT
  TO authenticated USING (true);

-- updated_at trigger for profiles
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

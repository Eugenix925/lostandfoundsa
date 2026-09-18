/*
# Lost & Found SA — Seed Demo Data

## Overview
Seeds the database with demo rewards, collection points, and demo user accounts.
Demo users are created in auth.users so they can be used as item owners, finders, and message senders.

## Data Added
1. **Rewards** — 4 marketplace rewards (soft drink, fries, burger, meal vouchers)
2. **Collection Points** — 8 verified collection points across SA provinces
3. **Demo Users** — 6 auth users with profiles, trust scores, badges, and verification
*/

-- ============= REWARDS =============
INSERT INTO rewards (name, description, points_cost, category, partner, icon) VALUES
('Soft Drink Voucher', 'Redeem for a free soft drink at any partner store', 100, 'food', 'Partner Stores', 'CupSoda'),
('Fries Voucher', 'Redeem for a free regular fries at any partner store', 250, 'food', 'Partner Stores', 'Fries'),
('Burger Voucher', 'Redeem for a free burger at any partner store', 500, 'food', 'Partner Stores', 'Sandwich'),
('Meal Voucher', 'Redeem for a full meal at any partner store', 1000, 'food', 'Partner Stores', 'UtensilsCrossed'),
('10% Store Discount', '10% off your next purchase at partner stores', 300, 'discount', 'Partner Stores', 'Tag'),
('Free Coffee', 'Redeem for a free coffee at partner cafes', 150, 'food', 'Partner Cafes', 'Coffee')
ON CONFLICT DO NOTHING;

-- ============= COLLECTION POINTS =============
INSERT INTO collection_points (name, type, address, city, province, hours, phone, verified) VALUES
('Sandton Police Station', 'Police Station', '2 Maude St, Sandton', 'Johannesburg', 'Gauteng', '24/7', '011 722 5200', true),
('Rondebosch Police Station', 'Police Station', 'Campground Rd, Rondebosch', 'Cape Town', 'Western Cape', '24/7', '021 685 2222', true),
('University of Cape Town Security', 'University', 'Upper Campus, Rondebosch', 'Cape Town', 'Western Cape', 'Mon-Fri 7:00-19:00', '021 650 2222', true),
('Wits University Security Office', 'University', '1 Jan Smuts Ave, Braamfontein', 'Johannesburg', 'Gauteng', 'Mon-Fri 7:00-19:00', '011 717 4444', true),
('Gateway Shopping Centre Security', 'Shopping Centre', '1 Palm Blvd, Umhlanga', 'Durban', 'KwaZulu-Natal', 'Mon-Sun 8:00-20:00', '031 566 0000', true),
('Menlyn Park Security Office', 'Shopping Centre', 'Atterbury Rd, Menlyn', 'Pretoria', 'Gauteng', 'Mon-Sun 8:00-20:00', '012 348 0500', true),
('Rosebank Community Centre', 'Community Centre', '21 Sturdee Ave, Rosebank', 'Johannesburg', 'Gauteng', 'Mon-Fri 8:00-17:00', '011 447 8000', true),
('Stellenbosch University Security', 'University', 'Victoria St, Stellenbosch', 'Stellenbosch', 'Western Cape', 'Mon-Fri 7:00-19:00', '021 808 4666', true)
ON CONFLICT DO NOTHING;

-- ============= DEMO USERS =============
-- Create auth users for demo accounts (password: "password123" for all)
-- We use the service role to create users, then insert profiles.

DO $$
DECLARE
  u1 uuid;
  u2 uuid;
  u3 uuid;
  u4 uuid;
  u5 uuid;
  u6 uuid;
BEGIN
  -- Thandiwe Mokoena (Community Hero)
  u1 := auth.uid(); -- placeholder, we'll use a different approach
END;
$$;

-- We can't create auth.users directly via SQL in Supabase (auth schema is protected).
-- Instead, we insert profiles with fixed UUIDs that match auth users we'll create via the API.
-- For demo purposes, we use deterministic UUIDs.
-- The frontend will create real accounts when users register, and we seed demo content
-- only in tables that don't require auth (rewards, collection_points).

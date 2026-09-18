/*
# Lost & Found SA — Create Demo Users & Seed All Demo Data

## Overview
Creates 6 demo auth users with hashed passwords, then seeds their profiles, 
15 lost items, 15 found items, messages, and recovery stories.

## Demo Users (password: password123 for all)
1. thandiwe@lostandfound.co.za — Community Hero
2. sipho@lostandfound.co.za — Gold Helper
3. amara@lostandfound.co.za — Silver Helper
4. lebo@lostandfound.co.za — Silver Helper
5. jabu@lostandfound.co.za — Bronze Helper
6. nomsa@lostandfound.co.za — Bronze Helper
*/

DO $$
DECLARE
  u1 uuid;
  u2 uuid;
  u3 uuid;
  u4 uuid;
  u5 uuid;
  u6 uuid;
BEGIN
  -- Thandiwe Mokoena
  u1 := gen_random_uuid();
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, role, aud, instance_id)
  SELECT u1, 'thandiwe@lostandfound.co.za', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Thandiwe Mokoena"}', 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000'
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'thandiwe@lostandfound.co.za');

  -- Sipho Dlamini
  u2 := gen_random_uuid();
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, role, aud, instance_id)
  SELECT u2, 'sipho@lostandfound.co.za', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Sipho Dlamini"}', 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000'
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'sipho@lostandfound.co.za');

  -- Amara Naidoo
  u3 := gen_random_uuid();
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, role, aud, instance_id)
  SELECT u3, 'amara@lostandfound.co.za', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Amara Naidoo"}', 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000'
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'amara@lostandfound.co.za');

  -- Lebo Khumalo
  u4 := gen_random_uuid();
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, role, aud, instance_id)
  SELECT u4, 'lebo@lostandfound.co.za', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Lebo Khumalo"}', 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000'
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'lebo@lostandfound.co.za');

  -- Jabu Mthembu
  u5 := gen_random_uuid();
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, role, aud, instance_id)
  SELECT u5, 'jabu@lostandfound.co.za', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Jabu Mthembu"}', 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000'
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'jabu@lostandfound.co.za');

  -- Nomsa Zulu
  u6 := gen_random_uuid();
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, role, aud, instance_id)
  SELECT u6, 'nomsa@lostandfound.co.za', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nomsa Zulu"}', 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000'
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'nomsa@lostandfound.co.za');

  -- Get the actual IDs
  SELECT id INTO u1 FROM auth.users WHERE email = 'thandiwe@lostandfound.co.za';
  SELECT id INTO u2 FROM auth.users WHERE email = 'sipho@lostandfound.co.za';
  SELECT id INTO u3 FROM auth.users WHERE email = 'amara@lostandfound.co.za';
  SELECT id INTO u4 FROM auth.users WHERE email = 'lebo@lostandfound.co.za';
  SELECT id INTO u5 FROM auth.users WHERE email = 'jabu@lostandfound.co.za';
  SELECT id INTO u6 FROM auth.users WHERE email = 'nomsa@lostandfound.co.za';

  -- Insert profiles
  INSERT INTO profiles (id, full_name, avatar_url, trust_score, points_balance, trust_level, badges, email_verified, phone_verified, is_verified)
  VALUES
    (u1, 'Thandiwe Mokoena', NULL, 1850, 350, 'Community Hero', ARRAY['Honest Helper','Trusted Finder','Community Hero','Top Contributor'], true, true, true),
    (u2, 'Sipho Dlamini', NULL, 1200, 200, 'Gold Helper', ARRAY['Honest Helper','Trusted Finder'], true, false, true),
    (u3, 'Amara Naidoo', NULL, 750, 50, 'Silver Helper', ARRAY['Honest Helper'], true, false, true),
    (u4, 'Lebo Khumalo', NULL, 650, 100, 'Silver Helper', ARRAY['Honest Helper'], true, true, true),
    (u5, 'Jabu Mthembu', NULL, 300, 0, 'Bronze Helper', ARRAY['Honest Helper'], true, false, false),
    (u6, 'Nomsa Zulu', NULL, 250, 50, 'Bronze Helper', ARRAY['Honest Helper'], true, false, false)
  ON CONFLICT (id) DO NOTHING;

  -- 15 Lost Items
  INSERT INTO lost_items (user_id, item_name, category, description, photo_urls, date_lost, last_seen_location, reward_offered, verification_questions, status, created_at)
  SELECT u1, 'Samsung Galaxy S23', 'Phones', 'Black Samsung Galaxy S23 with a clear phone case. Has a small crack on the bottom left corner. Contains photos of my children.', ARRAY[]::text[], '2026-09-15', 'Sandton City Mall, Johannesburg', 200, '[{"question":"What colour is the phone case?","answer":"Clear"},{"question":"What is the lock screen wallpaper?","answer":"Photo of children"}]', 'active', now() - interval '3 days'
  WHERE NOT EXISTS (SELECT 1 FROM lost_items WHERE item_name = 'Samsung Galaxy S23' AND user_id = u1);

  INSERT INTO lost_items (user_id, item_name, category, description, photo_urls, date_lost, last_seen_location, reward_offered, verification_questions, status, created_at)
  SELECT u2, 'Brown Leather Wallet', 'Wallets', 'Brown leather wallet with initials "SD" embossed. Contains ID card, bank cards, and some cash.', ARRAY[]::text[], '2026-09-16', 'Menlyn Park Shopping Centre, Pretoria', 100, '[{"question":"What initials are on the wallet?","answer":"SD"},{"question":"What colour is the wallet?","answer":"Brown leather"}]', 'active', now() - interval '2 days'
  WHERE NOT EXISTS (SELECT 1 FROM lost_items WHERE item_name = 'Brown Leather Wallet' AND user_id = u2);

  INSERT INTO lost_items (user_id, item_name, category, description, photo_urls, date_lost, last_seen_location, reward_offered, verification_questions, status, created_at)
  SELECT u3, 'ID Book', 'IDs', 'Green ID book with name Amara Naidoo. Lost near the taxi rank.', ARRAY[]::text[], '2026-09-17', 'Bree Street Taxi Rank, Johannesburg', 50, '[{"question":"What is the ID number last 4 digits?","answer":"5821"}]', 'active', now() - interval '1 day'
  WHERE NOT EXISTS (SELECT 1 FROM lost_items WHERE item_name = 'ID Book' AND user_id = u3);

  INSERT INTO lost_items (user_id, item_name, category, description, photo_urls, date_lost, last_seen_location, reward_offered, verification_questions, status, created_at)
  SELECT u4, 'MacBook Pro 14"', 'Laptops', 'Space grey MacBook Pro 14 inch. Has a sticker of the South African flag on the lid. In a black sleeve.', ARRAY[]::text[], '2026-09-14', 'UCT Upper Campus, Cape Town', 500, '[{"question":"What sticker is on the laptop?","answer":"South African flag"},{"question":"What colour is the laptop?","answer":"Space grey"}]', 'active', now() - interval '4 days'
  WHERE NOT EXISTS (SELECT 1 FROM lost_items WHERE item_name = 'MacBook Pro 14"' AND user_id = u4);

  INSERT INTO lost_items (user_id, item_name, category, description, photo_urls, date_lost, last_seen_location, reward_offered, verification_questions, status, created_at)
  SELECT u5, 'House Keys with Blue Lanyard', 'Keys', 'Set of 3 house keys on a blue lanyard with "Wits University" printed on it.', ARRAY[]::text[], '2026-09-16', 'Wits University, Braamfontein', 0, '[{"question":"What is printed on the lanyard?","answer":"Wits University"}]', 'active', now() - interval '2 days'
  WHERE NOT EXISTS (SELECT 1 FROM lost_items WHERE item_name = 'House Keys with Blue Lanyard' AND user_id = u5);

  INSERT INTO lost_items (user_id, item_name, category, description, photo_urls, date_lost, last_seen_location, reward_offered, verification_questions, status, created_at)
  SELECT u1, 'Black Backpack', 'Backpacks', 'Black North Face backpack. Contains textbooks, a laptop charger, and a water bottle.', ARRAY[]::text[], '2026-09-13', 'Golden Arrow Bus, Cape Town', 50, '[{"question":"What brand is the backpack?","answer":"North Face"}]', 'active', now() - interval '5 days'
  WHERE NOT EXISTS (SELECT 1 FROM lost_items WHERE item_name = 'Black Backpack' AND user_id = u1);

  INSERT INTO lost_items (user_id, item_name, category, description, photo_urls, date_lost, last_seen_location, reward_offered, verification_questions, status, created_at)
  SELECT u3, 'FNB Bank Card', 'Bank Cards', 'FNB debit card with name A Naidoo. Lost at a petrol station.', ARRAY[]::text[], '2026-09-17', 'Engen Garage, Sea Point, Cape Town', 0, '[{"question":"What bank issued the card?","answer":"FNB"}]', 'active', now() - interval '1 day'
  WHERE NOT EXISTS (SELECT 1 FROM lost_items WHERE item_name = 'FNB Bank Card' AND user_id = u3);

  INSERT INTO lost_items (user_id, item_name, category, description, photo_urls, date_lost, last_seen_location, reward_offered, verification_questions, status, created_at)
  SELECT u2, 'Wireless Earbuds', 'Electronics', 'White Samsung Galaxy Buds in a small white charging case.', ARRAY[]::text[], '2026-09-12', 'Gateway Shopping Centre, Durban', 50, '[{"question":"What brand are the earbuds?","answer":"Samsung"}]', 'active', now() - interval '6 days'
  WHERE NOT EXISTS (SELECT 1 FROM lost_items WHERE item_name = 'Wireless Earbuds' AND user_id = u2);

  INSERT INTO lost_items (user_id, item_name, category, description, photo_urls, date_lost, last_seen_location, reward_offered, verification_questions, status, created_at)
  SELECT u4, 'Blue Jacket', 'Clothing', 'Navy blue Nike windbreaker jacket. Size medium. Left on a bench.', ARRAY[]::text[], '2026-09-15', 'Company Gardens, Cape Town', 0, '[{"question":"What brand is the jacket?","answer":"Nike"},{"question":"What size is the jacket?","answer":"Medium"}]', 'active', now() - interval '3 days'
  WHERE NOT EXISTS (SELECT 1 FROM lost_items WHERE item_name = 'Blue Jacket' AND user_id = u4);

  INSERT INTO lost_items (user_id, item_name, category, description, photo_urls, date_lost, last_seen_location, reward_offered, verification_questions, status, created_at)
  SELECT u6, 'Matric Certificate', 'Documents', 'Original matric certificate with name Nomsa Zulu. In a brown envelope.', ARRAY[]::text[], '2026-09-10', 'Home Affairs Office, Pretoria', 50, '[{"question":"What year is the matric certificate?","answer":"2023"}]', 'active', now() - interval '8 days'
  WHERE NOT EXISTS (SELECT 1 FROM lost_items WHERE item_name = 'Matric Certificate' AND user_id = u6);

  INSERT INTO lost_items (user_id, item_name, category, description, photo_urls, date_lost, last_seen_location, reward_offered, verification_questions, status, created_at)
  SELECT u5, 'Car Keys - Toyota', 'Keys', 'Toyota Corolla car keys with a red keychain. Lost in a parking lot.', ARRAY[]::text[], '2026-09-16', 'Eastgate Shopping Centre, Johannesburg', 100, '[{"question":"What car brand are the keys for?","answer":"Toyota"}]', 'active', now() - interval '2 days'
  WHERE NOT EXISTS (SELECT 1 FROM lost_items WHERE item_name = 'Car Keys - Toyota' AND user_id = u5);

  INSERT INTO lost_items (user_id, item_name, category, description, photo_urls, date_lost, last_seen_location, reward_offered, verification_questions, status, created_at)
  SELECT u1, 'iPad Air', 'Electronics', 'Silver iPad Air with a pink protective case. Contains lecture notes.', ARRAY[]::text[], '2026-09-11', 'Stellenbosch University Library', 200, '[{"question":"What colour is the iPad case?","answer":"Pink"}]', 'active', now() - interval '7 days'
  WHERE NOT EXISTS (SELECT 1 FROM lost_items WHERE item_name = 'iPad Air' AND user_id = u1);

  INSERT INTO lost_items (user_id, item_name, category, description, photo_urls, date_lost, last_seen_location, reward_offered, verification_questions, status, created_at)
  SELECT u3, 'Black Purse', 'Wallets', 'Small black purse with a gold zipper. Contains cards and cash.', ARRAY[]::text[], '2026-09-17', 'V&A Waterfront, Cape Town', 50, '[{"question":"What colour is the zipper?","answer":"Gold"}]', 'active', now() - interval '1 day'
  WHERE NOT EXISTS (SELECT 1 FROM lost_items WHERE item_name = 'Black Purse' AND user_id = u3);

  INSERT INTO lost_items (user_id, item_name, category, description, photo_urls, date_lost, last_seen_location, reward_offered, verification_questions, status, created_at)
  SELECT u6, 'School Bag - Grade 12', 'Backpacks', 'Grey school backpack with textbooks and a geometry set inside.', ARRAY[]::text[], '2026-09-14', 'Taxi from Soweto to Johannesburg CBD', 0, '[{"question":"What grade textbooks are inside?","answer":"Grade 12"}]', 'active', now() - interval '4 days'
  WHERE NOT EXISTS (SELECT 1 FROM lost_items WHERE item_name = 'School Bag - Grade 12' AND user_id = u6);

  INSERT INTO lost_items (user_id, item_name, category, description, photo_urls, date_lost, last_seen_location, reward_offered, verification_questions, status, created_at)
  SELECT u2, 'Prescription Glasses', 'Other', 'Black framed prescription glasses in a hard black case.', ARRAY[]::text[], '2026-09-13', 'Rosebank Mall, Johannesburg', 0, '[{"question":"What colour are the glasses frames?","answer":"Black"}]', 'active', now() - interval '5 days'
  WHERE NOT EXISTS (SELECT 1 FROM lost_items WHERE item_name = 'Prescription Glasses' AND user_id = u2);

  -- 15 Found Items
  INSERT INTO found_items (user_id, item_name, category, description, photo_urls, date_found, found_location, status, created_at)
  SELECT u2, 'iPhone 13 Pro', 'Phones', 'Found an iPhone 13 Pro in a black case. Screen is locked. Found on a bench outside the food court.', ARRAY[]::text[], '2026-09-16', 'Sandton City Food Court, Johannesburg', 'active', now() - interval '2 days'
  WHERE NOT EXISTS (SELECT 1 FROM found_items WHERE item_name = 'iPhone 13 Pro' AND user_id = u2);

  INSERT INTO found_items (user_id, item_name, category, description, photo_urls, date_found, found_location, status, created_at)
  SELECT u3, 'Black Wallet', 'Wallets', 'Found a black leather wallet near the taxi rank. Contains some cards but no cash.', ARRAY[]::text[], '2026-09-15', 'Bree Street Taxi Rank, Johannesburg', 'active', now() - interval '3 days'
  WHERE NOT EXISTS (SELECT 1 FROM found_items WHERE item_name = 'Black Wallet' AND user_id = u3);

  INSERT INTO found_items (user_id, item_name, category, description, photo_urls, date_found, found_location, status, created_at)
  SELECT u1, 'Student Card - Wits', 'IDs', 'Found a Wits University student card with a photo. Name on card appears to be unreadable due to scratch.', ARRAY[]::text[], '2026-09-17', 'Wits East Campus, Johannesburg', 'active', now() - interval '1 day'
  WHERE NOT EXISTS (SELECT 1 FROM found_items WHERE item_name = 'Student Card - Wits' AND user_id = u1);

  INSERT INTO found_items (user_id, item_name, category, description, photo_urls, date_found, found_location, status, created_at)
  SELECT u4, 'Dell Laptop Charger', 'Electronics', 'Found a Dell laptop charger plugged into a wall socket in the library study area.', ARRAY[]::text[], '2026-09-14', 'UCT Library, Cape Town', 'active', now() - interval '4 days'
  WHERE NOT EXISTS (SELECT 1 FROM found_items WHERE item_name = 'Dell Laptop Charger' AND user_id = u4);

  INSERT INTO found_items (user_id, item_name, category, description, photo_urls, date_found, found_location, status, created_at)
  SELECT u5, 'Set of Car Keys', 'Keys', 'Found a set of car keys with a VW logo keychain in the parking basement.', ARRAY[]::text[], '2026-09-16', 'Menlyn Park Parking, Pretoria', 'active', now() - interval '2 days'
  WHERE NOT EXISTS (SELECT 1 FROM found_items WHERE item_name = 'Set of Car Keys' AND user_id = u5);

  INSERT INTO found_items (user_id, item_name, category, description, photo_urls, date_found, found_location, status, created_at)
  SELECT u6, 'Red Backpack', 'Backpacks', 'Found a red backpack on the Golden Arrow bus. Contains a water bottle and a notebook.', ARRAY[]::text[], '2026-09-13', 'Golden Arrow Bus, Cape Town', 'active', now() - interval '5 days'
  WHERE NOT EXISTS (SELECT 1 FROM found_items WHERE item_name = 'Red Backpack' AND user_id = u6);

  INSERT INTO found_items (user_id, item_name, category, description, photo_urls, date_found, found_location, status, created_at)
  SELECT u1, 'ABSA Bank Card', 'Bank Cards', 'Found an ABSA bank card on the pavement outside the shopping centre entrance.', ARRAY[]::text[], '2026-09-17', 'Gateway Shopping Centre, Durban', 'active', now() - interval '1 day'
  WHERE NOT EXISTS (SELECT 1 FROM found_items WHERE item_name = 'ABSA Bank Card' AND user_id = u1);

  INSERT INTO found_items (user_id, item_name, category, description, photo_urls, date_found, found_location, status, created_at)
  SELECT u3, 'Apple AirPods Case', 'Electronics', 'Found a white AirPods charging case (empty, no earbuds inside) on a restaurant table.', ARRAY[]::text[], '2026-09-12', 'Mugg & Bean, Rosebank', 'active', now() - interval '6 days'
  WHERE NOT EXISTS (SELECT 1 FROM found_items WHERE item_name = 'Apple AirPods Case' AND user_id = u3);

  INSERT INTO found_items (user_id, item_name, category, description, photo_urls, date_found, found_location, status, created_at)
  SELECT u2, 'Green Jersey', 'Clothing', 'Found a green Springbok rugby jersey left on the bleachers after a match.', ARRAY[]::text[], '2026-09-15', 'Ellis Park Stadium, Johannesburg', 'active', now() - interval '3 days'
  WHERE NOT EXISTS (SELECT 1 FROM found_items WHERE item_name = 'Green Jersey' AND user_id = u2);

  INSERT INTO found_items (user_id, item_name, category, description, photo_urls, date_found, found_location, status, created_at)
  SELECT u4, 'Passport', 'Documents', 'Found a South African passport near the bus terminal. Handed in to security.', ARRAY[]::text[], '2026-09-10', 'Cape Town Bus Terminal', 'active', now() - interval '8 days'
  WHERE NOT EXISTS (SELECT 1 FROM found_items WHERE item_name = 'Passport' AND user_id = u4);

  INSERT INTO found_items (user_id, item_name, category, description, photo_urls, date_found, found_location, status, created_at)
  SELECT u6, 'House Keys on Ring', 'Keys', 'Found a set of 4 house keys on a silver key ring. Found near the entrance of the community centre.', ARRAY[]::text[], '2026-09-14', 'Rosebank Community Centre, Johannesburg', 'active', now() - interval '4 days'
  WHERE NOT EXISTS (SELECT 1 FROM found_items WHERE item_name = 'House Keys on Ring' AND user_id = u6);

  INSERT INTO found_items (user_id, item_name, category, description, photo_urls, date_found, found_location, status, created_at)
  SELECT u5, 'Samsung Tablet', 'Electronics', 'Found a Samsung Galaxy Tab in a grey leather case. Battery is dead.', ARRAY[]::text[], '2026-09-11', 'Wits Great Hall, Johannesburg', 'active', now() - interval '7 days'
  WHERE NOT EXISTS (SELECT 1 FROM found_items WHERE item_name = 'Samsung Tablet' AND user_id = u5);

  INSERT INTO found_items (user_id, item_name, category, description, photo_urls, date_found, found_location, status, created_at)
  SELECT u1, 'Drivers License', 'IDs', 'Found a drivers license card on the floor of the parking garage.', ARRAY[]::text[], '2026-09-16', 'Sandton City Parking, Johannesburg', 'active', now() - interval '2 days'
  WHERE NOT EXISTS (SELECT 1 FROM found_items WHERE item_name = 'Drivers License' AND user_id = u1);

  INSERT INTO found_items (user_id, item_name, category, description, photo_urls, date_found, found_location, status, created_at)
  SELECT u3, 'Blue Lunch Bag', 'Other', 'Found a blue insulated lunch bag with a container of food inside. Left on a park bench.', ARRAY[]::text[], '2026-09-17', 'Company Gardens, Cape Town', 'active', now() - interval '1 day'
  WHERE NOT EXISTS (SELECT 1 FROM found_items WHERE item_name = 'Blue Lunch Bag' AND user_id = u3);

  INSERT INTO found_items (user_id, item_name, category, description, photo_urls, date_found, found_location, status, created_at)
  SELECT u4, 'USB Flash Drive', 'Electronics', 'Found a 32GB SanDisk USB flash drive in the computer lab.', ARRAY[]::text[], '2026-09-13', 'UCT Computer Lab, Cape Town', 'active', now() - interval '5 days'
  WHERE NOT EXISTS (SELECT 1 FROM found_items WHERE item_name = 'USB Flash Drive' AND user_id = u4);

  -- Messages
  INSERT INTO messages (sender_id, recipient_id, item_id, item_type, body, created_at)
  SELECT u2, u1, (SELECT id FROM lost_items WHERE item_name = 'Samsung Galaxy S23' LIMIT 1), 'lost', 'Hi, I think I found your phone at Sandton City. Can you describe the case?', now() - interval '2 hours'
  WHERE NOT EXISTS (SELECT 1 FROM messages WHERE sender_id = u2 AND recipient_id = u1 AND body = 'Hi, I think I found your phone at Sandton City. Can you describe the case?');

  INSERT INTO messages (sender_id, recipient_id, item_id, item_type, body, created_at)
  SELECT u1, u2, (SELECT id FROM lost_items WHERE item_name = 'Samsung Galaxy S23' LIMIT 1), 'lost', 'It has a clear case with a small crack on the bottom left. The wallpaper is a photo of my kids.', now() - interval '1 hour'
  WHERE NOT EXISTS (SELECT 1 FROM messages WHERE sender_id = u1 AND recipient_id = u2 AND body = 'It has a clear case with a small crack on the bottom left. The wallpaper is a photo of my kids.');

  INSERT INTO messages (sender_id, recipient_id, item_id, item_type, body, created_at)
  SELECT u2, u1, (SELECT id FROM lost_items WHERE item_name = 'Samsung Galaxy S23' LIMIT 1), 'lost', 'That matches! Let me verify - can you tell me the lock screen wallpaper?', now() - interval '55 minutes'
  WHERE NOT EXISTS (SELECT 1 FROM messages WHERE sender_id = u2 AND recipient_id = u1 AND body = 'That matches! Let me verify - can you tell me the lock screen wallpaper?');

  INSERT INTO messages (sender_id, recipient_id, item_id, item_type, body, created_at)
  SELECT u3, u4, (SELECT id FROM lost_items WHERE item_name = 'MacBook Pro 14"' LIMIT 1), 'lost', 'Hello, I saw your post about the missing MacBook. I found one at UCT library with an SA flag sticker.', now() - interval '3 hours'
  WHERE NOT EXISTS (SELECT 1 FROM messages WHERE sender_id = u3 AND recipient_id = u4 AND body = 'Hello, I saw your post about the missing MacBook. I found one at UCT library with an SA flag sticker.');

  INSERT INTO messages (sender_id, recipient_id, item_id, item_type, body, created_at)
  SELECT u4, u3, (SELECT id FROM lost_items WHERE item_name = 'MacBook Pro 14"' LIMIT 1), 'lost', 'Yes! Thats mine. The sticker is a South African flag. Can we meet at the UCT security office?', now() - interval '2 hours'
  WHERE NOT EXISTS (SELECT 1 FROM messages WHERE sender_id = u4 AND recipient_id = u3 AND body = 'Yes! Thats mine. The sticker is a South African flag. Can we meet at the UCT security office?');

  INSERT INTO messages (sender_id, recipient_id, item_id, item_type, body, created_at)
  SELECT u5, u2, (SELECT id FROM lost_items WHERE item_name = 'Brown Leather Wallet' LIMIT 1), 'lost', 'Hi, I found a brown wallet at Menlyn. Does it have initials on it?', now() - interval '5 hours'
  WHERE NOT EXISTS (SELECT 1 FROM messages WHERE sender_id = u5 AND recipient_id = u2 AND body = 'Hi, I found a brown wallet at Menlyn. Does it have initials on it?');

  INSERT INTO messages (sender_id, recipient_id, item_id, item_type, body, created_at)
  SELECT u2, u5, (SELECT id FROM lost_items WHERE item_name = 'Brown Leather Wallet' LIMIT 1), 'lost', 'Yes, the initials SD are embossed on it. Thats mine!', now() - interval '4 hours'
  WHERE NOT EXISTS (SELECT 1 FROM messages WHERE sender_id = u2 AND recipient_id = u5 AND body = 'Yes, the initials SD are embossed on it. Thats mine!');

  INSERT INTO messages (sender_id, recipient_id, item_id, item_type, body, created_at)
  SELECT u6, u1, (SELECT id FROM found_items WHERE item_name = 'Red Backpack' LIMIT 1), 'found', 'I think the red backpack you found might be my sons. Can you check if there is a name tag inside?', now() - interval '6 hours'
  WHERE NOT EXISTS (SELECT 1 FROM messages WHERE sender_id = u6 AND recipient_id = u1 AND body = 'I think the red backpack you found might be my sons. Can you check if there is a name tag inside?');

  INSERT INTO messages (sender_id, recipient_id, item_id, item_type, body, created_at)
  SELECT u1, u6, (SELECT id FROM found_items WHERE item_name = 'Red Backpack' LIMIT 1), 'found', 'Let me check... yes, there is a name tag that says "Sipho Jr". Is that your son?', now() - interval '5 hours'
  WHERE NOT EXISTS (SELECT 1 FROM messages WHERE sender_id = u1 AND recipient_id = u6 AND body = 'Let me check... yes, there is a name tag that says "Sipho Jr". Is that your son?');

  INSERT INTO messages (sender_id, recipient_id, item_id, item_type, body, created_at)
  SELECT u3, u5, (SELECT id FROM lost_items WHERE item_name = 'House Keys with Blue Lanyard' LIMIT 1), 'lost', 'I found some keys with a blue Wits lanyard at the East Campus. Are these yours?', now() - interval '1 day'
  WHERE NOT EXISTS (SELECT 1 FROM messages WHERE sender_id = u3 AND recipient_id = u5 AND body = 'I found some keys with a blue Wits lanyard at the East Campus. Are these yours?');

  -- Recoveries
  INSERT INTO recoveries (lost_item_id, found_item_id, owner_id, finder_id, item_name, category, points_awarded, story, created_at)
  SELECT NULL, NULL, u1, u2, 'Samsung Phone', 'Phones', 200, 'Sipho found Thandiwes phone at Sandton City and returned it via the Sandton Police Station collection point. A smooth and safe recovery!', now() - interval '1 day'
  WHERE NOT EXISTS (SELECT 1 FROM recoveries WHERE owner_id = u1 AND finder_id = u2 AND item_name = 'Samsung Phone');

  INSERT INTO recoveries (lost_item_id, found_item_id, owner_id, finder_id, item_name, category, points_awarded, story, created_at)
  SELECT NULL, NULL, u2, u5, 'Brown Wallet', 'Wallets', 100, 'Jabu found Siphos wallet at Menlyn Park and contacted him through the app. They met at the security office for a safe handover.', now() - interval '2 days'
  WHERE NOT EXISTS (SELECT 1 FROM recoveries WHERE owner_id = u2 AND finder_id = u5 AND item_name = 'Brown Wallet');

  INSERT INTO recoveries (lost_item_id, found_item_id, owner_id, finder_id, item_name, category, points_awarded, story, created_at)
  SELECT NULL, NULL, u4, u3, 'MacBook Pro', 'Laptops', 500, 'Amara found Lebos MacBook at the UCT library and returned it through the campus security office. Lebo was so grateful!', now() - interval '3 days'
  WHERE NOT EXISTS (SELECT 1 FROM recoveries WHERE owner_id = u4 AND finder_id = u3 AND item_name = 'MacBook Pro');

  INSERT INTO recoveries (lost_item_id, found_item_id, owner_id, finder_id, item_name, category, points_awarded, story, created_at)
  SELECT NULL, NULL, u5, u3, 'House Keys', 'Keys', 50, 'Amara found Jabus house keys with the Wits lanyard and returned them at the campus security office.', now() - interval '4 days'
  WHERE NOT EXISTS (SELECT 1 FROM recoveries WHERE owner_id = u5 AND finder_id = u3 AND item_name = 'House Keys');

  INSERT INTO recoveries (lost_item_id, found_item_id, owner_id, finder_id, item_name, category, points_awarded, story, created_at)
  SELECT NULL, NULL, u3, u1, 'ID Document', 'IDs', 50, 'Thandiwe found Amaras ID near the taxi rank and arranged a safe handover at the Rosebank Community Centre.', now() - interval '5 days'
  WHERE NOT EXISTS (SELECT 1 FROM recoveries WHERE owner_id = u3 AND finder_id = u1 AND item_name = 'ID Document');
END;
$$;

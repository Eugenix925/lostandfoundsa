import pptxgen from 'pptxgenjs';
import { supabase } from '@/lib/supabase';

interface PresentationData {
  lostCount: number;
  foundCount: number;
  recoveryCount: number;
  totalUsers: number;
  topHelpers: { name: string; score: number; level: string }[];
  recentRecoveries: { itemName: string; category: string; story: string; points: number }[];
}

async function fetchPresentationData(): Promise<PresentationData> {
  const [lostR, foundR, recR, usersR, leadersR, recoveriesR] = await Promise.all([
    supabase.from('lost_items').select('id', { count: 'exact', head: true }),
    supabase.from('found_items').select('id', { count: 'exact', head: true }),
    supabase.from('recoveries').select('id', { count: 'exact', head: true }),
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('profiles').select('full_name, trust_score, trust_level').order('trust_score', { ascending: false }).limit(5),
    supabase.from('recoveries').select('item_name, category, story, points_awarded').order('created_at', { ascending: false }).limit(5),
  ]);

  return {
    lostCount: lostR.count ?? 0,
    foundCount: foundR.count ?? 0,
    recoveryCount: recR.count ?? 0,
    totalUsers: usersR.count ?? 0,
    topHelpers: (leadersR.data ?? []).map((p: any) => ({ name: p.full_name, score: p.trust_score, level: p.trust_level })),
    recentRecoveries: (recoveriesR.data ?? []).map((r: any) => ({
      itemName: r.item_name,
      category: r.category,
      story: r.story ?? '',
      points: r.points_awarded,
    })),
  };
}

const SA_GREEN = '2E7D32';
const SA_BLUE = '1565C0';
const SA_GOLD = 'FFC107';
const DARK_BG = '1B3A2A';
const LIGHT_BG = 'F5F5F5';
const WHITE = 'FFFFFF';
const DARK_TEXT = '212121';
const GRAY_TEXT = '616161';

export async function generatePresentation() {
  const data = await fetchPresentationData();
  const pptx = new pptxgen();
  pptx.defineLayout({ name: 'Wide', width: 13.333, height: 7.5 });
  pptx.layout = 'Wide';
  pptx.author = 'Lost & Found SA';
  pptx.company = 'Lost & Found SA';
  pptx.subject = 'Platform Overview & Investor Presentation';

  // === SLIDE 1: Title ===
  const slide1 = pptx.addSlide();
  slide1.background = { color: DARK_BG };
  slide1.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: 0.08, fill: { color: SA_GOLD } });
  slide1.addShape(pptx.ShapeType.rect, { x: 0, y: 7.42, w: 13.333, h: 0.08, fill: { color: SA_GOLD } });

  slide1.addText('Lost & Found SA', {
    x: 0.8, y: 1.8, w: 11.7, h: 1.2,
    fontSize: 54, bold: true, color: WHITE, fontFace: 'Arial',
    align: 'left', charSpacing: 2,
  });
  slide1.addShape(pptx.ShapeType.rect, { x: 0.85, y: 3.1, w: 3, h: 0.05, fill: { color: SA_GOLD } });
  slide1.addText('Helping South Africans reunite with what matters.', {
    x: 0.8, y: 3.3, w: 11.7, h: 0.6,
    fontSize: 22, color: SA_GOLD, fontFace: 'Arial',
    align: 'left', italic: true,
  });
  slide1.addText('Platform Overview & Investor Presentation', {
    x: 0.8, y: 5.5, w: 11.7, h: 0.4,
    fontSize: 16, color: 'B0BEC5', fontFace: 'Arial', align: 'left',
  });
  slide1.addText('September 2026', {
    x: 0.8, y: 6.2, w: 11.7, h: 0.35,
    fontSize: 14, color: '78909C', fontFace: 'Arial', align: 'left',
  });

  // === SLIDE 2: The Problem ===
  const slide2 = pptx.addSlide();
  slide2.background = { color: LIGHT_BG };
  addSlideHeader(slide2, pptx, 'The Problem', 'Lost items create daily frustration across South Africa');

  const problemCards = [
    { icon: 'Phones lost daily in SA malls, universities, and public transport', title: 'Valuable Items Lost', stat: 'Thousands', detail: 'Phones, wallets, IDs, laptops, keys, bank cards, bags' },
    { icon: 'WhatsApp groups, Facebook posts, community forums — no central place', title: 'Scattered Solutions', stat: 'No hub', detail: 'Information spread across multiple unconnected platforms' },
    { icon: 'Most lost items are never recovered due to poor visibility', title: 'Low Recovery Rate', stat: '< 10%', detail: 'Estimated recovery rate for lost items in South Africa' },
    { icon: 'Meeting strangers to retrieve items poses serious safety risks', title: 'Safety Concerns', stat: 'Risky', detail: 'No verified collection points or safety guidelines' },
  ];

  problemCards.forEach((card, i) => {
    const x = 0.6 + (i % 2) * 6.1;
    const y = 2.0 + Math.floor(i / 2) * 2.55;
    slide2.addShape(pptx.ShapeType.roundRect, { x, y, w: 5.8, h: 2.3, fill: { color: WHITE }, line: { color: 'E0E0E0', width: 1 }, rectRadius: 0.15 });
    slide2.addShape(pptx.ShapeType.rect, { x, y, w: 0.08, h: 2.3, fill: { color: SA_GREEN } });
    slide2.addText(card.stat, { x: x + 0.3, y: y + 0.2, w: 2, h: 0.5, fontSize: 22, bold: true, color: SA_GREEN, fontFace: 'Arial' });
    slide2.addText(card.title, { x: x + 0.3, y: y + 0.75, w: 5.2, h: 0.4, fontSize: 15, bold: true, color: DARK_TEXT, fontFace: 'Arial' });
    slide2.addText(card.detail, { x: x + 0.3, y: y + 1.2, w: 5.2, h: 0.8, fontSize: 12, color: GRAY_TEXT, fontFace: 'Arial', valign: 'top' });
  });

  // === SLIDE 3: The Solution ===
  const slide3 = pptx.addSlide();
  slide3.background = { color: WHITE };
  addSlideHeader(slide3, pptx, 'The Solution', 'A centralized, secure platform for community lost & found');

  const solutionItems = [
    { num: '1', title: 'Report Items', desc: 'Users report lost or found items with photos, descriptions, and location details' },
    { num: '2', title: 'Search & Match', desc: 'Browse and search through listings with category, location, and reward filters' },
    { num: '3', title: 'Safe Communication', desc: 'Anonymous in-app messaging protects personal contact information' },
    { num: '4', title: 'Verify & Recover', desc: 'Ownership verification questions ensure items go to rightful owners' },
    { num: '5', title: 'Earn Rewards', desc: 'Trust points and marketplace rewards incentivize honest returns' },
    { num: '6', title: 'Safe Handovers', desc: 'Verified collection points at police stations, universities, and malls' },
  ];

  solutionItems.forEach((item, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.6 + col * 4.15;
    const y = 2.1 + row * 2.4;
    slide3.addShape(pptx.ShapeType.roundRect, { x, y, w: 3.9, h: 2.15, fill: { color: LIGHT_BG }, rectRadius: 0.15 });
    slide3.addShape(pptx.ShapeType.ellipse, { x: x + 0.2, y: y + 0.2, w: 0.6, h: 0.6, fill: { color: SA_GREEN } });
    slide3.addText(item.num, { x: x + 0.2, y: y + 0.2, w: 0.6, h: 0.6, fontSize: 20, bold: true, color: WHITE, fontFace: 'Arial', align: 'center', valign: 'middle' });
    slide3.addText(item.title, { x: x + 0.95, y: y + 0.25, w: 2.8, h: 0.45, fontSize: 16, bold: true, color: DARK_TEXT, fontFace: 'Arial' });
    slide3.addText(item.desc, { x: x + 0.25, y: y + 0.95, w: 3.5, h: 1.05, fontSize: 12, color: GRAY_TEXT, fontFace: 'Arial', valign: 'top' });
  });

  // === SLIDE 4: Target Users ===
  const slide4 = pptx.addSlide();
  slide4.background = { color: LIGHT_BG };
  addSlideHeader(slide4, pptx, 'Target Users', 'Serving diverse communities across South Africa');

  const userGroups = [
    'Students', 'Schools & Universities', 'Shopping Centres',
    'Businesses', 'Public Transport Commuters', 'Community Members',
  ];
  const userDescs = [
    'Lose phones, laptops, and bags on campus',
    'Centralized lost & found for institutions',
    'Security offices as verified collection points',
    'Employee lost items and corporate partnerships',
    'High-loss environment for wallets and IDs',
    'Neighborhood trust and community building',
  ];

  userGroups.forEach((group, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.6 + col * 4.15;
    const y = 2.1 + row * 2.4;
    slide4.addShape(pptx.ShapeType.roundRect, { x, y, w: 3.9, h: 2.15, fill: { color: WHITE }, line: { color: 'E0E0E0', width: 1 }, rectRadius: 0.15 });
    slide4.addShape(pptx.ShapeType.ellipse, { x: x + 0.2, y: y + 0.25, w: 0.55, h: 0.55, fill: { color: SA_BLUE } });
    slide4.addText(String(i + 1), { x: x + 0.2, y: y + 0.25, w: 0.55, h: 0.55, fontSize: 18, bold: true, color: WHITE, fontFace: 'Arial', align: 'center', valign: 'middle' });
    slide4.addText(group, { x: x + 0.9, y: y + 0.25, w: 2.9, h: 0.45, fontSize: 15, bold: true, color: DARK_TEXT, fontFace: 'Arial' });
    slide4.addText(userDescs[i], { x: x + 0.25, y: y + 0.95, w: 3.5, h: 1.0, fontSize: 12, color: GRAY_TEXT, fontFace: 'Arial', valign: 'top' });
  });

  // === SLIDE 5: Platform Stats ===
  const slide5 = pptx.addSlide();
  slide5.background = { color: DARK_BG };
  slide5.addText('Platform Impact', { x: 0.8, y: 0.5, w: 11.7, h: 0.6, fontSize: 36, bold: true, color: WHITE, fontFace: 'Arial' });
  slide5.addText('Live data from the Lost & Found SA platform', { x: 0.8, y: 1.1, w: 11.7, h: 0.4, fontSize: 16, color: SA_GOLD, fontFace: 'Arial', italic: true });
  slide5.addShape(pptx.ShapeType.rect, { x: 0.85, y: 1.65, w: 3, h: 0.04, fill: { color: SA_GOLD } });

  const stats = [
    { value: String(data.lostCount), label: 'Lost Items Reported', color: 'EF5350' },
    { value: String(data.foundCount), label: 'Found Items Reported', color: '66BB6A' },
    { value: String(data.recoveryCount), label: 'Successful Recoveries', color: SA_GOLD },
    { value: String(data.totalUsers), label: 'Community Members', color: SA_BLUE },
  ];

  stats.forEach((stat, i) => {
    const x = 0.6 + i * 3.15;
    slide5.addShape(pptx.ShapeType.roundRect, { x, y: 2.5, w: 2.95, h: 3.2, fill: { color: '2A4A38' }, rectRadius: 0.15 });
    slide5.addShape(pptx.ShapeType.rect, { x, y: 2.5, w: 2.95, h: 0.06, fill: { color: stat.color } });
    slide5.addText(stat.value, { x, y: 3.2, w: 2.95, h: 1.2, fontSize: 60, bold: true, color: stat.color, fontFace: 'Arial', align: 'center' });
    slide5.addText(stat.label, { x, y: 4.6, w: 2.95, h: 0.6, fontSize: 14, color: 'B0BEC5', fontFace: 'Arial', align: 'center' });
  });

  slide5.addText('All data is live and pulled directly from the platform database.', {
    x: 0.8, y: 6.2, w: 11.7, h: 0.35, fontSize: 12, color: '78909C', fontFace: 'Arial', align: 'center', italic: true,
  });

  // === SLIDE 6: Safety Features ===
  const slide6 = pptx.addSlide();
  slide6.background = { color: WHITE };
  addSlideHeader(slide6, pptx, 'Safety Features', 'Trust and security at the core of every interaction');

  const safetyFeatures = [
    { title: 'Anonymous Messaging', desc: 'Phone numbers and email addresses are never shared. All communication stays within the app.', color: SA_BLUE },
    { title: 'Verified Collection Points', desc: 'Police stations, universities, and shopping centre security offices serve as safe handover locations.', color: SA_GREEN },
    { title: 'Ownership Verification', desc: 'Owners set verification questions that only the rightful owner can answer before claiming items.', color: SA_GOLD },
    { title: 'User Verification', desc: 'Email verification, optional phone verification, and verified badges for trusted members.', color: '7B1FA2' },
    { title: 'Report & Moderation', desc: 'Users can report suspicious activity, fraud, harassment, or unsafe behavior for admin review.', color: 'EF5350' },
  ];

  safetyFeatures.forEach((feat, i) => {
    const y = 2.0 + i * 1.05;
    slide6.addShape(pptx.ShapeType.roundRect, { x: 0.6, y, w: 12.1, h: 0.9, fill: { color: LIGHT_BG }, rectRadius: 0.12 });
    slide6.addShape(pptx.ShapeType.rect, { x: 0.6, y, w: 0.08, h: 0.9, fill: { color: feat.color } });
    slide6.addText(feat.title, { x: 0.9, y: y + 0.12, w: 4.5, h: 0.35, fontSize: 16, bold: true, color: DARK_TEXT, fontFace: 'Arial' });
    slide6.addText(feat.desc, { x: 0.9, y: y + 0.48, w: 11.5, h: 0.35, fontSize: 12, color: GRAY_TEXT, fontFace: 'Arial' });
  });

  // === SLIDE 7: Rewards System ===
  const slide7 = pptx.addSlide();
  slide7.background = { color: LIGHT_BG };
  addSlideHeader(slide7, pptx, 'Community Rewards System', 'Incentivizing honesty through trust points and marketplace rewards');

  // Points table
  slide7.addText('Trust Points by Item Type', { x: 0.6, y: 2.0, w: 5.5, h: 0.4, fontSize: 16, bold: true, color: DARK_TEXT, fontFace: 'Arial' });
  const pointsData: [string, string][] = [
    ['Return ID', '50 points'],
    ['Return Wallet', '100 points'],
    ['Return Phone', '200 points'],
    ['Return Laptop', '500 points'],
  ];
  pointsData.forEach((row, i) => {
    const y = 2.5 + i * 0.6;
    slide7.addShape(pptx.ShapeType.roundRect, { x: 0.6, y, w: 5.5, h: 0.5, fill: { color: WHITE }, line: { color: 'E0E0E0', width: 1 }, rectRadius: 0.08 });
    slide7.addText(row[0], { x: 0.8, y, w: 3, h: 0.5, fontSize: 14, color: DARK_TEXT, fontFace: 'Arial', valign: 'middle' });
    slide7.addText(row[1], { x: 3.8, y, w: 2.1, h: 0.5, fontSize: 14, bold: true, color: SA_GREEN, fontFace: 'Arial', align: 'right', valign: 'middle' });
  });

  // Trust levels
  slide7.addText('Trust Levels', { x: 6.8, y: 2.0, w: 5.8, h: 0.4, fontSize: 16, bold: true, color: DARK_TEXT, fontFace: 'Arial' });
  const levels: [string, string, string][] = [
    ['Bronze Helper', '0 - 499 pts', 'CD7F32'],
    ['Silver Helper', '500 - 999 pts', '9E9E9E'],
    ['Gold Helper', '1000 - 1499 pts', 'FFD700'],
    ['Community Hero', '1500+ pts', SA_GREEN],
  ];
  levels.forEach((level, i) => {
    const y = 2.5 + i * 0.6;
    slide7.addShape(pptx.ShapeType.roundRect, { x: 6.8, y, w: 5.8, h: 0.5, fill: { color: WHITE }, line: { color: 'E0E0E0', width: 1 }, rectRadius: 0.08 });
    slide7.addShape(pptx.ShapeType.ellipse, { x: 7.0, y: y + 0.1, w: 0.3, h: 0.3, fill: { color: level[2] } });
    slide7.addText(level[0], { x: 7.45, y, w: 3, h: 0.5, fontSize: 14, bold: true, color: DARK_TEXT, fontFace: 'Arial', valign: 'middle' });
    slide7.addText(level[1], { x: 10.5, y, w: 1.9, h: 0.5, fontSize: 12, color: GRAY_TEXT, fontFace: 'Arial', align: 'right', valign: 'middle' });
  });

  // Rewards marketplace
  slide7.addText('Rewards Marketplace', { x: 0.6, y: 5.2, w: 12, h: 0.4, fontSize: 16, bold: true, color: DARK_TEXT, fontFace: 'Arial' });
  const rewards: [string, string][] = [
    ['100 pts', 'Soft Drink Voucher'],
    ['250 pts', 'Fries Voucher'],
    ['500 pts', 'Burger Voucher'],
    ['1000 pts', 'Meal Voucher'],
  ];
  rewards.forEach((reward, i) => {
    const x = 0.6 + i * 3.15;
    slide7.addShape(pptx.ShapeType.roundRect, { x, y: 5.7, w: 2.95, h: 1.2, fill: { color: WHITE }, line: { color: 'E0E0E0', width: 1 }, rectRadius: 0.1 });
    slide7.addShape(pptx.ShapeType.rect, { x, y: 5.7, w: 2.95, h: 0.06, fill: { color: SA_GOLD } });
    slide7.addText(reward[0], { x, y: 5.85, w: 2.95, h: 0.4, fontSize: 20, bold: true, color: SA_GOLD, fontFace: 'Arial', align: 'center' });
    slide7.addText(reward[1], { x, y: 6.3, w: 2.95, h: 0.4, fontSize: 13, color: DARK_TEXT, fontFace: 'Arial', align: 'center' });
  });

  // === SLIDE 8: Trust Leaderboard ===
  const slide8 = pptx.addSlide();
  slide8.background = { color: WHITE };
  addSlideHeader(slide8, pptx, 'Community Trust Leaderboard', 'Top community members ranked by trust score');

  if (data.topHelpers.length > 0) {
    data.topHelpers.forEach((helper, i) => {
      const y = 2.0 + i * 1.0;
      const isTop = i === 0;
      slide8.addShape(pptx.ShapeType.roundRect, { x: 0.6, y, w: 12.1, h: 0.85, fill: { color: isTop ? 'FFF8E1' : LIGHT_BG }, rectRadius: 0.12 });
      slide8.addShape(pptx.ShapeType.ellipse, { x: 0.85, y: y + 0.15, w: 0.55, h: 0.55, fill: { color: isTop ? SA_GOLD : 'B0BEC5' } });
      slide8.addText(String(i + 1), { x: 0.85, y: y + 0.15, w: 0.55, h: 0.55, fontSize: 20, bold: true, color: WHITE, fontFace: 'Arial', align: 'center', valign: 'middle' });
      slide8.addText(helper.name, { x: 1.6, y: y + 0.1, w: 5, h: 0.4, fontSize: 16, bold: true, color: DARK_TEXT, fontFace: 'Arial' });
      slide8.addText(helper.level, { x: 1.6, y: y + 0.48, w: 5, h: 0.3, fontSize: 12, color: GRAY_TEXT, fontFace: 'Arial' });
      slide8.addText(String(helper.score), { x: 9.5, y: y + 0.15, w: 2.8, h: 0.55, fontSize: 24, bold: true, color: SA_GREEN, fontFace: 'Arial', align: 'right', valign: 'middle' });
      slide8.addText('trust points', { x: 9.5, y: y + 0.58, w: 2.8, h: 0.2, fontSize: 10, color: '9E9E9E', fontFace: 'Arial', align: 'right' });
    });
  } else {
    slide8.addText('Leaderboard data loading...', { x: 0.6, y: 3.0, w: 12.1, h: 0.5, fontSize: 16, color: GRAY_TEXT, fontFace: 'Arial', align: 'center' });
  }

  // === SLIDE 9: Recent Recoveries ===
  const slide9 = pptx.addSlide();
  slide9.background = { color: LIGHT_BG };
  addSlideHeader(slide9, pptx, 'Recovery Stories', 'Real reunions powered by community honesty');

  if (data.recentRecoveries.length > 0) {
    data.recentRecoveries.forEach((rec, i) => {
      const y = 2.0 + i * 1.05;
      slide9.addShape(pptx.ShapeType.roundRect, { x: 0.6, y, w: 12.1, h: 0.9, fill: { color: WHITE }, line: { color: 'E0E0E0', width: 1 }, rectRadius: 0.12 });
      slide9.addShape(pptx.ShapeType.rect, { x: 0.6, y, w: 0.08, h: 0.9, fill: { color: SA_GREEN } });
      slide9.addText(rec.itemName, { x: 0.9, y: y + 0.08, w: 4, h: 0.35, fontSize: 15, bold: true, color: DARK_TEXT, fontFace: 'Arial' });
      slide9.addText(rec.category, { x: 0.9, y: y + 0.42, w: 4, h: 0.3, fontSize: 12, color: GRAY_TEXT, fontFace: 'Arial' });
      const shortStory = rec.story.length > 80 ? rec.story.substring(0, 77) + '...' : rec.story;
      slide9.addText(shortStory, { x: 5.2, y: y + 0.1, w: 5.5, h: 0.7, fontSize: 12, color: GRAY_TEXT, fontFace: 'Arial', valign: 'middle' });
      slide9.addShape(pptx.ShapeType.roundRect, { x: 11.0, y: y + 0.2, w: 1.5, h: 0.5, fill: { color: 'FFF8E1' }, rectRadius: 0.08 });
      slide9.addText(`+${rec.points} pts`, { x: 11.0, y: y + 0.2, w: 1.5, h: 0.5, fontSize: 14, bold: true, color: 'F57F17', fontFace: 'Arial', align: 'center', valign: 'middle' });
    });
  } else {
    slide9.addText('No recovery stories yet.', { x: 0.6, y: 3.0, w: 12.1, h: 0.5, fontSize: 16, color: GRAY_TEXT, fontFace: 'Arial', align: 'center' });
  }

  // === SLIDE 10: Business Model ===
  const slide10 = pptx.addSlide();
  slide10.background = { color: WHITE };
  addSlideHeader(slide10, pptx, 'Business Model', 'Multiple sustainable revenue streams');

  const revenueStreams = [
    { title: 'Premium Lost Listings', desc: 'Featured placement and priority visibility for lost item reports', icon: 'Featured' },
    { title: 'Sponsored Rewards', desc: 'Businesses sponsor rewards marketplace items for brand exposure', icon: 'Sponsor' },
    { title: 'Local Advertising', desc: 'Targeted advertising to community members by location and category', icon: 'Ads' },
    { title: 'School Partnerships', desc: 'Custom dashboards and lost & found management for schools', icon: 'School' },
    { title: 'Shopping Centre Deals', desc: 'Partnership with malls for collection points and branded presence', icon: 'Mall' },
    { title: 'Verified Org Dashboards', desc: 'Premium dashboards for organizations to manage lost & found at scale', icon: 'Dashboard' },
  ];

  revenueStreams.forEach((stream, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.6 + col * 4.15;
    const y = 2.1 + row * 2.4;
    slide10.addShape(pptx.ShapeType.roundRect, { x, y, w: 3.9, h: 2.15, fill: { color: LIGHT_BG }, rectRadius: 0.15 });
    slide10.addShape(pptx.ShapeType.rect, { x, y, w: 3.9, h: 0.06, fill: { color: SA_GOLD } });
    slide10.addText(stream.title, { x: x + 0.25, y: y + 0.25, w: 3.4, h: 0.4, fontSize: 15, bold: true, color: DARK_TEXT, fontFace: 'Arial' });
    slide10.addText(stream.desc, { x: x + 0.25, y: y + 0.75, w: 3.4, h: 1.2, fontSize: 12, color: GRAY_TEXT, fontFace: 'Arial', valign: 'top' });
  });

  // === SLIDE 11: Technology & Architecture ===
  const slide11 = pptx.addSlide();
  slide11.background = { color: DARK_BG };
  slide11.addText('Technology Stack', { x: 0.8, y: 0.5, w: 11.7, h: 0.6, fontSize: 36, bold: true, color: WHITE, fontFace: 'Arial' });
  slide11.addText('Built with modern, scalable, and secure technologies', { x: 0.8, y: 1.1, w: 11.7, h: 0.4, fontSize: 16, color: SA_GOLD, fontFace: 'Arial', italic: true });
  slide11.addShape(pptx.ShapeType.rect, { x: 0.85, y: 1.65, w: 3, h: 0.04, fill: { color: SA_GOLD } });

  const techStack = [
    { layer: 'Frontend', tech: 'React + TypeScript + Tailwind CSS', desc: 'Mobile-first responsive design with smooth animations' },
    { layer: 'Backend', tech: 'Supabase (PostgreSQL)', desc: 'Real-time database with row-level security on every table' },
    { layer: 'Authentication', tech: 'Supabase Auth', desc: 'Email/password with secure session management' },
    { layer: 'Messaging', tech: 'In-app secure chat', desc: 'Anonymous communication with no personal info exposure' },
    { layer: 'Edge Functions', tech: 'Deno serverless', desc: 'API proxying and server-side validation' },
    { layer: 'Data Security', tech: 'RLS policies', desc: 'Owner-scoped access control on all user data' },
  ];

  techStack.forEach((item, i) => {
    const y = 2.2 + i * 0.82;
    slide11.addShape(pptx.ShapeType.roundRect, { x: 0.8, y, w: 11.7, h: 0.7, fill: { color: '2A4A38' }, rectRadius: 0.1 });
    slide11.addShape(pptx.ShapeType.rect, { x: 0.8, y, w: 0.08, h: 0.7, fill: { color: SA_GREEN } });
    slide11.addText(item.layer, { x: 1.1, y: y + 0.08, w: 2.5, h: 0.3, fontSize: 14, bold: true, color: SA_GOLD, fontFace: 'Arial' });
    slide11.addText(item.tech, { x: 3.8, y: y + 0.08, w: 4.5, h: 0.3, fontSize: 14, bold: true, color: WHITE, fontFace: 'Arial' });
    slide11.addText(item.desc, { x: 3.8, y: y + 0.38, w: 8.5, h: 0.25, fontSize: 11, color: 'B0BEC5', fontFace: 'Arial' });
  });

  // === SLIDE 12: Call to Action ===
  const slide12 = pptx.addSlide();
  slide12.background = { color: DARK_BG };
  slide12.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: 0.08, fill: { color: SA_GOLD } });
  slide12.addShape(pptx.ShapeType.rect, { x: 0, y: 7.42, w: 13.333, h: 0.08, fill: { color: SA_GOLD } });

  slide12.addText('Join Us in Building\nStronger Communities', {
    x: 0.8, y: 1.5, w: 11.7, h: 1.8,
    fontSize: 44, bold: true, color: WHITE, fontFace: 'Arial',
    align: 'center', valign: 'middle', lineSpacingMultiple: 1.2,
  });
  slide12.addShape(pptx.ShapeType.rect, { x: 5.67, y: 3.5, w: 2, h: 0.05, fill: { color: SA_GOLD } });
  slide12.addText('Lost & Found SA is more than an app — it is a movement\ntoward honesty, trust, and community care in South Africa.', {
    x: 1.5, y: 3.8, w: 10.3, h: 1.0,
    fontSize: 18, color: SA_GOLD, fontFace: 'Arial', italic: true,
    align: 'center', valign: 'middle', lineSpacingMultiple: 1.3,
  });

  // CTA boxes
  const ctas = [
    { label: 'Invest', desc: 'Partner with us to scale across South Africa', color: SA_GREEN },
    { label: 'Collaborate', desc: 'Bring your school, mall, or business on board', color: SA_BLUE },
    { label: 'Sponsor', desc: 'Fund rewards and community incentives', color: SA_GOLD },
  ];
  ctas.forEach((cta, i) => {
    const x = 1.2 + i * 3.8;
    slide12.addShape(pptx.ShapeType.roundRect, { x, y: 5.3, w: 3.4, h: 1.5, fill: { color: '2A4A38' }, rectRadius: 0.15 });
    slide12.addShape(pptx.ShapeType.rect, { x, y: 5.3, w: 3.4, h: 0.06, fill: { color: cta.color } });
    slide12.addText(cta.label, { x, y: 5.45, w: 3.4, h: 0.4, fontSize: 20, bold: true, color: cta.color, fontFace: 'Arial', align: 'center' });
    slide12.addText(cta.desc, { x, y: 5.9, w: 3.4, h: 0.7, fontSize: 12, color: 'B0BEC5', fontFace: 'Arial', align: 'center', valign: 'top' });
  });

  slide12.addText('Lost & Found SA  |  Helping South Africans reunite with what matters.', {
    x: 0.8, y: 7.0, w: 11.7, h: 0.3, fontSize: 11, color: '78909C', fontFace: 'Arial', align: 'center',
  });

  // Generate
  const blob = await pptx.write({ outputType: 'blob' } as any) as Blob;
  return blob;
}

function addSlideHeader(slide: pptxgen.Slide, pptx: pptxgen, title: string, subtitle: string) {
  slide.addText(title, { x: 0.8, y: 0.5, w: 11.7, h: 0.6, fontSize: 36, bold: true, color: DARK_TEXT, fontFace: 'Arial' });
  slide.addText(subtitle, { x: 0.8, y: 1.1, w: 11.7, h: 0.4, fontSize: 16, color: SA_GREEN, fontFace: 'Arial', italic: true });
  slide.addShape(pptx.ShapeType.rect, { x: 0.85, y: 1.65, w: 3, h: 0.04, fill: { color: SA_GOLD } });
}

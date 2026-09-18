import { CATEGORIES } from '@/types';
import {
  Smartphone, Wallet, IdCard, CreditCard, Laptop, Key, Backpack,
  Tv, Shirt, FileText, Package,
} from 'lucide-react';

const ICON_MAP: Record<string, typeof Smartphone> = {
  'Phones': Smartphone,
  'Wallets': Wallet,
  'IDs': IdCard,
  'Bank Cards': CreditCard,
  'Laptops': Laptop,
  'Keys': Key,
  'Backpacks': Backpack,
  'Electronics': Tv,
  'Clothing': Shirt,
  'Documents': FileText,
  'Other': Package,
};

const COLOR_MAP: Record<string, string> = {
  'Phones': 'bg-secondary-100 text-secondary-600',
  'Wallets': 'bg-amber-100 text-amber-700',
  'IDs': 'bg-rose-100 text-rose-600',
  'Bank Cards': 'bg-purple-100 text-purple-600',
  'Laptops': 'bg-indigo-100 text-indigo-600',
  'Keys': 'bg-yellow-100 text-yellow-700',
  'Backpacks': 'bg-teal-100 text-teal-600',
  'Electronics': 'bg-cyan-100 text-cyan-600',
  'Clothing': 'bg-pink-100 text-pink-600',
  'Documents': 'bg-orange-100 text-orange-600',
  'Other': 'bg-neutral-100 text-neutral-500',
};

export function CategoryIcon({ category, size = 20 }: { category: string; size?: number }) {
  const Icon = ICON_MAP[category] ?? Package;
  return <Icon style={{ width: size, height: size }} />;
}

export function CategoryBadge({ category }: { category: string }) {
  return (
    <span className={`badge ${COLOR_MAP[category] ?? 'bg-neutral-100 text-neutral-500'}`}>
      <CategoryIcon category={category} size={12} />
      {category}
    </span>
  );
}

export function CategoryCircle({ category, size = 'md' }: { category: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };
  const iconSizes = { sm: 16, md: 20, lg: 28 };
  return (
    <div className={`${sizes[size]} rounded-full flex items-center justify-center ${COLOR_MAP[category] ?? 'bg-neutral-100 text-neutral-500'}`}>
      <CategoryIcon category={category} size={iconSizes[size]} />
    </div>
  );
}

export { CATEGORIES, COLOR_MAP };

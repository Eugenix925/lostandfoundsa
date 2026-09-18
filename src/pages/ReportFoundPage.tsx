import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { PageContainer, TopBar } from '@/components/Navigation';
import { CATEGORIES } from '@/types';
import { CategoryCircle } from '@/components/CategoryIcon';
import { ImagePlus, Check } from 'lucide-react';

export function ReportFoundPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [dateFound, setDateFound] = useState('');
  const [foundLocation, setFoundLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = itemName.trim() && category && description.trim() && dateFound && foundLocation.trim();

  const handleSubmit = async () => {
    if (!user) return;
    setError(null);
    setSubmitting(true);

    const { error } = await supabase.from('found_items').insert({
      user_id: user.id,
      item_name: itemName,
      category: category || 'Other',
      description,
      photo_urls: [],
      date_found: dateFound || new Date().toISOString().split('T')[0],
      found_location: foundLocation,
      status: 'active',
    });

    setSubmitting(false);
    if (error) {
      setError(error.message);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <PageContainer>
      <TopBar title="Report Found Item" showBack />

      <div className="px-5 pt-4">
        <div className="bg-success-50 border border-success-100 rounded-xl p-3 mb-4 flex items-start gap-2">
          <Check className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-success-800">
            Thank you for being an honest community member! Your report could help someone recover their belongings.
          </p>
        </div>

        {error && (
          <div className="bg-error-50 border border-error-100 text-error-700 text-sm rounded-xl p-3 mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Item Name</label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g. iPhone 13 Pro"
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Category</label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                    category === cat
                      ? 'border-success-500 bg-success-50'
                      : 'border-neutral-200 bg-white'
                  }`}
                >
                  <CategoryCircle category={cat} size="sm" />
                  <span className="text-[10px] font-medium text-neutral-600 text-center leading-tight">{cat}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the item in detail — colour, brand, distinctive features, condition..."
              rows={4}
              className="textarea"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Date Found</label>
            <input
              type="date"
              value={dateFound}
              onChange={(e) => setDateFound(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Found Location</label>
            <input
              type="text"
              value={foundLocation}
              onChange={(e) => setFoundLocation(e.target.value)}
              placeholder="e.g. Sandton City Food Court, Johannesburg"
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Photos (Optional)</label>
            <div className="border-2 border-dashed border-neutral-200 rounded-2xl p-6 text-center">
              <ImagePlus className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
              <p className="text-sm text-neutral-400">Photo upload coming soon</p>
              <p className="text-xs text-neutral-300 mt-1">Add photos to help identify the item</p>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="btn-primary w-full !py-4"
          >
            {submitting ? 'Submitting...' : 'Submit Found Report'}
          </button>
        </div>
      </div>
    </PageContainer>
  );
}

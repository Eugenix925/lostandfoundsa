import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { PageContainer, TopBar } from '@/components/Navigation';
import { CATEGORIES } from '@/types';
import { CategoryCircle, COLOR_MAP } from '@/components/CategoryIcon';
import { ImagePlus, X, Plus, Gift, ShieldQuestion, Check } from 'lucide-react';

export function ReportLostPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [dateLost, setDateLost] = useState('');
  const [lastSeenLocation, setLastSeenLocation] = useState('');
  const [rewardOffered, setRewardOffered] = useState(0);
  const [verificationQuestions, setVerificationQuestions] = useState<{ question: string; answer: string }[]>([
    { question: '', answer: '' },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!user) return;
    setError(null);
    setSubmitting(true);

    const filteredQuestions = verificationQuestions.filter((q) => q.question.trim() && q.answer.trim());

    const { error } = await supabase.from('lost_items').insert({
      user_id: user.id,
      item_name: itemName,
      category: category || 'Other',
      description,
      photo_urls: [],
      date_lost: dateLost || new Date().toISOString().split('T')[0],
      last_seen_location: lastSeenLocation,
      reward_offered: rewardOffered,
      verification_questions: filteredQuestions,
      status: 'active',
    });

    setSubmitting(false);
    if (error) {
      setError(error.message);
    } else {
      navigate('/dashboard');
    }
  };

  const updateQuestion = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...verificationQuestions];
    updated[index][field] = value;
    setVerificationQuestions(updated);
  };

  const addQuestion = () => {
    setVerificationQuestions([...verificationQuestions, { question: '', answer: '' }]);
  };

  const removeQuestion = (index: number) => {
    setVerificationQuestions(verificationQuestions.filter((_, i) => i !== index));
  };

  const canProceed1 = itemName.trim() && category;
  const canProceed2 = description.trim() && dateLost && lastSeenLocation.trim();

  return (
    <PageContainer>
      <TopBar title="Report Lost Item" showBack />

      {/* Progress */}
      <div className="px-5 pt-4">
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? 'bg-primary-500' : 'bg-neutral-200'}`}
            />
          ))}
        </div>
        <p className="text-xs text-neutral-500 mt-2">Step {step} of 3</p>
      </div>

      <div className="px-5 mt-4">
        {error && (
          <div className="bg-error-50 border border-error-100 text-error-700 text-sm rounded-xl p-3 mb-4">
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Item Name</label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Samsung Galaxy S23"
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
                        ? 'border-primary-500 bg-primary-50'
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
                placeholder="Describe the item in detail — colour, brand, distinctive features..."
                rows={4}
                className="textarea"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!canProceed1}
              className="btn-primary w-full"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Date Lost</label>
              <input
                type="date"
                value={dateLost}
                onChange={(e) => setDateLost(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Last Seen Location</label>
              <input
                type="text"
                value={lastSeenLocation}
                onChange={(e) => setLastSeenLocation(e.target.value)}
                placeholder="e.g. Sandton City Mall, Johannesburg"
                className="input"
              />
            </div>

            {/* Photo Upload Placeholder */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Photos (Optional)</label>
              <div className="border-2 border-dashed border-neutral-200 rounded-2xl p-6 text-center">
                <ImagePlus className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                <p className="text-sm text-neutral-400">Photo upload coming soon</p>
                <p className="text-xs text-neutral-300 mt-1">Add photos to help identify your item</p>
              </div>
            </div>

            {/* Reward */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Reward Offered (Optional)</label>
              <div className="grid grid-cols-4 gap-2">
                {[0, 50, 100, 200].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setRewardOffered(amount)}
                    className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      rewardOffered === amount
                        ? 'bg-accent-500 text-neutral-900'
                        : 'bg-white border border-neutral-200 text-neutral-600'
                    }`}
                  >
                    {amount === 0 ? 'None' : `R${amount}`}
                  </button>
                ))}
              </div>
              {rewardOffered > 0 && (
                <div className="flex items-center gap-2 mt-2 bg-accent-50 rounded-lg p-2.5">
                  <Gift className="w-4 h-4 text-accent-600" />
                  <p className="text-xs text-accent-800">Reward of R{rewardOffered} will be shown on your listing</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-outline flex-1">Back</button>
              <button
                onClick={() => setStep(3)}
                disabled={!canProceed2}
                className="btn-primary flex-1"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-secondary-50 border border-secondary-100 rounded-xl p-3 flex items-start gap-2">
              <ShieldQuestion className="w-5 h-5 text-secondary-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-secondary-800">
                Add verification questions that only the real owner would know. This helps ensure the item is returned to the right person.
              </p>
            </div>

            {verificationQuestions.map((q, i) => (
              <div key={i} className="card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-500">Question {i + 1}</span>
                  {verificationQuestions.length > 1 && (
                    <button onClick={() => removeQuestion(i)} className="text-neutral-400 hover:text-error-500">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => updateQuestion(i, 'question', e.target.value)}
                  placeholder="e.g. What colour is the case?"
                  className="input"
                />
                <input
                  type="text"
                  value={q.answer}
                  onChange={(e) => updateQuestion(i, 'answer', e.target.value)}
                  placeholder="Expected answer"
                  className="input"
                />
              </div>
            ))}

            {verificationQuestions.length < 5 && (
              <button onClick={addQuestion} className="btn-outline w-full">
                <Plus className="w-4 h-4" /> Add Question
              </button>
            )}

            {/* Summary */}
            <div className="card p-4 bg-neutral-50">
              <h3 className="font-semibold text-sm text-neutral-700 mb-3">Summary</h3>
              <div className="space-y-2 text-sm">
                <SummaryRow label="Item" value={itemName} />
                <SummaryRow label="Category" value={category} />
                <SummaryRow label="Date Lost" value={dateLost} />
                <SummaryRow label="Location" value={lastSeenLocation} />
                <SummaryRow label="Reward" value={rewardOffered > 0 ? `R${rewardOffered}` : 'None'} />
                <SummaryRow label="Questions" value={`${verificationQuestions.filter(q => q.question.trim()).length}`} />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="btn-outline flex-1">Back</button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-primary flex-1"
              >
                {submitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-neutral-500">{label}</span>
      <span className="font-medium text-neutral-800">{value || '—'}</span>
    </div>
  );
}

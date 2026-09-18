import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { PageContainer, TopBar } from '@/components/Navigation';
import {
  AlertTriangle, Flag, ShieldAlert, UserX, MessageSquareWarning, Send, Check,
} from 'lucide-react';

const REPORT_REASONS = [
  { value: 'Suspicious Activity', icon: ShieldAlert, desc: 'Someone behaving suspiciously or trying to scam', color: 'bg-warning-50 text-warning-600' },
  { value: 'Fraud', icon: AlertTriangle, desc: 'Attempted fraud or false claims', color: 'bg-error-50 text-error-600' },
  { value: 'Harassment', icon: MessageSquareWarning, desc: 'Harassing or threatening messages', color: 'bg-error-50 text-error-600' },
  { value: 'Unsafe Behavior', icon: UserX, desc: 'Pressuring to meet in unsafe locations', color: 'bg-warning-50 text-warning-600' },
];

export function ReportUserPage() {
  const navigate = useNavigate();
  const location = useLocation() as unknown as { state?: { reportedUserId?: string; itemId?: string; itemType?: string } };
  const { user } = useAuth();
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reportedUserId = location.state?.reportedUserId;
  const itemId = location.state?.itemId;
  const itemType = location.state?.itemType;

  const handleSubmit = async () => {
    if (!user || !reason) return;
    setError(null);
    setSubmitting(true);
    const { error } = await supabase.from('user_reports').insert({
      reporter_id: user.id,
      reported_user_id: reportedUserId ?? null,
      item_id: itemId ?? null,
      item_type: itemType ?? null,
      reason,
      description: description.trim() || null,
      status: 'pending',
    });
    setSubmitting(false);
    if (error) {
      setError(error.message);
    } else {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <PageContainer>
        <TopBar title="Report User" showBack />
        <div className="px-5 pt-10 text-center">
          <div className="w-20 h-20 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-4 animate-scale-in">
            <Check className="w-10 h-10 text-success-600" />
          </div>
          <h2 className="font-display font-bold text-lg text-neutral-800 mb-2">Report Submitted</h2>
          <p className="text-sm text-neutral-500 mb-6">
            Thank you for helping keep our community safe. Our moderation team will review your report and take appropriate action.
          </p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary w-full">Back to Home</button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <TopBar title="Report User" showBack />

      <div className="px-5 pt-4 space-y-4">
        <div className="bg-error-50 border border-error-100 rounded-xl p-3 flex items-start gap-2">
          <Flag className="w-5 h-5 text-error-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-error-800">
            Report suspicious behavior, fraud, harassment, or unsafe conduct. All reports are confidential and reviewed by our moderation team.
          </p>
        </div>

        {error && (
          <div className="bg-error-50 border border-error-100 text-error-700 text-sm rounded-xl p-3">
            {error}
          </div>
        )}

        <div>
          <h3 className="font-semibold text-sm text-neutral-700 mb-3">What are you reporting?</h3>
          <div className="space-y-2">
            {REPORT_REASONS.map((r) => (
              <button
                key={r.value}
                onClick={() => setReason(r.value)}
                className={`w-full card p-4 flex items-center gap-3 text-left transition-all ${reason === r.value ? 'border-2 border-error-400 bg-error-50' : 'border border-neutral-100'}`}
              >
                <div className={`w-11 h-11 rounded-xl ${r.color} flex items-center justify-center flex-shrink-0`}>
                  <r.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-neutral-800">{r.value}</p>
                  <p className="text-xs text-neutral-500">{r.desc}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all ${reason === r.value ? 'border-error-500 bg-error-500' : 'border-neutral-300'}`}>
                  {reason === r.value && <Check className="w-3 h-3 text-white mx-auto" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Additional Details (Optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide more context about what happened..."
            rows={4}
            className="textarea"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!reason || submitting}
          className="btn-primary w-full !py-4"
        >
          {submitting ? (
            'Submitting...'
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit Report
            </>
          )}
        </button>

        <p className="text-center text-xs text-neutral-400">
          Your identity is protected. The reported user will not know who filed the report.
        </p>
      </div>
    </PageContainer>
  );
}

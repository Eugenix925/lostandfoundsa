import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { generatePresentation } from '@/lib/presentation';
import { PageContainer, TopBar } from '@/components/Navigation';
import { FileText, Download, Loader2, Check, ArrowRight, BarChart3, Users, ShieldCheck, Award } from 'lucide-react';

export function PresentationPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setError(null);
    setGenerating(true);
    try {
      const blob = await generatePresentation();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Lost-and-Found-SA-Presentation.pptx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDone(true);
      setGenerating(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate presentation');
      setGenerating(false);
    }
  };

  const slides = [
    { title: 'Title & Tagline', icon: FileText },
    { title: 'The Problem', icon: BarChart3 },
    { title: 'The Solution', icon: Check },
    { title: 'Target Users', icon: Users },
    { title: 'Platform Stats (Live)', icon: BarChart3 },
    { title: 'Safety Features', icon: ShieldCheck },
    { title: 'Rewards System', icon: Award },
    { title: 'Trust Leaderboard (Live)', icon: Award },
    { title: 'Recovery Stories (Live)', icon: Check },
    { title: 'Business Model', icon: BarChart3 },
    { title: 'Technology Stack', icon: FileText },
    { title: 'Call to Action', icon: ArrowRight },
  ];

  return (
    <PageContainer>
      <TopBar title="Presentation" showBack />

      <div className="px-5 pt-4 space-y-5">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-6 text-white text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-display font-bold text-xl mb-1">Lost & Found SA</h2>
          <p className="text-primary-100 text-sm mb-4">Investor & Partner Presentation</p>
          <p className="text-primary-100 text-xs leading-relaxed">
            A 12-slide PowerPoint presentation with live platform data, covering the problem, solution, safety features, rewards system, business model, and technology stack.
          </p>
        </div>

        {/* Live Data Badge */}
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary-100 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-secondary-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm text-neutral-800">Includes Live Data</p>
            <p className="text-xs text-neutral-500">Stats, leaderboard, and recovery stories are pulled from the database in real time</p>
          </div>
        </div>

        {/* Slide List */}
        <div>
          <h3 className="font-semibold text-sm text-neutral-700 mb-3">Presentation Contents (12 Slides)</h3>
          <div className="grid grid-cols-2 gap-2">
            {slides.map((slide, i) => (
              <div key={i} className="card p-3 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <slide.icon className="w-4 h-4 text-primary-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-neutral-400 font-medium">Slide {i + 1}</p>
                  <p className="text-xs font-medium text-neutral-700 truncate">{slide.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-error-50 border border-error-100 text-error-700 text-sm rounded-xl p-3">
            {error}
          </div>
        )}

        {/* Download Button */}
        {done ? (
          <div className="space-y-3">
            <div className="card p-5 text-center bg-success-50 border-success-100">
              <div className="w-12 h-12 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6 text-success-600" />
              </div>
              <p className="font-semibold text-sm text-success-700 mb-1">Presentation downloaded!</p>
              <p className="text-xs text-success-600">Check your downloads folder for the .pptx file</p>
            </div>
            <button onClick={() => handleGenerate()} className="btn-outline w-full">
              <Download className="w-4 h-4" />
              Download Again
            </button>
          </div>
        ) : (
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="btn-primary w-full !py-4"
          >
            {generating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Presentation...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Download PowerPoint
              </>
            )}
          </button>
        )}

        <p className="text-center text-xs text-neutral-400">
          The presentation is generated with live data from the platform database.
        </p>
      </div>
    </PageContainer>
  );
}

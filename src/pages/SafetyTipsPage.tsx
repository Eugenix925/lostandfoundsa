import { useNavigate } from 'react-router-dom';
import { PageContainer, TopBar } from '@/components/Navigation';
import {
  Users, MapPin, Lock, Flag, ShieldCheck, ChevronRight, AlertTriangle, Eye, HandHeart,
} from 'lucide-react';

const SAFETY_TIPS = [
  {
    icon: Users,
    title: 'Never meet strangers alone',
    description: 'Always bring a friend or family member when meeting someone to collect or return an item. If you must go alone, let someone know where you are going.',
    color: 'bg-error-50 text-error-600',
  },
  {
    icon: MapPin,
    title: 'Use verified collection points',
    description: 'Meet at one of our verified collection points like police stations, university security offices, or shopping centre security desks. These are safe, public locations.',
    color: 'bg-secondary-50 text-secondary-600',
  },
  {
    icon: Lock,
    title: 'Protect personal information',
    description: 'Never share your phone number, email address, home address, or banking details. All communication should stay within the app messaging system.',
    color: 'bg-primary-50 text-primary-600',
  },
  {
    icon: Flag,
    title: 'Report suspicious activity',
    description: 'If someone behaves suspiciously, pressures you, or seems fraudulent, report them immediately through the in-app report system. Our team reviews all reports.',
    color: 'bg-warning-50 text-warning-600',
  },
  {
    icon: Eye,
    title: 'Always verify ownership',
    description: 'Before returning an item, ask the claimant to answer verification questions only the true owner would know. This prevents items from going to the wrong person.',
    color: 'bg-accent-50 text-accent-700',
  },
  {
    icon: HandHeart,
    title: 'Trust your instincts',
    description: 'If something feels wrong, cancel the meeting. Your safety is always more important than recovering an item. There will always be another opportunity.',
    color: 'bg-purple-50 text-purple-600',
  },
];

export function SafetyTipsPage() {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <TopBar title="Safety Tips" showBack />

      <div className="px-5 pt-4 space-y-4">
        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-secondary-500 to-secondary-700 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg">Your Safety First</h2>
              <p className="text-secondary-100 text-xs">Guidelines for safe item recovery</p>
            </div>
          </div>
          <p className="text-secondary-100 text-sm mt-2">
            Lost & Found SA is built on trust and community. Follow these safety guidelines to protect yourself and others.
          </p>
        </div>

        {/* Tips */}
        <div className="space-y-3">
          {SAFETY_TIPS.map((tip, i) => (
            <div key={i} className="card p-4 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex gap-3">
                <div className={`w-11 h-11 rounded-xl ${tip.color} flex items-center justify-center flex-shrink-0`}>
                  <tip.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-neutral-800 mb-1">{tip.title}</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">{tip.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Emergency */}
        <div className="card p-4 border-error-200 bg-error-50">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-error-600" />
            <h3 className="font-semibold text-sm text-error-700">In an Emergency</h3>
          </div>
          <p className="text-xs text-error-600 mb-3">
            If you feel threatened or are in immediate danger, contact emergency services.
          </p>
          <div className="bg-white rounded-xl p-3 text-center">
            <p className="font-display font-bold text-2xl text-error-600">10111</p>
            <p className="text-xs text-neutral-500">South African Police Emergency Line</p>
          </div>
        </div>

        {/* Links */}
        <button
          onClick={() => navigate('/collection-points')}
          className="w-full bg-primary-500 rounded-2xl p-4 flex items-center gap-3 active:scale-[0.98] transition-transform"
        >
          <MapPin className="w-5 h-5 text-white" />
          <div className="flex-1 text-left">
            <p className="font-semibold text-white text-sm">Find Collection Points</p>
            <p className="text-primary-100 text-xs">Safe locations for item handovers</p>
          </div>
          <ChevronRight className="w-5 h-5 text-white/60" />
        </button>
      </div>
    </PageContainer>
  );
}

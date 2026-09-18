import { useNavigate } from 'react-router-dom';
import { Search, ShieldCheck, Heart, Award, ArrowRight } from 'lucide-react';

export function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-500 via-primary-600 to-primary-700 flex flex-col">
      {/* Decorative shapes */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-20 translate-x-20" />
      <div className="absolute top-40 left-0 w-40 h-40 bg-accent-400/10 rounded-full -translate-x-10" />

      <div className="relative flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-8">
        {/* Logo */}
        <div className="animate-scale-in mb-6">
          <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center">
            <div className="relative">
              <Search className="w-12 h-12 text-primary-600" strokeWidth={2.5} />
              <Heart className="w-6 h-6 text-accent-500 absolute -bottom-1 -right-1 fill-accent-500" />
            </div>
          </div>
        </div>

        <div className="text-center mb-2 animate-fade-in">
          <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">
            Lost & Found SA
          </h1>
          <p className="text-primary-100 text-sm mt-2 font-medium">
            Helping South Africans reunite with what matters.
          </p>
        </div>

        <div className="w-full max-w-sm mt-10 space-y-3 animate-slide-up">
          <FeatureRow icon={Search} title="Report & Search" desc="Post lost or found items instantly" />
          <FeatureRow icon={ShieldCheck} title="Safe & Secure" desc="Anonymous messaging, verified collection points" />
          <FeatureRow icon={Award} title="Earn Rewards" desc="Get trust points for returning items" />
        </div>
      </div>

      <div className="relative px-6 pb-8 space-y-3 animate-slide-up">
        <button
          onClick={() => navigate('/login')}
          className="w-full bg-white text-primary-700 font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          Login
          <ArrowRight className="w-5 h-5" />
        </button>
        <button
          onClick={() => navigate('/register')}
          className="w-full bg-primary-800/40 backdrop-blur text-white font-bold py-4 rounded-2xl border-2 border-white/30 active:scale-95 transition-transform"
        >
          Create Account
        </button>
        <p className="text-center text-primary-100 text-xs mt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

function FeatureRow({ icon: Icon, title, desc }: { icon: typeof Search; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-4 bg-white/10 backdrop-blur rounded-2xl p-4">
      <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="font-semibold text-white text-sm">{title}</p>
        <p className="text-primary-100 text-xs">{desc}</p>
      </div>
    </div>
  );
}

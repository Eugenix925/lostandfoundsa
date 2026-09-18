import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Heart, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      navigate('/dashboard');
    }
  };

  const fillDemo = () => {
    setEmail('thandiwe@lostandfound.co.za');
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <div className="bg-gradient-to-b from-primary-500 to-primary-600 pt-12 pb-20 px-6 rounded-b-3xl">
        <button onClick={() => navigate('/')} className="text-white/80 mb-6 flex items-center gap-1 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
            <div className="relative">
              <Search className="w-7 h-7 text-primary-600" strokeWidth={2.5} />
              <Heart className="w-3.5 h-3.5 text-accent-500 absolute -bottom-0.5 -right-0.5 fill-accent-500" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-white">Lost & Found SA</h1>
            <p className="text-primary-100 text-xs">Welcome back</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 -mt-10">
        <div className="card p-6 animate-slide-up">
          <h2 className="font-display font-bold text-xl text-neutral-800 mb-1">Login to your account</h2>
          <p className="text-neutral-500 text-sm mb-6">Enter your details to continue</p>

          {error && (
            <div className="bg-error-50 border border-error-100 text-error-700 text-sm rounded-xl p-3 mb-4 animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="input pl-11"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="input pl-11 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full !py-4">
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <button
            onClick={fillDemo}
            className="w-full text-center text-sm text-secondary-600 mt-4 py-2 rounded-lg hover:bg-secondary-50 transition-colors"
          >
            Use demo account
          </button>

          <p className="text-center text-sm text-neutral-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </div>

        <div className="mt-4 bg-accent-50 border border-accent-100 rounded-xl p-3 text-center">
          <p className="text-xs text-accent-800">
            Demo login: <span className="font-mono font-semibold">thandiwe@lostandfound.co.za</span> / <span className="font-mono font-semibold">password123</span>
          </p>
        </div>
      </div>
    </div>
  );
}

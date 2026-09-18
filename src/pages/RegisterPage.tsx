import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Heart, User, Mail, Lock, Eye, EyeOff, ArrowLeft, ShieldCheck } from 'lucide-react';

export function RegisterPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, fullName);
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <div className="bg-gradient-to-b from-secondary-500 to-secondary-600 pt-12 pb-20 px-6 rounded-b-3xl">
        <button onClick={() => navigate('/')} className="text-white/80 mb-6 flex items-center gap-1 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
            <div className="relative">
              <Search className="w-7 h-7 text-secondary-600" strokeWidth={2.5} />
              <Heart className="w-3.5 h-3.5 text-accent-500 absolute -bottom-0.5 -right-0.5 fill-accent-500" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-white">Lost & Found SA</h1>
            <p className="text-secondary-100 text-xs">Join our community</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 -mt-10">
        <div className="card p-6 animate-slide-up">
          <h2 className="font-display font-bold text-xl text-neutral-800 mb-1">Create your account</h2>
          <p className="text-neutral-500 text-sm mb-6">Start helping your community today</p>

          {error && (
            <div className="bg-error-50 border border-error-100 text-error-700 text-sm rounded-xl p-3 mb-4 animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-5 h-5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Thandiwe Mokoena"
                  required
                  className="input pl-11"
                />
              </div>
            </div>

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
                  placeholder="At least 6 characters"
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

            <div className="flex items-start gap-2 bg-primary-50 rounded-xl p-3">
              <ShieldCheck className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-primary-700">
                Your personal information (phone number, email) is never shared with other users. All communication happens securely within the app.
              </p>
            </div>

            <button type="submit" disabled={loading} className="btn-secondary w-full !py-4">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-neutral-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

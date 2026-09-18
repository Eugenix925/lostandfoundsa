import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, MessageSquare, User, Plus, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function BottomNav() {
  const navigate = useNavigate();
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  const navItems = [
    { to: '/dashboard', icon: Home, label: 'Home' },
    { to: '/browse', icon: Search, label: 'Browse' },
    { to: '/messages', icon: MessageSquare, label: 'Messages' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <>
      {showQuickMenu && (
        <div
          className="fixed inset-0 bg-black/40 z-40 animate-fade-in"
          onClick={() => setShowQuickMenu(false)}
        />
      )}

      {showQuickMenu && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="card p-2 w-48 shadow-lg">
            <button
              onClick={() => { setShowQuickMenu(false); navigate('/report-lost'); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-error-50 transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-full bg-error-100 flex items-center justify-center">
                <Plus className="w-5 h-5 text-error-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-neutral-800">Report Lost</p>
                <p className="text-xs text-neutral-500">Lost something?</p>
              </div>
            </button>
            <button
              onClick={() => { setShowQuickMenu(false); navigate('/report-found'); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-success-50 transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-full bg-success-100 flex items-center justify-center">
                <Plus className="w-5 h-5 text-success-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-neutral-800">Report Found</p>
                <p className="text-xs text-neutral-500">Found something?</p>
              </div>
            </button>
            <button
              onClick={() => { setShowQuickMenu(false); navigate('/collection-points'); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary-50 transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-full bg-secondary-100 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-secondary-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-neutral-800">Safe Points</p>
                <p className="text-xs text-neutral-500">Collection locations</p>
              </div>
            </button>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-neutral-200 safe-area-bottom">
        <div className="max-w-md mx-auto flex items-center justify-around px-2 py-1.5 relative">
          {navItems.slice(0, 2).map((item) => (
            <NavItem key={item.to} {...item} />
          ))}

          <button
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            className="flex flex-col items-center -mt-6"
            aria-label="Quick actions"
          >
            <div className={`w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center shadow-lg transition-transform duration-300 ${showQuickMenu ? 'rotate-45' : ''}`}>
              <Plus className="w-7 h-7" />
            </div>
          </button>

          {navItems.slice(2).map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </div>
      </nav>
    </>
  );
}

function NavItem({ to, icon: Icon, label }: { to: string; icon: typeof Home; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-colors ${
          isActive ? 'text-primary-600' : 'text-neutral-400'
        }`
      }
    >
      <Icon className="w-6 h-6" />
      <span className="text-[10px] font-medium">{label}</span>
    </NavLink>
  );
}

export function TopBar({ title, showBack, rightAction }: { title: string; showBack?: boolean; rightAction?: React.ReactNode }) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-neutral-100">
      <div className="max-w-md mx-auto flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-neutral-100 transition-colors -ml-2"
            >
              <svg className="w-5 h-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <h1 className="font-display font-bold text-lg text-neutral-800">{title}</h1>
        </div>
        {rightAction}
      </div>
    </header>
  );
}

export function PageContainer({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`min-h-screen bg-neutral-50 ${className}`}>
      <div className="max-w-md mx-auto pb-24">{children}</div>
    </div>
  );
}

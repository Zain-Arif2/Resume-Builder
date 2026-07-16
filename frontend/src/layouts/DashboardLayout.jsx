import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LayoutGrid, User, LogOut, Users, BarChart3, ScrollText, CreditCard, Menu, X, Sparkles } from 'lucide-react';
import { selectCurrentUser, forceLogout } from '@/features/auth/authSlice';
import { useLogoutMutation } from '@/features/auth/authApi';
import ThemeToggle from '@/components/common/ThemeToggle';

const mainNav = [
  { to: '/dashboard', label: 'Resumes', icon: LayoutGrid },
  { to: '/pricing', label: 'Pricing', icon: Sparkles },
  { to: '/profile', label: 'Profile', icon: User },
];

const adminNav = [
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/plans', label: 'Plans', icon: CreditCard },
  { to: '/admin/logs', label: 'Logs', icon: ScrollText },
];

function NavLink({ to, label, icon: Icon, active, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
        active ? 'bg-amber-dim text-ink' : 'text-slate hover:text-ink hover:bg-paper-dim'
      }`}
    >
      <Icon size={17} />
      {label}
    </Link>
  );
}

function CreditIndicator() {
  const user = useSelector(selectCurrentUser);
  if (!user) return null;

  if (user.plan === 'pro') {
    return (
      <div className="flex items-center gap-2 bg-emerald-dim text-emerald px-3 py-2.5 rounded-xl text-xs font-medium min-w-0">
        <Sparkles size={13} className="shrink-0" /> <span className="truncate">Pro — Unlimited</span>
      </div>
    );
  }

  const remaining = user.resumeCredits ?? 0;
  const isLow = remaining === 0;

  return (
    <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium min-w-0 ${isLow ? 'bg-danger-dim text-danger' : 'bg-amber-dim text-ink'}`}>
      <Sparkles size={13} className={`shrink-0 ${isLow ? 'text-danger' : 'text-amber'}`} />
      <span className="truncate">{remaining} / 2 credits</span>
    </div>
  );
}

function SidebarContent({ onNavigate }) {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    await logout();
    dispatch(forceLogout());
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-full">
      <Link to="/dashboard" className="font-display font-semibold text-xl text-ink tracking-tight px-1 mb-8 block">
        Resume<span className="text-amber">AI</span>
      </Link>

      <nav className="flex-1 space-y-1">
        {mainNav.map((item) => (
          <NavLink key={item.to} {...item} active={location.pathname === item.to} onClick={onNavigate} />
        ))}

        {user?.role === 'admin' && (
          <>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate/50 px-3.5 pt-6 pb-2">Admin</p>
            {adminNav.map((item) => (
              <NavLink key={item.to} {...item} active={location.pathname === item.to} onClick={onNavigate} />
            ))}
          </>
        )}
      </nav>

      <div className="space-y-3 pt-4 border-t border-slate/10">
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0"><CreditIndicator /></div>
          <ThemeToggle />
        </div>

        <div className="flex items-center justify-between gap-2 px-1">
          <div className="min-w-0">
            <p className="text-sm font-medium text-ink truncate">{user?.name}</p>
            <p className="text-xs text-slate truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="text-slate hover:text-danger transition shrink-0"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-paper-dim lg:flex">
      <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 bg-paper border-r border-slate/10 p-5 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

<div className="lg:hidden sticky top-0 z-40 bg-paper border-b border-slate/10 flex items-center justify-between gap-2 pl-5 pr-4 h-14">       <Link to="/dashboard" className="font-display font-semibold text-base text-ink tracking-tight shrink-0">
          Resume<span className="text-amber">AI</span>
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button onClick={() => setMobileOpen(true)} className="text-ink p-1.5">
            <Menu size={22} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative bg-paper w-[80vw] max-w-72 h-full p-5 flex flex-col">
            <button onClick={() => setMobileOpen(false)} className="self-end text-slate hover:text-ink mb-4">
              <X size={20} />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="max-w-7xl mx-auto w-full">{children}</div>
      </main>
    </div>
  );
}

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LayoutGrid, User, LogOut, Users, BarChart3, ScrollText } from 'lucide-react';
import { selectCurrentUser, forceLogout } from '@/features/auth/authSlice';
import { useLogoutMutation } from '@/features/auth/authApi';

export default function DashboardLayout({ children }) {
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

  const navItems = [
    { to: '/dashboard', label: 'Resumes', icon: LayoutGrid },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  const adminNavItems = [
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/admin/logs', label: 'Logs', icon: ScrollText },
  ];

  return (
    <div className="min-h-screen bg-paper-dim">
      <header className="sticky top-0 z-40 bg-paper border-b border-slate/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="font-display font-semibold text-xl text-ink tracking-tight">
            Resume<span className="text-amber">AI</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  location.pathname === to ? 'bg-amber-dim text-ink' : 'text-slate hover:text-ink hover:bg-paper-dim'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
            {user?.role === 'admin' && (
              <>
                <span className="w-px h-5 bg-slate/20 mx-1" />
                {adminNavItems.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                      location.pathname === to ? 'bg-amber-dim text-ink' : 'text-slate hover:text-ink hover:bg-paper-dim'
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                ))}
              </>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm font-medium text-ink">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-danger hover:bg-danger-dim transition"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}

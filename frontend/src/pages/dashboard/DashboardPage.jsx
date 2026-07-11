import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCurrentUser, forceLogout } from '@/features/auth/authSlice';
import { useLogoutMutation } from '@/features/auth/authApi';

export default function DashboardPage() {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    await logout();
    dispatch(forceLogout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-paper-dim p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-display text-2xl font-semibold text-ink">Welcome, {user?.name}</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-danger-dim text-danger rounded-xl hover:opacity-80 transition font-medium"
          >
            Logout
          </button>
        </div>
        <div className="bg-paper rounded-2xl shadow-sm border border-slate/10 p-6">
          <p className="text-slate">Dashboard content coming soon, your resumes will show here.</p>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Search, Trash2, Shield, ShieldOff, Plus, RotateCcw, ArrowUpCircle, ArrowDownCircle, Users, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '@/layouts/DashboardLayout';
import PageLoader from '@/components/common/PageLoader';
import {
  useListUsersQuery,
  useUpdateUserRoleMutation,
  useToggleUserActiveMutation,
  useDeleteUserMutation,
  useIncreaseCreditsMutation,
  useResetCreditsMutation,
  useUpgradeToProMutation,
  useDowngradeToFreeMutation,
} from '@/features/admin/adminApi';

function confirmToast(message) {
  return new Promise((resolve) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-ink">{message}</p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => { toast.dismiss(t.id); resolve(false); }}
              className="text-xs font-medium text-slate px-3 py-1.5 rounded-lg border border-slate/20 hover:border-slate/40"
            >
              Cancel
            </button>
            <button
              onClick={() => { toast.dismiss(t.id); resolve(true); }}
              className="text-xs font-medium text-paper bg-ink px-3 py-1.5 rounded-lg hover:bg-ink-light"
            >
              Confirm
            </button>
          </div>
        </div>
      ),
      { duration: 10000 }
    );
  });
}

function promptToast(message, defaultValue) {
  return new Promise((resolve) => {
    let value = defaultValue;
    toast(
      (t) => (
        <div className="flex flex-col gap-3 min-w-[220px]">
          <p className="text-sm text-ink">{message}</p>
          <input
            type="number"
            defaultValue={defaultValue}
            min="1"
            autoFocus
            onChange={(e) => (value = e.target.value)}
            className="px-3 py-2 border border-slate/20 rounded-lg text-sm outline-none focus:border-amber"
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => { toast.dismiss(t.id); resolve(null); }}
              className="text-xs font-medium text-slate px-3 py-1.5 rounded-lg border border-slate/20 hover:border-slate/40"
            >
              Cancel
            </button>
            <button
              onClick={() => { toast.dismiss(t.id); resolve(value); }}
              className="text-xs font-medium text-paper bg-ink px-3 py-1.5 rounded-lg hover:bg-ink-light"
            >
              Confirm
            </button>
          </div>
        </div>
      ),
      { duration: 15000 }
    );
  });
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useListUsersQuery({ page, limit: 15, search });
  const [updateRole] = useUpdateUserRoleMutation();
  const [toggleActive] = useToggleUserActiveMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [increaseCredits] = useIncreaseCreditsMutation();
  const [resetCredits] = useResetCreditsMutation();
  const [upgradeToPro] = useUpgradeToProMutation();
  const [downgradeToFree] = useDowngradeToFreeMutation();

  const users = data?.data?.users || [];
  const total = data?.data?.total || 0;
  const pages = data?.data?.pages || 1;

  const handleRoleToggle = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    await updateRole({ id: user._id, role: newRole }).unwrap();
    toast.success(`${user.name} is now ${newRole}`);
  };

  const handleStatusToggle = async (user) => {
    await toggleActive({ id: user._id, isActive: !user.isActive }).unwrap();
    toast.success(`${user.name} ${user.isActive ? 'disabled' : 'enabled'}`);
  };

  const handleDelete = async (user) => {
    const ok = await confirmToast(`Delete ${user.name}? This cannot be undone.`);
    if (!ok) return;
    await deleteUser(user._id).unwrap();
    toast.success(`${user.name} deleted`);
  };

  const handleIncreaseCredits = async (user) => {
    const amount = await promptToast(`How many credits to add for ${user.name}?`, 2);
    const parsed = parseInt(amount, 10);
    if (parsed > 0) {
      await increaseCredits({ id: user._id, amount: parsed }).unwrap();
      toast.success(`Added ${parsed} credits to ${user.name}`);
    }
  };

  const handleResetCredits = async (user) => {
    const ok = await confirmToast(`Reset ${user.name}'s credits to 2?`);
    if (!ok) return;
    await resetCredits({ id: user._id, amount: 2 }).unwrap();
    toast.success(`${user.name}'s credits reset`);
  };

  const handleUpgrade = async (user) => {
    const ok = await confirmToast(`Upgrade ${user.name} to Pro?`);
    if (!ok) return;
    await upgradeToPro(user._id).unwrap();
    toast.success(`${user.name} upgraded to Pro`);
  };

  const handleDowngrade = async (user) => {
    const ok = await confirmToast(`Downgrade ${user.name} to Free? Credits will reset to 2.`);
    if (!ok) return;
    await downgradeToFree(user._id).unwrap();
    toast.success(`${user.name} downgraded to Free`);
  };

  if (isError) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-danger-dim flex items-center justify-center mb-4">
            <AlertTriangle size={22} className="text-danger" />
          </div>
          <h2 className="font-display text-lg font-semibold text-ink mb-1">Could not load users</h2>
          <p className="text-slate text-sm max-w-sm">
            {error?.data?.message || 'You may not have admin access with your current session. Try logging out and back in.'}
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-2 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">User Management</h1>
          <p className="flex items-center gap-1.5 text-slate text-sm mt-1">
            <Users size={14} />
            {total} total user{total !== 1 ? 's' : ''} registered
          </p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate/50" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or email"
            className="pl-9 pr-4 py-2 bg-paper border border-slate/15 rounded-lg text-sm text-ink focus:ring-2 focus:ring-amber/40 focus:border-amber outline-none transition w-64"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="mt-6"><PageLoader /></div>
      ) : (
        <div className="bg-paper border border-slate/10 rounded-2xl overflow-x-auto mt-6">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-paper-dim text-slate text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Name</th>
                <th className="text-left px-5 py-3 font-medium">Email</th>
                <th className="text-left px-5 py-3 font-medium">Role</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Plan</th>
                <th className="text-left px-5 py-3 font-medium">Credits</th>
                <th className="text-left px-5 py-3 font-medium">Generated</th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate/10">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-5 py-3 font-medium text-ink whitespace-nowrap">{user.name}</td>
                  <td className="px-5 py-3 text-slate whitespace-nowrap">{user.email}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-md ${user.role === 'admin' ? 'bg-amber-dim text-amber' : 'bg-paper-dim text-slate'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-md ${user.isActive ? 'bg-emerald-dim text-emerald' : 'bg-danger-dim text-danger'}`}>
                      {user.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-md ${user.plan === 'pro' ? 'bg-emerald-dim text-emerald' : 'bg-paper-dim text-slate'}`}>
                      {user.plan === 'pro' ? 'PRO' : 'FREE'}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-slate">
                    {user.plan === 'pro' ? '∞' : `${user.resumeCredits ?? 0} / 2`}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-slate">{user.totalResumeGenerated ?? 0}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1.5 flex-wrap">
                      <button onClick={() => handleIncreaseCredits(user)} title="Increase credits" className="text-slate hover:text-emerald transition">
                        <Plus size={15} />
                      </button>
                      <button onClick={() => handleResetCredits(user)} title="Reset credits" className="text-slate hover:text-amber transition">
                        <RotateCcw size={14} />
                      </button>
                      {user.plan === 'pro' ? (
                        <button onClick={() => handleDowngrade(user)} title="Downgrade to Free" className="text-slate hover:text-danger transition">
                          <ArrowDownCircle size={15} />
                        </button>
                      ) : (
                        <button onClick={() => handleUpgrade(user)} title="Upgrade to Pro" className="text-slate hover:text-emerald transition">
                          <ArrowUpCircle size={15} />
                        </button>
                      )}
                      <button onClick={() => handleRoleToggle(user)} title="Toggle admin role" className="text-slate hover:text-amber transition">
                        {user.role === 'admin' ? <ShieldOff size={15} /> : <Shield size={15} />}
                      </button>
                      <button onClick={() => handleStatusToggle(user)} title="Toggle active status" className="text-xs font-medium text-slate hover:text-ink transition px-1">
                        {user.isActive ? 'Disable' : 'Enable'}
                      </button>
                      <button onClick={() => handleDelete(user)} title="Delete user" className="text-slate hover:text-danger transition">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-slate text-sm">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-5">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition ${p === page ? 'bg-ink text-paper' : 'text-slate hover:bg-paper-dim'}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

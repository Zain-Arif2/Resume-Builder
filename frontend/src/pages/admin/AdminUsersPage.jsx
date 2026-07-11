import { useState } from 'react';
import { Search, Trash2, Shield, ShieldOff } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import PageLoader from '@/components/common/PageLoader';
import {
  useListUsersQuery,
  useUpdateUserRoleMutation,
  useToggleUserActiveMutation,
  useDeleteUserMutation,
} from '@/features/admin/adminApi';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useListUsersQuery({ page, limit: 15, search });
  const [updateRole] = useUpdateUserRoleMutation();
  const [toggleActive] = useToggleUserActiveMutation();
  const [deleteUser] = useDeleteUserMutation();

  const users = data?.data?.users || [];
  const pages = data?.data?.pages || 1;

  const handleRoleToggle = (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    updateRole({ id: user._id, role: newRole });
  };

  const handleStatusToggle = (user) => {
    toggleActive({ id: user._id, isActive: !user.isActive });
  };

  const handleDelete = (user) => {
    if (confirm(`Delete ${user.name}? This cannot be undone.`)) {
      deleteUser(user._id);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink">User Management</h1>
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
        <PageLoader />
      ) : (
        <div className="bg-paper border border-slate/10 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-paper-dim text-slate text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Name</th>
                <th className="text-left px-5 py-3 font-medium">Email</th>
                <th className="text-left px-5 py-3 font-medium">Role</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Joined</th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate/10">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-5 py-3 font-medium text-ink">{user.name}</td>
                  <td className="px-5 py-3 text-slate">{user.email}</td>
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
                  <td className="px-5 py-3 text-slate font-mono text-xs">
                    {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleRoleToggle(user)} title="Toggle admin role" className="text-slate hover:text-amber transition">
                        {user.role === 'admin' ? <ShieldOff size={15} /> : <Shield size={15} />}
                      </button>
                      <button onClick={() => handleStatusToggle(user)} title="Toggle active status" className="text-xs font-medium text-slate hover:text-ink transition px-2">
                        {user.isActive ? 'Disable' : 'Enable'}
                      </button>
                      <button onClick={() => handleDelete(user)} title="Delete user" className="text-slate hover:text-danger transition">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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

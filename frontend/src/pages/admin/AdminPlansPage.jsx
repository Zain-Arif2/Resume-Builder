import { useState } from 'react';
import { Plus, Trash2, Edit2, X } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import PageLoader from '@/components/common/PageLoader';
import {
  useListAllPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
} from '@/features/plans/planApi';

const emptyForm = {
  name: '',
  slug: '',
  description: '',
  priceUSD: '',
  type: 'subscription',
  credits: '',
  interval: 'month',
  isActive: true,
};

export default function AdminPlansPage() {
  const { data, isLoading } = useListAllPlansQuery();
  const [createPlan, { isLoading: isCreating }] = useCreatePlanMutation();
  const [updatePlan] = useUpdatePlanMutation();
  const [deletePlan] = useDeletePlanMutation();

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const plans = data?.data?.plans || [];

  const openCreateForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError('');
    setFormOpen(true);
  };

  const openEditForm = (plan) => {
    setForm({
      name: plan.name,
      slug: plan.slug,
      description: plan.description || '',
      priceUSD: plan.priceUSD,
      type: plan.type,
      credits: plan.credits || '',
      interval: plan.interval || 'month',
      isActive: plan.isActive,
    });
    setEditingId(plan._id);
    setError('');
    setFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      priceUSD: Number(form.priceUSD),
      type: form.type,
      isActive: form.isActive,
      credits: form.type === 'one_time' ? Number(form.credits) : null,
      interval: form.type === 'subscription' ? form.interval : null,
    };

    try {
      if (editingId) {
        await updatePlan({ id: editingId, ...payload }).unwrap();
      } else {
        await createPlan(payload).unwrap();
      }
      setFormOpen(false);
    } catch (err) {
      setError(err?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = (plan) => {
    if (confirm(`Delete plan "${plan.name}"?`)) {
      deletePlan(plan._id);
    }
  };

  const handleToggleActive = (plan) => {
    updatePlan({ id: plan._id, isActive: !plan.isActive });
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink">Plans & Pricing</h1>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 bg-ink text-paper px-4 py-2.5 rounded-xl font-medium hover:bg-ink-light transition text-sm"
        >
          <Plus size={16} /> New Plan
        </button>
      </div>

      {isLoading ? (
        <PageLoader />
      ) : (
        <div className="bg-paper border border-slate/10 rounded-2xl overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead className="bg-paper-dim text-slate text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Name</th>
                <th className="text-left px-5 py-3 font-medium">Type</th>
                <th className="text-left px-5 py-3 font-medium">Price</th>
                <th className="text-left px-5 py-3 font-medium">Credits / Interval</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate/10">
              {plans.map((plan) => (
                <tr key={plan._id}>
                  <td className="px-5 py-3 font-medium text-ink">{plan.name}</td>
                  <td className="px-5 py-3 text-slate capitalize">{plan.type.replace('_', ' ')}</td>
                  <td className="px-5 py-3 font-mono text-xs text-slate">${plan.priceUSD}</td>
                  <td className="px-5 py-3 font-mono text-xs text-slate">
                    {plan.type === 'subscription' ? `/${plan.interval}` : `${plan.credits} credits`}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => handleToggleActive(plan)}
                      className={`text-xs font-medium px-2 py-1 rounded-md transition ${
                        plan.isActive ? 'bg-emerald-dim text-emerald' : 'bg-danger-dim text-danger'
                      }`}
                    >
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEditForm(plan)} className="text-slate hover:text-ink transition">
                        <Edit2 size={15} />
                      </button>
                      <button onClick={() => handleDelete(plan)} className="text-slate hover:text-danger transition">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {plans.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate text-sm">No plans yet. Create one to get started.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-paper rounded-2xl p-6 max-w-md w-full relative max-h-[85vh] overflow-y-auto">
            <button onClick={() => setFormOpen(false)} className="absolute top-4 right-4 text-slate hover:text-ink transition">
              <X size={18} />
            </button>

            <h2 className="font-display text-lg font-semibold text-ink mb-5">
              {editingId ? 'Edit Plan' : 'New Plan'}
            </h2>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-danger-dim text-danger text-sm font-medium">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate mb-1.5">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-paper-dim border border-slate/15 rounded-lg text-sm text-ink focus:ring-2 focus:ring-amber/40 focus:border-amber outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate mb-1.5">Slug (unique, lowercase)</label>
                <input
                  required
                  disabled={!!editingId}
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="pro-monthly"
                  className="w-full px-3.5 py-2.5 bg-paper-dim border border-slate/15 rounded-lg text-sm text-ink focus:ring-2 focus:ring-amber/40 focus:border-amber outline-none transition disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate mb-1.5">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-paper-dim border border-slate/15 rounded-lg text-sm text-ink focus:ring-2 focus:ring-amber/40 focus:border-amber outline-none transition resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate mb-1.5">Price (USD)</label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.priceUSD}
                    onChange={(e) => setForm({ ...form, priceUSD: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-paper-dim border border-slate/15 rounded-lg text-sm text-ink focus:ring-2 focus:ring-amber/40 focus:border-amber outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate mb-1.5">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-paper-dim border border-slate/15 rounded-lg text-sm text-ink focus:ring-2 focus:ring-amber/40 focus:border-amber outline-none transition"
                  >
                    <option value="subscription">Subscription</option>
                    <option value="one_time">One-time (Credits)</option>
                  </select>
                </div>
              </div>

              {form.type === 'subscription' ? (
                <div>
                  <label className="block text-xs font-medium text-slate mb-1.5">Billing Interval</label>
                  <select
                    value={form.interval}
                    onChange={(e) => setForm({ ...form, interval: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-paper-dim border border-slate/15 rounded-lg text-sm text-ink focus:ring-2 focus:ring-amber/40 focus:border-amber outline-none transition"
                  >
                    <option value="month">Monthly</option>
                    <option value="year">Yearly</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-slate mb-1.5">Credits Granted</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={form.credits}
                    onChange={(e) => setForm({ ...form, credits: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-paper-dim border border-slate/15 rounded-lg text-sm text-ink focus:ring-2 focus:ring-amber/40 focus:border-amber outline-none transition"
                  />
                </div>
              )}

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 accent-amber"
                />
                <span className="text-sm text-ink">Active (visible on pricing page)</span>
              </label>

              <button
                type="submit"
                disabled={isCreating}
                className="w-full bg-ink text-paper py-2.5 rounded-xl font-medium hover:bg-ink-light disabled:opacity-50 transition"
              >
                {editingId ? 'Save Changes' : 'Create Plan'}
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

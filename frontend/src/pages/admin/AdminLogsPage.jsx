import DashboardLayout from '@/layouts/DashboardLayout';
import PageLoader from '@/components/common/PageLoader';
import { useGetSystemLogsQuery } from '@/features/admin/adminApi';

export default function AdminLogsPage() {
  const { data, isLoading } = useGetSystemLogsQuery();
  const logs = data?.data?.logs || [];

  return (
    <DashboardLayout>
      <h1 className="font-display text-2xl font-semibold text-ink mb-6">System Logs</h1>
      <p className="text-slate text-sm mb-5">Recent AI provider requests across all users.</p>

      {isLoading ? (
        <PageLoader />
      ) : (
        <div className="bg-paper border border-slate/10 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-paper-dim text-slate text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-3 font-medium">User</th>
                <th className="text-left px-5 py-3 font-medium">Feature</th>
                <th className="text-left px-5 py-3 font-medium">Model</th>
                <th className="text-left px-5 py-3 font-medium">Tokens</th>
                <th className="text-left px-5 py-3 font-medium">Duration</th>
                <th className="text-left px-5 py-3 font-medium">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate/10">
              {logs.map((log) => (
                <tr key={log._id}>
                  <td className="px-5 py-3 text-ink">{log.user?.name || 'Unknown'}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-medium bg-amber-dim text-amber px-2 py-1 rounded-md">{log.feature}</span>
                  </td>
                  <td className="px-5 py-3 text-slate font-mono text-xs">{log.model}</td>
                  <td className="px-5 py-3 text-slate font-mono text-xs">{log.totalTokens}</td>
                  <td className="px-5 py-3 text-slate font-mono text-xs">{log.durationMs}ms</td>
                  <td className="px-5 py-3 text-slate font-mono text-xs">
                    {new Date(log.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate text-sm">No AI activity yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}

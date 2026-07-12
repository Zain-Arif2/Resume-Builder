import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import DashboardLayout from '@/layouts/DashboardLayout';
import PageLoader from '@/components/common/PageLoader';
import StatCard from '@/components/dashboard/StatCard';
import { useGetAnalyticsQuery } from '@/features/admin/adminApi';

export default function AdminAnalyticsPage() {
  const { data, isLoading } = useGetAnalyticsQuery();
  const analytics = data?.data?.analytics;

  if (isLoading) {
    return (
      <DashboardLayout>
        <PageLoader />
      </DashboardLayout>
    );
  }

  const signupChartData = (analytics?.signupsLast7Days || []).map((d) => ({ date: d._id.slice(5), count: d.count }));
  const featureChartData = (analytics?.aiUsageByFeature || []).map((f) => ({ feature: f._id, count: f.count }));

  return (
    <DashboardLayout>
      <h1 className="font-display text-2xl font-semibold text-ink mb-6">Analytics</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="Total Users" value={analytics?.totalUsers ?? 0} />
        <StatCard label="Active (7 days)" value={analytics?.activeUsers7d ?? 0} />
        <StatCard label="Total Resumes" value={analytics?.totalResumes ?? 0} />
        <StatCard label="Public Resumes" value={analytics?.publicResumes ?? 0} />
        <StatCard label="AI Requests" value={analytics?.totalAIRequests ?? 0} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-paper border border-slate/10 rounded-2xl p-6">
          <h2 className="font-display font-semibold text-ink mb-4">Signups (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={signupChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="date" fontSize={11} stroke="#5B6472" />
              <YAxis fontSize={11} stroke="#5B6472" allowDecimals={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e5e5' }} />
              <Line type="monotone" dataKey="count" stroke="#F2A93B" strokeWidth={2.5} dot={{ fill: '#F2A93B' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-paper border border-slate/10 rounded-2xl p-6">
          <h2 className="font-display font-semibold text-ink mb-4">AI Feature Usage</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={featureChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="feature" fontSize={10} stroke="#5B6472" angle={-20} textAnchor="end" height={60} />
              <YAxis fontSize={11} stroke="#5B6472" allowDecimals={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e5e5' }} />
              <Bar dataKey="count" fill="#2F9E6E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
}

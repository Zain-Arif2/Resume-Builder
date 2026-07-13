import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '@/routes/ProtectedRoute';
import AdminRoute from '@/routes/AdminRoute';
import PageLoader from '@/components/common/PageLoader';

const HomePage = lazy(() => import('@/pages/HomePage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const VerifyOtpPage = lazy(() => import('@/pages/auth/VerifyOtpPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));
const ResumeBuilderPage = lazy(() => import('@/pages/dashboard/ResumeBuilderPage'));
const ProfilePage = lazy(() => import('@/pages/dashboard/ProfilePage'));
const PublicResumePage = lazy(() => import('@/pages/public/PublicResumePage'));
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage'));
const AdminAnalyticsPage = lazy(() => import('@/pages/admin/AdminAnalyticsPage'));
const AdminLogsPage = lazy(() => import('@/pages/admin/AdminLogsPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/r/:slug" element={<PublicResumePage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/resume/:id/edit" element={<ResumeBuilderPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          <Route element={<AdminRoute />}>
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
            <Route path="/admin/logs" element={<AdminLogsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

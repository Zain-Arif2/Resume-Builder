import AppRoutes from '@/routes/AppRoutes';
import UpgradeModal from '@/components/credits/UpgradeModal';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <ErrorBoundary>
      <AppRoutes />
      <UpgradeModal />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            background: 'var(--color-paper)',
            color: 'var(--color-ink)',
            border: '1px solid rgba(91,100,114,0.15)',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#2F9E6E', secondary: '#fff' } },
          error: { iconTheme: { primary: '#E5484D', secondary: '#fff' } },
        }}
      />
    </ErrorBoundary>
  );
}

export default App;

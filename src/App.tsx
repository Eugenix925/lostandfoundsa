import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { WelcomePage } from '@/pages/WelcomePage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ReportLostPage } from '@/pages/ReportLostPage';
import { ReportFoundPage } from '@/pages/ReportFoundPage';
import { BrowsePage } from '@/pages/BrowsePage';
import { ItemDetailsPage } from '@/pages/ItemDetailsPage';
import { MessagesPage } from '@/pages/MessagesPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { SafetyTipsPage } from '@/pages/SafetyTipsPage';
import { CollectionPointsPage } from '@/pages/CollectionPointsPage';
import { ReportUserPage } from '@/pages/ReportUserPage';
import { RecoveriesPage } from '@/pages/RecoveriesPage';
import { PresentationPage } from '@/pages/PresentationPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/report-lost" element={<ProtectedRoute><ReportLostPage /></ProtectedRoute>} />
          <Route path="/report-found" element={<ProtectedRoute><ReportFoundPage /></ProtectedRoute>} />
          <Route path="/browse" element={<ProtectedRoute><BrowsePage /></ProtectedRoute>} />
          <Route path="/item/:type/:id" element={<ProtectedRoute><ItemDetailsPage /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/safety-tips" element={<ProtectedRoute><SafetyTipsPage /></ProtectedRoute>} />
          <Route path="/collection-points" element={<ProtectedRoute><CollectionPointsPage /></ProtectedRoute>} />
          <Route path="/report-user" element={<ProtectedRoute><ReportUserPage /></ProtectedRoute>} />
          <Route path="/recoveries" element={<ProtectedRoute><RecoveriesPage /></ProtectedRoute>} />
          <Route path="/presentation" element={<ProtectedRoute><PresentationPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

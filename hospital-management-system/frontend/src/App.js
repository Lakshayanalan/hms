import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, CircularProgress, useTheme, useMediaQuery } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './motion/PageTransition';
import Sidebar from './components/Layout/Sidebar';
import ModernLogin from './pages/ModernLogin';
import PatientRegister from './pages/PatientRegister';
import Home from './pages/Home';
import Services from './pages/Services';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import AppointmentManagement from './pages/AppointmentManagement';
import MedicalRecordsManagement from './pages/MedicalRecordsManagement';
import BillingManagement from './pages/BillingManagement';
import ReportsManagement from './pages/ReportsManagement';
import UserManagement from './components/Admin/UserManagement';
import PatientRegistration from './components/Patient/PatientRegistration';
import PatientList from './components/Patient/PatientList';
import PatientProfile from './components/Patient/PatientProfile';
import PatientAppointments from './components/Patient/PatientAppointments';
import PatientMyProfile from './components/Patient/PatientMyProfile';
import { PatientBilling } from './components/Billing';
import RoleDashboard from './components/Dashboard/RoleDashboard';
import { ErrorBoundary } from './utils/ErrorHandling';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import modernTheme from './theme/modernTheme';
import './styles/design-system.css';



// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Main Layout Component
const MainLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, minHeight: '100vh', pt: isMobile ? 6 : 0 }}>
        <PageTransition>{children}</PageTransition>
      </Box>
    </Box>
  );
};

// App Routes Component (needs to be inside Router for useNavigate)
const AppRoutes = () => {
  const { isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (route) => {
    navigate(`/${route}`);
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
    <Routes location={location} key={location.pathname}>
      {/* Public Routes */}
      <Route path="/" element={<PageTransition><Home /></PageTransition>} />
      <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
      <Route path="/about" element={<PageTransition><AboutUs /></PageTransition>} />
      <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />

      {/* Login & Registration Routes */}
      <Route
        path="/login"
        element={
          isAuthenticated ?
            <Navigate to="/dashboard" replace /> :
            <PageTransition><ModernLogin /></PageTransition>
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ?
            <Navigate to="/dashboard" replace /> :
            <PageTransition><PatientRegister /></PageTransition>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <RoleDashboard userRole={userRole} onNavigate={handleNavigation} />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/patients"
        element={
          <ProtectedRoute>
            <MainLayout>
              <PatientList
                onNewPatient={() => handleNavigation('patients/register')}
                onEditPatient={(patient) => handleNavigation(`patients/${patient.patientId}/edit`)}
              />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/patients/register"
        element={
          <ProtectedRoute>
            <MainLayout>
              <PatientRegistration
                onSuccess={() => handleNavigation('patients')}
                onCancel={() => handleNavigation('patients')}
              />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/patients/:patientId/edit"
        element={
          <ProtectedRoute>
            <MainLayout>
              <PatientProfile
                onClose={() => handleNavigation('patients')}
                onUpdate={() => handleNavigation('patients')}
              />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <MainLayout>
              <UserManagement />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/appointments"
        element={
          <ProtectedRoute>
            <MainLayout>
              <AppointmentManagement />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/medical-records"
        element={
          <ProtectedRoute>
            <MainLayout>
              <MedicalRecordsManagement />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/billing"
        element={
          <ProtectedRoute>
            <MainLayout>
              <BillingManagement />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ReportsManagement />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Patient Portal Routes */}
      <Route
        path="/my-appointments"
        element={
          <ProtectedRoute>
            <MainLayout>
              <PatientAppointments />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <PatientMyProfile />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-billing"
        element={
          <ProtectedRoute>
            <MainLayout>
              <PatientBilling />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Default redirect for authenticated users */}
      <Route
        path="/home"
        element={
          <Navigate to="/" replace />
        }
      />

      {/* Catch all route */}
      <Route
        path="*"
        element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
        }
      />
    </Routes>
    </AnimatePresence>
  );
};

// Main App Component
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={modernTheme}>
        <CssBaseline />
        <AuthProvider>
          <WebSocketProvider>
            <Router>
              <AppRoutes />
            </Router>
          </WebSocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

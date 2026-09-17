import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ColorThemeProvider } from './context/ColorThemeContext';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './components/ui/Toast';
import { ProtectedRoute } from './routes/ProtectedRoute';

// Lazy-loaded so an anonymous visitor landing on "/" only downloads the
// Landing page, not the entire authenticated app (dashboard, jobs, market,
// etc.) up front. Each route becomes its own chunk, fetched on navigation.
const Landing = lazy(() => import('./pages/Landing/Landing').then((m) => ({ default: m.Landing })));
const Login = lazy(() => import('./pages/Login/Login').then((m) => ({ default: m.Login })));
const ForgotPassword = lazy(() => import('./pages/Login/ForgotPassword').then((m) => ({ default: m.ForgotPassword })));
const Signup = lazy(() => import('./pages/Signup/Signup').then((m) => ({ default: m.Signup })));
const Onboarding = lazy(() => import('./pages/Onboarding/Onboarding').then((m) => ({ default: m.Onboarding })));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard').then((m) => ({ default: m.Dashboard })));
const Profile = lazy(() => import('./pages/Profile/Profile').then((m) => ({ default: m.Profile })));
const Resume = lazy(() => import('./pages/Resume/Resume').then((m) => ({ default: m.Resume })));
const Careers = lazy(() => import('./pages/Careers/Careers').then((m) => ({ default: m.Careers })));
const CareerDetails = lazy(() => import('./pages/Careers/CareerDetails').then((m) => ({ default: m.CareerDetails })));
const SkillGap = lazy(() => import('./pages/SkillGap/SkillGap').then((m) => ({ default: m.SkillGap })));
const Roadmap = lazy(() => import('./pages/Roadmap/Roadmap').then((m) => ({ default: m.Roadmap })));
const Jobs = lazy(() => import('./pages/Jobs/Jobs').then((m) => ({ default: m.Jobs })));
const JobDetails = lazy(() => import('./pages/Jobs/JobDetails').then((m) => ({ default: m.JobDetails })));
const Market = lazy(() => import('./pages/Market/Market').then((m) => ({ default: m.Market })));
const Notifications = lazy(() => import('./pages/Notifications/Notifications').then((m) => ({ default: m.Notifications })));
const Settings = lazy(() => import('./pages/Settings/Settings').then((m) => ({ default: m.Settings })));

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas-light dark:bg-canvas-dark">
      <div
        role="status"
        aria-label="Loading"
        className="h-8 w-8 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600"
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ColorThemeProvider>
      <ToastProvider>
        <AppProvider>
          <BrowserRouter>
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/onboarding" element={<Onboarding />} />

                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/resume" element={<ProtectedRoute><Resume /></ProtectedRoute>} />
                <Route path="/careers" element={<ProtectedRoute><Careers /></ProtectedRoute>} />
                <Route path="/careers/:id" element={<ProtectedRoute><CareerDetails /></ProtectedRoute>} />
                <Route path="/skill-gap" element={<ProtectedRoute><SkillGap /></ProtectedRoute>} />
                <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
                <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
                <Route path="/jobs/:id" element={<ProtectedRoute><JobDetails /></ProtectedRoute>} />
                <Route path="/market" element={<ProtectedRoute><Market /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AppProvider>
      </ToastProvider>
      </ColorThemeProvider>
    </ThemeProvider>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './components/ui/Toast';
import { ProtectedRoute } from './routes/ProtectedRoute';

import { Landing } from './pages/Landing/Landing';
import { Login } from './pages/Login/Login';
import { ForgotPassword } from './pages/Login/ForgotPassword';
import { Signup } from './pages/Signup/Signup';
import { Onboarding } from './pages/Onboarding/Onboarding';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Profile } from './pages/Profile/Profile';
import { Resume } from './pages/Resume/Resume';
import { Careers } from './pages/Careers/Careers';
import { CareerDetails } from './pages/Careers/CareerDetails';
import { SkillGap } from './pages/SkillGap/SkillGap';
import { Roadmap } from './pages/Roadmap/Roadmap';
import { Jobs } from './pages/Jobs/Jobs';
import { JobDetails } from './pages/Jobs/JobDetails';
import { Market } from './pages/Market/Market';
import { Notifications } from './pages/Notifications/Notifications';
import { Settings } from './pages/Settings/Settings';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppProvider>
          <BrowserRouter>
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
          </BrowserRouter>
        </AppProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;

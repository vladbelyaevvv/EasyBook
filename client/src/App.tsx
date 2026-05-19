import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.js';
import Navbar from './components/Navbar.js';
import HomePage from './pages/HomePage.js';
import LoginPage from './pages/LoginPage.js';
import RegisterPage from './pages/RegisterPage.js';
import SpecialistPage from './pages/SpecialistPage.js';
import AppointmentsPage from './pages/AppointmentsPage.js';
import SpecialistDashboard from './pages/SpecialistDashboard.js';
import BecomeSpecialistPage from './pages/BecomeSpecialistPage.js';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default function App() {
  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/specialists/:id" element={<SpecialistPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/appointments" element={
            <PrivateRoute><AppointmentsPage /></PrivateRoute>
          } />
          <Route path="/specialist/dashboard" element={
            <PrivateRoute><SpecialistDashboard /></PrivateRoute>
          } />
          <Route path="/become-specialist" element={
            <PrivateRoute><BecomeSpecialistPage /></PrivateRoute>
          } />
        </Routes>
      </main>
    </>
  );
}

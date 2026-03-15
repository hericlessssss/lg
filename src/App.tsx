import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HeroSection } from './components/v0/hero-section';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/MainDashboard';
import ResetPassword from './pages/ResetPassword';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <div className="dark">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HeroSection />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            <Route path="reset-password" element={<ResetPassword />} />

            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

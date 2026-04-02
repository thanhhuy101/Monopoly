import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ReactNode, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import LandingPage     from './components/landing/LandingPage';
import GamePage        from './components/landing/GamePage';
import GameSetupPage   from './components/setup/GameSetupPage';
import ShopPage        from './components/shop/ShopPage';
import LeaderboardPage from './components/leaderboard/LeaderboardPage';
import ProfilePage     from './components/profile/ProfilePage';
import SignIn          from './components/auth/SignIn';
import SignUp          from './components/auth/SignUp';
import ForgotPassword  from './components/auth/ForgotPassword';
import GuidePage       from './components/guide/GuidePage';
import NewsPage        from './components/news/NewsPage';
import RoomList        from './components/game/RoomList';
import WaitingRoom     from './components/game/WaitingRoom';
import { useAuthStore } from './store/authStore';
import { resumeTheme, isPlaying } from './utils/musicManager';
import { initializeTokenManagement, cleanupTokenManagement } from './services/tokenManager';

function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    // Initialize token management when component mounts
    initializeTokenManagement();

    // Cleanup when component unmounts
    return () => {
      cleanupTokenManagement();
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated && !isPlaying()) {
      resumeTheme();
    }
  }, [isAuthenticated]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#0e0e0e', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#f6be39',
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: 18,
        letterSpacing: 3
      }}>
        Đang tải...
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/auth/signin" replace />;
  return <>{children}</>;
}

function ComingSoon({ label }: { label: string }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0e0e0e', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: '#f6be39' }}>
      <h2 style={{ fontFamily: "'Noto Serif', serif", fontSize: 28, letterSpacing: 4 }}>{label}</h2>
      <p style={{ color: '#9b8f7a', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 3 }}>SẮP RA MẮT</p>
      <a href="/" style={{ marginTop: 12, color: '#d4a017', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, letterSpacing: 3, textDecoration: 'none', border: '1px solid #4f4634', padding: '8px 20px' }}>← QUAY LẠI</a>
    </div>
  );
}

export default function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/auth/signin" replace />} />
        <Route path="/auth/signin" element={<SignIn />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/auth/forgot" element={<ForgotPassword />} />
        <Route path="/guide"       element={<GuidePage />} />
        <Route path="/news"        element={<NewsPage />} />
        <Route path="/home"        element={<RequireAuth><LandingPage /></RequireAuth>} />
        <Route path="/setup"       element={<RequireAuth><GameSetupPage /></RequireAuth>} />
        <Route path="/game"        element={<RequireAuth><GamePage /></RequireAuth>} />
        <Route path="/shop"        element={<RequireAuth><ShopPage /></RequireAuth>} />
        <Route path="/leaderboard" element={<RequireAuth><LeaderboardPage /></RequireAuth>} />
        <Route path="/profile"     element={<RequireAuth><ProfilePage /></RequireAuth>} />
        <Route path="/online"      element={<RequireAuth><RoomList /></RequireAuth>} />
        <Route path="/waiting/:roomId" element={<RequireAuth><WaitingRoom /></RequireAuth>} />
        <Route path="/invite"      element={<RequireAuth><ComingSoon label="Mời Bạn Bè" /></RequireAuth>} />
      </Routes>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#353534',
            color: '#f6be39',
            border: '1px solid #d4a017',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '16px',
            letterSpacing: '1px',
            padding: '16px 20px',
            minWidth: '300px',
          },
          success: {
            iconTheme: {
              primary: '#f6be39',
              secondary: '#261a00',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff6b6b',
              secondary: '#261a00',
            },
          },
        }}
      />
    </BrowserRouter>
  );
}

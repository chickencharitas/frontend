import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useAuthStore } from './context/authStore';
import ThemeProviderCustom from './context/ThemeContext';
import { PresentationProvider } from './context/PresentationContext';
import ProtectedRoute from './components/ProtectedRoute';
import ProPresenterLayout from './components/ProPresenterLayout';
import DeviceManager from './components/DeviceManager';
import MixerControl from './components/MixerControl';
import FontManager from './components/FontManager';
import TextEditor from './components/TextEditor';
import WorshipWorkspace from './components/WorshipWorkspace';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProPresenterMain from './pages/ProPresenterMain';
import PresentationsPage from './pages/PresentationsPage';
import PresentationEditorPage from './pages/PresentationEditorPage';
import MediaLibraryPage from './pages/MediaLibraryPage';
import TemplateMarketplacePage from './pages/TemplateMarketplacePage';
import SettingsPage from './pages/SettingsPage';
import ProjectionViewPage from './pages/ProjectionViewPage';
import LiveControlPage from './pages/LiveControlPage';
import BibleManager from './components/scripture/BibleManager';
import SongLibrary from './components/SongLibrary';
import ServiceTimer from './components/ServiceTimer';
import ServicePlaylist from './components/ServicePlaylist';
import CameraControlPage from './pages/CameraControlPage';
import LightingControlPage from './pages/LightingControlPage';
import AudioMixerPage from './pages/AudioMixerPage';
import VideoRouterPage from './pages/VideoRouterPage';
import DevicesPage from './pages/DevicesPage';
import IntegrationsPage from './pages/IntegrationsPage';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { createProPresenterTheme } from './components/presenter/theme/theme';
import ProPresenter from './components/presenter/ProPresenter';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function AppContent() {
  const { loadUser, isLoading } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        backgroundColor: '#1a1a1a',
        color: '#ffffff'
      }}>
        Loading ProPresenter...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* WorshipWorkspace - Primary Worship Interface */}
        <Route element={<ProtectedRoute><ProPresenterLayout /></ProtectedRoute>}>
          <Route path="/" element={<WorshipWorkspace />} />
          <Route path="/worship" element={<WorshipWorkspace />} />
          <Route path="/presentations" element={<PresentationsPage />} />
          <Route path="/editor" element={<WorshipWorkspace />} />
          <Route path="/live" element={<WorshipWorkspace />} />
          <Route path="/songs" element={<SongLibrary />} />
          <Route path="/scripture" element={<BibleManager />} />
          <Route path="/timer" element={<ServiceTimer />} />
          <Route path="/planner" element={<WorshipWorkspace />} />
          <Route path="/templates" element={<TemplateMarketplacePage />} />
          <Route path="/devices" element={<DeviceManager />} />
          <Route path="/devices/mixer" element={<MixerControl />} />
          <Route path="/fonts" element={<FontManager />} />
          <Route path="/text-editor" element={<TextEditor />} />

          {/* Legacy routes for compatibility */}
          <Route path="/dashboard" element={<ProPresenterMain />} />
          <Route path="/presentations/:id/edit" element={<PresentationEditorPage />} />
          <Route path="/presentations/new" element={<PresentationEditorPage />} />
          <Route path="/live-control/:presentationId" element={<LiveControlPage />} />
          <Route path="/media" element={<MediaLibraryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/devices/camera" element={<CameraControlPage />} />
          <Route path="/devices/lighting" element={<LightingControlPage />} />
          <Route path="/devices/mixer" element={<AudioMixerPage />} />
          <Route path="/devices/router" element={<VideoRouterPage />} />
          <Route path="/integrations" element={<IntegrationsPage />} />
        </Route>

        {/* Display outputs */}
        <Route path="/projection/:presentationId/:displayType" element={<ProjectionViewPage />} />

        {/* Live Presenter route */}
        <Route
          path="/presenter"
          element={
            <ProtectedRoute>
              <ProPresenterLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <MuiThemeProvider theme={createProPresenterTheme('dark')}>
                <CssBaseline />
                <ProPresenter />
              </MuiThemeProvider>
            }
          />
        </Route>

      </Routes>
    </Router>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PresentationProvider>
        <ThemeProviderCustom>
          <CssBaseline />
          <AppContent />
        </ThemeProviderCustom>
      </PresentationProvider>
    </QueryClientProvider>
  );
}

export default App;
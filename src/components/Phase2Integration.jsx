import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Tabs,
  Tab,
  Paper,
  Typography,
  Divider,
  Grid
} from '@mui/material';
import {
  Settings,
  Tv,
  CloudUpload,
  Schedule,
  Dashboard
} from '@mui/icons-material';

// Phase 2 Components
import DualMonitorSetup from '@/components/presenter/dualmonitor/DualMonitorSetup';
import StageDisplay from '@/components/presenter/stagedisplay/StageDisplay';
import MediaLibrary from '@/components/media/MediaLibrary';
import MediaPlayer from '@/components/media/MediaPlayer';
import LiveOutputConfiguration from '@/components/liveoutput/LiveOutputConfiguration';
import SchedulingCalendar from '@/components/scheduling/SchedulingCalendar';
import EventManager from '@/components/scheduling/EventManager';

/**
 * Phase2Integration.jsx
 * 
 * Example integration component showing how to use all Phase 2 components together.
 * This component demonstrates:
 * - Component composition
 * - Event listening and handling
 * - Data flow between components
 * - State management
 * - localStorage persistence
 */
const Phase2Integration = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [events, setEvents] = useState([]);
  const [displayConfig, setDisplayConfig] = useState({});
  const [outputConfig, setOutputConfig] = useState({});

  // Initialize from localStorage
  useEffect(() => {
    const savedEvents = localStorage.getItem('schedulingEvents');
    if (savedEvents) {
      try {
        setEvents(JSON.parse(savedEvents));
      } catch (err) {
        console.error('Error loading events:', err);
      }
    }

    const savedDisplayConfig = localStorage.getItem('dualMonitorSetup');
    if (savedDisplayConfig) {
      try {
        setDisplayConfig(JSON.parse(savedDisplayConfig));
      } catch (err) {
        console.error('Error loading display config:', err);
      }
    }

    const savedOutputConfig = localStorage.getItem('liveOutputConfig');
    if (savedOutputConfig) {
      try {
        setOutputConfig(JSON.parse(savedOutputConfig));
      } catch (err) {
        console.error('Error loading output config:', err);
      }
    }
  }, []);

  // Listen for Phase 2 events
  useEffect(() => {
    const handleDualMonitorEnabled = (e) => {
      console.log('Dual monitor enabled:', e.detail);
      setDisplayConfig(e.detail);
    };

    const handleStageDisplayUpdated = (e) => {
      console.log('Stage display updated:', e.detail);
    };

    const handleMediaSelected = (e) => {
      console.log('Media selected:', e.detail);
      setSelectedMedia(e.detail);
    };

    const handleOutputConfigChanged = (e) => {
      console.log('Output config changed:', e.detail);
      setOutputConfig(e.detail);
    };

    const handleEventCreated = (e) => {
      console.log('Event created:', e.detail);
      const updatedEvents = [...events, e.detail];
      setEvents(updatedEvents);
      localStorage.setItem('schedulingEvents', JSON.stringify(updatedEvents));
    };

    const handleEventChanged = (e) => {
      console.log('Event changed:', e.detail);
      const updatedEvents = events.map(ev => 
        ev.id === e.detail.id ? e.detail : ev
      );
      setEvents(updatedEvents);
      localStorage.setItem('schedulingEvents', JSON.stringify(updatedEvents));
    };

    const handleEventDeleted = (e) => {
      console.log('Event deleted:', e.detail);
      const updatedEvents = events.filter(ev => ev.id !== e.detail.id);
      setEvents(updatedEvents);
      localStorage.setItem('schedulingEvents', JSON.stringify(updatedEvents));
    };

    // Register event listeners
    window.addEventListener('presenter:dual-monitor-enabled', handleDualMonitorEnabled);
    window.addEventListener('presenter:stage-display-updated', handleStageDisplayUpdated);
    window.addEventListener('media:file-selected', handleMediaSelected);
    window.addEventListener('presenter:output-config-changed', handleOutputConfigChanged);
    window.addEventListener('scheduling:event-created', handleEventCreated);
    window.addEventListener('scheduling:event-changed', handleEventChanged);
    window.addEventListener('scheduling:event-deleted', handleEventDeleted);

    // Cleanup
    return () => {
      window.removeEventListener('presenter:dual-monitor-enabled', handleDualMonitorEnabled);
      window.removeEventListener('presenter:stage-display-updated', handleStageDisplayUpdated);
      window.removeEventListener('media:file-selected', handleMediaSelected);
      window.removeEventListener('presenter:output-config-changed', handleOutputConfigChanged);
      window.removeEventListener('scheduling:event-created', handleEventCreated);
      window.removeEventListener('scheduling:event-changed', handleEventChanged);
      window.removeEventListener('scheduling:event-deleted', handleEventDeleted);
    };
  }, [events]);

  const handleEventCreate = (event) => {
    const newEvents = [...events, event];
    setEvents(newEvents);
    localStorage.setItem('schedulingEvents', JSON.stringify(newEvents));
  };

  const handleEventDelete = (eventId) => {
    const updatedEvents = events.filter(e => e.id !== eventId);
    setEvents(updatedEvents);
    localStorage.setItem('schedulingEvents', JSON.stringify(updatedEvents));
  };

  const handleMediaSelect = (media) => {
    setSelectedMedia(media);
    console.log('Media selected in integration:', media);
    // Here you could add selected media to a slide, playlist, etc.
  };

  const handleOutputConfig = (config) => {
    setOutputConfig(config);
    console.log('Output configured:', config);
    // Here you could start streaming, update output settings, etc.
  };

  return (
    <Box sx={{ bgcolor: '#1a1a1a', color: '#cccccc', minHeight: '100vh' }}>
      {/* Header */}
      <Paper sx={{ backgroundColor: '#252526', borderBottom: '2px solid #404040', borderRadius: 0 }}>
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <Typography variant="h4" sx={{ color: '#81c784', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Dashboard /> Phase 2 Control Center
          </Typography>
          <Typography variant="body2" sx={{ color: '#b0b0b0', mt: 1 }}>
            Manage presentations, media, output, and scheduling
          </Typography>
        </Container>
      </Paper>

      {/* Tab Navigation */}
      <Paper sx={{ backgroundColor: '#2d2d2e', borderRadius: 0, boxShadow: 'none' }}>
        <Container maxWidth="lg">
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{
              '& .MuiTab-root': { color: '#cccccc', textTransform: 'none' },
              '& .Mui-selected': { color: '#81c784' },
              '& .MuiTabs-indicator': { backgroundColor: '#81c784' }
            }}
          >
            <Tab label="📺 Presenter View" icon={<Tv sx={{ mr: 1 }} />} />
            <Tab label="📁 Media" icon={<CloudUpload sx={{ mr: 1 }} />} />
            <Tab label="🔴 Live Output" icon={<Settings sx={{ mr: 1 }} />} />
            <Tab label="📅 Scheduling" icon={<Schedule sx={{ mr: 1 }} />} />
          </Tabs>
        </Container>
      </Paper>

      {/* Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Tab 1: Presenter View */}
        {tabValue === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ backgroundColor: '#252526', p: 3, borderRadius: 0 }}>
                <Typography variant="h6" sx={{ color: '#81c784', mb: 2 }}>
                  Dual Monitor Setup
                </Typography>
                <DualMonitorSetup onConfigChange={setDisplayConfig} />
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ backgroundColor: '#252526', p: 3, borderRadius: 0 }}>
                <Typography variant="h6" sx={{ color: '#81c784', mb: 2 }}>
                  Stage Display
                </Typography>
                <StageDisplay 
                  currentSlide={{ title: 'Sample Slide', content: 'Preview content' }}
                  onDisplayModeChange={(mode) => console.log('Display mode:', mode)}
                />
              </Paper>
            </Grid>

            {/* Status Display */}
            <Grid item xs={12}>
              <Paper sx={{ backgroundColor: '#1a1a1a', p: 2, borderRadius: 0, borderLeft: '4px solid #81c784' }}>
                <Typography variant="subtitle2" sx={{ color: '#81c784', mb: 1 }}>
                  Current Configuration
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0', fontFamily: 'monospace' }}>
                  {JSON.stringify(displayConfig, null, 2) || 'No configuration yet'}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Tab 2: Media Management */}
        {tabValue === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ backgroundColor: '#252526', p: 3, borderRadius: 0 }}>
                <MediaLibrary onMediaSelect={handleMediaSelect} />
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              {/* Selected Media Display */}
              <Paper sx={{ backgroundColor: '#252526', p: 3, borderRadius: 0, mb: 3 }}>
                <Typography variant="h6" sx={{ color: '#81c784', mb: 2 }}>
                  Selected Media
                </Typography>
                {selectedMedia ? (
                  <Box>
                    <Typography variant="body2" sx={{ color: '#cccccc', mb: 1 }}>
                      <strong>Name:</strong> {selectedMedia.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#cccccc', mb: 1 }}>
                      <strong>Type:</strong> {selectedMedia.type}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#cccccc', mb: 1 }}>
                      <strong>Size:</strong> {selectedMedia.size}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#cccccc' }}>
                      <strong>Date:</strong> {selectedMedia.uploadDate}
                    </Typography>
                  </Box>
                ) : (
                  <Typography sx={{ color: '#b0b0b0' }}>
                    Select media from the library
                  </Typography>
                )}
              </Paper>

              {/* Media Player Preview */}
              {selectedMedia && selectedMedia.type === 'video' && (
                <Paper sx={{ backgroundColor: '#252526', p: 3, borderRadius: 0 }}>
                  <Typography variant="h6" sx={{ color: '#81c784', mb: 2 }}>
                    Preview
                  </Typography>
                  <MediaPlayer
                    mediaUrl={selectedMedia.url}
                    mediaType="video"
                    onTimeUpdate={(time) => console.log('Time:', time)}
                    onEnded={() => console.log('Playback ended')}
                  />
                </Paper>
              )}
            </Grid>
          </Grid>
        )}

        {/* Tab 3: Live Output */}
        {tabValue === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ backgroundColor: '#252526', p: 3, borderRadius: 0 }}>
                <LiveOutputConfiguration onConfigChange={handleOutputConfig} />
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ backgroundColor: '#1a1a1a', p: 3, borderRadius: 0, borderLeft: '4px solid #81c784' }}>
                <Typography variant="h6" sx={{ color: '#81c784', mb: 2 }}>
                  Output Status
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                      Resolution:
                    </Typography>
                    <Typography sx={{ color: '#81c784' }}>
                      {outputConfig.resolution || 'Not configured'}
                    </Typography>
                  </Box>
                  <Divider sx={{ backgroundColor: '#404040' }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                      Bitrate:
                    </Typography>
                    <Typography sx={{ color: '#81c784' }}>
                      {outputConfig.bitrate ? `${outputConfig.bitrate} kbps` : 'Not configured'}
                    </Typography>
                  </Box>
                  <Divider sx={{ backgroundColor: '#404040' }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                      Streaming:
                    </Typography>
                    <Typography sx={{ color: outputConfig.streamingEnabled ? '#81c784' : '#ff6b6b' }}>
                      {outputConfig.streamingEnabled ? '🟢 Enabled' : '🔴 Disabled'}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Tab 4: Scheduling */}
        {tabValue === 3 && (
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Paper sx={{ backgroundColor: '#252526', p: 3, borderRadius: 0 }}>
                <SchedulingCalendar
                  onEventCreate={handleEventCreate}
                  onEventUpdate={(event) => {
                    const updatedEvents = events.map(e => e.id === event.id ? event : e);
                    setEvents(updatedEvents);
                    localStorage.setItem('schedulingEvents', JSON.stringify(updatedEvents));
                  }}
                />
              </Paper>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Paper sx={{ backgroundColor: '#252526', p: 3, borderRadius: 0 }}>
                <EventManager
                  events={events}
                  onEventSave={(event) => {
                    const index = events.findIndex(e => e.id === event.id);
                    let updatedEvents;
                    if (index >= 0) {
                      updatedEvents = [...events];
                      updatedEvents[index] = event;
                    } else {
                      updatedEvents = [...events, event];
                    }
                    setEvents(updatedEvents);
                    localStorage.setItem('schedulingEvents', JSON.stringify(updatedEvents));
                  }}
                  onEventDelete={handleEventDelete}
                  onConflictDetect={(conflicts) => {
                    console.log('Conflicts detected:', conflicts);
                  }}
                />
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>

      {/* Footer */}
      <Paper sx={{ backgroundColor: '#252526', borderTop: '1px solid #404040', mt: 6, borderRadius: 0 }}>
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
            Phase 2 Control Center • All settings auto-saved to localStorage • Ready for backend integration
          </Typography>
        </Container>
      </Paper>
    </Box>
  );
};

export default Phase2Integration;

/**
 * INTEGRATION EXAMPLE USAGE:
 * 
 * In your main App.jsx or router:
 * 
 * import Phase2Integration from '@/components/Phase2Integration';
 * 
 * // Route configuration
 * <Route path="/phase2" element={<Phase2Integration />} />
 * 
 * // Or within PresentationBuilder
 * <Tabs>
 *   <TabPanel value="phase1">
 *     <PresentationBuilder />
 *   </TabPanel>
 *   <TabPanel value="phase2">
 *     <Phase2Integration />
 *   </TabPanel>
 * </Tabs>
 * 
 * COMPONENT COMMUNICATION FLOW:
 * 
 * 1. User interacts with component (e.g., selects media, creates event)
 * 2. Component dispatches custom event: window.dispatchEvent(new CustomEvent(...))
 * 3. Integration component listens via useEffect
 * 4. Event handler updates state
 * 5. Updated state saved to localStorage
 * 6. UI re-renders with new data
 * 7. Event listener callback sends data to backend (Phase 3)
 */

/**
 * Phase 3 Advanced Features - Complete Integration Example
 * Demonstrates: Brand Customization, Custom Templates, Backend API, Team Library
 */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  Stack,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  Chip,
  LinearProgress,
  Grid
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Add as AddIcon,
  Cloud as CloudIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { brandConfig, brandThemes, applyGlobalTheme } from './config/brandConfig';
import { templateAPI } from './services/templateAPI';
import { templateAPIUtils } from './services/templateAPIUtils';
import CustomTemplateCreator from './CustomTemplateCreator';
import TeamLibrary from './TeamLibrary';
import TemplateGallery from './TemplateGallery';

const Phase3AdvancedIntegration = () => {
  const [tabValue, setTabValue] = useState(0);
  const [status, setStatus] = useState({
    branding: false,
    customTemplates: 0,
    backendSync: false,
    teamLibrary: 0
  });
  const [syncStatus, setSyncStatus] = useState({});
  const [theme, setTheme] = useState('default');
  const [events, setEvents] = useState([]);

  // Initialize on mount
  useEffect(() => {
    initializeAdvancedFeatures();
    return () => {
      templateAPIUtils.stopBackgroundSync();
    };
  }, []);

  const initializeAdvancedFeatures = () => {
    // 1. Initialize branding
    initializeBranding();

    // 2. Load custom templates
    loadCustomTemplates();

    // 3. Initialize backend connection
    initializeBackendConnection();

    // 4. Initialize team library
    loadTeamLibrary();

    // Log initialization
    addEvent('System', 'Advanced features initialized');
  };

  // 1. BRAND CUSTOMIZATION
  const initializeBranding = () => {
    try {
      // Apply theme using the applyGlobalTheme function
      const selectedTheme = brandThemes[theme];
      if (selectedTheme) {
        applyGlobalTheme(selectedTheme);
        console.log('Theme applied:', theme, selectedTheme);
      }

      setStatus(prev => ({ ...prev, branding: true }));
      addEvent('Branding', `Theme "${theme}" applied successfully`);
    } catch (err) {
      addEvent('Branding', `Error: ${err.message}`, 'error');
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    initializeBranding();
  };

  // 2. CUSTOM TEMPLATES
  const loadCustomTemplates = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('savedTemplates') || '[]');
      setStatus(prev => ({ ...prev, customTemplates: saved.length }));
      addEvent('Custom Templates', `Loaded ${saved.length} custom templates`);
    } catch (err) {
      addEvent('Custom Templates', `Error: ${err.message}`, 'error');
    }
  };

  const handleTemplateCreated = (template) => {
    loadCustomTemplates();
    addEvent('Custom Templates', `Created: "${template.name}"`);

    // If sync enabled, queue for backend
    if (template.syncToBackend) {
      templateAPIUtils.queueRequest({
        method: 'POST',
        url: '/api/templates/custom',
        headers: { 'Content-Type': 'application/json' },
        body: template
      });
      addEvent('Backend Sync', 'Template queued for sync');
    }
  };

  // 3. BACKEND API INTEGRATION
  const initializeBackendConnection = () => {
    try {
      // Start background sync
      templateAPIUtils.startBackgroundSync(30000);

      // Listen to sync events
      templateAPIUtils.onSyncComplete((event) => {
        setSyncStatus(templateAPIUtils.getSyncStatus());
        addEvent('Backend Sync', `Synced ${event.detail.processedCount} templates`);
      });

      templateAPIUtils.onSynced((event) => {
        addEvent('Backend Sync', `Template "${event.detail.request.body?.name}" synced`);
      });

      setStatus(prev => ({ ...prev, backendSync: true }));
      addEvent('Backend API', 'Connection initialized and background sync started');

      // Update initial sync status
      setSyncStatus(templateAPIUtils.getSyncStatus());
    } catch (err) {
      addEvent('Backend API', `Error: ${err.message}`, 'error');
    }
  };

  const handleManualSync = async () => {
    try {
      addEvent('Backend Sync', 'Manual sync initiated...');
      await templateAPIUtils.syncQueuedRequests();
      setSyncStatus(templateAPIUtils.getSyncStatus());
      addEvent('Backend Sync', 'Manual sync completed');
    } catch (err) {
      addEvent('Backend Sync', `Error: ${err.message}`, 'error');
    }
  };

  // 4. TEAM LIBRARY
  const loadTeamLibrary = () => {
    try {
      const teamTemplates = JSON.parse(localStorage.getItem('teamTemplates') || '[]');
      setStatus(prev => ({ ...prev, teamLibrary: teamTemplates.length }));
      addEvent('Team Library', `Loaded ${teamTemplates.length} team templates`);
    } catch (err) {
      addEvent('Team Library', `Error: ${err.message}`, 'error');
    }
  };

  const handleTemplateImported = (template) => {
    loadTeamLibrary();
    loadCustomTemplates();
    addEvent('Team Library', `Imported: "${template.name}"`);
  };

  // EVENT LOGGING
  const addEvent = (source, message, type = 'info') => {
    const newEvent = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      source,
      message,
      type
    };

    setEvents(prev => [newEvent, ...prev.slice(0, 19)]);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3, backgroundColor: brandConfig.secondary }}>
        <Stack spacing={2}>
          <Typography variant="h5" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
            🚀 Phase 3 Advanced Features Demo
          </Typography>
          <Typography variant="body2" sx={{ color: brandConfig.textTertiary }}>
            Explore: Brand Customization • Custom Templates • Backend Integration • Team Collaboration
          </Typography>

          {/* Status Overview */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ backgroundColor: brandConfig.tertiary }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant="caption" sx={{ color: brandConfig.textTertiary }}>
                      Branding
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {status.branding && <CheckCircleIcon sx={{ color: brandConfig.success }} />}
                      <Typography variant="body2">
                        {status.branding ? 'Active' : 'Inactive'}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ backgroundColor: brandConfig.tertiary }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant="caption" sx={{ color: brandConfig.textTertiary }}>
                      Custom Templates
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AddIcon sx={{ color: brandConfig.accent }} />
                      <Typography variant="body2">
                        {status.customTemplates}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ backgroundColor: brandConfig.tertiary }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant="caption" sx={{ color: brandConfig.textTertiary }}>
                      Backend Sync
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {status.backendSync && <CheckCircleIcon sx={{ color: brandConfig.success }} />}
                      <Typography variant="body2">
                        {status.backendSync ? 'Connected' : 'Disconnected'}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ backgroundColor: brandConfig.tertiary }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant="caption" sx={{ color: brandConfig.textTertiary }}>
                      Team Templates
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PeopleIcon sx={{ color: brandConfig.accentSecondary }} />
                      <Typography variant="body2">
                        {status.teamLibrary}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      </Paper>

      {/* Main Content Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: `1px solid ${brandConfig.border}` }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{
              '& .MuiTab-root': { color: brandConfig.textTertiary },
              '& .Mui-selected': { color: brandConfig.accent },
              '& .MuiTabs-indicator': { backgroundColor: brandConfig.accent }
            }}
          >
            <Tab label="Brand Customization" icon={<SettingsIcon />} iconPosition="start" />
            <Tab label="Create Templates" icon={<AddIcon />} iconPosition="start" />
            <Tab label="Backend Sync" icon={<CloudIcon />} iconPosition="start" />
            <Tab label="Team Library" icon={<PeopleIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          {/* Tab 1: Brand Customization */}
          {tabValue === 0 && (
            <Stack spacing={3}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Customize Your Brand Colors & Typography
              </Typography>

              <Alert severity="info">
                Current theme: <strong>{theme}</strong>
              </Alert>

              <Box>
                <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
                  Select Brand Theme
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {Object.keys(brandThemes).map(themeName => (
                    <Button
                      key={themeName}
                      onClick={() => handleThemeChange(themeName)}
                      variant={theme === themeName ? 'contained' : 'outlined'}
                      sx={{
                        borderColor: brandThemes[themeName]?.colors?.accent || brandConfig.accent,
                        color: theme === themeName ? '#000' : (brandThemes[themeName]?.colors?.accent || brandConfig.accent),
                        backgroundColor: theme === themeName ? (brandThemes[themeName]?.colors?.accent || brandConfig.accent) : 'transparent',
                        textTransform: 'capitalize'
                      }}
                    >
                      {themeName}
                    </Button>
                  ))}
                </Box>
              </Box>

              <Card sx={{ backgroundColor: brandConfig.tertiary }}>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                    Color Palette
                  </Typography>
                  <Grid container spacing={1}>
                    {[
                      { name: 'Primary', color: brandThemes[theme]?.colors?.primary || brandConfig.primary },
                      { name: 'Secondary', color: brandThemes[theme]?.colors?.secondary || brandConfig.secondary },
                      { name: 'Accent', color: brandThemes[theme]?.colors?.accent || brandConfig.accent },
                      { name: 'Success', color: brandThemes[theme]?.colors?.success || brandConfig.success }
                    ].map(item => (
                      <Grid item xs={6} sm={3} key={item.name}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Box
                            sx={{
                              width: '100%',
                              height: 60,
                              backgroundColor: item.color,
                              borderRadius: 1,
                              mb: 1,
                              border: `2px solid ${brandConfig.border}`
                            }}
                          />
                          <Typography variant="caption">
                            {item.name}
                          </Typography>
                          <Typography variant="caption" sx={{ display: 'block', color: brandConfig.textTertiary }}>
                            {item.color}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Stack>
          )}

          {/* Tab 2: Create Templates */}
          {tabValue === 1 && (
            <Stack spacing={3}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Create Custom Presentation Templates
              </Typography>

              <CustomTemplateCreator
                onTemplateCreated={handleTemplateCreated}
              />

              {status.customTemplates > 0 && (
                <Card sx={{ backgroundColor: brandConfig.tertiary }}>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                      Your Templates ({status.customTemplates})
                    </Typography>
                    <TemplateGallery />
                  </CardContent>
                </Card>
              )}
            </Stack>
          )}

          {/* Tab 3: Backend Sync */}
          {tabValue === 2 && (
            <Stack spacing={3}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Backend Synchronization
              </Typography>

              <Alert severity="success">
                Status: <strong>{status.backendSync ? 'Connected' : 'Disconnected'}</strong>
              </Alert>

              <Card sx={{ backgroundColor: brandConfig.tertiary }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                        Sync Queue
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">
                          Pending requests: {syncStatus.queueLength || 0}
                        </Typography>
                        <Button
                          onClick={handleManualSync}
                          variant="contained"
                          sx={{ background: brandConfig.accent, color: '#000' }}
                        >
                          Manual Sync
                        </Button>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(syncStatus.queueLength || 0) > 0 ? 50 : 100}
                        sx={{ mt: 2 }}
                      />
                    </Box>

                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                        Background Sync
                      </Typography>
                      <Chip
                        label={syncStatus.syncInterval === 'active' ? 'Active' : 'Inactive'}
                        color={syncStatus.syncInterval === 'active' ? 'success' : 'default'}
                      />
                    </Box>

                    <Alert severity="info">
                      Templates with "Sync to backend" enabled are automatically queued and synced every 30 seconds.
                    </Alert>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          )}

          {/* Tab 4: Team Library */}
          {tabValue === 3 && (
            <Stack spacing={3}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Team Library & Collaboration
              </Typography>

              <TeamLibrary
                onTemplateImported={handleTemplateImported}
              />
            </Stack>
          )}
        </Box>
      </Paper>

      {/* Event Log */}
      <Paper sx={{ p: 2, backgroundColor: brandConfig.secondary }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
          Activity Log
        </Typography>
        <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
          {events.map(event => (
            <Box
              key={event.id}
              sx={{
                p: 1.5,
                mb: 1,
                backgroundColor: brandConfig.tertiary,
                borderLeft: `3px solid ${
                  event.type === 'error'
                    ? brandConfig.danger
                    : event.type === 'success'
                      ? brandConfig.success
                      : brandConfig.accent
                }`,
                borderRadius: '0 4px 4px 0'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: brandConfig.accent }}>
                    {event.source}
                  </Typography>
                  <Typography variant="body2">
                    {event.message}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: brandConfig.textTertiary, ml: 1 }}>
                  {event.timestamp}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default Phase3AdvancedIntegration;

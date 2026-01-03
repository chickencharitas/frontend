import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Paper,
  IconButton,
  Switch,
  FormControlLabel,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  Alert,
  Stack,
  Tooltip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Settings,
  Palette,
  Keyboard,
  VolumeUp,
  Videocam,
  NetworkWifi,
  Save,
  Restore,
  Download,
  Upload,
  Security,
  Accessibility,
  Language,
  Notifications,
  Storage,
  Memory,
  Speed,
  Timer,
  PlayCircle,
  StopCircle,
  ExpandMore,
  CheckCircle,
  Warning,
  Info,
  Brightness6,
  Contrast,
  ColorLens,
  FontDownload,
  GridOn,
  ViewModule,
  ViewList,
  AccountCircle,
  Lock,
  Backup,
  RestoreFromTrash,
  CloudUpload,
  CloudDownload,
  SystemUpdate,
  Help,
  Support
} from '@mui/icons-material';

// Mock user preferences
const defaultSettings = {
  // General Settings
  theme: 'dark',
  language: 'en',
  autoSave: true,
  autoSaveInterval: 5,
  startupAction: 'last_presentation',
  confirmDelete: true,

  // Presentation Settings
  defaultTransition: 'fade',
  transitionDuration: 0.5,
  cueNumbering: true,
  autoAdvance: false,
  loopPresentation: false,

  // Display Settings
  primaryDisplay: 'main',
  stageDisplayEnabled: true,
  confidenceMonitorEnabled: false,
  networkStreamingEnabled: false,
  displayResolution: '1920x1080',

  // Audio Settings
  masterVolume: 80,
  cueVolume: 70,
  backgroundVolume: 50,
  audioDevice: 'default',

  // Video Settings
  videoQuality: 'high',
  frameRate: 30,
  videoCodec: 'h264',
  hardwareAcceleration: true,

  // Keyboard Shortcuts
  shortcuts: {
    playPause: 'Space',
    nextCue: 'ArrowRight',
    prevCue: 'ArrowLeft',
    fullscreen: 'F11',
    stageDisplay: 'S'
  },

  // Network Settings
  networkPort: 5004,
  multicastEnabled: false,
  discoveryEnabled: true,

  // Accessibility
  highContrast: false,
  largeText: false,
  screenReader: false,
  keyboardNavigation: true,

  // Performance
  maxCacheSize: 1024,
  preloadMedia: true,
  lowPowerMode: false,

  // Backup
  autoBackup: true,
  backupInterval: 30,
  backupLocation: '~/Documents/ProPresenter/Backups',
  maxBackups: 10
};

export default function SettingsPanel({ onClose }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [activeTab, setActiveTab] = useState(0);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateNestedSetting = (parentKey, childKey, value) => {
    setSettings(prev => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [childKey]: value
      }
    }));
  };

  const saveSettings = () => {
    // In a real app, this would save to localStorage or send to server
    localStorage.setItem('propresenter_settings', JSON.stringify(settings));
    console.log('Settings saved:', settings);
    // Show success message
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
    setShowResetDialog(false);
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'propresenter_settings.json';
    link.click();
    URL.revokeObjectURL(url);
    setShowExportDialog(false);
  };

  const importSettings = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          setSettings({ ...defaultSettings, ...importedSettings });
          setShowImportDialog(false);
        } catch (error) {
          console.error('Error importing settings:', error);
          // Show error message
        }
      };
      reader.readAsText(file);
    }
  };

  const renderGeneralTab = () => (
    <Stack spacing={3}>
      <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Palette sx={{ color: 'primary.main' }} />
            Appearance
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#b0b0b0' }}>Theme</InputLabel>
                <Select
                  value={settings.theme}
                  onChange={(e) => updateSetting('theme', e.target.value)}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#404040' }
                  }}
                >
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                  <MenuItem value="auto">Auto (System)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#b0b0b0' }}>Language</InputLabel>
                <Select
                  value={settings.language}
                  onChange={(e) => updateSetting('language', e.target.value)}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#404040' }
                  }}
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="es">Español</MenuItem>
                  <MenuItem value="fr">Français</MenuItem>
                  <MenuItem value="de">Deutsch</MenuItem>
                  <MenuItem value="pt">Português</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Save sx={{ color: '#81c784' }} />
            Auto-Save
          </Typography>

          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.autoSave}
                  onChange={(e) => updateSetting('autoSave', e.target.checked)}
                  color="primary"
                />
              }
              label="Enable auto-save"
            />

            {settings.autoSave && (
              <Box sx={{ pl: 4 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>Auto-save interval (minutes)</Typography>
                <Slider
                  value={settings.autoSaveInterval}
                  onChange={(e, value) => updateSetting('autoSaveInterval', value)}
                  min={1}
                  max={60}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                  sx={{ color: 'primary.main' }}
                />
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
            <PlayCircle sx={{ color: '#ffb74d' }} />
            Startup Behavior
          </Typography>

          <FormControl fullWidth>
            <InputLabel sx={{ color: '#b0b0b0' }}>On Startup</InputLabel>
            <Select
              value={settings.startupAction}
              onChange={(e) => updateSetting('startupAction', e.target.value)}
              sx={{
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#404040' }
              }}
            >
              <MenuItem value="new_presentation">Create New Presentation</MenuItem>
              <MenuItem value="last_presentation">Open Last Presentation</MenuItem>
              <MenuItem value="welcome_screen">Show Welcome Screen</MenuItem>
              <MenuItem value="nothing">Do Nothing</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.confirmDelete}
                  onChange={(e) => updateSetting('confirmDelete', e.target.checked)}
                  color="primary"
                />
              }
              label="Show confirmation dialogs for deletions"
            />
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );

  const renderPresentationTab = () => (
    <Stack spacing={3}>
      <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Timer sx={{ color: 'primary.main' }} />
            Transitions & Timing
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#b0b0b0' }}>Default Transition</InputLabel>
                <Select
                  value={settings.defaultTransition}
                  onChange={(e) => updateSetting('defaultTransition', e.target.value)}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#404040' }
                  }}
                >
                  <MenuItem value="fade">Fade</MenuItem>
                  <MenuItem value="slide">Slide</MenuItem>
                  <MenuItem value="wipe">Wipe</MenuItem>
                  <MenuItem value="push">Push</MenuItem>
                  <MenuItem value="cut">Cut (Instant)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1 }}>Transition Duration (seconds)</Typography>
              <Slider
                value={settings.transitionDuration}
                onChange={(e, value) => updateSetting('transitionDuration', value)}
                min={0.1}
                max={5.0}
                step={0.1}
                valueLabelDisplay="auto"
                sx={{ color: 'primary.main' }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
            <PlayCircle sx={{ color: '#81c784' }} />
            Playback Options
          </Typography>

          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.cueNumbering}
                  onChange={(e) => updateSetting('cueNumbering', e.target.checked)}
                  color="primary"
                />
              }
              label="Show cue numbering"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.autoAdvance}
                  onChange={(e) => updateSetting('autoAdvance', e.target.checked)}
                  color="primary"
                />
              }
              label="Auto-advance to next cue"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.loopPresentation}
                  onChange={(e) => updateSetting('loopPresentation', e.target.checked)}
                  color="primary"
                />
              }
              label="Loop presentation when finished"
            />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );

  const renderAudioVideoTab = () => (
    <Stack spacing={3}>
      <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
            <VolumeUp sx={{ color: 'primary.main' }} />
            Audio Settings
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" sx={{ mb: 1 }}>Master Volume</Typography>
              <Slider
                value={settings.masterVolume}
                onChange={(e, value) => updateSetting('masterVolume', value)}
                min={0}
                max={100}
                valueLabelDisplay="auto"
                sx={{ color: 'primary.main' }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="body2" sx={{ mb: 1 }}>Cue Audio Volume</Typography>
              <Slider
                value={settings.cueVolume}
                onChange={(e, value) => updateSetting('cueVolume', value)}
                min={0}
                max={100}
                valueLabelDisplay="auto"
                sx={{ color: 'primary.main' }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="body2" sx={{ mb: 1 }}>Background Music</Typography>
              <Slider
                value={settings.backgroundVolume}
                onChange={(e, value) => updateSetting('backgroundVolume', value)}
                min={0}
                max={100}
                valueLabelDisplay="auto"
                sx={{ color: 'primary.main' }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#b0b0b0' }}>Audio Output Device</InputLabel>
              <Select
                value={settings.audioDevice}
                onChange={(e) => updateSetting('audioDevice', e.target.value)}
                sx={{
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#404040' }
                }}
              >
                <MenuItem value="default">System Default</MenuItem>
                <MenuItem value="device1">Speakers (Realtek)</MenuItem>
                <MenuItem value="device2">Headphones (Bluetooth)</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Videocam sx={{ color: '#81c784' }} />
            Video Settings
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#b0b0b0' }}>Video Quality</InputLabel>
                <Select
                  value={settings.videoQuality}
                  onChange={(e) => updateSetting('videoQuality', e.target.value)}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#404040' }
                  }}
                >
                  <MenuItem value="low">Low (480p)</MenuItem>
                  <MenuItem value="medium">Medium (720p)</MenuItem>
                  <MenuItem value="high">High (1080p)</MenuItem>
                  <MenuItem value="ultra">Ultra (4K)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#b0b0b0' }}>Frame Rate</InputLabel>
                <Select
                  value={settings.frameRate}
                  onChange={(e) => updateSetting('frameRate', e.target.value)}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#404040' }
                  }}
                >
                  <MenuItem value={24}>24 fps</MenuItem>
                  <MenuItem value={30}>30 fps</MenuItem>
                  <MenuItem value={60}>60 fps</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#b0b0b0' }}>Video Codec</InputLabel>
                <Select
                  value={settings.videoCodec}
                  onChange={(e) => updateSetting('videoCodec', e.target.value)}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#404040' }
                  }}
                >
                  <MenuItem value="h264">H.264</MenuItem>
                  <MenuItem value="h265">H.265 (HEVC)</MenuItem>
                  <MenuItem value="vp9">VP9</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.hardwareAcceleration}
                  onChange={(e) => updateSetting('hardwareAcceleration', e.target.checked)}
                  color="primary"
                />
              }
              label="Enable hardware acceleration"
            />
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );

  const renderNetworkTab = () => (
    <Stack spacing={3}>
      <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
            <NetworkWifi sx={{ color: 'primary.main' }} />
            Network Streaming
          </Typography>

          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.networkStreamingEnabled}
                  onChange={(e) => updateSetting('networkStreamingEnabled', e.target.checked)}
                  color="primary"
                />
              }
              label="Enable network streaming"
            />

            {settings.networkStreamingEnabled && (
              <>
                <TextField
                  label="Network Port"
                  type="number"
                  value={settings.networkPort}
                  onChange={(e) => updateSetting('networkPort', parseInt(e.target.value))}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: '#404040' }
                    },
                    '& .MuiInputLabel-root': { color: '#b0b0b0' }
                  }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.multicastEnabled}
                      onChange={(e) => updateSetting('multicastEnabled', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Enable multicast streaming"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.discoveryEnabled}
                      onChange={(e) => updateSetting('discoveryEnabled', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Enable network discovery"
                />
              </>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Alert severity="info" sx={{ bgcolor: '#2a2a2a', color: '#b0b0b0' }}>
        <Typography variant="body2">
          Network streaming allows you to send your presentation to remote displays over the network.
          Make sure all devices are on the same network segment for best performance.
        </Typography>
      </Alert>
    </Stack>
  );

  const renderKeyboardTab = () => (
    <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Keyboard sx={{ color: 'primary.main' }} />
          Keyboard Shortcuts
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Customize keyboard shortcuts for common actions. Click on a shortcut to change it.
        </Typography>

        <List>
          <ListItem>
            <ListItemText primary="Play/Pause Presentation" secondary="Starts or stops the current presentation" />
            <TextField
              size="small"
              value={settings.shortcuts.playPause}
              onChange={(e) => updateNestedSetting('shortcuts', 'playPause', e.target.value)}
              sx={{
                width: 120,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: '#404040' }
                }
              }}
            />
          </ListItem>

          <ListItem>
            <ListItemText primary="Next Cue" secondary="Advances to the next cue" />
            <TextField
              size="small"
              value={settings.shortcuts.nextCue}
              onChange={(e) => updateNestedSetting('shortcuts', 'nextCue', e.target.value)}
              sx={{
                width: 120,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: '#404040' }
                }
              }}
            />
          </ListItem>

          <ListItem>
            <ListItemText primary="Previous Cue" secondary="Goes back to the previous cue" />
            <TextField
              size="small"
              value={settings.shortcuts.prevCue}
              onChange={(e) => updateNestedSetting('shortcuts', 'prevCue', e.target.value)}
              sx={{
                width: 120,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: '#404040' }
                }
              }}
            />
          </ListItem>

          <ListItem>
            <ListItemText primary="Toggle Fullscreen" secondary="Enters or exits fullscreen mode" />
            <TextField
              size="small"
              value={settings.shortcuts.fullscreen}
              onChange={(e) => updateNestedSetting('shortcuts', 'fullscreen', e.target.value)}
              sx={{
                width: 120,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: '#404040' }
                }
              }}
            />
          </ListItem>

          <ListItem>
            <ListItemText primary="Stage Display" secondary="Toggles stage display on/off" />
            <TextField
              size="small"
              value={settings.shortcuts.stageDisplay}
              onChange={(e) => updateNestedSetting('shortcuts', 'stageDisplay', e.target.value)}
              sx={{
                width: 120,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: '#404040' }
                }
              }}
            />
          </ListItem>
        </List>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button variant="outlined" sx={{ borderColor: '#ffb74d', color: '#ffb74d' }}>
            Reset to Defaults
          </Button>
          <Button variant="contained" sx={{ bgcolor: 'primary.main' }}>
            Save Shortcuts
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const renderAdvancedTab = () => (
    <Stack spacing={3}>
      <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Accessibility sx={{ color: 'primary.main' }} />
            Accessibility
          </Typography>

          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.highContrast}
                  onChange={(e) => updateSetting('highContrast', e.target.checked)}
                  color="primary"
                />
              }
              label="High contrast mode"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.largeText}
                  onChange={(e) => updateSetting('largeText', e.target.checked)}
                  color="primary"
                />
              }
              label="Large text mode"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.screenReader}
                  onChange={(e) => updateSetting('screenReader', e.target.checked)}
                  color="primary"
                />
              }
              label="Screen reader support"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.keyboardNavigation}
                  onChange={(e) => updateSetting('keyboardNavigation', e.target.checked)}
                  color="primary"
                />
              }
              label="Enhanced keyboard navigation"
            />
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Memory sx={{ color: '#81c784' }} />
            Performance
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1 }}>Cache Size (MB)</Typography>
              <Slider
                value={settings.maxCacheSize}
                onChange={(e, value) => updateSetting('maxCacheSize', value)}
                min={256}
                max={4096}
                step={256}
                valueLabelDisplay="auto"
                sx={{ color: 'primary.main' }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1 }}>Backup Interval (minutes)</Typography>
              <Slider
                value={settings.backupInterval}
                onChange={(e, value) => updateSetting('backupInterval', value)}
                min={5}
                max={120}
                step={5}
                valueLabelDisplay="auto"
                sx={{ color: 'primary.main' }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.preloadMedia}
                  onChange={(e) => updateSetting('preloadMedia', e.target.checked)}
                  color="primary"
                />
              }
              label="Preload media files"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.lowPowerMode}
                  onChange={(e) => updateSetting('lowPowerMode', e.target.checked)}
                  color="primary"
                />
              }
              label="Low power mode"
            />
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Backup sx={{ color: '#ffb74d' }} />
            Backup & Recovery
          </Typography>

          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.autoBackup}
                  onChange={(e) => updateSetting('autoBackup', e.target.checked)}
                  color="primary"
                />
              }
              label="Enable automatic backups"
            />

            {settings.autoBackup && (
              <>
                <TextField
                  label="Backup Location"
                  value={settings.backupLocation}
                  onChange={(e) => updateSetting('backupLocation', e.target.value)}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: '#404040' }
                    },
                    '& .MuiInputLabel-root': { color: '#b0b0b0' }
                  }}
                />

                <Typography variant="body2" sx={{ mb: 1 }}>Maximum backups to keep</Typography>
                <Slider
                  value={settings.maxBackups}
                  onChange={(e, value) => updateSetting('maxBackups', value)}
                  min={1}
                  max={50}
                  step={1}
                  valueLabelDisplay="auto"
                  sx={{ color: 'primary.main' }}
                />
              </>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );

  return (
    <Box sx={{ p: 3, bgcolor: '#1a1a1a', minHeight: '100vh', color: 'white' }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Settings
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#b0b0b0' }}>
            Customize ProPresenter to fit your workflow
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => setShowExportDialog(true)}
            sx={{ borderColor: '#81c784', color: '#81c784' }}
          >
            Export
          </Button>
          <Button
            variant="outlined"
            startIcon={<Upload />}
            onClick={() => setShowImportDialog(true)}
            sx={{ borderColor: 'primary.main', color: 'primary.main' }}
          >
            Import
          </Button>
          <Button
            variant="outlined"
            startIcon={<Restore />}
            onClick={() => setShowResetDialog(true)}
            sx={{ borderColor: '#ffb74d', color: '#ffb74d' }}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={saveSettings}
            sx={{ bgcolor: 'primary.main' }}
          >
            Save Changes
          </Button>
          {onClose && (
            <Button variant="outlined" onClick={onClose}>
              Close
            </Button>
          )}
        </Box>
      </Box>

      {/* Settings Tabs */}
      <Paper sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            borderBottom: '1px solid #404040',
            '& .MuiTab-root': { color: '#b0b0b0' },
            '& .MuiTab-root.Mui-selected': { color: 'primary.main' }
          }}
        >
          <Tab label="General" />
          <Tab label="Presentation" />
          <Tab label="Audio/Video" />
          <Tab label="Network" />
          <Tab label="Keyboard" />
          <Tab label="Advanced" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && renderGeneralTab()}
          {activeTab === 1 && renderPresentationTab()}
          {activeTab === 2 && renderAudioVideoTab()}
          {activeTab === 3 && renderNetworkTab()}
          {activeTab === 4 && renderKeyboardTab()}
          {activeTab === 5 && renderAdvancedTab()}
        </Box>
      </Paper>

      {/* Reset Dialog */}
      <Dialog
        open={showResetDialog}
        onClose={() => setShowResetDialog(false)}
        PaperProps={{
          sx: {
            bgcolor: '#2a2a2a',
            color: 'white',
            border: '1px solid #404040'
          }
        }}
      >
        <DialogTitle>Reset Settings</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to reset all settings to their default values? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResetDialog(false)} sx={{ color: '#b0b0b0' }}>
            Cancel
          </Button>
          <Button onClick={resetToDefaults} sx={{ color: '#e57373' }}>
            Reset
          </Button>
        </DialogActions>
      </Dialog>

      {/* Export Dialog */}
      <Dialog
        open={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        PaperProps={{
          sx: {
            bgcolor: '#2a2a2a',
            color: 'white',
            border: '1px solid #404040'
          }
        }}
      >
        <DialogTitle>Export Settings</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Export your current settings to a JSON file for backup or transfer to another computer.
          </Typography>
          <Alert severity="info" sx={{ bgcolor: '#333', color: '#b0b0b0' }}>
            This will include all your preferences, shortcuts, and configuration settings.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExportDialog(false)} sx={{ color: '#b0b0b0' }}>
            Cancel
          </Button>
          <Button onClick={exportSettings} sx={{ color: 'primary.main' }}>
            Export
          </Button>
        </DialogActions>
      </Dialog>

      {/* Import Dialog */}
      <Dialog
        open={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        PaperProps={{
          sx: {
            bgcolor: '#2a2a2a',
            color: 'white',
            border: '1px solid #404040'
          }
        }}
      >
        <DialogTitle>Import Settings</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Select a settings file to import. This will overwrite your current settings.
          </Typography>
          <input
            type="file"
            accept=".json"
            onChange={importSettings}
            style={{ color: 'white' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowImportDialog(false)} sx={{ color: '#b0b0b0' }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
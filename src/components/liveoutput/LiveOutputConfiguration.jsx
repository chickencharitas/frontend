import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Grid,
  Card,
  CardContent,
  TextField,
  Slider,
  FormControl,
  InputLabel,
  Divider,
  Chip,
  Stack,
  Tabs,
  Tab
} from '@mui/material';
import {
  Settings,
  VideoCall,
  Settings as SettingsIcon,
  Close,
  Check,
  Tv,
  ScreenShare,
  HighQuality,
  Palette as PaletteIcon,
  Save as SaveIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { brandConfig, brandThemes, applyGlobalTheme } from '../presenter/templates/config/brandConfig';

const LiveOutputConfiguration = ({ onConfigChange }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [displayOutputs, setDisplayOutputs] = useState([]);
  const [selectedOutput, setSelectedOutput] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState('default');

  const [config, setConfig] = useState({
    // Display Settings
    outputDisplay: 'primary',
    displayMode: 'fullscreen',
    
    // Resolution & Quality
    resolution: '1920x1080',
    refreshRate: 60,
    bitrate: 5000,
    quality: 'high',
    
    // Stream Settings
    streamingEnabled: false,
    streamUrl: '',
    streamKey: '',
    
    // Output Settings
    includePresenterNotes: false,
    includeTimer: true,
    includeMetadata: false,
    
    // Advanced
    useHardwareAcceleration: true,
    enablePreview: true,
    recordOutput: false
  });

  // Simulate getting available displays
  useEffect(() => {
    const outputs = [
      { id: 'primary', name: 'Primary Display (1920x1080)', resolution: '1920x1080' },
      { id: 'secondary', name: 'Secondary Display (1366x768)', resolution: '1366x768' },
      { id: 'hdmi', name: 'HDMI Output (3840x2160)', resolution: '3840x2160' }
    ];
    setDisplayOutputs(outputs);
    if (selectedOutput === null && outputs.length > 0) {
      setSelectedOutput(outputs[0].id);
    }
  }, []);

  const handleConfigChange = (key, value) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onConfigChange?.(newConfig);
    // Dispatch event for real-time updates
    window.dispatchEvent(
      new CustomEvent('presenter:output-config-changed', { detail: newConfig })
    );
  };

  const handleApplySettings = () => {
    // Save configuration
    localStorage.setItem('liveOutputConfig', JSON.stringify(config));
    window.dispatchEvent(
      new CustomEvent('presenter:output-config-applied', { detail: config })
    );
    setOpenDialog(false);
  };

  // Apply brand theme to output
  const handleApplyTheme = (theme) => {
    setSelectedTheme(theme);
    applyGlobalTheme(brandThemes[theme]);
    localStorage.setItem('brandTheme', JSON.stringify(brandThemes[theme]));
    window.dispatchEvent(
      new CustomEvent('presenter:theme-applied', { detail: { theme, config: brandThemes[theme] } })
    );
  };

  const resolutionOptions = [
    { value: '1280x720', label: '720p (16:9)', bitrate: 2500 },
    { value: '1920x1080', label: '1080p (16:9)', bitrate: 5000 },
    { value: '2560x1440', label: '1440p (16:9)', bitrate: 8000 },
    { value: '3840x2160', label: '4K (16:9)', bitrate: 15000 },
    { value: '1366x768', label: '768p (16:9)', bitrate: 2000 }
  ];

  const qualityPresets = [
    { value: 'low', bitrate: 1500, fps: 24 },
    { value: 'medium', bitrate: 3500, fps: 30 },
    { value: 'high', bitrate: 6000, fps: 60 },
    { value: 'ultra', bitrate: 12000, fps: 60 }
  ];

  return (
    <Box sx={{ bgcolor: '#1a1a1a', color: '#cccccc' }}>
      {/* Trigger Button */}
      <Button
        startIcon={<Settings />}
        onClick={() => setOpenDialog(true)}
        sx={{
          color: '#81c784',
          textTransform: 'none',
          backgroundColor: 'transparent',
          '&:hover': { backgroundColor: '#252526' }
        }}
      >
        Live Output Settings
      </Button>

      {/* Configuration Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { backgroundColor: '#252526', color: '#cccccc' } }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #404040', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Live Output Configuration</span>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <PaletteIcon sx={{ color: '#81c784' }} />
            <span style={{ fontSize: '0.9rem', color: '#81c784' }}>+ Brand Themes</span>
          </Box>
        </DialogTitle>

        {/* Tab Navigation */}
        <Box sx={{ borderBottom: '1px solid #404040' }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{
              '& .MuiTab-root': { color: '#808080' },
              '& .Mui-selected': { color: '#81c784' },
              '& .MuiTabs-indicator': { backgroundColor: '#81c784' }
            }}
          >
            <Tab label="Display Settings" />
            <Tab label="Theme & Branding" />
            <Tab label="Advanced" />
          </Tabs>
        </Box>

        <DialogContent sx={{ pt: 3 }}>
          {/* Tab 1: Display Settings */}
          {tabValue === 0 && (
          <Grid container spacing={3}>
            {/* Display Selection Section */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: '#81c784', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Tv /> Display & Output
              </Typography>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel sx={{ color: '#cccccc' }}>Output Display</InputLabel>
                <Select
                  value={selectedOutput || ''}
                  onChange={(e) => {
                    setSelectedOutput(e.target.value);
                    handleConfigChange('outputDisplay', e.target.value);
                  }}
                  sx={{
                    color: '#cccccc',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#404040' }
                  }}
                  label="Output Display"
                >
                  {displayOutputs.map(output => (
                    <MenuItem key={output.id} value={output.id} sx={{ backgroundColor: '#1a1a1a', color: '#cccccc' }}>
                      {output.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel sx={{ color: '#cccccc' }}>Display Mode</InputLabel>
                <Select
                  value={config.displayMode}
                  onChange={(e) => handleConfigChange('displayMode', e.target.value)}
                  sx={{
                    color: '#cccccc',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#404040' }
                  }}
                  label="Display Mode"
                >
                  <MenuItem value="fullscreen" sx={{ backgroundColor: '#1a1a1a' }}>Fullscreen</MenuItem>
                  <MenuItem value="windowed" sx={{ backgroundColor: '#1a1a1a' }}>Windowed</MenuItem>
                  <MenuItem value="scaled" sx={{ backgroundColor: '#1a1a1a' }}>Scaled</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Divider sx={{ width: '100%', backgroundColor: '#404040' }} />

            {/* Resolution & Quality Section */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: '#81c784', display: 'flex', alignItems: 'center', gap: 1 }}>
                <HighQuality /> Resolution & Quality
              </Typography>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel sx={{ color: '#cccccc' }}>Resolution</InputLabel>
                <Select
                  value={config.resolution}
                  onChange={(e) => {
                    handleConfigChange('resolution', e.target.value);
                    // Auto-set bitrate based on resolution
                    const preset = resolutionOptions.find(r => r.value === e.target.value);
                    if (preset) handleConfigChange('bitrate', preset.bitrate);
                  }}
                  sx={{
                    color: '#cccccc',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#404040' }
                  }}
                  label="Resolution"
                >
                  {resolutionOptions.map(res => (
                    <MenuItem key={res.value} value={res.value} sx={{ backgroundColor: '#1a1a1a' }}>
                      {res.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" sx={{ color: '#b0b0b0', mb: 1 }}>
                    Refresh Rate: {config.refreshRate} FPS
                  </Typography>
                  <Slider
                    value={config.refreshRate}
                    onChange={(e, value) => handleConfigChange('refreshRate', value)}
                    min={24}
                    max={60}
                    step={6}
                    marks={[
                      { value: 24, label: '24' },
                      { value: 30, label: '30' },
                      { value: 60, label: '60' }
                    ]}
                    sx={{
                      '& .MuiSlider-thumb': { backgroundColor: '#81c784' },
                      '& .MuiSlider-track': { backgroundColor: '#81c784' }
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" sx={{ color: '#b0b0b0', mb: 1 }}>
                    Bitrate: {config.bitrate} kbps
                  </Typography>
                  <Slider
                    value={config.bitrate}
                    onChange={(e, value) => handleConfigChange('bitrate', value)}
                    min={1000}
                    max={20000}
                    step={500}
                    marks={[
                      { value: 1000, label: '1M' },
                      { value: 10000, label: '10M' },
                      { value: 20000, label: '20M' }
                    ]}
                    sx={{
                      '& .MuiSlider-thumb': { backgroundColor: '#81c784' },
                      '& .MuiSlider-track': { backgroundColor: '#81c784' }
                    }}
                  />
                </Grid>
              </Grid>

              <FormControl fullWidth>
                <InputLabel sx={{ color: '#cccccc' }}>Quality Preset</InputLabel>
                <Select
                  value={config.quality}
                  onChange={(e) => handleConfigChange('quality', e.target.value)}
                  sx={{
                    color: '#cccccc',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#404040' }
                  }}
                  label="Quality Preset"
                >
                  <MenuItem value="low" sx={{ backgroundColor: '#1a1a1a' }}>Low (1.5 Mbps)</MenuItem>
                  <MenuItem value="medium" sx={{ backgroundColor: '#1a1a1a' }}>Medium (3.5 Mbps)</MenuItem>
                  <MenuItem value="high" sx={{ backgroundColor: '#1a1a1a' }}>High (6 Mbps)</MenuItem>
                  <MenuItem value="ultra" sx={{ backgroundColor: '#1a1a1a' }}>Ultra (12 Mbps)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Divider sx={{ width: '100%', backgroundColor: '#404040' }} />

            {/* Stream Settings Section */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: '#81c784', display: 'flex', alignItems: 'center', gap: 1 }}>
                <VideoCall /> Streaming Settings
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={config.streamingEnabled}
                    onChange={(e) => handleConfigChange('streamingEnabled', e.target.checked)}
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#81c784' } }}
                  />
                }
                label="Enable Live Streaming"
              />

              {config.streamingEnabled && (
                <Box sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Stream URL"
                    value={config.streamUrl}
                    onChange={(e) => handleConfigChange('streamUrl', e.target.value)}
                    placeholder="rtmp://streaming-service/live"
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        color: '#cccccc',
                        '& fieldset': { borderColor: '#404040' }
                      }
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Stream Key"
                    type="password"
                    value={config.streamKey}
                    onChange={(e) => handleConfigChange('streamKey', e.target.value)}
                    placeholder="Your stream key"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#cccccc',
                        '& fieldset': { borderColor: '#404040' }
                      }
                    }}
                  />
                </Box>
              )}
            </Grid>

            <Divider sx={{ width: '100%', backgroundColor: '#404040' }} />

            {/* Output Content Section */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: '#81c784' }}>
                Output Content
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={config.includeTimer}
                    onChange={(e) => handleConfigChange('includeTimer', e.target.checked)}
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#81c784' } }}
                  />
                }
                label="Show Timer/Clock"
                sx={{ display: 'block', mb: 1 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={config.includeMetadata}
                    onChange={(e) => handleConfigChange('includeMetadata', e.target.checked)}
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#81c784' } }}
                  />
                }
                label="Show Slide Metadata"
                sx={{ display: 'block', mb: 1 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={config.recordOutput}
                    onChange={(e) => handleConfigChange('recordOutput', e.target.checked)}
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#81c784' } }}
                  />
                }
                label="Record Output"
                sx={{ display: 'block' }}
              />
            </Grid>

            <Divider sx={{ width: '100%', backgroundColor: '#404040' }} />

            {/* Advanced Section */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: '#81c784' }}>
                Advanced Options
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={config.useHardwareAcceleration}
                    onChange={(e) => handleConfigChange('useHardwareAcceleration', e.target.checked)}
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#81c784' } }}
                  />
                }
                label="Use Hardware Acceleration"
                sx={{ display: 'block', mb: 1 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={config.enablePreview}
                    onChange={(e) => handleConfigChange('enablePreview', e.target.checked)}
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#81c784' } }}
                  />
                }
                label="Enable Preview Window"
              />
            </Grid>

            {/* Preview Card */}
            <Grid item xs={12}>
              {config.enablePreview && (
                <Card sx={{ backgroundColor: '#1a1a1a', borderRadius: 0 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: '#81c784', mb: 2 }}>
                      Output Preview
                    </Typography>
                    <Box
                      sx={{
                        aspectRatio: '16/9',
                        backgroundColor: '#0a0a0a',
                        border: '2px solid #404040',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        color: '#b0b0b0'
                      }}
                    >
                      {config.resolution} @ {config.refreshRate}fps
                      <br />
                      {config.quality.toUpperCase()} • {config.bitrate} kbps
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Grid>
          </Grid>
          )}

          {/* Tab 2: Theme & Branding */}
          {tabValue === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: '#81c784', display: 'flex', alignItems: 'center', gap: 1 }}>
                <PaletteIcon /> Brand Theme
              </Typography>

              <Typography variant="body2" sx={{ mb: 2, color: '#b0b0b0' }}>
                Select a brand theme to apply to the entire output. Colors and styling will update across all display elements.
              </Typography>
            </Grid>

            {/* Theme Options */}
            <Grid item xs={12}>
              <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
                {Object.entries(brandThemes).map(([themeName, themeConfig]) => (
                  <Button
                    key={themeName}
                    onClick={() => handleApplyTheme(themeName)}
                    variant={selectedTheme === themeName ? 'contained' : 'outlined'}
                    sx={{
                      backgroundColor: selectedTheme === themeName ? brandThemes[themeName].accent : 'transparent',
                      borderColor: brandThemes[themeName].accent,
                      color: selectedTheme === themeName ? '#1a1a1a' : brandThemes[themeName].accent,
                      textTransform: 'capitalize',
                      mb: 1
                    }}
                  >
                    {themeName}
                  </Button>
                ))}
              </Stack>
            </Grid>

            {/* Color Palette Preview */}
            <Grid item xs={12}>
              <Card sx={{ backgroundColor: '#1a1a1a' }}>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#81c784' }}>
                    Current Theme Colors
                  </Typography>
                  <Grid container spacing={1}>
                    {[
                      { name: 'Primary', color: brandThemes[selectedTheme]?.primary },
                      { name: 'Secondary', color: brandThemes[selectedTheme]?.secondary },
                      { name: 'Accent', color: brandThemes[selectedTheme]?.accent },
                      { name: 'Success', color: brandThemes[selectedTheme]?.success }
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
                              border: '2px solid #404040'
                            }}
                          />
                          <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                            {item.name}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Save Theme Button */}
            <Grid item xs={12}>
              <Button
                fullWidth
                startIcon={<SaveIcon />}
                onClick={() => {
                  localStorage.setItem('outputTheme', selectedTheme);
                  window.dispatchEvent(new CustomEvent('presenter:theme-saved', { detail: { theme: selectedTheme } }));
                }}
                variant="contained"
                sx={{ backgroundColor: '#81c784', color: '#1a1a1a' }}
              >
                Save Theme Preference
              </Button>
            </Grid>
          </Grid>
          )}

          {/* Tab 3: Advanced */}
          {tabValue === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: '#81c784' }}>
                Advanced Output Settings
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={config.useHardwareAcceleration}
                    onChange={(e) => handleConfigChange('useHardwareAcceleration', e.target.checked)}
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#81c784' } }}
                  />
                }
                label="Use Hardware Acceleration"
                sx={{ display: 'block', mb: 2 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={config.recordOutput}
                    onChange={(e) => handleConfigChange('recordOutput', e.target.checked)}
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#81c784' } }}
                  />
                }
                label="Record Output Stream"
                sx={{ display: 'block' }}
              />
            </Grid>
          </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ borderTop: '1px solid #404040', p: 2 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{ color: '#b0b0b0' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleApplySettings}
            variant="contained"
            sx={{ backgroundColor: '#81c784', color: '#1a1a1a' }}
          >
            Apply Settings
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LiveOutputConfiguration;

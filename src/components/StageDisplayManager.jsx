import React, { useState, useEffect } from 'react';
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
  Fab,
  Tooltip,
  Stack,
  Badge,
  Avatar
} from '@mui/material';
import {
  Tv,
  TvOff,
  Settings,
  Refresh,
  PlayArrow,
  Stop,
  VolumeUp,
  VolumeOff,
  AspectRatio,
  Fullscreen,
  FullscreenExit,
  Wifi,
  WifiOff,
  NetworkCheck,
  Monitor,
  MonitorOutlined,
  Cast,
  CastConnected,
  ExpandMore,
  CheckCircle,
  Error,
  Warning,
  Info,
  Palette,
  Brightness6,
  Contrast,
  Tune,
  Visibility,
  VisibilityOff,
  Add,
  Add as AddIcon
} from '@mui/icons-material';

// Mock display configurations
const mockDisplays = [
  {
    id: 'main',
    name: 'Main Display (Audience)',
    type: 'audience',
    resolution: '1920x1080',
    connected: true,
    active: true,
    position: { x: 0, y: 0 },
    primary: true
  },
  {
    id: 'stage1',
    name: 'Stage Display 1',
    type: 'stage',
    resolution: '1280x720',
    connected: true,
    active: true,
    position: { x: 1920, y: 0 },
    primary: false
  },
  {
    id: 'stage2',
    name: 'Stage Display 2',
    type: 'stage',
    resolution: '1024x768',
    connected: false,
    active: false,
    position: { x: 3200, y: 0 },
    primary: false
  },
  {
    id: 'confidence',
    name: 'Confidence Monitor',
    type: 'confidence',
    resolution: '1280x720',
    connected: true,
    active: true,
    position: { x: 0, y: 1080 },
    primary: false
  }
];

// Mock output configurations
const mockOutputs = [
  {
    id: 'hdmi1',
    name: 'HDMI 1',
    type: 'hdmi',
    status: 'active',
    display: 'main',
    resolution: '1920x1080@60Hz'
  },
  {
    id: 'hdmi2',
    name: 'HDMI 2',
    type: 'hdmi',
    status: 'active',
    display: 'stage1',
    resolution: '1280x720@60Hz'
  },
  {
    id: 'displayport',
    name: 'DisplayPort',
    type: 'displayport',
    status: 'disconnected',
    display: null,
    resolution: null
  },
  {
    id: 'network1',
    name: 'Network Output 1',
    type: 'network',
    status: 'active',
    display: 'confidence',
    resolution: '1280x720@30Hz',
    ip: '192.168.1.100',
    port: 5004
  }
];

export default function StageDisplayManager({ onClose }) {
  const [displays, setDisplays] = useState(mockDisplays);
  const [outputs, setOutputs] = useState(mockOutputs);
  const [selectedDisplay, setSelectedDisplay] = useState('main');
  const [activeTab, setActiveTab] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showCalibration, setShowCalibration] = useState(false);

  // Display settings
  const [brightness, setBrightness] = useState(80);
  const [contrast, setContrast] = useState(90);
  const [saturation, setSaturation] = useState(100);

  // Network settings
  const [networkOutputs, setNetworkOutputs] = useState([
    { ip: '192.168.1.100', port: 5004, enabled: true },
    { ip: '192.168.1.101', port: 5004, enabled: false }
  ]);

  const getDisplayTypeIcon = (type) => {
    switch (type) {
      case 'audience': return <Tv color="primary" />;
      case 'stage': return <Monitor color="secondary" />;
      case 'confidence': return <MonitorOutlined color="info" />;
      default: return <Monitor />;
    }
  };

  const getDisplayTypeColor = (type) => {
    switch (type) {
      case 'audience': return 'primary';
      case 'stage': return 'secondary';
      case 'confidence': return 'info';
      default: return 'default';
    }
  };

  const getOutputStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle color="success" />;
      case 'disconnected': return <Error color="error" />;
      case 'connecting': return <Warning color="warning" />;
      default: return <Info color="disabled" />;
    }
  };

  const toggleDisplay = (displayId) => {
    setDisplays(displays.map(display =>
      display.id === displayId
        ? { ...display, active: !display.active }
        : display
    ));
  };

  const toggleOutput = (outputId) => {
    setOutputs(outputs.map(output =>
      output.id === outputId
        ? {
            ...output,
            status: output.status === 'active' ? 'disconnected' : 'active'
          }
        : output
    ));
  };

  const detectDisplays = () => {
    // Mock display detection
    console.log('Detecting displays...');
    // In a real app, this would scan for connected displays
  };

  const calibrateDisplay = (displayId) => {
    setSelectedDisplay(displayId);
    setShowCalibration(true);
  };

  const applyCalibration = () => {
    console.log('Applying calibration settings:', { brightness, contrast, saturation });
    setShowCalibration(false);
  };

  const addNetworkOutput = () => {
    setNetworkOutputs([...networkOutputs, { ip: '', port: 5004, enabled: false }]);
  };

  const updateNetworkOutput = (index, field, value) => {
    const updated = [...networkOutputs];
    updated[index][field] = value;
    setNetworkOutputs(updated);
  };

  const removeNetworkOutput = (index) => {
    setNetworkOutputs(networkOutputs.filter((_, i) => i !== index));
  };

  const selectedDisplayData = displays.find(d => d.id === selectedDisplay);

  return (
    <Box sx={{ p: 3, bgcolor: '#1a1a1a', minHeight: '100vh', color: 'white' }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Stage Display Manager
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#b0b0b0' }}>
            Configure multiple outputs and display settings for professional presentations
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={detectDisplays}
            sx={{ borderColor: 'primary.main', color: 'primary.main' }}
          >
            Detect Displays
          </Button>
          <Button
            variant="outlined"
            startIcon={<Settings />}
            onClick={() => setShowSettings(true)}
            sx={{ borderColor: '#ffb74d', color: '#ffb74d' }}
          >
            Settings
          </Button>
          {onClose && (
            <Button variant="outlined" onClick={onClose}>
              Close
            </Button>
          )}
        </Box>
      </Box>

      {/* Status Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Monitor color="primary" />
                <Typography variant="h6">Active Displays</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {displays.filter(d => d.active).length}/{displays.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Connected displays
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Cast color="secondary" />
                <Typography variant="h6">Active Outputs</Typography>
              </Box>
              <Typography variant="h4" color="secondary">
                {outputs.filter(o => o.status === 'active').length}/{outputs.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Output connections
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <NetworkCheck color="info" />
                <Typography variant="h6">Network Outputs</Typography>
              </Box>
              <Typography variant="h4" color="info">
                {networkOutputs.filter(n => n.enabled).length}/{networkOutputs.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Network streaming
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
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
          <Tab label="Displays" />
          <Tab label="Outputs" />
          <Tab label="Network" />
          <Tab label="Calibration" />
        </Tabs>

        {/* Displays Tab */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
              Display Configuration
            </Typography>

            <Grid container spacing={3}>
              {displays.map((display) => (
                <Grid item xs={12} md={6} key={display.id}>
                  <Card
                    sx={{
                      bgcolor: display.active ? '#333' : '#2a2a2a',
                      border: display.active ? '2px solid' : '1px solid #404040',
                      borderColor: display.active ? 'primary.main' : '#404040',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      '&:hover': { borderColor: 'primary.main' }
                    }}
                    onClick={() => setSelectedDisplay(display.id)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {getDisplayTypeIcon(display.type)}
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              {display.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {display.resolution}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={display.type}
                            size="small"
                            color={getDisplayTypeColor(display.type)}
                            variant="outlined"
                          />
                          {display.primary && (
                            <Chip label="Primary" size="small" color="success" />
                          )}
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {display.connected ? (
                            <CheckCircle color="success" />
                          ) : (
                            <Error color="error" />
                          )}
                          <Typography variant="body2">
                            {display.connected ? 'Connected' : 'Disconnected'}
                          </Typography>
                        </Box>

                        <FormControlLabel
                          control={
                            <Switch
                              checked={display.active}
                              onChange={() => toggleDisplay(display.id)}
                              color="primary"
                            />
                          }
                          label={display.active ? 'Active' : 'Inactive'}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={(e) => {
                            e.stopPropagation();
                            calibrateDisplay(display.id);
                          }}
                          sx={{ borderColor: '#ffb74d', color: '#ffb74d' }}
                        >
                          Calibrate
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{ borderColor: '#81c784', color: '#81c784' }}
                        >
                          Settings
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Outputs Tab */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
              Output Configuration
            </Typography>

            <Grid container spacing={2}>
              {outputs.map((output) => (
                <Grid item xs={12} md={6} lg={4} key={output.id}>
                  <Card sx={{ bgcolor: '#333', border: '1px solid #404040' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {output.type === 'network' ? (
                            <Wifi color={output.status === 'active' ? 'success' : 'disabled'} />
                          ) : output.type === 'hdmi' ? (
                            <Cast color={output.status === 'active' ? 'success' : 'disabled'} />
                          ) : (
                            <Settings color={output.status === 'active' ? 'success' : 'disabled'} />
                          )}
                          <Typography variant="h6">{output.name}</Typography>
                        </Box>
                        {getOutputStatusIcon(output.status)}
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Type: {output.type.toUpperCase()}
                      </Typography>
                      {output.resolution && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Resolution: {output.resolution}
                        </Typography>
                      )}
                      {output.display && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Display: {displays.find(d => d.id === output.display)?.name}
                        </Typography>
                      )}

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip
                          label={output.status}
                          color={output.status === 'active' ? 'success' : 'default'}
                          size="small"
                        />
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => toggleOutput(output.id)}
                          sx={{
                            borderColor: output.status === 'active' ? '#e57373' : 'primary.main',
                            color: output.status === 'active' ? '#e57373' : 'primary.main'
                          }}
                        >
                          {output.status === 'active' ? 'Disconnect' : 'Connect'}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Network Tab */}
        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Network Outputs
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={addNetworkOutput}
                sx={{ bgcolor: 'primary.main' }}
              >
                Add Output
              </Button>
            </Box>

            <Stack spacing={2}>
              {networkOutputs.map((output, index) => (
                <Card key={index} sx={{ bgcolor: '#333', border: '1px solid #404040' }}>
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="IP Address"
                          value={output.ip}
                          onChange={(e) => updateNetworkOutput(index, 'ip', e.target.value)}
                          size="small"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              color: 'white',
                              '& fieldset': { borderColor: '#404040' },
                              '&:hover fieldset': { borderColor: 'primary.main' }
                            },
                            '& .MuiInputLabel-root': { color: '#b0b0b0' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          label="Port"
                          type="number"
                          value={output.port}
                          onChange={(e) => updateNetworkOutput(index, 'port', parseInt(e.target.value))}
                          size="small"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              color: 'white',
                              '& fieldset': { borderColor: '#404040' },
                              '&:hover fieldset': { borderColor: 'primary.main' }
                            },
                            '& .MuiInputLabel-root': { color: '#b0b0b0' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={output.enabled}
                              onChange={(e) => updateNetworkOutput(index, 'enabled', e.target.checked)}
                              color="primary"
                            />
                          }
                          label="Enabled"
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => removeNetworkOutput(index)}
                          size="small"
                        >
                          Remove
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Stack>

            <Alert severity="info" sx={{ mt: 3, bgcolor: '#2a2a2a', color: '#b0b0b0' }}>
              <Typography variant="body2">
                Network outputs allow you to stream your presentation to remote displays over the network.
                Make sure all devices are on the same network and the ports are not blocked by firewalls.
              </Typography>
            </Alert>
          </Box>
        )}

        {/* Calibration Tab */}
        {activeTab === 3 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
              Display Calibration
            </Typography>

            {selectedDisplayData && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                  Calibrating: {selectedDisplayData.name}
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ bgcolor: '#333', border: '1px solid #404040' }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>Brightness</Typography>
                        <Slider
                          value={brightness}
                          onChange={(e, newValue) => setBrightness(newValue)}
                          min={0}
                          max={100}
                          step={1}
                          sx={{ color: 'primary.main' }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
                          {brightness}%
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Card sx={{ bgcolor: '#333', border: '1px solid #404040' }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>Contrast</Typography>
                        <Slider
                          value={contrast}
                          onChange={(e, newValue) => setContrast(newValue)}
                          min={0}
                          max={100}
                          step={1}
                          sx={{ color: 'primary.main' }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
                          {contrast}%
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Card sx={{ bgcolor: '#333', border: '1px solid #404040' }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>Saturation</Typography>
                        <Slider
                          value={saturation}
                          onChange={(e, newValue) => setSaturation(newValue)}
                          min={0}
                          max={100}
                          step={1}
                          sx={{ color: 'primary.main' }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
                          {saturation}%
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  <Button
                    variant="contained"
                    onClick={applyCalibration}
                    sx={{ bgcolor: 'primary.main' }}
                  >
                    Apply Settings
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setBrightness(80);
                      setContrast(90);
                      setSaturation(100);
                    }}
                    sx={{ borderColor: '#ffb74d', color: '#ffb74d' }}
                  >
                    Reset to Default
                  </Button>
                </Box>
              </Box>
            )}

            <Alert severity="warning" sx={{ bgcolor: '#2a2a2a', color: '#ffb74d' }}>
              <Typography variant="body2">
                <strong>Note:</strong> Calibration settings will be applied to the selected display only.
                Make sure the display is active and connected before applying changes.
              </Typography>
            </Alert>
          </Box>
        )}
      </Paper>

      {/* Settings Dialog */}
      <Dialog
        open={showSettings}
        onClose={() => setShowSettings(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#2a2a2a',
            color: 'white',
            border: '1px solid #404040'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>Display Settings</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Configure global display and output settings.
          </Typography>

          <Stack spacing={3}>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Auto-detect displays on startup"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Show display connection notifications"
            />
            <FormControlLabel
              control={<Switch />}
              label="Enable network discovery"
            />

            <Divider sx={{ bgcolor: '#404040' }} />

            <FormControl fullWidth>
              <InputLabel sx={{ color: '#b0b0b0' }}>Default Resolution</InputLabel>
              <Select
                defaultValue="1920x1080"
                sx={{
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#404040' }
                }}
              >
                <MenuItem value="1920x1080">1920x1080 (Full HD)</MenuItem>
                <MenuItem value="1280x720">1280x720 (HD)</MenuItem>
                <MenuItem value="1024x768">1024x768 (XGA)</MenuItem>
                <MenuItem value="800x600">800x600 (SVGA)</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel sx={{ color: '#b0b0b0' }}>Refresh Rate</InputLabel>
              <Select
                defaultValue="60"
                sx={{
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#404040' }
                }}
              >
                <MenuItem value="30">30 Hz</MenuItem>
                <MenuItem value="50">50 Hz</MenuItem>
                <MenuItem value="60">60 Hz</MenuItem>
                <MenuItem value="120">120 Hz</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettings(false)} sx={{ color: '#b0b0b0' }}>
            Cancel
          </Button>
          <Button variant="contained" sx={{ bgcolor: 'primary.main' }}>
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>

      {/* Calibration Dialog */}
      <Dialog
        open={showCalibration}
        onClose={() => setShowCalibration(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#2a2a2a',
            color: 'white',
            border: '1px solid #404040'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>Quick Calibration</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Adjust display settings for optimal viewing on {selectedDisplayData?.name}.
          </Typography>

          <Stack spacing={3}>
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>Brightness</Typography>
              <Slider
                value={brightness}
                onChange={(e, newValue) => setBrightness(newValue)}
                min={0}
                max={100}
                step={1}
                sx={{ color: 'primary.main' }}
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCalibration(false)} sx={{ color: '#b0b0b0' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={applyCalibration}
            sx={{ bgcolor: 'primary.main' }}
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
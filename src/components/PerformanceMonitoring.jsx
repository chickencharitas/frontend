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
  LinearProgress,
  CircularProgress,
  Chip,
  Alert,
  Tabs,
  Tab,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  Avatar,
  Badge
} from '@mui/material';
import {
  Memory,
  Storage,
  Speed,
  NetworkCheck,
  Videocam,
  Audiotrack,
  Monitor,
  Warning,
  CheckCircle,
  Error,
  Info,
  Timeline,
  BarChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  Refresh,
  Settings,
  BugReport,
  Assessment,
  SystemUpdate,
  Wifi,
  WifiOff,
  BatteryFull,
  Battery20,
  Thermostat,
  Schedule
} from '@mui/icons-material';

// Mock performance data
const mockSystemStats = {
  cpu: {
    usage: 45,
    temperature: 68,
    cores: 8,
    frequency: 3.2
  },
  memory: {
    used: 8.2,
    total: 16,
    percentage: 51.3
  },
  storage: {
    used: 245,
    total: 512,
    percentage: 47.9
  },
  network: {
    upload: 2.4,
    download: 15.7,
    latency: 23,
    status: 'connected'
  },
  displays: [
    { id: 'main', resolution: '1920x1080', refresh: 60, status: 'active' },
    { id: 'stage', resolution: '1280x720', refresh: 60, status: 'active' },
    { id: 'confidence', resolution: '1280x720', refresh: 30, status: 'active' }
  ]
};

const mockPerformanceHistory = [
  { time: '14:00', cpu: 32, memory: 45, network: 12 },
  { time: '14:05', cpu: 28, memory: 47, network: 8 },
  { time: '14:10', cpu: 35, memory: 49, network: 15 },
  { time: '14:15', cpu: 42, memory: 52, network: 22 },
  { time: '14:20', cpu: 38, memory: 48, network: 18 },
  { time: '14:25', cpu: 45, memory: 51, network: 25 }
];

const mockAlerts = [
  {
    id: '1',
    type: 'warning',
    title: 'High CPU Usage',
    message: 'CPU usage has exceeded 80% for the last 5 minutes',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    resolved: false
  },
  {
    id: '2',
    type: 'info',
    title: 'Network Latency',
    message: 'Network latency increased to 45ms',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    resolved: true
  },
  {
    id: '3',
    type: 'error',
    title: 'Display Connection Lost',
    message: 'Stage display connection was temporarily lost',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    resolved: true
  }
];

const mockProcesses = [
  { name: 'Presenter', cpu: 15.2, memory: 245, status: 'running' },
  { name: 'Display Output', cpu: 8.7, memory: 89, status: 'running' },
  { name: 'Network Server', cpu: 3.1, memory: 45, status: 'running' },
  { name: 'Media Engine', cpu: 12.8, memory: 156, status: 'running' },
  { name: 'System Monitor', cpu: 1.2, memory: 23, status: 'running' }
];

export default function PerformanceMonitoring({ onClose }) {
  const [activeTab, setActiveTab] = useState(0);
  const [realTimeData, setRealTimeData] = useState(mockSystemStats);
  const [performanceHistory, setPerformanceHistory] = useState(mockPerformanceHistory);
  const [alerts, setAlerts] = useState(mockAlerts);
  const [processes, setProcesses] = useState(mockProcesses);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Simulate fluctuating performance data
      setRealTimeData(prev => ({
        ...prev,
        cpu: {
          ...prev.cpu,
          usage: Math.max(10, Math.min(90, prev.cpu.usage + (Math.random() - 0.5) * 10))
        },
        memory: {
          ...prev.memory,
          used: Math.max(6, Math.min(14, prev.memory.used + (Math.random() - 0.5) * 0.5)),
          percentage: 0 // Will be calculated below
        },
        network: {
          ...prev.network,
          upload: Math.max(0.5, Math.min(10, prev.network.upload + (Math.random() - 0.5) * 2)),
          download: Math.max(5, Math.min(50, prev.network.download + (Math.random() - 0.5) * 10)),
          latency: Math.max(10, Math.min(100, prev.network.latency + (Math.random() - 0.5) * 20))
        }
      }));

      // Update memory percentage
      setRealTimeData(prev => ({
        ...prev,
        memory: {
          ...prev.memory,
          percentage: (prev.memory.used / prev.memory.total) * 100
        }
      }));

      // Add new data point to history
      setPerformanceHistory(prev => {
        const newPoint = {
          time: new Date().toLocaleTimeString(),
          cpu: realTimeData.cpu.usage,
          memory: realTimeData.memory.percentage,
          network: realTimeData.network.download
        };
        return [...prev.slice(-11), newPoint]; // Keep last 12 points
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh, realTimeData]);

  const getStatusColor = (value, thresholds) => {
    if (value >= thresholds.high) return '#e57373'; // Red
    if (value >= thresholds.medium) return '#ffb74d'; // Orange
    return '#81c784'; // Green
  };

  const getStatusIcon = (type, status) => {
    switch (type) {
      case 'cpu':
        return status >= 80 ? <Warning color="error" /> : <CheckCircle color="success" />;
      case 'memory':
        return status >= 90 ? <Warning color="error" /> : <CheckCircle color="success" />;
      case 'network':
        return status === 'connected' ? <Wifi color="success" /> : <WifiOff color="error" />;
      case 'storage':
        return status >= 95 ? <Warning color="error" /> : <CheckCircle color="success" />;
      default:
        return <Info color="info" />;
    }
  };

  const formatBytes = (bytes) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const renderOverviewTab = () => (
    <Box>
      {/* Real-time Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <Speed sx={{ fontSize: 32, color: getStatusColor(realTimeData.cpu.usage, { low: 0, medium: 60, high: 80 }), mr: 1 }} />
                <Typography variant="h4" color="primary">
                  {Math.round(realTimeData.cpu.usage)}%
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                CPU Usage
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {realTimeData.cpu.temperature}°C • {realTimeData.cpu.cores} cores
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <Memory sx={{ fontSize: 32, color: getStatusColor(realTimeData.memory.percentage, { low: 0, medium: 70, high: 90 }), mr: 1 }} />
                <Typography variant="h4" color="primary">
                  {realTimeData.memory.percentage.toFixed(1)}%
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Memory Usage
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {realTimeData.memory.used.toFixed(1)}GB / {realTimeData.memory.total}GB
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <Storage sx={{ fontSize: 32, color: getStatusColor(realTimeData.storage.percentage, { low: 0, medium: 80, high: 95 }), mr: 1 }} />
                <Typography variant="h4" color="primary">
                  {realTimeData.storage.percentage.toFixed(1)}%
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Storage Usage
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatBytes(realTimeData.storage.used * 1024 * 1024 * 1024)} / {formatBytes(realTimeData.storage.total * 1024 * 1024 * 1024)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                {getStatusIcon('network', realTimeData.network.status)}
                <Typography variant="h4" color="primary" sx={{ ml: 1 }}>
                  {realTimeData.network.latency}ms
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Network Latency
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ↑{realTimeData.network.upload.toFixed(1)} ↓{realTimeData.network.download.toFixed(1)} Mbps
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Performance Chart */}
      <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040', mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Timeline sx={{ color: 'primary.main' }} />
            Performance History (Last 30 minutes)
          </Typography>

          <Box sx={{ height: 200, display: 'flex', alignItems: 'end', gap: 1, px: 2 }}>
            {performanceHistory.map((point, index) => (
              <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <Tooltip title={`CPU: ${point.cpu}%, Memory: ${point.memory}%, Network: ${point.network}Mbps`}>
                  <Box
                    sx={{
                      width: '100%',
                      maxWidth: 30,
                      height: `${point.cpu * 2}px`,
                      bgcolor: 'primary.main',
                      borderRadius: '2px 2px 0 0',
                      mb: 1
                    }}
                  />
                </Tooltip>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem' }}>
                  {point.time.split(':')[1]}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Active Displays */}
      <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Monitor sx={{ color: '#81c784' }} />
            Active Displays
          </Typography>

          <Grid container spacing={2}>
            {realTimeData.displays.map((display) => (
              <Grid item xs={12} md={4} key={display.id}>
                <Box sx={{
                  p: 2,
                  border: '1px solid #404040',
                  borderRadius: 1,
                  bgcolor: display.status === 'active' ? '#333' : '#2a2a2a'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: 'white' }}>
                      {display.id.charAt(0).toUpperCase() + display.id.slice(1)} Display
                    </Typography>
                    <Chip
                      label={display.status}
                      size="small"
                      color={display.status === 'active' ? 'success' : 'default'}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {display.resolution} @ {display.refresh}Hz
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );

  const renderProcessesTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Running Processes</Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={() => {
            // Simulate refreshing process list
            setProcesses(prev => prev.map(p => ({
              ...p,
              cpu: Math.max(0.1, Math.min(50, p.cpu + (Math.random() - 0.5) * 5)),
              memory: Math.max(10, Math.min(500, p.memory + (Math.random() - 0.5) * 20))
            })));
          }}
          sx={{ borderColor: 'primary.main', color: 'primary.main' }}
        >
          Refresh
        </Button>
      </Box>

      <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
        <CardContent sx={{ p: 0 }}>
          <List>
            {processes.map((process, index) => (
              <ListItem
                key={index}
                sx={{
                  borderBottom: index < processes.length - 1 ? '1px solid #404040' : 'none',
                  '&:hover': { bgcolor: '#333' }
                }}
              >
                <ListItemIcon>
                  <Avatar sx={{
                    bgcolor: process.status === 'running' ? 'primary.main' : '#e57373',
                    width: 32,
                    height: 32
                  }}>
                    {process.name.charAt(0)}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" sx={{ color: 'white' }}>
                      {process.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      Status: {process.status}
                    </Typography>
                  }
                />
                <Box sx={{ display: 'flex', gap: 2, mr: 2 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      {process.cpu.toFixed(1)}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      CPU
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      {process.memory}MB
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Memory
                    </Typography>
                  </Box>
                </Box>
                <ListItemSecondaryAction>
                  <IconButton size="small" sx={{ color: '#e57373' }}>
                    <Warning fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );

  const renderAlertsTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">System Alerts & Events</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" sx={{ borderColor: '#81c784', color: '#81c784' }}>
            Clear Resolved
          </Button>
          <Button variant="outlined" sx={{ borderColor: '#e57373', color: '#e57373' }}>
            Clear All
          </Button>
        </Box>
      </Box>

      <Stack spacing={2}>
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            severity={alert.type}
            sx={{
              bgcolor: '#2a2a2a',
              border: '1px solid #404040',
              color: 'white',
              '& .MuiAlert-icon': {
                color: alert.type === 'error' ? '#e57373' :
                       alert.type === 'warning' ? '#ffb74d' : '#81c784'
              }
            }}
            action={
              !alert.resolved && (
                <Button color="inherit" size="small">
                  Resolve
                </Button>
              )
            }
          >
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
              {alert.title}
            </Typography>
            <Typography variant="body2">
              {alert.message}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              {alert.timestamp.toLocaleString()}
              {alert.resolved && ' • Resolved'}
            </Typography>
          </Alert>
        ))}
      </Stack>

      {alerts.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CheckCircle sx={{ fontSize: 64, color: '#81c784', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#b0b0b0', mb: 1 }}>
            No Active Alerts
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            System is running normally with no performance issues detected.
          </Typography>
        </Box>
      )}
    </Box>
  );

  const renderSettingsTab = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Settings sx={{ color: 'primary.main' }} />
        Monitoring Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Data Collection</Typography>

              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Auto-refresh data</Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    sx={{
                      borderColor: autoRefresh ? '#81c784' : '#e57373',
                      color: autoRefresh ? '#81c784' : '#e57373'
                    }}
                  >
                    {autoRefresh ? 'ON' : 'OFF'}
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Refresh interval</Typography>
                  <Chip label="5 seconds" size="small" sx={{ bgcolor: '#404040', color: '#b0b0b0' }} />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">History retention</Typography>
                  <Chip label="30 minutes" size="small" sx={{ bgcolor: '#404040', color: '#b0b0b0' }} />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Alert Thresholds</Typography>

              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>CPU Warning Threshold</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" color="primary">60%</Typography>
                    <LinearProgress variant="determinate" value={60} sx={{ flex: 1, bgcolor: '#404040' }} />
                  </Box>
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>Memory Critical Threshold</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" color="error">90%</Typography>
                    <LinearProgress variant="determinate" value={90} sx={{ flex: 1, bgcolor: '#404040' }} />
                  </Box>
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>Network Latency Warning</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" color="warning">50ms</Typography>
                    <LinearProgress variant="determinate" value={50} sx={{ flex: 1, bgcolor: '#404040' }} />
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button variant="outlined" sx={{ borderColor: '#ffb74d', color: '#ffb74d' }}>
          Reset to Defaults
        </Button>
        <Button variant="contained" sx={{ bgcolor: 'primary.main' }}>
          Save Settings
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ p: 3, bgcolor: '#1a1a1a', minHeight: '100vh', color: 'white' }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Performance Monitoring
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#b0b0b0' }}>
            Real-time system monitoring and performance analytics
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => {
              // Force refresh all data
              setRealTimeData(mockSystemStats);
              setPerformanceHistory(mockPerformanceHistory);
            }}
            sx={{ borderColor: 'primary.main', color: 'primary.main' }}
          >
            Refresh All
          </Button>
          <Button
            variant="outlined"
            startIcon={<BugReport />}
            sx={{ borderColor: '#ffb74d', color: '#ffb74d' }}
          >
            Generate Report
          </Button>
          {onClose && (
            <Button variant="outlined" onClick={onClose}>
              Close
            </Button>
          )}
        </Box>
      </Box>

      {/* Status Indicators */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Chip
          icon={<CheckCircle />}
          label="System: Online"
          sx={{ bgcolor: '#2a2a2a', color: '#81c784', border: '1px solid #404040' }}
        />
        <Chip
          icon={<Speed />}
          label={`CPU: ${Math.round(realTimeData.cpu.usage)}%`}
          sx={{
            bgcolor: '#2a2a2a',
            color: getStatusColor(realTimeData.cpu.usage, { low: 0, medium: 60, high: 80 }),
            border: '1px solid #404040'
          }}
        />
        <Chip
          icon={<Memory />}
          label={`Memory: ${realTimeData.memory.percentage.toFixed(0)}%`}
          sx={{
            bgcolor: '#2a2a2a',
            color: getStatusColor(realTimeData.memory.percentage, { low: 0, medium: 70, high: 90 }),
            border: '1px solid #404040'
          }}
        />
        <Chip
          icon={realTimeData.network.status === 'connected' ? <Wifi /> : <WifiOff />}
          label={`Network: ${realTimeData.network.latency}ms`}
          sx={{
            bgcolor: '#2a2a2a',
            color: realTimeData.network.status === 'connected' ? '#81c784' : '#e57373',
            border: '1px solid #404040'
          }}
        />
      </Box>

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
          <Tab label="Overview" />
          <Tab label="Processes" />
          <Tab label="Alerts" />
          <Tab label="Settings" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && renderOverviewTab()}
          {activeTab === 1 && renderProcessesTab()}
          {activeTab === 2 && renderAlertsTab()}
          {activeTab === 3 && renderSettingsTab()}
        </Box>
      </Paper>
    </Box>
  );
}
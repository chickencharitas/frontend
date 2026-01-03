import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
  Typography,
  IconButton,
} from '@mui/material';
import {
  Devices as DevicesIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { getInvokeFunction } from '../utils/mockDevices';

export default function DeviceManager() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [invoke] = useState(() => getInvokeFunction());

  const scanDevices = async () => {
    setLoading(true);
    setError(null);
    try {
      const networkDevices = await invoke('detect_devices');
      const usbDevices = await invoke('detect_usb_devices');
      setDevices([...networkDevices, ...usbDevices]);
    } catch (err) {
      setError(err.message || 'Failed to scan devices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    scanDevices();
  }, []);

  const handleEditClick = (device) => {
    setSelectedDevice(device);
    setEditFormData({ ...device });
    setEditDialogOpen(true);
  };

  const handleSaveDevice = async () => {
    try {
      // Save configuration
      await invoke('save_device_config', {
        config: editFormData,
      });
      setEditDialogOpen(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteDevice = async (deviceId) => {
    try {
      // Delete device configuration
      setDevices(devices.filter(d => d.id !== deviceId));
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return '#4caf50';
      case 'disconnected':
        return '#f44336';
      case 'error':
        return '#ff9800';
      default:
        return '#9e9e9e';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return <CheckCircleIcon sx={{ color: '#4caf50' }} />;
      case 'disconnected':
      case 'error':
        return <ErrorIcon sx={{ color: '#f44336' }} />;
      default:
        return <CircularProgress size={20} />;
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#1a1a1a', minHeight: '100vh', color: '#e0e0e0' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <DevicesIcon sx={{ fontSize: 32, color: '#81c784' }} />
          <Typography variant="h4">Device Manager</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={scanDevices}
          disabled={loading}
          sx={{
            backgroundColor: '#81c784',
            color: '#000',
            '&:hover': { backgroundColor: '#66bb6a' },
          }}
        >
          {loading ? 'Scanning...' : 'Scan Devices'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && devices.length === 0 && (
        <Alert severity="info">No devices found. Click "Scan Devices" to search your network.</Alert>
      )}

      <Grid container spacing={2}>
        {devices.map((device) => (
          <Grid item xs={12} sm={6} md={4} key={device.id}>
            <Card
              sx={{
                backgroundColor: '#252526',
                color: '#e0e0e0',
                border: `2px solid ${getStatusColor(device.status)}`,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <CardContent sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">{device.name}</Typography>
                  {getStatusIcon(device.status)}
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={device.device_type}
                    size="small"
                    sx={{
                      backgroundColor: '#3c3c3d',
                      color: '#81c784',
                      mr: 1,
                      mb: 1,
                    }}
                  />
                  <Chip
                    label={device.status}
                    size="small"
                    sx={{
                      backgroundColor: getStatusColor(device.status),
                      color: '#fff',
                    }}
                  />
                </Box>

                <List dense>
                  {device.ip_address && (
                    <ListItem disableGutters>
                      <ListItemText
                        primary="IP Address"
                        secondary={device.ip_address}
                        primaryTypographyProps={{ fontSize: '0.875rem' }}
                        secondaryTypographyProps={{ fontSize: '0.8rem' }}
                      />
                    </ListItem>
                  )}
                  {device.port && (
                    <ListItem disableGutters>
                      <ListItemText
                        primary="Port"
                        secondary={device.port}
                        primaryTypographyProps={{ fontSize: '0.875rem' }}
                        secondaryTypographyProps={{ fontSize: '0.8rem' }}
                      />
                    </ListItem>
                  )}
                  {device.protocol && (
                    <ListItem disableGutters>
                      <ListItemText
                        primary="Protocol"
                        secondary={device.protocol}
                        primaryTypographyProps={{ fontSize: '0.875rem' }}
                        secondaryTypographyProps={{ fontSize: '0.8rem' }}
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>

              <Divider />

              <CardActions>
                <IconButton
                  size="small"
                  onClick={() => handleEditClick(device)}
                  sx={{ color: '#81c784' }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteDevice(device.id)}
                  sx={{ color: '#f44336' }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Edit Device Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#252526',
            color: '#e0e0e0',
          },
        }}
      >
        <DialogTitle>Configure Device</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Device Name"
            value={editFormData.name || ''}
            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
            sx={{ mb: 2 }}
            variant="outlined"
            InputProps={{
              sx: {
                color: '#e0e0e0',
                '& fieldset': { borderColor: '#3c3c3d' },
                '&:hover fieldset': { borderColor: '#81c784' },
              },
            }}
            InputLabelProps={{
              sx: { color: '#9e9e9e' },
            }}
          />

          <Select
            fullWidth
            label="Device Type"
            value={editFormData.device_type || ''}
            onChange={(e) => setEditFormData({ ...editFormData, device_type: e.target.value })}
            sx={{ mb: 2 }}
          >
            <MenuItem value="camera">Camera (PTZ)</MenuItem>
            <MenuItem value="mixer">Audio Mixer</MenuItem>
            <MenuItem value="dmx">DMX Controller</MenuItem>
            <MenuItem value="router">Video Router</MenuItem>
          </Select>

          <FormControlLabel
            control={
              <Switch
                checked={editFormData.enabled !== false}
                onChange={(e) => setEditFormData({ ...editFormData, enabled: e.target.checked })}
              />
            }
            label="Enabled"
            sx={{ mb: 2 }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={editFormData.auto_connect !== false}
                onChange={(e) => setEditFormData({ ...editFormData, auto_connect: e.target.checked })}
              />
            }
            label="Auto Connect"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSaveDevice}
            variant="contained"
            sx={{
              backgroundColor: '#81c784',
              color: '#000',
              '&:hover': { backgroundColor: '#66bb6a' },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  Switch,
  FormControlLabel,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress
} from '@mui/material';
import {
  Extension,
  CheckCircle,
  Error as ErrorIcon,
  Settings as SettingsIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  VolumeUp,
  CheckCircleOutline,
  RadioButtonUnchecked
} from '@mui/icons-material';
import api from '../services/api';

export default function IntegrationsPage() {
  const queryClient = useQueryClient();
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openTestDialog, setOpenTestDialog] = useState(false);
  const [formData, setFormData] = useState({});
  const [testResult, setTestResult] = useState(null);

  const { data: integrations, isLoading } = useQuery('integrations-status', () =>
    api.get('/integrations/status')
  );

  const testMutation = useMutation(
    (data) => api.post('/integrations/command', data),
    { 
      onSuccess: (result) => {
        setTestResult(result.data);
        queryClient.invalidateQueries('integrations-status');
      }
    }
  );

  const connectMutation = useMutation(
    (data) => api.post(`/integrations/${data.type}/connect`, data.credentials),
    { 
      onSuccess: () => {
        queryClient.invalidateQueries('integrations-status');
        setOpenDialog(false);
        setFormData({});
      }
    }
  );

  const disconnectMutation = useMutation(
    (type) => api.post(`/integrations/${type}/disconnect`),
    { 
      onSuccess: () => queryClient.invalidateQueries('integrations-status') 
    }
  );

  const integrationsList = [
    { 
      id: 'native', 
      name: 'Native Streaming', 
      icon: '🎥', 
      description: 'Built-in WebRTC/RTMP streaming platform',
      fields: [],
      priority: 1,
      category: 'Core Platform'
    },
    { 
      id: 'camera', 
      name: 'PTZ Camera Control', 
      icon: '📹', 
      description: 'Direct camera control (VISCA/ONVIF)',
      fields: ['host', 'port', 'protocol'],
      priority: 1,
      category: 'Core Platform'
    },
    { 
      id: 'obs', 
      name: 'OBS Studio', 
      icon: '🎬', 
      description: 'Professional production switcher (optional)',
      fields: ['host', 'port', 'password'],
      priority: 2,
      category: 'Professional Tools'
    },
    { 
      id: 'vmix', 
      name: 'vMix', 
      icon: '📺', 
      description: 'Professional video mixing software (optional)',
      fields: ['host', 'port'],
      priority: 2,
      category: 'Professional Tools'
    },
    { 
      id: 'stream_deck', 
      name: 'Stream Deck', 
      icon: '⌨️', 
      description: 'Hardware control surface',
      fields: ['deviceId', 'buttonLayout'],
      priority: 3,
      category: 'Control Surfaces'
    },
    { 
      id: 'midi', 
      name: 'MIDI Control', 
      icon: '🎹', 
      description: 'MIDI device sync & control',
      fields: ['inputDevice', 'outputDevice'],
      priority: 3,
      category: 'Control Surfaces'
    },
    { 
      id: 'ndi', 
      name: 'NDI', 
      icon: '🔌', 
      description: 'Network Device Interface',
      fields: [],
      priority: 3,
      category: 'Professional Tools'
    },
    { 
      id: 'ccli', 
      name: 'CCLI', 
      icon: '📄', 
      description: 'Copyright licensing tracking',
      fields: ['accountNumber', 'password'],
      priority: 3,
      category: 'Licensing'
    }
  ];

  const getIntegrationStatus = (integrationId) => {
    return integrations?.data?.find(i => i.integration_type === integrationId);
  };

  const handleOpenDialog = (integration) => {
    setSelectedIntegration(integration);
    setFormData({});
    setOpenDialog(true);
  };

  const handleConnect = () => {
    if (selectedIntegration) {
      connectMutation.mutate({
        type: selectedIntegration.id,
        credentials: formData
      });
    }
  };

  const handleTestConnection = () => {
    if (selectedIntegration) {
      testMutation.mutate({
        type: selectedIntegration.id,
        credentials: formData || getIntegrationStatus(selectedIntegration.id)?.credentials
      });
    }
  };

  const RenderFormFields = () => {
    if (!selectedIntegration) return null;

    switch (selectedIntegration.id) {
      case 'native':
        return (
          <Alert severity="info">
            Native streaming is built-in and requires no configuration. 
            Camera and microphone access will be requested when you start streaming.
          </Alert>
        );

      case 'camera':
        return (
          <>
            <TextField
              fullWidth
              label="Camera IP Address"
              placeholder="192.168.1.100"
              value={formData.host || ''}
              onChange={(e) => setFormData({ ...formData, host: e.target.value })}
              sx={{ mb: 2 }}
              helperText="IP address of PTZ camera"
            />
            <TextField
              fullWidth
              label="Port"
              type="number"
              placeholder="1259"
              value={formData.port || ''}
              onChange={(e) => setFormData({ ...formData, port: e.target.value })}
              sx={{ mb: 2 }}
              helperText="VISCA: 1259, ONVIF: 80, HTTP: 80"
            />
            <TextField
              fullWidth
              label="Protocol"
              select
              value={formData.protocol || 'visca'}
              onChange={(e) => setFormData({ ...formData, protocol: e.target.value })}
              sx={{ mb: 2 }}
              SelectProps={{ native: true }}
            >
              <option value="visca">VISCA</option>
              <option value="onvif">ONVIF</option>
              <option value="http">HTTP API</option>
            </TextField>
          </>
        );

      case 'obs':
        return (
          <>
            <TextField
              fullWidth
              label="OBS WebSocket Host"
              placeholder="localhost"
              value={formData.host || ''}
              onChange={(e) => setFormData({ ...formData, host: e.target.value })}
              sx={{ mb: 2 }}
              helperText="IP address or hostname of OBS computer"
            />
            <TextField
              fullWidth
              label="WebSocket Port"
              type="number"
              placeholder="4455"
              value={formData.port || ''}
              onChange={(e) => setFormData({ ...formData, port: e.target.value })}
              sx={{ mb: 2 }}
              helperText="OBS WebSocket port (default: 4455)"
            />
            <TextField
              fullWidth
              label="Password (optional)"
              type="password"
              value={formData.password || ''}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              sx={{ mb: 2 }}
              helperText="Leave blank if no password required"
            />
          </>
        );

      case 'vmix':
        return (
          <>
            <TextField
              fullWidth
              label="vMix Host"
              placeholder="192.168.1.50"
              value={formData.host || ''}
              onChange={(e) => setFormData({ ...formData, host: e.target.value })}
              sx={{ mb: 2 }}
              helperText="IP address or hostname of vMix computer"
            />
            <TextField
              fullWidth
              label="vMix API Port"
              type="number"
              placeholder="8088"
              value={formData.port || ''}
              onChange={(e) => setFormData({ ...formData, port: e.target.value })}
              sx={{ mb: 2 }}
              helperText="vMix HTTP API port (default: 8088)"
            />
          </>
        );

      case 'stream_deck':
        return (
          <>
            <TextField
              fullWidth
              label="Device ID"
              value={formData.deviceId || ''}
              onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
              sx={{ mb: 2 }}
              helperText="Stream Deck device identifier"
            />
            <TextField
              fullWidth
              label="Button Layout"
              placeholder="5x3"
              value={formData.buttonLayout || ''}
              onChange={(e) => setFormData({ ...formData, buttonLayout: e.target.value })}
              sx={{ mb: 2 }}
              helperText="e.g., 5x3 for 15-button deck"
            />
          </>
        );

      case 'midi':
        return (
          <>
            <TextField
              fullWidth
              label="Input Device"
              value={formData.inputDevice || ''}
              onChange={(e) => setFormData({ ...formData, inputDevice: e.target.value })}
              sx={{ mb: 2 }}
              helperText="MIDI input device name"
            />
            <TextField
              fullWidth
              label="Output Device"
              value={formData.outputDevice || ''}
              onChange={(e) => setFormData({ ...formData, outputDevice: e.target.value })}
              sx={{ mb: 2 }}
              helperText="MIDI output device name"
            />
          </>
        );

      case 'ccli':
        return (
          <>
            <TextField
              fullWidth
              label="CCLI Account Number"
              value={formData.accountNumber || ''}
              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              sx={{ mb: 2 }}
              helperText="Your CCLI account number"
            />
            <TextField
              fullWidth
              label="CCLI Password"
              type="password"
              value={formData.password || ''}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              sx={{ mb: 2 }}
              helperText="Your CCLI password (encrypted)"
            />
          </>
        );

      default:
        return (
          <Alert severity="warning">
            Configuration options for this integration will be available soon.
          </Alert>
        );
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Integrations
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>Your Streaming Platform</strong> comes with built-in WebRTC/RTMP streaming. 
        Connect professional tools like OBS/vMix for advanced production, or control cameras directly.
        Enable only what your church needs.
      </Alert>

      {/* Group integrations by category */}
      {['Core Platform', 'Professional Tools', 'Control Surfaces', 'Licensing'].map((category) => {
        const categoryIntegrations = integrationsList.filter(i => i.category === category);
        if (categoryIntegrations.length === 0) return null;

        return (
          <Box key={category} sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, color: category === 'Core Platform' ? 'primary.main' : 'text.secondary' }}>
              {category}
              {category === 'Core Platform' && (
                <Chip label="Built-in" size="small" color="primary" sx={{ ml: 2 }} />
              )}
              {category === 'Professional Tools' && (
                <Chip label="Optional" size="small" sx={{ ml: 2 }} />
              )}
            </Typography>
            
            <Grid container spacing={3}>
              {categoryIntegrations.map((integration) => {
                const status = getIntegrationStatus(integration.id);
                const isConnected = status?.enabled;

                return (
                  <Grid item xs={12} sm={6} md={4} key={integration.id}>
                    <Card sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s',
                      border: isConnected ? '2px solid #4caf50' : '1px solid #ddd',
                      opacity: category === 'Professional Tools' && !isConnected ? 0.8 : 1,
                      '&:hover': { boxShadow: 3 }
                    }}>
                      <CardContent sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                          <Typography variant="h2">{integration.icon}</Typography>
                          {isConnected ? (
                            <Chip label="Connected" color="success" size="small" />
                          ) : (
                            <Chip label="Available" size="small" variant="outlined" />
                          )}
                        </Box>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                          {integration.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                          {integration.description}
                        </Typography>

                        {isConnected && (
                          <Paper sx={{ p: 1, mb: 2, backgroundColor: '#f5f5f5' }}>
                            <Typography variant="caption" color="textSecondary">
                              Last tested: {status?.last_tested_at 
                                ? new Date(status.last_tested_at).toLocaleString()
                                : 'Never'
                              }
                            </Typography>
                            {status?.last_error && (
                              <Typography variant="caption" color="error" display="block">
                                Last error: {status.last_error}
                              </Typography>
                            )}
                          </Paper>
                        )}

                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            variant={isConnected ? 'outlined' : 'contained'}
                            onClick={() => handleOpenDialog(integration)}
                            startIcon={isConnected ? <EditIcon /> : <SettingsIcon />}
                            fullWidth
                          >
                            {isConnected ? 'Reconfigure' : 'Setup'}
                          </Button>
                          {isConnected && (
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => disconnectMutation.mutate(integration.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        );
      })}

      {/* Configuration Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Configure {selectedIntegration?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <RenderFormFields />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleTestConnection}
            variant="outlined"
            startIcon={<VolumeUp />}
          >
            Test Connection
          </Button>
          <Button
            onClick={handleConnect}
            variant="contained"
            disabled={connectMutation.isLoading}
          >
            {getIntegrationStatus(selectedIntegration?.id)?.enabled ? 'Update' : 'Connect'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Test Result Dialog */}
      <Dialog open={!!testResult} onClose={() => setTestResult(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Test Result</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {testResult?.connected ? (
              <Box sx={{ textAlign: 'center' }}>
                <CheckCircleOutline sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                <Typography variant="h6" color="success.main">Connection Successful</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  {selectedIntegration?.name} is working properly
                </Typography>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center' }}>
                <ErrorIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
                <Typography variant="h6" color="error">Connection Failed</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  {testResult?.error || 'Unknown error occurred'}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTestResult(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
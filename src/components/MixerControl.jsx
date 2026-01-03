import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Slider,
  IconButton,
  Grid,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  CircularProgress,
  TextField,
} from '@mui/material';
import {
  VolumeUp as VolumeUpIcon,
  VolumeMute as VolumeMuteIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { getInvokeFunction } from '../utils/mockDevices';

export default function MixerControl() {
  const [mixers, setMixers] = useState([]);
  const [selectedMixer, setSelectedMixer] = useState(null);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [connectionData, setConnectionData] = useState({ ip: '', port: 9000 });
  const [invoke] = useState(() => getInvokeFunction());

  useEffect(() => {
    loadMixers();
  }, []);

  const loadMixers = async () => {
    try {
      setLoading(true);
      // Load saved mixers from config
      const savedMixers = await invoke('list_saved_devices');
      const audioMixers = savedMixers.filter(d => d.device.device_type === 'mixer');
      setMixers(audioMixers);
      if (audioMixers.length > 0) {
        selectMixer(audioMixers[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectMixer = async (mixer) => {
    setSelectedMixer(mixer);
    try {
      const mixerChannels = await invoke('get_mixer_channels', {
        device_id: mixer.device.id,
      });
      setChannels(mixerChannels);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleConnect = async () => {
    try {
      setLoading(true);
      const success = await invoke('connect_mixer', {
        ip: connectionData.ip,
        port: connectionData.port,
      });

      if (success) {
        setConnectDialogOpen(false);
        await loadMixers();
        setError(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLevelChange = async (channelId, newLevel) => {
    if (!selectedMixer) return;

    try {
      await invoke('set_mixer_level', {
        device_id: selectedMixer.device.id,
        channel: channelId,
        level: newLevel / 100, // Convert to 0-1 range
      });

      // Update local state
      setChannels(
        channels.map((ch) =>
          ch.id === channelId ? { ...ch, level: newLevel / 100 } : ch
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMute = async (channelId, isMuted) => {
    if (!selectedMixer) return;

    try {
      await invoke('mute_channel', {
        device_id: selectedMixer.device.id,
        channel: channelId,
        mute: !isMuted,
      });

      setChannels(
        channels.map((ch) =>
          ch.id === channelId ? { ...ch, muted: !isMuted } : ch
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading && mixers.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: '#1a1a1a', minHeight: '100vh', color: '#e0e0e0' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Audio Mixer Control</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {mixers.length > 0 && (
            <Select
              value={selectedMixer?.device.id || ''}
              onChange={(e) => {
                const mixer = mixers.find(m => m.device.id === e.target.value);
                if (mixer) selectMixer(mixer);
              }}
              sx={{
                backgroundColor: '#3c3c3d',
                color: '#e0e0e0',
                minWidth: 200,
              }}
            >
              {mixers.map((mixer) => (
                <MenuItem key={mixer.device.id} value={mixer.device.id}>
                  {mixer.custom_name || mixer.device.name}
                </MenuItem>
              ))}
            </Select>
          )}
          <IconButton
            onClick={() => setConnectDialogOpen(true)}
            sx={{ color: '#81c784' }}
          >
            <SettingsIcon />
          </IconButton>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {mixers.length === 0 ? (
        <Alert severity="info">
          No mixers connected. Click the settings icon to connect a mixer.
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {channels.map((channel) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={channel.id}>
              <Card
                sx={{
                  backgroundColor: '#252526',
                  color: '#e0e0e0',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle2">{channel.name}</Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleMute(channel.id, channel.muted)}
                      sx={{
                        color: channel.muted ? '#f44336' : '#81c784',
                      }}
                    >
                      {channel.muted ? <VolumeMuteIcon /> : <VolumeUpIcon />}
                    </IconButton>
                  </Box>

                  <Slider
                    value={Math.round(channel.level * 100)}
                    onChange={(e, value) => handleLevelChange(channel.id, value)}
                    min={0}
                    max={100}
                    step={1}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}%`}
                    sx={{
                      flex: 1,
                      '& .MuiSlider-track': {
                        backgroundColor: '#81c784',
                      },
                      '& .MuiSlider-thumb': {
                        backgroundColor: '#81c784',
                      },
                      '& .MuiSlider-rail': {
                        backgroundColor: '#3c3c3d',
                      },
                    }}
                  />

                  <Typography
                    variant="caption"
                    sx={{
                      textAlign: 'center',
                      mt: 1,
                      color: '#9e9e9e',
                    }}
                  >
                    {Math.round(channel.level * 100)}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Connect Mixer Dialog */}
      <Dialog
        open={connectDialogOpen}
        onClose={() => setConnectDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#252526',
            color: '#e0e0e0',
          },
        }}
      >
        <DialogTitle>Connect Mixer</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Mixer IP Address"
              value={connectionData.ip}
              onChange={(e) => setConnectionData({ ...connectionData, ip: e.target.value })}
              placeholder="192.168.1.100"
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
            <TextField
              fullWidth
              label="Port"
              type="number"
              value={connectionData.port}
              onChange={(e) => setConnectionData({ ...connectionData, port: parseInt(e.target.value) })}
              placeholder="9000"
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConnectDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConnect}
            variant="contained"
            disabled={!connectionData.ip}
            sx={{
              backgroundColor: '#81c784',
              color: '#000',
              '&:hover': { backgroundColor: '#66bb6a' },
            }}
          >
            Connect
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  FormControlLabel,
  Stack,
  Tab,
  Tabs,
  Alert,
  LinearProgress
} from '@mui/material';
import { Plus, Trash2, Save, Upload, Music, Zap, Volume2, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

export default function AudioMixerPage() {
  const [mixers, setMixers] = useState([]);
  const [channels, setChannels] = useState([]);
  const [scenes, setScenes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMixer, setSelectedMixer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    ip_address: '',
    port: 9000,
    protocol: 'osc'
  });
  const [channelLevels, setChannelLevels] = useState({});
  const [channelMutes, setChannelMutes] = useState({});
  const [tabValue, setTabValue] = useState(0);

  const fetchMixers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/devices/mixer');
      setMixers(res.data);
    } catch (err) {
      console.error('Failed to fetch mixers:', err);
    }
    setLoading(false);
  };

  const fetchChannels = async (mixer_id) => {
    try {
      const res = await api.get(`/devices/mixer/${mixer_id}/channels`);
      setChannels(res.data);
      const levels = {};
      const mutes = {};
      res.data.forEach(c => {
        levels[c.id] = -6;
        mutes[c.id] = false;
      });
      setChannelLevels(levels);
      setChannelMutes(mutes);
    } catch (err) {
      console.error('Failed to fetch channels:', err);
    }
  };

  const fetchScenes = async (mixer_id) => {
    try {
      const res = await api.get(`/devices/mixer/${mixer_id}/scenes`);
      setScenes(res.data);
    } catch (err) {
      console.error('Failed to fetch scenes:', err);
    }
  };

  useEffect(() => {
    fetchMixers();
  }, []);

  useEffect(() => {
    if (selectedMixer) {
      fetchChannels(selectedMixer.id);
      fetchScenes(selectedMixer.id);
    }
  }, [selectedMixer]);

  const handleAddMixer = async () => {
    try {
      await api.post('/devices/mixer', formData);
      setFormData({ name: '', model: '', ip_address: '', port: 9000, protocol: 'osc' });
      setOpenDialog(false);
      fetchMixers();
    } catch (err) {
      console.error('Failed to add mixer:', err);
    }
  };

  const handleChannelChange = async (channel_id, level, mute) => {
    try {
      await api.post(`/devices/mixer/channel/${channel_id}/level`, {
        level_db: level,
        mute: mute
      });
    } catch (err) {
      console.error('Failed to update channel:', err);
    }
  };

  const handleSaveScene = async () => {
    if (!selectedMixer) return;
    const sceneName = prompt('Enter scene name:');
    if (!sceneName) return;

    try {
      const sceneRes = await api.post(`/devices/mixer/${selectedMixer.id}/scenes`, {
        scene_name: sceneName,
        fade_time_ms: 1000
      });

      const channelSettings = channels.map(c => ({
        channel_id: c.id,
        fader_level: channelLevels[c.id] || 0,
        mute: channelMutes[c.id] || false
      }));

      await api.post(`/devices/mixer/scene/${sceneRes.data.id}/settings`, {
        channel_settings: channelSettings
      });

      fetchScenes(selectedMixer.id);
      alert('Scene saved!');
    } catch (err) {
      console.error('Failed to save scene:', err);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Audio Mixer Control Center</Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={() => setOpenDialog(true)}
        >
          Add Mixer Device
        </Button>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="Hardware Mixers" icon={<Music size={18} />} iconPosition="start" />
          <Tab label="Audio Processing" icon={<Headphones size={18} />} iconPosition="start" />
          <Tab label="Mix History" icon={<Volume2 size={18} />} iconPosition="start" />
        </Tabs>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {mixers.map((mixer) => (
            <Grid item xs={12} md={6} key={mixer.id}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedMixer(mixer)}
                sx={{ cursor: 'pointer' }}
              >
                <CardContent>
                  <Typography variant="h6">{mixer.name}</Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    {mixer.model} • {mixer.ip_address}:{mixer.port}
                  </Typography>
                  <Chip
                    label={mixer.is_online ? 'Online' : 'Offline'}
                    color={mixer.is_online ? 'success' : 'error'}
                    size="small"
                  />
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Mixer Channels */}
      {selectedMixer && channels.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            {selectedMixer.name} - Channels
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
            {channels.map((channel) => (
              <Paper key={channel.id} sx={{ p: 2, minWidth: 120, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ mb: 1, fontWeight: 600, textAlign: 'center' }}>
                  {channel.channel_name || `Ch ${channel.channel_number}`}
                </Typography>

                <Slider
                  orientation="vertical"
                  value={channelLevels[channel.id] || 0}
                  onChange={(e, value) => {
                    setChannelLevels({ ...channelLevels, [channel.id]: value });
                    handleChannelChange(channel.id, value, channelMutes[channel.id]);
                  }}
                  min={-40}
                  max={12}
                  sx={{ height: 150, mb: 1 }}
                />

                <Typography variant="caption" sx={{ mb: 1 }}>
                  {channelLevels[channel.id]}dB
                </Typography>

                <Switch
                  size="small"
                  checked={channelMutes[channel.id] || false}
                  onChange={(e) => {
                    setChannelMutes({ ...channelMutes, [channel.id]: e.target.checked });
                    handleChannelChange(channel.id, channelLevels[channel.id], e.target.checked);
                  }}
                />
              </Paper>
            ))}
          </Box>

          <Button
            variant="contained"
            onClick={handleSaveScene}
            startIcon={<Save size={16} />}
          >
            Save Scene
          </Button>
        </Paper>
      )}

      {/* Add Mixer Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Audio Mixer</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Model"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="IP Address"
            value={formData.ip_address}
            onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Port"
            type="number"
            value={formData.port}
            onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>Protocol</InputLabel>
            <Select
              value={formData.protocol}
              onChange={(e) => setFormData({ ...formData, protocol: e.target.value })}
              label="Protocol"
            >
              <MenuItem value="osc">OSC</MenuItem>
              <MenuItem value="midi">MIDI</MenuItem>
              <MenuItem value="http">HTTP</MenuItem>
              <MenuItem value="websocket">WebSocket</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddMixer} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
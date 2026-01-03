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
  IconButton,
  Tooltip
} from '@mui/material';
import { Plus, Trash2, Save, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const MotionCard = motion(Card);

export default function CameraControlPage() {
  const [cameras, setCameras] = useState([]);
  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    ip_address: '',
    port: 5678,
    protocol: 'visca'
  });
  const [cameraControl, setCameraControl] = useState({
    pan: 0,
    tilt: 0,
    zoom: 0,
    focus: 0
  });
  const [presetName, setPresetName] = useState('');
  const [openPresetDialog, setOpenPresetDialog] = useState(false);

  const fetchCameras = async () => {
    setLoading(true);
    try {
      const res = await api.get('/devices/camera');
      setCameras(res.data);
    } catch (err) {
      console.error('Failed to fetch cameras:', err);
    }
    setLoading(false);
  };

  const fetchPresets = async (camera_id) => {
    try {
      const res = await api.get(`/devices/camera/${camera_id}/presets`);
      setPresets(res.data);
    } catch (err) {
      console.error('Failed to fetch presets:', err);
    }
  };

  useEffect(() => {
    fetchCameras();
  }, []);

  useEffect(() => {
    if (selectedCamera) {
      fetchPresets(selectedCamera.id);
    }
  }, [selectedCamera]);

  const handleAddCamera = async () => {
    try {
      await api.post('/devices/camera', formData);
      setFormData({ name: '', model: '', ip_address: '', port: 5678, protocol: 'visca' });
      setOpenDialog(false);
      fetchCameras();
    } catch (err) {
      console.error('Failed to add camera:', err);
    }
  };

  const handleMoveCamera = async () => {
    if (!selectedCamera) return;
    try {
      await api.post(`/devices/camera/${selectedCamera.id}/move/absolute`, {
        pan_position: cameraControl.pan,
        tilt_position: cameraControl.tilt,
        zoom_position: cameraControl.zoom
      });
    } catch (err) {
      console.error('Failed to move camera:', err);
    }
  };

  const handleSavePreset = async () => {
    if (!selectedCamera || !presetName.trim()) return;
    try {
      await api.post(`/devices/camera/${selectedCamera.id}/presets`, {
        preset_name: presetName,
        pan_position: cameraControl.pan,
        tilt_position: cameraControl.tilt,
        zoom_position: cameraControl.zoom,
        focus_position: cameraControl.focus
      });
      setPresetName('');
      setOpenPresetDialog(false);
      fetchPresets(selectedCamera.id);
    } catch (err) {
      console.error('Failed to save preset:', err);
    }
  };

  const handleRecallPreset = async (preset) => {
    setCameraControl({
      pan: preset.pan_position || 0,
      tilt: preset.tilt_position || 0,
      zoom: preset.zoom_position || 0,
      focus: preset.focus_position || 0
    });
  };

  const handleDeleteCamera = async (camera_id) => {
    if (window.confirm('Delete this camera?')) {
      try {
        await api.delete(`/devices/camera/${camera_id}`);
        fetchCameras();
      } catch (err) {
        console.error('Failed to delete camera:', err);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Camera Control</Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={() => setOpenDialog(true)}
        >
          Add Camera
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {cameras.map((camera) => (
            <Grid item xs={12} md={6} key={camera.id}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedCamera(camera)}
                sx={{ cursor: 'pointer', height: '100%' }}
              >
                <CardContent>
                  <Typography variant="h6">{camera.name}</Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    {camera.model} • {camera.ip_address}:{camera.port}
                  </Typography>
                  <Chip
                    label={camera.is_online ? 'Online' : 'Offline'}
                    color={camera.is_online ? 'success' : 'error'}
                    size="small"
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => setSelectedCamera(camera)}
                    >
                      Control
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteCamera(camera.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </Box>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Camera Control Panel */}
      {selectedCamera && (
        <Paper sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Control: {selectedCamera.name}
          </Typography>

          <Grid container spacing={3}>
            {/* Pan Control */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Pan: {cameraControl.pan}°
              </Typography>
              <Slider
                value={cameraControl.pan}
                onChange={(e, value) => setCameraControl({ ...cameraControl, pan: value })}
                min={-170}
                max={170}
                step={1}
                marks
              />
            </Grid>

            {/* Tilt Control */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Tilt: {cameraControl.tilt}°
              </Typography>
              <Slider
                value={cameraControl.tilt}
                onChange={(e, value) => setCameraControl({ ...cameraControl, tilt: value })}
                min={-90}
                max={90}
                step={1}
                marks
              />
            </Grid>

            {/* Zoom Control */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Zoom: {cameraControl.zoom}x
              </Typography>
              <Slider
                value={cameraControl.zoom}
                onChange={(e, value) => setCameraControl({ ...cameraControl, zoom: value })}
                min={0}
                max={100}
                step={1}
              />
            </Grid>

            {/* Focus Control */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Focus: {cameraControl.focus}
              </Typography>
              <Slider
                value={cameraControl.focus}
                onChange={(e, value) => setCameraControl({ ...cameraControl, focus: value })}
                min={0}
                max={100}
                step={1}
              />
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleMoveCamera}
                  startIcon={<Play size={20} />}
                >
                  Apply Position
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setOpenPresetDialog(true)}
                  startIcon={<Save size={20} />}
                >
                  Save as Preset
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* Presets */}
          {presets.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Saved Presets
              </Typography>
              <Grid container spacing={2}>
                {presets.map((preset) => (
                  <Grid item xs={12} sm={6} key={preset.id}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {preset.preset_name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Pan: {preset.pan_position}° | Tilt: {preset.tilt_position}° | Zoom: {preset.zoom_position}x
                      </Typography>
                      <Button
                        size="small"
                        fullWidth
                        variant="outlined"
                        onClick={() => handleRecallPreset(preset)}
                        sx={{ mt: 1 }}
                      >
                        Recall
                      </Button>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Paper>
      )}

      {/* Add Camera Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Camera</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            label="Camera Name"
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
              <MenuItem value="visca">VISCA</MenuItem>
              <MenuItem value="pelco">Pelco</MenuItem>
              <MenuItem value="onvif">ONVIF</MenuItem>
              <MenuItem value="sony">Sony</MenuItem>
              <MenuItem value="panasonic">Panasonic</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddCamera} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Save Preset Dialog */}
      <Dialog open={openPresetDialog} onClose={() => setOpenPresetDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Save Camera Preset</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            label="Preset Name"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            fullWidth
            placeholder="e.g., Wide Shot, Close Up"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPresetDialog(false)}>Cancel</Button>
          <Button onClick={handleSavePreset} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
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
  TableRow
} from '@mui/material';
import { Plus, Trash2, Save, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const MotionCard = motion(Card);

export default function LightingControlPage() {
  const [controllers, setControllers] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [scenes, setScenes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedController, setSelectedController] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    ip_address: '',
    connection_type: 'usb',
    universes_count: 1
  });
  const [fixtureData, setFixtureData] = useState({
    fixture_name: '',
    fixture_type: 'moving_head',
    universe: 1,
    start_channel: 1,
    channel_count: 16
  });
  const [openFixtureDialog, setOpenFixtureDialog] = useState(false);
  const [fixtureIntensities, setFixtureIntensities] = useState({});

  const fetchControllers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/devices/dmx');
      setControllers(res.data);
    } catch (err) {
      console.error('Failed to fetch DMX controllers:', err);
    }
    setLoading(false);
  };

  const fetchFixtures = async (controller_id) => {
    try {
      const res = await api.get(`/devices/dmx/${controller_id}/fixtures`);
      setFixtures(res.data);
      const intensities = {};
      res.data.forEach(f => {
        intensities[f.id] = 0;
      });
      setFixtureIntensities(intensities);
    } catch (err) {
      console.error('Failed to fetch fixtures:', err);
    }
  };

  const fetchScenes = async (controller_id) => {
    try {
      const res = await api.get(`/devices/dmx/${controller_id}/scenes`);
      setScenes(res.data);
    } catch (err) {
      console.error('Failed to fetch scenes:', err);
    }
  };

  useEffect(() => {
    fetchControllers();
  }, []);

  useEffect(() => {
    if (selectedController) {
      fetchFixtures(selectedController.id);
      fetchScenes(selectedController.id);
    }
  }, [selectedController]);

  const handleAddController = async () => {
    try {
      await api.post('/devices/dmx', formData);
      setFormData({ name: '', model: '', ip_address: '', connection_type: 'usb', universes_count: 1 });
      setOpenDialog(false);
      fetchControllers();
    } catch (err) {
      console.error('Failed to add controller:', err);
    }
  };

  const handleAddFixture = async () => {
    if (!selectedController) return;
    try {
      await api.post(`/devices/dmx/${selectedController.id}/fixtures`, fixtureData);
      setFixtureData({
        fixture_name: '',
        fixture_type: 'moving_head',
        universe: 1,
        start_channel: 1,
        channel_count: 16
      });
      setOpenFixtureDialog(false);
      fetchFixtures(selectedController.id);
    } catch (err) {
      console.error('Failed to add fixture:', err);
    }
  };

  const handleDeleteController = async (controller_id) => {
    if (window.confirm('Delete this controller?')) {
      try {
        await api.delete(`/devices/dmx/${controller_id}`);
        fetchControllers();
      } catch (err) {
        console.error('Failed to delete controller:', err);
      }
    }
  };

  const handleSaveScene = async () => {
    if (!selectedController) return;
    const sceneName = prompt('Enter scene name:');
    if (!sceneName) return;

    try {
      const sceneRes = await api.post(`/devices/dmx/${selectedController.id}/scenes`, {
        scene_name: sceneName,
        fade_time_ms: 1000
      });

      for (const fixture of fixtures) {
        const channelData = Array(fixture.channel_count).fill(fixtureIntensities[fixture.id] || 0);
        await api.post(`/devices/dmx/scene/${sceneRes.data.id}/data`, {
          fixture_id: fixture.id,
          channel_data: channelData
        });
      }

      fetchScenes(selectedController.id);
      alert('Scene saved!');
    } catch (err) {
      console.error('Failed to save scene:', err);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Lighting Control (DMX)</Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={() => setOpenDialog(true)}
        >
          Add DMX Controller
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {controllers.map((controller) => (
            <Grid item xs={12} md={6} key={controller.id}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedController(controller)}
                sx={{ cursor: 'pointer' }}
              >
                <CardContent>
                  <Typography variant="h6">{controller.name}</Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    {controller.model} • Universes: {controller.universes_count}
                  </Typography>
                  <Chip
                    label={controller.is_online ? 'Online' : 'Offline'}
                    color={controller.is_online ? 'success' : 'error'}
                    size="small"
                  />
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Controller Panel */}
      {selectedController && (
        <>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">{selectedController.name} - Fixtures</Typography>
              <Button
                variant="contained"
                size="small"
                onClick={() => setOpenFixtureDialog(true)}
                startIcon={<Plus size={16} />}
              >
                Add Fixture
              </Button>
            </Box>

            {fixtures.length === 0 ? (
              <Typography color="textSecondary">No fixtures added</Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell>Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Universe</TableCell>
                      <TableCell>Intensity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fixtures.map((fixture) => (
                      <TableRow key={fixture.id}>
                        <TableCell>{fixture.fixture_name}</TableCell>
                        <TableCell>{fixture.fixture_type}</TableCell>
                        <TableCell>{fixture.universe}</TableCell>
                        <TableCell>
                          <Slider
                            value={fixtureIntensities[fixture.id] || 0}
                            onChange={(e, value) =>
                              setFixtureIntensities({ ...fixtureIntensities, [fixture.id]: value })
                            }
                            min={0}
                            max={255}
                            sx={{ width: 150 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            <Button
              variant="contained"
              onClick={handleSaveScene}
              sx={{ mt: 2 }}
              startIcon={<Save size={16} />}
            >
              Save as Scene
            </Button>
          </Paper>

          {/* Scenes */}
          {scenes.length > 0 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Saved Scenes
              </Typography>
              <Grid container spacing={2}>
                {scenes.map((scene) => (
                  <Grid item xs={12} sm={6} md={4} key={scene.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle2">{scene.scene_name}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {scene.firstName} {scene.lastName}
                        </Typography>
                        <Button
                          size="small"
                          fullWidth
                          variant="outlined"
                          sx={{ mt: 1 }}
                          startIcon={<Play size={14} />}
                        >
                          Activate
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}
        </>
      )}

      {/* Add Controller Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add DMX Controller</DialogTitle>
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
            label="IP Address (optional)"
            value={formData.ip_address}
            onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Connection Type</InputLabel>
            <Select
              value={formData.connection_type}
              onChange={(e) => setFormData({ ...formData, connection_type: e.target.value })}
              label="Connection Type"
            >
              <MenuItem value="usb">USB</MenuItem>
              <MenuItem value="ethernet">Ethernet</MenuItem>
              <MenuItem value="wifi">WiFi</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Universes"
            type="number"
            value={formData.universes_count}
            onChange={(e) => setFormData({ ...formData, universes_count: parseInt(e.target.value) })}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddController} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Fixture Dialog */}
      <Dialog open={openFixtureDialog} onClose={() => setOpenFixtureDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add DMX Fixture</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            label="Fixture Name"
            value={fixtureData.fixture_name}
            onChange={(e) => setFixtureData({ ...fixtureData, fixture_name: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Fixture Type</InputLabel>
            <Select
              value={fixtureData.fixture_type}
              onChange={(e) => setFixtureData({ ...fixtureData, fixture_type: e.target.value })}
              label="Fixture Type"
            >
              <MenuItem value="moving_head">Moving Head</MenuItem>
              <MenuItem value="par">PAR</MenuItem>
              <MenuItem value="wash">Wash</MenuItem>
              <MenuItem value="spot">Spot</MenuItem>
              <MenuItem value="strobe">Strobe</MenuItem>
              <MenuItem value="rgb">RGB</MenuItem>
              <MenuItem value="laser">Laser</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Universe"
            type="number"
            value={fixtureData.universe}
            onChange={(e) => setFixtureData({ ...fixtureData, universe: parseInt(e.target.value) })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Start Channel"
            type="number"
            value={fixtureData.start_channel}
            onChange={(e) => setFixtureData({ ...fixtureData, start_channel: parseInt(e.target.value) })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Channel Count"
            type="number"
            value={fixtureData.channel_count}
            onChange={(e) => setFixtureData({ ...fixtureData, channel_count: parseInt(e.target.value) })}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFixtureDialog(false)}>Cancel</Button>
          <Button onClick={handleAddFixture} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
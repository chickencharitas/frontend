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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { Plus, Trash2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const MotionCard = motion(Card);

export default function VideoRouterPage() {
  const [routers, setRouters] = useState([]);
  const [inputs, setInputs] = useState([]);
  const [outputs, setOutputs] = useState([]);
  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRouter, setSelectedRouter] = useState(null);
  const [selectedInput, setSelectedInput] = useState(null);
  const [selectedOutput, setSelectedOutput] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    ip_address: '',
    port: 5000,
    protocol: 'visca',
    input_count: 4,
    output_count: 4
  });

  const fetchRouters = async () => {
    setLoading(true);
    try {
      const res = await api.get('/devices/router');
      setRouters(res.data);
    } catch (err) {
      console.error('Failed to fetch routers:', err);
    }
    setLoading(false);
  };

  const fetchInputs = async (router_id) => {
    try {
      const res = await api.get(`/devices/router/${router_id}/inputs`);
      setInputs(res.data);
    } catch (err) {
      console.error('Failed to fetch inputs:', err);
    }
  };

  const fetchOutputs = async (router_id) => {
    try {
      const res = await api.get(`/devices/router/${router_id}/outputs`);
      setOutputs(res.data);
    } catch (err) {
      console.error('Failed to fetch outputs:', err);
    }
  };

  const fetchPresets = async (router_id) => {
    try {
      const res = await api.get(`/devices/router/${router_id}/presets`);
      setPresets(res.data);
    } catch (err) {
      console.error('Failed to fetch presets:', err);
    }
  };

  useEffect(() => {
    fetchRouters();
  }, []);

  useEffect(() => {
    if (selectedRouter) {
      fetchInputs(selectedRouter.id);
      fetchOutputs(selectedRouter.id);
      fetchPresets(selectedRouter.id);
    }
  }, [selectedRouter]);

  const handleAddRouter = async () => {
    try {
      await api.post('/devices/router', formData);
      setFormData({
        name: '',
        model: '',
        ip_address: '',
        port: 5000,
        protocol: 'visca',
        input_count: 4,
        output_count: 4
      });
      setOpenDialog(false);
      fetchRouters();
    } catch (err) {
      console.error('Failed to add router:', err);
    }
  };

  const handleRouteVideo = async () => {
    if (!selectedRouter || !selectedInput || !selectedOutput) return;
    try {
      await api.post(`/devices/router/${selectedRouter.id}/route`, {
        input_id: selectedInput.id,
        output_id: selectedOutput.id
      });
      fetchOutputs(selectedRouter.id);
      setSelectedInput(null);
      setSelectedOutput(null);
    } catch (err) {
      console.error('Failed to route video:', err);
    }
  };

  const handleSavePreset = async () => {
    if (!selectedRouter) return;
    const presetName = prompt('Enter preset name:');
    if (!presetName) return;

    try {
      const routes = outputs.map(output => ({
        output_number: output.output_number,
        input_number: output.current_input || 1
      }));

      await api.post(`/devices/router/${selectedRouter.id}/presets`, {
        preset_name: presetName,
        routes: routes
      });

      fetchPresets(selectedRouter.id);
      alert('Preset saved!');
    } catch (err) {
      console.error('Failed to save preset:', err);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Video Router</Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={() => setOpenDialog(true)}
        >
          Add Router
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {routers.map((router) => (
            <Grid item xs={12} md={6} key={router.id}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedRouter(router)}
                sx={{ cursor: 'pointer' }}
              >
                <CardContent>
                  <Typography variant="h6">{router.name}</Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    {router.model} • {router.input_count}x{router.output_count}
                  </Typography>
                  <Chip
                    label={router.is_online ? 'Online' : 'Offline'}
                    color={router.is_online ? 'success' : 'error'}
                    size="small"
                  />
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Router Control */}
      {selectedRouter && (
        <>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Routing Matrix
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Input</InputLabel>
                  <Select
                    value={selectedInput?.id || ''}
                    onChange={(e) => {
                      const input = inputs.find(i => i.id === e.target.value);
                      setSelectedInput(input);
                    }}
                    label="Input"
                  >
                    {inputs.map((input) => (
                      <MenuItem key={input.id} value={input.id}>
                        {input.input_name || `Input ${input.input_number}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowRight size={32} />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Output</InputLabel>
                  <Select
                    value={selectedOutput?.id || ''}
                    onChange={(e) => {
                      const output = outputs.find(o => o.id === e.target.value);
                      setSelectedOutput(output);
                    }}
                    label="Output"
                  >
                    {outputs.map((output) => (
                      <MenuItem key={output.id} value={output.id}>
                        {output.output_name || `Output ${output.output_number}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={3}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleRouteVideo}
                  disabled={!selectedInput || !selectedOutput}
                >
                  Route
                </Button>
              </Grid>
            </Grid>

            {/* Current Routing */}
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Current Routing
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell>Output</TableCell>
                    <TableCell>Current Input</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {outputs.map((output) => (
                    <TableRow key={output.id}>
                      <TableCell>{output.output_name || `Output ${output.output_number}`}</TableCell>
                      <TableCell>
                        {inputs.find(i => i.input_number === output.current_input)?.input_name ||
                          `Input ${output.current_input}`}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Button
              variant="outlined"
              onClick={handleSavePreset}
              sx={{ mt: 2 }}
            >
              Save as Preset
            </Button>
          </Paper>

          {/* Presets */}
          {presets.length > 0 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Router Presets
              </Typography>
              <Grid container spacing={2}>
                {presets.map((preset) => (
                  <Grid item xs={12} sm={6} md={4} key={preset.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle2">{preset.preset_name}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {preset.firstName} {preset.lastName}
                        </Typography>
                        <Button
                          size="small"
                          fullWidth
                          variant="outlined"
                          sx={{ mt: 1 }}
                        >
                          Load
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

      {/* Add Router Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Video Router</DialogTitle>
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
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Protocol</InputLabel>
            <Select
              value={formData.protocol}
              onChange={(e) => setFormData({ ...formData, protocol: e.target.value })}
              label="Protocol"
            >
              <MenuItem value="visca">VISCA</MenuItem>
              <MenuItem value="rs232">RS232</MenuItem>
              <MenuItem value="rs422">RS422</MenuItem>
              <MenuItem value="ethernet">Ethernet</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Inputs"
            type="number"
            value={formData.input_count}
            onChange={(e) => setFormData({ ...formData, input_count: parseInt(e.target.value) })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Outputs"
            type="number"
            value={formData.output_count}
            onChange={(e) => setFormData({ ...formData, output_count: parseInt(e.target.value) })}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddRouter} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
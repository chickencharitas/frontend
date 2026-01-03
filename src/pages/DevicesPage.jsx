import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Chip, Button, Select, MenuItem, FormControl, InputLabel, CircularProgress, TextField, IconButton, Drawer, Snackbar, Alert, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { motion } from 'framer-motion';
import { Trash2, Info } from 'lucide-react';
import api from '../services/api';

const MotionCard = motion(Card);

export default function DevicesPage() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', model: '', ip_address: '', port: '', protocol: '', username: '', password: '' });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const openDetails = (d) => {
    setSelectedDevice(d);
    // prefill edit form from raw data if camera
    if (d?.raw && d.type === 'Camera') {
      setEditForm({
        name: d.name || '',
        model: d.model || '',
        ip_address: d.raw.ip_address || '',
        port: d.raw.port || '',
        protocol: d.raw.protocol || '',
        username: d.raw.username || '',
        password: ''
      });
    } else {
      setEditForm({ name: d?.name || '', model: d?.model || '', ip_address: '', port: '', protocol: '', username: '', password: '' });
    }
    setIsEditing(false);
    setDetailsOpen(true);
  };
  const closeDetails = () => {
    setDetailsOpen(false);
    setSelectedDevice(null);
    setIsEditing(false);
    setEditForm({ name: '', model: '', ip_address: '', port: '', protocol: '', username: '', password: '' });
  };

  const manageDevice = (d) => {
    // route to appropriate device page and pass id as query param when meaningful
    if (!d) return;
    if (d.type === 'Camera') {
      navigate(`/devices/camera?cameraId=${d.rawId}`);
      return;
    }
    if (d.type === 'Lighting (DMX)') {
      navigate(`/devices/lighting`);
      return;
    }
    if (d.type === 'Audio Mixer') {
      navigate(`/devices/mixer`);
      return;
    }
    if (d.type === 'Video Router') {
      navigate(`/devices/router`);
      return;
    }
    // fallback
    navigate('/devices');
  };

  const confirmDelete = (d) => {
    setSelectedDevice(d);
    setDeleteDialogOpen(true);
  };

  const performDelete = async () => {
    if (!selectedDevice) return;
    setDeleting(true);
    try {
      if (selectedDevice.type === 'Camera') {
        await api.delete(`/devices/camera/${selectedDevice.rawId}`);
      } else {
        throw new Error('Delete not supported for this device type');
      }
      setSnackMessage('Device deleted');
      setSnackOpen(true);
      setDeleteDialogOpen(false);
      setSelectedDevice(null);
      fetchAllDevices();
    } catch (err) {
      console.error('Delete failed', err);
      setSnackMessage(err?.response?.data?.error || err.message || 'Delete failed');
      setSnackOpen(true);
    }
    setDeleting(false);
  }; 

  const fetchAllDevices = async () => {
    setLoading(true);
    try {
      const [camerasRes, dmxRes, mixersRes, routersRes] = await Promise.all([
        api.get('/devices/camera').then((r) => r.data).catch(() => []),
        api.get('/devices/dmx').then((r) => r.data).catch(() => []),
        api.get('/devices/mixer').then((r) => r.data).catch(() => []),
        api.get('/devices/router').then((r) => r.data).catch(() => [])
      ]);

      const mapped = [];

      camerasRes.forEach((c) => {
        mapped.push({
          id: `camera-${c.id}`,
          rawId: c.id,
          name: c.name,
          type: 'Camera',
          model: c.model,
          info: `${c.model || ''}${c.ip_address ? ` • ${c.ip_address}:${c.port || 5678}` : ''}`,
          status: c.is_online ? 'Online' : 'Offline',
          raw: c
        });
      });

      dmxRes.forEach((d) => {
        mapped.push({
          id: `dmx-${d.id}`,
          rawId: d.id,
          name: d.name,
          type: 'Lighting (DMX)',
          model: d.model,
          info: `${d.model || ''}${d.connection_type ? ` • ${d.connection_type}` : ''}`,
          status: 'Available',
          raw: d
        });
      });

      mixersRes.forEach((m) => {
        mapped.push({
          id: `mixer-${m.id}`,
          rawId: m.id,
          name: m.name,
          type: 'Audio Mixer',
          model: m.model,
          info: `${m.model || ''}${m.ip_address ? ` • ${m.ip_address}:${m.port || ''}` : ''}`,
          status: 'Available',
          raw: m
        });
      });

      routersRes.forEach((r) => {
        mapped.push({
          id: `router-${r.id}`,
          rawId: r.id,
          name: r.name,
          type: 'Video Router',
          model: r.model,
          info: `${r.model || ''}${r.input_count ? ` • ${r.input_count}x${r.output_count}` : ''}`,
          status: 'Available',
          raw: r
        });
      });

      setDevices(mapped);
    } catch (err) {
      console.error('Failed to load devices:', err);
      setDevices([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllDevices();
  }, []);

  const visible = devices
    .filter((d) => filterType === 'all' || d.type === filterType)
    .filter((d) => {
      const q = (searchTerm || '').trim().toLowerCase();
      if (!q) return true;
      return (d.name || '').toLowerCase().includes(q)
        || (d.type || '').toLowerCase().includes(q)
        || (d.model || '').toLowerCase().includes(q)
        || (d.info || '').toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'type') return (a.type || '').localeCompare(b.type || '');
      if (sortBy === 'status') return (a.status || '').localeCompare(b.status || '');
      return 0;
    });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4">Devices</Typography>
          <TextField
            size="small"
            placeholder="Search devices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              minWidth: 280,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(224,224,224,0.12)' : 'rgba(0,0,0,0.06)'
              },
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(224,224,224,0.6)' : 'rgba(0,0,0,0.28)'
              },
              '& .MuiInputBase-input': { color: (theme) => theme.palette.text.primary },
              '& .MuiInputLabel-root': { color: (theme) => theme.palette.text.secondary },
              '& .MuiInputAdornment-root svg': { color: (theme) => theme.palette.mode === 'dark' ? 'rgba(224,224,224,0.9)' : 'rgba(0,0,0,0.6)' }
            }}
          />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Sort</InputLabel>
            <Select value={sortBy} label="Sort" onChange={(e) => setSortBy(e.target.value)}>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="type">Type</MenuItem>
              <MenuItem value="status">Status</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Type</InputLabel>
            <Select value={filterType} label="Type" onChange={(e) => setFilterType(e.target.value)}>
              <MenuItem value="all">All Devices</MenuItem>
              <MenuItem value="Camera">Cameras</MenuItem>
              <MenuItem value="Lighting (DMX)">Lighting (DMX)</MenuItem>
              <MenuItem value="Audio Mixer">Audio Mixers</MenuItem>
              <MenuItem value="Video Router">Video Routers</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={() => navigate('/devices/camera')}>Add</Button>
        </Box>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {visible.map((d) => (
            <Grid item xs={12} md={6} lg={4} key={d.id}>
              <MotionCard initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -6 }} sx={{ bgcolor: 'background.paper' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6">{d.name}</Typography>
                      <Typography variant="body2" color="textSecondary">{d.info}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                      <Chip label={d.type} size="small" sx={{ textTransform: 'none' }} />
                      <Chip label={d.status} size="small" color={d.status === 'Online' ? 'success' : 'default'} />
                    </Box>
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button size="small" variant="contained" onClick={(e) => { e.stopPropagation(); manageDevice(d); }}>Manage</Button>
                    <Button size="small" variant="outlined" onClick={(e) => { e.stopPropagation(); openDetails(d); }}>Details</Button>
                    {d.type === 'Camera' && (
                      <Button size="small" variant="outlined" color="error" onClick={(e) => { e.stopPropagation(); confirmDelete(d); }}>
                        <Trash2 size={14} />
                        &nbsp;Delete
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Details Drawer */}
      <Drawer
        anchor="right"
        open={detailsOpen}
        onClose={closeDetails}
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            color: 'text.primary',
            width: 420,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(224,224,224,0.12)' : 'rgba(0,0,0,0.06)'
            },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(224,224,224,0.6)' : 'rgba(0,0,0,0.28)'
            },
            '& .MuiInputBase-input': { color: (theme) => theme.palette.text.primary },
            '& .MuiInputLabel-root': { color: (theme) => theme.palette.text.primary },
            '& .MuiInputAdornment-root svg': { color: (theme) => theme.palette.mode === 'dark' ? 'rgba(224,224,224,0.9)' : 'rgba(0,0,0,0.6)' }
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            {!isEditing ? (
              <Typography variant="h6">{selectedDevice?.name}</Typography>
            ) : (
              <TextField size="small" fullWidth value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            )}
            <Box sx={{ ml: 2 }}>
              {!isEditing ? (
                (selectedDevice?.type === 'Camera') ? (
                  <Button size="small" variant="outlined" onClick={() => setIsEditing(true)}>Edit</Button>
                ) : (
                  <Button size="small" variant="outlined" disabled>Edit</Button>
                )
              ) : (
                <>
                  <Button size="small" variant="contained" onClick={async () => {
                    // save
                    setSaving(true);
                    try {
                      if (selectedDevice?.type === 'Camera') {
                        const payload = {
                          name: editForm.name,
                          model: editForm.model,
                          ip_address: editForm.ip_address,
                          port: editForm.port,
                          protocol: editForm.protocol,
                          username: editForm.username,
                          password: editForm.password
                        };
                        const res = await api.put(`/devices/camera/${selectedDevice.rawId}`, payload);
                        // update in-memory devices
                        setDevices((prev) => prev.map((x) => (x.id === selectedDevice.id ? { ...x, name: res.data.name, model: res.data.model, info: `${res.data.model || ''}${res.data.ip_address ? ` • ${res.data.ip_address}:${res.data.port || 5678}` : ''}` } : x)));
                        setSnackMessage('Saved');
                        setSnackOpen(true);
                        setIsEditing(false);
                        // update selected device
                        setSelectedDevice((prev) => ({ ...prev, name: res.data.name, model: res.data.model, info: `${res.data.model || ''}${res.data.ip_address ? ` • ${res.data.ip_address}:${res.data.port || 5678}` : ''}` }));
                      }
                    } catch (err) {
                      console.error('Save failed', err);
                      setSnackMessage(err?.response?.data?.error || err.message || 'Save failed');
                      setSnackOpen(true);
                    }
                    setSaving(false);
                  }} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
                  <Button size="small" variant="text" onClick={() => { setIsEditing(false); setEditForm({ name: selectedDevice?.name || '', model: selectedDevice?.model || '', ip_address: selectedDevice?.raw?.ip_address || '', port: selectedDevice?.raw?.port || '', protocol: selectedDevice?.raw?.protocol || '', username: selectedDevice?.raw?.username || '', password: '' }); }}>Cancel</Button>
                </>
              )}
            </Box>
          </Box>

          <Typography variant="body2" sx={{ mb: 1 }}>{selectedDevice?.type} • {selectedDevice?.model}</Typography>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>Status: <Chip label={selectedDevice?.status} size="small" color={selectedDevice?.status === 'Online' ? 'success' : 'default'} sx={{ ml: 1 }} /></Typography>

          <Typography variant="subtitle2" sx={{ mb: 1 }}>Info</Typography>
          {!isEditing ? (
            <Typography variant="body2" sx={{ mb: 2 }}>{selectedDevice?.info}</Typography>
          ) : (
            <>
              <TextField label="Model" fullWidth size="small" sx={{ mb: 1 }} value={editForm.model} onChange={(e) => setEditForm({ ...editForm, model: e.target.value })} />
              <TextField label="IP Address" fullWidth size="small" sx={{ mb: 1 }} value={editForm.ip_address} onChange={(e) => setEditForm({ ...editForm, ip_address: e.target.value })} />
              <TextField label="Port" fullWidth size="small" sx={{ mb: 1 }} value={editForm.port} onChange={(e) => setEditForm({ ...editForm, port: e.target.value })} />
              <TextField label="Protocol" fullWidth size="small" sx={{ mb: 1 }} value={editForm.protocol} onChange={(e) => setEditForm({ ...editForm, protocol: e.target.value })} />
              <TextField label="Username" fullWidth size="small" sx={{ mb: 1 }} value={editForm.username} onChange={(e) => setEditForm({ ...editForm, username: e.target.value })} />
              <TextField label="Password" fullWidth size="small" sx={{ mb: 1 }} type="password" value={editForm.password} onChange={(e) => setEditForm({ ...editForm, password: e.target.value })} />
            </>
          )}

          <Typography variant="subtitle2" sx={{ mb: 1 }}>Raw JSON</Typography>
          <Box component="pre" sx={{ whiteSpace: 'pre-wrap', fontSize: 12, bgcolor: 'background.default', p: 1, borderRadius: 1, overflow: 'auto', maxHeight: 320 }}>
            {selectedDevice ? JSON.stringify(selectedDevice.raw || selectedDevice, null, 2) : ''}
          </Box>

          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={() => { manageDevice(selectedDevice); closeDetails(); }}>Manage</Button>
            {selectedDevice?.type === 'Camera' ? (
              <Button variant="outlined" color="error" onClick={() => { confirmDelete(selectedDevice); closeDetails(); }}>Delete</Button>
            ) : null}
            <Button variant="text" onClick={closeDetails}>Close</Button>
          </Box>
        </Box>
      </Drawer>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Device</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete <strong>{selectedDevice?.name}</strong>? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={performDelete} variant="contained" color="error" disabled={deleting}>{deleting ? 'Deleting...' : 'Delete'}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackOpen} autoHideDuration={4000} onClose={() => setSnackOpen(false)}>
        <Alert severity="success" onClose={() => setSnackOpen(false)} sx={{ width: '100%' }}>{snackMessage}</Alert>
      </Snackbar>
    </Box>
  );
}

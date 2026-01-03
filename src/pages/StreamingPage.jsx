import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Paper,
  List,
  ListItem,
} from '@mui/material';
import { Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const MotionCard = motion(Card);

export default function StreamingPage() {
  const [streams, setStreams] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduled_at: '',
  });

  const fetchStreams = async () => {
    setLoading(true);
    try {
      const res = await api.get('/streaming/list');
      setStreams(res.data);
    } catch (err) {
      console.error('Failed to fetch streams:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlatforms = async () => {
    try {
      const res = await api.get('/streaming/platforms');
      setPlatforms(res.data);
    } catch (err) {
      console.error('Failed to fetch platforms:', err);
    }
  };

  useEffect(() => {
    fetchStreams();
    fetchPlatforms();
  }, []);

  const handleCreateOrUpdateStream = async () => {
    try {
      if (editingId) {
        await api.put(`/streaming/${editingId}`, formData);
      } else {
        await api.post('/streaming/create', formData);
      }

      setOpenDialog(false);
      setEditingId(null);
      setFormData({ title: '', description: '', scheduled_at: '' });
      fetchStreams();
    } catch (err) {
      console.error('Failed to save stream:', err);
    }
  };

  const handleStartStream = async (stream_id) => {
    try {
      await api.post('/streaming/start', { stream_id });
      fetchStreams();
    } catch (err) {
      console.error('Failed to start stream:', err);
    }
  };

  const handleEndStream = async (stream_id) => {
    try {
      await api.post('/streaming/end', { stream_id });
      fetchStreams();
    } catch (err) {
      console.error('Failed to end stream:', err);
    }
  };

  const handleDeleteStream = async (stream_id) => {
    if (!window.confirm('Delete this stream?')) return;
    try {
      await api.delete(`/streaming/${stream_id}`);
      fetchStreams();
    } catch (err) {
      console.error('Failed to delete stream:', err);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case 'live':
        return 'error';
      case 'scheduled':
        return 'warning';
      default:
        return 'success';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Live Streaming</Typography>
        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          New Stream
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {streams.map((stream) => (
            <Grid item xs={12} sm={6} md={4} key={stream.id}>
              <MotionCard whileHover={{ y: -4 }}>
                <CardContent>
                  <Typography variant="h6">{stream.title}</Typography>

                  <Chip
                    label={stream.status}
                    color={statusColor(stream.status)}
                    size="small"
                    sx={{ my: 1 }}
                  />

                  <Typography variant="body2">
                    {stream.description}
                  </Typography>

                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Viewers: {stream.viewer_count}
                  </Typography>

                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    {stream.status !== 'live' ? (
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleStartStream(stream.id)}
                      >
                        Go Live
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        color="error"
                        variant="contained"
                        onClick={() => handleEndStream(stream.id)}
                      >
                        End
                      </Button>
                    )}

                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Edit size={14} />}
                      onClick={() => {
                        setEditingId(stream.id);
                        setFormData({
                          title: stream.title,
                          description: stream.description,
                          scheduled_at: stream.scheduled_at,
                        });
                        setOpenDialog(true);
                      }}
                    />

                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<Trash2 size={14} />}
                      onClick={() => handleDeleteStream(stream.id)}
                    />
                  </Box>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      )}

      <Typography variant="h5" sx={{ mb: 2 }}>
        Connected Platforms
      </Typography>

      <List>
        {platforms.map((p) => (
          <ListItem key={p.id}>
            <Paper sx={{ p: 2, width: '100%' }}>
              <Typography variant="subtitle2">
                {p.platform.toUpperCase()}
              </Typography>
              <Typography variant="body2">
                Channel: {p.channel_name ?? p.channel_id}
              </Typography>
              <Chip
                label={p.is_active ? 'Active' : 'Inactive'}
                color={p.is_active ? 'success' : 'default'}
                size="small"
                sx={{ mt: 1 }}
              />
            </Paper>
          </ListItem>
        ))}
      </List>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle>
          {editingId ? 'Edit Stream' : 'Create Stream'}
        </DialogTitle>

        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            sx={{ mb: 2, mt: 1 }}
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            sx={{ mb: 2 }}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <TextField
            label="Scheduled Time"
            type="datetime-local"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.scheduled_at}
            onChange={(e) =>
              setFormData({ ...formData, scheduled_at: e.target.value })
            }
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateOrUpdateStream}>
            {editingId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

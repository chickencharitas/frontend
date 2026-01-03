import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Chip,
  Skeleton
} from '@mui/material';
import { EllipsisVertical, Edit, Trash2, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function PlaylistsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const { data: playlists = [], isLoading } = useQuery(
    ['playlists', search],
    async () => {
      const response = await api.get('/playlists', { params: { search } });
      return response.data.data || [];
    },
    { staleTime: 5000 }
  );

  const createMutation = useMutation(
    (newPlaylist) => api.post('/playlists', newPlaylist),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('playlists');
        setOpenDialog(false);
        setTitle('');
      }
    }
  );

  const publishMutation = useMutation(
    (id) => api.post(`/playlists/${id}/publish`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('playlists');
        setAnchorEl(null);
      }
    }
  );

  const deleteMutation = useMutation(
    (id) => api.delete(`/playlists/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('playlists');
        setAnchorEl(null);
      }
    }
  );

  const handleCreate = () => {
    if (title.trim()) {
      createMutation.mutate({ title, description: '' });
    }
  };

  const handleMenuClick = (event, id) => {
    event.stopPropagation();
    setSelectedId(id);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'default',
      scheduled: 'info',
      active: 'success',
      completed: 'default',
      archived: 'default'
    };
    return colors[status] || 'default';
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Playlists & Service Schedules
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Organize and manage your presentation playlists
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => setOpenDialog(true)}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          + Create Playlist
        </Button>
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        placeholder="Search playlists by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 4 }}
        size="small"
      />

      {/* Grid */}
      <Grid container spacing={3}>
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 2 }} />
              </Grid>
            ))
          : playlists.length > 0
          ? playlists.map((playlist) => (
              <Grid item xs={12} sm={6} md={4} key={playlist.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    height: '100%',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6
                    }
                  }}
                  onClick={() => navigate(`/playlists/${playlist.id}/edit`)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1, pr: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                          {playlist.title}
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <Chip
                            label={playlist.status || 'draft'}
                            size="small"
                            color={getStatusColor(playlist.status)}
                            variant="outlined"
                          />
                        </Box>
                        <Typography variant="caption" color="textSecondary">
                          Created {new Date(playlist.created_at).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, playlist.id)}
                        sx={{ mt: -0.5 }}
                      >
                        <EllipsisVertical size={18} />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          : (
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Typography variant="body1" color="textSecondary">
                    No playlists found. Create one to get started!
                  </Typography>
                </Box>
              </Grid>
            )}
      </Grid>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            navigate(`/playlists/${selectedId}/edit`);
            handleMenuClose();
          }}
        >
          <Edit size={18} style={{ marginRight: 12 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => publishMutation.mutate(selectedId)}>
          <Play size={18} style={{ marginRight: 12 }} />
          Publish & Go Live
        </MenuItem>
        <MenuItem
          onClick={() => deleteMutation.mutate(selectedId)}
          sx={{ color: 'error.main' }}
        >
          <Trash2 size={18} style={{ marginRight: 12 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Create Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Create New Playlist</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Playlist Title"
            placeholder="e.g., Sunday Morning Service"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
            sx={{ mt: 2 }}
            size="small"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            disabled={!title.trim() || createMutation.isLoading}
          >
            {createMutation.isLoading ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
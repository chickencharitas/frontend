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
  Skeleton
} from '@mui/material';
import { MoreVert, Edit, Delete, FileCopy } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function PresentationsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const { data: presentations, isLoading } = useQuery(['presentations', search], async () => {
    const response = await api.get('/presentations', { params: { search } });
    return response.data.data;
  });

  const createMutation = useMutation(
    (newPresentation) => api.post('/presentations', newPresentation),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('presentations');
        setOpenDialog(false);
        setTitle('');
      }
    }
  );

  const deleteMutation = useMutation(
    (id) => api.delete(`/presentations/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('presentations');
        setAnchorEl(null);
      }
    }
  );

  const duplicateMutation = useMutation(
    (id) => api.post(`/presentations/${id}/duplicate`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('presentations');
        setAnchorEl(null);
      }
    }
  );

  const handleCreate = () => {
    if (title) {
      createMutation.mutate({ title, type: 'custom' });
    }
  };

  const handleMenuClick = (event, id) => {
    setSelectedId(id);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Presentations
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate('/presenter')}
          >
            Launch Presenter
          </Button>
          <Button
            variant="contained"
            onClick={() => setOpenDialog(true)}
          >
            Create Presentation
          </Button>
        </Box>
      </Box>

      <TextField
        fullWidth
        placeholder="Search presentations..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Grid container spacing={3}>
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rectangular" height={200} />
            </Grid>
          ))
          : presentations?.map((pres) => (
            <Grid item xs={12} sm={6} md={4} key={pres.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 }
                }}
                onClick={() => navigate(`/presentations/${pres.id}/edit`)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6">{pres.title}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(pres.created_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuClick(e, pres.id);
                      }}
                    >
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    {pres.description || 'No description'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, color: 'text.secondary' }}>
                    <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                      📄 {pres.slide_count || 0} slides
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        }
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { navigate(`/presentations/${selectedId}/edit`); handleMenuClose(); }}>
          <Edit sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => duplicateMutation.mutate(selectedId)}>
          <FileCopy sx={{ mr: 1 }} /> Duplicate
        </MenuItem>
        <MenuItem onClick={() => deleteMutation.mutate(selectedId)} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create New Presentation</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Presentation Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            disabled={!title}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
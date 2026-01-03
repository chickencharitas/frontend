import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Trash2, Plus } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import api from '../services/api';

export default function PlaylistEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [openItemDialog, setOpenItemDialog] = useState(false);
  const [itemType, setItemType] = useState('presentation');
  const [itemId, setItemId] = useState('');
  const [playlist, setPlaylist] = useState(null);
  const [presentations, setPresentations] = useState([]);

  const { data: playlistData, isLoading } = useQuery(
    ['playlist', id],
    () =>
      id
        ? api.get(`/playlists/${id}`).then((res) => res.data)
        : Promise.resolve({ id: null, title: '', items: [] }),
    { enabled: !!id }
  );

  const { data: presentationsData } = useQuery('presentations-select', () =>
    api.get('/presentations?limit=100').then((res) => res.data)
  );

  useEffect(() => {
    if (playlistData) {
      setPlaylist(playlistData.data || playlistData);
    }
  }, [playlistData]);

  useEffect(() => {
    if (presentationsData?.data) {
      setPresentations(presentationsData.data);
    }
  }, [presentationsData]);

  const updateMutation = useMutation(
    (data) => api.put(`/playlists/${id}`, data),
    { onSuccess: () => queryClient.invalidateQueries(['playlist', id]) }
  );

  const addItemMutation = useMutation(
    (data) => api.post(`/playlists/${id}/items`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['playlist', id]);
        setOpenItemDialog(false);
        setItemType('presentation');
        setItemId('');
      }
    }
  );

  const deleteItemMutation = useMutation(
    (itemId) => api.delete(`/playlists/${id}/items/${itemId}`),
    { onSuccess: () => queryClient.invalidateQueries(['playlist', id]) }
  );

  const reorderMutation = useMutation(
    (items) => api.post(`/playlists/${id}/reorder`, { items }),
    { onSuccess: () => queryClient.invalidateQueries(['playlist', id]) }
  );

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination || !playlist?.items) return;

    const items = Array.from(playlist.items);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);

    const reorderData = items.map((item, index) => ({
      itemId: item.id,
      newOrder: index + 1
    }));

    reorderMutation.mutate(reorderData);
  };

  const handleAddItem = () => {
    if (itemId) {
      addItemMutation.mutate({
        type: itemType,
        presentationId: itemType === 'presentation' ? itemId : null,
        songId: itemType === 'song' ? itemId : null
      });
    }
  };

  const handleSavePlaylist = () => {
    if (playlist) {
      updateMutation.mutate({ title: playlist.title });
    }
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (!playlist) return <Typography>No playlist found</Typography>;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ flex: 1, mr: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Edit Playlist
          </Typography>
          <TextField
            fullWidth
            label="Playlist Title"
            value={playlist.title || ''}
            onChange={(e) => setPlaylist({ ...playlist, title: e.target.value })}
            size="small"
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            onClick={handleSavePlaylist}
            disabled={updateMutation.isLoading}
          >
            {updateMutation.isLoading ? 'Saving...' : 'Save'}
          </Button>
          <Button variant="outlined" onClick={() => navigate('/playlists')}>
            Back
          </Button>
        </Box>
      </Box>

      {/* Items Card */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Playlist Items ({playlist.items?.length || 0})
            </Typography>
            <Button
              size="small"
              variant="contained"
              startIcon={<Plus size={18} />}
              onClick={() => setOpenItemDialog(true)}
              sx={{ textTransform: 'none' }}
            >
              Add Item
            </Button>
          </Box>
          <Divider sx={{ mb: 2 }} />

          {(!playlist.items || playlist.items.length === 0) ? (
            <Typography variant="body2" color="textSecondary" sx={{ py: 3, textAlign: 'center' }}>
              No items yet. Add one to get started!
            </Typography>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="playlist-items-list">
                {(provided, snapshot) => (
                  <List
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{ width: '100%' }}
                  >
                    {playlist.items.map((item, index) => (
                      <Draggable key={String(item.id)} draggableId={String(item.id)} index={index}>
                        {(provided, snapshot) => (
                          <ListItem
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            sx={{
                              mb: 1,
                              p: 2,
                              border: '1px solid',
                              borderColor: snapshot.isDragging ? 'primary.main' : 'divider',
                              borderRadius: 1,
                              backgroundColor: snapshot.isDragging ? 'primary.light' : 'background.paper',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <Box
                              {...provided.dragHandleProps}
                              sx={{ mr: 2, cursor: 'grab', '&:active': { cursor: 'grabbing' } }}
                            >
                              <Typography variant="body2" color="textSecondary">
                                ⋮⋮
                              </Typography>
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {index + 1}. {item.presentation_title || item.song_title || item.type}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {item.duration ? `${item.duration}s` : 'N/A'}
                              </Typography>
                            </Box>
                            <IconButton
                              size="small"
                              onClick={() => deleteItemMutation.mutate(item.id)}
                              sx={{ color: 'error.main' }}
                            >
                              <Trash2 size={18} />
                            </IconButton>
                          </ListItem>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </List>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </CardContent>
      </Card>

      {/* Add Item Dialog */}
      <Dialog open={openItemDialog} onClose={() => setOpenItemDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Add Item to Playlist</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
            <InputLabel>Item Type</InputLabel>
            <Select
              value={itemType}
              onChange={(e) => {
                setItemType(e.target.value);
                setItemId('');
              }}
              label="Item Type"
            >
              <MenuItem value="presentation">Presentation</MenuItem>
              <MenuItem value="song">Song / Lyrics</MenuItem>
              <MenuItem value="scripture">Scripture</MenuItem>
              <MenuItem value="video">Video</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Select {itemType}</InputLabel>
            <Select
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              label={`Select ${itemType}`}
            >
              {itemType === 'presentation' &&
                presentations.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.title}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenItemDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAddItem}
            variant="contained"
            disabled={!itemId || addItemMutation.isLoading}
          >
            {addItemMutation.isLoading ? 'Adding...' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
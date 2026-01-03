import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Paper,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Divider,
  Fab,
  Tooltip,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  DragIndicator,
  PlayArrow,
  Add,
  Edit,
  Delete,
  LibraryMusic,
  MenuBook,
  VideoLibrary,
  Image,
  AccessTime,
  Person,
  CalendarToday,
  ExpandMore,
  Save,
  Share,
  Download,
  Upload,
  Clear,
  CheckCircle,
  Schedule,
  Timer
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Mock service data
const mockServiceItems = [
  {
    id: '1',
    type: 'song',
    title: 'Amazing Grace',
    artist: 'Traditional',
    duration: 245,
    category: 'opening',
    notes: 'Welcome song - start with verse 1'
  },
  {
    id: '2',
    type: 'scripture',
    title: 'John 3:16',
    reference: 'John 3:16',
    duration: 120,
    category: 'scripture',
    notes: 'Main scripture reading'
  },
  {
    id: '3',
    type: 'song',
    title: 'How Great Thou Art',
    artist: 'Traditional',
    duration: 312,
    category: 'worship',
    notes: 'Responsive reading between verses'
  },
  {
    id: '4',
    type: 'announcement',
    title: 'Weekly Announcements',
    duration: 180,
    category: 'announcements',
    notes: 'Upcoming events and prayer requests'
  },
  {
    id: '5',
    type: 'video',
    title: 'Baptism Testimony',
    duration: 420,
    category: 'special',
    notes: 'New member baptism video'
  },
  {
    id: '6',
    type: 'song',
    title: 'Amazing Grace (Reprise)',
    artist: 'Traditional',
    duration: 180,
    category: 'closing',
    notes: 'Closing song with benediction'
  }
];

// Available service templates
const serviceTemplates = [
  {
    id: 'traditional',
    name: 'Traditional Service',
    description: 'Classic worship service with hymns and liturgy',
    items: ['opening_hymn', 'call_to_worship', 'hymn_of_praise', 'scripture_reading', 'sermon', 'closing_hymn', 'benediction']
  },
  {
    id: 'contemporary',
    name: 'Contemporary Service',
    description: 'Modern worship with songs and multimedia',
    items: ['welcome_video', 'opening_song', 'praise_songs', 'scripture_response', 'message', 'invitation_song', 'closing']
  },
  {
    id: 'blended',
    name: 'Blended Service',
    description: 'Mix of traditional and contemporary elements',
    items: ['opening_hymn', 'contemporary_song', 'scripture_reading', 'sermon', 'closing_songs', 'benediction']
  }
];

const getTypeIcon = (type) => {
  const icons = {
    song: <LibraryMusic sx={{ color: 'primary.main' }} />,
    scripture: <MenuBook sx={{ color: '#81c784' }} />,
    video: <VideoLibrary sx={{ color: '#e57373' }} />,
    image: <Image sx={{ color: '#ffb74d' }} />,
    announcement: <Person sx={{ color: '#ba68c8' }} />,
    timer: <Timer sx={{ color: '#90a4ae' }} />
  };
  return icons[type] || <LibraryMusic sx={{ color: '#666' }} />;
};

const getTypeColor = (type) => {
  const colors = {
    song: 'primary.main',
    scripture: '#81c784',
    video: '#e57373',
    image: '#ffb74d',
    announcement: '#ba68c8',
    timer: '#90a4ae'
  };
  return colors[type] || '#666';
};

export default function ServicePlaylist() {
  const [playlist, setPlaylist] = useState(mockServiceItems);
  const [serviceTitle, setServiceTitle] = useState('Sunday Morning Service');
  const [serviceDate, setServiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [serviceNotes, setServiceNotes] = useState('');
  const [createDialog, setCreateDialog] = useState(false);
  const [templateDialog, setTemplateDialog] = useState(false);
  const [newItem, setNewItem] = useState({
    type: 'song',
    title: '',
    duration: 180,
    category: 'worship',
    notes: ''
  });
  const [totalDuration, setTotalDuration] = useState(0);

  // Calculate total duration
  useEffect(() => {
    const total = playlist.reduce((sum, item) => sum + item.duration, 0);
    setTotalDuration(total);
  }, [playlist]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(playlist);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPlaylist(items);
  };

  const handleAddItem = () => {
    if (newItem.title.trim()) {
      const item = {
        ...newItem,
        id: Date.now().toString(),
        artist: newItem.type === 'song' ? 'Various Artists' : undefined,
        reference: newItem.type === 'scripture' ? newItem.title : undefined
      };
      setPlaylist([...playlist, item]);
      setNewItem({
        type: 'song',
        title: '',
        duration: 180,
        category: 'worship',
        notes: ''
      });
      setCreateDialog(false);
    }
  };

  const handleDeleteItem = (id) => {
    setPlaylist(playlist.filter(item => item.id !== id));
  };

  const handleApplyTemplate = (template) => {
    // Convert template items to actual playlist items
    const templateItems = template.items.map((itemType, index) => {
      const mockItems = {
        opening_hymn: { type: 'song', title: 'Amazing Grace', artist: 'Traditional', duration: 245, category: 'opening' },
        call_to_worship: { type: 'announcement', title: 'Call to Worship', duration: 60, category: 'worship' },
        hymn_of_praise: { type: 'song', title: 'Holy, Holy, Holy', artist: 'Traditional', duration: 198, category: 'worship' },
        scripture_reading: { type: 'scripture', title: 'Psalm 100', reference: 'Psalm 100', duration: 120, category: 'scripture' },
        sermon: { type: 'announcement', title: 'Sermon: "Walking in Faith"', duration: 1800, category: 'sermon' },
        welcome_video: { type: 'video', title: 'Welcome Video', duration: 90, category: 'welcome' },
        opening_song: { type: 'song', title: 'Build My Life', artist: 'Pat Barrett', duration: 312, category: 'opening' },
        praise_songs: { type: 'song', title: 'Way Maker', artist: 'Sinach', duration: 285, category: 'worship' },
        scripture_response: { type: 'scripture', title: 'Jeremiah 29:11', reference: 'Jeremiah 29:11', duration: 90, category: 'scripture' },
        message: { type: 'announcement', title: 'Message: "God\'s Plan for Your Life"', duration: 2100, category: 'sermon' },
        invitation_song: { type: 'song', title: 'Just As I Am', artist: 'Traditional', duration: 198, category: 'invitation' },
        contemporary_song: { type: 'song', title: 'Goodness of God', artist: 'CeCe Winans', duration: 267, category: 'worship' },
        closing_songs: { type: 'song', title: 'Great Is Thy Faithfulness', artist: 'Traditional', duration: 223, category: 'closing' },
        closing: { type: 'announcement', title: 'Benediction & Dismissal', duration: 60, category: 'closing' },
        benediction: { type: 'announcement', title: 'Benediction', duration: 30, category: 'closing' }
      };

      const itemData = mockItems[itemType] || { type: 'announcement', title: itemType, duration: 60, category: 'other' };
      return {
        ...itemData,
        id: `${itemType}_${index}`,
        notes: ''
      };
    });

    setPlaylist(templateItems);
    setTemplateDialog(false);
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const exportPlaylist = () => {
    const data = {
      title: serviceTitle,
      date: serviceDate,
      notes: serviceNotes,
      items: playlist,
      totalDuration
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${serviceTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_playlist.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#1a1a1a', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
          Service Playlist
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#b0b0b0' }}>
          Plan and organize your worship service elements
        </Typography>
      </Box>

      {/* Service Info */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Service Title"
              value={serviceTitle}
              onChange={(e) => setServiceTitle(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: '#404040' },
                  '&:hover fieldset': { borderColor: 'primary.main' }
                },
                '& .MuiInputLabel-root': { color: '#b0b0b0' }
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              type="date"
              label="Service Date"
              value={serviceDate}
              onChange={(e) => setServiceDate(e.target.value)}
              InputLabelProps={{ sx: { color: '#b0b0b0' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: '#404040' },
                  '&:hover fieldset': { borderColor: 'primary.main' }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTime sx={{ color: '#b0b0b0' }} />
              <Typography variant="h6" sx={{ color: 'white' }}>
                Total: {formatDuration(totalDuration)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={2}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                onClick={() => setTemplateDialog(true)}
                sx={{ borderColor: '#81c784', color: '#81c784' }}
              >
                Templates
              </Button>
              <Button
                variant="outlined"
                onClick={exportPlaylist}
                sx={{ borderColor: 'primary.main', color: 'primary.main' }}
              >
                Export
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* Playlist */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                  Service Order ({playlist.length} items)
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setCreateDialog(true)}
                  sx={{ bgcolor: 'primary.main' }}
                >
                  Add Item
                </Button>
              </Box>

              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="playlist">
                  {(provided) => (
                    <Box {...provided.droppableProps} ref={provided.innerRef}>
                      {playlist.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              sx={{
                                mb: 1,
                                bgcolor: snapshot.isDragging ? 'primary.main' : '#333',
                                border: '1px solid #404040',
                                '&:hover': { borderColor: 'primary.main' }
                              }}
                            >
                              <CardContent sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <Box {...provided.dragHandleProps}>
                                    <DragIndicator sx={{ color: '#b0b0b0', cursor: 'grab' }} />
                                  </Box>

                                  <Avatar sx={{ bgcolor: getTypeColor(item.type), width: 40, height: 40 }}>
                                    {getTypeIcon(item.type)}
                                  </Avatar>

                                  <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 'bold' }}>
                                      {item.title}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                      {item.artist && (
                                        <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                                          {item.artist}
                                        </Typography>
                                      )}
                                      <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                                        {formatDuration(item.duration)}
                                      </Typography>
                                      <Chip
                                        label={item.category}
                                        size="small"
                                        sx={{
                                          height: 16,
                                          fontSize: '0.6rem',
                                          bgcolor: '#404040',
                                          color: '#e0e0e0'
                                        }}
                                      />
                                    </Box>
                                    {item.notes && (
                                      <Typography variant="caption" sx={{ color: '#b0b0b0', display: 'block', mt: 0.5 }}>
                                        {item.notes}
                                      </Typography>
                                    )}
                                  </Box>

                                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    <Tooltip title="Play">
                                      <IconButton size="small" sx={{ color: 'primary.main' }}>
                                        <PlayArrow fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Edit">
                                      <IconButton size="small" sx={{ color: '#ffb74d' }}>
                                        <Edit fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                      <IconButton
                                        size="small"
                                        onClick={() => handleDeleteItem(item.id)}
                                        sx={{ color: '#e57373' }}
                                      >
                                        <Delete fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                </Box>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </DragDropContext>

              {playlist.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <LibraryMusic sx={{ fontSize: 64, color: '#666', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: '#b0b0b0', mb: 2 }}>
                    No service items yet
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
                    Start building your service by adding songs, scriptures, announcements, and more.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setCreateDialog(true)}
                    sx={{ mr: 2 }}
                  >
                    Add First Item
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setTemplateDialog(true)}
                    sx={{ borderColor: '#81c784', color: '#81c784' }}
                  >
                    Use Template
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Service Notes */}
          <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040', mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                Service Notes
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Add notes about this service..."
                value={serviceNotes}
                onChange={(e) => setServiceNotes(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: '#404040' },
                    '&:hover fieldset': { borderColor: 'primary.main' }
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040', mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                Service Overview
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>Total Items</Typography>
                  <Typography variant="body2" sx={{ color: 'white' }}>{playlist.length}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>Songs</Typography>
                  <Typography variant="body2" sx={{ color: 'white' }}>
                    {playlist.filter(item => item.type === 'song').length}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>Scriptures</Typography>
                  <Typography variant="body2" sx={{ color: 'white' }}>
                    {playlist.filter(item => item.type === 'scripture').length}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>Media Items</Typography>
                  <Typography variant="body2" sx={{ color: 'white' }}>
                    {playlist.filter(item => ['video', 'image'].includes(item.type)).length}
                  </Typography>
                </Box>
                <Divider sx={{ bgcolor: '#404040' }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: '#b0b0b0', fontWeight: 'bold' }}>Total Duration</Typography>
                  <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                    {formatDuration(totalDuration)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Upcoming Services */}
          <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                Upcoming Services
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {[
                  { date: '2024-01-21', title: 'Sunday Morning Service', time: '10:00 AM' },
                  { date: '2024-01-24', title: 'Wednesday Prayer Meeting', time: '7:00 PM' },
                  { date: '2024-01-28', title: 'Sunday Morning Service', time: '10:00 AM' }
                ].map((service, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 1,
                      borderRadius: 1,
                      bgcolor: '#333',
                      '&:hover': { bgcolor: '#404040' }
                    }}
                  >
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                      {service.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                      {service.date} • {service.time}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Item Dialog */}
      <Dialog
        open={createDialog}
        onClose={() => setCreateDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#2a2a2a',
            color: 'white',
            border: '1px solid #404040'
          }
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>Add Service Item</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#b0b0b0' }}>Item Type</InputLabel>
                <Select
                  value={newItem.type}
                  onChange={(e) => setNewItem({...newItem, type: e.target.value})}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#404040' }
                  }}
                >
                  <MenuItem value="song">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LibraryMusic sx={{ fontSize: 18, color: 'primary.main' }} />
                      Song
                    </Box>
                  </MenuItem>
                  <MenuItem value="scripture">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MenuBook sx={{ fontSize: 18, color: '#81c784' }} />
                      Scripture
                    </Box>
                  </MenuItem>
                  <MenuItem value="video">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <VideoLibrary sx={{ fontSize: 18, color: '#e57373' }} />
                      Video
                    </Box>
                  </MenuItem>
                  <MenuItem value="announcement">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person sx={{ fontSize: 18, color: '#ba68c8' }} />
                      Announcement
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={newItem.title}
                onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: '#404040' },
                    '&:hover fieldset': { borderColor: 'primary.main' }
                  },
                  '& .MuiInputLabel-root': { color: '#b0b0b0' }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Duration (seconds)"
                value={newItem.duration}
                onChange={(e) => setNewItem({...newItem, duration: parseInt(e.target.value) || 0})}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: '#404040' },
                    '&:hover fieldset': { borderColor: 'primary.main' }
                  },
                  '& .MuiInputLabel-root': { color: '#b0b0b0' }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#b0b0b0' }}>Category</InputLabel>
                <Select
                  value={newItem.category}
                  onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#404040' }
                  }}
                >
                  <MenuItem value="opening">Opening</MenuItem>
                  <MenuItem value="worship">Worship</MenuItem>
                  <MenuItem value="scripture">Scripture</MenuItem>
                  <MenuItem value="sermon">Sermon</MenuItem>
                  <MenuItem value="offering">Offering</MenuItem>
                  <MenuItem value="closing">Closing</MenuItem>
                  <MenuItem value="special">Special</MenuItem>
                  <MenuItem value="announcements">Announcements</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Notes"
                value={newItem.notes}
                onChange={(e) => setNewItem({...newItem, notes: e.target.value})}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: '#404040' },
                    '&:hover fieldset': { borderColor: 'primary.main' }
                  },
                  '& .MuiInputLabel-root': { color: '#b0b0b0' }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialog(false)} sx={{ color: '#b0b0b0' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddItem}
            disabled={!newItem.title.trim()}
            sx={{ bgcolor: 'primary.main' }}
          >
            Add Item
          </Button>
        </DialogActions>
      </Dialog>

      {/* Template Dialog */}
      <Dialog
        open={templateDialog}
        onClose={() => setTemplateDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#2a2a2a',
            color: 'white',
            border: '1px solid #404040'
          }
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>Service Templates</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 3 }}>
            Choose a template to quickly set up your service structure
          </Typography>

          <Grid container spacing={2}>
            {serviceTemplates.map((template) => (
              <Grid item xs={12} md={4} key={template.id}>
                <Card
                  sx={{
                    bgcolor: '#333',
                    border: '1px solid #404040',
                    cursor: 'pointer',
                    '&:hover': { borderColor: 'primary.main' }
                  }}
                  onClick={() => handleApplyTemplate(template)}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Schedule sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                      {template.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 2 }}>
                      {template.description}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#666' }}>
                      {template.items.length} items
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTemplateDialog(false)} sx={{ color: '#b0b0b0' }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          bgcolor: 'primary.main',
          '&:hover': { bgcolor: '#3d9bf0' }
        }}
        onClick={() => setCreateDialog(true)}
      >
        <Add />
      </Fab>
    </Box>
  );
}
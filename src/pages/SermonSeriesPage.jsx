import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tabs,
  Tab,
  CircularProgress,
  Paper,
  Chip,
  Divider,
  Stack,
  TextareaAutosize,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { Plus, Trash2, Edit, BookOpen, Calendar, User, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const MotionCard = motion(Card);

export default function SermonSeriesPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [sermonSeries, setSermonSeries] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [sermonNotes, setSermonNotes] = useState([]);
  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openSeriesDialog, setOpenSeriesDialog] = useState(false);
  const [openNoteDialog, setOpenNoteDialog] = useState(false);
  const [openPresetDialog, setOpenPresetDialog] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  
  const [seriesFormData, setSeriesFormData] = useState({
    title: '',
    description: '',
    book_of_bible: '',
    start_date: '',
    end_date: '',
    is_public: false
  });

  const [noteFormData, setNoteFormData] = useState({
    title: '',
    scripture_reference: '',
    speaker_name: '',
    sermon_date: '',
    notes_content: '',
    outline: [],
    key_points: [],
    discussion_questions: [],
    prayer_requests: ''
  });

  const [presetFormData, setPresetFormData] = useState({
    preset_name: '',
    description: '',
    is_template: false
  });

  const fetchSermonSeries = async () => {
    setLoading(true);
    try {
      const res = await api.get('/marketplace/sermon-series');
      setSermonSeries(res.data);
      if (res.data.length > 0 && !selectedSeries) {
        setSelectedSeries(res.data[0]);
        await fetchSermonNotes(res.data[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch sermon series:', err);
    }
    setLoading(false);
  };

  const fetchSermonNotes = async (series_id) => {
    try {
      const res = await api.get(`/marketplace/sermon-series/${series_id}/notes`);
      setSermonNotes(res.data);
    } catch (err) {
      console.error('Failed to fetch sermon notes:', err);
    }
  };

  const fetchPresets = async () => {
    try {
      const res = await api.get('/marketplace/sermon-presets');
      setPresets(res.data);
    } catch (err) {
      console.error('Failed to fetch presets:', err);
    }
  };

  useEffect(() => {
    fetchSermonSeries();
    fetchPresets();
  }, []);

  useEffect(() => {
    if (selectedSeries) {
      fetchSermonNotes(selectedSeries.id);
    }
  }, [selectedSeries]);

  const handleCreateSeries = async () => {
    try {
      const res = await api.post('/marketplace/sermon-series', seriesFormData);
      setSeriesFormData({
        title: '',
        description: '',
        book_of_bible: '',
        start_date: '',
        end_date: '',
        is_public: false
      });
      setOpenSeriesDialog(false);
      fetchSermonSeries();
    } catch (err) {
      console.error('Failed to create series:', err);
    }
  };

  const handleCreateNote = async () => {
    if (!selectedSeries) return;
    try {
      const endpoint = editingNote
        ? `/marketplace/sermon-notes/${editingNote.id}`
        : `/marketplace/sermon-series/${selectedSeries.id}/notes`;
      
      const method = editingNote ? 'put' : 'post';
      await api[method](endpoint, noteFormData);
      
      setNoteFormData({
        title: '',
        scripture_reference: '',
        speaker_name: '',
        sermon_date: '',
        notes_content: '',
        outline: [],
        key_points: [],
        discussion_questions: [],
        prayer_requests: ''
      });
      setEditingNote(null);
      setOpenNoteDialog(false);
      fetchSermonNotes(selectedSeries.id);
    } catch (err) {
      console.error('Failed to save note:', err);
    }
  };

  const handleDeleteNote = async (note_id) => {
    if (window.confirm('Delete this sermon note?')) {
      try {
        await api.delete(`/marketplace/sermon-notes/${note_id}`);
        fetchSermonNotes(selectedSeries.id);
      } catch (err) {
        console.error('Failed to delete note:', err);
      }
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setNoteFormData({
      title: note.title,
      scripture_reference: note.scripture_reference,
      speaker_name: note.speaker_name,
      sermon_date: note.sermon_date,
      notes_content: note.notes_content,
      outline: note.outline || [],
      key_points: note.key_points || [],
      discussion_questions: note.discussion_questions || [],
      prayer_requests: note.prayer_requests || ''
    });
    setOpenNoteDialog(true);
  };

  const handleCreatePreset = async () => {
    try {
      await api.post('/marketplace/sermon-presets', {
        ...presetFormData,
        sermon_series_id: selectedSeries?.id
      });
      setPresetFormData({ preset_name: '', description: '', is_template: false });
      setOpenPresetDialog(false);
      fetchPresets();
    } catch (err) {
      console.error('Failed to create preset:', err);
    }
  };

  const handleDeployPreset = async (preset_id) => {
    try {
      await api.post(`/marketplace/sermon-presets/${preset_id}/deploy`);
      alert('Sermon preset deployed successfully!');
    } catch (err) {
      console.error('Failed to deploy preset:', err);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Sermon Series & Notes
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={() => setOpenSeriesDialog(true)}
        >
          New Series
        </Button>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Series & Notes" />
          <Tab label="Plug & Play Presets" />
        </Tabs>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          {activeTab === 0 && (
            <Grid container spacing={3}>
              {/* Series List */}
              <Grid item xs={12} md={3}>
                <MotionCard>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                      Sermon Series
                    </Typography>
                    <List sx={{ p: 0 }}>
                      {sermonSeries.map((series) => (
                        <ListItem
                          button
                          key={series.id}
                          selected={selectedSeries?.id === series.id}
                          onClick={() => setSelectedSeries(series)}
                          sx={{ borderRadius: 1, mb: 1, pl: 1 }}
                        >
                          <ListItemIcon>
                            <BookOpen size={20} />
                          </ListItemIcon>
                          <ListItemText
                            primary={series.title}
                            secondary={`${series.sermon_count} notes`}
                            primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                            secondaryTypographyProps={{ variant: 'caption' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </MotionCard>
              </Grid>

              {/* Series Details & Notes */}
              <Grid item xs={12} md={9}>
                {selectedSeries && (
                  <>
                    <MotionCard
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      sx={{ mb: 3 }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                              {selectedSeries.title}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                              {selectedSeries.description}
                            </Typography>
                            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                              {selectedSeries.book_of_bible && (
                                <Chip
                                  icon={<BookOpen size={14} />}
                                  label={selectedSeries.book_of_bible}
                                  variant="outlined"
                                  size="small"
                                />
                              )}
                              {selectedSeries.start_date && (
                                <Chip
                                  icon={<Calendar size={14} />}
                                  label={new Date(selectedSeries.start_date).toLocaleDateString()}
                                  variant="outlined"
                                  size="small"
                                />
                              )}
                            </Stack>
                          </Box>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<Plus size={16} />}
                            onClick={() => {
                              setEditingNote(null);
                              setNoteFormData({
                                title: '',
                                scripture_reference: '',
                                speaker_name: '',
                                sermon_date: '',
                                notes_content: '',
                                outline: [],
                                key_points: [],
                                discussion_questions: [],
                                prayer_requests: ''
                              });
                              setOpenNoteDialog(true);
                            }}
                          >
                            Add Sermon Note
                          </Button>
                        </Box>
                      </CardContent>
                    </MotionCard>

                    {/* Sermon Notes */}
                    <MotionCard
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                          Sermon Notes ({sermonNotes.length})
                        </Typography>

                        {sermonNotes.length === 0 ? (
                          <Typography color="textSecondary">
                            No sermon notes yet. Create one to get started!
                          </Typography>
                        ) : (
                          <TableContainer>
                            <Table size="small">
                              <TableHead>
                                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                  <TableCell>Title</TableCell>
                                  <TableCell>Scripture</TableCell>
                                  <TableCell>Speaker</TableCell>
                                  <TableCell>Date</TableCell>
                                  <TableCell align="right">Actions</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {sermonNotes.map((note) => (
                                  <TableRow key={note.id} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                                    <TableCell sx={{ fontWeight: 600 }}>
                                      {note.title}
                                    </TableCell>
                                    <TableCell>{note.scripture_reference}</TableCell>
                                    <TableCell>{note.speaker_name}</TableCell>
                                    <TableCell>
                                      {new Date(note.sermon_date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell align="right">
                                      <IconButton
                                        size="small"
                                        onClick={() => handleEditNote(note)}
                                      >
                                        <Edit size={16} />
                                      </IconButton>
                                      <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDeleteNote(note.id)}
                                      >
                                        <Trash2 size={16} />
                                      </IconButton>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        )}
                      </CardContent>
                    </MotionCard>
                  </>
                )}
              </Grid>
            </Grid>
          )}

          {activeTab === 1 && (
            <>
              <Box sx={{ mb: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<Plus size={20} />}
                  onClick={() => setOpenPresetDialog(true)}
                >
                  Create Preset
                </Button>
              </Box>

              <Grid container spacing={3}>
                {presets.map((preset) => (
                  <Grid item xs={12} md={6} key={preset.id}>
                    <MotionCard
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -5 }}
                    >
                      <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                          {preset.preset_name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                          {preset.description}
                        </Typography>
                        {preset.is_template && (
                          <Chip label="Template" size="small" color="primary" sx={{ mb: 2 }} />
                        )}
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleDeployPreset(preset.id)}
                          >
                            Deploy
                          </Button>
                          <Button variant="outlined" size="small">
                            Edit
                          </Button>
                        </Box>
                      </CardContent>
                    </MotionCard>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </>
      )}

      {/* Create Series Dialog */}
      <Dialog open={openSeriesDialog} onClose={() => setOpenSeriesDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Sermon Series</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            label="Series Title"
            value={seriesFormData.title}
            onChange={(e) => setSeriesFormData({ ...seriesFormData, title: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            value={seriesFormData.description}
            onChange={(e) => setSeriesFormData({ ...seriesFormData, description: e.target.value })}
            fullWidth
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Book of Bible"
            value={seriesFormData.book_of_bible}
            onChange={(e) => setSeriesFormData({ ...seriesFormData, book_of_bible: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
            placeholder="e.g., Genesis, John"
          />
          <TextField
            label="Start Date"
            type="date"
            value={seriesFormData.start_date}
            onChange={(e) => setSeriesFormData({ ...seriesFormData, start_date: e.target.value })}
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="End Date"
            type="date"
            value={seriesFormData.end_date}
            onChange={(e) => setSeriesFormData({ ...seriesFormData, end_date: e.target.value })}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSeriesDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateSeries} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create/Edit Note Dialog */}
      <Dialog open={openNoteDialog} onClose={() => setOpenNoteDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingNote ? 'Edit Sermon Note' : 'Create Sermon Note'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            label="Sermon Title"
            value={noteFormData.title}
            onChange={(e) => setNoteFormData({ ...noteFormData, title: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Scripture Reference"
                value={noteFormData.scripture_reference}
                onChange={(e) => setNoteFormData({ ...noteFormData, scripture_reference: e.target.value })}
                fullWidth
                placeholder="e.g., John 3:16"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Speaker Name"
                value={noteFormData.speaker_name}
                onChange={(e) => setNoteFormData({ ...noteFormData, speaker_name: e.target.value })}
                fullWidth
              />
            </Grid>
          </Grid>
          <TextField
            label="Sermon Date"
            type="date"
            value={noteFormData.sermon_date}
            onChange={(e) => setNoteFormData({ ...noteFormData, sermon_date: e.target.value })}
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            Sermon Notes
          </Typography>
          <TextareaAutosize
            minRows={6}
            value={noteFormData.notes_content}
            onChange={(e) => setNoteFormData({ ...noteFormData, notes_content: e.target.value })}
            placeholder="Write your detailed sermon notes here..."
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              marginBottom: '16px'
            }}
          />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            Prayer Requests
          </Typography>
          <TextareaAutosize
            minRows={3}
            value={noteFormData.prayer_requests}
            onChange={(e) => setNoteFormData({ ...noteFormData, prayer_requests: e.target.value })}
            placeholder="List prayer requests from the sermon..."
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontFamily: 'inherit',
              fontSize: 'inherit'
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNoteDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateNote} variant="contained">
            {editingNote ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Preset Dialog */}
      <Dialog open={openPresetDialog} onClose={() => setOpenPresetDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Plug & Play Preset</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            label="Preset Name"
            value={presetFormData.preset_name}
            onChange={(e) => setPresetFormData({ ...presetFormData, preset_name: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
            placeholder="e.g., Sunday Service Template"
          />
          <TextField
            label="Description"
            value={presetFormData.description}
            onChange={(e) => setPresetFormData({ ...presetFormData, description: e.target.value })}
            fullWidth
            multiline
            rows={3}
            sx={{ mb: 2 }}
            placeholder="Describe what this preset includes..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPresetDialog(false)}>Cancel</Button>
          <Button onClick={handleCreatePreset} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
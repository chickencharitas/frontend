import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel
} from '@mui/material';
import { Download, Trash2, Play, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';

export default function RecordingsPage() {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecording, setSelectedRecording] = useState(null);

  const fetchRecordings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/streaming/recordings');
      setRecordings(res.data);
    } catch (err) {
      console.error('Failed to fetch recordings:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecordings();
  }, []);

  const handleDelete = async (recording_id) => {
    if (window.confirm('Delete this recording?')) {
      try {
        await api.delete(`/streaming/recording/${recording_id}`);
        fetchRecordings();
      } catch (err) {
        console.error('Failed to delete recording:', err);
      }
    }
  };

  const handlePublish = async (recording_id, is_public) => {
    try {
      await api.post('/streaming/recording/publish', { recording_id, is_public: !is_public });
      fetchRecordings();
    } catch (err) {
      console.error('Failed to update recording:', err);
    }
  };

  const handleDownload = (cdn_url, title) => {
    if (!cdn_url) {
      alert('Recording not yet available');
      return;
    }
    window.open(cdn_url, '_blank');
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0s';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready':
        return 'success';
      case 'processing':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Recordings</Typography>
        <Button variant="contained" onClick={fetchRecordings}>
          Refresh
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : recordings.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="textSecondary">No recordings found</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>Title</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Views</TableCell>
                <TableCell>Public</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recordings.map((recording) => (
                <TableRow key={recording.id}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {recording.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={recording.status}
                      color={getStatusColor(recording.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDuration(recording.duration_seconds)}</TableCell>
                  <TableCell>{formatFileSize(recording.file_size)}</TableCell>
                  <TableCell>{recording.view_count || 0}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handlePublish(recording.id, recording.is_public)}
                    >
                      {recording.is_public ? (
                        <Eye size={18} />
                      ) : (
                        <EyeOff size={18} />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell align="right">
                    {recording.status === 'ready' && (
                      <>
                        <Tooltip title="Preview">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedRecording(recording);
                              setOpenDialog(true);
                            }}
                          >
                            <Play size={18} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download">
                          <IconButton
                            size="small"
                            onClick={() => handleDownload(recording.cdn_url, recording.title)}
                          >
                            <Download size={18} />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(recording.id)}
                      >
                        <Trash2 size={18} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Preview Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{selectedRecording?.title}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {selectedRecording?.cdn_url ? (
            <Box
              component="video"
              width="100%"
              height="400px"
              controls
              src={selectedRecording.cdn_url}
              sx={{
                backgroundColor: '#000',
                borderRadius: 1
              }}
            />
          ) : (
            <Typography color="textSecondary">Recording not available yet</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
          {selectedRecording?.cdn_url && (
            <Button
              variant="contained"
              onClick={() => {
                handleDownload(selectedRecording.cdn_url, selectedRecording.title);
                setOpenDialog(false);
              }}
              startIcon={<Download size={16} />}
            >
              Download
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
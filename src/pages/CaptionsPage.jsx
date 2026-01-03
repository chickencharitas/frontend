import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Paper,
  Tabs,
  Tab,
  Chip,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Play,
  Pause,
  Plus,
  Edit,
  Trash2,
  Download,
  Check,
  Clock,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const MotionCard = motion.create(Card);

export default function CaptionsPage() {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [playing, setPlaying] = useState(false);

  // Fetch media files
  const { data: mediaFiles = [], isLoading: mediaLoading } = useQuery(
    ['media-files'],
    async () => {
      const response = await api.get('/media');
      return response.data?.data || [];
    },
    { staleTime: 5000 }
  );

  // Fetch transcription
  const { data: transcription, isLoading: transcLoading } = useQuery(
    ['transcription', selectedMedia?.id],
    async () => {
      if (!selectedMedia) return null;
      const response = await api.get(`/captions/media/${selectedMedia.id}/transcriptions`);
      return response.data;
    },
    { enabled: !!selectedMedia, staleTime: 5000 }
  );

  // Fetch captions
  const { data: captions = [] } = useQuery(
    ['captions', transcription?.id],
    async () => {
      if (!transcription) return [];
      const response = await api.get(`/captions/transcriptions/${transcription.id}/captions`);
      return response.data || [];
    },
    { enabled: !!transcription, staleTime: 5000 }
  );

  // Fetch lyrics
  const { data: lyrics = [] } = useQuery(
    ['lyrics', selectedMedia?.id],
    async () => {
      if (!selectedMedia) return [];
      const response = await api.get(`/captions/media/${selectedMedia.id}/lyrics-suggestions`);
      return response.data || [];
    },
    { enabled: !!selectedMedia, staleTime: 5000 }
  );

  // Fetch cuepoints
  const { data: cuepoints = [] } = useQuery(
    ['cuepoints', selectedMedia?.id],
    async () => {
      if (!selectedMedia) return [];
      const response = await api.get(`/captions/media/${selectedMedia.id}/cuepoints`);
      return response.data || [];
    },
    { enabled: !!selectedMedia, staleTime: 5000 }
  );

  // Start transcription
  const startTranscription = useMutation(
    async (mediaId) => {
      const response = await api.post(`/captions/media/${mediaId}/transcribe`);
      return response.data;
    },
    {
      onSuccess: () => {
        alert('Transcription started!');
      }
    }
  );

  // Detect lyrics
  const detectLyrics = useMutation(
    async (mediaId) => {
      const response = await api.post(`/captions/media/${mediaId}/detect-lyrics`);
      return response.data;
    },
    {
      onSuccess: () => {
        alert('Lyrics detection started!');
      }
    }
  );

  // Analyze images
  const analyzeImages = useMutation(
    async (mediaId) => {
      const response = await api.post(`/captions/media/${mediaId}/analyze-images`);
      return response.data;
    },
    {
      onSuccess: () => {
        alert('Image analysis started!');
      }
    }
  );

  // Generate cuepoints
  const generateCuepoints = useMutation(
    async (mediaId) => {
      const response = await api.post(`/captions/media/${mediaId}/generate-cuepoints`);
      return response.data;
    },
    {
      onSuccess: () => {
        alert('Cue points generated!');
      }
    }
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <Check size={16} style={{ color: 'green' }} />;
      case 'processing':
        return <Clock size={16} style={{ color: 'orange' }} />;
      case 'failed':
        return <AlertCircle size={16} style={{ color: 'red' }} />;
      default:
        return <Clock size={16} />;
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        Captions & Auto-Generation
      </Typography>

      <Grid container spacing={3}>
        {/* Media Selection */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Media Files
              </Typography>

              {mediaLoading ? (
                <CircularProgress size={24} />
              ) : (
                <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                  {mediaFiles.map((media) => (
                    <ListItem
                      key={media.id}
                      button
                      selected={selectedMedia?.id === media.id}
                      onClick={() => setSelectedMedia(media)}
                      sx={{
                        border: '1px solid #ddd',
                        mb: 1,
                        borderRadius: 1,
                        backgroundColor: selectedMedia?.id === media.id ? '#f0f0f0' : 'transparent'
                      }}
                    >
                      <ListItemText
                        primary={media.title}
                        secondary={`${(media.size / 1024 / 1024).toFixed(2)}MB`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {!selectedMedia ? (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="textSecondary">
                Select a media file to begin
              </Typography>
            </Paper>
          ) : (
            <>
              {/* Tabs */}
              <Tabs
                value={activeTab}
                onChange={(e, v) => setActiveTab(v)}
                sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab label="Captions" />
                <Tab label="Lyrics" />
                <Tab label="Image Recognition" />
                <Tab label="Cue Points" />
              </Tabs>

              {/* Captions Tab */}
              {activeTab === 0 && (
                <MotionCard initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6">Speech-to-Text</Typography>
                      <Button
                        variant="contained"
                        startIcon={<Plus size={18} />}
                        onClick={() => startTranscription.mutate(selectedMedia.id)}
                        disabled={startTranscription.isLoading}
                      >
                        {startTranscription.isLoading ? 'Processing...' : 'Start Transcription'}
                      </Button>
                    </Box>

                    {transcription && (
                      <>
                        <Chip
                          icon={getStatusIcon(transcription.status)}
                          label={transcription.status.toUpperCase()}
                          color={
                            transcription.status === 'completed'
                              ? 'success'
                              : transcription.status === 'failed'
                              ? 'error'
                              : 'warning'
                          }
                          sx={{ mb: 2 }}
                        />

                        {transcription.status === 'completed' && (
                          <>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 2 }}>
                              Transcript:
                            </Typography>
                            <Paper sx={{ p: 2, backgroundColor: '#f5f5f5', mb: 2 }}>
                              <Typography variant="body2">
                                {transcription.transcript_text}
                              </Typography>
                            </Paper>

                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                              Captions ({captions.length})
                            </Typography>
                            <TableContainer>
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Time</TableCell>
                                    <TableCell>Caption</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {captions.map((caption) => (
                                    <TableRow key={caption.id}>
                                      <TableCell>
                                        {`${(caption.start_time / 1000).toFixed(1)}s`}
                                      </TableCell>
                                      <TableCell>{caption.text}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>

                            <Button
                              variant="outlined"
                              startIcon={<Download size={18} />}
                              sx={{ mt: 2 }}
                            >
                              Export as VTT
                            </Button>
                          </>
                        )}
                      </>
                    )}
                  </CardContent>
                </MotionCard>
              )}

              {/* Lyrics Tab */}
              {activeTab === 1 && (
                <MotionCard initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6">Lyrics Detection</Typography>
                      <Button
                        variant="contained"
                        startIcon={<Plus size={18} />}
                        onClick={() => detectLyrics.mutate(selectedMedia.id)}
                        disabled={detectLyrics.isLoading}
                      >
                        {detectLyrics.isLoading ? 'Detecting...' : 'Detect Lyrics'}
                      </Button>
                    </Box>

                    <List>
                      {lyrics.map((lyric) => (
                        <ListItem key={lyric.id} sx={{ border: '1px solid #ddd', mb: 1, borderRadius: 1 }}>
                          <ListItemText
                            primary={lyric.detected_lyrics}
                            secondary={`Confidence: ${(lyric.confidence_score * 100).toFixed(0)}%`}
                          />
                          <Button size="small" variant="outlined">
                            {lyric.is_approved ? 'Approved' : 'Approve'}
                          </Button>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </MotionCard>
              )}

              {/* Image Recognition Tab */}
              {activeTab === 2 && (
                <MotionCard initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6">Image Recognition</Typography>
                      <Button
                        variant="contained"
                        startIcon={<Plus size={18} />}
                        onClick={() => analyzeImages.mutate(selectedMedia.id)}
                        disabled={analyzeImages.isLoading}
                      >
                        {analyzeImages.isLoading ? 'Analyzing...' : 'Analyze Images'}
                      </Button>
                    </Box>

                    <Alert severity="info">
                      Detected objects, scenes, and text will appear here after analysis.
                    </Alert>
                  </CardContent>
                </MotionCard>
              )}

              {/* Cue Points Tab */}
              {activeTab === 3 && (
                <MotionCard initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6">Smart Cue Points</Typography>
                      <Button
                        variant="contained"
                        startIcon={<Plus size={18} />}
                        onClick={() => generateCuepoints.mutate(selectedMedia.id)}
                        disabled={generateCuepoints.isLoading}
                      >
                        {generateCuepoints.isLoading ? 'Generating...' : 'Generate Cue Points'}
                      </Button>
                    </Box>

                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Time</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Confidence</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {cuepoints.map((cue) => (
                            <TableRow key={cue.id}>
                              <TableCell>
                                {`${(cue.timestamp / 1000).toFixed(1)}s`}
                              </TableCell>
                              <TableCell>
                                <Chip label={cue.cue_type} size="small" />
                              </TableCell>
                              <TableCell>{cue.description}</TableCell>
                              <TableCell>
                                {(cue.confidence * 100).toFixed(0)}%
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </MotionCard>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
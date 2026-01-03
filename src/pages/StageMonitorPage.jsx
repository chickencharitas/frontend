import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Paper, Divider, Chip, LinearProgress } from '@mui/material';
import { ExpandMore, AccessTime, Music, Layers } from '@mui/icons-material';
import io from 'socket.io-client';

export default function StageMonitorPage() {
  const [currentSlide, setCurrentSlide] = useState(null);
  const [nextSlide, setNextSlide] = useState(null);
  const [countdownTime, setCountdownTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [upcomingItems, setUpcomingItems] = useState([]);

  useEffect(() => {
    const socket = io('/', {
      path: '/socket.io',
      transports: ['websocket'],
      reconnection: true
    });

    socket.on('connect', () => {
      console.log('Connected to stage monitor socket');
    });

    socket.on('slide_change', (data) => {
      setCurrentSlide(data.current);
      setNextSlide(data.next);
      setUpcomingItems(data.upcoming || []);
      setTotalDuration(data.totalDuration || 0);
    });

    socket.on('countdown_update', (data) => {
      setCountdownTime(data.remaining);
      setProgress((data.elapsed / data.total) * 100);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from stage monitor socket');
    });

    return () => socket.disconnect();
  }, []);

  // Update countdown every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdownTime(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box sx={{
      p: 3,
      backgroundColor: '#1a1a1a',
      color: '#fff',
      minHeight: '100vh',
      fontFamily: 'Roboto, sans-serif'
    }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
        STAGE MONITOR
      </Typography>

      <Grid container spacing={2}>
        {/* Current Slide - Large */}
        <Grid item xs={12} md={8}>
          <Card sx={{
            backgroundColor: '#2a2a2a',
            borderLeft: '8px solid #667eea',
            height: '100%',
            boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
          }}>
            <CardContent>
              <Typography variant="overline" color="textSecondary" sx={{ fontSize: 10 }}>
                CURRENTLY DISPLAYING
              </Typography>
              <Typography variant="h3" sx={{
                my: 2,
                fontWeight: 'bold',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                wordBreak: 'break-word'
              }}>
                {currentSlide?.title || 'Standby'}
              </Typography>
              <Typography variant="h6" sx={{
                color: '#aaa',
                wordBreak: 'break-word',
                lineHeight: 1.6
              }}>
                {currentSlide?.content || 'Waiting for presentation...'}
              </Typography>
              {currentSlide?.notes && (
                <>
                  <Divider sx={{ my: 2, backgroundColor: '#444' }} />
                  <Typography variant="caption" sx={{ color: '#999' }}>
                    NOTES: {currentSlide.notes}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Time & Progress */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={2} sx={{ height: '100%' }}>
            {/* Countdown */}
            <Grid item xs={12} sm={6} md={12}>
              <Card sx={{
                backgroundColor: '#2a2a2a',
                textAlign: 'center',
                boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    <AccessTime sx={{ fontSize: 32, color: '#f093fb' }} />
                  </Box>
                  <Typography variant="overline" color="textSecondary" sx={{ fontSize: 10 }}>
                    Time Remaining
                  </Typography>
                  <Typography variant="h2" sx={{
                    my: 2,
                    fontWeight: 'bold',
                    color: '#f093fb',
                    fontFamily: 'monospace'
                  }}>
                    {formatTime(countdownTime)}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(progress, 100)}
                    sx={{
                      mt: 1,
                      backgroundColor: '#444',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#f093fb'
                      }
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Slide Count */}
            <Grid item xs={12} sm={6} md={12}>
              <Card sx={{
                backgroundColor: '#2a2a2a',
                textAlign: 'center',
                boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    <Layers sx={{ fontSize: 32, color: '#4facfe' }} />
                  </Box>
                  <Typography variant="overline" color="textSecondary" sx={{ fontSize: 10 }}>
                    Items in Playlist
                  </Typography>
                  <Typography variant="h3" sx={{
                    my: 2,
                    fontWeight: 'bold',
                    color: '#4facfe'
                  }}>
                    {upcomingItems.length + 1}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Next Slide */}
        <Grid item xs={12}>
          <Card sx={{
            backgroundColor: '#2a2a2a',
            borderLeft: '8px solid #764ba2',
            boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <ExpandMore sx={{ color: '#764ba2' }} />
                <Typography variant="overline" color="textSecondary" sx={{ fontSize: 10 }}>
                  UP NEXT
                </Typography>
              </Box>
              <Typography variant="h5" sx={{
                fontWeight: 'bold',
                wordBreak: 'break-word'
              }}>
                {nextSlide?.title || 'End of Playlist'}
              </Typography>
              {nextSlide?.content && (
                <Typography variant="body2" sx={{
                  mt: 1,
                  color: '#aaa',
                  wordBreak: 'break-word'
                }}>
                  {nextSlide.content.substring(0, 100)}
                  {nextSlide.content.length > 100 ? '...' : ''}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Items Queue */}
        {upcomingItems.length > 0 && (
          <Grid item xs={12}>
            <Card sx={{
              backgroundColor: '#2a2a2a',
              boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Upcoming Items ({upcomingItems.length})
                </Typography>
                <Box sx={{
                  maxHeight: 300,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1
                }}>
                  {upcomingItems.map((item, idx) => (
                    <Paper
                      key={idx}
                      sx={{
                        p: 2,
                        backgroundColor: '#333',
                        borderLeft: `4px solid ${['#667eea', '#764ba2', '#f093fb', '#4facfe'][idx % 4]}`
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {idx + 2}. {item.title}
                          </Typography>
                          {item.notes && (
                            <Typography variant="caption" sx={{ color: '#999', display: 'block', mt: 0.5 }}>
                              {item.notes}
                            </Typography>
                          )}
                        </Box>
                        {item.duration && (
                          <Chip
                            label={formatTime(item.duration)}
                            size="small"
                            sx={{
                              backgroundColor: '#444',
                              color: '#fff',
                              fontFamily: 'monospace'
                            }}
                          />
                        )}
                      </Box>
                    </Paper>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Info Panel */}
        <Grid item xs={12}>
          <Paper sx={{
            p: 2,
            backgroundColor: '#2a2a2a',
            borderRadius: 1
          }}>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    DISPLAY TYPE
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                    Stage Monitor
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    STATUS
                  </Typography>
                  <Typography variant="body2" sx={{
                    fontWeight: 'bold',
                    mt: 0.5,
                    color: currentSlide ? '#4caf50' : '#f44336'
                  }}>
                    {currentSlide ? 'Live' : 'Standby'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    RESOLUTION
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                    1920x1080
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    TIME
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                    {new Date().toLocaleTimeString()}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
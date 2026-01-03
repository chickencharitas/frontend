import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
  Avatar,
  AvatarGroup
} from '@mui/material';
import { Users, MessageSquare, FileCheck } from 'lucide-react';
import api from '../services/api';

export default function CollabPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/collab/sessions');
      setSessions(res.data);
    } catch (err) {
      console.error('Failed to fetch collaboration sessions:', err);
      setSessions([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Collaboration Sessions
      </Typography>

      {sessions.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="textSecondary">No active collaboration sessions</Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {sessions.map((session) => (
            <Grid item xs={12} md={6} key={session.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {session.media_id}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Users size={18} style={{ marginRight: 8 }} />
                    <Typography variant="body2">
                      {session.participant_count || 0} participants
                    </Typography>
                  </Box>
                  <Chip
                    label={session.is_active ? 'Active' : 'Inactive'}
                    color={session.is_active ? 'success' : 'default'}
                    size="small"
                  />
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button size="small" variant="outlined">
                      View Details
                    </Button>
                    <Button size="small" variant="contained">
                      Join
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
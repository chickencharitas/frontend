import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Skeleton
} from '@mui/material';
import {
  Slideshow,
  Schedule,
  Image,
  TrendingUp
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function DashboardPage() {
  const navigate = useNavigate();

  const { data: stats, isLoading } = useQuery('dashboard-stats', async () => {
    const [presentations, playlists, media] = await Promise.all([
      api.get('/presentations? limit=5'),
      api.get('/playlists?limit=5'),
      api.get('/media?limit=10')
    ]);
    return {
      presentations: presentations.data. data,
      playlists: playlists.data.data,
      media: media.data.data
    };
  });

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom>
              {title}
            </Typography>
            {isLoading ? (
              <Skeleton width={60} height={40} />
            ) : (
              <Typography variant="h4">{value}</Typography>
            )}
          </Box>
          <Icon sx={{ fontSize: 48, opacity: 0.5, color }} />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={Slideshow}
            title="Presentations"
            value={stats?. presentations?. length || 0}
            color="#667eea"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={Schedule}
            title="Playlists"
            value={stats?.playlists?.length || 0}
            color="#764ba2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={Image}
            title="Media Files"
            value={stats?.media?.length || 0}
            color="#f093fb"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={TrendingUp}
            title="Services This Month"
            value="12"
            color="#4facfe"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Recent Presentations
              </Typography>
              {isLoading ? (
                <Skeleton variant="rectangular" height={200} />
              ) : (
                <Box>
                  {stats?.presentations?. slice(0, 5).map((p) => (
                    <Box key={p.id} sx={{ py: 1, borderBottom: '1px solid #eee' }}>
                      <Typography variant="body2">{p.title}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(p.created_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                  ))}
                  <Button
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/presentations')}
                  >
                    View All
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="contained"
                  fullWidth
                  color="secondary"
                  onClick={() => navigate('/presenter')}
                >
                  Launch Presenter
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={async () => {
                    try {
                      const res = await api.post('/presentations', { title: 'Untitled Presentation' });
                      const created = res.data || res.data?.data || res.data?.rows?.[0];
                      const id = created?.id || created?.data?.id;
                      if (id) navigate(`/presentations/${id}/edit`);
                    } catch (err) {
                      console.error('Failed to create presentation', err);
                    }
                  }}
                >
                  Create Presentation
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate('/playlists/new')}
                >
                  Create Playlist
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/media')}
                >
                  Upload Media
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
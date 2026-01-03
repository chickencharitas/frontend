import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { useParams } from 'react-router-dom';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import api from '../services/api';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'];

export default function AnalyticsPage() {
  const { streamId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(false);
  const [streams, setStreams] = useState([]);
  const [selectedStream, setSelectedStream] = useState(streamId || '');

  const fetchStreams = async () => {
    try {
      const res = await api.get('/streaming/list');
      setStreams(res.data);
      if (!selectedStream && res.data.length > 0) {
        setSelectedStream(res.data[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch streams:', err);
    }
  };

  const fetchAnalytics = async () => {
    if (!selectedStream) return;
    setLoading(true);
    try {
      const [analyticsRes, timelineRes] = await Promise.all([
        api.get(`/streaming/${selectedStream}/analytics`),
        api.get(`/streaming/${selectedStream}/timeline`)
      ]);
      setAnalytics(analyticsRes.data);
      setTimeline(timelineRes.data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStreams();
  }, []);

  useEffect(() => {
    if (selectedStream) {
      fetchAnalytics();
    }
  }, [selectedStream]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const statCards = [
    { label: 'Peak Viewers', value: analytics?.peak_viewers || 0 },
    { label: 'Total Viewers', value: analytics?.total_unique_viewers || 0 },
    { label: 'Chat Messages', value: analytics?.total_chat_messages || 0 },
    { label: 'Engagement Rate', value: `${analytics?.engagement_rate || 0}%` }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Stream Analytics</Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Select Stream</InputLabel>
          <Select
            value={selectedStream}
            onChange={(e) => setSelectedStream(e.target.value)}
            label="Select Stream"
          >
            {streams.map((stream) => (
              <MenuItem key={stream.id} value={stream.id}>
                {stream.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {statCards.map((stat, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  {stat.label}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Viewer Timeline</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(time) => new Date(time).toLocaleTimeString()}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(time) => new Date(time).toLocaleTimeString()}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="viewer_count"
                  stroke="#8884d8"
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Engagement Breakdown</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Engagement', value: analytics?.engagement_rate || 0 },
                    { name: 'Non-Engagement', value: 100 - (analytics?.engagement_rate || 0) }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[0, 1].map((index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Retention Rate</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  {
                    name: 'Retention',
                    value: analytics?.retention_percentage || 0
                  }
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
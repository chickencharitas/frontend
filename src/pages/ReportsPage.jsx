import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Alert,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Download,
  BarChart as BarChartIcon,
  TrendingUp,
  People,
  Schedule,
  Image as ImageIcon,
  FileDownload
} from '@mui/icons-material';
import api from '../services/api';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('service-summary');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const { data: serviceHistory, isLoading: historyLoading } = useQuery(
    ['service-history', startDate, endDate],
    () => api.get('/reports/service-history', { 
      params: { startDate, endDate, limit: 100 } 
    })
  );

  const { data: mediaAnalytics, isLoading: analyticsLoading } = useQuery(
    ['media-analytics', startDate, endDate],
    () => api.get('/reports/media-analytics', { 
      params: { startDate, endDate } 
    })
  );

  const { data: usageAnalytics } = useQuery(
    ['usage-analytics', startDate, endDate],
    () => api.get('/reports/usage-analytics', { 
      params: { startDate, endDate } 
    })
  );

  const generateMutation = useMutation((data) =>
    api.post('/reports/generate', data)
  );

  const exportMutation = useMutation((data) =>
    api.post('/reports/export', data),
    {
      onSuccess: (response) => {
        // Trigger download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `report-${reportType}.csv`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      }
    }
  );

  const handleGenerateReport = () => {
    generateMutation.mutate({
      type: reportType,
      startDate,
      endDate,
      format: 'json'
    });
  };

  const handleExport = (format = 'csv') => {
    exportMutation.mutate({
      reportId: 'latest',
      format
    });
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {value}
            </Typography>
          </Box>
          <Icon sx={{ fontSize: 40, color, opacity: 0.3 }} />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Reports & Analytics
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Generate Report
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  label="Report Type"
                >
                  <MenuItem value="service-summary">Service Summary</MenuItem>
                  <MenuItem value="media-usage">Media Usage</MenuItem>
                  <MenuItem value="user-activity">User Activity</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="date"
                label="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<BarChartIcon />}
              onClick={handleGenerateReport}
              loading={generateMutation.isLoading}
            >
              Generate Report
            </Button>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={() => handleExport('csv')}
            >
              Export CSV
            </Button>
            <Button
              variant="outlined"
              startIcon={<FileDownload />}
              onClick={() => handleExport('pdf')}
            >
              Export PDF
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Services"
            value={serviceHistory?.data?.length || 0}
            icon={Schedule}
            color="#667eea"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Media Files Used"
            value={mediaAnalytics?.data?.length || 0}
            icon={ImageIcon}
            color="#764ba2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Users"
            value={usageAnalytics?.data?.length || 0}
            icon={People}
            color="#f093fb"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg Presentations/Month"
            value="8.5"
            icon={TrendingUp}
            color="#4facfe"
          />
        </Grid>
      </Grid>

      {/* Detailed Reports Tabs */}
      <Grid container spacing={3}>
        {/* Service History */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Service History
              </Typography>
              {historyLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Event</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Duration</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Items</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {serviceHistory?.data?.slice(0, 10).map((service, idx) => (
                        <TableRow key={idx} hover>
                          <TableCell>
                            {new Date(service.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{service.event_type}</TableCell>
                          <TableCell>
                            {service.event_data?.duration || '~60 min'}
                          </TableCell>
                          <TableCell>
                            {service.event_data?.items_count || 0}
                          </TableCell>
                        </TableRow>
                      ))}
                      {serviceHistory?.data?.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                            <Typography color="textSecondary">
                              No service history available
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Media Usage Chart */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Top Media Files
              </Typography>
              {analyticsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>File</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          Uses
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mediaAnalytics?.data?.slice(0, 8).map((media, idx) => (
                        <TableRow key={idx}>
                          <TableCell>
                            <Typography variant="body2" noWrap>
                              {media.title}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              label={media.usage_count}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Monthly Activity Chart */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Monthly Activity Trend
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Chart data visualization would be displayed here using recharts
          </Alert>
          <Box sx={{
            p: 2,
            backgroundColor: '#f9f9f9',
            borderRadius: 1,
            textAlign: 'center',
            minHeight: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Typography color="textSecondary">
              📊 Chart Component (implement with recharts library)
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
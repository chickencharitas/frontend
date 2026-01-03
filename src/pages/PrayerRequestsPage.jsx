import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default function PrayerRequestsPage() {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Attendance Tracking
      </Typography>
      <Typography color="textSecondary">
        Coming Soon: Check-in system, attendance reports, and trend analytics
      </Typography>
    </Paper>
  );
}
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default function MobileRemotePage() {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Mobile Remote Control
      </Typography>
      <Typography color="textSecondary">
        Coming Soon: Mobile app, presentation builder, iOS/Android apps, and Bluetooth device control
      </Typography>
    </Paper>
  );
}
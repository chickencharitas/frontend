import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default function TimerPage() {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Timer & Countdown Features
      </Typography>
      <Typography color="textSecondary">
        Coming Soon: Sermon timer, service countdown, break timer, and custom countdown messages
      </Typography>
    </Paper>
  );
}
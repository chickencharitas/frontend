import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default function BackgroundsPage() {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Background & Overlay System
      </Typography>
      <Typography color="textSecondary">
        Coming Soon: Custom backgrounds, animated transitions, color overlays, gradients, and patterns
      </Typography>
    </Paper>
  );
}
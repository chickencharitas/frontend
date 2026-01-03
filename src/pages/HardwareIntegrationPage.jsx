import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default function HardwareIntegrationPage() {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Hardware Integrations
      </Typography>
      <Typography color="textSecondary">
        Coming Soon: Camera control, lighting control (DMX), audio mixer control, and video router control
      </Typography>
    </Paper>
  );
}
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default function EmergencyBackupPage() {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Emergency & Backup Features
      </Typography>
      <Typography color="textSecondary">
        Coming Soon: Auto-save to cloud, offline mode, backup & restore, and version control
      </Typography>
    </Paper>
  );
}
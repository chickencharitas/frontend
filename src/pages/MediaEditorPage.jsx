import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default function MediaEditorPage() {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Advanced Media Editor
      </Typography>
      <Typography color="textSecondary">
        Coming Soon: Image editor, video trimming, audio mixing, and watermarking
      </Typography>
    </Paper>
  );
}
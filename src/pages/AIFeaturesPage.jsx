import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default function AIFeaturesPage() {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        AI/ML Powered Features
      </Typography>
      <Typography color="textSecondary">
        Coming Soon: Auto-generate captions, speech-to-text, auto-suggest lyrics, image recognition, and smart cue points
      </Typography>
    </Paper>
  );
}
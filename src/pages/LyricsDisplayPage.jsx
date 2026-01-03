import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default function LyricsDisplayPage() {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Smart Lyrics Display
      </Typography>
      <Typography color="textSecondary">
        Coming Soon: Auto line-by-line display, chord display, multi-language lyrics, and karaoke mode
      </Typography>
    </Paper>
  );
}
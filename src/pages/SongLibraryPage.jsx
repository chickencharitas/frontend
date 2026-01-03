import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default function SongLibraryPage() {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Song Library & Lyrics Sync
      </Typography>
      <Typography color="textSecondary">
        Coming Soon: Song database integration, auto-download lyrics, chord charts, and set builder
      </Typography>
    </Paper>
  );
}
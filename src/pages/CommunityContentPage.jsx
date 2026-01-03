import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default function CommunityContentPage() {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Community & Content Marketplace
      </Typography>
      <Typography color="textSecondary">
        Coming Soon: Template marketplace, background/music library, community sharing, sermon database, and plug-and-play series
      </Typography>
    </Paper>
  );
}
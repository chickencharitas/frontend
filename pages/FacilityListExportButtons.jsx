import React from 'react';
import { Button, Stack } from '@mui/material';
import { exportFacilitiesToCSV, exportFacilitiesToPDF } from '../utils/exportUtils';

export default function FacilityListExportButtons({ facilities }) {
  return (
    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
      <Button onClick={() => exportFacilitiesToCSV(facilities)} variant="outlined">Export CSV</Button>
      <Button onClick={() => exportFacilitiesToPDF(facilities)} variant="outlined">Export PDF</Button>
    </Stack>
  );
}
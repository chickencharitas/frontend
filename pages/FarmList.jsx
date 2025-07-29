import React from 'react';
import { Card, CardContent, Typography, Button, Grid, Box, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { searchFarms, createFarm } from '../services/farmService';
import FarmFormDialog from './FarmFormDialog';

export default function FarmList({ onSelect }) {
  const [farms, setFarms] = React.useState([]);
  const [open, setOpen] = React.useState(false);

  const fetchFarms = async () => setFarms(await searchFarms(''));

  React.useEffect(() => { fetchFarms(); }, []);

  return (
    <Box>
      <Paper sx={{ mb: 2, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Farms</Typography>
        <Button startIcon={<AddIcon />} variant="contained" onClick={() => setOpen(true)}>
          Add Farm
        </Button>
      </Paper>
      <Grid container spacing={2}>
        {farms.map(farm => (
          <Grid item xs={12} sm={6} md={4} key={farm.id}>
            <Card variant="outlined" sx={{ cursor: 'pointer' }} onClick={() => onSelect && onSelect(farm)}>
              <CardContent>
                <Typography variant="h6">{farm.name}</Typography>
                <Typography variant="body2" color="text.secondary">{farm.location}</Typography>
                <Typography variant="body2">{farm.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <FarmFormDialog open={open} onClose={() => setOpen(false)} onCreated={fetchFarms} />
    </Box>
  );
}
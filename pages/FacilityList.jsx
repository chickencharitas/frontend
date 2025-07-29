import React from 'react';
import { Card, CardContent, Typography, Button, Grid, Box, Paper, Chip, Checkbox, Toolbar, Fade } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FacilityFormDialog from './FacilityFormDialog';
import { searchFacilities, deleteFacility } from '../services/farmService';

export default function FacilityList({ farm }) {
  const [facilities, setFacilities] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState([]);

  const fetchFacilities = async () => {
    if (farm) setFacilities(await searchFacilities({ query: '', farmId: farm.id }));
  };

  React.useEffect(() => { fetchFacilities(); }, [farm]);

  if (!farm) return <Paper sx={{ p: 2 }}>Select a farm to view facilities.</Paper>;

  const handleSelect = id => setSelected(sel =>
    sel.includes(id) ? sel.filter(x => x !== id) : [...sel, id]
  );

  const handleBulkDelete = async () => {
    await Promise.all(selected.map(deleteFacility));
    setSelected([]);
    fetchFacilities();
  };

  return (
    <Box>
      <Paper sx={{ mb: 2, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Facilities for {farm.name}</Typography>
        <Button startIcon={<AddIcon />} variant="contained" onClick={() => setOpen(true)}>
          Add Facility
        </Button>
      </Paper>
      <Fade in={selected.length > 0}>
        <Toolbar sx={{ position: 'sticky', top: 0, zIndex: 1, bgcolor: 'background.paper' }}>
          <Typography sx={{ flex: 1 }}>{selected.length} selected</Typography>
          <Button color="error" onClick={handleBulkDelete}>Delete</Button>
        </Toolbar>
      </Fade>
      <Grid container spacing={2}>
        {facilities.map(facility => (
          <Grid item xs={12} sm={6} md={4} key={facility.id}>
            <Card variant={selected.includes(facility.id) ? "elevation" : "outlined"}>
              <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  checked={selected.includes(facility.id)}
                  onChange={() => handleSelect(facility.id)}
                />
                <Box sx={{ flex: 1, cursor: 'pointer' }}>
                  <Typography variant="h6">{facility.name}</Typography>
                  <Chip label={facility.type} size="small" sx={{ mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">Capacity: {facility.capacity}</Typography>
                  <Typography variant="body2">{facility.description}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <FacilityFormDialog open={open} farm={farm} onClose={() => setOpen(false)} onCreated={fetchFacilities} />
    </Box>
  );
}
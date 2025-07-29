import React, { useState } from 'react';
import { Paper, Card, CardContent, Typography, Grid, Button, Stack, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FlockFormDialog from './FlockFormDialog';
import FlockMergeSplitDialog from './FlockMergeSplitDialog';
import { getFlocks } from '../services/chickenService';

export default function FlockList({ farm }) {
  const [flocks, setFlocks] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [mergeSplitOpen, setMergeSplitOpen] = useState(false);

  const fetchFlocks = async () => setFlocks(await getFlocks({ farm_id: farm?.id }));

  React.useEffect(() => { fetchFlocks(); }, [farm]);

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Flocks</Typography>
        <Button startIcon={<AddIcon />} variant="contained" onClick={() => setOpen(true)}>Add Flock</Button>
      </Stack>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {flocks.map(flock => (
          <Grid item xs={12} sm={6} md={4} key={flock.id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">{flock.name}</Typography>
                <Chip label={`Facility: ${flock.facility_id || 'N/A'}`} variant="outlined" sx={{ mt: 1 }} />
                <Typography variant="body2">{flock.description}</Typography>
                <Typography variant="caption">Created: {new Date(flock.created_at).toLocaleDateString()}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button variant="contained" onClick={() => setMergeSplitOpen(true)}>
          Merge/Split
        </Button>
      </Stack>
      <FlockFormDialog open={open} farm={farm} onClose={() => setOpen(false)} onCreated={fetchFlocks} />
      <FlockMergeSplitDialog open={mergeSplitOpen} onClose={() => setMergeSplitOpen(false)} />
    </Paper>
  );
}
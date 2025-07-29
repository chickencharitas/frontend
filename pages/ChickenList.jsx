import React from 'react';
import { Paper, Card, CardContent, Typography, Grid, Box, Button, Chip, Stack, Avatar, InputAdornment, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ChickenRegistrationDialog from './ChickenRegistrationDialog';
import BulkChickenImportDialog from './BulkChickenImportDialog';
import { getChickens } from '../services/chickenService';

export default function ChickenList({ farm, facility }) {
  const [chickens, setChickens] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [openReg, setOpenReg] = React.useState(false);
  const [importOpen, setImportOpen] = React.useState(false);

  const fetchChickens = React.useCallback(async () => {
    setChickens(await getChickens({
      search,
      farm_id: farm?.id,
      facility_id: facility?.id,
      alive: true
    }));
  }, [search, farm, facility]);

  React.useEffect(() => { fetchChickens(); }, [fetchChickens]);

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h5">Chickens</Typography>
          <TextField
            size="small"
            placeholder="Search tag or name"
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>
            }}
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ minWidth: 200 }}
          />
        </Stack>
        <Stack direction="row" spacing={2}>
          <Button startIcon={<AddIcon />} variant="contained" onClick={() => setOpenReg(true)}>Register Chicken</Button>
          <Button variant="contained" onClick={() => setImportOpen(true)}>Import</Button>
        </Stack>
      </Paper>
      <Grid container spacing={2}>
        {chickens.map(chicken => (
          <Grid item xs={12} sm={6} md={4} key={chicken.id}>
            <Card variant="outlined">
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: chicken.sex === 'Male' ? 'blue.300' : 'pink.300', width: 56, height: 56 }}>
                    {chicken.sex?.[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{chicken.name || chicken.unique_tag}</Typography>
                    <Typography variant="caption" color="text.secondary">{chicken.unique_tag}</Typography>
                    <Typography variant="body2">{chicken.breed_name}</Typography>
                    <Chip label={chicken.sex} size="small" color={chicken.sex === 'Male' ? 'primary' : 'secondary'} sx={{ mt: 1 }} />
                  </Box>
                </Stack>
                <Typography variant="body2" sx={{ mt: 2 }}>Hatched: {chicken.hatch_date}</Typography>
                <Typography variant="body2">Status: {chicken.health_status}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <ChickenRegistrationDialog open={openReg} onClose={() => setOpenReg(false)} onRegistered={fetchChickens} farm={farm} facility={facility} />
      <BulkChickenImportDialog open={importOpen} onClose={() => setImportOpen(false)} />
    </Box>
  );
}
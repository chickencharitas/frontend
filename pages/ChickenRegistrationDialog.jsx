import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, MenuItem, Autocomplete } from '@mui/material';
import { createChicken, searchBreeds } from '../services/chickenService';

const SEXES = ['Male', 'Female', 'Unknown'];

export default function ChickenRegistrationDialog({ open, onClose, onRegistered, farm, facility }) {
  const [form, setForm] = React.useState({
    unique_tag: '', name: '', breed: null, sex: '', color: '', hatch_date: '', source: '', generation: '', genetic_line: '', weight: '', health_status: '', vaccination_status: '', notes: ''
  });
  const [breedOptions, setBreedOptions] = React.useState([]);

  React.useEffect(() => { setForm(f => ({ ...f, unique_tag: '', name: '', breed: null, sex: '', color: '', hatch_date: '', source: '', generation: '', genetic_line: '', weight: '', health_status: '', vaccination_status: '', notes: '' })); }, [open]);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleBreedInput = async (v) => {
    setBreedOptions(await searchBreeds(v));
  };

  const handleSubmit = async () => {
    await createChicken({
      ...form,
      breed_id: form.breed?.id || null,
      farm_id: farm?.id || null,
      facility_id: facility?.id || null,
      weight: form.weight ? Number(form.weight) : null
    });
    onRegistered && onRegistered();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Register New Chicken</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField name="unique_tag" label="Unique Tag" value={form.unique_tag} onChange={handleChange} required autoFocus />
          <TextField name="name" label="Name" value={form.name} onChange={handleChange} />
          <Autocomplete
            options={breedOptions}
            getOptionLabel={opt => opt?.name || ''}
            value={form.breed}
            onChange={(e, v) => setForm(f => ({ ...f, breed: v }))}
            onInputChange={(e, v) => handleBreedInput(v)}
            renderInput={params => <TextField {...params} label="Breed" />}
          />
          <TextField select name="sex" label="Sex" value={form.sex} onChange={handleChange}>
            {SEXES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
          <TextField name="color" label="Color" value={form.color} onChange={handleChange} />
          <TextField name="hatch_date" label="Hatch Date" type="date" value={form.hatch_date} onChange={handleChange} InputLabelProps={{ shrink: true }} />
          <TextField name="source" label="Source" value={form.source} onChange={handleChange} />
          <TextField name="generation" label="Generation" value={form.generation} onChange={handleChange} />
          <TextField name="genetic_line" label="Genetic Line" value={form.genetic_line} onChange={handleChange} />
          <TextField name="weight" label="Weight (g)" type="number" value={form.weight} onChange={handleChange} />
          <TextField name="health_status" label="Health Status" value={form.health_status} onChange={handleChange} />
          <TextField name="vaccination_status" label="Vaccination Status" value={form.vaccination_status} onChange={handleChange} />
          <TextField name="notes" label="Notes" value={form.notes} onChange={handleChange} multiline rows={2} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!form.unique_tag}>Register</Button>
      </DialogActions>
    </Dialog>
  );
}
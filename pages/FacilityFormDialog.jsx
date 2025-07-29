import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, MenuItem } from '@mui/material';
import { createFacility } from '../services/farmService';

const FACILITY_TYPES = [
  "Breeding Pen", "Hatchery", "Grow-out House", "Quarantine", "Brooder", "Other"
];

export default function FacilityFormDialog({ open, onClose, farm, onCreated }) {
  const [form, setForm] = React.useState({
    name: '', type: '', capacity: '', description: ''
  });

  React.useEffect(() => {
    if (!open) setForm({ name: '', type: '', capacity: '', description: '' });
  }, [open]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    await createFacility({ ...form, farmId: farm.id, capacity: form.capacity ? Number(form.capacity) : null });
    onCreated && onCreated();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Facility</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField name="name" label="Facility Name" value={form.name} onChange={handleChange} required autoFocus />
          <TextField select name="type" label="Type" value={form.type} onChange={handleChange} required>
            {FACILITY_TYPES.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
          </TextField>
          <TextField name="capacity" label="Capacity" type="number" value={form.capacity} onChange={handleChange} />
          <TextField name="description" label="Description" value={form.description} onChange={handleChange} multiline rows={2} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!form.name || !form.type}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}
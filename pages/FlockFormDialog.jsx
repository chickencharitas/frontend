import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack } from '@mui/material';
import { createFlock } from '../services/chickenService';

export default function FlockFormDialog({ open, onClose, onCreated, farm }) {
  const [form, setForm] = React.useState({ name: '', description: '', facility_id: '' });

  React.useEffect(() => { if (!open) setForm({ name: '', description: '', facility_id: '' }); }, [open]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    await createFlock({ ...form, farm_id: farm.id });
    onCreated && onCreated();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Flock</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField name="name" label="Flock Name" value={form.name} onChange={handleChange} required autoFocus />
          <TextField name="description" label="Description" value={form.description} onChange={handleChange} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!form.name}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}
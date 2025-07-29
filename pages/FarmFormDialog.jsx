import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack } from '@mui/material';
import { createFarm } from '../services/farmService';

export default function FarmFormDialog({ open, onClose, onCreated }) {
  const [form, setForm] = React.useState({ name: '', location: '', description: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    await createFarm(form);
    onCreated && onCreated();
    onClose();
    setForm({ name: '', location: '', description: '' });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Farm</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField name="name" label="Farm Name" value={form.name} onChange={handleChange} required autoFocus />
          <TextField name="location" label="Location" value={form.location} onChange={handleChange} />
          <TextField name="description" label="Description" value={form.description} onChange={handleChange} multiline rows={2} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!form.name}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}
import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Grid, Paper, Button, Stack, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { getBreedingGroups, createBreedingGroup } from "../services/breedingService";

export default function BreedingGroupList({ farm, onSelect }) {
  const [groups, setGroups] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });

  useEffect(() => {
    if (farm) getBreedingGroups({ farm_id: farm.id }).then(setGroups);
  }, [farm]);

  const handleAdd = async () => {
    await createBreedingGroup({ ...form, farm_id: farm.id });
    setOpen(false);
    setForm({ name: "", description: "" });
    getBreedingGroups({ farm_id: farm.id }).then(setGroups);
  };

  return (
    <Paper sx={{ mb: 2, p: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5">Breeding Groups</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Add Group</Button>
      </Stack>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {groups.map(g => (
          <Grid item xs={12} sm={6} md={4} key={g.id}>
            <Card sx={{ cursor: "pointer" }} onClick={() => onSelect && onSelect(g)} variant="outlined">
              <CardContent>
                <Typography variant="h6">{g.name}</Typography>
                <Typography variant="body2">{g.description}</Typography>
                <Chip label={`Created: ${new Date(g.created_at).toLocaleDateString()}`} size="small" sx={{ mt: 1 }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Breeding Group</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Group Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <TextField label="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} multiline rows={2} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd} disabled={!form.name}>Add</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
import React, { useEffect, useState } from "react";
import { Paper, Box, Typography, TextField, Stack, Button, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { getLocations, createLocation } from "../services/inventoryService";
import { Autocomplete } from "@mui/material";
import { getFarms } from "../services/farmService"; // Assume you have this

export default function InventoryLocations() {
  const [locations, setLocations] = useState([]);
  const [open, setOpen] = useState(false);
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });

  useEffect(() => { getFarms().then(setFarms); }, []);
  useEffect(() => {
    if (selectedFarm) getLocations({ farm_id: selectedFarm.id }).then(setLocations);
    else setLocations([]);
  }, [selectedFarm]);

  const handleAdd = async () => {
    await createLocation({ ...form, farm_id: selectedFarm.id });
    setOpen(false);
    setForm({ name: "", description: "" });
    getLocations({ farm_id: selectedFarm.id }).then(setLocations);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Inventory Locations</Typography>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Autocomplete
          options={farms}
          getOptionLabel={opt => opt?.name || ""}
          value={selectedFarm}
          onChange={(_, v) => setSelectedFarm(v)}
          renderInput={params => <TextField {...params} label="Select Farm" />}
          sx={{ width: 250 }}
        />
        <Button variant="contained" onClick={() => setOpen(true)} disabled={!selectedFarm}>Add Location</Button>
      </Stack>
      <List>
        {locations.map(loc => (
          <ListItem key={loc.id} sx={{ borderBottom: "1px solid #eee" }}>
            <ListItemText
              primary={loc.name}
              secondary={loc.description}
            />
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Inventory Location</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} autoFocus />
            <TextField label="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} multiline />
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
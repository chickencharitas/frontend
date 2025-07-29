import React, { useEffect, useState } from "react";
import { Paper, Typography, TextField, Stack, Button, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, Chip, InputAdornment } from "@mui/material";
import { getInventory, addBatch, getItems, getLocations, addStockMovement } from "../services/inventoryService";
import { Autocomplete } from "@mui/material";

export default function InventoryBatches() {
  const [batches, setBatches] = useState([]);
  const [locations, setLocations] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ item: null, quantity: "", unit: "", batch_code: "", expiry_date: "", lot_number: "" });

  useEffect(() => { getLocations({}).then(setLocations); getItems({}).then(setItems); }, []);
  useEffect(() => {
    if (selectedLocation) getInventory({ location_id: selectedLocation.id }).then(setBatches);
    else setBatches([]);
  }, [selectedLocation]);

  const handleAdd = async () => {
    await addBatch({
      item_id: form.item.id,
      location_id: selectedLocation.id,
      quantity: form.quantity,
      unit: form.unit,
      batch_code: form.batch_code,
      expiry_date: form.expiry_date,
      lot_number: form.lot_number
    });
    setOpen(false);
    setForm({ item: null, quantity: "", unit: "", batch_code: "", expiry_date: "", lot_number: "" });
    getInventory({ location_id: selectedLocation.id }).then(setBatches);
  };

  // Batch transfer example (basic)
  const handleTransfer = async (batch) => {
    const toLoc = prompt("Enter target location name");
    const loc = locations.find(l => l.name === toLoc);
    if (!loc) return alert("Location not found");
    await addStockMovement({
      batch_id: batch.id,
      movement_type: "transfer",
      quantity: batch.quantity,
      from_location_id: batch.location_id,
      to_location_id: loc.id,
      notes: "Manual transfer"
    });
    getInventory({ location_id: selectedLocation.id }).then(setBatches);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Inventory Batches</Typography>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Autocomplete
          options={locations}
          getOptionLabel={opt => opt?.name || ""}
          value={selectedLocation}
          onChange={(_, v) => setSelectedLocation(v)}
          renderInput={params => <TextField {...params} label="Location" />}
          sx={{ width: 250 }}
        />
        <Button variant="contained" onClick={() => setOpen(true)} disabled={!selectedLocation}>Add Batch</Button>
      </Stack>
      <List>
        {batches.map(batch => (
          <ListItem key={batch.id} sx={{ borderBottom: "1px solid #eee" }}>
            <ListItemText
              primary={
                <>
                  {batch.item_name} <Chip label={batch.batch_code || batch.lot_number || batch.id} size="small" sx={{ ml: 1 }} />
                  <span style={{ marginLeft: 8 }}>
                    Quantity: <strong>{batch.quantity}</strong> {batch.unit || batch.item_unit}
                  </span>
                  {batch.expiry_date && (
                    <Chip
                      label={`Expires ${batch.expiry_date}`}
                      color={new Date(batch.expiry_date) < new Date(Date.now() + 1000 * 60 * 60 * 24 * 14) ? "error" : "default"}
                      size="small"
                      sx={{ ml: 2 }}
                    />
                  )}
                </>
              }
              secondary={batch.sku}
            />
            <Button size="small" onClick={() => handleTransfer(batch)}>Transfer</Button>
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Inventory Batch</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Autocomplete
              options={items}
              getOptionLabel={opt => opt?.name || ""}
              value={form.item}
              onChange={(_, v) => setForm(f => ({ ...f, item: v }))}
              renderInput={params => <TextField {...params} label="Item" />}
            />
            <TextField
              label="Quantity"
              type="number"
              value={form.quantity}
              onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
              InputProps={{
                endAdornment: <InputAdornment position="end">{form.item?.unit}</InputAdornment>
              }}
            />
            <TextField label="Unit" value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} />
            <TextField label="Batch Code" value={form.batch_code} onChange={e => setForm(f => ({ ...f, batch_code: e.target.value }))} />
            <TextField label="Lot Number" value={form.lot_number} onChange={e => setForm(f => ({ ...f, lot_number: e.target.value }))} />
            <TextField label="Expiry Date" type="date" value={form.expiry_date} onChange={e => setForm(f => ({ ...f, expiry_date: e.target.value }))} InputLabelProps={{ shrink: true }} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd} disabled={!form.item || !form.quantity}>Add</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
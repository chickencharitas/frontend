import React, { useEffect, useState } from "react";
import { Paper, Box, Typography, TextField, Stack, Button, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, Chip } from "@mui/material";
import { getItems, createItem, getItemTypes, createItemType } from "../services/inventoryService";
import { Autocomplete } from "@mui/material";

export default function InventoryItems() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [typeDialog, setTypeDialog] = useState(false);
  const [types, setTypes] = useState([]);
  const [form, setForm] = useState({ sku: "", name: "", type: null, unit: "", conversion_factor: 1, description: "" });
  const [typeForm, setTypeForm] = useState({ name: "" });

  useEffect(() => { getItems({}).then(setItems); getItemTypes("").then(setTypes); }, []);

  const handleAdd = async () => {
    let type_id = form.type?.id;
    if (!type_id && form.type?.inputValue) {
      const newType = await createItemType({ name: form.type.inputValue });
      type_id = newType.id;
    }
    await createItem({ ...form, type_id });
    setOpen(false);
    setForm({ sku: "", name: "", type: null, unit: "", conversion_factor: 1, description: "" });
    getItems({}).then(setItems);
  };

  const handleAddType = async () => {
    await createItemType(typeForm);
    setTypeDialog(false);
    setTypeForm({ name: "" });
    getItemTypes("").then(setTypes);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Inventory Items</Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => setOpen(true)}>Add Item</Button>
        <Button variant="outlined" onClick={() => setTypeDialog(true)}>Manage Types</Button>
      </Stack>
      <List>
        {items.map(item => (
          <ListItem key={item.id} sx={{ borderBottom: "1px solid #eee" }}>
            <ListItemText
              primary={<>{item.name} <Chip label={item.sku} size="small" sx={{ ml: 1 }} /></>}
              secondary={
                <>
                  <span>Type: {item.type_name || "—"} | Unit: {item.unit}</span>
                  {item.description && <><br />{item.description}</>}
                </>
              }
            />
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Inventory Item</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="SKU" value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} autoFocus />
            <TextField label="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <Autocomplete
              options={types}
              freeSolo
              getOptionLabel={opt => opt?.name || opt?.inputValue || ""}
              value={form.type}
              onChange={(_, v) => setForm(f => ({ ...f, type: v }))}
              renderInput={params => <TextField {...params} label="Type" />}
            />
            <TextField label="Unit" value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} />
            <TextField label="Conversion Factor" type="number" value={form.conversion_factor} onChange={e => setForm(f => ({ ...f, conversion_factor: e.target.value }))} />
            <TextField label="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} multiline />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd} disabled={!form.name || !form.sku}>Add</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={typeDialog} onClose={() => setTypeDialog(false)}>
        <DialogTitle>Manage Item Types</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Type Name" value={typeForm.name} onChange={e => setTypeForm(f => ({ ...f, name: e.target.value }))} />
            <Button onClick={handleAddType} variant="contained" disabled={!typeForm.name}>Add Type</Button>
            {types.map(t => <Chip key={t.id} label={t.name} sx={{ mr: 1, mt: 1 }} />)}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTypeDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
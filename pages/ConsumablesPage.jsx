import React, { useEffect, useState } from "react";
import {
  Paper, Typography, Button, Stack, TextField, List, ListItem,
  ListItemText, Chip, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem
} from "@mui/material";
import { getConsumables, addConsumable, updateConsumableStock } from "../services/inventoryService";
import ConsumableExportButton from "../components/ConsumableExportButton"; // Ensure this exists

const CONSUMABLE_TYPES = [
  { value: "feed", label: "Feed" },
  { value: "vaccine", label: "Vaccine" },
  { value: "medicine", label: "Medicine" },
  { value: "bedding", label: "Bedding" },
  { value: "other", label: "Other" }
];

export default function ConsumablesPage() {
  const [consumables, setConsumables] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [restock, setRestock] = useState({ open: false, item: null, quantity: "" });
  const [form, setForm] = useState({
    name: "", type: "feed", quantity: "", unit: "", reorder_level: "", notes: ""
  });

  useEffect(() => {
    getConsumables({ search }).then(setConsumables);
  }, [search, open, restock.open]);

  const handleAdd = async () => {
    await addConsumable(form);
    setOpen(false);
    setForm({ name: "", type: "feed", quantity: "", unit: "", reorder_level: "", notes: "" });
  };

  const handleRestock = async () => {
    await updateConsumableStock({ id: restock.item.id, quantity: restock.quantity });
    setRestock({ open: false, item: null, quantity: "" });
  };

  const isLow = (c) => Number(c.quantity) <= Number(c.reorder_level);

  return (
    <Paper sx={{ p: { xs: 1, sm: 3 } }}>
      <Typography variant="h5" gutterBottom>Consumables</Typography>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems="stretch"
        sx={{ mb: 2 }}
      >
        <TextField fullWidth label="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button fullWidth variant="contained" onClick={() => setOpen(true)}>Add Consumable</Button>
        <ConsumableExportButton />
      </Stack>

      <List>
        {consumables.map((c) => (
          <ListItem key={c.id} sx={{ borderBottom: "1px solid #eee" }}>
            <ListItemText
              primary={<>{c.name} <Chip label={c.type} size="small" sx={{ ml: 1 }} /></>}
              secondary={
                <>
                  <span>Qty: {c.quantity} {c.unit} | Reorder: {c.reorder_level}</span>
                  <br />
                  {c.notes}
                </>
              }
            />
            <Stack direction="row" spacing={1}>
              <Chip label={isLow(c) ? "Low" : "OK"} color={isLow(c) ? "error" : "primary"} size="small" />
              <Button
                variant="outlined"
                size="small"
                onClick={() => setRestock({ open: true, item: c, quantity: c.quantity })}
              >
                Update
              </Button>
            </Stack>
          </ListItem>
        ))}
      </List>

      {/* Add Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Consumable</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              value={form.name}
              onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
              autoFocus
            />
            <TextField
              label="Type"
              select
              value={form.type}
              onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))}
            >
              {CONSUMABLE_TYPES.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Quantity"
              type="number"
              value={form.quantity}
              onChange={(e) => setForm(f => ({ ...f, quantity: e.target.value }))}
            />
            <TextField
              label="Unit"
              value={form.unit}
              onChange={(e) => setForm(f => ({ ...f, unit: e.target.value }))}
            />
            <TextField
              label="Reorder Level"
              type="number"
              value={form.reorder_level}
              onChange={(e) => setForm(f => ({ ...f, reorder_level: e.target.value }))}
            />
            <TextField
              label="Notes"
              value={form.notes}
              onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
              multiline
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAdd}
            variant="contained"
            disabled={!form.name || !form.type || !form.quantity}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Restock Dialog */}
      <Dialog open={restock.open} onClose={() => setRestock({ open: false, item: null, quantity: "" })} maxWidth="xs" fullWidth>
        <DialogTitle>Update Stock: {restock.item?.name}</DialogTitle>
        <DialogContent>
          <TextField
            label="Quantity"
            type="number"
            value={restock.quantity}
            onChange={(e) => setRestock(r => ({ ...r, quantity: e.target.value }))}
            fullWidth
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRestock({ open: false, item: null, quantity: "" })}>Cancel</Button>
          <Button
            onClick={handleRestock}
            variant="contained"
            disabled={!restock.quantity}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

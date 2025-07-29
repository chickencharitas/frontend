import React, { useEffect, useState } from "react";
import { Paper, Typography, Button, Stack, TextField, List, ListItem, ListItemText, Chip, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { getFeedBatches, addFeedBatch } from "../services/feedingService";

export default function FeedBatchPage() {
  const [batches, setBatches] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    supplier: "",
    received_date: "",
    quantity: "",
    unit: "",
    cost: "",
    expiry_date: "",
    notes: ""
  });

  useEffect(() => { getFeedBatches().then(setBatches); }, [open]);

  const handleAdd = async () => {
    await addFeedBatch(form);
    setOpen(false);
    setForm({ name: "", supplier: "", received_date: "", quantity: "", unit: "", cost: "", expiry_date: "", notes: "" });
    getFeedBatches().then(setBatches);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Feed Batches</Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => setOpen(true)}>Add Feed Batch</Button>
      </Stack>
      <List>
        {batches.map(b => (
          <ListItem key={b.id} sx={{ borderBottom: "1px solid #eee" }}>
            <ListItemText
              primary={`${b.name} (${b.supplier || "Unknown"})`}
              secondary={
                <>
                  <span>Qty: {b.quantity} {b.unit} | Received: {b.received_date} | Expires: {b.expiry_date || "N/A"}</span>
                  <br />
                  {b.notes}
                </>
              }
            />
            <Chip label={`$${b.cost || 0}`} size="small" sx={{ ml: 2 }} />
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Feed Batch</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Batch Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} autoFocus />
            <TextField label="Supplier" value={form.supplier} onChange={e => setForm(f => ({ ...f, supplier: e.target.value }))} />
            <TextField label="Received Date" type="date" value={form.received_date} onChange={e => setForm(f => ({ ...f, received_date: e.target.value }))} InputLabelProps={{ shrink: true }} />
            <TextField label="Quantity" type="number" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} />
            <TextField label="Unit" value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} />
            <TextField label="Cost" type="number" value={form.cost} onChange={e => setForm(f => ({ ...f, cost: e.target.value }))} />
            <TextField label="Expiry Date" type="date" value={form.expiry_date} onChange={e => setForm(f => ({ ...f, expiry_date: e.target.value }))} InputLabelProps={{ shrink: true }} />
            <TextField label="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} multiline />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd} disabled={!form.name || !form.received_date || !form.quantity}>Add</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
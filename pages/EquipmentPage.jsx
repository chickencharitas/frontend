import React, { useEffect, useState } from "react";
import { Paper, Typography, Button, Stack, TextField, List, ListItem, ListItemText, Chip, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem } from "@mui/material";
import { getEquipment, addEquipment, updateEquipmentStatus } from "../services/inventoryService";

const EQUIPMENT_TYPES = [
  { value: "incubator", label: "Incubator" },
  { value: "feeder", label: "Feeder" },
  { value: "waterer", label: "Waterer" },
  { value: "tool", label: "Tool" },
  { value: "other", label: "Other" }
];
const STATUS_OPTIONS = [
  { value: "available", label: "Available" },
  { value: "in-use", label: "In Use" },
  { value: "maintenance", label: "Maintenance" },
  { value: "retired", label: "Retired" }
];

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [statusDialog, setStatusDialog] = useState({ open: false, item: null, status: "" });
  const [form, setForm] = useState({
    name: "", type: "incubator", status: "available", purchase_date: "", location: "", assigned_to: "", notes: ""
  });

  useEffect(() => { getEquipment({ search }).then(setEquipment); }, [search, open, statusDialog.open]);

  const handleAdd = async () => {
    await addEquipment(form);
    setOpen(false);
    setForm({ name: "", type: "incubator", status: "available", purchase_date: "", location: "", assigned_to: "", notes: "" });
    getEquipment({ search }).then(setEquipment);
  };
  const handleStatus = async () => {
    await updateEquipmentStatus({ id: statusDialog.item.id, status: statusDialog.status });
    setStatusDialog({ open: false, item: null, status: "" });
    getEquipment({ search }).then(setEquipment);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Equipment</Typography>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <TextField label="Search" value={search} onChange={e => setSearch(e.target.value)} />
        <Button variant="contained" onClick={() => setOpen(true)}>Add Equipment</Button>
      </Stack>
      <List>
        {equipment.map(e => (
          <ListItem key={e.id} sx={{ borderBottom: "1px solid #eee" }}>
            <ListItemText
              primary={<>{e.name} <Chip label={e.type} size="small" sx={{ ml: 1 }} /></>}
              secondary={
                <>
                  <span>Status: {e.status} | Location: {e.location} | Assigned: {e.assigned_to}</span>
                  <br />
                  {e.notes}
                </>
              }
            />
            <Stack direction="row" spacing={1}>
              <Chip
                label={STATUS_OPTIONS.find(opt => opt.value === e.status)?.label || e.status}
                color={e.status === "maintenance" ? "warning" : e.status === "retired" ? "default" : "primary"}
                size="small"
              />
              <Button variant="outlined" size="small" onClick={() => setStatusDialog({ open: true, item: e, status: e.status })}>Change Status</Button>
            </Stack>
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Equipment</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} autoFocus />
            <TextField label="Type" select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              {EQUIPMENT_TYPES.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
            </TextField>
            <TextField label="Status" select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              {STATUS_OPTIONS.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
            </TextField>
            <TextField label="Purchase Date" type="date" value={form.purchase_date} onChange={e => setForm(f => ({ ...f, purchase_date: e.target.value }))} InputLabelProps={{ shrink: true }} />
            <TextField label="Location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
            <TextField label="Assigned To" value={form.assigned_to} onChange={e => setForm(f => ({ ...f, assigned_to: e.target.value }))} />
            <TextField label="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} multiline />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained" disabled={!form.name || !form.type}>Add</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={statusDialog.open} onClose={() => setStatusDialog({ open: false, item: null, status: "" })}>
        <DialogTitle>Change Status: {statusDialog.item?.name}</DialogTitle>
        <DialogContent>
          <TextField
            label="Status"
            select
            value={statusDialog.status}
            onChange={e => setStatusDialog(s => ({ ...s, status: e.target.value }))}
            autoFocus
          >
            {STATUS_OPTIONS.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialog({ open: false, item: null, status: "" })}>Cancel</Button>
          <Button onClick={handleStatus} variant="contained" disabled={!statusDialog.status}>Update</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
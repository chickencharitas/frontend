import React, { useEffect, useState } from "react";
import { Paper, Typography, Button, Stack, TextField, List, ListItem, ListItemText, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Autocomplete, Tabs, Tab } from "@mui/material";
import { getPartners, createPartner } from "../services/financeService";

export default function PartnersPage() {
  const [type, setType] = useState("customer");
  const [partners, setPartners] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });

  useEffect(() => {
    getPartners({ type, search }).then(setPartners);
  }, [type, search]);

  const handleAdd = async () => {
    await createPartner({ type, ...form });
    setOpen(false);
    setForm({ name: "", email: "", phone: "", address: "" });
    getPartners({ type, search }).then(setPartners);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Tabs value={type} onChange={(_, v) => setType(v)}>
          <Tab label="Customers" value="customer" />
          <Tab label="Suppliers" value="supplier" />
        </Tabs>
        <TextField label="Search" value={search} onChange={e => setSearch(e.target.value)} sx={{ ml: 2 }} />
        <Button variant="contained" onClick={() => setOpen(true)}>Add {type === "customer" ? "Customer" : "Supplier"}</Button>
      </Stack>
      <List>
        {partners.map(p => (
          <ListItem key={p.id} sx={{ borderBottom: "1px solid #eee" }}>
            <ListItemText
              primary={<>{p.name} <Chip label={p.type} size="small" sx={{ ml: 1 }} /></>}
              secondary={
                <>
                  <span>{p.phone || ""}{p.email ? ` | ${p.email}` : ""}</span>
                  <br />
                  <span>{p.address}</span>
                </>
              }
            />
            <Chip
              label={`Balance: ${Number(p.balance).toLocaleString(undefined, { style: "currency", currency: "USD" })}`}
              color={p.balance < 0 ? "error" : "primary"}
              size="small"
              sx={{ ml: 2 }}
            />
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add {type === "customer" ? "Customer" : "Supplier"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} autoFocus />
            <TextField label="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            <TextField label="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            <TextField label="Address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} multiline />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained" disabled={!form.name}>Add</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
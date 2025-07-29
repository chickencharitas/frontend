import React, { useEffect, useState } from "react";
import { Paper, Button, Stack, TextField, List, ListItem, ListItemText, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Autocomplete } from "@mui/material";
import { getPurchaseOrders, createPurchaseOrder, getPartners } from "../services/financeService";
import { format } from "date-fns";
import BatchPayDialog from "./BatchPayDialog";

export default function PurchasesPage() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [partners, setPartners] = useState([]);
  const [form, setForm] = useState({ partner: null, order_date: format(new Date(), "yyyy-MM-dd"), notes: "" });
  const [selected, setSelected] = useState([]);
  const [batchPayOpen, setBatchPayOpen] = useState(false);

  useEffect(() => {
    getPurchaseOrders({ search }).then(setOrders);
    getPartners({ type: "supplier" }).then(setPartners);
  }, [search]);

  const handleAdd = async () => {
    await createPurchaseOrder({ partner_id: form.partner.id, order_date: form.order_date, notes: form.notes });
    setOpen(false);
    setForm({ partner: null, order_date: format(new Date(), "yyyy-MM-dd"), notes: "" });
    getPurchaseOrders({ search }).then(setOrders);
  };

  const handleSelect = (order) => {
    setSelected(s =>
      s.includes(order) ? s.filter(x => x !== order) : [...s, order]
    );
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <TextField label="Search" value={search} onChange={e => setSearch(e.target.value)} />
        <Button variant="contained" onClick={() => setOpen(true)}>Add Purchase Order</Button>
        <Button
          variant="outlined"
          onClick={() => setBatchPayOpen(true)}
          disabled={selected.length === 0}
        >
          Batch Mark Paid
        </Button>
      </Stack>
      <List>
        {orders.map(o => (
          <ListItem
            key={o.id}
            sx={{ borderBottom: "1px solid #eee" }}
            selected={selected.includes(o)}
            onClick={() => handleSelect(o)}
            style={{ cursor: "pointer" }}
          >
            <ListItemText
              primary={
                <>
                  Order #{o.id} — {o.partner_name}
                  <Chip label={o.status} size="small" sx={{ ml: 1 }} color={o.status === "paid" ? "success" : o.status === "pending" ? "warning" : "default"} />
                </>
              }
              secondary={
                <>
                  <span>Date: {o.order_date}</span>
                  <br />
                  <span>Notes: {o.notes}</span>
                </>
              }
            />
            <Chip
              label={`Total: ${Number(o.total).toLocaleString(undefined, { style: "currency", currency: "USD" })}`}
              color="primary"
              size="small"
              sx={{ ml: 2 }}
            />
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Purchase Order</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Autocomplete
              options={partners}
              getOptionLabel={opt => opt?.name || ""}
              value={form.partner}
              onChange={(_, v) => setForm(f => ({ ...f, partner: v }))}
              renderInput={params => <TextField {...params} label="Supplier" />}
            />
            <TextField label="Order Date" type="date" value={form.order_date} onChange={e => setForm(f => ({ ...f, order_date: e.target.value }))} InputLabelProps={{ shrink: true }} />
            <TextField label="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} multiline />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained" disabled={!form.partner}>Add</Button>
        </DialogActions>
      </Dialog>
      <BatchPayDialog
        open={batchPayOpen}
        onClose={() => setBatchPayOpen(false)}
        orders={selected}
        orderType="purchase"
        onPaid={() => getPurchaseOrders({ search }).then(setOrders)}
      />
    </Paper>
  );
}
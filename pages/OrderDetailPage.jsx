import React, { useEffect, useState } from "react";
import { Paper, Typography, Box, Stack, Chip, Button, List, ListItem, ListItemText, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Autocomplete } from "@mui/material";
import { getSaleOrderItems, addSaleOrderItem, getPurchaseOrderItems, addPurchaseOrderItem, getPayments, addPayment, getOrderPaid } from "../services/financeService";
import { getItems } from "../services/inventoryService";

export default function OrderDetailPage({ order, type }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [addPay, setAddPay] = useState(false);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ item: null, description: "", quantity: 1, unit_price: 0 });
  const [payments, setPayments] = useState([]);
  const [payAmount, setPayAmount] = useState("");
  const [paid, setPaid] = useState(0);

  useEffect(() => {
    if (!order) return;
    if (type === "sale")
      getSaleOrderItems(order.id).then(setItems);
    else
      getPurchaseOrderItems(order.id).then(setItems);

    getItems({}).then(setProducts);
    getPayments({ order_type: type, order_id: order.id }).then(setPayments);
    getOrderPaid({ order_type: type, order_id: order.id }).then(r => setPaid(r.paid));
  }, [order, type]);

  const handleAdd = async () => {
    if (type === "sale")
      await addSaleOrderItem(order.id, { ...form, item_id: form.item.id });
    else
      await addPurchaseOrderItem(order.id, { ...form, item_id: form.item.id });
    setOpen(false);
    setForm({ item: null, description: "", quantity: 1, unit_price: 0 });
    if (type === "sale")
      getSaleOrderItems(order.id).then(setItems);
    else
      getPurchaseOrderItems(order.id).then(setItems);
  };

  const handlePay = async () => {
    await addPayment({ order_type: type, order_id: order.id, amount: payAmount });
    setAddPay(false);
    setPayAmount("");
    getPayments({ order_type: type, order_id: order.id }).then(setPayments);
    getOrderPaid({ order_type: type, order_id: order.id }).then(r => setPaid(r.paid));
  };

  const total = order?.total || 0;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {type === "sale" ? "Sale" : "Purchase"} Order #{order?.id}
        <Chip label={order?.status} size="small" sx={{ ml: 1 }} color={order?.status === "paid" ? "success" : order?.status === "pending" ? "warning" : "default"} />
      </Typography>
      <Typography>Partner: {order?.partner_name}</Typography>
      <Typography>Date: {order?.order_date}</Typography>
      <Typography>Total: {Number(total).toLocaleString(undefined, { style: "currency", currency: "USD" })}</Typography>
      <Typography>Paid: {Number(paid).toLocaleString(undefined, { style: "currency", currency: "USD" })}</Typography>
      <Typography>Balance: {(total - paid).toLocaleString(undefined, { style: "currency", currency: "USD" })}</Typography>
      <Box sx={{ mt: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Button variant="contained" onClick={() => setOpen(true)}>Add Item</Button>
          <Button variant="outlined" onClick={() => setAddPay(true)}>Add Payment</Button>
        </Stack>
        <Typography variant="h6">Items</Typography>
        <List>
          {items.map(it => (
            <ListItem key={it.id} sx={{ borderBottom: "1px solid #eee" }}>
              <ListItemText
                primary={`${it.description} (${it.quantity} × ${Number(it.unit_price).toLocaleString(undefined, { style: "currency", currency: "USD" })})`}
                secondary={<span>Total: {Number(it.total).toLocaleString(undefined, { style: "currency", currency: "USD" })}</span>}
              />
            </ListItem>
          ))}
        </List>
        <Typography variant="h6" sx={{ mt: 3 }}>Payments</Typography>
        <List>
          {payments.map(p => (
            <ListItem key={p.id}>
              <ListItemText
                primary={`$${Number(p.amount).toLocaleString()} on ${p.date?.substring(0,10) || ""}`}
                secondary={p.method ? `Method: ${p.method}` : ""}
              />
            </ListItem>
          ))}
        </List>
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Item</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Autocomplete
              options={products}
              getOptionLabel={opt => opt?.name || ""}
              value={form.item}
              onChange={(_, v) => setForm(f => ({ ...f, item: v }))}
              renderInput={params => <TextField {...params} label="Product" />}
            />
            <TextField label="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            <TextField label="Quantity" type="number" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} />
            <TextField label="Unit Price" type="number" value={form.unit_price} onChange={e => setForm(f => ({ ...f, unit_price: e.target.value }))} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained" disabled={!form.item || !form.quantity || !form.unit_price}>Add</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={addPay} onClose={() => setAddPay(false)}>
        <DialogTitle>Add Payment</DialogTitle>
        <DialogContent>
          <TextField
            label="Amount"
            type="number"
            value={payAmount}
            onChange={e => setPayAmount(e.target.value)}
            autoFocus
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddPay(false)}>Cancel</Button>
          <Button onClick={handlePay} variant="contained" disabled={!payAmount}>Add</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
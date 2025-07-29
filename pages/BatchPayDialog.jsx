import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField } from "@mui/material";
import { addPayment } from "../services/financeService";

export default function BatchPayDialog({ open, onClose, orders, orderType, onPaid }) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  async function handleBatchPay() {
    for (const order of orders) {
      await addPayment({ order_type: orderType, order_id: order.id, amount, notes: note });
    }
    setAmount("");
    setNote("");
    onPaid && onPaid();
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Batch Mark as Paid</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Amount per Order"
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            autoFocus
          />
          <TextField
            label="Payment Notes"
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleBatchPay} variant="contained" disabled={!amount}>Pay All</Button>
      </DialogActions>
    </Dialog>
  );
}
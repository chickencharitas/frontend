import React, { useEffect, useState } from "react";
import { Paper, Typography, Stack, TextField, Button, List, ListItem, ListItemText } from "@mui/material";
import { getWebhooks, addWebhook } from "../services/webhookService";

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState([]);
  const [form, setForm] = useState({ url: "", secret: "", event_type: "" });
  useEffect(() => { getWebhooks().then(setWebhooks); }, []);
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5">Alert Webhooks</Typography>
      <Stack direction="row" spacing={2}>
        <TextField label="URL" value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} />
        <TextField label="Secret" value={form.secret} onChange={e => setForm(f => ({ ...f, secret: e.target.value }))} />
        <TextField label="Event Type" value={form.event_type} onChange={e => setForm(f => ({ ...f, event_type: e.target.value }))} />
        <Button variant="contained" onClick={async () => { await addWebhook(form); setForm({ url: "", secret: "", event_type: "" }); getWebhooks().then(setWebhooks); }}>Add</Button>
      </Stack>
      <List>
        {webhooks.map(w => <ListItem key={w.id}><ListItemText primary={w.url} secondary={w.event_type} /></ListItem>)}
      </List>
    </Paper>
  );
}
import React, { useState } from "react";
import { Button, Stack, TextField, MenuItem } from "@mui/material";

const CONDITIONS = [
  { value: "low_inventory", label: "If stock is low" },
  { value: "overdue_task", label: "If task is overdue" },
  { value: "temperature_above", label: "If temperature above threshold" }
];
const ACTIONS = [
  { value: "send_email", label: "Send Email" },
  { value: "send_webhook", label: "Call Webhook" },
  { value: "create_task", label: "Create Task" }
];

export default function RuleChainBuilder({ onSave }) {
  const [condition, setCondition] = useState("");
  const [conditionValue, setConditionValue] = useState("");
  const [action, setAction] = useState("");
  const [actionValue, setActionValue] = useState("");

  return (
    <Stack spacing={2}>
      <TextField select label="Condition" value={condition} onChange={e => setCondition(e.target.value)}>
        {CONDITIONS.map(c => <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>)}
      </TextField>
      {condition === "low_inventory" && (
        <TextField label="Stock Below" type="number" value={conditionValue} onChange={e => setConditionValue(e.target.value)} />
      )}
      {/* Add more condition fields as needed */}
      <TextField select label="Action" value={action} onChange={e => setAction(e.target.value)}>
        {ACTIONS.map(a => <MenuItem key={a.value} value={a.value}>{a.label}</MenuItem>)}
      </TextField>
      {action === "send_email" && (
        <TextField label="Email Address" value={actionValue} onChange={e => setActionValue(e.target.value)} />
      )}
      <Button variant="contained" onClick={() => onSave({ condition, conditionValue, action, actionValue })}>Save Rule Chain</Button>
    </Stack>
  );
}
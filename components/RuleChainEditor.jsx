import React, { useState } from "react";
import { Stack, Button, MenuItem, TextField, Typography, Paper } from "@mui/material";

const CONDITIONS = [
  { value: "low_inventory", label: "Stock below..." },
  { value: "overdue_task", label: "Task overdue" }
];
const ACTIONS = [
  { value: "send_email", label: "Send Email" },
  { value: "send_push", label: "Send Push Notification" },
  { value: "create_task", label: "Create Task" }
];

export default function RuleChainEditor({ value = {}, onChange }) {
  const [condition, setCondition] = useState(value.condition || { type: "", value: "" });
  const [chain, setChain] = useState(value.chain || []);

  function addAction() {
    setChain([...chain, { type: "", params: {} }]);
  }
  function updateAction(i, key, val) {
    const newChain = chain.slice();
    newChain[i][key] = val;
    setChain(newChain);
  }
  function save() {
    onChange && onChange({ condition, chain });
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">Rule Chain</Typography>
      <Stack spacing={2}>
        <TextField select label="Condition" value={condition.type} onChange={e => setCondition(c => ({ ...c, type: e.target.value }))}>
          {CONDITIONS.map(c => <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>)}
        </TextField>
        {condition.type === "low_inventory" && (
          <TextField label="Stock Below" type="number" value={condition.value || ""} onChange={e => setCondition(c => ({ ...c, value: e.target.value }))} />
        )}
        <Typography>THEN</Typography>
        {chain.map((a, i) => (
          <Stack key={i} direction="row" spacing={2}>
            <TextField select label="Action" value={a.type} onChange={e => updateAction(i, "type", e.target.value)}>
              {ACTIONS.map(act => <MenuItem key={act.value} value={act.value}>{act.label}</MenuItem>)}
            </TextField>
            {a.type === "send_email" && (
              <TextField label="To" value={a.params?.to || ""} onChange={e => updateAction(i, "params", { ...a.params, to: e.target.value })} />
            )}
            {/* ...other action params */}
          </Stack>
        ))}
        <Button size="small" onClick={addAction}>Add Action</Button>
        <Button variant="contained" onClick={save}>Save Rule Chain</Button>
      </Stack>
    </Paper>
  );
}
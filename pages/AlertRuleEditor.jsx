import React, { useState } from "react";
import { Paper, Typography, Stack, TextField, MenuItem, Button } from "@mui/material";

const ALERT_TYPES = [
  { value: "low_inventory", label: "Low Inventory" },
  { value: "overdue_task", label: "Overdue Task" },
  { value: "custom", label: "Custom Condition" }
];

export default function AlertRuleEditor({ onSave }) {
  const [rule, setRule] = useState({ type: "low_inventory", threshold: "", keyword: "" });

  const handleSave = () => {
    // POST to backend /api/alerts/rules
    onSave && onSave(rule);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">Create Alert Rule</Typography>
      <Stack spacing={2}>
        <TextField
          select
          label="Alert Type"
          value={rule.type}
          onChange={e => setRule(r => ({ ...r, type: e.target.value }))}
        >
          {ALERT_TYPES.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
        </TextField>
        {rule.type === "low_inventory" && (
          <TextField
            label="Threshold"
            type="number"
            value={rule.threshold}
            onChange={e => setRule(r => ({ ...r, threshold: e.target.value }))}
          />
        )}
        {rule.type === "custom" && (
          <TextField
            label="Keyword/Condition"
            value={rule.keyword}
            onChange={e => setRule(r => ({ ...r, keyword: e.target.value }))}
          />
        )}
        <Button variant="contained" onClick={handleSave}>Save Rule</Button>
      </Stack>
    </Paper>
  );
}
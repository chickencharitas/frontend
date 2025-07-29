import React, { useEffect, useState } from "react";
import { Paper, Typography, List, ListItem, ListItemText, Chip } from "@mui/material";
import { getNotificationLogs } from "../services/alertRuleService";

export default function NotificationLogPage() {
  const [logs, setLogs] = useState([]);
  useEffect(() => { getNotificationLogs().then(setLogs); }, []);
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5">Notification History</Typography>
      <List>
        {logs.map(l => (
          <ListItem key={l.id}>
            <ListItemText
              primary={l.message}
              secondary={`${l.channel} | ${l.sent_at}`}
            />
            <Chip label={l.status} size="small" />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
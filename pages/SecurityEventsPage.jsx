import React, { useEffect, useState } from "react";
import { Paper, Typography, List, ListItem, ListItemText } from "@mui/material";

export default function SecurityEventsPage({ api }) {
  const [events, setEvents] = useState([]);
  useEffect(() => { api.getSecurityEvents().then(setEvents); }, []);
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5">Security Events</Typography>
      <List>
        {events.map(e => (
          <ListItem key={e.id}>
            <ListItemText
              primary={`${e.event_type}: ${e.details}`}
              secondary={`${e.user_name || "-"} - ${e.created_at} (${e.ip_address || "unknown"})`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
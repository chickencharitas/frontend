import React, { useEffect, useState } from "react";
import { getAlerts, markAlertRead } from "../services/taskCalendarService";
import { Paper, Typography, IconButton, Stack, Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function AlertsPanel({ user }) {
  const [alerts, setAlerts] = useState([]);
  useEffect(() => { getAlerts({ user_id: user?.id, unread: true }).then(setAlerts); }, [user]);
  const handleRead = async (id) => {
    await markAlertRead({ id });
    setAlerts(a => a.filter(al => al.id !== id));
  };
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6">Alerts</Typography>
      <Stack spacing={1}>
        {alerts.length === 0 && <span>No new alerts.</span>}
        {alerts.map(a => (
          <Paper key={a.id} sx={{ p: 1, bgcolor: "#fffbe6" }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <span>
                <Chip label={a.type} size="small" sx={{ mr: 1 }} />
                {a.message}
              </span>
              <IconButton size="small" onClick={() => handleRead(a.id)}><CloseIcon /></IconButton>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Paper>
  );
}
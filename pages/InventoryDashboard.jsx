import React, { useEffect, useState } from "react";
import { Paper, Typography, Box, Button, Chip, Stack, Alert } from "@mui/material";
import { getLowStock, getExpiringSoon } from "../services/inventoryService";

export default function InventoryDashboard({ location }) {
  const [lowStock, setLowStock] = useState([]);
  const [expiring, setExpiring] = useState([]);

  useEffect(() => {
    if (location) {
      getLowStock({ location_id: location.id }).then(setLowStock);
      getExpiringSoon({ location_id: location.id }).then(setExpiring);
    }
  }, [location]);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Inventory Dashboard</Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button variant="contained" href="/inventory/locations">Manage Locations</Button>
        <Button variant="contained" href="/inventory/items">Manage Items</Button>
        <Button variant="contained" href="/inventory/batches">View Batches</Button>
        <Button variant="outlined" href="/inventory/analytics">Analytics</Button>
      </Stack>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Low Stock Alerts</Typography>
        {lowStock.length === 0 ? (
          <Typography color="success.main">No low stock items.</Typography>
        ) : (
          <Stack spacing={1}>
            {lowStock.map(item => (
              <Alert key={item.name} severity="warning">
                {item.name}: <strong>{item.total_qty}</strong> remaining!
              </Alert>
            ))}
          </Stack>
        )}
      </Box>

      <Box>
        <Typography variant="h6">Expiring Soon</Typography>
        {expiring.length === 0 ? (
          <Typography color="success.main">No items expiring soon.</Typography>
        ) : (
          <Stack spacing={1}>
            {expiring.map(batch => (
              <Alert key={batch.id} severity="error">
                {batch.item_name} (Batch {batch.batch_code || batch.lot_number || batch.id}) expires{" "}
                <Chip label={batch.expiry_date} color="error" size="small" />
              </Alert>
            ))}
          </Stack>
        )}
      </Box>
    </Paper>
  );
}
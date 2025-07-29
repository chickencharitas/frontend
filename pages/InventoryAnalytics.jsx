import React, { useEffect, useState } from "react";
import { Paper, Typography, Box, Stack } from "@mui/material";
import { getLowStock, getExpiringSoon, getInventory, getStockMovements } from "../services/inventoryService";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"; // If using recharts

export default function InventoryAnalytics({ location }) {
  const [lowStock, setLowStock] = useState([]);
  const [expiring, setExpiring] = useState([]);
  const [movements, setMovements] = useState([]);
  const [stockLevels, setStockLevels] = useState([]);

  useEffect(() => {
    if (location) {
      getLowStock({ location_id: location.id }).then(setLowStock);
      getExpiringSoon({ location_id: location.id }).then(setExpiring);
      getInventory({ location_id: location.id }).then(data => {
        setStockLevels(data.map(b => ({ name: b.item_name, quantity: b.quantity })));
      });
      getStockMovements({ location_id: location.id }).then(setMovements);
    }
  }, [location]);

  // Transform movements for chart
  const movementChartData = movements.map(m => ({
    date: m.date ? m.date.substring(0, 10) : "",
    quantity: Number(m.quantity),
    type: m.movement_type
  }));

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Inventory Analytics</Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Stock Levels by Item</Typography>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={stockLevels}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantity" fill="#1976d2" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Recent Stock Movements</Typography>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={movementChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="quantity" stroke="#388e3c" />
          </LineChart>
        </ResponsiveContainer>
      </Box>
      <Box>
        <Typography variant="h6">Low Stock & Expiry Alerts</Typography>
        <Stack spacing={1}>
          {lowStock.map(item => (
            <Box key={item.name}>{item.name}: <strong>{item.total_qty}</strong> remaining</Box>
          ))}
          {expiring.map(batch => (
            <Box key={batch.id}>{batch.item_name} (Batch {batch.batch_code || batch.lot_number}) expires {batch.expiry_date}</Box>
          ))}
        </Stack>
      </Box>
    </Paper>
  );
}
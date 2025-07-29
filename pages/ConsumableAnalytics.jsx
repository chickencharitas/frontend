import React, { useEffect, useState } from "react";
import { Paper, Typography, Stack, Box, Chip } from "@mui/material";
import { getConsumables } from "../services/inventoryService";
import { getFeedings } from "../services/feedingService";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export default function ConsumableAnalytics() {
  const [consumables, setConsumables] = useState([]);
  const [feedings, setFeedings] = useState([]);

  useEffect(() => {
    getConsumables().then(setConsumables);
    getFeedings().then(setFeedings);
  }, []);

  // Example: feed usage by day
  const feedUsage = {};
  feedings.forEach(f => {
    if (!f.feed_batch_id) return;
    const date = f.date;
    feedUsage[date] = (feedUsage[date] || 0) + Number(f.quantity || 0);
  });
  const feedUsageData = Object.entries(feedUsage).map(([date, qty]) => ({ date, qty }));

  // Current low stock
  const lowStock = consumables.filter(c => Number(c.quantity) <= Number(c.reorder_level));

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Consumable Analytics</Typography>
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1">Feed Usage Trend</Typography>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={feedUsageData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="qty" stroke="#1976d2" />
          </LineChart>
        </ResponsiveContainer>
      </Box>
      <Box>
        <Typography variant="body1">Low Stock Items</Typography>
        <Stack spacing={1}>
          {lowStock.map(c => (
            <Box key={c.id}>{c.name}: <Chip label={`${c.quantity} ${c.unit}`} color="error" size="small" /></Box>
          ))}
          {lowStock.length === 0 && <span>All stocks above reorder level.</span>}
        </Stack>
      </Box>
    </Paper>
  );
}
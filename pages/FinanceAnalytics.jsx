import React, { useEffect, useState } from "react";
import { Paper, Typography, Box, Stack, Chip } from "@mui/material";
import { getSaleOrders, getPurchaseOrders, getPartners, getPayments } from "../services/financeService";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

export default function FinanceAnalytics() {
  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    getSaleOrders({}).then(setSales);
    getPurchaseOrders({}).then(setPurchases);
    getPartners({ type: "customer" }).then(setCustomers);
    getPartners({ type: "supplier" }).then(setSuppliers);
    getPayments({}).then(setPayments);
  }, []);

  // Prepare timeseries for sales and purchases
  const aggregateByMonth = arr => {
    const m = {};
    arr.forEach(o => {
      const month = o.order_date?.slice(0,7) || "";
      m[month] = (m[month] || 0) + Number(o.total);
    });
    return Object.entries(m).map(([month, total]) => ({ month, total }));
  };
  const salesSeries = aggregateByMonth(sales);
  const purchaseSeries = aggregateByMonth(purchases);

  // Top customers/suppliers
  const aggTop = (arr, field) => {
    const m = {};
    arr.forEach(o => {
      if (!o.partner_name) return;
      m[o.partner_name] = (m[o.partner_name] || 0) + Number(o.total);
    });
    return Object.entries(m)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  };
  const topCustomers = aggTop(sales, "partner_name");
  const topSuppliers = aggTop(purchases, "partner_name");

  // Cashflow
  const cashflowData = [
    ...sales.map(o => ({ date: o.order_date, value: Number(o.total) })),
    ...purchases.map(o => ({ date: o.order_date, value: -Number(o.total) })),
  ].sort((a, b) => a.date.localeCompare(b.date));

  // Overdue detection (simple: status not 'paid' and date < today)
  const overdueSales = sales.filter(o => o.status !== "paid" && o.order_date < new Date().toISOString().slice(0,10));
  const overduePurchases = purchases.filter(o => o.status !== "paid" && o.order_date < new Date().toISOString().slice(0,10));

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Financial Analytics</Typography>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Sales vs Purchases (by month)</Typography>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={salesSeries}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" name="Sales" fill="#1976d2" />
          </BarChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={purchaseSeries}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" name="Purchases" fill="#d32f2f" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Cashflow Timeline</Typography>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={cashflowData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#388e3c" />
          </LineChart>
        </ResponsiveContainer>
      </Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Top Customers</Typography>
        <Stack direction="row" spacing={2}>
          {topCustomers.map(c => (
            <Chip key={c.name} label={`${c.name}: $${c.total.toLocaleString()}`} />
          ))}
        </Stack>
      </Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Top Suppliers</Typography>
        <Stack direction="row" spacing={2}>
          {topSuppliers.map(s => (
            <Chip key={s.name} label={`${s.name}: $${s.total.toLocaleString()}`} />
          ))}
        </Stack>
      </Box>
      <Box>
        <Typography variant="h6">Overdue Sales</Typography>
        <Stack spacing={1}>
          {overdueSales.map(o => (
            <Box key={o.id}>{o.partner_name} — {o.order_date} <Chip label={o.status} size="small" color="error" /></Box>
          ))}
        </Stack>
        <Typography variant="h6" sx={{ mt: 3 }}>Overdue Purchases</Typography>
        <Stack spacing={1}>
          {overduePurchases.map(o => (
            <Box key={o.id}>{o.partner_name} — {o.order_date} <Chip label={o.status} size="small" color="error" /></Box>
          ))}
        </Stack>
      </Box>
    </Paper>
  );
}
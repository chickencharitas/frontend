import React, { useEffect, useState } from "react";
import { Select, MenuItem, Typography } from "@mui/material";
import { getGrowthStats } from "../../services/analyticsService";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function GenericChartWidget() {
  const [type, setType] = useState("line");
  const [data, setData] = useState([]);
  useEffect(() => { getGrowthStats({}).then(setData); }, []);

  return (
    <>
      <Typography variant="h6">Custom Growth Chart</Typography>
      <Select value={type} onChange={e => setType(e.target.value)} size="small" sx={{ mb: 1 }}>
        <MenuItem value="line">Line Chart</MenuItem>
        <MenuItem value="bar">Bar Chart</MenuItem>
      </Select>
      <ResponsiveContainer width="100%" height={180}>
        {type === "line" ? (
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="avg_weight" stroke="#388e3c" />
          </LineChart>
        ) : (
          <BarChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="avg_weight" fill="#1976d2" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </>
  );
}
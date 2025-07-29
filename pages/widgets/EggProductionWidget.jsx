import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { getEggProductionStats } from "../../services/analyticsService";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function EggProductionWidget() {
  const [data, setData] = useState([]);
  useEffect(() => { getEggProductionStats({}).then(setData); }, []);
  return (
    <>
      <Typography variant="h6">Egg Production</Typography>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="collected" fill="#1976d2" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
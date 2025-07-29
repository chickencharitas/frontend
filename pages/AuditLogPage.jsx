import React, { useEffect, useState } from "react";
import { Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

export default function AuditLogPage({ api }) {
  const [logs, setLogs] = useState([]);
  useEffect(() => { api.getAuditLogs().then(setLogs); }, []);
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5">Audit Log</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>When</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Action</TableCell>
            <TableCell>Target</TableCell>
            <TableCell>Meta</TableCell>
            <TableCell>IP</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map(l => (
            <TableRow key={l.id}>
              <TableCell>{l.created_at}</TableCell>
              <TableCell>{l.user_name || "-"}</TableCell>
              <TableCell>{l.action}</TableCell>
              <TableCell>{l.target_type} {l.target_id}</TableCell>
              <TableCell>{JSON.stringify(l.meta)}</TableCell>
              <TableCell>{l.ip_address}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
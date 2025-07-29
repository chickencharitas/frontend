import React, { useRef, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Alert, Box } from "@mui/material";
import { bulkImportChickens } from "../services/chickenService";

export default function BulkChickenImportDialog({ open, onClose, onImported }) {
  const [imported, setImported] = useState(null);
  const [error, setError] = useState("");
  const fileInput = useRef();

  const handleFile = async (e) => {
    setError("");
    setImported(null);
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      // Assumes CSV with headers matching backend fields
      const rows = text.trim().split("\n").map(r => r.split(","));
      const [header, ...body] = rows;
      const chickens = body.map(row => Object.fromEntries(header.map((h, i) => [h.trim(), row[i]?.trim()])));
      const result = await bulkImportChickens(chickens);
      setImported(result);
      onImported && onImported();
    } catch (err) {
      setError("Import failed: " + err.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Bulk Import Chickens</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Box>
            <Button variant="outlined" component="label">
              Select CSV File
              <input
                ref={fileInput}
                type="file"
                hidden
                accept=".csv"
                onChange={handleFile}
              />
            </Button>
          </Box>
          <Box>
            <strong>CSV Format:</strong>
            <pre style={{ background: "#f7f7f7", padding: 8, borderRadius: 4 }}>
              unique_tag,name,breed_id,sex,color,hatch_date,source,generation,genetic_line,weight,health_status,vaccination_status,notes
            </pre>
          </Box>
          {error && <Alert severity="error">{error}</Alert>}
          {imported && (
            <Alert severity="success">
              Imported {imported.length} chickens!
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
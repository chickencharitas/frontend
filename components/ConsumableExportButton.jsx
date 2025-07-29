import React from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import { getConsumables } from "../services/inventoryService";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

export default function ConsumableExportButton() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleCSV = async () => {
    const data = await getConsumables();
    const csv = [
      "Name,Type,Quantity,Unit,Reorder,Notes",
      ...data.map(c =>
        [c.name, c.type, c.quantity, c.unit, c.reorder_level, `"${c.notes || ""}"`].join(",")
      )
    ].join("\n");
    saveAs(new Blob([csv], { type: "text/csv;charset=utf-8" }), "consumables.csv");
    setAnchorEl(null);
  };

  const handleExcel = async () => {
    const data = await getConsumables();
    const worksheet = XLSX.utils.json_to_sheet(data.map(c => ({
      Name: c.name,
      Type: c.type,
      Quantity: c.quantity,
      Unit: c.unit,
      "Reorder Level": c.reorder_level,
      Notes: c.notes
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, "Consumables");
    const wbout = XLSX.write(wb, { type: "array", bookType: "xlsx" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "consumables.xlsx");
    setAnchorEl(null);
  };

  return (
    <>
      <Button variant="outlined" onClick={e => setAnchorEl(e.currentTarget)}>Export</Button>
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={handleCSV}>Export as CSV</MenuItem>
        <MenuItem onClick={handleExcel}>Export as Excel</MenuItem>
      </Menu>
    </>
  );
}
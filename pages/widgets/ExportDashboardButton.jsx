import React from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { getEggProductionStats, getGrowthStats } from "../../services/analyticsService";

export default function ExportDashboardButton({ widgets }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleExportCSV = async () => {
    let csv = "";
    if (widgets.includes("egg")) {
      const data = await getEggProductionStats({});
      csv += "Egg Production\nDate,Collected,Broken,Abnormal\n" +
        data.map(d =>
          [d.date, d.collected, d.broken, d.abnormal].join(",")
        ).join("\n") + "\n";
    }
    if (widgets.includes("growth")) {
      const data = await getGrowthStats({});
      csv += "Growth\nDate,Avg Weight\n" +
        data.map(d => [d.date, d.avg_weight].join(",")).join("\n") + "\n";
    }
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "dashboard_export.csv");
    setAnchorEl(null);
  };

  const handleExportPNG = async () => {
    const el = document.body.querySelector("main") || document.body;
    const canvas = await html2canvas(el);
    canvas.toBlob(blob => {
      if (blob) saveAs(blob, "dashboard.png");
    });
    setAnchorEl(null);
  };

  const handleExportPDF = async () => {
    // Simple PDF, screenshot of dashboard
    const el = document.body.querySelector("main") || document.body;
    const canvas = await html2canvas(el);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    pdf.save("dashboard.pdf");
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        variant="outlined"
        aria-controls="export-menu"
        aria-haspopup="true"
        onClick={e => setAnchorEl(e.currentTarget)}
      >Export</Button>
      <Menu
        id="export-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={handleExportCSV}>Export CSV</MenuItem>
        <MenuItem onClick={handleExportPNG}>Export as PNG</MenuItem>
        <MenuItem onClick={handleExportPDF}>Export as PDF</MenuItem>
      </Menu>
    </>
  );
}
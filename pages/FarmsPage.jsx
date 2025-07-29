import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { getFarms, deleteFarm } from "../services/farmService";
import {
  Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper,
  TablePagination, IconButton, Snackbar, Alert, Button
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import FarmFormDialog from "./FarmFormDialog";

export default function FarmsPage() {
  const { token } = useContext(AuthContext);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [dialog, setDialog] = useState({ open: false, mode: "create", farm: null });

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchFarms();
    // eslint-disable-next-line
  }, [token, dialog.open]);

  const fetchFarms = () => {
    setLoading(true);
    getFarms(token)
      .then(setFarms)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this farm?")) return;
    try {
      await deleteFarm(id);
      setSnackbar({ open: true, message: "Farm deleted", severity: "success" });
      fetchFarms();
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: "error" });
    }
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box p={4}>
      <Typography variant="h4" mb={2}>Farms</Typography>
      {error && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}
      <Box mb={2}><Button startIcon={<AddIcon />} variant="contained" onClick={() => setDialog({ open: true, mode: "create", farm: null })}>Add Farm</Button></Box>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Manager</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} align="center">Loading...</TableCell></TableRow>
            ) : farms.length === 0 ? (
              <TableRow><TableCell colSpan={6} align="center">No farms found.</TableCell></TableRow>
            ) : (
              farms
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(farm => (
                  <TableRow key={farm.id}>
                    <TableCell>{farm.name}</TableCell>
                    <TableCell>{farm.location || "—"}</TableCell>
                    <TableCell>{farm.capacity || "—"}</TableCell>
                    <TableCell>{farm.manager_name || "—"}</TableCell>
                    <TableCell>{farm.created_at ? new Date(farm.created_at).toLocaleString() : ""}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => setDialog({ open: true, mode: "edit", farm })}><EditIcon /></IconButton>
                      <IconButton color="error" onClick={() => handleDelete(farm.id)}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={farms.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>
      <FarmFormDialog
        open={dialog.open}
        onClose={success => {
          setDialog({ open: false, mode: "create", farm: null });
          if (success) {
            setSnackbar({ open: true, message: "Farm saved", severity: "success" });
            fetchFarms();
          }
        }}
        farm={dialog.farm}
        mode={dialog.mode}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
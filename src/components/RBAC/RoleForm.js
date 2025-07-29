import React, { useState, useContext } from "react";
import {
  TextField, Button, Box, Snackbar, Alert, CircularProgress
} from "@mui/material";
import roleService from "../../services/roleService";
import { AuthContext } from "../../contexts/AuthContext";

export default function RoleForm({ role, onSuccess }) {
  const { token } = useContext(AuthContext); // FIXED: use 'token' instead of 'accessToken'

  const [name, setName] = useState(role?.name || "");
  const [description, setDescription] = useState(role?.description || "");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showSnackbar("Role name is required", "error");
      return;
    }

    setLoading(true);
    try {
      const data = {
        name: name.trim(),
        description: description.trim()
      };

      if (role) {
        await roleService.update(role.id, data, token); // FIXED
        showSnackbar("Role updated");
      } else {
        await roleService.create(data, token); // FIXED
        showSnackbar("Role created");
      }

      setTimeout(() => {
        onSuccess?.();
      }, 300);
    } catch (err) {
      console.error(err);
      showSnackbar("Error saving role", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Role Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={2}
        />
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            endIcon={loading && <CircularProgress size={20} />}
          >
            {role ? "Update Role" : "Create Role"}
          </Button>
        </Box>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

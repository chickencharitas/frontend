import React, { useEffect, useState } from "react";
import { Paper, Typography, Button, Stack, TextField, List, ListItem, ListItemText, Chip, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem } from "@mui/material";
import { getTasks, addTask, updateTaskStatus } from "../services/taskCalendarService";

const TASK_TYPES = [
  { value: "feeding", label: "Feeding" },
  { value: "cleaning", label: "Cleaning" },
  { value: "treatment", label: "Treatment" },
  { value: "vaccination", label: "Vaccination" },
  { value: "other", label: "Other" }
];
const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" }
];

export default function TasksPage({ user }) {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", due_date: "", due_time: "", type: "feeding", priority: "normal", assigned_to: user?.id
  });

  useEffect(() => { getTasks({ user_id: user?.id }).then(setTasks); }, [user, open]);

  const handleAdd = async () => {
    await addTask({ ...form, assigned_to: user?.id, created_by: user?.id });
    setOpen(false);
    setForm({ title: "", description: "", due_date: "", due_time: "", type: "feeding", priority: "normal", assigned_to: user?.id });
    getTasks({ user_id: user?.id }).then(setTasks);
  };
  const handleStatus = async (id, status) => {
    await updateTaskStatus({ id, status });
    getTasks({ user_id: user?.id }).then(setTasks);
  };

  return (
    <Paper sx={{ p: { xs: 1, sm: 3 } }}>
      <Typography variant="h5" gutterBottom>My Tasks</Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="stretch" sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => setOpen(true)}>Add Task</Button>
      </Stack>
      <List>
        {tasks.map(t => (
          <ListItem key={t.id} sx={{ borderBottom: "1px solid #eee" }}>
            <ListItemText
              primary={<>
                {t.title} <Chip label={t.type} size="small" sx={{ ml: 1 }} />
                <Chip label={t.priority} size="small" color={t.priority === "high" ? "error" : t.priority === "low" ? "success" : "default"} sx={{ ml: 1 }} />
              </>}
              secondary={
                <>
                  <span>Due: {t.due_date} {t.due_time}</span>
                  <br />
                  {t.description}
                </>
              }
            />
            <Stack direction="row" spacing={1}>
              <Chip label={t.status} color={t.status === "done" ? "success" : t.status === "overdue" ? "error" : "primary"} size="small" />
              {t.status !== "done" && (
                <Button size="small" variant="outlined" onClick={() => handleStatus(t.id, "done")}>Mark Done</Button>
              )}
            </Stack>
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Task</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} autoFocus />
            <TextField label="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} multiline />
            <TextField label="Due Date" type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} InputLabelProps={{ shrink: true }} />
            <TextField label="Due Time" type="time" value={form.due_time} onChange={e => setForm(f => ({ ...f, due_time: e.target.value }))} InputLabelProps={{ shrink: true }} />
            <TextField label="Type" select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              {TASK_TYPES.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
            </TextField>
            <TextField label="Priority" select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
              {PRIORITIES.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained" disabled={!form.title || !form.due_date}>Add</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
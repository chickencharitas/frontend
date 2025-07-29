import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, Autocomplete, Checkbox, List, ListItem, ListItemText, ListItemIcon, Typography, Divider } from "@mui/material";
import { getFlocks, mergeFlocks, splitFlock, getChickens } from "../services/chickenService";

export default function FlockMergeSplitDialog({ open, onClose, farm, onChanged }) {
  const [mode, setMode] = useState("merge"); // merge or split
  const [flocks, setFlocks] = useState([]);
  const [flockA, setFlockA] = useState(null);
  const [flockB, setFlockB] = useState(null);
  const [chickens, setChickens] = useState([]);
  const [selectedChickens, setSelectedChickens] = useState([]);
  const [newFlockName, setNewFlockName] = useState("");

  useEffect(() => {
    if (open && farm) getFlocks({ farm_id: farm.id }).then(setFlocks);
    if (!open) {
      setFlockA(null); setFlockB(null); setChickens([]); setSelectedChickens([]); setNewFlockName("");
    }
  }, [open, farm]);

  useEffect(() => {
    if (mode === "split" && flockA)
      getChickens({ flock_id: flockA.id }).then(setChickens);
  }, [mode, flockA]);

  const handleMerge = async () => {
    await mergeFlocks(flockA.id, flockB.id);
    onChanged && onChanged();
    onClose();
  };

  const handleSplit = async () => {
    await splitFlock(flockA.id, newFlockName, selectedChickens.map(c => c.id));
    onChanged && onChanged();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Flock Merge / Split</DialogTitle>
      <DialogContent>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button
            variant={mode === "merge" ? "contained" : "outlined"}
            onClick={() => setMode("merge")}
          >Merge Flocks</Button>
          <Button
            variant={mode === "split" ? "contained" : "outlined"}
            onClick={() => setMode("split")}
          >Split Flock</Button>
        </Stack>
        {mode === "merge" && (
          <Stack spacing={2}>
            <Autocomplete
              options={flocks}
              getOptionLabel={opt => opt?.name || ""}
              value={flockA}
              onChange={(_, v) => setFlockA(v)}
              renderInput={params => <TextField {...params} label="Source Flock" />}
            />
            <Autocomplete
              options={flocks.filter(f => f !== flockA)}
              getOptionLabel={opt => opt?.name || ""}
              value={flockB}
              onChange={(_, v) => setFlockB(v)}
              renderInput={params => <TextField {...params} label="Target Flock" />}
              disabled={!flockA}
            />
            <Typography variant="body2" color="text.secondary">
              All chickens from Source will move to Target, and Source will be deleted.
            </Typography>
          </Stack>
        )}
        {mode === "split" && (
          <Stack spacing={2}>
            <Autocomplete
              options={flocks}
              getOptionLabel={opt => opt?.name || ""}
              value={flockA}
              onChange={(_, v) => setFlockA(v)}
              renderInput={params => <TextField {...params} label="Flock to Split" />}
            />
            {flockA && (
              <>
                <TextField
                  label="New Flock Name"
                  value={newFlockName}
                  onChange={e => setNewFlockName(e.target.value)}
                  fullWidth
                />
                <Divider sx={{ my: 1 }} />
                <Typography>Select chickens for the new flock:</Typography>
                <List dense>
                  {chickens.map(ch => (
                    <ListItem
                      key={ch.id}
                      button
                      onClick={() =>
                        setSelectedChickens(sel =>
                          sel.some(s => s.id === ch.id)
                            ? sel.filter(s => s.id !== ch.id)
                            : [...sel, ch]
                        )
                      }
                    >
                      <ListItemIcon>
                        <Checkbox
                          checked={selectedChickens.some(s => s.id === ch.id)}
                          edge="start"
                          tabIndex={-1}
                          disableRipple
                        />
                      </ListItemIcon>
                      <ListItemText primary={ch.name || ch.unique_tag} secondary={ch.unique_tag} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {mode === "merge" && (
          <Button
            disabled={!flockA || !flockB}
            onClick={handleMerge}
            variant="contained"
          >Merge</Button>
        )}
        {mode === "split" && (
          <Button
            disabled={!flockA || !newFlockName || selectedChickens.length === 0}
            onClick={handleSplit}
            variant="contained"
          >Split</Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
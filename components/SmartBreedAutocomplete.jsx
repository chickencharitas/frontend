import React, { useState } from "react";
import { Autocomplete, TextField, CircularProgress, Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { searchBreeds, createBreed } from "../services/chickenService";

export default function SmartBreedAutocomplete({ value, onChange, label = "Breed" }) {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addDialog, setAddDialog] = useState(false);
  const [newBreed, setNewBreed] = useState({ name: "", description: "" });

  React.useEffect(() => {
    if (!inputValue) { setOptions([]); return; }
    setLoading(true);
    searchBreeds(inputValue).then(setOptions).finally(() => setLoading(false));
  }, [inputValue]);

  const handleAdd = async () => {
    const breed = await createBreed(newBreed);
    onChange(breed);
    setAddDialog(false);
  };

  return (
    <>
      <Autocomplete
        value={value}
        onChange={(_, v) => {
          if (v && v.isAdd) setAddDialog(true);
          else onChange(v);
        }}
        inputValue={inputValue}
        onInputChange={(_, val) => setInputValue(val)}
        options={options}
        getOptionLabel={opt => opt?.name || ""}
        isOptionEqualToValue={(a, b) => a?.id === b?.id}
        filterOptions={(opts, params) => {
          const filtered = opts.filter(o => o.name?.toLowerCase().includes(params.inputValue.toLowerCase()));
          if (params.inputValue && !filtered.length)
            filtered.push({ name: `Add "${params.inputValue}"…`, isAdd: true });
          return filtered;
        }}
        renderOption={(props, opt) =>
          opt.isAdd
            ? <li {...props} style={{ color: "#1976d2" }}>+ {opt.name}</li>
            : <li {...props}>{opt.name}</li>
        }
        renderInput={params => (
          <TextField
            {...params}
            label={label}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={18} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
      <Dialog open={addDialog} onClose={() => setAddDialog(false)}>
        <DialogTitle>Add New Breed</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Name" value={newBreed.name} onChange={e => setNewBreed(b => ({ ...b, name: e.target.value }))} />
            <TextField label="Description" value={newBreed.description} onChange={e => setNewBreed(b => ({ ...b, description: e.target.value }))} multiline />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialog(false)}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained" disabled={!newBreed.name}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
import React, { useState } from "react";
import { Autocomplete, TextField, CircularProgress, Button, Stack } from "@mui/material";
import { getChickens, createChicken } from "../services/chickenService";

export default function SmartChickenAutocomplete({ label, value, onChange, allowAdd = true, filterSex, filterBreed, farm }) {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addDialog, setAddDialog] = useState(false);
  const [newChicken, setNewChicken] = useState({ name: "", sex: filterSex || "", breed_id: filterBreed || "", unique_tag: "" });

  React.useEffect(() => {
    if (!inputValue) { setOptions([]); return; }
    setLoading(true);
    getChickens({ search: inputValue, sex: filterSex, breed_id: filterBreed, farm_id: farm?.id }).then(setOptions).finally(() => setLoading(false));
  }, [inputValue, filterSex, filterBreed, farm]);

  const handleAdd = async () => {
    const chicken = await createChicken({ ...newChicken, farm_id: farm?.id });
    onChange(chicken);
    setAddDialog(false);
  };

  return (
    <>
      <Autocomplete
        value={value}
        onChange={(_, v) => onChange(v)}
        inputValue={inputValue}
        onInputChange={(_, val) => setInputValue(val)}
        options={options}
        getOptionLabel={opt => opt?.name || opt?.unique_tag || ""}
        isOptionEqualToValue={(a, b) => a?.id === b?.id}
        loading={loading}
        filterOptions={(opts, params) => {
          const filtered = opts.filter(o => o.name?.toLowerCase().includes(params.inputValue.toLowerCase()) || o.unique_tag?.toLowerCase().includes(params.inputValue.toLowerCase()));
          if (allowAdd && params.inputValue && !filtered.length) {
            filtered.push({
              inputValue: params.inputValue,
              name: `Add "${params.inputValue}"…`,
              isAdd: true
            });
          }
          return filtered;
        }}
        renderOption={(props, opt) =>
          opt.isAdd ? (
            <li {...props} style={{ color: "#1976d2" }}>+ {opt.name}</li>
          ) : (
            <li {...props}>{opt.name || opt.unique_tag}</li>
          )
        }
        onChangeOption={(event, opt) => {
          if (opt?.isAdd) setAddDialog(true);
          else onChange(opt);
        }}
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
      {addDialog && (
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField label="Name" value={newChicken.name} onChange={e => setNewChicken(c => ({ ...c, name: e.target.value }))} />
          <TextField label="Unique Tag" value={newChicken.unique_tag} onChange={e => setNewChicken(c => ({ ...c, unique_tag: e.target.value }))} />
          <TextField label="Sex" value={newChicken.sex} onChange={e => setNewChicken(c => ({ ...c, sex: e.target.value }))} />
          <Button onClick={handleAdd} variant="contained">Add and Select</Button>
          <Button onClick={() => setAddDialog(false)}>Cancel</Button>
        </Stack>
      )}
    </>
  );
}
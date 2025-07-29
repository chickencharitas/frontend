import React from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import { searchFacilities } from '../services/farmService';

export default function FacilityAutocomplete({ value, onChange, farm, type, label="Select Facility" }) {
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    if (!inputValue || !farm) {
      setOptions([]);
      return;
    }
    setLoading(true);
    searchFacilities({ query: inputValue, farmId: farm.id, type }).then(facs => {
      if (active) setOptions(facs);
    }).finally(() => setLoading(false));
    return () => { active = false; };
  }, [inputValue, farm, type]);

  return (
    <Autocomplete
      value={value}
      onChange={(e, newValue) => onChange(newValue)}
      inputValue={inputValue}
      onInputChange={(e, v) => setInputValue(v)}
      options={options}
      getOptionLabel={opt => opt?.name || ''}
      isOptionEqualToValue={(opt, val) => opt.id === val.id}
      loading={loading}
      disabled={!farm}
      renderInput={params => (
        <TextField {...params} label={label} InputProps={{
          ...params.InputProps,
          endAdornment: (
            <>
              {loading ? <CircularProgress color="inherit" size={18} /> : null}
              {params.InputProps.endAdornment}
            </>
          ),
        }} />
      )}
    />
  );
}
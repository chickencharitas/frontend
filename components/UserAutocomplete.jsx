import React from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import { searchUsers } from '../services/userService';

export default function UserAutocomplete({ value, onChange, label = "Select User" }) {
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    if (!inputValue) {
      setOptions([]);
      return undefined;
    }
    setLoading(true);
    searchUsers(inputValue).then(users => {
      if (active) setOptions(users);
    }).finally(() => setLoading(false));
    return () => { active = false; };
  }, [inputValue]);

  return (
    <Autocomplete
      value={value}
      onChange={(e, newValue) => onChange(newValue)}
      inputValue={inputValue}
      onInputChange={(e, v) => setInputValue(v)}
      options={options}
      getOptionLabel={opt => opt?.name || opt?.email || ''}
      isOptionEqualToValue={(opt, val) => opt.id === val.id}
      loading={loading}
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
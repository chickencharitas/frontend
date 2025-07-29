import React from 'react';
import { TextField, Box } from '@mui/material';
export default function OTPInput({ value, onChange, length=6 }) {
  return (
    <Box display="flex" gap={1}>
      {Array.from({length}).map((_,i) => (
        <TextField key={i} value={value[i]||''} onChange={e=>{
          const v = e.target.value.replace(/\D/g,'');
          onChange(value.substr(0,i)+v+value.substr(i+1));
        }} inputProps={{maxLength:1,style:{width:32,textAlign:'center'}}}/>
      ))}
    </Box>
  );
}
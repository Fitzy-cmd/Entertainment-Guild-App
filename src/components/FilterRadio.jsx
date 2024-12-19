import React from 'react';
import { FormControlLabel, Radio } from '@mui/material';

export default function FilterRadio ({ label, value, checked, onChange }) {
  return (
    <FormControlLabel
      control={<Radio checked={checked} onChange={onChange} value={value} />}
      label={label}
    />
  );
};
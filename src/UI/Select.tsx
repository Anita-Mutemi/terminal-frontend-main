import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { createTheme } from '@mui/material/styles';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { styled, ThemeProvider } from '@mui/material';

export default function BasicSelect() {
  const [age, setAge] = React.useState('');

  const CustomSelect = styled(Select)(() => ({
    'width': 300,
    'color': '#000000ad',
    '&.MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#0000003a',
      },
      '&:hover fieldset': {
        borderColor: '#0000006a',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#00000088',
        color: 'red',
      },
    },
  }));

  const handleChange = (event: SelectChangeEvent<unknown>, child: React.ReactNode) => {
    setAge(event.target.value as string);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl size='small'>
        <InputLabel
          id='demo-simple-select-label'
          sx={{
            'color': 'gray',
            '& focus': 'purple',
          }}
        >
          Sort by
        </InputLabel>
        <CustomSelect
          labelId='demo-simple-select-label'
          id='demo-simple-select'
          color='primary'
          value={age}
          label='Sort by'
          onChange={handleChange}
        >
          <MenuItem value={10}>Date</MenuItem>
          <MenuItem value={20}>Relevance</MenuItem>
          <MenuItem value={30}>Investment</MenuItem>
        </CustomSelect>
      </FormControl>
    </Box>
  );
}

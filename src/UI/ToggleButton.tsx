// @ts-nocheck
import * as React from 'react';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';
import ToggleButton from '@mui/material/ToggleButton';
import { useTheme } from 'styled-components';

interface ToggleButtonInterface {
  onClick: () => void;
  clicked: boolean;
}

export default function StandaloneToggleButton({
  onClick,
  clicked,
}: ToggleButtonInterface) {
  const [selected, setSelected] = React.useState(clicked);
  const theme = useTheme();
  return (
    <ToggleButton
      value='check'
      size='small'
      color='success'
      selected={selected}
      onChange={() => {
        setSelected(!selected);
        onClick();
      }}
      sx={{
        borderColor: selected ? '#00cf9d' : theme.borderColor,
        padding: '7px 8px !important',
      }}
    >
      {selected ? (
        <BookmarkOutlinedIcon
          sx={{ transform: 'scale(0.85)', fill: !selected ? theme.iconColor : '#00cf9d' }}
        />
      ) : (
        <BookmarkBorderOutlinedIcon
          sx={{
            transform: 'scale(0.85)',
            fill: !selected ? theme.iconColor : '#00cf9d',
          }}
        />
      )}
    </ToggleButton>
  );
}

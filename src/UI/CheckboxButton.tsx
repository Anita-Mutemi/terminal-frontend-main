/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck

import * as React from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Typography } from '@mui/material';
import styled, { useTheme } from 'styled-components';

const StyledBox = styled.div`
  display: flex;
  position: relative;
  gap: 0.212rem;
  cursor: ${({ loading, checked }) => (loading && !checked ? 'wait' : 'pointer')};
  alignitems: center;
  background-color: ${({ theme }) => theme.background};
  border-bottom: ${({ checked, theme }) =>
    checked ? `1px solid ${theme.actionable}` : ''};
  &:hover {
    border-bottom: '1px solid red';
    cursor: pointer;
  }
`;

interface CheckboxInterface {
  title: string;
  handler?: (e: any) => void;
  clicked: boolean;
  setClicked: any;
  loading?: boolean;
}

export default function IndeterminateCheckbox({
  title,
  handler,
  clicked,
  loading,
  icon,
  setClicked,
}: CheckboxInterface) {
  const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    // handler && handler(event);
    if (!clicked()) {
      // setClicked();
      handler && handler(event);
    }
  };

  const theme = useTheme();

  return (
    /* @ts-ignore */
    <StyledBox
      color='secondary'
      checked={clicked()}
      onClick={handleChange1}
      loading={loading}
    >
      {icon && icon}
      <Typography
        variant='body2'
        sx={{
          marginLeft: '0rem',
          color: clicked() ? theme.actionable : theme.subText,
        }}
      >
        {title}
      </Typography>
      {title === 'Resurfacing' && (
        <span
          style={{
            width: '0.1rem',
            height: '0.1rem',
            padding: '0.11rem',
            backgroundColor: '#ff6969',
            position: 'absolute',
            borderRadius: '50%',
            right: '-0.375rem',
            zIndex: 99,
          }}
        ></span>
      )}
      {title === 'Feed' && (
        <span
          style={{
            width: '0.1rem',
            height: '0.1rem',
            padding: '0.11rem',
            backgroundColor: '#ff6969',
            position: 'absolute',
            borderRadius: '50%',
            right: '-0.375rem',
            zIndex: 99,
          }}
        ></span>
      )}
    </StyledBox>
  );
}

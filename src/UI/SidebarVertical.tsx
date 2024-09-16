// @ts-nocheck
import * as React from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import styled, { useTheme } from 'styled-components';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

interface Sidebar {
  title: string;
  verticalsFilter: any;
  currentFilters: String[];
}

const VerticalWrapper = styled.div`
  width: 100%;
  height: auto;
  border-radius: 5px;
  padding-left: 0.2rem;
  transition: all 0.2s linear;
  &:hover {
    background: ${({ theme }) => theme.subBackground};
    cursor: pointer;
  }
`;

const StyledFormControlLabel = styled(FormControlLabel)`
  max-height: 15rem;
  height: auto;
`;

export default function SidebarVertical({
  title,
  verticalsFilter,
  currentFilters,
}: Sidebar) {
  const [checked, setChecked] = React.useState([
    currentFilters.includes(title),
    currentFilters.includes(title),
  ]);

  React.useEffect(() => {
    setChecked([currentFilters.includes(title), currentFilters.includes(title)]);
  }, [currentFilters, title]);

  const theme = useTheme();

  const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    verticalsFilter(event, title);
    setChecked([event.target.checked, event.target.checked]);
  };

  return (
    <VerticalWrapper color='secondary'>
      <StyledFormControlLabel
        label={
          <Typography
            variant='body2'
            color='textSecondary'
            sx={{ fontSize: '0.75rem', color: theme.sideBarSubMenuTitle }}
          >
            {title}
          </Typography>
        }
        sx={{ width: '100%' }}
        control={
          <Checkbox
            checked={checked[0] && checked[1]}
            onChange={handleChange1}
            style={{ color: theme.borderColor }}
            sx={{ transform: 'scale(0.75)' }}
            defaultChecked
          />
        }
      />
    </VerticalWrapper>
  );
}

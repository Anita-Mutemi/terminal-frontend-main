import * as React from 'react';
import Box from '@mui/material/Box';
import styled from 'styled-components';
import Typography from '@mui/material/Typography';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import { FormControlLabel } from '@mui/material';

interface Sidebar {
  title: string;
}

const VerticalWrapper = styled(Box)`
  width: 80%;
  &:hover {
    border-bottom: 1px solid var(--prime);
    cursor: pointer;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const StyledTypography = styled(Typography)`
  display: flex-start;
s`;

export default function SidebarTeamLink({ title }: Sidebar) {
  return (
    <VerticalWrapper color='secondary' sx={{ height: '2rem' }}>
      <Wrapper>
        <StyledTypography color='textSecondary' sx={{ fontSize: '0.8rem' }}>
          {title}
        </StyledTypography>
      </Wrapper>
    </VerticalWrapper>
  );
}

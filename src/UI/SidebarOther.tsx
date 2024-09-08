/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import styled from 'styled-components';
import * as BiIcons from 'react-icons/bi';

import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

interface Sidebar {
  title: string;
  onClick: () => void;
  Icon: any;
}

const VerticalWrapper = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  height: 2rem;
  align-items: center;
  color: ${({ theme }) => theme.sideBarSubMenuTitle};
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
  transition: all 0.2s linear;
  font-size: 0.75rem;
  border-radius: 5px;
  &:hover {
    background-color: ${({ theme }) => theme.subBackground};
    cursor: pointer;
  }
  &:active {
    transform: scale(1.03);
    background-color: ${({ theme }) => theme.selectedBackground};
  }
`;
const StyledTitle = styled.span``;

export default function SidebarOther({ title, Icon, onClick }: Sidebar) {
  return (
    <VerticalWrapper color='secondary' onClick={onClick}>
      {Icon}
      <StyledTitle>{title}</StyledTitle>
    </VerticalWrapper>
  );
}

// @ts-nocheck
import * as React from 'react';
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import styled, { useTheme } from 'styled-components';
import { useOutletContext } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';

import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Chip from '@mui/material/Chip';

interface Sidebar {
  title: string;
  control: any;
  feedData: any;
  history: any;
}

const TruncatedTypography = styled(Typography)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 115px;
  /* min-width: 100px; // Set a fixed width for all titles */
  &:hover {
    overflow: visible;
    white-space: normal;
    word-break: break-all;
  }
`;

const VerticalWrapper = styled(Box)`
  display: flex;
  width: 100%;
  border-radius: 5px;
  position: 'relative';
  color: ${({ theme }) => theme.sideBarSubMenuTitle};
  background-color: ${({ checked, theme }) =>
    checked ? theme.selectedBackground : ''};
  transition: all 0.2s linear;
  display: flex;
  margin-bottom: 0.5rem;
  padding-left: 0.91rem;
  &:hover {
    background: ${({ theme }) => theme.subBackground};
    cursor: pointer;
  }
  &:active {
    background-color: $ ${({ theme }) => theme.selectedBackground};
    transform: scale(1.03);
  }
`;

const FixedWidthChip = styled(Chip)`
  width: 90px;
  text-align: center;
  text-overflow: none;
  overflow: none;
`;
const FixedWidthChipNew = styled(Chip)`
  width: 80px;
  text-align: center;
  text-overflow: none;
  overflow: none;
`;

// const TruncatedTypography = styled(Typography)`
//   white-space: nowrap;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   max-width: 140px;
//   &:hover {
//     overflow: visible;
//     white-space: normal;
//     word-break: break-all;
//   }
// `;

export default function SidebarFund({
  title,
  control,
  feedData,
  history,
}: Sidebar) {
  const [checked, setChecked] = React.useState([true, false]);
  const theme = useTheme();
  const props = useOutletContext();

  const newProjects = feedData.projects.filter((item) => {
    return item.project.funds.find((fundItem) => {
      return fundItem.name === title;
    });
  });

  const totalProjectsForFund = history.projects.filter((item) => {
    return item.project.funds.find((fundItem) => {
      return fundItem.name === title;
    });
  }).length;

  // if (totalProjectsForFund === 0 || undefined || null) return null;

  const controls = control();

  return (
    <VerticalWrapper color='secondary' checked={controls.checked}>
      <FormControlLabel
        label={
          <TruncatedTypography
            // variant='body2'
            // color='textSecondary'
            sx={{
              fontSize: '0.75rem',
              color: theme.sideBarSubMenuTitle,
              width: '115px',
            }}
            title={title.length > 20 ? title : undefined}
          >
            {title}
          </TruncatedTypography>
        }
        sx={{
          height: '2rem',
          width: '100%',
          justifyContent: 'space-between', // Ensures the space between title and radio button remains consistent
        }}
        control={
          <Radio
            {...controls}
            style={{ color: '#0000001e' }}
            sx={{
              transform: 'scale(0.7)',
              width: '0rem',
              visibility: 'hidden',
            }}
            defaultChecked
          />
        }
      />
      {newProjects.length > 0 ? (
        <Tooltip title={`Total: ${totalProjectsForFund}`}>
          <FixedWidthChipNew
            label={`New ${
              newProjects.length > 99 ? '99+' : newProjects.length
            }`}
            sx={{
              background:
                props.isDarkMode !== 'light' ? theme.chipIndicator : 'none',
              border:
                props.isDarkMode === 'light'
                  ? `1px solid ${theme.chipIndicator}`
                  : 'none',
              color: theme.chipIndicatorText,
              borderRadius: '5px',
              // textOverflow: 'clip',
              transform: 'scale(0.65)',
              fontSize: '0.95rem',
            }}
          />
        </Tooltip>
      ) : (
        <FixedWidthChip
          label={totalProjectsForFund > 99 ? '99+' : totalProjectsForFund}
          sx={{
            background:
              props.isDarkMode !== 'light' ? theme.subBackground : 'none',
            border: 'none',
            color: theme.sideBarSubMenuTitle,
            maxWidth: '80px',
            width: '80px',
            borderRadius: '5px',
            textOverflow: 'clip',
            transform: 'scale(0.65)',
            fontSize: '0.95rem',
          }}
        />
      )}
    </VerticalWrapper>
  );
}

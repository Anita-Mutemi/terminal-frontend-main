// @ts-nocheck

import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip'; // Import Tooltip
import { useTheme } from 'styled-components';

const SubTitle = styled.h2`
  color: ${({ theme }) => theme.text};
  position: relative;
  font-size: 14px;
  font-weight: 400;
  overflow: hidden;
`;

interface FundInterface {
  name: string;
  logo: string;
}

interface InvestorListInterface {
  funds: FundInterface[];
  header: boolean;
}

export default function InvestorsList({
  funds,
  header,
}: InvestorListInterface) {
  const [showAll, setShowAll] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false); // State for tooltip visibility
  const chipsContainerRef = useRef(null);
  const theme = useTheme();
  const endOfListRef = useRef(null); // Reference to the end of the list

  const toggleShowAll = () => {
    setShowAll(!showAll);

    // Scroll within the chips container if showing all
    if (!showAll && chipsContainerRef.current) {
      setTimeout(() => {
        chipsContainerRef.current.scrollTop =
          chipsContainerRef.current.scrollHeight;
      }, 0);
    }
  };

  // Function to render tooltip content
  const renderTooltipContent = () => {
    return (
      <div>
        {funds.map((fund: FundInterface, index: number) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginTop: '0.1rem',
            }}
          >
            <img
              src={fund.logo ? fund.logo : '/static/images/avatar/1.jpg'}
              // alt={fund.name}
              style={{ width: '20px', height: '20px' }}
            />
            {fund.name}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        overflowX: 'visible',
        maxHeight: '5rem',
        flexDirection: 'column',
      }}
    >
      {header === true && (
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            margin: header === true ? '0rem 0rem 1.3rem 1.3rem' : '0rem',
            flexDirection: 'column',
            marginBottom: '1rem',
          }}
        >
          {funds?.length ? <SubTitle>Signals</SubTitle> : ''}
        </div>
      )}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          margin: header === true ? '0rem 0rem 1.3rem 1.3rem' : '0rem',
          overflowX: 'visible',
          flexDirection: 'column',
          marginBottom: '1rem',
          overflow: 'hidden',
        }}
        ref={chipsContainerRef}
      >
        <div
          style={{
            gap: '0.5rem',
            marginTop: '0.1rem',
            paddingBottom: '0.2rem',
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >
          {funds
            ?.slice(0, showAll ? funds?.length : 3)
            ?.map((fund: FundInterface, index: number) => (
              <Chip
                key={index}
                avatar={
                  <Avatar
                    variant='square'
                    alt='Natacha'
                    sx={{ width: 20, height: 20 }}
                    src={fund.logo ? fund.logo : '/static/images/avatar/1.jpg'}
                  />
                }
                sx={{
                  maxWidth: 'fit-content !important',
                  color: theme.text,
                  borderRadius: '5px',
                  border: 'none',
                  borderColor: theme.borderColor,
                  background: theme.subBackground,
                  flexBasis: funds?.length > 3 ? '33.333333%' : '',
                }}
                label={fund.name}
                variant='outlined'
              />
            ))}
          {funds?.length > 3 && (
            <Tooltip
              title={renderTooltipContent()}
              open={tooltipOpen}
              onOpen={() => setTooltipOpen(true)}
              onClose={() => setTooltipOpen(false)}
              disableFocusListener
              disableHoverListener
              disableTouchListener
            >
              <Chip
                label={showAll ? 'LESS' : 'MORE'}
                onMouseEnter={() => setTooltipOpen(true)}
                onMouseLeave={() => setTooltipOpen(false)}
                sx={{
                  color: theme.text,
                  borderRadius: '5px',
                  border: 'none',
                  borderColor: theme.borderColor,
                  background: theme.subBackground,
                  cursor: 'pointer',
                }}
              />
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
}

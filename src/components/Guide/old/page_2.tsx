// @ts-nocheck

import React from 'react';
import styled from 'styled-components';
import * as GiIcons from 'react-icons/gi';
import * as AiIcons from 'react-icons/ai';
import Arkadash from '../../assets/logo-gray.png';
import { useOutletContext } from 'react-router-dom';

const StyledHeader = styled.div`
  height: 3rem;
  width: 100%;
  border-bottom: 1px solid var(--borders);
  margin-bottom: 1rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;
const StyledMain = styled.div`
  width: 100%;
`;
const StyledSubHeader = styled.div`
  width: 100%;
  margin-bottom: 0.9rem;
`;
const StyledContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
const StyledLogo = styled.div`
  min-width: 2rem;
  display: flex;
  border-radius: 10px;
  justify-content: ${({ sidebar }) => (sidebar ? '' : 'center')};
  align-items: center;
  gap: 0.5rem;
`;
const StyledStatement = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1.1rem;
  font-weight: 100;
  border-radius: 6px;
  background: ${({ theme }) => theme.body};
  align-items: center;
  font-size: 0.88rem;
`;
const StyledEmoji = styled.div`
  font-size: 1.6rem;
`;

const page_2 = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const props = useOutletContext();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <StyledHeader>
        <StyledLogo>
          <img
            src={Arkadash}
            alt='logo'
            style={{
              width: '3rem',
              height: '3rem',
              background: props.isDarkMode === 'light' ? 'black' : '',
              borderRadius: '5.5px',
            }}
          />
          <h1>TwoTensor</h1>
        </StyledLogo>
      </StyledHeader>
      <StyledMain>
        <StyledSubHeader>
          <b>New Release</b>
        </StyledSubHeader>
        <StyledContent>
          <StyledStatement>
            <StyledEmoji>
              <AiIcons.AiFillLock />
            </StyledEmoji>
            Access: Observe real-time intent signals from selected venture funds
            to stay ahead of the market curve.
          </StyledStatement>
          <StyledStatement>
            <StyledEmoji>
              <GiIcons.GiArtificialIntelligence />
            </StyledEmoji>
            Insightful Observation: Monitor incoming deals for a specific fund
            to anticipate market movements.
          </StyledStatement>
          <StyledStatement>
            <StyledEmoji>
              <GiIcons.GiSettingsKnobs />
            </StyledEmoji>
            Competitive Parity: Level the playing field by eradicating
            informational disparities in deal flow.
          </StyledStatement>
        </StyledContent>
      </StyledMain>
    </div>
  );
};

export default page_2;

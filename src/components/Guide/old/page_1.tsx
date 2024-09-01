// @ts-nocheck
import React from 'react';
import styled, { useTheme } from 'styled-components';
import Arkadash from '../../assets/logo-gray.png';
import { useOutletContext } from 'react-router-dom';
import * as GiIcons from 'react-icons/gi';
import * as BsIcons from 'react-icons/bs';

const StyledHeader = styled.div`
  height: 3rem;
  width: 100%;
  border-bottom: 1px solid var(--borders);
  margin-bottom: 1rem;
  display: flex;
  gap: 1rem;
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

const StyledLogo = styled.div`
  min-width: 2rem;
  display: flex;
  border-radius: 10px;
  justify-content: ${({ sidebar }) => (sidebar ? '' : 'center')};
  align-items: center;
  gap: 0.5rem;
`;

const page_1 = () => {
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
          <b>New: Signal Search</b>
        </StyledSubHeader>
        <StyledContent>
          <StyledStatement>
            <StyledEmoji>
              <BsIcons.BsGraphUp />
            </StyledEmoji>
            Insight: Gain a panoramic view of venture funds along with vital
            statistics on their deal-flow activities.
          </StyledStatement>
          <StyledStatement>
            <StyledEmoji>
              <GiIcons.GiRocketThruster />
            </StyledEmoji>
            Performance Tracking: Monitor and compare the deal-flow metrics of
            funds to benchmark performance.
          </StyledStatement>
          <StyledStatement>
            <StyledEmoji>
              <GiIcons.GiScrollQuill />
            </StyledEmoji>
            Strategic Advantage: Effortlessly identify funds with robust
            deal-flow and discern overarching market trends in deal activity.
          </StyledStatement>
        </StyledContent>
      </StyledMain>
    </div>
  );
};

export default page_1;

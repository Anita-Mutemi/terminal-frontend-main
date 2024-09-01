// @ts-nocheck

import React from 'react';
import * as GiIcons from 'react-icons/gi';
import * as BsiIcons from 'react-icons/bs';
import * as AiIcons from 'react-icons/ai';
import * as MdIcons from 'react-icons/md';
import styled from 'styled-components';
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
  align-items: center;
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

const page_3 = () => {
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
              width: '2rem',
              height: '2rem',
              background: props.isDarkMode === 'light' ? 'black' : '',
              borderRadius: '5.5px',
            }}
          />
          <h1>TwoTensor</h1>
        </StyledLogo>
      </StyledHeader>
      <StyledMain>
        <StyledSubHeader>
          <b>We’d love your feedback</b>
        </StyledSubHeader>
        <StyledContent>
          <StyledStatement>
            <StyledEmoji>
              <GiIcons.GiCompass />
            </StyledEmoji>
            Your system has been finely tuned to track the movements of mobility
            deals. Our team works daily to speciate your deals against your
            thesis and strategic goals.
          </StyledStatement>
          <StyledStatement>
            <StyledEmoji>
              <BsiIcons.BsTools />
            </StyledEmoji>
            <span>
              We are engineering you new and exciting functionality as we
              process valuable intelligence in real-time. Continue to interact
              with the terminal and let us know what you like.
            </span>
          </StyledStatement>
        </StyledContent>
      </StyledMain>
    </div>
  );
};

export default page_3;

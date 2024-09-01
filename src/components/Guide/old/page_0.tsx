// @ts-nocheck
import React from 'react';
import styled, { useTheme } from 'styled-components';
import Arkadash from '../../assets/logo-gray.png';
import { useOutletContext } from 'react-router-dom';
import * as GiIcons from 'react-icons/gi';
import * as BsIcons from 'react-icons/bs';
import { FaHeart } from 'react-icons/fa';

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
const StyledStatement2 = styled.div`
  display: flex;
  gap: 1rem;
  padding: 0.5rem 0.7rem 0.5rem 0.7rem;
  font-weight: 100;
  border-radius: 6px;
  line-height: 1.5;
  background: ${({ theme }) => theme.body};
  align-items: center;
  font-size: 0.88rem;
`;
const StyledStatement = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1.1rem;
  font-weight: 100;
  border-radius: 6px;
  line-height: 1.5;
  background: ${({ theme }) => theme.body};
  align-items: center;
  font-size: 0.88rem;
`;
const StyledEmoji = styled.div`
  font-size: 1.5rem;
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
        <StyledContent>
          <StyledStatement2>
            Thanks for your support guys. Building with you in mind ❤
          </StyledStatement2>
          <StyledStatement>
            TwoTensor OS version 10.0.0 - 18/11/23 Release
            <br />
            <br /> Built by the Engineers at TwoTensor.
          </StyledStatement>
        </StyledContent>
      </StyledMain>
    </div>
  );
};

export default page_1;

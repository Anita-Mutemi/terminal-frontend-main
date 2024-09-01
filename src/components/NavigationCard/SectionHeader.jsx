import React from 'react';
import styled from 'styled-components';
import { useOutletContext } from 'react-router-dom';

const StyledCard = styled.div`
  width: 100%;
  height: 7rem;
  min-height: 5rem;
  border-radius: 5.5px;
  background-color: ${({ theme }) => theme.background};
  display: flex;
  align-items: center;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const StyledContainer = styled.div`
  display: flex;
  gap: 2rem;
  padding: 2rem;
  width: 100%;
  position: relative;
`;

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const SvgWrapper = styled.div`
  position: absolute;
  width: 14rem;
  height: 9rem;
  right: 20rem;
  bottom: 2rem;
  transform: scale(0.95) rotate(-45deg);
`;

const SectionHeader = ({ headerText, description, showResurfacing }) => {
  // Using the props directly in the component
  const end = new Date();
  end.setUTCHours(23, 59, 59, 999);
  const props = useOutletContext();

  return (
    <StyledCard mode={props.isDarkMode}>
      <StyledContainer>
        <StyledWrapper>
          <h1 style={{ fontSize: '1.8em', fontWeight: '400' }}>
            {headerText || 'Default Header Text'}
            {showResurfacing && (
              <span
                style={{
                  color: '#1cc6a4',
                  fontSize: '10px',
                  position: 'absolute',
                  top: '1.85rem',
                }}
              >
                NEW
              </span>
            )}
          </h1>
          <p>{description || 'Default Description'}</p>
        </StyledWrapper>

        <SvgWrapper></SvgWrapper>
      </StyledContainer>
    </StyledCard>
  );
};

export default SectionHeader;

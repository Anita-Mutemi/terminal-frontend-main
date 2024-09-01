import React from 'react';
import styled from 'styled-components';
import * as SIIcons from 'react-icons/sl';

const StyledLine = styled.div`
  width: 4.5rem;
  border: 1px solid ${({ theme }) => theme.borderColor};
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.3rem;
`;
const TextContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const FeedEndWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
  gap: 0.8rem;
`;
const FeedEnd = ({ ticker }: any) => {
  return (
    <FeedEndWrapper>
      <IconContainer>
        <StyledLine />
        <SIIcons.SlCheck size='3.5rem' color='#00cf9d' />
        <StyledLine />
      </IconContainer>
      <TextContainer>
        <h4>You're All Caught up</h4>
        {ticker ? (
          <p>Come back too see more opportunities later!</p>
        ) : (
          <p>Submit feedback and return tomorrow!</p>
        )}
      </TextContainer>
    </FeedEndWrapper>
  );
};

export default FeedEnd;

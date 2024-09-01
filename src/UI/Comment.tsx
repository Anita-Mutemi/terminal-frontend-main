import React from 'react';
import styled from 'styled-components';
import * as FaIcons from 'react-icons/fa';
import Moment from 'react-moment';

interface CommentInterface {
  data: {
    user: string;
    feedback_time: string;
    rating: number;
    feedback: string;
  };
}

function createIndicator(rating: string | number) {
  if (Number(rating) === 1) {
    return <RatingIndicator color='#FC0000'>UNFIT</RatingIndicator>;
  }
  if (Number(rating) === 2) {
    return <RatingIndicator color='#FFB800'>GOOD</RatingIndicator>;
  }
  if (Number(rating) === 3) {
    return <RatingIndicator color='#24dc9a'>GREAT</RatingIndicator>;
  }

  return <RatingIndicator color='black'>NONE</RatingIndicator>;
}

const Comment = (props: CommentInterface) => {
  const { user, feedback_time, rating, feedback } = props.data;
  return (
    <CommentWrapper>
      <CommentHeader>
        <ProfilePictureWrapper>
          <img
            src={'https://ui-avatars.com/api/?rounded=true&name=' + user}
            alt='user-logo'
            style={{ width: '2rem' }}
          />
          {/* <FaIcons.FaUserCircle style={{ fontSize: '2.4rem' }} /> */}
        </ProfilePictureWrapper>
        <Wrapper>
          <NameWrapper>
            {user}
            {createIndicator(rating)}
          </NameWrapper>
          <DateWrapper>
            {feedback_time != null ? (
              <Moment fromNow>{feedback_time}</Moment>
            ) : (
              'unknown time'
            )}
          </DateWrapper>
        </Wrapper>
      </CommentHeader>
      <CommentFeedback>
        {feedback ? feedback : 'feedback was not provided'}
      </CommentFeedback>
    </CommentWrapper>
  );
};

const CommentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const RatingIndicator = styled.div`
  padding: 0.2rem 0.6rem 0.2rem 0.6rem;
  border: 1px solid ${({ color }) => color};
  color: ${({ color }) => color};
  font-size: 14px;
  border-radius: 5px;
  justify-content: center;
  margin-right: 1rem;
  align-items: center;
`;

const CommentHeader = styled.div`
  display: flex;
  gap: 0.4rem;
`;

const CommentFeedback = styled.div`
  padding-left: 2.95rem;
  font-size: 14px;
`;
const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0rem;
`;

const ProfilePictureWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const NameWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: space-between;
`;

const DateWrapper = styled.div`
  font-size: 12px;
  color: lightgray;
`;
export default Comment;

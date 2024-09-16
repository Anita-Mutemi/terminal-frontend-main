// @ts-nocheck
import React, { memo, useState, useCallback } from 'react';
import Moment from 'react-moment';
import Rating from '../Rating';
import {
  postFavoriteProject,
  postRating,
} from '../../features/feed/feedActions';
import { Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import styled, { useTheme } from 'styled-components';
import ToggleButton from '../../UI/ToggleButton';
import TableList from '../../UI/TableList';
import Collapse from '@mui/material/Collapse';

interface FeedbackObject {
  comments: any;
  detail: any;
}

type Feedback = string | FeedbackObject;

const Summary = ({
  uuid,
  expandedSectionId,
  info,
  setModal,
  project_user_info,
  handleCommentExpand,
}) => {
  const dispatch = useDispatch();

  const handleChange = (event: Event, newValue: number | number[]) => {
    if (newValue !== 0) {
      setModal(true);
    }
    //@ts-ignore
    dispatch(postRating({ id: uuid, value: newValue }));
  };
  const favouriteHandler = () => {
    //@ts-ignore
    dispatch(postFavoriteProject(uuid));
  };

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
      }}
    >
      {' '}
      <div
        style={{
          maxHeight: '9rem',
          height: '100%',
          position: 'relative',
          width: '100%',
        }}
      >
        <TableList data={info.project.tags}></TableList>
      </div>
      {!!project_user_info?.time_recommended && (
        <MainFooter>
          <FooterWrapper>
            <FooterDate>
              <Moment fromNow>{project_user_info.time_recommended}</Moment>
            </FooterDate>
            <Box sx={{ width: 210 }}>
              <Rating
                value={project_user_info.rating}
                id={uuid}
                handler={handleChange}
              />
            </Box>
            <ToggleButton
              onClick={favouriteHandler}
              clicked={project_user_info.favourite}
            />
          </FooterWrapper>
        </MainFooter>
      )}
    </div>
  );
};

const GeneralInformationWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  /* align-items: center; */
`;

const MainFooter = styled.div`
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: flex-end;
`;

const FooterDate = styled.p`
  color: ${({ theme }) => theme.text};
  font-size: 0.8rem;
  display: flex;
  gap: 0.1rem;
  justify-content: flex-end;
`;

const FeedbackButton = styled.span`
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.subTitle};
  &:hover {
    color: #999999;
  }
`;

const GeneralInformationContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  gap: 1rem;
  width: 93%;
  height: 16rem;
`;

const FooterWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default Summary;

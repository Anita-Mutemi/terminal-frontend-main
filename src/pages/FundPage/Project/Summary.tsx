// @ts-nocheck
import React, { memo, useState, useCallback } from 'react';
import Moment from 'react-moment';
// import Rating from '../Rating';
import { notification } from 'antd';

import {
  postFavoriteProject,
  postRating,
} from '../../../features/feed/feedActions';
import { Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import styled, { useTheme } from 'styled-components';
import ToggleButton from '../../../UI/ToggleButton';
import TableList from '../../../UI/TableList';
import { GeneralErrorBoundary } from '../../../UI/Errors/GeneralErrorBoundary';
import Collapse from '@mui/material/Collapse';
import { CheckCircleOutlined } from '@ant-design/icons';

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
    // @ts-ignore
    dispatch(postFavoriteProject(uuid));

    notification.open({
      message: 'Added to Favorites',
      description: `The project with title "${info?.title}" was added to your favourites.`,
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      duration: 2,
      // You can add an icon, style, or customize it further
    });
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
        {info?.tags.length === 0 || !info?.tags ? (
          <h4>Summary will be provided shortly</h4>
        ) : (
          <GeneralErrorBoundary customMessage='Summary is not available'>
            <TableList data={info?.tags}></TableList>
          </GeneralErrorBoundary>
        )}
      </div>
      {info?.time_published && (
        <MainFooter>
          <FooterWrapper>
            <FooterDate>
              {/* <Moment fromNow>{info?.time_published}</Moment> */}
            </FooterDate>
            <Box sx={{ width: 210 }}>
              {/* <Rating value={project_user_info.rating} id={uuid} handler={handleChange} /> */}
            </Box>
            <ToggleButton onClick={favouriteHandler} clicked={false} />
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

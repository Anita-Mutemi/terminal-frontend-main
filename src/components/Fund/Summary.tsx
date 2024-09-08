/* eslint-disable @typescript-eslint/no-unused-vars */
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
import TableList from './TableList';
import Collapse from '@mui/material/Collapse';

interface FeedbackObject {
  comments: any;
  detail: any;
}

type Feedback = string | FeedbackObject;

const Summary = ({ uuid, info, setModal, project_user_info }) => {
  const dispatch = useDispatch();

  console.log('SUMMARY', info);

  const {
    founded_year,
    industry_focus,
    notable_investments,
    recent_co_investors,
    rounds_this_quarter,
    team_locations,
    team_size,
    total_aum,
  } = info;

  // founded_year
  // industry_focus
  // investments (number)
  // notable_investments
  // recent_co_investors
  // rounds_this_quarter
  // team_locations
  // team_size
  // total_aum

  const tagsData = [
    { title: 'founded', content: founded_year },
    { title: 'focus', content: industry_focus },
    {
      title: 'investments',
      content:
        notable_investments === null || notable_investments === '...'
          ? null
          : notable_investments,
    },
    {
      title: 'co-investors',
      content:
        recent_co_investors === null || recent_co_investors === '...'
          ? null
          : recent_co_investors,
    },
    {
      title: 'rounds',
      content:
        rounds_this_quarter === null || rounds_this_quarter === '...'
          ? null
          : rounds_this_quarter,
    },
    {
      title: 'locations',
      content:
        team_locations === null || team_locations === '...'
          ? null
          : team_locations,
    },
    {
      title: 'team',
      content: team_size === null || team_size === '...' ? null : team_size,
    },
    {
      title: 'AUM',
      content: total_aum === null || total_aum === '...' ? null : total_aum,
    },
  ].filter((tag) => tag.content !== null);

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

  // {title: "founded", content: "2022"

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        width: '94%',
        flexDirection: 'column',
        // marginTop: '1.5rem',
        justifyContent: 'space-around',
      }}
    >
      {' '}
      <TableList data={tagsData}></TableList>
      {!!project_user_info?.time_recommended && (
        <MainFooter>
          <FooterWrapper></FooterWrapper>
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

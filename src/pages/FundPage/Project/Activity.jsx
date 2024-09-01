// ActivityLineGraph.js
import React, { useState } from 'react';
import TimeLine from './TimeLine';
import TimelineGraph from './TimelineGraph';
import Moment from 'react-moment';
import * as BsIcons from 'react-icons/bs';
import { Box } from '@mui/material';
import TimeSpanIndicator from '../TimeSpanIndicator';
import { notification } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

import {
  postFavoriteProject,
  postRating,
} from '../../../features/feed/feedActions';
import { useDispatch } from 'react-redux';
import styled, { useTheme } from 'styled-components';
import ToggleButton from '../../../UI/ToggleButton';
import { Button, Row, Col } from 'antd';
import { UnorderedListOutlined, DotChartOutlined } from '@ant-design/icons';
import { GeneralErrorBoundary } from '../../../UI/Errors/GeneralErrorBoundary';

const generateYearData = () => {
  const yearData = [];
  for (let i = 1; i <= 365; i++) {
    yearData.push({ day: i, count: 0, companyNames: [] });
  }
  return yearData;
};

const DualIconButton = ({ onListClick, onGraphClick, view }) => {
  const theme = useTheme();

  return (
    <Button
      type={'Default'}
      style={{
        padding: 0,
        height: 'auto',
        border: `1px solid ${theme.borderColor}`,
        cursor: 'pointer',
        borderRadius: '21px',
        overflow: 'hidden',
      }}
    >
      <Row
        gutter={8}
        style={{ overflow: 'hidden', borderRadius: '15px', margin: '0rem' }}
      >
        <Col
          onClick={onListClick}
          style={{
            borderRight: `1px solid ${theme.borderColor}`,
            padding: '5px 9px',
            cursor: 'pointer',
            background: view === 'list' ? '#2fb0a3' : 'transparent',
            overflow: 'hidden',
          }}
        >
          <UnorderedListOutlined style={{ color: theme.text }} />
        </Col>
        <Col
          onClick={onGraphClick}
          style={{
            padding: '5px 9px',
            cursor: 'pointer',
            background: view === 'graph' ? '#2fb0a3' : 'transparent',
            overflow: 'hidden',
          }}
        >
          <DotChartOutlined style={{ color: theme.text }} />
        </Col>
      </Row>
    </Button>
  );
};

const ActivityLineGraph = ({
  uuid,
  expandedSectionId,
  info,
  setModal,
  project_user_info,
  handleCommentExpand,
  showFeedback = true,
  access_token,
}) => {
  const dispatch = useDispatch();
  const [currentView, currentViewSetter] = useState('lineGraph');

  const chartTypeOptions = [
    { label: 'Bar Chart', value: 'barChart', icon: <UnorderedListOutlined /> }, // Use the Bar Chart icon
    { label: 'Line Graph', value: 'lineGraph', icon: <BsIcons.BsGraphUp /> }, // Use the Line Graph icon
  ];

  const handleChartTypeChange = (newChartType = 'lineGraph') => {
    // Callback function to handle chart type change
    currentViewSetter(newChartType);
    // You can perform additional actions here based on the selected chart type

  };



  const handleChange = (event, newValue) => {
    if (newValue !== 0) {
      setModal(true);
    }
    dispatch(postRating({ id: uuid, value: newValue }));
  };
  const favouriteHandler = () => {
    dispatch(postFavoriteProject(uuid));
    notification.open({
      message: 'Added to Favorites',
      description: `The project with title "${info?.title}" was added to your favourites.`,
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      duration: 2,
      // You can add an icon, style, or customize it further
    });
  };

  const handleListClick = () => {
    currentViewSetter('list');
  };

  const handleGraphClick = () => {
    currentViewSetter('graph');
  };

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        position: 'relative',
      }}
    >
      <div
        style={{ position: 'absolute', right: '0rem', top: '1rem', zIndex: 99 }}
      >
        <TimeSpanIndicator
          options={chartTypeOptions}
          onChange={handleChartTypeChange}
          small={true}
        />
        {/* <DualIconButton
          onListClick={handleListClick}
          onGraphClick={handleGraphClick}
          view={currentView}
        /> */}
      </div>
      <div style={{ maxHeight: '9rem', height: '100%', width: '100%' }}>
        {currentView === 'lineGraph' ? (
          <GeneralErrorBoundary customMessage='Cannot load the graph'>
            <TimelineGraph uuid={uuid} access_token={access_token} title={info.title} />
          </GeneralErrorBoundary>
        ) : (
          <GeneralErrorBoundary customMessage='Cannot load the timeline'>
            <TimeLine uuid={uuid} access_token={access_token} />
          </GeneralErrorBoundary>
        )}
      </div>
      {/* <TableList data={info.project.tags}></TableList> */}
      {showFeedback && !!project_user_info?.time_recommended && (
        <MainFooter>
          <FooterWrapper>
            <FooterDate>
              <Moment fromNow>{project_user_info.time_recommended}</Moment>
            </FooterDate>
            {/* <Box sx={{ width: 210 }}>
              <Rating value={project_user_info.rating} id={uuid} handler={handleChange} />
            </Box> */}
            <ToggleButton
              onClick={favouriteHandler}
              clicked={project_user_info.favourite}
            />
          </FooterWrapper>
        </MainFooter>
      )}
      <MainFooter>
        <FooterWrapper>
          <Box sx={{ width: 210 }}>
            {/* <Rating value={project_user_info.rating} id={uuid} handler={handleChange} /> */}
          </Box>
          <ToggleButton onClick={favouriteHandler} />
        </FooterWrapper>
      </MainFooter>
    </div>
  );
};

export default ActivityLineGraph;

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

const FooterWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

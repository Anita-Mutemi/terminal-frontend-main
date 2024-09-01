import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import Project from '../Project';
import NavigationCard from '../NavigationCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import DashboardContext from '../../hooks/DashboardContext';
import { Oval } from 'react-loader-spinner';
import ActionsDial from '../ActionsDial';
import ControlPanel from '../ControlPanel';
import FeedEnd from '../../UI/FeedEnd';
import Typography from '@mui/material/Typography';

const FeedWrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.body};
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
  overflow-x: hidden;
`;

const FeedContainer = styled.div`
  min-width: ${({
    // @ts-ignore
    width,
  }) => width + '%'};
  /* @ts-ignore */
  width: ${({
    // @ts-ignore
    width,
  }) => width + '%'};
  /* width: 100%; */
  display: flex;
  margin-top: 0.2rem;
  flex-direction: column;
  padding-right: 0.65rem;
  margin-right: -0.5rem;
  gap: 1rem;
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 9.5px;
    height: 2.5px;
  }
  ::-webkit-scrollbar-track {
    box-shadow: none;
    margin-top: 1rem;
    margin-bottom: 0.8rem;
    /* border: 1px solid #878990; */
    border-radius: 1.5px;
  }
  ::-webkit-scrollbar-thumb {
  }
  overflow-x: hidden;
`;

const NavigationCardContainer = styled.div`
  width: 100%;
  margin-top: 1rem;
`;

const Feed = ({ showBanner = true, width = 98 }) => {
  // @ts-ignore
  const {
    // @ts-ignore
    feedProps: {
      projects,
      showResurfacing,
      searchQuery,
      loading,
      feedType,
      error,
      handleClose,
      open,
      setOpen,
    },
  } = useContext(DashboardContext);

  const [slicedProjects, setSlicedProjects] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [expandedSectionId, setExpandedSectionId] = useState('');

  console.log(feedType);
  const handleCommentExpand = (id: string) => {
    if (id === expandedSectionId) {
      setExpandedSectionId('');
      return;
    }
    setExpandedSectionId(id);
    return;
  };

  useEffect(() => {
    setSlicedProjects(projects.slice(0, 6));
    setHasMore(true);
  }, [projects]);

  useEffect(() => {
    if (projects.length > 0 && projects.length === slicedProjects.length) {
      setHasMore(false);
    }
  }, [projects, slicedProjects]);

  const fetchMoreProjects = () => {
    setTimeout(() => {
      setSlicedProjects(projects.slice(0, slicedProjects.length + 2));
    }, 500);
  };

  const fund = {
    title: 'Wil',
    logo: 'https://global-uploads.webflow.com/629b57a8eb19ac329e25470f/637281d9c1d21733b9b75aef_wil_logo-dots.8380b8cb.svg',
    confidence: 'high',
  };

  if (error) {
    return (
      <FeedWrapper>
        {/* @ts-ignore */}
        <FeedContainer id='feed' width={width}>
          <NavigationCardContainer>
            {showBanner && <NavigationCard showResurfacing={showResurfacing} />}
          </NavigationCardContainer>
          <h3 style={{ padding: '1rem' }}>
            Something went wrong... we already looking into the problem.
          </h3>
        </FeedContainer>
      </FeedWrapper>
    );
  }

  return (
    <FeedWrapper>
      {!loading ? (
        projects.length > 0 ? (
          // @ts-ignore
          <FeedContainer id='feed' width={width}>
            <NavigationCardContainer>
              {showBanner && (
                <NavigationCard showResurfacing={showResurfacing} />
              )}
            </NavigationCardContainer>
            {feedType === 'favourites' && <ControlPanel></ControlPanel>}
            <InfiniteScroll
              // @ts-ignore
              dataLength={slicedProjects.length}
              next={fetchMoreProjects}
              hasMore={hasMore}
              scrollableTarget='feed'
              endMessage={searchQuery === '' && <FeedEnd />}
              loader={
                <Oval
                  height={50}
                  width={50}
                  color='#484848'
                  wrapperStyle={{}}
                  wrapperClass=''
                  visible={true}
                  ariaLabel='oval-loading'
                  secondaryColor='#222222'
                  strokeWidth={2}
                  strokeWidthSecondary={2}
                />
              }
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '.5rem',
                overflow: 'hidden',
              }}
            >
              {slicedProjects.map((project: any) => {
                return (
                  <Project
                    key={project.project.uuid}
                    uuid={project.project.uuid}
                    info={project}
                    newSignal={showResurfacing}
                    title={project.project.title}
                    expandedSectionId={expandedSectionId}
                    handleCommentExpand={handleCommentExpand}
                    project_user_info={project.project_user_info}
                    verticals={project.project.verticals}
                    triggerPopUp={setOpen}
                    logo='https://global-uploads.webflow.com/629b57a8eb19ac329e25470f/637281dbf61e976695e9a86f_1656622331793.jpg'
                    investor={fund}
                  />
                );
              })}
            </InfiniteScroll>
          </FeedContainer>
        ) : searchQuery.length > 0 ? (
          <FeedContainer id='feed'>
            <Typography sx={{ paddingLeft: '2rem' }}>
              Project with the name: <b>"{searchQuery}"</b> is not found
            </Typography>
          </FeedContainer>
        ) : (
          <FeedContainer id='feed'>
            <Typography
              sx={{
                paddingLeft: '2rem',
                paddingTop: '2rem',
                fontSize: '1.2rem',
              }}
            >
              Engage with "Feed" to see more opportunities!
            </Typography>
          </FeedContainer>
        )
      ) : (
        <FeedContainer id='feed'>
          <Oval
            height={50}
            width={50}
            color='#484848'
            wrapperStyle={{}}
            wrapperClass=''
            visible={true}
            ariaLabel='oval-loading'
            secondaryColor='#222222'
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </FeedContainer>
      )}
      <ActionsDial />
    </FeedWrapper>
  );
};

export default Feed;

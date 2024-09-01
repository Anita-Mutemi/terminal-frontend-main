// @ts-nocheck
import React, { useCallback, useEffect, useState, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import InvestorsList from '../../components/InvsetorsList';
import axios from 'axios';
import LanguageIcon from '@mui/icons-material/Language';
import { TabPanel } from '../../components/Project/Panel';
import Contact from '../../components/Project/Contact';
import ToggleButton from '../../UI/ToggleButton';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch } from 'react-redux';
import { ReactComponent as Crunchbase } from '../../assets/crunchbase.svg';
import { ReactComponent as Email } from '../../assets/email.svg';
import { ReactComponent as Twitter } from '../../assets/twitter.svg';
import { ReactComponent as LinkedIn } from '../../assets/linkedin.svg';
import { ReactComponent as LinkedInOwner } from '../../assets/linkedinowner.svg';
import { ReactComponent as Pitchbook } from '../../assets/pitchbook.svg';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import Moment from 'react-moment';
import ActivityLineGraph from '../../components/Project/Activity';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LargeRating from '../../components/Rating/LargeRating';
import { Oval } from 'react-loader-spinner';
import Comment from '../../UI/Comment';

import {
  postFavoriteProjectFull,
  postRatingFull,
  postFeedback,
} from '../../features/feed/feedActions';

import Button from '@mui/material/Button';

import { useSelector } from 'react-redux';
import TableList from '../../UI/TableList';
import FeedBack from '../../components/FeedBack';
import { GeneralErrorBoundary } from '../../UI/Errors/GeneralErrorBoundary';

function a11yProps(index: number) {
  return {
    'id': `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const ProjectPage = () => {
  const markdown = `# Coming soon...
`;

  const [open, setOpen] = React.useState(false);
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <IconButton size='small' aria-label='close' color='inherit' onClick={handleClose}>
        <CloseIcon fontSize='small' />
      </IconButton>
    </React.Fragment>
  );

  const navigate = useNavigate();
  const favouriteHandler = () => {
    //@ts-ignore
    dispatch(postFavoriteProjectFull(project.project.uuid));
  };
  const params = useParams();
  const dispatch = useDispatch();

  const [value, setValue] = useState('');
  const [errorFeedback, setError] = useState(false);
  const handleChange = (event: {
    target: { value: any[] | React.SetStateAction<string> };
  }) => {
    // @ts-ignore
    setValue(event.target.value);
    setError(event.target.value.length < 20);
  };

  const tabHandler = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const theme = useTheme();

  const [project, setProject] = useState({
    project: { socials: [], funds: [], tags: [] },
    project_user_info: { feedback: '' },
  });
  const [feedback, setFeedback] = useState([]);

  const { loading, error, userInfo, access_token } = useSelector(
    (state: any) => state.user,
  );
  const getFeed = useCallback(async () => {
    if (access_token) {
      try {
        // get user data from store
        // configure authorization header with user's token
        const config = {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        };
        const { data } = await axios.get(`/v1/projects/${params.id}`, config);
        setProject(data);
        return data;
      } catch (error: any) {
        console.log(error);
      }
    }
  }, [params.id, access_token]);

  const getFeedback = useCallback(async () => {
    if (access_token) {
      try {
        // get user data from store
        // configure authorization header with user's token
        const config = {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        };
        const { data } = await axios.get(`/v1/projects/${params.id}/comments`, config);
        setFeedback(data);
        return data;
      } catch (error: any) {
        setFeedback('error');
        console.log(error);
      }
    }
  }, [params.id, access_token]);

  const renderFeedback = () => {
    if (feedback['comments']) {
      if (feedback?.comments.length > 0 && feedback !== 'error') {
        return feedback.comments.map((review) => {
          return <Comment data={review} />;
        });
      }
      if (feedback.comments.length === 0) {
        return <h3>No feedback has been provided yet.</h3>;
      }
    }
    if (
      feedback['detail'] ===
      'team comments can only be viewed after the user submits feedback'
    ) {
      return <h5>Team feeback can only be viewed after you submit your feedback</h5>;
    }
    if (feedback === 'error') {
      return <h5>Something went wrong, please notify our team about it.</h5>;
    }
    if (feedback === '') {
      return (
        <Oval
          height={60}
          width={60}
          color='#484848'
          wrapperStyle={{}}
          wrapperClass=''
          visible={true}
          ariaLabel='oval-loading'
          secondaryColor='#222222'
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      );
    }
  };

  const logos = {
    crunchbase: <Crunchbase fill={theme.iconColor} style={{ fill: theme.iconColor }} />,
    email: <Email fill={theme.iconColor} style={{ fill: theme.iconColor }} />,
    twitter: <Twitter fill={theme.iconColor} style={{ fill: theme.iconColor }} />,
    linkedin: <LinkedIn fill={theme.iconColor} style={{ fill: theme.iconColor }} />,
    linkedinowner: (
      <LinkedInOwner fill={theme.iconColor} style={{ fill: theme.iconColor }} />
    ),
    pitchbook: <Pitchbook fill={theme.iconColor} style={{ fill: theme.iconColor }} />,
  };
  const buttonSides = 44;

  const location = useLocation();
  const prevUrl = useRef('');

  useEffect(() => {
    getFeed();
    getFeedback();
  }, [getFeed, getFeedback]);
  const postFeedbackHandler = (newValue: number | number[]) => {
    dispatch(postFeedback({ id: project.project.uuid, value: value }));
    getFeedback();
    setOpen(true);
  };
  const handleChangeRating = (event: Event, newValue: number | number[]) => {
    //@ts-ignore
    dispatch(postRatingFull({ id: project.project.uuid, value: newValue }));
  };

  const handleClick = () => {
    if (prevUrl.current === location.pathname && window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/curated-list');
    }
  };
  useEffect(() => {
    prevUrl.current = location.pathname;
  }, [location.pathname]);
  return (
    <div
      style={{
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      <StyledNav>
        <div
          style={{
            width: '90%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <StyledWrapper>
            <StyledButton onClick={handleClick}>🡠 Terminal</StyledButton>
          </StyledWrapper>
          <StyledWrapper logo={true}>
            <StyledLogo>TwoTensor</StyledLogo>
          </StyledWrapper>
          <StyledWrapper></StyledWrapper>
        </div>
      </StyledNav>
      <ProjectWrapper>
        {project.project.title ? (
          <ProjectContainer>
            <ProjectDescription>
              <GeneralErrorBoundary>
                <StyledProjectHeader>
                  <Moment fromNow>{project?.project_user_info?.time_recommended}</Moment>
                </StyledProjectHeader>
              </GeneralErrorBoundary>
              <div style={{ display: 'flex' }}>
                <ProjectDescriptionLeft>
                  <HeaderContentWrapper>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '0.7rem',
                      }}
                    >
                      {project?.project.logo ? (
                        <Logo src={`${project?.project?.logo}`} />
                      ) : (
                        <PlaceholderLogo>N/A</PlaceholderLogo>
                      )}
                      <div>
                        <ProjectName>{project.project.title}</ProjectName>
                        <ProjectLocation>
                          {project.project.verticals
                            ? project.project.verticals.join(', ')
                            : 'not specified'}
                        </ProjectLocation>
                      </div>
                    </div>
                  </HeaderContentWrapper>
                </ProjectDescriptionLeft>
                <ProjectDescriptionRight>{project.project.about}</ProjectDescriptionRight>
              </div>
              <StyledProjectHeader>
                <ToggleButton
                  onClick={favouriteHandler}
                  clicked={project?.project_user_info.favourite}
                />
              </StyledProjectHeader>
            </ProjectDescription>
            <ProjectMainContainer>
              <MetricsContainer>
                <div>
                  <h3>Tags</h3>
                  <br />
                  <TableList data={project.project.tags}></TableList>
                </div>
                <div>
                  <h3>Funds</h3>
                  <br />
                  {project.project.funds && (
                    <InvestorsList funds={project.project.funds} header={false} />
                  )}
                </div>
              </MetricsContainer>
              <OtherContainer>
                <SocialContainer>
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.6rem',
                      overflowX: 'auto',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <h3> {project.project.title} Presence</h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      {project.project.website && (
                        <Button
                          variant='outlined'
                          size='small'
                          color='inherit'
                          href={project.project.website}
                          rel='noreferrer'
                          target='_blank'
                          sx={{
                            'borderColor': theme.borderColor,
                            'width': buttonSides,
                            'minWidth': buttonSides,
                            'height': buttonSides,
                            'borderRadius': '5px',
                            '& .MuiButton-startIcon': { margin: 0 },
                          }}
                        >
                          <LanguageIcon
                            fontSize='small'
                            sx={{ transform: 'scale(1.28)' }}
                          />
                        </Button>
                      )}
                      {project.project.socials.map((item: any) => {
                        return (
                          <Button
                            variant='outlined'
                            size='small'
                            color='inherit'
                            href={item.icon === 'email' ? 'mailto:' + item.url : item.url}
                            rel='noreferrer'
                            target='_blank'
                            sx={{
                              'borderColor': theme.borderColor,
                              'minWidth': buttonSides,
                              'height': buttonSides,
                              'borderRadius': '5px',
                              '& .MuiButton-startIcon': { margin: 0 },
                              'fontSize': '0.6rem',
                            }}
                          >
                            {item.icon ? logos[item.icon] : item.title}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </SocialContainer>
                <MarkDownContainer>
                  {project.project.markdown_description ? (
                    <>
                      <h3 style={{ fontWeight: '400' }}>Why does it fit?</h3>
                      <br />
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '1rem',
                          width: '100%',
                          maxHeight: '15rem',
                          whiteSpace: 'initial',
                          overflowY: 'scroll',
                        }}
                      >
                        <ReactMarkdown
                          remarkPlugins={[remarkBreaks]}
                          children={project.project.markdown_description}
                        />
                      </div>
                    </>
                  ) : (
                    <h3 style={{ color: theme.text }}>
                      Request the "deep dive" to get more data about the project!
                    </h3>
                  )}
                </MarkDownContainer>
              </OtherContainer>
            </ProjectMainContainer>
            <ProjectMainContainer>
              <FeedbackContainer>
                <StyledFeedback>
                  <div
                    style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
                  >
                    <h3>Feedback / Deep Dive request</h3>
                    <StyledDescription>
                      We value and appreciate your feedback that you may have as it allows
                      us to continually improve and enhance our research and provide you
                      better deals.
                    </StyledDescription>
                  </div>
                  <StyledFeedbackContainer>
                    <div
                      style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        gap: '2rem',
                      }}
                    >
                      <LargeRating
                        value={project.project_user_info.rating}
                        id={project.project.id}
                        handler={handleChangeRating}
                      />
                      <TextField
                        id='outlined-multiline-flexible'
                        placeholder='Enter your feedback here'
                        multiline
                        defaultValue={project.project_user_info.feedback}
                        rows={6}
                        maxRows={6}
                        inputProps={{ style: { color: theme.text } }}
                        onChange={handleChange}
                        sx={{ width: '100%' }}
                      />
                      {/* {errorFeedback && (
                        <Typography
                          sx={{
                            color: 'red',
                            fontSize: '0.8rem',
                            position: 'absolute',
                            bottom: '2.5rem',
                            left: '0.5rem',
                          }}
                        >
                          Feedback must be at least 30 characters
                        </Typography>
                      )} */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                        }}
                      >
                        <StyledButton variant='contained' onClick={postFeedbackHandler}>
                          Send
                        </StyledButton>
                      </div>
                    </div>
                  </StyledFeedbackContainer>
                </StyledFeedback>
              </FeedbackContainer>
              <TeamFeedback>
                <TeamFeedbackContainer>
                  <h3>Actions</h3>
                  <Tabs
                    value={tabIndex}
                    onChange={tabHandler}
                    TabIndicatorProps={{
                      sx: { background: theme.text },
                    }}
                    sx={{
                      paddingLeft: '-0.5rem',
                      overflowY: 'auto',
                    }}
                  >
                    <Tab
                      label='Engage'
                      {...a11yProps(0)}
                      sx={{
                        'height': '1rem',
                        'fontSize': '0.8rem',
                        'padding': '0rem',
                        'color': theme.text,
                        '&.Mui-selected': {
                          color: theme.text,
                        },
                      }}
                    />
                    <Tab
                      label='Timeline'
                      {...a11yProps(1)}
                      sx={{
                        'height': '1rem',
                        'fontSize': '0.8rem',
                        'padding': '0rem',
                        'color': theme.text,
                        '&.Mui-selected': {
                          color: theme.text,
                        },
                      }}
                    />
                    <Tab
                      label='Feedback'
                      {...a11yProps(2)}
                      onClick={() => getFeedback()}
                      sx={{
                        'height': '100%',
                        'fontSize': '0.8rem',
                        'padding': '0rem',
                        'overflowY': 'auto',
                        'color': theme.text,
                        '&.Mui-selected': {
                          color: theme.text,
                        },
                      }}
                    />
                  </Tabs>
                  <FeedBackListContainer>
                    <TabPanel
                      value={tabIndex}
                      index={0}
                      sx={{
                        padding: '0rem',
                        background: 'red',
                        overflowY: 'auto',
                      }}
                    >
                      <FeedBackList>
                        <Contact
                          uuid={params.id}
                          access_token={access_token}
                          userInfo={userInfo}
                          company={project.project.title}
                        />
                      </FeedBackList>
                    </TabPanel>
                    <TabPanel
                      value={tabIndex}
                      index={1}
                      sx={{
                        padding: '0rem',
                        background: 'red',
                        overflowY: 'auto',
                        height: '15rem',
                      }}
                    >
                      <TimeLineContainer>
                        <ActivityLineGraph
                          uuid={params.id}
                          project_user_info={project.project_user_info}
                          access_token={access_token}
                          showFeedback={false}
                        ></ActivityLineGraph>
                      </TimeLineContainer>
                    </TabPanel>
                    <TabPanel
                      value={tabIndex}
                      index={2}
                      sx={{
                        padding: '0rem',
                        background: 'red',
                        overflowY: 'auto',
                      }}
                    >
                      <FeedBackList>{renderFeedback()}</FeedBackList>
                    </TabPanel>
                  </FeedBackListContainer>
                </TeamFeedbackContainer>
              </TeamFeedback>
            </ProjectMainContainer>
          </ProjectContainer>
        ) : (
          <Oval
            height={60}
            width={60}
            color='#484848'
            wrapperStyle={{}}
            wrapperClass=''
            visible={true}
            ariaLabel='oval-loading'
            secondaryColor='#222222'
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        )}
      </ProjectWrapper>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message='Your feedback has been submitted'
        action={action}
      />
    </div>
  );
};

export default ProjectPage;

const FeedBackList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
  padding: 1.5rem;
  width: 90%;
  backround: red;
`;

const StyledNav = styled.nav`
  width: 100%;
  height: 3rem;
  background-color: ${({ theme }) => theme.background};
  padding: 1rem;
  display: flex;
  gap: 0.1rem;
  justify-content: center;
  align-items: center;
`;

const StyledProjectHeader = styled.div`
  width: 100%;
  padding: 0rem;
  display: flex;
  justify-content: flex-end;
`;

const StyledProjectFooter = styled.div`
  width: 100%;
  padding: 1rem;
`;

const ProjectWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;

const StyledDescription = styled.div`
  font-size: 0.8rem;
  color: #939393;
`;

const ProjectDescription = styled.div`
  border-radius: 15px;
  background-color: ${({ theme }) => theme.background};
  display: flex;
  flex-direction: column;
  padding: 1rem 2rem 1rem 2rem;
  display: flex;
  gap: 1rem;
`;
const ProjectDescriptionLeft = styled.div`
  display: flex;
  align-items: center;
  width: 45%;
`;
const HeaderContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding-left: 1rem;
`;
const ProjectName = styled.h1`
  font-size: 1.5rem;
  font-weight: 400;
`;

const PlaceholderLogo = styled.div`
  width: 3rem;
  height: 3rem;
  background: #dedede;
  text-align: center;
  color: #a6a6a6;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
`;
const Logo = styled.img`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: #dedede;
`;
const ProjectLocation = styled.span`
  font-size: 0.8rem;
`;

const ProjectDescriptionRight = styled.div`
  width: 60%;
  max-width: 46rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProjectMainContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 1rem;
`;

const MetricsContainer = styled.div`
  width: 40%;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  border-radius: 15px;
  background-color: ${({ theme }) => theme.background};
  min-height: 25rem;
`;
const FeedbackContainer = styled.div`
  width: 40%;
  display: flex;
  padding: 1.5rem;
  flex-direction: column;
  gap: 2rem;
  border-radius: 15px;
  background-color: ${({ theme }) => theme.background};
`;

const FeedBackListContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;
const TimeLineContainer = styled.div`
  width: 100%;
  height: 100%;
`;
const TeamFeedback = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  border-radius: 15px;
  background-color: ${({ theme }) => theme.background};
`;
const TeamFeedbackContainer = styled.div`
  padding: 1.5rem;
  margin-bottom: 1rem;
  max-height: 25rem;
  /* background-color: ${({ theme }) => theme.background}; */
`;

const OtherContainer = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SocialContainer = styled.div`
  padding: 1.5rem;
  border-radius: 15px;
  background-color: ${({ theme }) => theme.background};
`;
const MarkDownContainer = styled.div`
  height: 100%;
  max-height: 25rem;
  overflow-y: auto;
  padding: 1.5rem;
  border-radius: 15px;
  background-color: ${({ theme }) => theme.background};
`;

const ProjectContainer = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StyledWrapper = styled.div`
  width: 33%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: ${({ logo }) => (logo ? 'center' : '')};
`;

const StyledFeedback = styled.div`
  background-color: ${({ theme }) => theme.background};
  border-radius: 15px;
  margin-bottom: 3rem;
`;

const StyledButton = styled.button`
  color: white;
  background-color: ${({ theme }) => theme.buttonColor};
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 5px;
  padding: 0.85rem 1rem 0.725rem 1rem;
`;

const StyledLogo = styled.h1`
  color: ${({ theme }) => theme.text};
  font-weight: 600;
`;

const StyledFeedbackContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

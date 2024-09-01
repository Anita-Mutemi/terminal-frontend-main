// @ts-nocheck
import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import Summary from './Summary';
import Chip from '@mui/material/Chip';
import { useOutletContext } from 'react-router-dom';
import { TabPanel } from './Panel';
import axios from 'axios';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import useExportData from '../../../hooks/useExportData';
import Box from '@mui/material/Box';
import { IoSquareOutline } from 'react-icons/io5';
import { Dropdown, Menu } from 'antd';
import CopyWrapper from '../../../HOC/CopyText';
import { EllipsisOutlined } from '@ant-design/icons';
import { ReactComponent as Crunchbase } from '../../../assets/crunchbase.svg';
import { ReactComponent as Email } from '../../../assets/email.svg';
import { ReactComponent as Twitter } from '../../../assets/twitter.svg';
import { ReactComponent as LinkedIn } from '../../../assets/linkedin.svg';
import { ReactComponent as LinkedInOwner } from '../../../assets/linkedinowner.svg';
import { ReactComponent as Pitchbook } from '../../../assets/pitchbook.svg';
import ActivityLineGraph from './Activity';
import { Typography } from 'antd';
import { postFeedback } from '../../../features/feed/feedActions';
import { useDispatch } from 'react-redux';
import InvestorsList from '../../../components/InvsetorsList';
import Contact from './Contact';
import LanguageIcon from '@mui/icons-material/Language';
import { useSelector } from 'react-redux';
import FeedBack from '../../../components/FeedBack';
import { GeneralErrorBoundary } from '../../../UI/Errors/GeneralErrorBoundary';

const ProjectWrapper = styled.div`
  width: 100%;
  /* height: 100%; */
  max-height: 22rem;
  display: flex;
  gap: 1.1rem;
  align-self: center;
  background: ${({ theme }) => theme.body};
`;

const MainBlock = styled.div`
  width: 60%;
  max-width: 60%;
  min-width: 60%;
  border-radius: 5.5px;
  max-height: 28rem;
  position: relative;
  background: ${({ theme }) => theme.background};
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  /* border: 1px solid ${({ theme }) => theme.borderColor}; */
`;

const MainHeader = styled.div`
  width: 100%;
  height: 6rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-top: 0.5rem;
  padding-bottom: 0.5rem;
`;

const HeaderContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  position: relative;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.text};
  position: relative;
  font-size: 1.25em;
  font-weight: 400;
`;

const SubTitle = styled.h2`
  color: ${({ theme }) => theme.text};
  position: relative;
  font-size: 14px;
  line-height: 1.6;
  font-weight: 400;
  max-width: 20rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const DescriptionText = styled.p`
  color: ${({ theme }) => theme.subText};
  /* color: #58585b; */
  line-height: 1.5;
  position: relative;
  font-size: 12px;
  &:before {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    width: 4rem;
    height: 4px;
    left: 0.2rem;
    border-bottom: 1px solid ${({ theme }) => theme.text};
  }
`;

const Logo = styled.img`
  width: 2rem;
  height: 2rem;
  background: #dedede;
  /* border: 1px solid ${({ theme }) => theme.borderColor}; */
`;

const PlaceholderLogo = styled.div`
  width: 2rem;
  height: 2rem;
  background: ${({ theme }) => theme.background};
  text-align: center;
  color: ${({ theme }) => theme.text};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Rate = styled.div`
  background-color: transparent;
  display: flex;
  gap: 0.3rem;
  font-size: 1.1rem;
`;

const ProjectName = styled.h1`
  font-size: 1.5rem;
  font-weight: 400;
  overflow: hidden;
  max-width: 27rem;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const ProjectLocation = styled.span`
  color: ${({ theme }) => theme.subText};
  font-size: 0.8rem;
  margin-left: 0.1rem;
  display: block;
  overflow: hidden;
  max-width: 35rem;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const DescriptionBlock = styled.div`
  width: 40%;
  max-width: 40%;
  /* min-width: 40%; */
  min-height: 20rem;
  padding-top: 1rem;
  margin-right: 0.5rem;
  border-radius: 5.5px;
  background: ${({ theme }) => theme.background};
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  /* border: 1px solid ${({ theme }) => theme.borderColor}; */
`;

const DescriptionWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  margin: 0.5rem 1.3rem 1.3rem 1.3rem;
  overflow: hidden;
  gap: 0.4rem;
  flex-direction: column;
`;
const DescriptionHeaderWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  gap: 1rem;
  flex-direction: column;
  margin: 1rem 1.5rem 0.1rem 1.5rem;
`;
const DescriptionFooterWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  margin: 0rem 0rem 0.3rem 1.3rem;
  gap: 0.5rem;
  flex-direction: column;
`;

const DescriptionHeader = styled.div`
  width: 100%;
  height: 20%;
  display: flex;
`;

const DescriptionMain = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DescriptionFooter = styled.div`
  width: 100%;
  height: 45%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const buttonSides = 42;

interface ProjectInterface {
  title: String;
  uuid: String;
  logo: String;
  verticals: String[];
  newSignal?: boolean;
  triggerPopUp: (e: boolean) => any;
  info: any;
  expandedSectionId: any;
  handleCommentExpand: any;
  investors?: any;
  investor?: any;
  project_user_info: any;
}

function a11yProps(index: number) {
  return {
    'uuid': `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function LogoComponent({ logo }) {
  const [imageError, setImageError] = useState(false);
  const theme = useTheme();

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <>
      {imageError ? (
        <PlaceholderLogo>
          <IoSquareOutline
            style={{
              color: theme.text,
              width: '3rem',
              height: '4rem',
              fill: theme.subTextColor,
            }}
          />
        </PlaceholderLogo>
      ) : (
        <Logo src={logo} alt='Logo' onError={handleImageError} />
      )}
    </>
  );
}

const Project = ({
  title,
  uuid,
  logo,
  newSignal,
  investor,
  expandedSectionId,
  handleCommentExpand,
  triggerPopUp,
  info,
  verticals,
  project_user_info,
}: ProjectInterface) => {
  const dispatch = useDispatch();
  const [isModal, setIsModal] = useState(false);
  const theme = useTheme();
  const [feedback, setFeedback] = useState<Feedback>('');
  const [value, setValue] = React.useState(0);
  const { exportAsJson, exportAsCsv } = useExportData();

  const { Paragraph } = Typography;

  const exportMenu = (
    <Menu>
      <Menu.Item
        key='1'
        onClick={() => {
          exportAsJson(info, 'jsonExport');
        }}
      >
        Export as JSON
      </Menu.Item>
      <Menu.Item
        key='2'
        // onClick={() => {
        //   exportAsCsv(info, 'csvExport');
        // }}
        disabled={true}
      >
        Export as CSV
      </Menu.Item>
    </Menu>
  );

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (info?.tags.length > 3) {
      setValue(0);
      return;
    } else {
      setValue(1);
      return;
    }
  }, [info, info?.tags.length]);

  const { loading, error, userInfo, access_token } = useSelector(
    (state: any) => state.user,
  );

  const postFeedbackHandler = (newValue: number | number[]) => {
    dispatch(postFeedback({ id: uuid, value: newValue }));
    triggerPopUp(true);
    setIsModal(false);
    handleCommentExpand('');
  };

  const getFeedback = useCallback(async (access_token) => {
    if (access_token) {
      try {
        // get user data from store
        // configure authorization header with user's token
        const config = {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        };
        const { data } = await axios.get(
          `/v1/projects/${uuid}/comments`,
          config,
        );
        setFeedback(data);
        return data;
      } catch (error: any) {
        setFeedback('error');
        console.log(error);
      }
    }
  }, []);

  const props = useOutletContext();

  const logos = {
    crunchbase: (
      <Crunchbase fill={theme.iconColor} style={{ fill: theme.iconColor }} />
    ),
    email: <Email fill={theme.iconColor} style={{ fill: theme.iconColor }} />,
    twitter: (
      <Twitter fill={theme.iconColor} style={{ fill: theme.iconColor }} />
    ),
    linkedin: (
      <LinkedIn fill={theme.iconColor} style={{ fill: theme.iconColor }} />
    ),
    linkedinowner: (
      <LinkedInOwner fill={theme.iconColor} style={{ fill: theme.iconColor }} />
    ),
    pitchbook: (
      <Pitchbook fill={theme.iconColor} style={{ fill: theme.iconColor }} />
    ),
  };

  const timelineWrapperRef = useRef(null);

  useEffect(() => {
    if (timelineWrapperRef.current) {
      const timelineWrapperElement = timelineWrapperRef.current;
      // @ts-ignore
      timelineWrapperElement.scrollLeft = timelineWrapperElement.scrollWidth;
    }
  }, []);

  // Usage

  return (
    <>
      {project_user_info && (
        <FeedBack
          postFeedback={postFeedbackHandler}
          show={isModal}
          text={project_user_info.feedback}
          handleClose={() => setIsModal(false)}
          title={title}
        />
      )}
      <ProjectWrapper layout initial='false' animate='visible'>
        <GeneralErrorBoundary>
          <MainBlock mode={props.isDarkMode}>
            <div
              style={{
                position: 'absolute',
                right: '1.2rem',
                top: '1rem',
                zIndex: 1000,
              }}
            >
              <Dropdown
                overlay={exportMenu}
                trigger={['hover']}
                placement='bottomLeft'
              >
                <a
                  className='ant-dropdown-link'
                  onClick={(e) => e.preventDefault()}
                  // style={{ position: 'absolute', right: '1.2rem', top: '1rem' }}
                >
                  <EllipsisOutlined style={{ fontSize: '20px' }} />
                </a>
              </Dropdown>
            </div>
            <MainHeader>
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  width: '93%',
                  marginBottom: '0rem',
                  marginTop: '1rem',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <HeaderContentWrapper>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '0.7rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '0.3rem',
                        gap: '0.7rem',
                        border: `1px solid ${theme.borderColor}`,
                        borderRadius: '5.5px',
                      }}
                    >
                      <LogoComponent logo={logo} />
                    </div>
                    <div>
                      <CopyWrapper textToCopy={title}>{title}</CopyWrapper>
                      <ProjectLocation>
                        {info?.verticals
                          ? info?.verticals.join(', ')
                          : 'not specified'}
                      </ProjectLocation>
                    </div>
                  </div>
                </HeaderContentWrapper>
                <Rate>
                  {info?.archived === false && (
                    <Chip
                      label='NEW'
                      color='success'
                      variant='outlined'
                      sx={{
                        background:
                          props.isDarkMode !== 'light'
                            ? theme.chipIndicator
                            : 'none',
                        border: `1px solid ${theme.chipIndicator}`,
                        color: theme.chipIndicatorText,
                        borderRadius: '5.5px',
                      }}
                    />
                  )}
                </Rate>
              </div>
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: theme.borderColor,
                  width: '100%',
                }}
              >
                <Tabs
                  value={value}
                  onChange={handleChange}
                  TabIndicatorProps={{
                    sx: { height: '1.9px', background: theme.actionable },
                  }}
                  sx={{
                    paddingLeft: '1.5rem',
                    overflowY: 'auto',
                  }}
                >
                  <Tab
                    label='Summary'
                    {...a11yProps(0)}
                    sx={{
                      'fontSize': '0.9rem',
                      'padding': '0rem',
                      'textTransform': 'capitalize',
                      'overflowY': 'auto',
                      'color': theme.text,
                      '&.Mui-selected': {
                        color: theme.actionable,
                      },
                    }}
                  />
                  {/* <Tab
                    label='Contacts'
                    {...a11yProps(1)}
                    sx={{
                      'height': '1rem',
                      'fontSize': '0.9rem',
                      'textTransform': 'capitalize',
                      'padding': '0rem',
                      'color': theme.text,
                      '&.Mui-selected': {
                        color: theme.actionable,
                      },
                    }}
                  /> */}
                  <Tab
                    label='Timeline'
                    {...a11yProps(1)}
                    sx={{
                      'height': '1rem',
                      'fontSize': '0.9rem',
                      'textTransform': 'capitalize',
                      'padding': '0rem',
                      'color': theme.text,
                      '&.Mui-selected': {
                        color: theme.actionable,
                      },
                    }}
                  />

                  {newSignal && (
                    <span
                      style={{
                        width: '0.15rem',
                        height: '0.15rem',
                        padding: '0.1rem',
                        background: '#FF6969',
                        position: 'absolute',
                        bottom: '1.7rem',
                        left: '16rem',
                        borderRadius: '50%',
                      }}
                    ></span>
                  )}
                </Tabs>
              </Box>
            </MainHeader>
            <div
              style={{
                overflowY: 'auto',
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <TabPanel
                value={value}
                index={0}
                sx={{
                  padding: '0rem',
                  margin: '0rem',
                  background: 'red',
                  height: '100%',
                  overflowY: 'auto',
                }}
              >
                <GeneralErrorBoundary customMessage='Summary is not available'>
                  <Summary
                    uuid={uuid}
                    expandedSectionId={expandedSectionId}
                    setModal={setIsModal}
                    info={info}
                    project_user_info={project_user_info}
                    handleCommentExpand={handleCommentExpand}
                  />
                </GeneralErrorBoundary>
              </TabPanel>
              {/* <TabPanel
                value={value}
                index={1}
                sx={{
                  padding: '0rem',
                  margin: '0rem',
                  height: '100%',
                  overflowY: 'auto',
                }}
              >
                <div style={{ paddingTop: '1rem' }}>
                  <GeneralErrorBoundary customMessage='Contacts are not available.'>
                    <Contact
                      uuid={uuid}
                      access_token={access_token}
                      userInfo={userInfo}
                      company={title}
                    />
                  </GeneralErrorBoundary>
                </div>
              </TabPanel> */}
              <TabPanel
                value={value}
                index={1}
                sx={{
                  padding: '0rem',
                  margin: '0rem',
                  height: '100%',
                  overflowY: 'auto',
                }}
              >
                <ActivityLineGraph
                  uuid={uuid}
                  expandedSectionId={expandedSectionId}
                  setModal={setIsModal}
                  info={info}
                  project_user_info={project_user_info}
                  handleCommentExpand={handleCommentExpand}
                  access_token={access_token}
                ></ActivityLineGraph>
              </TabPanel>
              <TabPanel
                value={value}
                index={3}
                sx={{
                  padding: '0rem',
                  background: 'red',
                  overflowY: 'auto',
                }}
              >
                {/* <h3>test</h3> */}
                {/* <CommentsSection>{renderFeedback()}</CommentsSection> */}
              </TabPanel>
            </div>
          </MainBlock>
          <DescriptionBlock mode={props.isDarkMode}>
            <div
              style={{
                height: '100%',
                width: '100%',
                padding: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <DescriptionHeader>
                <DescriptionHeaderWrapper>
                  <Title>About</Title>
                </DescriptionHeaderWrapper>
              </DescriptionHeader>
              <DescriptionMain>
                <DescriptionWrapper>
                  <DescriptionText>
                    <Paragraph
                      ellipsis={{
                        rows: 2,
                        expandable: true,
                        symbol: (
                          <span style={{ color: 'rgb(64, 224, 208)' }}>
                            more
                          </span>
                        ),
                      }}
                      style={{
                        maxHeight: '5rem',
                        overflowY: 'auto',
                        color: theme.subText,
                      }}
                    >
                      {info?.about
                        ? info?.about
                        : 'Information will be provided shortly.'}
                    </Paragraph>{' '}
                  </DescriptionText>
                </DescriptionWrapper>
              </DescriptionMain>
              {investor && info?.funds ? (
                <GeneralErrorBoundary>
                  <InvestorsList funds={info.funds} header={true} />
                </GeneralErrorBoundary>
              ) : (
                <></>
              )}
              <DescriptionFooter>
                <DescriptionFooterWrapper>
                  {info?.website && (
                    <>
                      <SubTitle>{title} presence</SubTitle>
                      <div
                        style={{
                          display: 'flex',
                          gap: '0.6rem',
                          overflowX: 'auto',
                          width: '91%',
                          maxWidth: '91%',
                          minWidth: '91%',
                        }}
                      >
                        {info?.website && (
                          <Button
                            variant='outlined'
                            size='small'
                            color='inherit'
                            href={info?.website}
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
                              fontSize='medium'
                              sx={{ transform: 'scale(0.935)' }}
                            />
                          </Button>
                        )}
                        {info?.socials.map((item: any) => {
                          if (item.icon === 'crunchbase') {
                            const logo = logos[item.icon];
                            // Clone the logo element with new styles
                            const styledLogo = logo
                              ? React.cloneElement(logo, {
                                  style: { width: '18px', height: '18px' }, // Set your desired size here
                                })
                              : null;

                            return (
                              <Button
                                variant='outlined'
                                size='small'
                                color='inherit'
                                href={
                                  item.icon === 'email'
                                    ? 'mailto:' + item.url
                                    : item.url
                                }
                                rel='noreferrer'
                                target='_blank'
                                sx={{
                                  'borderColor': theme.borderColor,
                                  'minWidth': buttonSides,
                                  'height': buttonSides,
                                  'borderRadius': '5px',
                                  '& .MuiButton-startIcon': { margin: 0 },
                                  'fontSize': '0.4rem',
                                  'padding': '',
                                }}
                              >
                                {styledLogo || item.title}
                              </Button>
                            );
                          } else {
                            return null;
                          }
                        })}
                      </div>
                    </>
                  )}
                </DescriptionFooterWrapper>
              </DescriptionFooter>
            </div>
          </DescriptionBlock>
        </GeneralErrorBoundary>
      </ProjectWrapper>
    </>
  );
};

export default memo(Project);

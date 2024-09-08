/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
import React, {
  memo,
  useState,
  useCallback,
  useRef,
  useEffect,
  PureComponent,
} from 'react';
import styled, { useTheme } from 'styled-components';
import Summary from './Summary';
import Chip from '@mui/material/Chip';
import { Typography } from 'antd';
import { useOutletContext } from 'react-router-dom';
import { Statistic } from 'antd';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import TimelineGraph from './TimelineGraph';
import { ReactComponent as Crunchbase } from '../../assets/crunchbase.svg';
import { ReactComponent as Email } from '../../assets/email.svg';
import { ReactComponent as Twitter } from '../../assets/twitter.svg';
import { ReactComponent as LinkedIn } from '../../assets/linkedin.svg';
import { ReactComponent as LinkedInOwner } from '../../assets/linkedinowner.svg';
import { ReactComponent as Pitchbook } from '../../assets/pitchbook.svg';
import { postFeedback } from '../../features/feed/feedActions';
import { useDispatch } from 'react-redux';
import InvestorsList from '../InvsetorsList';
import Contact from './Contact';
import * as RxIcons from 'react-icons/rx';
import LanguageIcon from '@mui/icons-material/Language';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  LineChart,
  Line,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Area,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const ProjectWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 1.1rem;
  /* max-height: 100%; */
  max-height: 19.2rem;
`;

const MainBlock = styled.div`
  width: 60%;
  max-width: 60%;
  min-width: 60%;
  border-radius: 5.5px;
  /* max-height: 28rem; */
  background: ${({ theme }) => theme.background};
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
  /* margin-right: 1rem; */
`;

const MainHeader = styled.div`
  width: 100%;
  height: 13rem;
  max-height: 13rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  position: relative;
`;

const HeaderContentWrapper = styled.div`
  display: flex;
  gap: 0.3rem;
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
  margin-left: 0.16rem;
`;

const DescriptionText = styled.p`
  color: ${({ theme }) => theme.subText};
  /* color: #58585b; */
  line-height: 1.5;
  position: relative;
  font-size: 12px;
  margin-left: 0.16rem;
  /* &:before {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    width: 4rem;
    height: 4px;
    left: 0.2rem;
    border-bottom: 1px solid ${({ theme }) => theme.text};
  } */
`;

const Logo = styled.img`
  width: 2.3rem;
  height: 2.3rem;
  background: #dedede;
  /* border: 1px solid ${({ theme }) => theme.borderColor}; */
`;

const PlaceholderLogo = styled.div`
  width: 3rem;
  height: 3rem;
  background: ${({ theme }) => theme.background};
  text-align: center;
  color: ${({ theme }) => theme.text};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
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
`;

const ProjectLocation = styled.span`
  color: ${({ theme }) => theme.subText};
  font-size: 0.8rem;
  marign-left: 0.16rem !important;
`;

const DescriptionBlock = styled.div`
  width: 40%;
  max-width: 40%;
  min-width: 40%;
  min-height: 100%;
  padding-top: 1rem;
  height: auto;
  /* max-height: 28rem; */
  border-radius: 5.5px;
  background: ${({ theme }) => theme.background};
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  overfloy-y: auto;
`;

const DescriptionWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  margin: 0.5rem 1.3rem 0.5rem 1.3rem;
  gap: 0.7rem;
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
  width: 100%;
  display: flex;
  margin: 0rem 0rem 0.7rem 1.3rem;
  gap: 0.5rem;
  flex-direction: column;
`;

const DescriptionHeader = styled.div`
  width: 100%;
  height: 20%;
  display: flex;
`;

const CommentsSection = styled.div`
  display: flex;
  padding-top: 1rem;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  height: 90%;
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

const buttonSides = 44;

const { Paragraph } = Typography;

interface ProjectInterface {
  title: String;
  uuid: String;
  logo: String;
  verticals: String[];
  info: any;
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

const dataPerMonth = [
  { name: 'Jan 2022', projects: 10 },
  { name: 'Feb 2022', projects: 15 },
  { name: 'Mar 2022', projects: 12 },
  { name: 'Apr 2022', projects: 18 },
  { name: 'May 2022', projects: 14 },
  { name: 'Jun 2022', projects: 16 },
  { name: 'Jul 2022', projects: 20 },
  { name: 'Aug 2022', projects: 22 },
  { name: 'Sep 2022', projects: 19 },
  { name: 'Oct 2022', projects: 23 },
  { name: 'Nov 2022', projects: 21 },
  { name: 'Dec 2022', projects: 24 },
  { name: 'Jan 2023', projects: 26 },
  { name: 'Feb 2023', projects: 20 },
  { name: 'Mar 2023', projects: 25 },
  { name: 'Apr 2023', projects: 22 },
  { name: 'May 2023', projects: 28 },
  { name: 'Jun 2023', projects: 27 },
  { name: 'Jul 2023', projects: 29 },
  { name: 'Aug 2023', projects: 30 },
  { name: 'Sep 2023', projects: 26 },
  { name: 'Oct 2023', projects: 28 },
  { name: 'Nov 2023', projects: 32 },
  { name: 'Dec 2023', projects: 35 },
];

export class Example extends PureComponent {
  static demoUrl = 'https://codesandbox.io/s/tiny-line-chart-r5z0f';

  render() {
    return (
      <div
        style={{
          position: 'relative',
          // overflowX: 'auto',
          // overflowY: 'hidden',
        }}
      >
        <AreaChart
          width={1200}
          height={150}
          data={dataPerMonth}
          // style={{ position: 'absolute' }}
          syncId='projects'
          margin={{
            top: 10,
            right: 0,
            left: 0,
            bottom: 10,
          }}
        >
          <defs>
            <linearGradient id='colorGradient' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='0%' stopColor='#82ca9d' stopOpacity={1} />
              <stop offset='100%' stopColor='#82ca9d' stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type='monotone'
            dataKey='projects'
            stroke='#82ca9d'
            fill='url(#colorGradient)'
          />
          <RechartsTooltip />
        </AreaChart>
      </div>
    );
  }
}

const Fund = ({
  title,
  uuid,
  logo,
  about_partners,
  value_predicted,
  website,
  total_signals,
  signals_quarter,
  signals_month,
  signals_this_quarter,
  lead_days,
  description,
  motivation,
  about,
  investor,
  info,
  verticals,
  project_user_info,
}: ProjectInterface) => {
  const dispatch = useDispatch();
  const [isModal, setIsModal] = useState(false);
  const theme = useTheme();

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(newValue);
    setValue(newValue);
  };

  useEffect(() => {
    setValue(0); // Reset the value to 0 when the component is mounted
  }, []);

  const { loading, error, userInfo, access_token } = useSelector(
    (state: any) => state.user,
  );

  const postFeedbackHandler = (newValue: number | number[]) => {
    dispatch(postFeedback({ id: uuid, value: newValue }));
    triggerPopUp(true);
    setIsModal(false);
    handleCommentExpand('');
  };

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

  return (
    <div style={{ marginRight: '1rem' }}>
      <br />
      <ProjectWrapper layout initial='false' animate='visible'>
        <MainBlock mode={props.isDarkMode}>
          <MainHeader>
            <div
              style={{
                maxHeight: '5rem',
                height: '5rem',
                display: 'flex',
                width: '93%',
                marginBottom: '0rem',
                paddingTop: '1.5rem',
                justifyContent: 'space-between',
              }}
            >
              <HeaderContentWrapper>
                <div
                  style={{
                    display: 'flex',
                    // justifyContent: 'center',
                    alignItems: 'start',
                    gap: '0.7rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      // alignItems: 'center',
                      gap: '0.7rem',
                      borderRadius: '5.5px',
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
                      {logo ? (
                        <Logo src={`${logo}`} />
                      ) : (
                        <PlaceholderLogo>N/A</PlaceholderLogo>
                      )}
                    </div>
                  </div>
                  <div>
                    <ProjectName>{title}</ProjectName>
                    <ProjectLocation>
                      {verticals ? verticals : ''}
                    </ProjectLocation>
                  </div>
                </div>
              </HeaderContentWrapper>
              <div>
                <div
                  style={{
                    width: '100%',
                  }}
                ></div>
                <div
                  style={{
                    display: 'flex',
                    gap: '3rem',
                    width: '100%',
                    alignItems: 'center',
                    // justifyContent: 'space-between',
                  }}
                >
                  {/* <Statistic
                    title={
                      <Tooltip
                        title='Value predicted description'
                        arrow
                        placement='top'
                        style={{ color: theme.subText }}
                      >
                        Value Predicted{' '}
                        <InfoOutlinedIcon
                          style={{
                            marginLeft: '4px',
                            fontSize: '14px',
                            color: theme.text,
                          }}
                        />
                      </Tooltip>
                    }
                    value={info?.value_predicted ? info.value_predicted : '-'}
                    valueStyle={{
                      color: theme.text,
                      fontSize: '17px',
                    }}
                  />
                  <Statistic
                    title={
                      <Tooltip
                        title='The number of days between discovery date of a project and the investment'
                        arrow
                        placement='top'
                        style={{ color: theme.subText }}
                      >
                        Lead Days{' '}
                        <InfoOutlinedIcon
                          style={{
                            marginLeft: '4px',
                            fontSize: '14px',
                            color: theme.text,
                          }}
                        />
                      </Tooltip>
                    }
                    value={info?.lead_days ? info.lead_days : '-'}
                    valueStyle={{
                      color: theme.text,
                      fontSize: '17px',
                    }}
                  /> */}
                  <Statistic
                    title={
                      <span style={{ color: theme.subText }}>
                        Total Signals
                      </span>
                    }
                    value={info?.total_signals ? info.total_signals : '-'}
                    style={{ color: theme.subText }}
                    valueStyle={{
                      color: theme.text,
                      fontSize: '17px',
                    }}
                  />
                  <Statistic
                    title={
                      <span style={{ color: theme.subText }}>
                        Signals this Quarter
                      </span>
                    }
                    value={info?.signals_quarter ? info.signals_quarter : 'TBD'}
                    style={{ color: theme.subText }}
                    valueStyle={{
                      color: theme.text,
                      fontSize: '17px',
                    }}
                  />
                </div>
              </div>
            </div>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: theme.borderColor,
                width: '100%',
              }}
            ></Box>
          </MainHeader>
          <div
            style={{
              overflowY: 'hidden',
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <Summary
              uuid={uuid}
              // expandedSectionId={expandedSectionId}
              setModal={setIsModal}
              info={info}
              project_user_info={project_user_info}
              // handleCommentExpand={handleCommentExpand}
            />
          </div>
          {/* <TimelineGraph uuid={uuid} access_token={access_token} /> */}
          <FooterDate>
            {/* Last Updated&nbsp;
            <Moment format='YYYY/MM/DD'>{project_user_info.time_recommended}</Moment> */}
          </FooterDate>

          <FooterButtons></FooterButtons>
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
              overflowY: 'auto',
            }}
          >
            <DescriptionHeader>
              <DescriptionHeaderWrapper>
                <Title>Thesis</Title>
              </DescriptionHeaderWrapper>
            </DescriptionHeader>
            <DescriptionMain>
              <DescriptionWrapper>
                <div>
                  {/* <SubTitle>About {title}</SubTitle> */}
                  <DescriptionText>
                    <Paragraph
                      ellipsis={{
                        rows: 4,
                        expandable: true,
                        symbol: (
                          <span style={{ color: '#40e0d0' }}>show more</span>
                        ),
                      }}
                      style={{
                        maxHeight: '7rem',
                        overflowY: 'auto',
                        fontSize: '12px',
                        color: theme.subText,
                      }}
                    >
                      {info?.about
                        ? info?.about
                        : 'Information will be provided shortly.'}
                    </Paragraph>{' '}
                  </DescriptionText>
                </div>
              </DescriptionWrapper>
            </DescriptionMain>
            {/* {investor && <InvestorsList funds={info.project.funds} header={true} />} */}
            <DescriptionFooter>
              <DescriptionFooterWrapper>
                {info?.website && (
                  <SubTitle>{title} community channels</SubTitle>
                )}
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
                        sx={{ transform: 'scale(1.1)' }}
                      />
                    </Button>
                  )}
                  {/* {info.project.website && (
                    <Button
                      variant='outlined'
                      size='small'
                      color='inherit'
                      href={info.project.website}
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
                      <LanguageIcon fontSize='medium' sx={{ transform: 'scale(1.1)' }} />
                    </Button>
                  )}
                  {info.project.socials.map((item: any) => {
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
                  })} */}
                </div>
              </DescriptionFooterWrapper>
            </DescriptionFooter>
          </div>
        </DescriptionBlock>
      </ProjectWrapper>
    </div>
  );
};

const FooterDate = styled.p`
  color: ${({ theme }) => theme.text};
  font-size: 0.8rem;
  display: flex;
  width: 100%;
  gap: 0.1rem;
  justify-content: flex-end;
  position: absolute;
  right: 1.5rem;
  bottom: 1.5rem;
`;
const FooterButtons = styled.div`
  display: flex;
  gap: 1rem;
  position: absolute;
  left: 1.5rem;
  bottom: 1.5rem;
`;

export default memo(Fund);

import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import DateRangeIcon from '@mui/icons-material/DateRange';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupIcon from '@mui/icons-material/Group';
import {
  Paper,
  Typography,
  Avatar,
  Tooltip,
  Chip,
  Box,
  Link,
  Divider,
} from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useTheme } from 'styled-components';
import NavigationCard from '../components/NavigationCard';
import { Oval } from 'react-loader-spinner';
import FeedEnd from '../UI/FeedEnd';
import { useData } from '../hooks/LiveFeedContext';
import LanguageIcon from '@mui/icons-material/Language';
import moment from 'moment';

const StartupEntry = ({
  logo,
  title,
  verticals,
  tags,
  funds,
  discovered_date,
  about,
  socials,
  website,
  time_published, // New prop
}) => {

  const truncatedAbout =
    about?.length > 57 ? `${about.substring(0, 57)}...` : about;
  const truncateTitle =
    title?.length > 15 ? `${title.substring(0, 15)}...` : title;
  const truncateFund = (title) =>
    title?.length > 13 ? `${title.substring(0, 13)}..` : title;
  const timeAgo = moment(time_published).fromNow();
  const foundedTag = tags.find((tag) => tag.title === 'founded');
  const locationTag = tags.find((tag) => tag.title === 'location');
  const teamSizeTag = tags.find((tag) => tag.title === 'team size');
  const stageTag = tags.find((tag) => tag.title === 'stage');

  // Parse the discovered_date and get the difference in days from now
  const discoveredDateObj = new Date(discovered_date);
  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const diffDays = Math.round(Math.abs((now - discoveredDateObj) / oneDay));
  const isNew = diffDays <= 35; // consider as new if discovered within last 2 days
  const theme = useTheme();

  const shouldRenderDivider = () => {
    if (tags.length === 0) return false;

    if (foundedTag || locationTag || teamSizeTag) return true;

    return false;
  };

  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 1,
        padding: 1,
        // overflow: 'hidden',
        textOverflow: 'ellipsis',
        backgroundColor: theme.background,
      }}
      variant={'none'}
    >
      <Box
        sx={{
          display: 'flex',
          gap: '0.1rem',
          alignItems: 'center',
          color: theme.text,
        }}
      >
        <Avatar
          variant='square'
          src={logo}
          sx={{
            height: 22,
            width: 22,
            border: `1px solid ${theme.borderColor}`,
            backgroundColor: theme.subBackground,
            padding: '0.3rem',
            borderRadius: '0px',
          }}
        />
        <Divider
          orientation='vertical'
          sx={{
            margin: '0.4rem 0.4rem',
            marginLeft: '0.5rem',
            backgroundColor: theme.borderColor,
          }}
          flexItem
        />
        <Link href={website} target='_blank' title='Website'>
          <LanguageIcon style={{ color: theme.subText, fontSize: '15px' }} />
        </Link>
        <Divider
          orientation='vertical'
          sx={{ margin: '0.4rem 0.4rem', backgroundColor: theme.borderColor }}
          flexItem
        />
        <Link
          href={website}
          target='_blank'
          underline='hover'
          sx={{
            fontWeight: 'bold',
            fontSize: '0.875rem',
            color: theme.subText,
          }}
        >
          <Tooltip title={title}>
            <Typography
              variant='header'
              sx={{
                fontWeight: '500',
                position: 'relative',
                color: theme.text,
              }}
            >
              {truncateTitle}
            </Typography>
          </Tooltip>
        </Link>
        <Divider
          orientation='vertical'
          sx={{ margin: '0.39rem 0.39rem', backgroundColor: theme.borderColor }}
          flexItem
        />
        <div
          sx={{
            display: 'flex',
            gap: '0.39rem',
            alignItems: 'center',
            marginLeft: 1,
          }}
        >
          {foundedTag && (
            <Chip
              size='small'
              icon={<DateRangeIcon style={{ fontSize: '14.5px' }} />}
              label={foundedTag.content}
              variant='outlined'
              sx={{
                border: 'none',
                color: theme.text,
                fontSize: '0.66rem',
              }}
            />
          )}
          {locationTag && locationTag.content.length < 30 && (
            <Chip
              size='small'
              label={locationTag.content}
              icon={<LocationOnIcon style={{ fontSize: '14.5px' }} />}
              variant='outlined'
              sx={{
                // border: `1px solid ${theme.borderColor}`,
                border: 'none',
                color: theme.text,
                fontSize: '0.66rem',
              }}
            />
          )}
          {teamSizeTag && (
            <Chip
              size='small'
              label={teamSizeTag.content}
              icon={<GroupIcon style={{ fontSize: '14.5px' }} />}
              variant='outlined'
              sx={{
                // border: `1px solid ${theme.borderColor}`,
                border: 'none',
                color: theme.text,
                fontSize: '0.66rem',
              }}
            />
          )}
          {stageTag && (
            <Chip
              size='small'
              label={stageTag.content}
              icon={<TrendingUpIcon style={{ fontSize: '14.5px' }} />}
              variant='outlined'
              sx={{
                // border: `1px solid ${theme.borderColor}`,
                border: 'none',
                color: theme.text,
                fontSize: '0.66rem',
              }}
            />
          )}
        </div>
        {shouldRenderDivider === true ? (
          <Divider
            orientation='vertical'
            sx={{
              margin: '0.39rem 0.39rem',
              backgroundColor: theme.borderColor,
            }}
            flexItem
          />
        ) : null}
        <Tooltip title={about}>
          <Typography
            variant='body2'
            sx={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              fontSize: '0.75rem',
              color: theme.subText,
            }}
          >
            {truncatedAbout}
          </Typography>
        </Tooltip>
        {verticals.slice(0, 4).map((vertical, index) => (
          <Typography
            key={index}
            variant='caption'
            color='text.secondary'
            sx={{
              marginLeft: 0.5,
              fontSize: '0.75rem',
              fontStyle: 'italic',
              color: theme.subText,
            }}
          >
            #{vertical}
          </Typography>
        ))}
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: '0.39rem',
          alignItems: 'center',
          color: theme.text,
        }}
      >
        {funds?.length > 2 ? (
          <Tooltip
            title={
              <React.Fragment>
                {funds?.slice(2).map((fund, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      gap: '0.23rem',
                      padding: '0.25rem',
                      border: 'none',
                    }}
                  >
                    <Avatar
                      src={fund.logo}
                      sx={{ height: 16, width: 16 }}
                      variant='square'
                    />

                    {truncateFund(fund.name)}
                  </Box>
                ))}
              </React.Fragment>
            }
          >
            <div sx={{ display: 'flex', alignItems: 'center', marginLeft: 1 }}>
              {funds?.slice(0, 2).map((fund, index) => (
                <Chip
                  size='small'
                  label={truncateFund(fund.name)}
                  avatar={
                    <Avatar
                      src={fund.logo}
                      sx={{ height: 16, width: 16 }}
                      variant='square'
                    />
                  }
                  sx={{
                    margin: 0.5,
                    border: 'none',
                    height: 24,
                    borderRadius: '5px',
                    backgroundColor: theme.subBackground,
                    color: theme.text,
                  }}
                  key={index}
                />
              ))}
              {funds?.length > 2 && (
                <Chip
                  size='small'
                  label={`+${funds?.length - 2}`}
                  sx={{
                    margin: 0.5,
                    border: 'none',
                    height: 24,
                    borderRadius: '5px',
                    backgroundColor: theme.subBackground,
                    color: theme.text,
                  }}
                />
              )}
            </div>
          </Tooltip>
        ) : (
          <div sx={{ display: 'flex', alignItems: 'center', marginLeft: 1 }}>
            {funds?.slice(0, 2).map((fund, index) => (
              <Chip
                size='small'
                label={truncateFund(fund.name)}
                avatar={
                  <Avatar
                    src={fund.logo}
                    sx={{ height: 16, width: 16 }}
                    variant='square'
                  />
                }
                sx={{
                  margin: 0.5,
                  border: 'none',
                  height: 24,
                  borderRadius: '5px',
                  backgroundColor: theme.subBackground,
                  color: theme.text,
                }}
                key={index}
              />
            ))}
            {funds?.length > 2 && (
              <Chip
                size='small'
                label={`+${funds?.length - 2}`}
                sx={{
                  margin: 0.5,
                  height: 24,
                  borderRadius: '5px',
                  border: `1px solid ${theme.borderColor}`,
                  backgroundColor: theme.subBackground,
                  borderColor: theme.borderColor,
                  color: theme.text,
                }}
              />
            )}
          </div>
        )}
        {/* {time_published && (
          <>
            <Divider
              orientation='vertical'
              sx={{
                margin: '0.39rem 0rem 0.39rem 0rem',
                backgroundColor: theme.borderColor,
              }}
              flexItem
            />

            <Typography
              variant='body2'
              sx={{
                minWidth: '5.3rem',
                // marginLeft: 1,
                fontSize: '0.68rem',
                textAlign: 'center',
                color: theme.subText,
              }}
            >
              {timeAgo}
            </Typography>
          </>
        )} */}
      </Box>
    </Paper>
  );
};

export const LiveFeed = () => {
  const [key, setKey] = useState(0); // Key to force re-render
  const { selectedFunds, shouldUpdateLiveFeed, triggerLiveFeedUpdate } =
    useData();
  const theme = useTheme();

  useEffect(() => {
    setKey((prev) => prev + 1);
  }, [shouldUpdateLiveFeed]);

  return (
    <div
      style={{ height: '100%', overflow: 'auto', background: theme.body }}
      key={key}
      id='scrollableDiv'
    >
      <LiveFeedComponent />
    </div>
  );
};

export const LiveFeedComponent = () => {
  const [data, setData] = useState([]);
  const [transformedData, setTranformedData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const infiniteScrollRef = useRef(); // Reference to the InfiniteScroll component
  const { access_token } = useSelector((state) => state.user);
  const theme = useTheme();

  const fetchData = async () => {
    const config = {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
    };

    setIsLoading(true);

    try {
      const response = await axios.get(
        `/v1/feed/live?offset=${data.length}&limit=40`,
        config,
      );
      let newData = [...data, ...response.data];
      if (newData.length >= 380) {
        newData = newData.slice(0, 380);
        setHasMore(false);
      }
      const transformedData = newData.map((item) => ({
        key: item.project.uuid,
        funds: item.funds,
        project: {
          ...item.project,
          verticals: item.project.verticals || [],
          socials: item.project.socials || [],
        },
      }));
      setTranformedData(transformedData);
      setData(newData);

      if (response.data.length < 5) setHasMore(false); // when server has no more data it sends less than 10 projects
    } catch (error) {
      console.error('Error fetching data:', error);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    setData([]);
    setHasMore(true);
    fetchData();
  }, []);


  // return (
  //   <div
  //     id='scrollableDiv'
  //     style={{
  //       height: '100%',
  //       padding: '1rem',
  //       background: theme.body,
  //     }}
  //   >
  //     <NavigationCard
  //       showResurfacing={true}
  //       name={'Live Pipeline'}
  //       description={
  //         'Attention: The Live Pipeline is temporarily offline for scheduled maintenance and major upgrades. Your understanding is highly appreciated.'
  //       }
  //     />
  //   </div>
  // );

  return (
    <div
      id='scrollableDiv'
      style={{
        height: '100%',
        padding: '1rem',
        background: theme.body,
      }}
    >
      <NavigationCard
        showResurfacing={true}
        name={'Central Feed'}
        description={
          'Access raw, real-time visibility into the active deal pipelines'
        }
      />
      <InfiniteScroll
        dataLength={data.length}
        ref={infiniteScrollRef}
        next={fetchData}
        hasMore={hasMore}
        loader={
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
        }
        endMessage={<FeedEnd ticker={true} />}
        style={{ overflow: 'auto', paddingTop: '1rem', width: '100%' }}
        scrollableTarget='scrollableDiv' // Provide scrollableTarget prop here
      >
        {transformedData.map((startup, i) => (
          <StartupEntry key={i} {...startup.project} funds={startup.funds} />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default LiveFeed;

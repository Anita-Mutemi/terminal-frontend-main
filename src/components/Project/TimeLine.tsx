import React, { useRef, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Oval } from 'react-loader-spinner';
import logo from '../../assets/logo-gray.png';
import styled, { createGlobalStyle, useTheme } from 'styled-components';
interface TimelineProps {
  uuid: string;
  access_token: string;
}

const GlobalStyle = createGlobalStyle`
  @keyframes lineAnimation {
    0% {
      width: 0%;
    }
    100% {
      width: 100%;
    }
  }

  @keyframes bulletPointAnimation {
    0% {
      transform: translateX(-100%);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const TimelineWrapper = styled.div`
  display: flex;
  align-items: center;
  /* justify-content: space-around; */
  /* margin-top: 1rem; */
  /* margin-bottom: 1rem; */
  /* overflow-x: auto; */
  padding: 2rem 0rem 0rem 0rem;
  position: relative;
  height: 100%;
  width: 100%;
  padding-bottom: 1rem;
`;

const Line = styled.div`
  position: sticky;
  left: 0;
  right: 0;
  top: 5.6rem;
  height: 2px;
  background-color: #ccccccd1;
  animation: bulletPointAnimation 1s forwards;
  /* position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #ccc;
  animation: bulletPointAnimation 1s forwards; */
`;

const BulletPoint = styled.div<{
  image: string;
  size: number;
  bgColor: string;
  delay: number;
}>`
  background-image: url(${(props) => props.image});
  background-size: cover;
  background-color: ${(props) => props.bgColor};
  background-position: center;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  /* justify-content: space-between; */
  border: 1px solid ${({ theme }) => theme.borderColor};
  /* align-items: center; */
  animation: bulletPointAnimation 1s forwards;
  margin-left: 2rem;
  margin-right: 2rem;
  padding: 0.5rem;
  position: absolute;
  opacity: 0;
  bottom: 1.25rem;
  animation-delay: ${(props) => props.delay};
`;

const TextWrapper = styled.div`
  /* position: absolute;
  top: -2rem; */
  max-width: 150px;
  text-align: center;
`;

const DateWrapper = styled.div<{
  size: number;
}>`
  width: ${(props) => props.size + 0.5}rem;
  /* position: absolute; */
  /* top: -2rem; */
  max-width: 150px;
  margin-top: 4rem;

  text-align: center;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 0.7rem;
  color:   border: 1px solid ${({ theme }) => theme.subText};
  word-wrap: break-word;
`;

const DateText = styled.p`
  margin: 0;
  font-size: 0.65rem;
  color:   border: 1px solid ${({ theme }) => theme.subText};
  /* position: absolute; */
  /* bottom: -2.5rem; */
  height:1rem;
  width: 100%;
  text-align: center;
`;

const ScrollableDiv = styled.div`
  maxheight: 9rem;
  /* height: 100%; */
  width: 100%;
  position: relative;
  overflow-y: hidden;
  overflow-x: auto; /* Enable horizontal scrolling */

  /* For Webkit browsers */
  &::-webkit-scrollbar {
    height: 5px;
  }

  &::-webkit-scrollbar-track {
    background-color: #f4f4f4;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }
`;

function removeDuplicatesWithCount(
  data: [string, string][],
): [string, string][] {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const companies: { [key: string]: number } = {};

  return data.reduce((result: [string, string][], [date, company]) => {
    const month = Number(date.slice(5, 7));
    if (month === currentMonth) {
      companies[company] = (companies[company] || 0) + 1;
      const count = companies[company];
      const title = count > 1 ? `${company} (${count})` : company;
      result.push([date, title]);
    }
    return result;
  }, []);
}
// @ts-ignore
const TimelineCard = ({ jsonData }) => {
  // @ts-ignore
  const dates = jsonData.map((item) => item.signal_date);
  // @ts-ignore
  // const fundNames = jsonData.map((item) => item.fund.name);

  // const data = {
  //   labels: dates,
  //   datasets: [
  //     {
  //       label: 'Funds',
  //       data: fundNames.map((_, index) => index + 1), // You can also use some metric here
  //       backgroundColor: 'rgba(75,192,192,0.4)',
  //       borderColor: 'rgba(75,192,192,1)',
  //       borderWidth: 1,
  //     },
  //   ],
  // };
  const options = {
    scales: {
      xAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ width: '300px', height: '300px' }}>
      {/* <Bar data={data} options={options} /> */}
    </div>
  );
};

const Timeline: React.FC<TimelineProps> = ({ uuid, access_token }) => {
  const [timeLine, setTimeline] = useState([]);

  const [status, setStatus] = useState({
    loading: false,
    error: false,
  });

  const getWeeksDifference = (date: string): number => {
    const currentDate = new Date();
    const itemDate = new Date(date);
    const timeDiff = Math.abs(currentDate.getTime() - itemDate.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24 * 7));
  };

  const theme = useTheme();
  const getTimeline = useCallback(
    async (access_token: string) => {
      if (access_token) {
        setStatus((prev) => ({ ...prev, loading: true }));
        try {
          // get user data from store
          // configure authorization header with user's token
          const config = {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          };
          const { data } = await axios.post(
            `/v1/projects/${uuid}/timeline?detailed=false`,
            null,
            config,
          );
          if (data?.timeline?.length === 0) {
            setStatus((prev) => ({ ...prev, error: true }));
            return false;
          } else {
            setTimeline(data.timeline);
          }
          return data;
        } catch (error: any) {
          setTimeline([]);
          setStatus((prev) => ({ ...prev, error: true }));
          console.log(error);
        } finally {
          setStatus((prev) => ({ ...prev, loading: false }));
        }
      }
    },
    [uuid],
  );

  useEffect(() => {
    getTimeline(access_token);
  }, [access_token, getTimeline, uuid]);

  if (status.loading)
    return (
      <Oval
        height={50}
        width={50}
        color='#484848'
        wrapperStyle={{ alignSelf: 'start', paddingTop: '1rem' }}
        wrapperClass=''
        visible={true}
        ariaLabel='oval-loading'
        secondaryColor='#222222'
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    );
  if (timeLine.length > 0 && !status.loading)
    return (
      <ScrollableDiv>
        {/* @ts-ignore */}
        <Line />
        <TimelineWrapper>
          {/* <h3>Coming Soon ...</h3> */}
          <img
            src={logo}
            alt='logo'
            style={{
              position: 'absolute',
              width: '2.8rem',
              opacity: 0.1,
              left: '50%',
              top: '18%',
              transform: 'translate(-50%, -50%)',
            }}
          />
          <span
            style={{
              position: 'absolute',
              fontSize: '2rem',
              opacity: 0.1,
              left: '50%',
              fontWeight: 500,
              color: '#b1b1b1',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            TwoTensor
          </span>
          <GlobalStyle />
          {timeLine.map((item, index) => {
            // @ts-ignore
            const signalDate = item.signal_date;
            // @ts-ignore
            const signalTitle = item.fund.name;
            // @ts-ignore
            const weeksDifference = getWeeksDifference(signalDate);
            const saturation = Math.max(0, 1 - (weeksDifference - 1) / 3);
            const grayValue = Math.min(255, weeksDifference * 64);
            // return <TimelineCard jsonData={timeLine} />;
            return (
              <div
                style={{
                  // height: '5rem',
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  // height: '4.7rem',
                  gap: '0.5rem',
                  justifyContent: 'space-between',
                  marginLeft: '1rem',
                  marginRight: '1rem',
                  position: 'relative',
                }}
              >
                <TextWrapper>
                  {/* @ts-ignore */}
                  <Title>{signalTitle}</Title>
                </TextWrapper>
                <BulletPoint
                  key={index}
                  // @ts-ignore
                  image={item?.fund?.fund?.logo}
                  size={7}
                  // @ts-ignore
                  bgColor={theme.subTitle}
                  // bgColor={`rgb(${grayValue}, ${grayValue}, ${grayValue})`}
                  delay={index * 0.1}
                ></BulletPoint>
                <DateWrapper size={5}>
                  {/* @ts-ignore */}
                  <DateText>{moment(signalDate).format('MMMM YYYY')}</DateText>
                </DateWrapper>
              </div>
            );
          })}
        </TimelineWrapper>
      </ScrollableDiv>
    );

  if (status.error && !status.loading)
    return <h4>Timeline is currently unavailable</h4>;

  return <></>;
};

export default Timeline;

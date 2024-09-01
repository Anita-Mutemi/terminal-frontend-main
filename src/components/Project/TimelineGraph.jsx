import { useEffect, useState, useCallback } from 'react';
import { Card, Typography } from 'antd';
import axios from 'axios';
import { useTheme } from 'styled-components';
import { Oval } from 'react-loader-spinner';

import {
  XAxis,
  YAxis,
  Dot,
  Tooltip,
  Area,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import logo from '../../assets/logo-gray.png';

const { Text } = Typography;

const aggregateDataByMonth = (dailyData) => {
  // Initialize a new array of length 12 for each month
  const monthlyData = Array.from({ length: 12 }, () => ({
    month: 0,
    count: 0,
    companyActions: {},
  }));

  dailyData.forEach((data, index) => {
    const monthIndex = new Date(2023, 0, index + 1).getMonth();
    monthlyData[monthIndex].month = monthIndex + 1;
    monthlyData[monthIndex].count += data.count;
  });

  return monthlyData;
};

const TimelineGraph = ({ uuid, access_token, setGraphError }) => {
  const [status, setStatus] = useState();
  const [graphData, setGraphData] = useState([]);
  const [shouldChangeColor, setShouldChangeColor] = useState(false);

  const weeklyData = aggregateDataByMonth(graphData);
  const theme = useTheme();

  const maxCount = Math.max(...weeklyData.map((data) => data.count));
  const yAxisMax = Math.min(maxCount + 2, 15);

  const fetchData = async (uuid, access_token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    };
    setStatus('loading');
    try {
      const { data } = await axios.post(
        `/v1/projects/${uuid}/timeline?detailed=true`,
        null,
        config,
      );
      return data;
    } catch (err) {
      setStatus('error');
      setGraphError(true);
    } finally {
      setStatus('finished');
    }
  };

  const [year, setYear] = useState(2024);

  const convertServerDataToGraphData = (serverData) => {
    // Initialize a template for the whole year, setting total counts to 0
    const monthlyDataTemplate = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      count: 0,
      companyActions: [],
    }));

    // Iterate over the received data and populate the monthly data based on the 'months' array
    serverData.forEach((yearlyData) => {
      yearlyData.months.forEach((monthData) => {
        const monthIndex = monthData.month - 1; // Convert to 0-index for array access
        monthlyDataTemplate[monthIndex].count = monthData.total; // Directly use the total provided for the month
        monthlyDataTemplate[monthIndex].companyActions = monthData.signals; // Directly use the signals provided for the month
        monthlyDataTemplate[monthIndex].showDot =
          monthlyDataTemplate[monthIndex].companyActions.length > 0;
      });
    });

    // Determine if there should be a color change for the graph area fill
    // Find the last month with company actions
    let lastActionMonthIndex = -1;
    for (let i = monthlyDataTemplate.length - 1; i >= 0; i--) {
      if (monthlyDataTemplate[i].count > 0) {
        // Assuming count > 0 means there were actions
        lastActionMonthIndex = i;
        break; // Exit the loop after finding the last month with actions
      }
    }

    // If there is no action in the following month after the last action month,
    // then set a flag to change the color for the entire graph
    const noActionAfterLastActionMonth =
      lastActionMonthIndex !== -1 &&
      lastActionMonthIndex < monthlyDataTemplate.length - 1 &&
      monthlyDataTemplate[lastActionMonthIndex + 1].count === 0;

    return {
      data: monthlyDataTemplate,
      noActionAfterLastActionMonth: noActionAfterLastActionMonth,
    };
  };

  useEffect(() => {
    const fetchAndPrepareData = async () => {
      const serverData = await fetchData(uuid, access_token);
      if (serverData?.timeline?.length === 0) {
        setStatus('error');
        setGraphError(true);
        return;
      }
      const { data: preparedData, noActionAfterLastActionMonth } =
        convertServerDataToGraphData(serverData.timeline);
      setGraphData(preparedData);
      // Set a state variable to hold the flag for changing color
      setShouldChangeColor(noActionAfterLastActionMonth); // Assume you have a state setter for this
    };

    fetchAndPrepareData();
  }, [uuid, access_token]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { companyActions } = payload[0].payload;
      // const totalActions = Object.values(companyActions).reduce((a, b) => a + b, 0);
      const totalAction2 = companyActions?.map((item) => {
        return {
          title: item?.fund?.name,
          count: item.count,
        };
      });
      return (
        <Card
          bordered={false}
          size='small'
          style={{
            width: 230,
            zIndex: 9999999,
            padding: '0px',
            maxHeight: '150px',
            overflowY: 'auto',
            overflowX: 'hidden',
            background: theme.background,
            theme: theme.text,
          }}
        >
          <Text
            style={{ color: theme.text }}
            strong
          >{`Total Signals: ${payload[0].payload?.count}`}</Text>
          <div style={{ listStyleType: 'none' }}>
            {totalAction2.map((item) => (
              <div key={item?.title}>
                {item?.count && (
                  <Text
                    type='secondary'
                    style={{ color: theme.text }}
                  >{`${item?.title}: ${item?.count}`}</Text>
                )}
              </div>
            ))}
          </div>
        </Card>
      );
    }
    return null;
  };

  const formatYAxis = (tickItem) => {
    return tickItem >= 0 ? tickItem : '';
  };

  const currentYear = new Date().getFullYear();

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ].map((month) => `${month} ${year !== currentYear ? year : ''}`);

  const formatXAxis = (tickItem) => {
    return months[tickItem - 1];
  };

  if (status === 'loading') {
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
  }

  if (status === 'error') {
    return <h4>Graph is currently unavailable</h4>;
  }

  if (graphData.length === 0) {
    return <h4>Data is not available for the current year</h4>;
  }


  return (
    <div style={{ width: '100%', position: 'relative' }}>
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
          top: '44%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        TwoTensor
      </span>
      <ResponsiveContainer
        width='100%'
        height={160}
        style={{ overflow: 'hidden', position: 'absolute' }}
      >
        <ComposedChart
          data={graphData}
          margin={{ top: 3, right: 30, left: -20, bottom: 0 }}
        >
          <XAxis
            dataKey='month'
            tickFormatter={formatXAxis}
            axisLine={false}
            tick={{ fontSize: '11px' }}
          />
          <YAxis
            domain={[0, yAxisMax]}
            tickFormatter={formatYAxis}
            tick={false}
            axisLine={false}
          />
          <Tooltip
            content={<CustomTooltip />}
            position='top'
            isAnimationActive={false}
            wrapperStyle={{ pointerEvents: 'auto' }}
          />
          <defs key={`gradient-${shouldChangeColor + uuid}`}>
            <linearGradient
              id={'colorGradient' + uuid}
              x1='0'
              y1='0'
              x2='0'
              y2='1'
            >
              <stop
                offset='0%'
                stopColor={shouldChangeColor ? '#40e0d0' : '#40e0d0'}
                stopOpacity={1}
              />
              <stop
                offset='100%'
                stopColor={shouldChangeColor ? '#40e0d0' : '#40e0d0'}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <Area
            type='monotone'
            dataKey='count'
            stroke={shouldChangeColor ? '#40e0d0' : '#40e0d0'}
            isAnimationActive={false}
            strokeWidth={3} // Makes the line thicker
            fill={`url(#colorGradient${uuid})`}
          />
          <Dot />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimelineGraph;

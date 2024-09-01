  // ActivityLineGraph.js
  import React from 'react';
  import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Area,
    CartesianGrid,
    ComposedChart,
  } from 'recharts';
  import { Card, Typography } from 'antd';

  const { Text } = Typography;
  // Generate a year-long timeline with empty data
  // Generate a year-long timeline with zero data
  const generateYearData = () => {
    const yearData = [];
    for (let i = 1; i <= 365; i++) {
      yearData.push({ day: i, count: 0, companyNames: [] });
    }
    return yearData;
  };

  // Fake data: activity starting from the 183rd day of the year
  // Fake data: activity starting from different days of the year
  const fakeData = generateYearData();
  // fakeData[10].count = 1;
  // fakeData[10].companyNames = ['Apple'];
  // fakeData[20].count = 2;
  // fakeData[20].companyNames = ['Google', 'Microsoft'];
  // fakeData[45].count = 1;
  // fakeData[45].companyNames = ['Facebook'];
  // fakeData[60].count = 2;
  // fakeData[60].companyNames = ['Apple', 'Tesla'];
  // fakeData[90].count = 1;
  fakeData[90].companyNames = ['Microsoft'];
  fakeData[110].count = 3;
  fakeData[110].companyNames = ['Apple', 'Google', 'Tesla'];
  fakeData[182].count = 2;
  fakeData[182].companyNames = ['Apple', 'Google'];
  fakeData[210].count = 1;
  fakeData[210].companyNames = ['Microsoft'];
  fakeData[250].count = 3;
  fakeData[250].companyNames = ['Facebook', 'Google', 'Tesla'];
  fakeData[320].count = 1;
  fakeData[320].companyNames = ['Apple'];
  fakeData[350].count = 2;
  fakeData[350].companyNames = ['Tesla', 'Microsoft'];

  const aggregateDataByMonth = (dailyData) => {
    // Initialize a new array of length 12 for each month
    const monthlyData = Array.from({ length: 12 }, () => ({
      month: 0,
      count: 0,
      companyActions: {},
    }));

    dailyData.forEach((data, index) => {
      const monthIndex = new Date(2024, 0, index + 1).getMonth();
      monthlyData[monthIndex].month = monthIndex + 1;
      monthlyData[monthIndex].count += data.count;

      // Accumulate company actions
      data.companyNames.forEach((company) => {
        monthlyData[monthIndex].companyActions[company] =
          (monthlyData[monthIndex].companyActions[company] || 0) + data.count;
      });
    });

    return monthlyData;
  };

  const weeklyData = aggregateDataByMonth(fakeData);

  const maxCount = Math.max(...weeklyData.map((data) => data.count));
  const yAxisMax = maxCount + Math.ceil(0.5 * maxCount); // 10% above the max value

  // ... you can add more data

  const ActivityLineGraph = () => {
    const CustomTooltip = ({ active, payload }) => {
      if (active && payload && payload.length) {
        const { companyActions } = payload[0].payload;
        const totalActions = Object.values(companyActions).reduce((a, b) => a + b, 0);
        return (
          <Card bordered={true} style={{ width: 200, padding: '5px' }}>
            <Text strong>{`Total Signals: ${totalActions}`}</Text>
            <div style={{ listStyleType: 'none' }}>
              {Object.entries(companyActions).map(([company, actions]) => (
                <div key={company}>
                  <Text type='secondary'>{`${company}: ${actions}`}</Text>
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
    ];

    const formatXAxis = (tickItem) => {
      return months[tickItem - 1];
    };

    return (
      <ComposedChart width={1500} height={500} data={weeklyData}>
        {/* <CartesianGrid strokeDasharray='3 3' /> */}
        <XAxis dataKey='month' tickFormatter={formatXAxis} />
        <YAxis
          domain={[-0.25, yAxisMax]}
          tickFormatter={formatYAxis}
          tick={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <defs>
          <linearGradient id='colorGradient' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stopColor='#82ca9d' stopOpacity={1} />
            <stop offset='100%' stopColor='#82ca9d' stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type='monotone'
          dataKey='count'
          stroke='#82ca9d'
          dot={false}
          isAnimationActive={false}
          strokeWidth={3} // Makes the line thicker
          fill='url(#colorGradient)'
        />
      </ComposedChart>
    );
  };

  export default ActivityLineGraph;

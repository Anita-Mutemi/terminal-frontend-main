import React, { useState, useEffect } from 'react';
import {
  ComposedChart,
  Line,
  Area,
  Bar, // Add Bar component
  XAxis,
  YAxis,
  Brush,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import styled, { useTheme } from 'styled-components';
import { Switch, FormControlLabel } from '@mui/material';
import DifferenceTable from './Table';
// const businessTags = ['Fintech', 'AI', 'Healthcare', 'E-commerce', 'Renewable Energy'];

export const SignalsAnalytics = ({ data }) => {
  const businessTags = [
    'Navigation',
    'OEM Focussed',
    'Other',
    'Parking',
    'Public Transportation',
    'Rail Transportation',
    'Range Extender',
    'Real Estate',
    'Recycling Technology',
    'Regulation',
    'Retail',
    'Ride Hailing',
    'Roadside Assistance',
    'Robotics',
    'Sensing',
    'Small & Medium Businesses',
    'Social Media',
    'Software',
    'Supply Chain',
  ];

  const [filteredData, setFilteredData] = useState(data);
  const [selectedTags, setSelectedTags] = useState(
    businessTags.reduce((acc, tag) => {
      acc[tag] = true; // Setting initial value to true for all tags
      return acc;
    }, {}),
  );

  useEffect(() => {
    const newFilteredData = data.filter((item) => selectedTags[item.businessTag]);
    setFilteredData(newFilteredData);
  }, [selectedTags, data]);

  const toggleTag = (tag) => {
    setSelectedTags((prevTags) => ({ ...prevTags, [tag]: !prevTags[tag] }));
  };

  return (
    <Wrapper>
      <GraphWrapper>
        <Analytics data={filteredData} selectedTags={selectedTags} />
        <TagsOptionsWrapper>
          <TagsOptions>
            {businessTags.map((tag, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Switch checked={!!selectedTags[tag]} onChange={() => toggleTag(tag)} />
                }
                label={tag}
              />
            ))}
          </TagsOptions>
        </TagsOptionsWrapper>
      </GraphWrapper>
      <DifferenceTable />
    </Wrapper>
  );
};

const Analytics = ({ data, selectedTags }) => {
  const businessTags = [
    'Navigation',
    'OEM Focussed',
    'Other',
    'Parking',
    'Public Transportation',
    'Rail Transportation',
    'Range Extender',
    'Real Estate',
    'Recycling Technology',
    'Regulation',
    'Retail',
    'Ride Hailing',
    'Roadside Assistance',
    'Robotics',
    'Sensing',
    'Small & Medium Businesses',
    'Social Media',
    'Software',
    'Supply Chain',
  ];

  // Count signals for each month
  const signalCounts = countSignalsByMonth(data, selectedTags);
  const businessTagSignalCounts = countSignalsByBusinessTag(data, businessTags); // New function
  const mergedCounts = mergeCounts(signalCounts, businessTagSignalCounts);

  // State to track the active data range
  const [activeRange, setActiveRange] = useState([
    0,
    Math.min(2, signalCounts.length - 1),
  ]);
  // Event handler for brush end
  const handleBrushEnd = (range) => {
    setActiveRange(range);
  };

  const maxCount = 4;
  const yAxisMax = maxCount + Math.ceil(0.5 * maxCount); // 10% above the max value

  const theme = useTheme();

  // more bars

  const getRandomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16);

  return (
    <ResponsiveContainer width='100%' height={700}>
      <ComposedChart
        width={'100%'}
        height={500}
        data={mergedCounts}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray='2 2' stroke={theme.borderColor} />
        <XAxis
          dataKey='signal_date'
          tickFormatter={(value) => value.split('-').slice(0, 2).join('-')}
          tick={{ fontSize: 13, dy: 11 }}
          stroke={theme.subText} // Added this line
        />
        z
        <YAxis
          domain={[0, yAxisMax]}
          stroke={theme.subText} // Added this line
          tick={{ fontSize: 13 }}
        />
        <Tooltip />
        <Legend />
        <defs>
          <linearGradient id='colorGradient' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stopColor='#82ca9d' stopOpacity={0.6} />
            <stop offset='80%' stopColor='#82ca9d' stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type='monotone'
          dataKey='Total'
          strokeWidth={3}
          fill='url(#colorGradient)'
          stroke='#82ca9d'
        />
        {businessTags.map((tag, index) => (
          <Line key={index} type='monotone' dataKey={tag} stroke={getRandomColor()} />
        ))}
        <Area
          type='monotone'
          dataKey='Signal Count'
          stroke='#8884d8'
          fill='url(#colorGradient)'
        />
        {/* <Brush
          dataKey='signal_date'
          height={20}
          fill={theme.body}
          y={605}
          style={{ marginTop: '1rem' }}
          // startIndex={activeRange[0]}
          // endIndex={activeRange[1]}
          // onChange={handleBrushEnd}
        /> */}
      </ComposedChart>
    </ResponsiveContainer>
  );
};

// Function to count signals by month
// const countSignalsByMonth = (data, selectedTags) => {
//   const signalCounts = {};

//   data.forEach((entry) => {
//     const signalDate = entry.signal_date.split('T')[0];
//     const month = signalDate.substring(0, 7);
//     if (!signalCounts[month]) signalCounts[month] = {};

//     if (selectedTags[entry.tag]) {
//       if (!signalCounts[month][entry.tag]) signalCounts[month][entry.tag] = 0;
//       signalCounts[month][entry.tag]++;
//     }
//   });

//   const signalCountsArray = Object.keys(signalCounts).map((month) => ({
//     signal_date: month,
//     ...signalCounts[month],
//   }));

//   return signalCountsArray;
// };

const mergeCounts = (totalCounts, businessTagCounts) => {
  return totalCounts.map((item, index) => {
    return {
      ...item,
      ...businessTagCounts[index],
    };
  });
};

const countSignalsByBusinessTag = (data, businessTags) => {
  const signalCounts = {};

  data.forEach((entry) => {
    const signalDate = entry.signal_date.split('T')[0];
    const month = signalDate.substring(0, 7);

    if (!signalCounts[month]) {
      signalCounts[month] = {};
      businessTags.forEach((tag) => {
        signalCounts[month][tag] = 0; // Initialize all tags to zero
      });
    }

    const tag = entry.businessTag;
    if (businessTags.includes(tag)) {
      signalCounts[month][tag]++;
    }
  });

  const signalCountsArray = Object.keys(signalCounts).map((month) => ({
    signal_date: month,
    ...signalCounts[month],
  }));

  return signalCountsArray;
};

const countSignalsByMonth = (data, selectedTags) => {
  const signalCounts = {};

  data.forEach((entry) => {
    const signalDate = entry.signal_date.split('T')[0];
    const month = signalDate.substring(0, 7);

    if (!signalCounts[month]) signalCounts[month] = { Total: 0 };
    signalCounts[month]['Total']++; // Increasing the total count regardless of the tag

    if (selectedTags[entry.tag]) {
      if (!signalCounts[month][entry.tag]) signalCounts[month][entry.tag] = 0;
      signalCounts[month][entry.tag]++;
    }
  });

  const signalCountsArray = Object.keys(signalCounts).map((month) => ({
    signal_date: month,
    ...signalCounts[month],
  }));

  return signalCountsArray;
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
const GraphWrapper = styled.div`
  display: flex;
  gap: 1rem;
`;

const TagsOptionsWrapper = styled.div`
  border-left: 1px solid lightgray;
  /* width: 100%; */
  min-width: 5rem;
  padding: 1rem;
  /* height: 22rem; */
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
`;
const TagsOptions = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: flex-start;
  overflow-y: auto;
  align-items: start;
  max-height: 40rem;
  gap: 1rem;
  overflow-x: hidden;
  overflow-y: auto;
  padding-left: 0.4rem;
`;

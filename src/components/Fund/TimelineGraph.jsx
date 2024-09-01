import { useEffect, useState, useCallback } from 'react';
import { Card, Typography } from 'antd';
import axios from 'axios';
import { useTheme } from 'styled-components';
import LinearProgress from '@mui/material/LinearProgress';
import { PlaceholderGraph } from '../FundCard';

import {
	XAxis,
	YAxis,
	Tooltip,
	Area,
	CartesianGrid,
	ResponsiveContainer,
	ComposedChart,
} from 'recharts';

const { Text } = Typography;

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
	});

	return monthlyData;
};

const TimelineGraph = ({ uuid, access_token }) => {
	const [status, setStatus] = useState();
	const [graphData, setGraphData] = useState([]);

	const weeklyData = aggregateDataByMonth(graphData);
	const theme = useTheme();

	const maxCount = Math.max(...weeklyData.map((data) => data.count));
	const yAxisMax = maxCount + 5; // Adds 5 units of padding at the top.

	const fetchData = async (uuid) => {
		const config = {
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		};
		setStatus('loading');
		try {
			const { data } = await axios.get(
				`/v1/fund/${uuid}/timeline?flatten=false`,
				config,
			);
			return data;
		} catch (err) {
			setStatus('error');
		} finally {
			if (status !== 'error') {
				setStatus('finished');
			}
		}
	};
	const [year, setYear] = useState(2024);

	const convertServerDataToGraphData = (serverData) => {
		// Initialize a template for the whole year, setting total counts to 0
		const monthlyDataTemplate = Array.from({ length: 12 }, (_, i) => ({
			month: i + 1,
			count: 0,
		}));

		// Iterate over the received data and populate the monthly data based on the 'months' array
		serverData.forEach((yearlyData) => {
			// Populate only for the relevant year if needed or all years
			yearlyData.months.forEach((monthData) => {
				// Assuming the monthData.month is 1-indexed, as months usually are
				const monthIndex = monthData.month - 1; // Convert to 0-index for array access
				monthlyDataTemplate[monthIndex].count = monthData.total; // Directly use the total provided for the month
			});
		});

		// No need to flat-map or filter as we've built the entire year data directly
		return monthlyDataTemplate;
	};

	useEffect(() => {
		const fetchAndPrepareData = async () => {
			const serverData = await fetchData(uuid, access_token);
			const preparedData = convertServerDataToGraphData(serverData);
			setGraphData(preparedData);
		};

		fetchAndPrepareData();
	}, [uuid, access_token]);

	const CustomTooltip = ({ active, payload }) => {
		if (active && payload && payload.length) {
			const { companyActions } = payload[0].payload;
			const totalActions = Object.values(companyActions).reduce(
				(a, b) => a + b,
				0,
			);
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
					}}>
					<Text
						style={{ color: theme.text }}
						strong>{`Total Signals: ${totalActions}`}</Text>
					<div style={{ listStyleType: 'none' }}>
						{Object.entries(companyActions).map(([company, actions]) => (
							<div key={company}>
								{actions && (
									<Text
										type='secondary'
										style={{
											color: theme.text,
										}}>{`${company}: ${actions}`}</Text>
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
			<div
				style={{
					minHeight: '140px',
					width: '100%',
					display: 'flex',
					justifyContent: 'flex-end',
					alignItems: 'flex-end',
				}}>
				<LinearProgress sx={{ width: '100%' }} />
			</div>
		);
	}

	if (status === 'error' || !graphData || graphData.length === 0) {
		return (
			<div style={{ minHeight: '140px', width: '100%' }}>
				<PlaceholderGraph titleSize='16px' />
			</div>
		);
	}

	if (graphData.length === 0) {
		return <div style={{ minHeight: '140px', width: '100%' }}></div>;
	}

	return (
		<div style={{ width: '100%', minWidth: '54rem' }}>
			<ResponsiveContainer
				// width={1150}
				height={120}
				style={{
					overflow: 'hidden',
					position: 'absolute',
					minHeight: '500px',
					minWidth: '59rem',
				}}>
				<ComposedChart
					data={graphData}
					margin={{ top: 10, right: 0, left: 0, bottom: 10 }}>
					{/* <Tooltip
          content={<CustomTooltip />}
          position='top'
          isAnimationActive={false}
          wrapperStyle={{ pointerEvents: 'auto' }}
        /> */}
					<YAxis
						domain={[-1, 'dataMax']}
						hide={true}
					/>

					<defs>
						<linearGradient
							id='colorGradient'
							x1='0'
							y1='0'
							x2='0'
							y2='1'>
							<stop
								offset='-30%'
								stopColor={year !== currentYear ? '#40e0d0' : '#40e0d0'}
								stopOpacity={1}
							/>
							<stop
								offset='150%'
								stopColor={year !== currentYear ? '#40e0d0' : '#40e0d0'}
								stopOpacity={0}
							/>
						</linearGradient>
					</defs>
					<Area
						type='monotone'
						dataKey='count'
						stroke={year !== currentYear ? '#40e0d0' : '#40e0d0'}
						dot={false}
						isAnimationActive={false}
						strokeWidth={3} // Makes the line thicker
						fill='url(#colorGradient)'
						baseValue={-1}
					/>
				</ComposedChart>
			</ResponsiveContainer>
		</div>
	);
};

export default TimelineGraph;

import { useEffect, useState } from 'react';
import { Card, Typography } from 'antd';
import axios from 'axios';
import { useTheme } from 'styled-components';
import * as BsIcons from 'react-icons/bs';
// import * as AiIcons from 'react-icons/ai';
import { useScreenshot } from '../../hooks/useScreenshot';
import Tooltip from '@mui/material/Tooltip';
import { scaleLog } from 'd3-scale';
import { Oval } from 'react-loader-spinner';
import styled from 'styled-components';
import logo from '../../assets/logo-gray.png';

import useCsvDownloader from '../../hooks/useCsvDownloader';
import {
	XAxis,
	YAxis,
	Tooltip as RechartsTooltip,
	Area,
	CartesianGrid,
	ResponsiveContainer,
	ComposedChart,
	Line,
	LineChart,
	Brush,
	Bar,
} from 'recharts';
import DifferenceTable from './Table';
import { GeneralErrorBoundary } from '../../UI/Errors/GeneralErrorBoundary';
// import { Switch, FormControlLabel } from '@mui/material';
import { Switch } from 'antd';
import TimeSpanIndicator from './TimeSpanIndicator';

export const SignalsAnalytics = ({ data, uuid, access_token, fundName }) => {
	const theme = useTheme();

	const [selectedView, setSelectedView] = useState('M'); // Initial selection
	const [view, setView] = useState('barChart');
	const [status, setStatus] = useState('loading');
	const [captureRef, takeScreenshot] = useScreenshot();
	const [brushColor, setBrushColor] = useState(theme.background);
	const [graphData, setGraphData] = useState([]);

	const handleDownloadImage = async () => {
		const $title = document.querySelector('#graph-title');
		const $brush = document.querySelector('.recharts-brush');

		// Change the fill color to red
		try {
			setBrushColor('white');
			$brush.style.display = 'none';
			$title.innerHTML = `TwoTensor | ${fundName}`;
			const blob = await takeScreenshot();
			const url = URL.createObjectURL(blob);
			// Create a link element to download the blob
			const link = document.createElement('a');
			link.href = url;
			link.download = `${fundName}.jpg`; // Name the file
			document.body.appendChild(link);
			link.click(); // Simulate click to download
			link.remove(); // Clean up the DOM

			// Free up the URL object
			URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Error taking screenshot', error);
		} finally {
			$title.innerHTML = `TwoTensor`;
			$brush.style.display = 'block';
		}
	};

	const handleChartTypeChange = (newChartType = 'lineGraph') => {
		// Callback function to handle chart type change
		setView(newChartType);
		// You can perform additional actions here based on the selected chart type
	};

	const chartTypeOptions = [
		{
			label: 'Bar Chart',
			value: 'barChart',
			icon: <BsIcons.BsFillBarChartFill />,
		}, // Use the Bar Chart icon
		{ label: 'Line Graph', value: 'lineGraph', icon: <BsIcons.BsGraphUp /> }, // Use the Line Graph icon
	];

	const handleViewChange = (newView) => {
		// Callback function to handle view change
		setSelectedView(newView);
		// You can perform additional actions here based on the selected view
	};

	const viewOptions = [
		{ label: 'W', value: 'W' },
		{ label: 'M', value: 'M' },
		{ label: 'Y', value: 'Y' },
	];

	const businessTags = [
		'Software',
		'Robotics',
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
		'Sensing',
		'Small & Medium Businesses',
		'Social Media',
		'Supply Chain',
	];

	// const [filteredData, setFilteredData] = useState(data);
	const [selectedTags, setSelectedTags] = useState(
		businessTags.reduce((acc, tag) => {
			acc[tag] = true; // Setting initial value to true for all tags
			return acc;
		}, {}),
	);

	useEffect(() => {
		// const newFilteredData = data.filter((item) => selectedTags[item.businessTag]);
		// setFilteredData(newFilteredData);
	}, [selectedTags, data]);

	const toggleTag = (tag) => {
		setSelectedTags((prevTags) => ({ ...prevTags, [tag]: !prevTags[tag] }));
	};

	const { downloadCsv, downloadStatus } = useCsvDownloader(
		'downloaded-data.csv',
	);

	const handleDownload = (data) => {
		downloadCsv(data);
		// additional logic if needed
	};

	return (
		<Wrapper>
			<h4
				style={{
					marginLeft: '1.5rem',
					marginBottom: '0.15rem',
					fontSize: '18px',
					marginTop: '0.1rem',
				}}></h4>
			<style>
				{`
        .red-switch.ant-switch-checked {
          background-color: red !important;
        }
        .red-switch.ant-switch-disabled {
          background-color: ${theme.body} !important; /* Grey for when switch is disabled and not checked */
          outline: 1px solid ${theme.text} !important;
        }
        .red-switch.ant-switch-disabled.ant-switch-checked {
          background: #40e0d0 !important; /* Green for when switch is disabled and checked */
        }
        .red-switch.ant-switch-disabled {
          outline: 1px solid ${theme.text} !important; /* Grey border for when switch is disabled and not checked */
        }
        .red-switch.ant-switch-disabled .ant-switch-handle:before {
          background-color: ${theme.text}; !important; /* Grey color for the handle when disabled */
        }
        .red-switch:not(.ant-switch-checked) .ant-switch-handle:before {
          background-color: ${theme.text}; /* Orange handle color when the switch is not checked */
        }
      `}
			</style>
			<div
				style={{
					width: '95%',
					display: 'flex',
					gap: '0.5rem',
					marginLeft: '1.6rem',
					marginBottom: '0.4rem',
					justifyContent: 'space-between',
					position: 'relative',
				}}>
				<div style={{ display: 'flex', gap: '0.5rem' }}>
					{status !== 'loading' && (
						<>
							<TimeSpanIndicator
								options={chartTypeOptions}
								selectedValue={view}
								onChange={handleChartTypeChange}
								small={true}
							/>
							{/* <TimeSpanIndicator
                options={viewOptions}
                selectedValue={selectedView}
                onChange={handleViewChange}
                small={true}
                disabled={true}
              /> */}
						</>
					)}
				</div>
				{status !== 'loading' && (
					<div
						style={{
							fontSize: '11.7px',
							textDecoration: 'underline',
							cursor: 'pointer',
							position: 'absolute',
							display: 'flex',
							gap: '0.6rem',
							right: '0.5rem',
							bottom: '-1rem',
						}}>
						<Tooltip title='Download graph image.'>
							<span
								style={{
									fontSize: '11.7px',
									textDecoration: 'underline',
									cursor: 'pointer',
								}}
								onClick={handleDownloadImage}>
								Save graph
							</span>
						</Tooltip>
						<Tooltip title='Request data in your preferred CSV format.'>
							<span
								style={{
									fontSize: '11.7px',
									textDecoration: 'underline',
									cursor: 'pointer',
								}}
								onClick={() => handleDownload(graphData)}>
								Export CSV
							</span>
						</Tooltip>
					</div>
				)}
				{/* <div style={{ display: 'flex', border: '1px solid gray' }}>
          <AiIcons.AiFillCamera onClick={handleDownloadImage} />
        </div> */}
			</div>
			<GraphWrapper>
				<div
					style={{ width: '100%', height: '100%' }}
					ref={captureRef}>
					<Analytics
						selectedTags={selectedTags}
						uuid={uuid}
						access_token={access_token}
						view={view}
						selectedView={selectedView}
						status={status}
						graphData={graphData}
						setGraphData={setGraphData}
						brushColor={brushColor}
						setStatus={setStatus}
					/>
				</div>
			</GraphWrapper>
			{/* {status !== 'loading' && <DifferenceTable />} */}
		</Wrapper>
	);
};

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

const Analytics = ({
	uuid,
	access_token,
	view = 'lineGraph',
	status,
	brushColor,
	graphData,
	setGraphData,
	setStatus,
	selectedView,
}) => {
	const weeklyData = aggregateDataByMonth(graphData);
	const theme = useTheme();
	const maxCount = Math.max(...graphData.map((data) => data.count));
	// const yAxisMax = 4 - 4 * 0.05;

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

	useEffect(() => {
		setTimeout(() => {
			const $brush = document.querySelector('.recharts-brush-slide');
			$brush?.setAttribute('fill-opacity', 0);
		}, 1);
		// setBrushColor(theme.background);
	}, [status]);

	const CustomTooltip = ({ active, payload }) => {
		if (active && payload && payload.length) {
			const { count } = payload[0].payload;
			// const totalActions = Object.values(companyActions).reduce((a, b) => a + b, 0);
			return count > 0 ? (
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
						strong>{`Total Signals: ${count}`}</Text>
					<div style={{ listStyleType: 'none' }}>
						{/* {Object.entries(companyActions).map(([company, actions]) => (
              <div key={company}>
                {actions && (
                  <Text
                    type='secondary'
                    style={{ color: theme.text }}
                  >{`${company}: ${actions}`}</Text>
                )}
              </div>
            ))} */}
					</div>
				</Card>
			) : null;
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

	if (status === 'error') {
		return <h4>Graph is currently unavailable</h4>;
	}

	if (status === 'loading') {
		return (
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}>
				<Oval
					height={100}
					width={100}
					color='#484848'
					wrapperStyle={{}}
					wrapperClass=''
					visible={true}
					ariaLabel='oval-loading'
					secondaryColor='#222222'
					strokeWidth={2}
					strokeWidthSecondary={2}
				/>
			</div>
		);
	}
	const scale = scaleLog().base(Math.E);

	return (
		<div style={{ width: '100%', position: 'relative' }}>
			<img
				src={logo}
				alt='logo'
				style={{
					position: 'absolute',
					width: '29rem',
					opacity: 0.1,
					left: '50%',
					top: '45%',
					transform: 'translate(-50%, -50%)',
				}}
			/>
			{/* <h3
        style={{
          position: 'absolute',
          opacity: 0.8,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          filter: 'brightness(60%)',
          color: theme.borderColor,
          fontSize: '56px',
          fontWeight: 'bold',
          zIndex: 999999,
          pointerEvents: 'none',
        }}
        id='graph-title'
      >
        TwoTensor
      </h3> */}
			<ResponsiveContainer
				width='100%'
				height={500}
				style={{ overflow: 'hidden', position: 'relative' }}>
				<ComposedChart
					data={graphData}
					margin={{ top: 5, right: 30, left: -20, bottom: 0 }}>
					<XAxis
						dataKey='month'
						tickFormatter={formatXAxis}
						tick={{ fontSize: '11px' }}
					/>
					<YAxis
						domain={[5, maxCount + 55]}
						scale={'auto'}
						stroke={theme.subText} // Added this line
						tick={{ fontSize: 13 }}
					/>{' '}
					<CartesianGrid
						strokeDasharray='2 2'
						stroke={theme.borderColor}
					/>
					<RechartsTooltip
						content={<CustomTooltip />}
						position='top'
						isAnimationActive={false}
						wrapperStyle={{ pointerEvents: 'auto', zIndex: 99999999999 }}
					/>
					<defs>
						<linearGradient
							id='colorGradient'
							x1='0'
							y1='0'
							x2='0'
							y2='1'>
							<stop
								offset='0%'
								stopColor={year !== currentYear ? '#40e0d0' : '#40e0d0'}
								stopOpacity={1}
							/>
							<stop
								offset='100%'
								stopColor={year !== currentYear ? '#40e0d0' : '#40e0d0'}
								stopOpacity={0}
							/>
						</linearGradient>
					</defs>
					{view === 'lineGraph' && (
						<Area
							type='monotone'
							dataKey='count'
							stroke={year !== currentYear ? '#40e0d0' : '#40e0d0'}
							dot={false}
							isAnimationActive={false}
							strokeWidth={3} // Makes the line thicker
							fill='url(#colorGradient)'
						/>
					)}
					{view === 'barChart' && (
						<Bar // Change from Area to Bar
							dataKey='count'
							fill={year !== currentYear ? '#40e0d0' : '#40e0d0a9'} // Fill color for the bars
						/>
					)}
					<Brush
						dataKey='count'
						// height={20}
						fill={theme.background}
						// y={605}
						// style={{ marginTop: '1rem' }}
						// startIndex={activeRange[0]}
						// endIndex={activeRange[1]}
						// onChange={handleBrushEnd}
					>
						<LineChart data={graphData}>
							<Line
								type='monotone'
								dataKey='count'
								stroke='#40e0d0a9'
								dot={false}
								style={{ boxShadow: '120px 80px 40px 20px #0ff' }}
							/>
						</LineChart>
					</Brush>
				</ComposedChart>
			</ResponsiveContainer>
		</div>
	);
};

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	width: 100%;
`;
const GraphWrapper = styled.div`
	display: flex;
	gap: 1rem;
	width: 100%;
`;

const TagsOptionsWrapper = styled.div`
	border-left: 1px solid lightgray;
	/* width: 100%; */
	min-width: 5rem;
	padding: 1rem;
	padding-top: 0rem;
	/* height: 22rem; */
	height: 28rem;
	overflow-x: hidden;
	overflow-y: hidden;
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
	padding-top: 1rem;
	overflow-x: hidden;
	overflow-y: auto;
	padding-left: 0.4rem;
`;

export default SignalsAnalytics;

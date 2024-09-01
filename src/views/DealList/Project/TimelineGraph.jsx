import { useEffect, useState, useCallback } from 'react';
import { Card, Typography } from 'antd';
import axios from 'axios';
import { useTheme } from 'styled-components';
import { Oval } from 'react-loader-spinner';
import {
	XAxis,
	YAxis,
	Tooltip,
	Line,
	Bar,
	Area,
	ResponsiveContainer,
	ComposedChart,
	AreaChart,
} from 'recharts';
import logo from '../../../assets/logo-gray.png';

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
		} finally {
			setStatus('finished');
		}
	};

	const [year, setYear] = useState(2024);

	const convertServerDataToGraphData3 = (serverData) => {
		const monthlyDataTemplate = Array.from({ length: 12 }, (_, i) => ({
			month: i + 1,
			count: 0,
			directCount: 0, // Add direct_signals count
			indirectCount: 0, // Add indirect_signals count
			companyActions: [],
		}));

		let lastActionMonthIndex = -1;

		serverData.direct_signals.forEach((signal) => {
			const monthIndex = new Date(signal.signal_date).getMonth();
			monthlyDataTemplate[monthIndex].count += signal.fund.count;
			monthlyDataTemplate[monthIndex].directCount += signal.fund.count;
			monthlyDataTemplate[monthIndex].companyActions.push({
				type: 'direct_signals',
				count: signal.fund.count,
				fund: signal.fund.fund.name,
			});

			if (monthlyDataTemplate[monthIndex].count > 0) {
				lastActionMonthIndex = monthIndex;
			}
		});

		serverData.indirect_signals.forEach((signal) => {
			const monthIndex = new Date(signal.signal_date).getMonth();
			monthlyDataTemplate[monthIndex].count += signal.fund.count;
			monthlyDataTemplate[monthIndex].indirectCount += signal.fund.count;
			monthlyDataTemplate[monthIndex].companyActions.push({
				type: 'indirect_signals',
				count: signal.fund.count,
				fund: signal.fund.fund.name,
			});

			if (monthlyDataTemplate[monthIndex].count > 0) {
				lastActionMonthIndex = monthIndex;
			}
		});

		const noIndirectAfterLastDirect =
			lastActionMonthIndex !== -1 &&
			lastActionMonthIndex < monthlyDataTemplate.length - 1 &&
			monthlyDataTemplate[lastActionMonthIndex + 1].indirectCount === 0;

		return {
			data: monthlyDataTemplate,
			shouldChangeColor: noIndirectAfterLastDirect,
		};
	};
	const convertServerDataToGraphData = (serverData) => {

		// Initialize a template for the whole year, setting total counts to 0
		const monthlyDataTemplate = Array.from({ length: 12 }, (_, i) => ({
			month: i + 1,
			count: 0,
			directCount: 0,
			indirectCount: 0,
			companyActions: [],
		}));

		const dataSource = serverData.find((item) => {
			return item.year === 2024;
		});
		// Iterate over the received data and populate the monthly data based on the 'months' array
		dataSource.months.forEach((monthData) => {
			const monthIndex = monthData.month - 1; // Convert to 0-index for array access

			// Add total, direct, and indirect counts
			monthlyDataTemplate[monthIndex].count = monthData.total;
			monthlyDataTemplate[monthIndex].directCount = monthData.count_direct;
			monthlyDataTemplate[monthIndex].indirectCount = monthData.count_indirect;

			// Process direct and indirect signals for the month
			const processSignals = (signals, type) =>
				signals.map((signal) => ({
					type: type,
					count: signal.count,
					fund: signal.fund.name,
				}));

			monthlyDataTemplate[monthIndex].companyActions = [
				...processSignals(monthData.direct_signals, 'direct_signals'),
				...processSignals(monthData.indirect_signals, 'indirect_signals'),
			];
		});

		// Determine if there should be a color change for the graph area fill
		// Find the last month with company actions
		let lastActionMonthIndex = -1;
		for (let i = monthlyDataTemplate.length - 1; i >= 0; i--) {
			if (monthlyDataTemplate[i].count > 0) {
				lastActionMonthIndex = i;
				break; // Exit the loop after finding the last month with actions
			}
		}

		// Check for no action after the last action month
		const noActionAfterLastActionMonth =
			lastActionMonthIndex !== -1 &&
			lastActionMonthIndex < monthlyDataTemplate.length - 1 &&
			monthlyDataTemplate[lastActionMonthIndex + 1].count === 0;

		return {
			data: monthlyDataTemplate,
			noActionAfterLastActionMonth: noActionAfterLastActionMonth,
		};
	};

	const convertServerDataToGraphData2 = (serverData) => {
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
				return;
			}

			const testData = {
				status: 'success',
				timeline: {
					direct_signals: [
						{
							signal_date: '2023-11-01',
							fund: {
								fund: {
									uuid: 'b8a50afb-b78c-4edc-8850-f69c7cec3056',
									name: 'AutoTech Ventures',
									website: 'http://www.autotechvc.com',
									logo: 'https://static.twotensor.com/images/funds/b8a50afb-b78c-4edc-8850-f69c7cec3056.jpg',
									total_signals: 612,
									signals_quarter: 289,
									signals_month: 108,
								},
								count: 2,
							},
						},
						{
							signal_date: '2023-11-01',
							fund: {
								fund: {
									uuid: '624769b3-d5e0-4905-9dd5-36982128afae',
									name: 'Alumni Ventures',
									website: 'https://www.av.vc/',
									logo: 'https://static.twotensor.com/images/funds/624769b3-d5e0-4905-9dd5-36982128afae.jpg',
									total_signals: 2649,
									signals_quarter: 1036,
									signals_month: 147,
								},
								count: 1,
							},
						},
						{
							signal_date: '2023-12-01',
							fund: {
								fund: {
									uuid: '54e57f1c-0fdc-49d0-88e9-0e788ecf9570',
									name: 'Yamaha Motor Ventures',
									website: null,
									logo: 'https://images.crunchbase.com/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/tixxomgiedsur6eduazz',
									total_signals: 132,
									signals_quarter: 132,
									signals_month: 88,
								},
								count: 1,
							},
						},
						{
							signal_date: '2023-12-01',
							fund: {
								fund: {
									uuid: 'cd8e408d-f0e0-48a4-bb92-6271c112b4a9',
									name: 'Up Partners',
									website: 'http://www.up.partners',
									logo: 'https://static.twotensor.com/images/funds/cd8e408d-f0e0-48a4-bb92-6271c112b4a9.jpg',
									total_signals: 704,
									signals_quarter: 391,
									signals_month: 87,
								},
								count: 2,
							},
						},
						{
							signal_date: '2023-12-01',
							fund: {
								fund: {
									uuid: '624769b3-d5e0-4905-9dd5-36982128afae',
									name: 'Alumni Ventures',
									website: 'https://www.av.vc/',
									logo: 'https://static.twotensor.com/images/funds/624769b3-d5e0-4905-9dd5-36982128afae.jpg',
									total_signals: 2649,
									signals_quarter: 1036,
									signals_month: 147,
								},
								count: 3,
							},
						},
						{
							signal_date: '2024-02-01',
							fund: {
								fund: {
									uuid: 'cd8e408d-f0e0-48a4-bb92-6271c112b4a9',
									name: 'Up Partners',
									website: 'http://www.up.partners',
									logo: 'https://static.twotensor.com/images/funds/cd8e408d-f0e0-48a4-bb92-6271c112b4a9.jpg',
									total_signals: 704,
									signals_quarter: 391,
									signals_month: 87,
								},
								count: 1,
							},
						},
					],
					indirect_signals: [
						{
							signal_date: '2023-12-01',
							fund: {
								fund: {
									uuid: '7f7ae15d-d118-45f4-8efa-3776a0e1a5d7',
									name: 'Momenta',
									website: null,
									logo: 'https://static.twotensor.com/images/funds/7f7ae15d-d118-45f4-8efa-3776a0e1a5d7.jpg',
									total_signals: 325,
									signals_quarter: 325,
									signals_month: 130,
								},
								count: 1,
							},
						},
						{
							signal_date: '2023-12-01',
							fund: {
								fund: {
									uuid: 'ae341fa7-6fc0-48e9-94b4-ef4c2608bd72',
									name: '8090 Industries',
									website: null,
									logo: null,
									total_signals: 151,
									signals_quarter: 151,
									signals_month: 107,
								},
								count: 2,
							},
						},
						{
							signal_date: '2024-02-01',
							fund: {
								fund: {
									uuid: 'b8a50afb-b78c-4edc-8850-f69c7cec3056',
									name: 'AutoTech Ventures',
									website: 'http://www.autotechvc.com',
									logo: 'https://static.twotensor.com/images/funds/b8a50afb-b78c-4edc-8850-f69c7cec3056.jpg',
									total_signals: 612,
									signals_quarter: 289,
									signals_month: 108,
								},
								count: 1,
							},
						},
					],
				},
			};

			const { data: preparedData, noActionAfterLastActionMonth } =
				convertServerDataToGraphData(serverData.timeline);
			const { data: preparedData2, noActionAfterLastActionMonth2 } =
				convertServerDataToGraphData3(testData.timeline);
			const transformData = (data) => {
				return data.map((item) => ({
					...item,
					indirectCount: item.indirectCount === 0 ? 0.45 : item.indirectCount,
					directCount: item.directCount === 0 ? 0.45 : item.directCount,
				}));
			};
			// const { data: preparedData, noActionAfterLastActionMonth } = convertServerDataToGraphData(serverData.timeline);

			setGraphData(transformData(preparedData));

			// Set a state variable to hold the flag for changing color
			setShouldChangeColor(noActionAfterLastActionMonth); // Assume you have a state setter for this
		};

		fetchAndPrepareData();
	}, [uuid, access_token]);

	const CustomTooltip = ({ active, payload }) => {
		if (active && payload && payload.length) {
			const { month, count, directCount, indirectCount, companyActions } =
				payload[0].payload;

			const directActions = companyActions.filter(
				(action) => action.type === 'direct_signals',
			);
			const indirectActions = companyActions.filter(
				(action) => action.type === 'indirect_signals',
			);

			if (directActions.length === 0 && indirectActions.length === 0)
				return null;

			return (
				<Card
					bordered={false}
					size='small'
					style={{
						width: 230,
						zIndex: 9999999,
						padding: '5px',
						maxHeight: '200px',
						overflowY: 'auto',
						overflowX: 'hidden',
						background: theme.background,
						color: theme.text,
						borderRadius: '4px',
						boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
						fontSize: '12px', // Smaller font size
					}}>
					{/* <div style={{ marginBottom: '5px' }}>
            <Text style={{ display: 'block', fontWeight: 'bold' }}>
              Total Signals: {count}
            </Text>
          </div> */}
					{directActions.length > 0 && (
						<div style={{ marginBottom: '5px' }}>
							<Text
								style={{
									fontWeight: 'bold',
									color: '#30e8d6',
									marginBottom: '1px',
								}}>
								Direct Signals:
							</Text>
							<ul style={{ paddingLeft: '15px', margin: '0' }}>
								{directActions.map((action, index) => (
									<li
										key={index}
										style={{
											color: theme.text,
											margin: '0',
											padding: '1px 0',
										}}>
										{action.fund}: {action.count}
									</li>
								))}
							</ul>
						</div>
					)}
					{indirectActions.length > 0 && (
						<div>
							<Text
								style={{
									fontWeight: 'bold',
									color: '#ff7e0e',
									marginBottom: '1px',
								}}>
								Indirect Signals:
							</Text>
							<ul style={{ paddingLeft: '15px', margin: '0' }}>
								{indirectActions.map((action, index) => (
									<li
										key={index}
										style={{
											color: theme.text,
											margin: '0',
											padding: '1px 0',
										}}>
										{action.fund}: {action.count}
									</li>
								))}
							</ul>
						</div>
					)}
				</Card>
			);
		}
		return null;
	};

	// Assuming graphData is your data array
	const hasNonZeroDirectCount = graphData.some(
		(item) => item.directCount > 0.5,
	);
	const hasNonZeroIndirectCount = graphData.some(
		(item) => item.indirectCount > 0.5,
	);

	const CustomTooltip2 = ({ active, payload }) => {
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
					}}>
					<Text
						style={{ color: theme.textColor }}
						strong>{`Total Signals: ${payload[0].payload?.count}`}</Text>
					<div style={{ listStyleType: 'none' }}>
						{totalAction2.map((item) => (
							<div key={item?.title}>
								{item?.count && (
									<Text
										type='secondary'
										style={{
											color: theme.text,
										}}>{`${item?.title}: ${item?.count}`}</Text>
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
					width: '13rem',
					opacity: 0.1,
					left: '50%',
					top: '30%',
					transform: 'translate(-50%, -50%)',
				}}
			/>
			{/* <span
        style={{
          position: 'absolute',
          fontSize: '2rem',
          opacity: 0.1,
          left: '50%',
          fontWeight: 500,
          color: '#b1b1b1',
          top: '40%',
          transform: 'translate(-50%, -50%)',
        }}>
        TwoTensor
      </span> */}
			<ResponsiveContainer
				width='100%'
				height={160}
				style={{ overflow: 'hidden', position: 'absolute' }}>
				<ComposedChart
					data={graphData}
					margin={{ top: 0, right: 30, left: -20, bottom: 0 }}>
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
					<defs>
						<linearGradient
							id='colorGradientDirect'
							x1='0'
							y1='0'
							x2='0'
							y2='1'>
							<stop
								offset='0%'
								stopColor='#30e8d6'
								stopOpacity={1}
							/>
							<stop
								offset='100%'
								stopColor='#30e8d6'
								stopOpacity={0}
							/>
						</linearGradient>
						<linearGradient
							id='colorGradientIndirect'
							x1='0'
							y1='0'
							x2='0'
							y2='1'>
							<stop
								offset='0%'
								stopColor='#ff7f0e'
								stopOpacity={1}
							/>
							<stop
								offset='100%'
								stopColor='#ff7f0e'
								stopOpacity={0}
							/>
						</linearGradient>
					</defs>
					{hasNonZeroIndirectCount && (
						<Area
							type='monotone'
							stackId='1'
							dataKey='indirectCount'
							stroke='#ff7e0ede'
							dot={false}
							isAnimationActive={false}
							strokeWidth={3}
							fill='url(#colorGradientIndirect)'
						/>
					)}
					{hasNonZeroDirectCount && (
						<Area
							type='monotone'
							stackId='1'
							dataKey='directCount'
							stroke='#30e8d6de'
							dot={false}
							isAnimationActive={false}
							strokeWidth={3}
							fill='url(#colorGradientDirect)'
						/>
					)}
				</ComposedChart>
			</ResponsiveContainer>
		</div>
	);
};

export default TimelineGraph;

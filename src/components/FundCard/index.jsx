/* eslint-disable no-unused-vars */
import React, { PureComponent, useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { Button } from 'antd';
import { useTheme } from 'styled-components';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import TimelineGraph from './TimelineGraph';
import { Statistic } from 'antd';
import Tooltip from '@mui/material/Tooltip';
import { notification } from 'antd';

import { AreaChart, Area, ResponsiveContainer } from 'recharts';

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

export class PlaceholderGraph extends PureComponent {
	static demoUrl = 'https://codesandbox.io/s/tiny-line-chart-r5z0f';

	render() {
		return (
			<div style={{ position: 'relative' }}>
				<h3
					style={{
						position: 'absolute',
						color: 'gainsboro',
						left: '50%',
						bottom: '1.5rem',
						fontSize: this.props.titleSize || '13px',
						transform: 'translate(-50%, -50%)',
						whiteSpace: 'nowrap',
					}}>
					{this.props && this.props.title
						? this.props.title
						: 'Graph is not available'}
				</h3>
				<ResponsiveContainer
					// width={1200}
					height={120}
					style={{
						overflow: 'hidden',
						position: 'absolute',
						minHeight: '140px',
					}}>
					<AreaChart
						width={1000}
						height={100}
						data={dataPerMonth}
						// style={{ opacity: 0.5 }}
						syncId='projects'
						margin={{
							top: 5,
							right: 0,
							left: 0,
							bottom: 10,
						}}>
						<defs>
							<linearGradient
								id='colorGradient'
								x1='0'
								y1='0'
								x2='0'
								y2='1'>
								<stop
									offset='0%'
									stopColor='#ededed'
									stopOpacity={1}
								/>
								<stop
									offset='100%'
									stopColor='#eaeaea'
									stopOpacity={0}
								/>
							</linearGradient>
						</defs>

						<Area
							type='monotone'
							dataKey='projects'
							stroke='#f0f0f0'
							fill='url(#colorGradient)'
							baseValue={-1}
						/>
						{/* <Tooltip /> */}
					</AreaChart>
				</ResponsiveContainer>
			</div>
		);
	}
}

const FundCard = ({ fund, access_token, available }) => {
	const {
		name,
		type,
		totalSignals,
		signalsThisYear,
		industryFocus,
		signals_quarter,
		signals_month,
		total_signals,
		investments_predicted,
		projects_listed = '',
		geographicFocus,
		about,
		uuid,
		headquarters,
		value_predicted,
		socialLinks,
		logo,
	} = fund;

	const goToFundPage = (id, param) => {
		// history.push(`/fund/${id}`);F
		if (!param) {
			window.open(`/fund/${id}`);
			return;
		}
		window.open(`/fund/${id}#${param}`);
	};

	const theme = useTheme();
	const truncateTitle = (title) => {
		if (title.length > 17) {
			return `${title.substring(0, 10)}...`;
		}
		return title;
	};

	const [isFollowed, setIsFollowed] = useState(true);
	const [buttonText, setButtonText] = useState('Followed');

	// Handle click event
	const handleFollowClick = (event) => {
		event.stopPropagation(); // Prevents the event from reaching the Link
		setIsFollowed(!isFollowed);
	};

	// Handle hover events
	const handleMouseEnter = () => {
		if (isFollowed) {
			setButtonText('Unfollow -');
		}
	};
	const handleMouseLeave = () => {
		setButtonText(isFollowed ? 'Followed' : 'Follow +');
	};

	return (
		<StyledCard
			variant=''
			onClick={() => {
				notification.open({
					message: `${name} is not available`,
					description: `Please contact sales to access ${name}`,
					// icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
					duration: 2,
					// You can add an icon, style, or customize it further
				});
			}}>
			<Link
				to={`/fund/${uuid}`}
				style={{
					textDecoration: 'none',
					cursor: available ? 'pointer' : 'forbidden',
					pointerEvents: available ? 'all' : 'none',
					color: theme.text,
					position: 'relative',
				}}
				target='_blank'
				rel='noreferrer'>
				<CardHeader
					className='myHeader'
					// action={
					//   <IconButton aria-label='settings'>
					//     <MoreVertIcon />
					//   </IconButton>
					// }
					avatar={
						<img
							style={{ width: '3rem', borderRadius: '5px' }}
							src={logo}
						/>
					}
					title={
						name?.length > 16 ? (
							<Tooltip
								title={name || 'Name Placeholder'}
								placement='bottom-start'>
								<h3
									style={{
										padding: '0rem',
										margin: '0rem',
										fontSize: '21px',
										color: theme.text,
									}}>
									{truncateTitle(name || 'Name Placeholder')}
								</h3>
							</Tooltip>
						) : (
							<h3
								style={{
									padding: '0rem',
									margin: '0rem',
									fontSize: '21px',
									color: theme.text,
								}}>
								{truncateTitle(name || 'Name Placeholder')}
							</h3>
						)
					}
					subheader={
						<></>
						// <span
						//   style={{ margin: '0rem', padding: '0rem', color: theme.subText }}
						// >
						//   Projects Listed: {projects_listed ? projects_listed : 'TBD'}
						// </span>
					}
					sx={{
						// 'transition': 'all 0.3s ease',
						'cursor': 'pointer',
						'position': 'relative',
						'&:hover': {
							background: 'red',
						},
					}}
				/>
			</Link>
			{/* <StyledButton
        variant='outlined'
        onClick={(e) => handleFollowClick(e)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {buttonText}
      </StyledButton> */}
			<CardContent
				sx={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					gap: '1.5rem',
				}}>
				{/* <Metric sx={{ background: 'red' }}>
            <Typography variant='body2' sx={{ color: theme.subTitle }}>
              Total Signals:
            </Typography>
            <Typography variant='body2' sx={{ color: theme.subTitle }}>
              {total_signals || '--'}f 
            </Typography>
          </Metric> */}
				{/* <Metric sx={{ background: theme.body }}>
            <Typography variant='body2' sx={{ color: theme.subTitle }}>
              Deals Predicted:
            </Typography>
            <Typography variant='body2' sx={{ color: theme.subTitle }}>
              {investments_predicted || '--'}
            </Typography>
          </Metric> */}
				<div>
					<div
						style={{
							borderBottom: '1px solid #0000001f',
							width: '100%',
							height: '1rem',
							paddingBottom: '0.2rem',
							marginBottom: '0.35rem',
						}}>
						<span
							style={{
								fontSize: '0.78rem',
								fontWeight: 'bold',
								marginBottom: '3rem',
							}}>
							PROPRIETARY SIGNALS
						</span>
					</div>
					<div
						style={{
							display: 'flex',
							gap: '1rem',
							width: '100%',
							justifyContent: 'space-between',
						}}>
						{/* <Statistic
              title={
                <span style={{ color: theme.text, fontSize: '14px' }}>
                  VALUE
                </span>
              }
              value={value_predicted ? value_predicted : '-'}
              valueStyle={{
                color: theme.subText,
                fontSize: '17px',
              }}
              // prefix={<ArrowDownOutlined />}
            /> */}
						<Statistic
							title={
								<span style={{ color: theme.text, fontSize: '14px' }}>
									MONTH
								</span>
							}
							value={signals_month || 'TBD'}
							valueStyle={{
								color: theme.subText,
								fontSize: '17px',
							}}
							// prefix={<ArrowDownOutlined />}
						/>
						<Statistic
							title={
								<span style={{ color: theme.text, fontSize: '14px' }}>
									QUARTER
								</span>
							}
							value={signals_quarter || 'TBD'}
							valueStyle={{
								color: theme.subText,
								fontSize: '17px',
							}}
							// prefix={<ArrowDownOutlined />}
						/>
						<Statistic
							title={
								<span style={{ color: theme.text, fontSize: '14px' }}>
									TOTAL
								</span>
							}
							value={total_signals || 'TBD'}
							valueStyle={{
								color: theme.subText,
								fontSize: '17px',
							}}
							// prefix={<ArrowDownOutlined />}
						/>
					</div>
				</div>
				{/* 
        </Typography> */}
			</CardContent>
			{/* <PlaceholderGraph /> */}
			{/* TODO:FINISH */}
			<TimelineGraph
				access_token={access_token}
				uuid={uuid}
				available={available}
			/>
		</StyledCard>
	);
};

const Metric = styled.div`
	display: flex;
	justify-content: space-between;
	margin-bottom: 1rem;
	background: ${({ theme }) => theme.body};
	width: 97%;
	padding: 0.25rem;
	padding-right: 1rem;
	border-radius: 2.5px;
	align-self: center;
	margin: 0.3rem;
`;

const StyledCard = styled(Card)`
	background-color: ${({ theme }) => theme.background};
	position: relative;
	color: ${({ theme }) => theme.text};
	border: none;
	border-radius: 12px;
	height: 19.5rem;
	padding: 0rem;
`;
const StyledButton = styled(Button)`
	background: ${({ theme }) => theme.background};
	position: absolute;
	right: 0rem;
	top: 1rem;
	transform: scale(0.7);
	border-color: ${({ theme }) => theme.borderColor};
	color: ${({ theme }) => theme.text};
	&:hover {
		border-color: #40e0d0 !important;
		color: #40e0d0 !important;
	}
	&:disabled {
		color: ${({ theme }) => theme.borderColor};
		border-color: ${({ theme }) => theme.borderColor};
	}
`;

export default FundCard;

import React, { useState, useEffect, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import { Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as BiIcons from 'react-icons/bi';
import * as BSIcons from 'react-icons/bs';
import * as AiIcons from 'react-icons/ai';
import { BsStars } from 'react-icons/bs';
import SidebarVertical from '../../UI/SidebarVertical';
import SidebarOther from '../../UI/SidebarOther';
import { getFeedData } from '../../features/feed/feedActions';
import { useOutletContext, useLocation } from 'react-router-dom';
import RadioGroup from '@mui/material/RadioGroup';
import Arkadash from '../../assets/logo-black.png';
import ArkadashWhite from '../../assets/logo-white.png';
import FullLogoBlack from '../../assets/final-logo-black.png';
import FullLogoWhite from '../../assets/final-logo-white.png';
import ArkadashPride from '../../assets/twoTensor-pride.svg';
import FormControl from '@mui/material/FormControl';
import AIListsSidebar from './AILists';
import FundPreferences from './FundPreference';
import SidebarFund from '../../UI/SidebarFund';
import TestSubmenu from './TestSubmenu';
import { IconContext } from 'react-icons/lib';
import toast, { Toaster } from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';

const NavIcon = styled(Link)`
	display: flex;
	align-items: center;
	justify-content: ${({ sidebar }) => (sidebar ? '' : 'center')};
	list-style: none;
	width: 100%;
	text-decoration: none;
	font-size: 18px;
	font-weight: bold;
	align-items: center;
	border-radius: 5px;
	&:hover {
		/* cursor: pointer; */
	}
`;

const SidebarLabel = styled.span`
	color: ${({ theme }) => theme.text};
	font-size: 1.2rem;
	position: relative;
	white-space: nowrap;
	font-family: 'Plantagenet Cherokee' !important;
`;

const SidebarNav = styled.nav`
	background-color: ${({ theme }) => theme.background};
	width: ${({ sidebar }) => (sidebar ? '290px' : '80px')};
	height: 100vh;
	max-height: 100%;
	display: flex;
	align-items: center;
	flex-direction: column;
	justify-content: center;
	top: 0;
	left: ${({ sidebar }) => (sidebar ? '0' : '0%')};
	transition: width 0.3s ease;
	z-index: 10;
`;

const SidebarWrap = styled.div`
	width: 90%;
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	height: 100%;
	overflow: auto;
`;

const LogoContainer = styled.div`
	width: 93%;
	display: flex;
	flex-direction: column;
	padding-top: 1rem;
	margin-bottom: 1rem;
	/* overflow: hidden; */
	font-family: 'Plantagenet Cherokee' !important;
`;

const LogoWrapper = styled.div`
	display: flex;
	width: 100%;
	justify-content: ${({ sidebar }) => (sidebar ? '' : 'center')};
`;

const SideBarDataWrapper = styled.div`
	display: flex;
	flex-direction: column;
	margin-top: 1rem;
	overflow: hidden;
`;

const GlobalWrapper = styled.aside`
	background: purple;
	height: 100%;
	width: 100%;
	overflow: hidden;
`;

const StyledLogo = styled.div`
	width: 2rem;
	margin-right: ${({ sidebar }) => (sidebar ? '0.89rem' : '0rem')};
	min-width: 2rem;
	display: flex;
	border-radius: 10px;
	font-family: 'Plantagenet Cherokee' !important ;
	justify-content: ${({ sidebar }) => (sidebar ? '' : 'center')};
	align-items: center;
`;
const StyledLogo2 = styled.div`
	/* width: 5rem; */
	margin-right: ${({ sidebar }) => (sidebar ? '0.89rem' : '0rem')};
	min-width: 2rem;
	display: flex;
	border-radius: 10px;
	font-family: 'Plantagenet Cherokee' !important ;
	justify-content: ${({ sidebar }) => (sidebar ? '' : 'center')};
	align-items: center;
`;

const IdentityWrapper = styled.div`
	width: ${({ sidebar }) => (sidebar ? '100%' : 'auto')};
	display: flex;
	align-items: center;
	gap: 0.6rem;
	background: ${({ theme }) => theme.subBackground};
	padding: ${({ sidebar }) =>
		sidebar ? `0.25rem 0rem 0.25rem 0.75rem` : '0.5rem'};
	border-radius: 5px;
	font-size: 0.95rem;
	margin-bottom: 0.5rem;
	white-space: nowrap;
`;

const IdentityContainer = styled.div`
	width: 80%;
	height: 8rem;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
`;

const StyledCollapse = styled(BSIcons.BsArrowDownLeft)`
	transition: all 0.4s linear;
	&:hover {
		fill: gray;
		transform: scale(1.1);
	}
`;

const Sidebar = ({
	verticals,
	verticalsFilter,
	funds,
	fundsFilter,
	clearFilters,
	verticalFilterOptions,
	selectedValue,
	setSelectedValue,
	showIntro,
}) => {
	const [sidebar, setSidebar] = useState(true);
	const { userInfo, access_token } = useSelector((state) => state.user);
	const dispatch = useDispatch();

	const logoRef = useRef();
	const theme = useTheme();
	const props = useOutletContext();
	const location = useLocation();

	const [isActive, setIsActive] = useState(false);
	const holdTimer = useRef(null);

	const handleMouseDown = () => {
		holdTimer.current = setTimeout(() => {
			setIsActive(true);
			alert('Pridemaxxxing');
			logoRef.src = ArkadashPride;
		}, 5000);
	};

	const handleMouseUp = () => {
		if (holdTimer.current) {
			clearTimeout(holdTimer.current);
		}
	};

	const currentLocation = true;

	useEffect(() => {
		if (
			location.pathname === '/curated-list' ||
			location.pathname === '/active-thesis' ||
			location.pathname === '/data-sources'
		) {
			setSidebar(true);
		} else {
			setSidebar(true);
		}
	}, [location.pathname]);

	const handleChange = (event) => {
		if (selectedValue === event.target.value) {
			setSelectedValue('');
			fundsFilter('');
			return;
		}
		fundsFilter(event.target.value);
		setSelectedValue(event.target.value);
	};
	const { projects, loading, error } = useSelector((state) => state.feedData);
	const historyProjects = useSelector((state) => state.history);
	const notify = () => toast.success('All filters have been reset');
	const controlProps = (item) => ({
		checked: selectedValue === item,
		onClick: handleChange,
		value: item,
		name: 'color-radio-button-demo',
		inputProps: { 'aria-label': item },
	});
	useEffect(() => {
		if (access_token) {
			dispatch(getFeedData());
			return;
		}
	}, [access_token, dispatch]);
	const showSidebar = () => setSidebar(!sidebar);

	function checkLocation() {
		return true;
	}

	return (
		<>
			<IconContext.Provider value={{ color: 'var(--secondary-text)' }}>
				<SidebarNav sidebar={sidebar}>
					<LogoContainer>
						<LogoWrapper sidebar={sidebar}>
							<NavIcon
								to='#'
								onClick={currentLocation && showSidebar}
								sidebar={sidebar}>
								{!sidebar && (
									<StyledLogo
										sidebar={sidebar}
										onMouseDown={handleMouseDown}
										onMouseUp={handleMouseUp}
										onMouseLeave={handleMouseUp}>
										<img
											src={
												isActive
													? ArkadashPride
													: props.isDarkMode === 'light'
													? Arkadash
													: ArkadashWhite
											}
											alt='logo'
											ref={logoRef}
											style={{
												maxWidth: '2.5rem',
												borderRadius: '5.5px',
											}}
										/>
										{/* <AiIcons.AiOutlineAlignLeft style={{ color: theme.text }} /> */}
									</StyledLogo>
								)}
								{sidebar ? (
									<div
										style={{
											display: 'flex',
											flexDirection: 'column',
										}}>
										{/* <SidebarLabel>TwoTensor</SidebarLabel> */}
										<StyledLogo2
											sidebar={sidebar}
											onMouseDown={handleMouseDown}
											onMouseUp={handleMouseUp}
											onMouseLeave={handleMouseUp}>
											<img
												src={
													isActive
														? ArkadashPride
														: props.isDarkMode === 'light'
														? FullLogoBlack
														: FullLogoWhite
												}
												alt='logo'
												ref={logoRef}
												style={{
													width: '100%',
													maxHeight: '2.75rem',
													borderRadius: '5.5px',
													marginLeft: '0.85rem',
												}}
											/>
											{/* <AiIcons.AiOutlineAlignLeft style={{ color: theme.text }} /> */}
										</StyledLogo2>
										{/* <span
											style={{
												marginLeft: '0.85rem',
												fontSize: '10.5px',
												color:
													props.isDarkMode === 'light' ? 'gray' : 'lightgray',
											}}>
											LIVE VENTURE CO-PILOTS
										</span> */}
									</div>
								) : (
									<></>
								)}
							</NavIcon>
						</LogoWrapper>
					</LogoContainer>
					<SidebarWrap>
						<TestSubmenu
							title='Guide'
							Icon={
								<AiIcons.AiOutlineSetting
									style={{
										color: `${
											props.isDarkMode === 'light' ? 'black' : theme.iconColor
										}`,
										transform: 'scale(1.44)',
									}}
								/>
							}
							subnavigation={true}
							sidebar={sidebar}
							onClick={() =>
								location.pathname === '/curated-list' && setSidebar(true)
							}
							isOpen={false}>
							{location.pathname === '/curated-list' && (
								<SidebarOther
									title='Reset filters'
									onClick={() => {
										clearFilters();
										notify();
									}}
									Icon={
										<BiIcons.BiReset
											style={{ width: '2rem', fill: theme.iconColor }}
										/>
									}
								/>
							)}
							<SidebarOther
								title='Show intro'
								onClick={() => {
									showIntro();
								}}
								Icon={
									<BiIcons.BiWindows
										style={{ width: '2rem', fill: theme.iconColor }}
									/>
								}
							/>
						</TestSubmenu>
						{location.pathname === '/curated-list' && (
							<>
								<TestSubmenu
									title='Vertical'
									Icon={
										<BiIcons.BiCategory
											style={{
												color: `${
													props.isDarkMode === 'light'
														? 'black'
														: theme.iconColor
												}`,
												transform: 'scale(1.44)',
											}}
										/>
									}
									subnavigation={true}
									sidebar={sidebar}
									onClick={() =>
										location.pathname === '/curated-list' && setSidebar(true)
									}
									isOpen={false}>
									{verticals.map((vertical) => (
										<SidebarVertical
											key={vertical}
											title={vertical}
											verticalsFilter={verticalsFilter}
											currentFilters={verticalFilterOptions}
										/>
									))}
								</TestSubmenu>
								<TestSubmenu
									title='Investment Fund'
									Icon={
										<AiIcons.AiOutlineBank
											style={{
												color: `${
													props.isDarkMode === 'light'
														? 'black'
														: theme.iconColor
												}`,
												transform: 'scale(1.44)',
											}}
										/>
									}
									subnavigation={true}
									sidebar={sidebar}
									isOpen={true}
									onClick={() =>
										location.pathname === '/curated-list' && setSidebar(true)
									}>
									<FormControl>
										<RadioGroup
											aria-labelledby='demo-radio-buttons-group-label'
											defaultValue='female'
											name='radio-buttons-group'>
											{funds.map((fund) => (
												<SidebarFund
													feedData={projects}
													history={historyProjects.projects}
													title={fund}
													control={() => {
														return controlProps(fund);
													}}
												/>
											))}
										</RadioGroup>
									</FormControl>
								</TestSubmenu>
							</>
						)}
						{location.pathname === '/central-feed123' && (
							<>
								<TestSubmenu
									title='Funds of Interest'
									Icon={
										<BiIcons.BiCategory
											style={{
												color: `${
													props.isDarkMode === 'light'
														? 'black'
														: theme.iconColor
												}`,
												transform: 'scale(1.44)',
											}}
										/>
									}
									subnavigation={true}
									sidebar={sidebar}
									onClick={() =>
										location.pathname === '/central-feed' && setSidebar(true)
									}
									isOpen={false}>
									{/* <FundPreferences /> */}
								</TestSubmenu>
							</>
						)}
						{checkLocation() && (
							<>
								<TestSubmenu
									title={`Your Agents`}
									isOpen={true}
									Icon={
										<BsStars
											style={{
												color: `${
													props.isDarkMode === 'light'
														? 'black'
														: theme.iconColor
												}`,
												transform: 'scale(1.44)',
											}}
										/>
									}
									subnavigation={true}
									sidebar={sidebar}
									onClick={() => checkLocation() && setSidebar(true)}>
									<AIListsSidebar />
									{/* <FundPreferences /> */}
								</TestSubmenu>
							</>
						)}
						{/* <TestSubmenux
                title='Team Terminals'
                icon={AiIcons.AiOutlineTeam}
                subnavigation={true}
                sidebar={sidebar}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <SidebarTeamLink title='Daniel' />
                  <SidebarTeamLink title='Mark' />
                  <SidebarTeamLink title='Anton' />
                </div>
              </TestSubmenux> */}
					</SidebarWrap>
					{sidebar ? (
						<IdentityContainer
							onClick={() =>
								location.pathname === '/curated-list' && showSidebar()
							}>
							<IdentityWrapper
								sidebar={sidebar}
								onClick={() => {}}>
								<div
									style={{
										background: theme.subBackground,
										borderRadius: '5.5px',
										border: 'none',
										padding: '0.15rem 0.3rem 0.15rem 0.3rem',
									}}>
									<BSIcons.BsFillDiagram3Fill
										style={{ color: theme.iconColor }}
									/>
								</div>
								<span>{userInfo?.organization_id}</span>
							</IdentityWrapper>
							<IdentityWrapper sidebar={sidebar}>
								<div
									style={{
										background: theme.subBackground,
										borderRadius: '5.5px',
										border: 'none',
										padding: '0.15rem 0.3rem 0.15rem 0.3rem',
									}}>
									<FaIcons.FaUserAlt style={{ color: theme.iconColor }} />
								</div>
								<span>{userInfo?.username}</span>
							</IdentityWrapper>
						</IdentityContainer>
					) : (
						<IdentityContainer
							onClick={() =>
								location.pathname === '/curated-list' && showSidebar()
							}>
							<IdentityWrapper sidebar={sidebar}>
								<div
									style={{
										background: theme.subBackground,
										borderRadius: '5.5px',
										padding: '0.15rem 0.3rem 0.15rem 0.3rem',
									}}>
									<BSIcons.BsFillDiagram3Fill
										style={{ color: theme.iconColor, transform: 'scale(1.25)' }}
									/>
								</div>
							</IdentityWrapper>
							<IdentityWrapper sidebar={sidebar}>
								<div
									style={{
										background: theme.subBackground,
										borderRadius: '5.5px',
										padding: '0.15rem 0.3rem 0.15rem 0.3rem',
									}}>
									<FaIcons.FaUserAlt
										style={{ color: theme.iconColor, transform: 'scale(1.25)' }}
									/>
								</div>
							</IdentityWrapper>
						</IdentityContainer>
					)}
				</SidebarNav>
				<Toaster position='top-left' />
			</IconContext.Provider>
		</>
	);
};

export default Sidebar;

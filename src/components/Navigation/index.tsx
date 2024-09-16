// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { useTheme } from 'styled-components';
import * as AiIcons from 'react-icons/ai';
import * as TbIcons from 'react-icons/tb';
import { logout } from '../../features/user/userSlice';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useOutletContext } from 'react-router-dom';
import CheckboxButton from '../../UI/CheckboxButton';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import LoginModal from '../LoginModal';
import { IconContext } from 'react-icons/lib';
import Search from './Search';

const NavBar = styled.nav`
	background-color: ${({ theme }) => theme.background};
	/* width: 100%; */
	min-height: 4.4rem;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding-top: 0.2rem;
`;

const UpperNav = styled.div`
	width: 100%;
	height: 60%;
	/* padding-left: 4rem; */
`;

const UpperNavContainer = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-left: 1.1rem;
	@media (max-width: 1440px) {
		justify-content: flex-start;
		padding-left: 0;
		overflow-x: auto;
	}
`;

const LoginWrapper = styled.div`
	display: flex;
	margin-right: 2.4rem;
	gap: 1rem;
	justify-content: flex-end;
`;

const ControlsNav = styled.div`
	width: 100%;
	height: 40%;
	display: flex;
	align-items: center;
`;

const ControlNavContainer = styled.div`
	display: flex;
	gap: 1rem;
`;

const LoginButton = styled.button`
	color: white;
	display: flex;
	position: relative;
	gap: 0.5rem;
	border: none;
	font-size: 13px;
	align-items: center;
	justify-content: center;
	background-color: #101014;
	text-align: center;
	cursor: pointer;
	text-decoration: none;
	/* border: 1px solid ${({ theme }) => theme.buttonBorder}; */
	border-radius: 5px;
	padding: 0.85rem 1rem 0.725rem 1rem;
`;

const Tab = styled.div`
	cursor: pointer;
	color: ${({ theme, active }) => (active ? 'theme.text' : theme.text)};
	position: relative;
	display: flex;
	min-width: 12.1rem;
	height: 100%;
	font-size: 13px;
	justify-content: space-between;
	width: auto;
	position: relative;
	gap: 0.5rem;
	max-width: 20rem;
	align-items: center;
	background-color: ${({ theme, active }) =>
		active ? theme.subButtonColorActive : theme.body};
	text-align: center;
	cursor: pointer;
	text-decoration: none;
	/* border: 1.5px solid ${({ theme, active }) => theme.borderColor}; */
	border-radius: 5px;
	height: 1.4375em;
	padding: 8.5px 14px;
	/* padding: 0.65rem 1rem 0.625rem 1rem; */
`;
const NextProjectButton = styled.div`
	cursor: pointer;
	color: ${({ theme, active }) => (active ? 'white' : theme.text)};
	display: ${({ started }) => (started ? 'flex' : 'none')};
	flex-direction: row;
	position: relative;
	gap: 0.5rem;
	align-items: center;
	text-align: center;
	cursor: pointer;
	text-decoration: none;
	border: 1.5px solid ${({ theme, active }) => theme.borderColor};
	border-radius: 5px;
	height: 1.4375em;
	transition: all 0.5s ease;
	padding: 4.5px 7px;
	&:active {
		background: #ff343497;
	}
	/* padding: 0.65rem 1rem 0.625rem 1rem; */
`;
const StartProjectButton = styled.div`
	cursor: pointer;
	color: ${({ theme, active }) => (active ? 'white' : theme.text)};
	display: ${({ started }) => (!started ? 'flex' : 'none')};
	flex-direction: row;
	position: relative;
	gap: 0.5rem;
	align-items: center;
	text-align: center;
	cursor: pointer;
	text-decoration: none;
	border: 1.5px solid ${({ theme, active }) => theme.borderColor};
	transition: all 0.5s ease;
	border-radius: 5px;
	height: 1.4375em;
	padding: 4.5px 7px;
	&:active {
		background: #ff343497;
	}
	/* padding: 0.65rem 1rem 0.625rem 1rem; */
`;
const PreviousProjectButton = styled.div`
	cursor: pointer;
	color: ${({ theme, active }) => (active ? 'white' : theme.text)};
	display: ${({ started }) => (started ? 'flex' : 'none')};
	position: relative;
	flex-direction: row-reverse;
	gap: 0.5rem;
	align-items: center;
	background-color: ${({ theme, active }) =>
		active ? '#2a4862' : theme.subButtonColor};
	text-align: center;
	cursor: pointer;
	text-decoration: none;
	border: 1.5px solid ${({ theme, active }) => theme.borderColor};
	border-radius: 5px;
	height: 1.4375em;
	padding: 4.5px 7px;
	transition: all 0.5s ease;
	&:active {
		background: #ff343497;
	}
	/* padding: 0.65rem 1rem 0.625rem 1rem; */
`;

const ShortcutIndicator = styled.div`
	cursor: pointer;
	color: ${({ theme, active }) => theme.subText};
	display: flex;
	position: absolute;
	font-size: 0.72rem;
	align-items: center;
	justify-content: center;
	text-align: center;
	right: 1rem;
	/* background-color: ${({ theme, active }) =>
		active ? '#2a4862' : theme.searchBar}; */
	cursor: pointer;
	text-decoration: none;
	border: 0.8px solid ${({ theme, active }) => theme.buttonBorder};
	border-radius: 5px;
	height: 0.8em;
	padding: 5px 5px;
`;

const ShortcutIndicatorTab = styled.div`
	cursor: pointer;
	color: ${({ theme, active }) => theme.subText};
	display: flex;
	right: 1rem;
	font-size: 0.72rem;
	align-items: center;
	justify-content: center;
	text-align: center;
	/* background-color: ${({ theme, active }) =>
		active ? '#2a4862' : theme.searchBar}; */
	cursor: pointer;
	text-decoration: none;
	border: 0.8px solid ${({ theme, active }) => theme.buttonBorder};
	border-radius: 5px;
	height: 0.8em;
	padding: 5px 5px;
`;
const HomeButton = styled.a`
	color: var(--text);
	background-color: none;
	text-decoration: none;
	border-radius: 5px;
	text-align: center;
	border: 1px solid #e7e7eb;
	padding: 0.85rem 1rem 0.725rem 1rem;
`;

const TabsWrapper = styled.div`
	display: flex;
	overflow-x: auto;
	flex-grow: 1;
	flex-direction: row;
	gap: 0.5rem;

	@media (max-width: 1600px) {
		flex-grow: 0;
		width: 50%;
	}

	@media (max-width: 1100px) {
		flex-grow: 0;
		width: 14rem;
		margin-left: ;
	}
`;

const StyledIcon = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.35rem;
`;

interface NavigationInterface {
	historyHandler: (event: Event) => void;
	favouriteHandler: (event: Event) => void;
	goodProjectsHandler: (event: Event) => void;
	unratedProjectsHandler: (event: Event) => void;
	greatProjectsHandler: (event: Event) => void;
	feedHandler: () => void;
	searchHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
	legendMode: string;
	previousButtonRef: any;
	nextButtonRef: any;
	controlsButtonRef: any;
	nodes: any[];
	startButtonRef: any;
	feedType: string;
	FeedTypes: any;
	tabs: Tab[];
	activeTab: string;
	onTabClick: (tabId: string) => void;
	resurfacingHandler: any;
	searchQuery: String;
	loading: boolean;
	started: boolean;
}

const Navigation = ({
	historyHandler,
	searchHandler,
	started,
	favouriteHandler,
	nextButtonRef,
	feedType,
	FeedTypes,
	previousButtonRef,
	startButtonRef,
	nodes,
	loading,
	legendMode,
	searchQuery,
	goodProjectsHandler,
	unratedProjectsHandler,
	greatProjectsHandler,
	resurfacingHandler,
	setShowResurfacing,
	controlsButtonRef,
	feedHandler,
	tabs,
	activeTab,
	onTabClick,
}: NavigationInterface) => {
	// @ts-ignore
	const { userInfo, access_token } = useSelector((state) => state.user);
	// automatically authenticate user if token is found
	const [favorites, setFavorites] = useState(false);
	const dispatch = useDispatch();
	const end = new Date();
	end.setUTCHours(23, 59, 59, 999);
	const theme = useTheme();
	const searchRef = React.useRef<HTMLDivElement>(null);
	const inputRef = React.useRef<HTMLDivElement>(null);
	const shortcutRef = React.useRef<HTMLDivElement>(null);
	const listViewRef = React.useRef<HTMLDivElement>(null);
	const activeThesisRef = React.useRef<HTMLDivElement>(null);
	const nodesViewRef = React.useRef<HTMLDivElement>(null);
	const reportsViewRef = React.useRef<HTMLDivElement>(null);
	const signalsSearchViewRef = React.useRef<HTMLDivElement>(null);
	const portfolioViewRef = React.useRef<HTMLDivElement>(null);
	const marketMapViewRef = React.useRef<HTMLDivElement>(null);
	const tickerViewRef = React.useRef<HTMLDivElement>(null);
	const isBlocked = blockFunctionality();

	function blockFunctionality() {
		const AllowedPages = {
			livePipeline: true,
			connectedVentures: true,
			teamReports: true,
			curatedList: true,
		};

		if (userInfo?.organization_id === 'Novelis') {
			AllowedPages.livePipeline = false;
			AllowedPages.connectedVentures = true;
			return AllowedPages;
		}
		if (userInfo?.organization_id === 'JIMCO') {
			AllowedPages.livePipeline = false;
			AllowedPages.connectedVentures = false;
			AllowedPages.teamReports = false;
			return AllowedPages;
		}
		if (userInfo?.organization_id === 'DEMO') {
			AllowedPages.livePipeline = false;
			AllowedPages.connectedVentures = true;
			AllowedPages.teamReports = false;
			AllowedPages.curatedList = false;
			return AllowedPages;
		}
		return AllowedPages;
	}

	const legend = [
		{
			name: 'Seen Project',
			color: '#287273',
			colorStart: '#dceeee',
			startLabel: '2016',
			finishLabel: '2023',
		},
		{
			name: 'Unseen Project',
			color: '#2e2e2e',
			colorStart: '#d4d4d4',
			startLabel: '2016',
			finishLabel: '2023',
		},
		{
			name: 'Seen Fund',
			color: '#e85e51',
			colorStart: '#2c1311',
			startLabel: '7 Days +',
			finishLabel: 'Recent',
		},
		{
			name: 'Unseen Fund',
			color: 'hsl(297, 70%, 30%, .9)',
			colorStart: '#2f2531',
			startLabel: '7 Days +',
			finishLabel: 'Recent',
		},
	];

	const legendCompetitors = [
		{
			name: 'Competitor',
			color: '#732828',
			colorStart: '#732828',
			startLabel: '2016',
			finishLabel: '2023',
		},
	];

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.shiftKey && event.code === 'Space') {
				event.preventDefault();
				searchRef.current?.querySelector('input')?.focus();
				listViewRef.current.click();
				shortcutRef.current.style.display = 'none';
			}
			if (event.shiftKey && event.code === 'Digit1') {
				event.preventDefault();
				activeThesisRef.current.click();
			}
			// if (event.shiftKey && event.code === 'Digit1') {
			//   event.preventDefault();
			//   listViewRef.current.click();
			// }
			// if (event.shiftKey && event.code === 'Digit4') {
			//   event.preventDefault();
			//   signalsSearchViewRef.current.click();
			// }
			// if (event.shiftKey && event.code === 'Digit2') {
			//   event.preventDefault();
			//   tickerViewRef.current.click();
			// }
			if (event.shiftKey && event.code === 'Digit2') {
				event.preventDefault();
				portfolioViewRef.current.click();
			}
			if (event.shiftKey && event.code === 'Digit4') {
				event.preventDefault();
				reportsViewRef.current.click();
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);
	const checkFavorites = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFavorites(e.target?.checked);
	};
	const [open, setOpen] = React.useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const handleFocus = () => {
		if (inputRef.current) {
			listViewRef.current.click();
			inputRef.current.style.borderColor = 'blue';
			shortcutRef.current.style.display = 'none';
		}
	};

	const handleBlur = () => {
		if (inputRef.current) {
			shortcutRef.current.style.display = 'flex';
			inputRef.current.style.borderColor = 'grey';
		}
	};

	const createRef = (id: string) => {
		if (id === 'curated-list') return listViewRef;
		if (id === 'connected-ventures') return marketMapViewRef;
		if (id === 'reports') return reportsViewRef;
		if (id === 'signals-search') return signalsSearchViewRef;
		if (id === 'data-sources') return portfolioViewRef;
		if (id === 'central-feed') return tickerViewRef;
		if (id === 'active-thesis') return activeThesisRef;
	};

	const createIndicator = (id) => {
		// if (id === 'curated-list') return 'SHIFT 1';
		if (id === 'active-thesis') return 'SHIFT 1';
		if (id === 'curated-network') return 'CTRL F2';
		if (id === 'agent') return 'SHIFT 1';
		// if (id === 'reports') return 'SHIFT 4';
		if (id === 'data-sources') return 'SHIFT 2';
		if (id === 'central-feed') return 'SHIFT 2';
		// if (id === 'signals-search') return 'SHIFT 4';
		if (id === 'connected-ventures') return 'SHIFT 5';
		return 'BETA';
	};
	const props = useOutletContext();
	return (
		<>
			<LoginModal
				open={open}
				handleClose={handleClose}
			/>
			<IconContext.Provider value={{ color: 'black' }}>
				<NavBar>
					<UpperNav>
						<UpperNavContainer>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									width: '100%',
									overflowX: 'auto',
									gap: '1rem',
									position: 'relative',
								}}
								ref={searchRef}>
								<Search
									inputRef={inputRef}
									searchQuery={searchQuery}
									searchHandler={searchHandler}
									theme={theme}
									ShortcutIndicator={ShortcutIndicator}
								/>
								{/* <TextField
                  value={searchQuery}
                  placeholder='Search...'
                  size='small'
                  id='input-with-icon-textfield'
                  inputProps={{ style: { color: theme.text } }}
                  inputRef={inputRef}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  sx={{
                    'height': '2.290rem',
                    '& .MuiInputBase-input::placeholder': {
                      fontSize: '13px',
                    },
                    '& .MuiInputLabel-root': {}, //styles the label
                    '& .MuiOutlinedInput-root': {
                      '& > fieldset': {
                        overflow: 'hidden',
                        border: 'none',
                      },
                    },
                    'width': '15.4rem',
                    'background': theme.searchBar,
                    'borderRadius': '6px',
                    '& .MuiOutlinedInput-root.Mui-focused': {
                      '& > fieldset': {
                        border: `2px solid #3280c5`,
                      },
                    },
                  }}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    searchHandler(e)
                  }
                  variant='outlined'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <SearchRoundedIcon
                          fontSize='small'
                          sx={{ color: theme.text }}
                        />
                        <ShortcutIndicator>SHIFT SPACE</ShortcutIndicator>
                      </InputAdornment>
                    ),
                  }}
                /> */}
								<TabsWrapper>
									{tabs.map((tab) => (
										<Tab
											key={tab.id}
											id={tab.id}
											active={tab.id === activeTab ? 'active' : ''}
											ref={createRef(tab.id)}
											onClick={() =>
												isBlocked[tab.subId] === false
													? () => true
													: onTabClick(tab.id)
											}
											style={{
												filter:
													isBlocked[tab.subId] === false && 'grayscale(1)',
												cursor: isBlocked[tab.subId] === false && 'not-allowed',
												color: isBlocked[tab.subId] === false && 'gray',
											}}>
											<div
												style={{
													display: 'flex',
													justifyContent: 'center',
													alignItems: 'center',
													gap: '0.4rem',
												}}>
												<div
													style={{
														border: `1px solid ${theme.borderColor}`,
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														background: theme.subBackground,
														borderRadius: '5.5px',
														padding: '0.25rem 0.3rem 0.25rem 0.3rem',
													}}>
													{tab.icon}
												</div>
												{/* <img src={tab.logo} alt={tab.title} /> */}
												<span>{tab.title}</span>
											</div>
											<ShortcutIndicatorTab>
												{createIndicator(tab.id)}
											</ShortcutIndicatorTab>
										</Tab>
									))}
								</TabsWrapper>
								<LoginWrapper>
									<LoginButton onClick={props.onDarkMode}>
										<DarkModeSwitch
											moonColor={'white'}
											sunColor={'white'}
											size={14}
											checked={props.isDarkMode === 'light' ? true : false}
										/>
									</LoginButton>
									{/* <HomeButton>Home</HomeButton> */}
									{userInfo ? (
										<LoginButton
											onClick={() => {
												dispatch(logout());
												window.location.reload();
											}}>
											Log out
										</LoginButton>
									) : (
										<LoginButton onClick={handleOpen}>Login</LoginButton>
									)}
								</LoginWrapper>
							</div>
						</UpperNavContainer>
					</UpperNav>
				</NavBar>
			</IconContext.Provider>
		</>
	);
};

export default Navigation;

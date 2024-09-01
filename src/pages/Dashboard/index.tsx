// @ts-nocheck

import React, {
	useCallback,
	useEffect,
	useMemo,
	useState,
	useContext,
} from 'react';
import styled, { useTheme } from 'styled-components';
import { Outlet } from 'react-router-dom';
import * as AiIcons from 'react-icons/ai';
import * as BiIcons from 'react-icons/bi';
import * as PiIcons from 'react-icons/pi';
import { BsStars } from 'react-icons/bs';
import * as TfIcons from 'react-icons/tfi';
import * as MdIcons from 'react-icons/md';
import Snackbar from '@mui/material/Snackbar';
import Sidebar from '../../components/Sidebar';
import { useLocation } from 'react-router-dom';
import Feed from '../../components/Feed';
import { useNavigate } from 'react-router-dom';
import DashboardContext from '../../hooks/DashboardContext';
import Nodes from '../../views/Nodes';
import { useOutletContext } from 'react-router-dom';

import Reports from '../../views/Reports';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Navigation from '../../components/Navigation';
import Guide from '../../components/Guide';
import {
	getFeed,
	getHistoryFeed,
	getFavourites,
	getGreatProjects,
	getHistoryFeedFunds,
	getUnratedProjects,
	getResurfacing,
	getGoodProjects,
	getFeedInitial,
	getUnratedProjectsNumber,
} from '../../features/feed/feedActions';

import styles from './Dashboard.module.css';
import { useSelector, useDispatch } from 'react-redux';
import Popup from '../../components/Popup';
import { current } from '@reduxjs/toolkit';

enum FeedTypes {
	Feed = 'feed',
	Initial = 'initial',
	GreatProjects = 'great projects',
	GoodProjects = 'good projects',
	Resurfacing = 'resurfacing',
	Unrated = 'unrated',
	Favourites = 'favourites',
	ActiveSignals = 'active signals',
	HistoricSignals = 'historic signals',
}

const Dashboard = () => {
	const props = useOutletContext();
	const location = useLocation();

	const setHashParamValue = (typeValue: string) => {
		const hashParams = new URLSearchParams(location.hash.substring(1));
		hashParams.set('type', typeValue); // This will log the new typeValue to the console for debugging purposes
		location.hash = hashParams.toString();
	};

	const [allowedTabs, setAllowedTabs] = useState([]);

	const tabs = [
		// {
		//   id: 'curated-list',
		//   title: 'Curated Signals',
		//   subId: 'curatedList',
		//   icon: (
		//     <TfIcons.TfiViewListAlt
		//       // @ts-ignore
		//       style={{ color: '#0eaeee', transform: 'scale(1)' }}
		//     />
		//   ),
		// },
		{
			id: 'agent',
			subId: 'agent',
			title: 'Agent Dashboard',
			icon: (
				<BsStars
					// @ts-ignore
					style={{ color: '#dcb114', transform: 'scale(1.15)' }}
				/>
			),
		},
		{
			id: 'data-sources',
			subId: 'data-sources',
			title: 'Data Sources',
			icon: (
				<BiIcons.BiCategoryAlt
					// @ts-ignore
					style={{ color: '#09b735', transform: 'scale(1.25)' }}
				/>
			),
		},
		// {
		//   id: 'signals-search',
		//   title: 'Signals Search',
		//   subId: 'signalsSearch',
		//   icon: (
		//     <MdIcons.MdOutlineRssFeed
		//       // @ts-ignore
		//       style={{ color: '#fd697f', transform: 'scale(1.25)' }}#
		//     />
		//   ),
		// },
		// {
		//   id: 'reports',
		//   subId: 'teamReports',
		//   title: 'Team Reports',
		//   icon: (
		//     <AiIcons.AiOutlineAudit
		//       // @ts-ignore
		//       style={{ color: '#8d8d8d', transform: 'scale(1.25)' }}
		//     />
		//   ),
		// },
		// {
		//   id: 'connected-ventures',
		//   subId: 'connectedVentures',
		//   title: 'Connected Ventures',
		//   icon: (
		//     <PiIcons.PiShareNetwork
		//       // @ts-ignore
		//       style={{ color: '#dcb114', transform: 'scale(1.25)' }}
		//     />
		//   ),
		// },
	];

	const completedKey = 'modalCompleted';
	//@ts-ignore
	const { userInfo, access_token } = useSelector((state) => state.user);

	//@ts-ignore
	const { projects, showHistory, unratedProjects, loading, error } =
		useSelector(
			//@ts-ignore
			(state) => state.projects,
		);
	const [feedType, setFeedType] = useState(FeedTypes.Initial);
	const [firstRender, setFirstRender] = useState(false);
	const [verticalFilter, setVerticalFilter] = useState([]);
	const [hasUserInteracted, setHasUserInteracted] = useState(false);
	const [started, setStarted] = useState(false);
	const [open, setOpen] = React.useState(false);
	const [nodes, setNodes] = useState([]);
	const [legend, setLegend] = useState('');
	const [activeTab, setActiveTab] = useState<string>(tabs[0].id);
	const [searchQuery, setSearchQuery] = useState('');
	const [fundFilter, setFundFilter] = useState('');
	const [selectedValue, setSelectedValue] = React.useState('');
	const [modalCompleted, setModalCompleted] = React.useState(
		localStorage.getItem(completedKey) === '5',
	);
	const navigate = useNavigate();

	const getHashParamValue = () => {
		const hashParams = new URLSearchParams(location.hash.substring(1));
		return hashParams.get('type');
	};

	useEffect(() => {
		function getAllowedTabs(tabs = [], allowedTabsIds = []) {
			return tabs.filter((tab) => allowedTabsIds.includes(tab.id));
		}
		setAllowedTabs(getAllowedTabs(tabs, userInfo?.organization?.allowed_pages));
	}, [userInfo]);

	const updateHashParam = (param: string) => {
		const newHash = param === '' ? '' : `#${param}`;
		const newUrl = window.location.href.replace(/#.*$/, '') + newHash;
		return window.history.replaceState(null, '', newUrl);
	};

	const previousButtonRef = React.useRef();
	const nextButtonRef = React.useRef();
	const controlsButtonRef = React.useRef<HTMLDivElement>(null);
	const startButtonRef = React.useRef();
	const showIntro = () => {
		localStorage.setItem(completedKey, 'false');
		setModalCompleted(false);
	};

	useEffect(() => {
		setActiveTab(location.pathname.replace(/^./, ''));
	}, [location.pathname]);

	const greatProjectsHandler = (e: any) => {
		setHasUserInteracted(true);
		if (!loading) {
			setFeedType(FeedTypes.GreatProjects);
		}
	};

	const resurfacingHandler = () => {
		setHasUserInteracted(true);
		if (!loading) {
			setFeedType(FeedTypes.Resurfacing);
		}
	};

	const unratedProjectsHandler = (e: any) => {
		setHasUserInteracted(true);
		if (!loading) {
			setFeedType(FeedTypes.Unrated);
		}
	};

	const goodProjectsHandler = (e: any) => {
		setHasUserInteracted(true);
		if (!loading) {
			setFeedType(FeedTypes.GoodProjects);
		}
	};

	const historyHandler = (e: any) => {
		setHasUserInteracted(true);
		if (!loading) {
			setHasUserInteracted(true);
			setFeedType(FeedTypes.HistoricSignals);
		}
	};

	const feedHandler = () => {
		setHasUserInteracted(true);
		if (!loading) {
			setFeedType(FeedTypes.Initial);
		}
	};

	const favouriteHandler = (e: any) => {
		setHasUserInteracted(true);
		if (!loading) {
			setFeedType(FeedTypes.Favourites);
		}
	};

	const fundFilterHandler = (title: string) => {
		if (!loading) {
			setFeedType(FeedTypes.HistoricSignals);
			setFundFilter(title);
		}
	};

	const clearFilters = () => {
		setHasUserInteracted(true);
		setVerticalFilter([]);
		setFundFilter('');
		setSelectedValue('');
		setSearchQuery('');
		setFeedType(FeedTypes.HistoricSignals);
	};

	const searchHandler = (e: string) => {
		setSearchQuery(e);
	};

	const handleTabClick = (tabId: string) => {
		setActiveTab(tabId);
		navigate(`/${tabId}`);
	};
	const [currentHash, setCurrentHash] = useState(getHashParamValue());

	function setUnrated() {
		if (getHashParamValue() === 'unrated') {
			setCurrentHash('');
			updateHashParam(''); // Update the hash parameter
			setFeedType(FeedTypes.Unrated);
		}
	}
	useEffect(() => {
		setUnrated();
		return;
	}, [activeTab, currentHash]);

	const dispatch = useDispatch();

	const verticalFilterHandler = (event: any, title: string) => {
		setFeedType(FeedTypes.HistoricSignals);
		//@ts-ignore
		setVerticalFilter((prev) => {
			//@ts-ignore
			if (!event.target.checked && prev.includes(title)) {
				return prev.filter(
					(item: String) => item.toLowerCase() !== title.toLowerCase(),
				);
			}
			//@ts-ignore
			if (event.target.checked && !prev.includes(title)) {
				//@ts-ignore
				return [...prev, title];
			}
			return prev;
		});
	};

	const filterOut = useCallback(() => {
		let items = projects.projects;
		if (projects) {
			if (fundFilter.trim() !== '') {
				items = items.filter((item: { project: any; title: string }) => {
					return item.project.funds.some(
						(item: { name: string }) =>
							item.name.toLowerCase() === fundFilter.toLowerCase(),
					);
				});
			}

			if (searchQuery.trim() !== '' && verticalFilter.length === 0) {
				items = items.filter((item: { project: any; title: string }) => {
					return (
						item.project.title
							.toLowerCase()
							.indexOf(searchQuery.toLowerCase()) !== -1
					);
				});
			}

			if (searchQuery.trim() !== '' && verticalFilter.length > 0) {
				items = items
					.filter((item: { project: any; title: string }) => {
						return (
							item.project.title
								.toLowerCase()
								.indexOf(searchQuery.toLowerCase()) !== -1
						);
					})
					.filter((item: { project: any; title: string }) => {
						if (item.project.verticals != null) {
							return item.project.verticals.some(
								//@ts-ignore
								(r: String) => verticalFilter.indexOf(r) >= 0,
							);
						} else {
							return item.project.verticals;
						}
					});
			}

			if (searchQuery.trim() === '' && verticalFilter.length > 0) {
				items = items.filter((item: { project: any; title: string }) => {
					if (item.project.verticals != null) {
						return item.project.verticals.some(
							//@ts-ignore
							(r: String) => verticalFilter.indexOf(r) >= 0,
						);
					} else {
						return item.project.verticals;
					}
				});
			}
		}
		return items;
	}, [fundFilter, projects, searchQuery, verticalFilter]);

	const handleClose = (
		event: React.SyntheticEvent | Event,
		reason?: string,
	) => {
		if (reason === 'clickaway') {
			return;
		}

		setOpen(false);
	};

	const projectsCropped = useMemo(() => filterOut(), [filterOut]);

	const action = (
		<React.Fragment>
			<IconButton
				size='small'
				aria-label='close'
				color='inherit'
				onClick={handleClose}>
				<CloseIcon fontSize='small' />
			</IconButton>
		</React.Fragment>
	);

	const viewComponents: { [key: string]: React.ReactNode } = {
		'curated-list': <Feed />,
		'curated-network': <Nodes />,
		'reports': <Reports />,
	};

	function showUnrated() {
		navigate('curated-list#type=unrated');
	}
	return (
		<>
			<Guide
				modalCompleted={modalCompleted}
				setModalCompleted={setModalCompleted}
				completedKey={completedKey}
			/>
			{unratedProjects > 0 && (
				<Popup
					name={userInfo.username}
					number={unratedProjects}
					callback={showUnrated}
					showButton={activeTab !== 'curated-list'}
				/>
			)}
			<div className={styles.dashboard__container}>
				<Sidebar
					verticals={projects.verticals}
					verticalsFilter={verticalFilterHandler}
					verticalFilterOptions={verticalFilter}
					selectedValue={selectedValue}
					setSelectedValue={setSelectedValue}
					funds={projects.funds}
					fundsFilter={fundFilterHandler}
					clearFilters={clearFilters}
					showIntro={showIntro}
				/>
				<div className={styles.dashboard__wrapper}>
					<Navigation
						previousButtonRef={previousButtonRef}
						nextButtonRef={nextButtonRef}
						searchQuery={searchQuery}
						controlsButtonRef={controlsButtonRef}
						nodes={nodes}
						loading={loading}
						legendMode={legend}
						startButtonRef={startButtonRef}
						historyHandler={historyHandler}
						searchHandler={searchHandler}
						favouriteHandler={favouriteHandler}
						started={started}
						feedType={feedType}
						FeedTypes={FeedTypes}
						goodProjectsHandler={goodProjectsHandler}
						greatProjectsHandler={greatProjectsHandler}
						unratedProjectsHandler={unratedProjectsHandler}
						feedHandler={feedHandler}
						resurfacingHandler={resurfacingHandler}
						tabs={tabs}
						activeTab={activeTab}
						onTabClick={handleTabClick}
					/>
					<DashboardContext.Provider
						value={{
							feedProps: {
								projects: projectsCropped,
								feedType,
								showResurfacing:
									feedType === FeedTypes.Resurfacing ? true : false,
								searchQuery: searchQuery,
								loading: loading,
								error: error,
								open: open,
								setOpen: setOpen,
								handleClose: handleClose,
							},
							nodesProps: {
								nextButtonRef: nextButtonRef,
								nodes,
								setNodes,
								previousButtonRef: previousButtonRef,
								startButtonRef: startButtonRef,
								legendMode: legend,
								setLegendMode: setLegend,
								controlsButtonRef: controlsButtonRef,
								started: started,
								setStarted: setStarted,
								triggerPopUp: setOpen,
							},
							reportsProps: {
								reports: 'test',
							},
						}}>
						<Outlet
							// @ts-ignore
							context={{
								// @ts-ignore
								isDarkMode: props.isDarkMode,
								// @ts-ignore
								onDarkMode: props.onDarkMode,
							}}
						/>
					</DashboardContext.Provider>
				</div>
			</div>
			<Snackbar
				open={open}
				autoHideDuration={6000}
				onClose={handleClose}
				message='Your feedback has been submitted'
				action={action}
			/>
		</>
	);
};

export default Dashboard;

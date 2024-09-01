// ProtectedRoute.js
// @ts-nocheck
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	NavLink,
	Outlet,
	useLocation,
	useNavigate,
	Navigate,
} from 'react-router-dom';
import { getUserDetails } from '../features/user/userActions';
import Box from '@mui/material/Box';
import Login from './Login';
import { LiveFeedDataProvider } from '../hooks/LiveFeedContext';
import { AIListsDataProvider } from '../hooks/AIListsDataProvider';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from '../components/Theme/GlobalStyles';
import { useDarkMode } from '../hooks/useDarkMode';
import { lightTheme, darkTheme } from '../components/Theme/Themes';
import * as AiIcons from 'react-icons/ai';
import LinearProgress from '@mui/material/LinearProgress';
import ErrorPageForbidden from './Error/Forbidden';
import { Typography, Button } from '@mui/material';
import Popup from '../components/Popup';

import { SearchProvider, useSearch } from '../hooks/UrlSearchContext';
import { useSearchProjects } from '../hooks/urlSearch';

const ProtectedRoute = () => {
	//@ts-ignore
	const { userInfo, access_token, loading, error } = useSelector(
		(state) => state.user,
	);
	const [theme, themeToggler, mountedComponent] = useDarkMode();

	const themeMode = theme === 'light' ? lightTheme : darkTheme;
	const location = useLocation();
	const navigate = useNavigate();

	const dispatch = useDispatch();

	useEffect(() => {
		if (access_token) {
			dispatch(getUserDetails());
		}
	}, [access_token, dispatch]);

	if (access_token) {
		if (userInfo?.organization_id === 'JIMCO') {
			if (
				location.pathname === '/live-pipline' ||
				location.pathname === '/reports' ||
				location.pathname === '/connected-ventures'
			) {
				return <ErrorPageForbidden />;
			}
		}
		if (userInfo?.organization_id === 'NOVELIS') {
			if (
				location.pathname === '/live-pipline' ||
				location.pathname === '/reports'
			) {
				return <ErrorPageForbidden />;
			}
		}
		if (userInfo?.organization_id === 'DEMO') {
			if (
				location.pathname === '/live-pipline' ||
				location.pathname === '/reports' ||
				location.pathname === '/curated-list'
			) {
				return <ErrorPageForbidden />;
			}
		}
	}

	if (location.pathname === '/' && userInfo?.organization_id === 'DEMO') {
		return <Navigate to='/connected-ventures' />;
	} else {
		<Navigate to='/data-sources' />;
	}

	if (!access_token) {
		return <Navigate to={'/login'} />;
	}

	// if (!userInfo && !loading) {
	//   return <Login />;
	// }

	if (loading && !error) {
		return (
			<Box sx={{ width: '100%', height: '100vh' }}>
				<LinearProgress />
			</Box>
		);
	}

	// returns child route elements
	return (
		<ThemeProvider theme={themeMode}>
			<GlobalStyles />
			<LiveFeedDataProvider>
				<SearchProvider>
					<AIListsDataProvider>
						<Outlet context={{ isDarkMode: theme, onDarkMode: themeToggler }} />
					</AIListsDataProvider>
				</SearchProvider>
			</LiveFeedDataProvider>
		</ThemeProvider>
	);
};
export default ProtectedRoute;

// @ts-nocheck
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import {
	createBrowserRouter,
	RouterProvider,
	Route,
	Navigate,
} from 'react-router-dom';
import ErrorPage from './pages/Error';
import Dashboard from './pages/Dashboard';
import './global.css';
import { StyledEngineProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from 'react-query';

import { createTheme, ThemeProvider } from '@mui/material';
import { ThemeProvider as ThemeProviderStyled } from 'styled-components';

import { GlobalStyles } from './components/Theme/GlobalStyles';

import { lightTheme, darkTheme } from './components/Theme/Themes';

import './assets/fonts/Alliance-Bold.otf';
import './assets/fonts/Alliance-Light.otf';
import './assets/fonts/Alliance-Regular.otf';
import './assets/fonts/Alliance-SemiBold.otf';
import './assets/fonts/Plantagenet Cherokee.ttf';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import axios from 'axios';
import Login from './pages/Login/Login';
import ProtectedRoute from './pages/ProtectedRoute';
import PublicRoute from './pages/PublicRoute';
import 'moment-timezone';
import moment from 'moment';
import ProjectPage from './pages/ProjectPage';
import GranularSearch from './views/GranularSearch';
import ConnectedVentures from './views/ConnectedVentures';
import ReportPage from './pages/ReportPage';
import Feed from './components/Feed';
import Nodes from './views/Nodes';
import DealLists from './views/DealList';
import FundsMarketplace from './views/FundsMarketplace';
import Reports from './views/Reports';
import LiveFeed from './views/LiveFeed';
import SignalsSearch from './views/SignalsSearch';
import PublicDashboard from './pages/Dashboard/publicDashboard';
import FundPage from './pages/FundPage';
moment.tz.setDefault('Europe/Isle_of_Man');
const apiBaseUrl = process.env.REACT_APP_API_URL; // Retrieve the API URL from the environment variable
// @ts-ignore
axios.defaults.baseURL = 'http://127.0.0.1:8000/';
// axios.defaults.baseURL = 'https://api.alphaterminal.pro/';

// test

// https://api.alphaterminal.pro/

const ClarityAnalytics = () => {
	useEffect(() => {
		// Clarity script integration
		(function (c, l, a, r, i, t, y) {
			c[a] =
				c[a] ||
				function () {
					(c[a].q = c[a].q || []).push(arguments);
				};
			t = l.createElement(r);
			t.async = 1;
			t.src = 'https://www.clarity.ms/tag/' + i;
			y = l.getElementsByTagName(r)[0];
			y.parentNode.insertBefore(t, y);
		})(window, document, 'clarity', 'script', 'l36mg9vlh2');

		// Cleanup function
		return () => {
			// Remove Clarity script when component unmounts
			const clarityScript = document.getElementById('clarity-script');
			if (clarityScript) {
				clarityScript.remove();
			}
		};
	}, []);

	return null; // This component doesn't render anything
};

const isDev = process.env.NODE_ENV === 'development';
const faviconPath = isDev ? '/logo-red.ico' : '/logo-white.ico';
const title = isDev ? 'DEVELOPMENT' : 'TwoTensor';

// npm run build:test - Creates a build using the test API URL
// npm run build:prod - Creates a build using the production API URL
const queryClient = new QueryClient();

// Set favicon
const favicon = document.querySelector("link[rel='icon']")!;
// @ts-ignore
favicon.href = faviconPath;

// Set title
document.title = title;

const theme = createTheme({
	palette: {
		primary: { main: '#222222' },
		secondary: { main: '#b7b7b7' },
	},
});
console.log(
	`%c[2] TwoTensor TERMINAL\n%cVC COMPETITIVE INTELLIGENCE\n\n%cMonitor early investment conversations on socials.\nDeploy your thesis to identify live, curated opportunities 133 days before PitchBook.`,
	'color: #40e0d0; font-weight: bold; font-size: 16px; padding: 2px; font-family: monospace;', // Styles for [2] TwoTensor TERMINAL
	'color: #40e0d0; font-weight: bold; font-size: 14px; padding: 2px;', // Styles for VC COMPETITIVE INTELLIGENCE
	'color: gray; font-size: 12px; padding: 2px;', // Styles for the descriptive text
);

const router = createBrowserRouter([
	{
		path: '/',
		element: <ProtectedRoute />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: '/',
				element: <Dashboard />,
				children: [
					{
						path: '/',
						element: <Navigate to='/data-sources' />, // Redirect users to /nodes when they visit /
					},
					{
						path: '/curated-list',
						element: <Feed />,
					},
					{
						path: '/curated-network',
						element: <Nodes />,
					},
					{
						path: '/agent',
						element: <DealLists />,
					},
					{
						path: '/data-sources',
						element: <FundsMarketplace />,
					},
					{
						path: '/reports',
						element: <Reports />,
					},
					{
						path: '/central-feed',
						element: <LiveFeed />,
					},
					{
						path: '/signals-search',
						element: <SignalsSearch />,
					},
					{
						path: '/connected-ventures',
						element: <GranularSearch />,
					},
					{
						path: '/report/:id',
						element: <ReportPage />,
					},
					{
						path: '/fund/:id',
						element: <FundPage />,
					},
				],
			},
			{
				path: '/terminal/project/:id',
				element: <ProjectPage />,
			},
		],
	},
	{
		path: '/login',
		element: <Login />,
		errorElement: <ErrorPage />,
	},
	{
		path: '/public',
		element: <PublicRoute />,
		children: [
			{
				path: '',
				element: <PublicDashboard />,
				children: [
					{
						path: 'connected-ventures',
						element: <ConnectedVentures />,
						errorElement: <ErrorPage />,
					},
				],
			},
		],
	},
]);

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement,
);
root.render(
	// <React.StrictMode>
	<Provider store={store}>
		<ClarityAnalytics />
		<QueryClientProvider client={queryClient}>
			<StyledEngineProvider injectFirst>
				<ThemeProvider theme={theme}>
					<RouterProvider router={router} />
				</ThemeProvider>
			</StyledEngineProvider>
		</QueryClientProvider>
	</Provider>,
	// </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

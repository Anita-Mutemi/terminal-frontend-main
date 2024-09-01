// ProtectedRoute.js
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, Outlet } from 'react-router-dom';
import { getUserDetails } from '../features/user/userActions';
import Box from '@mui/material/Box';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from '../components/Theme/GlobalStyles';
import { useDarkMode } from '../hooks/useDarkMode';
import { lightTheme, darkTheme } from '../components/Theme/Themes';
import * as AiIcons from 'react-icons/ai';
import LinearProgress from '@mui/material/LinearProgress';
import { Typography, Button } from '@mui/material';

const PublicRoute = () => {
  //@ts-ignore
  // const { userInfo, access_token, loading } = useSelector((state) => state.user);
  const [theme, themeToggler, mountedComponent] = useDarkMode();

  const themeMode = theme === 'light' ? lightTheme : darkTheme;

  // const dispatch = useDispatch();

  // if (loading) {
  //   return (
  //     <Box sx={{ width: '100%', height: '100vh' }}>
  //       <LinearProgress />
  //     </Box>
  //   );
  // }

  // returns child route elements
  return (
    <ThemeProvider theme={themeMode}>
      <GlobalStyles />
      <Outlet context={{ isDarkMode: theme, onDarkMode: themeToggler }} />{' '}
    </ThemeProvider>
  );
};
export default PublicRoute;

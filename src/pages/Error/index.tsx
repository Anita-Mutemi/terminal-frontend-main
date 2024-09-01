// ProtectedRoute.js
import { NavLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import * as BiIcons from 'react-icons/bi';
import { Typography, Button } from '@mui/material';

const ErrorPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '1rem',
        minHeight: '100vh',
      }}
    >
      <BiIcons.BiErrorCircle style={{ fill: '#f34232', width: '5rem', height: '5rem' }} />
      <Typography variant='h1' style={{ color: '#222222' }}>
        404 NOT FOUND
      </Typography>
      <Typography variant='h6'>Something went wrong, try again later</Typography>
      <NavLink to='/' style={{ textDecoration: 'none' }}>
        <Button variant='contained' size='large' sx={{ color: 'white' }}>
          Go back to home page
        </Button>
      </NavLink>
    </Box>
  );
};

export default ErrorPage;

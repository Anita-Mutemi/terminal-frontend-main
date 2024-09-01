// ProtectedRoute.js
import { NavLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import * as BiIcons from 'react-icons/bi';
import { Typography, Button } from '@mui/material';

const ErrorPageForbidden = () => {
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
        Forbidden
      </Typography>
      <Typography variant='h6'>
        Your current plan does not include this functionality
      </Typography>
      <NavLink to='/' style={{ textDecoration: 'none' }}>
        <Button variant='contained' size='large' sx={{ color: 'white' }}>
          Go back to home page
        </Button>
      </NavLink>
    </Box>
  );
};

export default ErrorPageForbidden;

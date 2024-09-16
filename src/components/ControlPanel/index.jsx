import { useState, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import { Button, Menu, MenuItem } from '@mui/material';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import ListItemText from '@mui/material/ListItemText';
import { useSelector } from 'react-redux';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useFetchAndExportFavourites } from '../../hooks/useFetchAndExportFavourites';
import Cloud from '@mui/icons-material/Cloud';

import { useOutletContext } from 'react-router-dom';

const StyledCard = styled.div`
  width: 35rem;
  height: 3.5rem;
  border-radius: 5.5px;
  background-color: ${({ theme }) => theme.background};
  display: flex;
  align-items: center;
  overflow: hidden;
`;

const StyledContainer = styled.div`
  display: flex;
  gap: 2rem;
  padding: 2rem;
  width: 100%;
  position: relative;
`;

const StyledWrapper = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const SvgWrapper = styled.div`
  position: absolute;
  width: 14rem;
  height: 9rem;
  right: 20rem;
  bottom: 2rem;
  transform: scale(0.95) rotate(-45deg);
`;

function IconMenu() {
  const theme = useTheme();
  const { access_token } = useSelector((state) => state.user);

  const { loading, error, exportAsJson } =
    useFetchAndExportFavourites(access_token);

  return (
    <Paper sx={{ width: 180, maxWidth: '100%' }}>
      <MenuList>
        <MenuItem
          onClick={() => {
            if (!loading && !error) {
              exportAsJson(access_token);
            }
          }}
          disabled={loading || error}
        >
          <ListItemIcon
            sx={{
              color: 'gray',
              fill: 'gray',
            }}
          >
            {/* <ContentCut fontSize='small' /> */}
            <svg
              fill={'gray'}
              height='22px'
              width='22px'
              version='1.1'
              id='Capa_1'
              viewBox='0 0 58 58'
            >
              <g>
                <path
                  d='M33.655,45.988c-0.232-0.31-0.497-0.533-0.793-0.67s-0.608-0.205-0.937-0.205c-0.337,0-0.658,0.063-0.964,0.191
		s-0.579,0.344-0.82,0.649s-0.431,0.699-0.567,1.183c-0.137,0.483-0.21,1.075-0.219,1.777c0.009,0.684,0.08,1.267,0.212,1.75
		s0.314,0.877,0.547,1.183s0.497,0.528,0.793,0.67s0.608,0.212,0.937,0.212c0.337,0,0.658-0.066,0.964-0.198s0.579-0.349,0.82-0.649
		s0.431-0.695,0.567-1.183s0.21-1.082,0.219-1.784c-0.009-0.684-0.08-1.265-0.212-1.743S33.888,46.298,33.655,45.988z'
                />
                <path
                  d='M51.5,39V13.978c0-0.766-0.092-1.333-0.55-1.792L39.313,0.55C38.964,0.201,38.48,0,37.985,0H8.963
		C7.777,0,6.5,0.916,6.5,2.926V39H51.5z M29.5,33c0,0.552-0.447,1-1,1s-1-0.448-1-1v-3c0-0.552,0.447-1,1-1s1,0.448,1,1V33z
		 M37.5,3.391c0-0.458,0.553-0.687,0.877-0.363l10.095,10.095C48.796,13.447,48.567,14,48.109,14H37.5V3.391z M36.5,24v-4
		c0-0.551-0.448-1-1-1c-0.553,0-1-0.448-1-1s0.447-1,1-1c1.654,0,3,1.346,3,3v4c0,1.103,0.897,2,2,2c0.553,0,1,0.448,1,1
		s-0.447,1-1,1c-1.103,0-2,0.897-2,2v4c0,1.654-1.346,3-3,3c-0.553,0-1-0.448-1-1s0.447-1,1-1c0.552,0,1-0.449,1-1v-4
		c0-1.2,0.542-2.266,1.382-3C37.042,26.266,36.5,25.2,36.5,24z M28.5,22c0.828,0,1.5,0.672,1.5,1.5S29.328,25,28.5,25
		c-0.828,0-1.5-0.672-1.5-1.5S27.672,22,28.5,22z M16.5,26c1.103,0,2-0.897,2-2v-4c0-1.654,1.346-3,3-3c0.553,0,1,0.448,1,1
		s-0.447,1-1,1c-0.552,0-1,0.449-1,1v4c0,1.2-0.542,2.266-1.382,3c0.84,0.734,1.382,1.8,1.382,3v4c0,0.551,0.448,1,1,1
		c0.553,0,1,0.448,1,1s-0.447,1-1,1c-1.654,0-3-1.346-3-3v-4c0-1.103-0.897-2-2-2c-0.553,0-1-0.448-1-1S15.947,26,16.5,26z'
                />
                <path
                  d='M6.5,41v15c0,1.009,1.22,2,2.463,2h40.074c1.243,0,2.463-0.991,2.463-2V41H6.5z M18.021,51.566
		c0,0.474-0.087,0.873-0.26,1.196s-0.405,0.583-0.697,0.779s-0.627,0.333-1.005,0.41c-0.378,0.077-0.768,0.116-1.169,0.116
		c-0.2,0-0.436-0.021-0.704-0.062s-0.547-0.104-0.834-0.191s-0.563-0.185-0.827-0.294s-0.487-0.232-0.67-0.369l0.697-1.107
		c0.091,0.063,0.221,0.13,0.39,0.198s0.354,0.132,0.554,0.191s0.41,0.111,0.629,0.157s0.424,0.068,0.615,0.068
		c0.483,0,0.868-0.094,1.155-0.28s0.439-0.504,0.458-0.95v-7.711h1.668V51.566z M25.958,52.298c-0.15,0.342-0.362,0.643-0.636,0.902
		s-0.61,0.467-1.012,0.622s-0.856,0.232-1.367,0.232c-0.219,0-0.444-0.012-0.677-0.034s-0.467-0.062-0.704-0.116
		c-0.237-0.055-0.463-0.13-0.677-0.226s-0.398-0.212-0.554-0.349l0.287-1.176c0.128,0.073,0.289,0.144,0.485,0.212
		s0.398,0.132,0.608,0.191s0.419,0.107,0.629,0.144s0.405,0.055,0.588,0.055c0.556,0,0.982-0.13,1.278-0.39s0.444-0.645,0.444-1.155
		c0-0.31-0.104-0.574-0.314-0.793s-0.472-0.417-0.786-0.595s-0.654-0.355-1.019-0.533s-0.706-0.388-1.025-0.629
		s-0.583-0.526-0.793-0.854s-0.314-0.738-0.314-1.23c0-0.446,0.082-0.843,0.246-1.189s0.385-0.641,0.663-0.882
		s0.602-0.426,0.971-0.554s0.759-0.191,1.169-0.191c0.419,0,0.843,0.039,1.271,0.116s0.774,0.203,1.039,0.376
		c-0.055,0.118-0.118,0.248-0.191,0.39s-0.142,0.273-0.205,0.396s-0.118,0.226-0.164,0.308s-0.073,0.128-0.082,0.137
		c-0.055-0.027-0.116-0.063-0.185-0.109s-0.166-0.091-0.294-0.137s-0.296-0.077-0.506-0.096s-0.479-0.014-0.807,0.014
		c-0.183,0.019-0.355,0.07-0.52,0.157s-0.31,0.193-0.438,0.321s-0.228,0.271-0.301,0.431s-0.109,0.313-0.109,0.458
		c0,0.364,0.104,0.658,0.314,0.882s0.47,0.419,0.779,0.588s0.647,0.333,1.012,0.492s0.704,0.354,1.019,0.581
		s0.576,0.513,0.786,0.854s0.314,0.781,0.314,1.319C26.184,51.603,26.108,51.956,25.958,52.298z M35.761,51.156
		c-0.214,0.647-0.511,1.185-0.889,1.613s-0.82,0.752-1.326,0.971s-1.06,0.328-1.661,0.328s-1.155-0.109-1.661-0.328
		s-0.948-0.542-1.326-0.971s-0.675-0.966-0.889-1.613s-0.321-1.395-0.321-2.242s0.107-1.593,0.321-2.235s0.511-1.178,0.889-1.606
		s0.82-0.754,1.326-0.978s1.06-0.335,1.661-0.335s1.155,0.111,1.661,0.335s0.948,0.549,1.326,0.978s0.675,0.964,0.889,1.606
		s0.321,1.388,0.321,2.235S35.975,50.509,35.761,51.156z M45.68,54h-1.668l-3.951-6.945V54h-1.668V43.924h1.668l3.951,6.945v-6.945
		h1.668V54z'
                />
              </g>
            </svg>
          </ListItemIcon>
          <ListItemText sx={{ fontSize: '0.65rem' }}>Export JSON</ListItemText>
          {/* <ListItemText sx={{ fontSize: '0.8rem' }}>Export JSON</ListItemText> */}
          {/* <Typography variant='body2' color='text.secondary'>
            ⌘X
          </Typography> */}
        </MenuItem>
        <MenuItem disabled>
          <ListItemIcon
            sx={{
              color: 'gray',
              fill: 'gray',
            }}
          >
            <svg
              version='1.1'
              id='Capa_1'
              height='22px'
              width='22px'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 58 58'
            >
              <g>
                <rect x='14.5' y='19' width='8' height='2' />
                <rect x='14.5' y='27' width='8' height='2' />
                <rect x='14.5' y='23' width='8' height='2' />
                <rect x='14.5' y='15' width='8' height='2' />
                <rect x='24.5' y='19' width='19' height='2' />
                <rect x='24.5' y='27' width='19' height='2' />
                <rect x='24.5' y='23' width='19' height='2' />
                <rect x='14.5' y='31' width='8' height='2' />
                <path
                  d='M51.5,39V13.978c0-0.766-0.092-1.333-0.55-1.792L39.313,0.55C38.964,0.201,38.48,0,37.985,0H8.963
		C7.777,0,6.5,0.916,6.5,2.926V39H51.5z M37.5,3.391c0-0.458,0.553-0.687,0.877-0.363l10.095,10.095
		C48.796,13.447,48.567,14,48.109,14H37.5V3.391z M12.5,31v-2v-2v-2v-2v-2v-2v-2v-4h12v4h21v4v2v2v2v2v2v4h-21h-2h-10V31z'
                />
                <path
                  d='M6.5,41v15c0,1.009,1.22,2,2.463,2h40.074c1.243,0,2.463-0.991,2.463-2V41H6.5z M17.46,50.664
		c0.132,0.483,0.314,0.877,0.547,1.183s0.497,0.528,0.793,0.67c0.296,0.142,0.608,0.212,0.937,0.212s0.636-0.06,0.923-0.178
		s0.549-0.31,0.786-0.574l1.135,0.998c-0.374,0.364-0.798,0.638-1.271,0.82c-0.474,0.183-0.984,0.273-1.531,0.273
		c-0.602,0-1.155-0.109-1.661-0.328s-0.948-0.542-1.326-0.971c-0.378-0.429-0.675-0.966-0.889-1.613
		c-0.214-0.647-0.321-1.395-0.321-2.242s0.107-1.593,0.321-2.235c0.214-0.643,0.51-1.178,0.889-1.606
		c0.378-0.429,0.822-0.754,1.333-0.978c0.51-0.224,1.062-0.335,1.654-0.335c0.547,0,1.057,0.091,1.531,0.273
		c0.474,0.183,0.897,0.456,1.271,0.82l-1.135,1.012c-0.228-0.265-0.481-0.456-0.759-0.574c-0.278-0.118-0.567-0.178-0.868-0.178
		c-0.337,0-0.659,0.063-0.964,0.191c-0.306,0.128-0.579,0.344-0.82,0.649c-0.242,0.306-0.431,0.699-0.567,1.183
		s-0.21,1.075-0.219,1.777C17.257,49.598,17.328,50.181,17.46,50.664z M30.407,52.298c-0.15,0.342-0.362,0.643-0.636,0.902
		s-0.611,0.467-1.012,0.622c-0.401,0.155-0.857,0.232-1.367,0.232c-0.219,0-0.444-0.012-0.677-0.034s-0.467-0.062-0.704-0.116
		c-0.237-0.055-0.463-0.13-0.677-0.226c-0.214-0.096-0.399-0.212-0.554-0.349l0.287-1.176c0.127,0.073,0.289,0.144,0.485,0.212
		c0.196,0.068,0.398,0.132,0.608,0.191c0.209,0.06,0.419,0.107,0.629,0.144c0.209,0.036,0.405,0.055,0.588,0.055
		c0.556,0,0.982-0.13,1.278-0.39c0.296-0.26,0.444-0.645,0.444-1.155c0-0.31-0.105-0.574-0.314-0.793
		c-0.21-0.219-0.472-0.417-0.786-0.595s-0.654-0.355-1.019-0.533c-0.365-0.178-0.707-0.388-1.025-0.629
		c-0.319-0.241-0.583-0.526-0.793-0.854c-0.21-0.328-0.314-0.738-0.314-1.23c0-0.446,0.082-0.843,0.246-1.189
		s0.385-0.641,0.663-0.882c0.278-0.241,0.602-0.426,0.971-0.554s0.759-0.191,1.169-0.191c0.419,0,0.843,0.039,1.271,0.116
		c0.428,0.077,0.774,0.203,1.039,0.376c-0.055,0.118-0.119,0.248-0.191,0.39c-0.073,0.142-0.142,0.273-0.205,0.396
		c-0.064,0.123-0.119,0.226-0.164,0.308c-0.046,0.082-0.073,0.128-0.082,0.137c-0.055-0.027-0.116-0.063-0.185-0.109
		s-0.167-0.091-0.294-0.137c-0.128-0.046-0.296-0.077-0.506-0.096c-0.21-0.019-0.479-0.014-0.807,0.014
		c-0.183,0.019-0.355,0.07-0.52,0.157s-0.31,0.193-0.438,0.321c-0.128,0.128-0.228,0.271-0.301,0.431
		c-0.073,0.159-0.109,0.313-0.109,0.458c0,0.364,0.104,0.658,0.314,0.882c0.209,0.224,0.469,0.419,0.779,0.588
		c0.31,0.169,0.647,0.333,1.012,0.492c0.364,0.159,0.704,0.354,1.019,0.581s0.576,0.513,0.786,0.854
		c0.209,0.342,0.314,0.781,0.314,1.319C30.633,51.603,30.558,51.956,30.407,52.298z M37.168,54.055h-2.133l-3.131-10.131h1.873
		l2.338,8.695l2.475-8.695h1.859L37.168,54.055z'
                />
                <rect x='24.5' y='31' width='19' height='2' />
              </g>
            </svg>
          </ListItemIcon>
          <ListItemText sx={{ fontSize: '0.65rem' }}>Export CSV</ListItemText>
          {/* <Typography variant='body2' color='text.secondary'>
            ⌘C
          </Typography> */}
        </MenuItem>
        <Divider />
        <MenuItem disabled>
          <ListItemIcon>
            <Cloud fontSize='small' />
          </ListItemIcon>
          <ListItemText sx={{ fontSize: '0.65rem' }}>
            Export SQL light
          </ListItemText>
        </MenuItem>
      </MenuList>
    </Paper>
  );
}

const ControlPanel = () => {
  // Using the props directly in the component
  const end = new Date();
  end.setUTCHours(23, 59, 59, 999);
  const props = useOutletContext();
  const theme = useTheme();
  const buttonRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuOpen = () => {
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  const handleExportJson = () => {
    // Implement JSON export logic
  };

  const handleExportCsv = () => {
    // Implement CSV export logic
  };

  return (
    <div>
      <Button
        ref={buttonRef}
        variant='outlined'
        size='small'
        color='inherit'
        onClick={handleMenuOpen}
        onMouseOver={handleMenuOpen}
        sx={{
          'borderColor': 'transparent',
          'background': theme.background,
          'width': '8rem',
          'minWidth': 32,
          'height': 32,
          'borderRadius': '5px',
          '& .MuiButton-startIcon': { margin: 0 },
          'cursor': 'pointer',
        }}
      >
        EXPORT DATA
      </Button>
      <Menu
        anchorEl={buttonRef.current}
        open={menuOpen}
        onClose={handleMenuClose}
        MenuListProps={{
          onMouseLeave: handleMenuClose,
        }}
        sx={{ transform: 'scale(0.99)' }}
      >
        <IconMenu />
      </Menu>
    </div>
  );
};

export default ControlPanel;

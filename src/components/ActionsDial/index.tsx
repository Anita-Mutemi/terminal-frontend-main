/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FolderIcon from '@mui/icons-material/Folder';
import Snackbar from '@mui/material/Snackbar';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import ArchiveIcon from '@mui/icons-material/Archive';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Papa from 'papaparse';
import Logo from '../../assets/logo-white.png';

export default function ActionsDial() {
  const actions = [
    {
      icon: <FiberNewIcon />,
      name: 'Download new projects',
      onclick: () => getFeed('new'),
    },
    {
      icon: <ArchiveIcon />,
      name: 'Download all projects',
      onclick: () => getFeed('all'),
    },
  ];

  const [status, setStatus] = useState('');

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setStatus('');
  };

  const action = (
    <React.Fragment>
      <IconButton
        size='small'
        aria-label='close'
        color='inherit'
        onClick={handleClose}
      >
        <CloseIcon fontSize='small' />
      </IconButton>
    </React.Fragment>
  );

  const { loading, access_token } = useSelector((state: any) => state.user);
  async function getFeed(type: string) {
    if (access_token) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        };
        const { data } = await axios.get(
          `/v1/feed${type === 'all' ? '/history' : ''}`,
          config,
        );
        if (data.projects.length > 0) {
          const converted = data.projects.map(
            (item: {
              project_user_info: any;
              comments: any;
              project: {
                title: any;
                website: any;
                verticals: any[];
                about: any;
              };
            }) => {
              return {
                startup_name: item.project.title,
                website: item.project.website,
                tech: item.project.verticals.join(', '),
                description: item.project.about,
                ...item.comments.reduce((obj: any, item: any) => {
                  obj[`feedback by ${item.user}`] = item.feedback;
                  return obj;
                }, {}),
                ...item.comments.reduce((obj: any, item: any) => {
                  obj[item.user] = item.rating;
                  return obj;
                }, {}),
              };
            },
          );
          const csv = Papa.unparse(converted);
          const file = new Blob([csv], { type: 'text/csv' });
          const link = document.createElement('a');
          link.download = `${
            type === 'all'
              ? 'looking-glass-projects.csv'
              : 'looking-glass-new-projects.csv'
          }`;
          link.href = URL.createObjectURL(file);
          link.click();
          setStatus('success');
          return data;
        } else {
          setStatus('fail');
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <>
      <Box
        sx={{
          height: 0,
          transform: 'translateZ(10px)',
          background: 'red',
          flexGrow: 1,
          position: 'absolute',
          right: '3rem',
          bottom: '0.5rem',
          // background: 'none',
        }}
      >
        <SpeedDial
          ariaLabel='SpeedDial basic example'
          sx={{
            'position': 'absolute',
            'bottom': 32,
            'background': 'none',
            'right': 1,
            'borderRadius': '0px !important',
            '& .MuiSpeedDial-root': {
              borderRadius: '0',
              backgroud: 'none',
            },
            '& .MuiSpeedDial-fab': {
              borderRadius: '5.5px',
              backgroud: 'none',
            },
          }}
          icon={<img src={Logo} style={{ width: '3.5rem' }} alt='logo' />}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              sx={{
                borderRadius: '5.5px',
                backgroud: 'none',
              }}
              tooltipTitle={action.name}
              onClick={action.onclick}
            />
          ))}
        </SpeedDial>
      </Box>
      <Snackbar
        open={status !== '' ? true : false}
        autoHideDuration={4000}
        onClose={handleClose}
        message={
          status === 'success'
            ? 'The download has started...'
            : 'There are no projects available'
        }
        action={action}
      />
    </>
  );
}

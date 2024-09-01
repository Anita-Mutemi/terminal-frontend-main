import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Button, TextField } from '@mui/material';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  flexDirection: 'column',
  width: 400,
  gap: '1rem',
  borderRadius: '15px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

interface ModalInterface {
  open: boolean;
  handleClose: () => void;
}

export default function LoginModal({ open, handleClose }: ModalInterface) {
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
        sx={{ background: '#00cf9f42' }}
      >
        <Box sx={style}>
          <Typography id='modal-modal-title' variant='h6' component='h2'>
            Login to your terminal
          </Typography>
          <TextField
            required
            id='outlined-required'
            label='Email'
            defaultValue='example@gmail.com'
          />
          <TextField required id='outlined-required' label='Password' type='password' />
          <Button variant='contained' sx={{ color: 'white' }}>
            Enter the terminal
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

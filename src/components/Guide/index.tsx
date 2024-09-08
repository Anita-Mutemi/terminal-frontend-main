/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import styled, { useTheme } from 'styled-components';
import Modal from '@mui/material/Modal';

import page_0 from './page_0';
import page_1 from './page_1';
import page_2 from './page_2';
import page_3 from './page_3';
import page_4 from './page_4';
import page_5 from './page_5';

interface GuideInterface {
  setModalCompleted: any;
  modalCompleted: boolean;
  completedKey: string;
}

const Guide = ({
  setModalCompleted,
  modalCompleted,
  completedKey,
}: GuideInterface) => {
  const slides = [page_0, page_1];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [open, setOpen] = React.useState(true);

  const theme = useTheme();

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    display: 'flex',
    gap: '1rem',
    flexDirection: 'column',
    justifyContent: 'space-between',
    left: '50%',
    width: 480,
    height: 700,
    maxHeight: 450,
    transform: 'translate(-50%, -50%)',
    overflow: 'hidden',
    bgcolor: theme.background,
    boxShadow: 24,
    borderRadius: 3,
    padding: '2rem',
  };

  const handleClose = () => setOpen(false);
  const handleNext = () => {
    // Increment the current index and re-render the modal
    setCurrentIndex(currentIndex + 1);
  };

  const handleBack = () => {
    // Decrement the current index and re-render the modal
    setCurrentIndex(currentIndex - 1);
  };
  const handleComplete = () => {
    // Set the modalCompleted state to true to hide the modal
    setModalCompleted(1);
    setCurrentIndex(0);
    localStorage.setItem(completedKey, '5');
  };
  return (
    <div>
      <Modal
        open={!modalCompleted}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          {slides[currentIndex]()}
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: currentIndex > 0 ? 'space-between' : 'flex-end',
            }}
          >
            {/* Only show the "back" button if there's a previous component */}
            {currentIndex > 0 && (
              <Button
                variant='outlined'
                onClick={handleBack}
                sx={{
                  color: theme.borderColor,
                  borderColor: theme.borderColor,
                }}
              >
                Back
              </Button>
            )}
            {/* Only show the "next" button if there's a next component */}
            {currentIndex < slides.length - 1 && (
              <Button variant='contained' onClick={handleNext}>
                Next
              </Button>
            )}
            {currentIndex === slides.length - 1 && (
              <Button
                variant='contained'
                sx={{ background: '#40e0d0' }}
                onClick={() => handleComplete()}
              >
                Complete
              </Button>
            )}
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default Guide;

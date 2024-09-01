// @ts-nocheck
import React, { memo, useState } from 'react';
import Box from '@mui/material/Box';
import styled, { useTheme } from 'styled-components';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import * as MdIcons from 'react-icons/md';

const StyledBoxHeader = styled.div`
  background-color: ${({ theme }) => theme.background};
  color: #000000;
  width: 100%;
  height: 4rem;
  min-height: 4rem;
  padding: 1rem;
  padding-left: 1.5rem;
  border-radius: 1rem 1rem 0rem 0rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`;

function FeedBack({ show, handleClose, title, postFeedback, text }: any) {
  // const handleClose = () => setOpen(false);
  const [value, setValue] = useState(text);
  const [error, setError] = useState(false);
  const theme = useTheme();
  const handleChange = (event: {
    target: { value: any[] | React.SetStateAction<string> };
  }) => {
    // @ts-ignore
    setValue(event.target.value);
    setError(event.target.value.length < 20);
  };

  const clickHandler = () => {
    postFeedback(value);
  };

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    display: 'flex',
    gap: '1rem',
    flexDirection: 'column',
    left: '50%',
    justifyContent: 'center',
    width: 640,
    height: 500,
    zIndex: 9999999,
    maxHeight: 360,
    transform: 'translate(-50%, -50%)',
    overflow: 'hidden',
    bgcolor: theme.background,
    border: `1.3px solid ${theme.borderColor}`,
    boxShadow: 24,
    borderRadius: 2,
  };

  return (
    <div>
      <Modal
        open={show}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <StyledBoxHeader>
            <MdIcons.MdFeedback
              style={{
                width: '3.1rem',
                height: '3.1rem',
                marginRight: '0.75rem',
                fill: theme.iconColor,
              }}
            />
            <Typography
              id='modal-modal-title'
              variant='h6'
              component='h2'
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                color: theme.text,
                gap: '0.5rem',
                alignItems: 'center',
                fontSize: '1.25rem',
              }}
            >
              <p>
                Please, enter your feedback about
                <span
                  style={{
                    color: 'white',
                    backgroundColor: 'black',
                    borderRadius: '5px',
                    padding: '0.15rem',
                    marginLeft: '0.5rem',
                  }}
                >
                  {title}
                </span>
              </p>
            </Typography>
          </StyledBoxHeader>
          <Box
            sx={{
              padding: '0rem 1rem 1rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              position: 'relative',
            }}
          >
            <TextField
              label={`Enter your feedback here`}
              defaultValue={value ?? ''}
              inputProps={{
                style: { color: theme.text },
              }}
              // value={value}
              multiline
              rows={6}
              sx={{
                'width': '100%',
                'borderColor': theme.borderColor,
                '& label.Mui-focused': {
                  color: 'white',
                },
                '& label': {
                  color: 'white',
                },
                '& .MuiInput-underline:after': {
                  borderBottomColor: theme.borderColor,
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: theme.borderColor,
                  },
                  '&:hover fieldset': {
                    borderColor: theme.borderColor,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.borderColor,
                  },
                },
              }}
              onChange={handleChange}
            />
            <Box
              style={{
                width: '100%',
                display: 'flex',
                gap: '0.8rem',
                justifyContent: 'flex-end',
              }}
            >
              <Button
                variant='contained'
                sx={{ backgroundColor: 'gray' }}
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button variant='contained' onClick={clickHandler}>
                Send
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
export default memo(FeedBack);

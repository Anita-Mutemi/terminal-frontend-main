import * as React from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import styled, { useTheme } from 'styled-components';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Oval } from 'react-loader-spinner';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useData } from '../../hooks/LiveFeedContext';

const VerticalWrapper = styled.div`
  width: 100%;
  height: auto;
  border-radius: 5px;
  padding-left: 0.2rem;
  transition: all 0.2s linear;
  &:hover {
    background: ${({ theme }) => theme.subBackground};
    cursor: pointer;
  }
`;

const StyledFormControlLabel = styled(FormControlLabel)`
  max-height: 15rem;
  height: auto;
`;

export default function FundPreference() {
  const theme = useTheme();
  const [checkedFunds, setCheckedFunds] = React.useState({});
  const [data, setData] = React.useState([]);
  const { userInfo, access_token } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showConfirmButton, setShowConfirmButton] = React.useState(false);
  const [filteredFunds, setFilteredFunds] = React.useState([]);
  const [initialChecks, setInitialChecks] = React.useState({});
  const [loadingFunds, setLoadingFunds] = React.useState({});
  const {
    selectedFunds,
    addSelectedFund,
    removeSelectedFund,
    triggerLiveFeedUpdate,
  } = useData();

  const addFundToPreferences = async (fundUuid) => {
    try {
      setLoadingFunds((prevState) => ({
        ...prevState,
        [fundUuid]: true,
      }));

      await axios.post(
        `/v1/user/pipeline/funds/add?fund_uuid=${fundUuid}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );
      toast.success('Fund added to preferences');
    } catch (error) {
      console.error('Error adding fund to preferences:', error);
      toast.error('Failed to add fund to preferences');
    } finally {
      setLoadingFunds((prevState) => ({
        ...prevState,
        [fundUuid]: false,
      }));
    }
  };

  const removeFundFromPreferences = async (fundUuid) => {
    try {
      setLoadingFunds((prevState) => ({
        ...prevState,
        [fundUuid]: true,
      }));

      await axios.post(
        `/v1/user/pipeline/funds/remove?fund_uuid=${fundUuid}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );
      toast.success('Fund removed from preferences');
    } catch (error) {
      console.error('Error removing fund from preferences:', error);
      toast.error('Failed to remove fund from preferences');
    } finally {
      setLoadingFunds((prevState) => ({
        ...prevState,
        [fundUuid]: false,
      }));
    }
  };

  const sortFundsByChecked = (funds) => {
    const checked = [];
    const unchecked = [];

    funds.forEach((fund) => {
      if (fund.name.trim() !== '') {
        if (checkedFunds[fund.uuid]) {
          checked.push(fund);
        } else {
          unchecked.push(fund);
        }
      }
    });

    return [...checked, ...unchecked];
  };

  const fetchData = async () => {
    const config = {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
    };

    setIsLoading(true);

    try {
      const response = await axios.get(`/v1/user/funds`, config);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }

    setIsLoading(false);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  React.useEffect(() => {
    if (userInfo && userInfo.pipeline_funds) {
      const userFunds = userInfo.pipeline_funds.map((fund) => fund.uuid);
      const initialChecksState = {};
      data.forEach((fund) => {
        initialChecksState[fund.uuid] = userFunds.includes(fund.uuid);
      });
      setInitialChecks(initialChecksState);
      setCheckedFunds(initialChecksState);
    }
  }, [userInfo, data]);

  React.useEffect(() => {
    setFilteredFunds(
      data.filter((fund) =>
        fund.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  }, [searchTerm, data]);

  const handleFundChange = async (event, fundUuid) => {
    const isChecked = event.target.checked;
    setCheckedFunds((prevState) => ({
      ...prevState,
      [fundUuid]: isChecked,
    }));

    if (isChecked) {
      await addFundToPreferences(fundUuid);
      addSelectedFund(fundUuid); // Add selected fund to the context
    } else {
      await removeFundFromPreferences(fundUuid);
      removeSelectedFund(fundUuid); // Remove selected fund from the context
    }

    setShowConfirmButton(true);
  };

  const handleConfirmSelection = () => {
    toast.success('Your preferences have been confirmed');
    setShowConfirmButton(false);
    triggerLiveFeedUpdate(); // Trigger live feed update
  };

  return (
    <Box>
      <Toaster position='top-left' />
      <StyledInput
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder='Search...'
        style={{
          borderBottom: `1px solid ${theme.borderColor}`,
          color: theme.text,
        }}
      />
      {isLoading ? (
        <Oval
          height={30}
          width={30}
          color={theme.body}
          wrapperStyle={{}}
          wrapperClass=''
          visible={true}
          ariaLabel='oval-loading'
          secondaryColor={theme.text}
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      ) : (
        <>
          {showConfirmButton && (
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <StyledButton
                onClick={handleConfirmSelection}
                style={{
                  marginTop: '1rem',
                  backgroundColor: theme.body,
                  color: theme.text,
                  marginBottom: '1rem',
                  cursor: 'pointer',
                  borderRadius: '5px',
                  width: '100%',
                }}
              >
                Confirm Selection
              </StyledButton>
            </div>
          )}
          {sortFundsByChecked(filteredFunds).map((fund) => (
            <VerticalWrapper
              key={fund.uuid}
              color='secondary'
              style={{ cursor: loadingFunds[fund.uuid] ? 'wait' : 'pointer' }}
            >
              <StyledFormControlLabel
                label={
                  <div style={{ display: 'flex', gap: '0.3rem' }}>
                    <Typography
                      variant='body2'
                      color='textSecondary'
                      sx={{
                        fontSize: '0.75rem',
                        color: theme.sideBarSubMenuTitle,
                      }}
                    >
                      {fund.name}
                    </Typography>
                    {loadingFunds[fund.uuid] && (
                      <Oval height={13} width={13} color={theme.text} />
                    )}
                  </div>
                }
                sx={{
                  width: '100%',
                  display: 'flex',
                  cursor: loadingFunds[fund.uuid] ? 'wait' : 'pointer',
                }}
                control={
                  <Checkbox
                    checked={checkedFunds[fund.uuid] || false}
                    onChange={
                      loadingFunds[fund.uuid]
                        ? () => true
                        : (e) => handleFundChange(e, fund.uuid)
                    }
                    style={{ color: theme.borderColor }}
                    sx={{
                      transform: 'scale(0.75)',
                      cursor: loadingFunds[fund.uuid] ? 'wait' : 'pointer',
                    }}
                    defaultChecked={false}
                  />
                }
              />
            </VerticalWrapper>
          ))}
        </>
      )}
    </Box>
  );
}

const StyledInput = styled.input`
  height: 2rem;
  width: 100%;
  margin-bottom: 0.5rem;
  border: none;
  background: none;
  &:placeholer {
    color: ${({ theme }) =>
      theme.borderColor || '#000'}; /* Apply the custom border color on focus */
  }
  &:focus {
    outline: none;
  }
`;

const StyledButton = styled.button`
  border: none;
  padding: 0.5rem;
`;

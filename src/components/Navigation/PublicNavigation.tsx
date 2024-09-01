// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { useTheme } from 'styled-components';
import * as AiIcons from 'react-icons/ai';
import * as TbIcons from 'react-icons/tb';
import { logout } from '../../features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useOutletContext } from 'react-router-dom';
import CheckboxButton from '../../UI/CheckboxButton';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import LoginModal from '../LoginModal';
import { IconContext } from 'react-icons/lib';
import { Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { InputAdornment } from '@mui/material';
import * as CiIcons from 'react-icons/ci';
import Countdown from '../Theme/Countdown';

const NavBar = styled.nav`
  background-color: ${({ theme }) => theme.background};
  /* width: 100%; */
  min-height: 7.2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 0.5rem;
`;

const UpperNav = styled.div`
  width: 100%;
  height: 60%;
  /* padding-left: 4rem; */
`;

const UpperNavContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 1.1rem;
  @media (max-width: 1440px) {
    justify-content: flex-start;
    padding-left: 0;
    overflow-x: auto;
  }
`;

const LoginWrapper = styled.div`
  display: flex;
  margin-right: 2.4rem;
  gap: 1rem;
  justify-content: flex-end;
`;

const ControlsNav = styled.div`
  width: 100%;
  height: 40%;
  display: flex;
  align-items: center;
  padding-left: 2.2rem;
`;

const ControlNavContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const LoginButton = styled.button`
  color: white;
  display: flex;
  position: relative;
  gap: 0.5rem;
  border: none;
  align-items: center;
  justify-content: center;
  background-color: #101014;
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  /* border: 1px solid ${({ theme }) => theme.buttonBorder}; */
  border-radius: 5px;
  padding: 0.85rem 1rem 0.725rem 1rem;
`;

const Tab = styled.div`
  cursor: pointer;
  color: ${({ theme, active }) => (active ? 'theme.text' : theme.text)};
  position: relative;
  display: flex;
  min-width: 14rem;
  justify-content: space-between;
  width: auto;
  position: relative;
  gap: 0.5rem;
  max-width: 20rem;
  align-items: center;
  background-color: ${({ theme, active }) =>
    active ? theme.subButtonColorActive : theme.body};
  text-align: center;
  cursor: help !important;
  text-decoration: none;
  /* border: 1.5px solid ${({ theme, active }) => theme.borderColor}; */
  border-radius: 5px;
  height: 1.4375em;
  padding: 8.5px 14px;
  /* padding: 0.65rem 1rem 0.625rem 1rem; */
`;
const NextProjectButton = styled.div`
  cursor: pointer;
  color: ${({ theme, active }) => (active ? 'white' : theme.text)};
  display: ${({ started }) => (started ? 'flex' : 'none')};
  flex-direction: row;
  position: relative;
  gap: 0.5rem;
  align-items: center;
  background-color: ${({ theme, active }) =>
    active ? theme.subButtonColorActive : theme.subButtonColor};
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  border: 1.5px solid ${({ theme, active }) => theme.borderColor};
  border-radius: 5px;
  height: 1.4375em;
  transition: all 0.5s ease;
  padding: 4.5px 7px;
  &:active {
    background: #ff343497;
  }
  /* padding: 0.65rem 1rem 0.625rem 1rem; */
`;
const StartProjectButton = styled.div`
  cursor: pointer;
  color: ${({ theme, active }) => (active ? 'white' : theme.text)};
  display: ${({ started }) => (!started ? 'flex' : 'none')};
  flex-direction: row;
  position: relative;
  gap: 0.5rem;
  align-items: center;
  /* background-color: ${({ theme, active }) =>
    active ? theme.subButtonColorActive : theme.subButtonColor}; */
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  border: 1.5px solid ${({ theme, active }) => theme.borderColor};
  transition: all 0.5s ease;
  border-radius: 5px;
  height: 1.4375em;
  padding: 4.5px 7px;
  &:active {
    background: #ff343497;
  }
  /* padding: 0.65rem 1rem 0.625rem 1rem; */
`;
const PreviousProjectButton = styled.div`
  cursor: pointer;
  color: ${({ theme, active }) => (active ? 'white' : theme.text)};
  display: ${({ started }) => (started ? 'flex' : 'none')};
  position: relative;
  flex-direction: row-reverse;
  gap: 0.5rem;
  align-items: center;
  background-color: ${({ theme, active }) =>
    active ? '#2a4862' : theme.subButtonColor};
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  border: 1.5px solid ${({ theme, active }) => theme.borderColor};
  border-radius: 5px;
  height: 1.4375em;
  padding: 4.5px 7px;
  transition: all 0.5s ease;
  &:active {
    background: #ff343497;
  }
  /* padding: 0.65rem 1rem 0.625rem 1rem; */
`;

const ShortcutIndicator = styled.div`
  cursor: default;
  color: ${({ theme, active }) => theme.subText};
  display: flex;
  position: absolute;
  font-size: 0.8rem;
  align-items: center;
  justify-content: center;
  text-align: center;
  right: 1rem;
  bottom: 0.7rem;
  /* background-color: ${({ theme, active }) =>
    active ? '#2a4862' : theme.searchBar}; */
  text-decoration: none;
  border: 0.8px solid ${({ theme, active }) => theme.buttonBorder};
  border-radius: 5px;
  height: 0.8em;
  padding: 5px 5px;
`;
const ShortcutIndicatorTab = styled.div`
  color: ${({ theme, active }) => theme.subText};
  display: flex;
  right: 1rem;
  font-size: 0.8rem;
  align-items: center;
  justify-content: center;
  text-align: center;
  /* background-color: ${({ theme, active }) =>
    active ? '#2a4862' : theme.searchBar}; */
  cursor: default;
  text-decoration: none;
  border: 0.8px solid ${({ theme, active }) => theme.buttonBorder};
  border-radius: 5px;
  height: 0.8em;
  padding: 5px 5px;
`;
const HomeButton = styled.a`
  color: var(--text);
  background-color: none;
  text-decoration: none;
  border-radius: 5px;
  text-align: center;
  border: 1px solid #e7e7eb;
  padding: 0.85rem 1rem 0.725rem 1rem;
`;

const TabsWrapper = styled.div`
  display: flex;
  overflow-x: auto;
  flex-grow: 1;
  flex-direction: row;
  gap: 0.5rem;

  @media (max-width: 1600px) {
    flex-grow: 0;
    width: 50%;
  }

  @media (max-width: 1100px) {
    flex-grow: 0;
    width: 14rem;
    margin-left: ;
  }
`;

const StyledIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
`;

interface NavigationInterface {
  historyHandler: (event: Event) => void;
  favouriteHandler: (event: Event) => void;
  goodProjectsHandler: (event: Event) => void;
  unratedProjectsHandler: (event: Event) => void;
  greatProjectsHandler: (event: Event) => void;
  feedHandler: () => void;
  searchHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  previousButtonRef: any;
  legendMode: string;
  nextButtonRef: any;
  controlsButtonRef: any;
  startButtonRef: any;
  feedType: string;
  nodes: any[];
  FeedTypes: any;
  tabs: Tab[];
  activeTab: string;
  onTabClick: (tabId: string) => void;
  resurfacingHandler: any;
  searchQuery: String;
  loading: boolean;
  started: boolean;
}

const PublicNavigation = ({
  historyHandler,
  searchHandler,
  started,
  legendMode,
  favouriteHandler,
  nextButtonRef,
  feedType,
  FeedTypes,
  previousButtonRef,
  nodes,
  startButtonRef,
  loading,
  searchQuery,
  goodProjectsHandler,
  unratedProjectsHandler,
  greatProjectsHandler,
  resurfacingHandler,
  setShowResurfacing,
  controlsButtonRef,
  feedHandler,
  tabs,
  activeTab,
  onTabClick,
}: NavigationInterface) => {
  // @ts-ignore
  const { userInfo, access_token } = useSelector((state) => state.user);
  // automatically authenticate user if token is found
  const [favorites, setFavorites] = useState(false);
  const dispatch = useDispatch();
  const end = new Date();
  end.setUTCHours(23, 59, 59, 999);
  const theme = useTheme();
  const searchRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLDivElement>(null);
  const shortcutRef = React.useRef<HTMLDivElement>(null);
  const listViewRef = React.useRef<HTMLDivElement>(null);
  const activeThesisRef = React.useRef<HTMLDivElement>(null);
  const nodesViewRef = React.useRef<HTMLDivElement>(null);
  const reportsViewRef = React.useRef<HTMLDivElement>(null);
  const marketMapViewRef = React.useRef<HTMLDivElement>(null);
  const tickerViewRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const legend = [
    {
      name: 'Project',
      color: '#2e2e2e',
      colorStart: '#d4d4d4',
      startLabel: '2016',
      finishLabel: '2023',
    },
    {
      name: 'Fund',
      color: 'hsl(297, 70%, 30%, .9)',
      colorStart: '#2f2531',
      startLabel: '7 Days +',
      finishLabel: 'Recent',
    },
  ];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey && event.code === 'Space') {
        event.preventDefault();
        searchRef.current?.querySelector('input')?.focus();
        listViewRef.current.click();
        shortcutRef.current.style.display = 'none';
      }
      if (event.shiftKey && event.code === 'Digit1') {
        event.preventDefault();
        // activeThesisRef.current.click();
      }
      // if (event.shiftKey && event.code === 'Digit1') {
      //   event.preventDefault();
      //   listViewRef.current.click();
      // }
      if (event.shiftKey && event.code === 'Digit2') {
        event.preventDefault();
        tickerViewRef.current.click();
      }
      if (event.shiftKey && event.code === 'Digit3') {
        event.preventDefault();
        marketMapViewRef.current.click();
      }
      if (event.shiftKey && event.code === 'Digit4') {
        event.preventDefault();
        reportsViewRef.current.click();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  const checkFavorites = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFavorites(e.target?.checked);
  };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleFocus = () => {
    if (inputRef.current) {
      listViewRef.current.click();
      inputRef.current.style.borderColor = 'blue';
      shortcutRef.current.style.display = 'none';
    }
  };

  const handleBlur = () => {
    if (inputRef.current) {
      shortcutRef.current.style.display = 'flex';
      inputRef.current.style.borderColor = 'grey';
    }
  };

  const createIndicator = (id) => {
    if (id === 'curated-list') return 'SHIFT 1';
    if (id === 'curated-network') return 'CTRL F2';
    if (id === 'reports') return 'SHIFT 4';
    if (id === 'central-feed') return 'SHIFT 2';
    if (id === 'connected-ventures') return 'SHIFT 3';
    return 'BETA';
  };

  const props = useOutletContext();
  return (
    <>
      <IconContext.Provider value={{ color: 'black' }}>
        <NavBar>
          <UpperNav>
            <UpperNavContainer>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  overflowX: 'auto',
                  gap: '1.5rem',
                  position: 'relative',
                }}
                ref={searchRef}
              >
                <a
                  href='https://calendly.com/daniel-arbm/30min?month=2023-07'
                  target='_blank'
                  rel='noreferrer'
                >
                  <TextField
                    value={searchQuery}
                    placeholder='Search...'
                    size='small'
                    id='input-with-icon-textfield'
                    inputProps={{ style: { color: theme.text } }}
                    inputRef={inputRef}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    sx={{
                      '& .MuiInputLabel-root': {}, //styles the label
                      '& .MuiOutlinedInput-root': {
                        '& > fieldset': {
                          // borderRadius: '50px',
                          overflow: 'hidden',
                          border: 'none',
                        },
                      },
                      'width': '18rem',
                      'cursor': 'not-allowed',
                      // 'border': `${
                      //   props.isDarkMode !== 'light'
                      //     ? `1.5px solid ${theme.buttonBorder}`
                      //     : 'none'
                      // }`,
                      'background': theme.searchBar,
                      'borderRadius': '6px',
                      '& .MuiOutlinedInput-root.Mui-focused': {
                        '& > fieldset': {
                          border: `2px solid #3280c5`,
                        },
                      },
                    }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      searchHandler(e)
                    }
                    variant='outlined'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position='start'
                          sx={{ cursor: 'not-allowed' }}
                        >
                          <SearchRoundedIcon
                            fontSize='small'
                            sx={{ color: theme.text }}
                          />
                          <ShortcutIndicator ref={shortcutRef}>
                            SHIFT SPACE
                          </ShortcutIndicator>
                        </InputAdornment>
                      ),
                    }}
                  />
                </a>
                {/* render the logo and title of each tab */}
                <TabsWrapper>
                  {tabs.map((tab) => (
                    <a
                      href='https://calendly.com/daniel-arbm/30min?month=2023-07'
                      target='_blank'
                      rel='noreferrer'
                      style={{ textDecoration: 'none' }}
                    >
                      <Tab
                        href='https://calendly.com/daniel-arbm/30min?month=2023-07'
                        key={tab.id}
                        // active={tab.id === '/connected-ventures' ? 'active' : ''}
                        // ref={createRef(tab.id)}
                        // onClick={() => onTabClick(tab.id)}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '0.4rem',
                          }}
                        >
                          <div
                            style={{
                              border: `1px solid ${theme.borderColor}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: theme.subBackground,
                              borderRadius: '5.5px',
                              padding: '0.25rem 0.3rem 0.25rem 0.3rem',
                            }}
                          >
                            {tab.icon}
                          </div>
                          {/* <img src={tab.logo} alt={tab.title} /> */}
                          <span>{tab.title}</span>
                        </div>
                        <ShortcutIndicatorTab>
                          {createIndicator(tab.id)}
                        </ShortcutIndicatorTab>
                      </Tab>
                    </a>
                  ))}
                </TabsWrapper>
                <LoginWrapper>
                  <LoginButton onClick={props.onDarkMode}>
                    <DarkModeSwitch
                      moonColor={'white'}
                      sunColor={'white'}
                      size={14}
                      checked={props.isDarkMode === 'light' ? true : false}
                    />
                  </LoginButton>
                  {/* <HomeButton>Home</HomeButton> */}
                  {userInfo ? (
                    <LoginButton
                      onClick={() => {
                        dispatch(logout());
                        window.location.reload();
                      }}
                    >
                      Log out
                    </LoginButton>
                  ) : (
                    <LoginButton onClick={navigate('/login')}>
                      Login
                    </LoginButton>
                  )}
                </LoginWrapper>
              </div>
            </UpperNavContainer>
          </UpperNav>
          <ControlsNav>
            <ControlNavContainer>
              {activeTab === 'curated-list' || activeTab === '' ? (
                <>
                  <CheckboxButton
                    title={'Resurfacing'}
                    style={{ position: 'relative' }}
                    id={FeedTypes.Resurfacing}
                    handler={resurfacingHandler}
                    clicked={() => feedType === FeedTypes.Resurfacing}
                    icon={
                      <TbIcons.TbRepeat
                        style={{
                          color: theme.actionable,
                          transform: 'scale(0.9)',
                          alignSelf: 'center',
                        }}
                      />
                    }
                  ></CheckboxButton>
                  <CheckboxButton
                    title={'Latest Release'}
                    loading={loading}
                    handler={feedHandler}
                    clicked={() =>
                      feedType === FeedTypes.Feed ||
                      feedType === FeedTypes.Initial
                    }
                  />
                  <CheckboxButton
                    title={'Feed'}
                    loading={loading}
                    handler={historyHandler}
                    clicked={() => feedType === FeedTypes.HistoricSignals}
                  />
                  <CheckboxButton
                    title={'Favorites'}
                    loading={loading}
                    handler={favouriteHandler}
                    clicked={() => feedType === FeedTypes.Favourites}
                  />
                  <CheckboxButton
                    title={'Great projects'}
                    handler={greatProjectsHandler}
                    loading={loading}
                    clicked={() => feedType === FeedTypes.GreatProjects}
                  />
                  <CheckboxButton
                    title={'Good projects'}
                    handler={goodProjectsHandler}
                    loading={loading}
                    clicked={() => feedType === FeedTypes.GoodProjects}
                  />
                  <CheckboxButton
                    title={'Unrated projects'}
                    handler={unratedProjectsHandler}
                    loading={loading}
                    clicked={() => feedType === FeedTypes.Unrated}
                  />
                </>
              ) : activeTab === 'curated-network' ? (
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <>
                    <PreviousProjectButton
                      ref={previousButtonRef}
                      started={started}
                    >
                      Previous Project{' '}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: theme.subBackground,
                          borderRadius: '5.5px',
                          padding: '0.25rem 0.3rem 0.25rem 0.3rem',
                        }}
                      >
                        <AiIcons.AiOutlineArrowLeft
                          style={{ color: theme.iconColor }}
                        ></AiIcons.AiOutlineArrowLeft>
                      </div>{' '}
                    </PreviousProjectButton>
                    <NextProjectButton ref={nextButtonRef} started={started}>
                      Next project{' '}
                      <div
                        ref={nextButtonRef}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '5.5px',
                          padding: '0.25rem 0.3rem 0.25rem 0.3rem',
                        }}
                      >
                        <AiIcons.AiOutlineArrowRight
                          ref={nextButtonRef}
                          style={{ color: theme.iconColor }}
                        ></AiIcons.AiOutlineArrowRight>
                      </div>{' '}
                    </NextProjectButton>
                  </>
                  <StartProjectButton ref={startButtonRef} started={started}>
                    Explore signals
                    <div
                      ref={startButtonRef}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: theme.subBackground,
                        borderRadius: '5.5px',
                        padding: '0.25rem 0.3rem 0.25rem 0.3rem',
                      }}
                    >
                      <AiIcons.AiOutlineEye
                        ref={startButtonRef}
                        style={{ color: theme.iconColor }}
                      ></AiIcons.AiOutlineEye>
                    </div>{' '}
                  </StartProjectButton>
                </div>
              ) : true ? (
                <div style={{ width: '100%', display: 'flex', gap: '1rem' }}>
                  <StartProjectButton ref={controlsButtonRef}>
                    {/* {hiddenControls ? 'Show controls' : 'Hide controls'} */}
                    <div
                      ref={controlsButtonRef}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '5.5px',
                        padding: '0.25rem 0.3rem 0.25rem 0.3rem',
                      }}
                    >
                      Hide controls
                      {/* <AiIcons.AiOutlineEye
                        ref={controlsButtonRef}
                        style={{ color: theme.iconColor }}
                      ></AiIcons.AiOutlineEye> */}
                    </div>{' '}
                  </StartProjectButton>
                  {legendMode === 'EXPLORE' &&
                    nodes.length > 0 &&
                    legend.map((item: { color: string; name: string }) => {
                      return (
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0rem',
                            width: '13.5rem',
                          }}
                        >
                          <span style={{ fontSize: '12px' }}> {item.name}</span>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.2rem',
                            }}
                          >
                            <div
                              style={{
                                width: '100%',
                                height: '0.85rem',
                                borderRadius: '3px',
                                background: `linear-gradient(90deg,${item.colorStart},${item.color})`,
                              }}
                            ></div>
                            <div
                              style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                            >
                              <span
                                style={{ fontSize: '10.7px', fontWeight: '' }}
                              >
                                {item.startLabel}
                              </span>
                              <span
                                style={{ fontSize: '10.7px', fontWeight: '' }}
                              >
                                {item.finishLabel}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <></>
              )}
            </ControlNavContainer>
          </ControlsNav>
        </NavBar>
      </IconContext.Provider>
    </>
  );
};

export default PublicNavigation;

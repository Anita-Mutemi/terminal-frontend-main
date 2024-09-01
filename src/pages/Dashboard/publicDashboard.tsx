// @ts-nocheck

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useContext,
} from 'react';
import styled, { useTheme } from 'styled-components';
import { Outlet } from 'react-router-dom';
import * as AiIcons from 'react-icons/ai';
import * as TfIcons from 'react-icons/tfi';
import * as MdIcons from 'react-icons/md';
import Snackbar from '@mui/material/Snackbar';
import Sidebar from '../../components/Sidebar';
import { useLocation } from 'react-router-dom';
import Feed from '../../components/Feed';
import { useNavigate } from 'react-router-dom';
import DashboardContext from '../../hooks/DashboardContext';
import Nodes from '../../views/Nodes';
import { useOutletContext } from 'react-router-dom';
import Arkadash from '../../assets/logo-gray.png';

import { Box, Typography, IconButton, Button, Dialog } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import Reports from '../../views/Reports';
import Navigation from '../../components/Navigation';
import Guide from '../../components/Guide';
import {
  getFeed,
  getHistoryFeed,
  getFavourites,
  getGreatProjects,
  getUnratedProjects,
  getResurfacing,
  getGoodProjects,
  getFeedInitial,
} from '../../features/feed/feedActions';

import styles from './Dashboard.module.css';
import { useSelector, useDispatch } from 'react-redux';
import PublicNavigation from '../../components/Navigation/PublicNavigation';

enum FeedTypes {
  Feed = 'feed',
  Initial = 'initial',
  GreatProjects = 'great projects',
  GoodProjects = 'good projects',
  Resurfacing = 'resurfacing',
  Unrated = 'unrated',
  Favourites = 'favourites',
  ActiveSignals = 'active signals',
  HistoricSignals = 'historic signals',
}

const CustomModal = (props: any) => {
  const theme = useTheme();

  const style = {
    // padding: '3rem',
    flexDirection: 'column',
    // @ts-ignore
    color: theme.text,
    width: '100%',
    height: '100%',
    maxHeight: '100%',
    overflowY: 'auto',
    // @ts-ignore
    bgcolor: theme.background,
    boxShadow: 24,
  };
  const [open, setOpen] = React.useState(true);

  const handleClose = () => setOpen(false);
  return (
    <Dialog fullScreen open={open} onClose={handleClose}>
      <Box sx={style}>
        <Box
          sx={{
            width: '540px',
            height: '630px',
            padding: '3rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.4rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '0.69rem',
              flexDirection: 'column',
            }}
          >
            <Typography variant='h5' component='h2' sx={{ fontWeight: 'bold' }}>
              CONNECTED VENTURES
            </Typography>
          </div>
          <Typography variant='body1' sx={{ textAlign: 'justify' }}>
            Welcome to Connected Ventures, an open-source tool revolutionizing
            venture market analysis. Developed by our expert team from renowned
            institutes like NYU and Cambridge, we harness sophisticated data
            science to uncover the hidden driving factors behind investment
            rounds.
            <br />
            <br />
            For the first time, we're inviting public collaboration to refine
            this potent tool. As a research-oriented group, we're keen on
            transparently sharing our code and encouraging active contributions
            to enhance its effectiveness.
            <br />
            <br />
            Our tool has historically sourced deals committed to by popular
            funds including a16z, Sequoia, Index and more. For a deeper
            understanding of its operation, we direct you to our research
            publications. Together, let's reshape venture analysis.
          </Typography>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Button
              variant='contained'
              sx={{ background: '#cf5456' }}
              onClick={() => handleClose()}
            >
              Explore Connected Ventures
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

const PublicDashboard = () => {
  const props = useOutletContext();
  const location = useLocation();

  const tabs = [
    {
      id: 'curated-list',
      title: 'Curated Signals',
      icon: (
        <TfIcons.TfiViewListAlt
          // @ts-ignore
          style={{ color: '#0eaeee', transform: 'scale(1)' }}
        />
      ),
    },
    {
      id: 'central-feed',
      title: 'Central Feed',
      icon: (
        <MdIcons.MdOutlineRssFeed
          // @ts-ignore
          style={{ color: '#fd697f', transform: 'scale(1.25)' }}
        />
      ),
    },
    {
      id: 'connected-ventures',
      title: 'Connected Ventures',
      icon: (
        <MdIcons.MdManageSearch
          // @ts-ignore
          style={{ color: '#dcb114', transform: 'scale(1.25)' }}
        />
      ),
    },
    {
      id: 'reports',
      title: 'Team Reports',
      icon: (
        <AiIcons.AiOutlineAudit
          // @ts-ignore
          style={{ color: '#8d8d8d', transform: 'scale(1.25)' }}
        />
      ),
    },
  ];

  const completedKey = 'modalCompleted';
  //@ts-ignore
  const { userInfo, access_token } = useSelector((state) => state.user);
  //@ts-ignore
  const { projects, showHistory, loading, error } = useSelector(
    //@ts-ignore
    (state) => state.projects,
  );
  const [feedType, setFeedType] = useState(FeedTypes.Initial);
  const [firstRender, setFirstRender] = useState(false);
  const [verticalFilter, setVerticalFilter] = useState([]);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [started, setStarted] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);
  const [legend, setLegend] = useState('');
  const [nodes, setNodes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [fundFilter, setFundFilter] = useState('');
  const [selectedValue, setSelectedValue] = React.useState('');
  const [modalCompleted, setModalCompleted] = React.useState(
    localStorage.getItem(completedKey) === 'true',
  );
  const navigate = useNavigate();

  const [showModal, setShowModal] = React.useState(true);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const previousButtonRef = React.useRef();
  const nextButtonRef = React.useRef();
  const controlsButtonRef = React.useRef<HTMLDivElement>(null);
  const startButtonRef = React.useRef();
  const showIntro = () => {
    localStorage.setItem(completedKey, 'false');
    setModalCompleted(false);
  };

  useEffect(() => {
    setActiveTab(location.pathname.replace(/^./, ''));
  }, [location.pathname]);

  const greatProjectsHandler = (e: any) => {
    setHasUserInteracted(true);
    if (!loading) {
      setFeedType(FeedTypes.GreatProjects);
    }
  };

  const resurfacingHandler = () => {
    setHasUserInteracted(true);
    if (!loading) {
      setFeedType(FeedTypes.Resurfacing);
    }
  };

  const unratedProjectsHandler = (e: any) => {
    setHasUserInteracted(true);
    if (!loading) {
      setFeedType(FeedTypes.Unrated);
    }
  };

  const goodProjectsHandler = (e: any) => {
    setHasUserInteracted(true);
    if (!loading) {
      setFeedType(FeedTypes.GoodProjects);
    }
  };

  const historyHandler = (e: any) => {
    setHasUserInteracted(true);
    if (!loading) {
      setHasUserInteracted(true);
      setFeedType(FeedTypes.HistoricSignals);
    }
  };

  const feedHandler = () => {
    setHasUserInteracted(true);
    if (!loading) {
      setFeedType(FeedTypes.Feed);
    }
  };

  const favouriteHandler = (e: any) => {
    setHasUserInteracted(true);
    if (!loading) {
      setFeedType(FeedTypes.Favourites);
    }
  };

  const fundFilterHandler = (title: string) => {
    if (!loading) {
      setFeedType(FeedTypes.HistoricSignals);
      setFundFilter(title);
    }
  };

  const clearFilters = () => {
    setHasUserInteracted(true);
    setVerticalFilter([]);
    setFundFilter('');
    setSelectedValue('');
    setSearchQuery('');
    setFeedType(FeedTypes.HistoricSignals);
  };

  const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e!.target?.value);
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    navigate(`/${tabId}`);
  };

  const dispatch = useDispatch();

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  // const projectsCropped = useMemo(() => filterOut(), [filterOut]);

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

  const viewComponents: { [key: string]: React.ReactNode } = {
    'curated-list': <Feed />,
    'curated-network': <Nodes />,
    'reports': <Reports />,
  };

  return (
    <>
      <CustomModal darkmode={props} />
      <div className={styles.dashboard__container}>
        {/* @ts-ignore */}
        <Sidebar verticals={projects.verticals} showIntro={showIntro} />
        <div className={styles.dashboard__wrapper}>
          <PublicNavigation
            previousButtonRef={previousButtonRef}
            nextButtonRef={nextButtonRef}
            legendMode={legend}
            searchQuery={searchQuery}
            controlsButtonRef={controlsButtonRef}
            loading={loading}
            nodes={nodes}
            startButtonRef={startButtonRef}
            historyHandler={historyHandler}
            searchHandler={searchHandler}
            favouriteHandler={favouriteHandler}
            started={started}
            feedType={feedType}
            FeedTypes={FeedTypes}
            goodProjectsHandler={goodProjectsHandler}
            greatProjectsHandler={greatProjectsHandler}
            unratedProjectsHandler={unratedProjectsHandler}
            feedHandler={feedHandler}
            resurfacingHandler={resurfacingHandler}
            tabs={tabs}
            activeTab={activeTab}
            onTabClick={handleTabClick}
          />
          <DashboardContext.Provider
            value={{
              feedProps: {
                open: open,
                setOpen: setOpen,
                handleClose: handleClose,
              },
              nodesProps: {
                nextButtonRef: nextButtonRef,
                legendMode: legend,
                nodes,
                setNodes,
                setLegendMode: setLegend,
                previousButtonRef: previousButtonRef,
                startButtonRef: startButtonRef,
                controlsButtonRef: controlsButtonRef,
                started: started,
                setStarted: setStarted,
                triggerPopUp: setOpen,
              },
              reportsProps: {
                reports: 'test',
              },
            }}
          >
            <Outlet
              // @ts-ignore
              context={{
                isDarkMode: props.isDarkMode,
                onDarkMode: props.onDarkMode,
              }}
            />
          </DashboardContext.Provider>
        </div>
      </div>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message='Your feedback has been submitted'
        action={action}
      />
    </>
  );
};

const StyledLogo = styled.div`
  width: 2rem;
  min-width: 2rem;
  display: flex;
  border-radius: 10px;
  align-items: center;
`;

export default PublicDashboard;

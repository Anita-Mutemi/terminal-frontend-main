/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
  useMemo,
} from 'react';

import { defaultOptions, segment, companiesOptions } from './defaultOptions';
import * as RiIcons from 'react-icons/ri';
import * as AiIcons from 'react-icons/ai';
import * as HiIcons from 'react-icons/hi2';
import * as MdIcons from 'react-icons/md';
import * as FaIcons from 'react-icons/fa';
import Tooltip from '@mui/material/Tooltip';
import HelpOutline from '@mui/icons-material/HelpOutline';
import { feedBot } from '../utils/openai';
import DashboardContext from '../hooks/DashboardContext';
import chroma from 'chroma-js';
import styled, { useTheme, keyframes } from 'styled-components';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import TimeLine from '../components/Project/TimeLine';
import MarketMap from './MarketMap';
import CompetitorsMap from './CompetitorsMap';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { ReactComponent as Crunchbase } from '../assets/crunchbase.svg';
import { ReactComponent as Email } from '../assets/email.svg';
import { ReactComponent as Twitter } from '../assets/twitter.svg';
import { ReactComponent as LinkedIn } from '../assets/linkedin.svg';
import { ReactComponent as LinkedInOwner } from '../assets/linkedinowner.svg';
import { ReactComponent as Pitchbook } from '../assets/pitchbook.svg';
import InvestorsList from '../components/InvsetorsList';
import axios from 'axios';
import LanguageIcon from '@mui/icons-material/Language';
import { Oval } from 'react-loader-spinner';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TableList from '../UI/TableList';
import { isNull } from 'lodash';

type Stage = 'seed' | 'pre-seed' | 'series A' | 'series B' | 'series C';
type Funding = {
  minYear: number;
  maxYear: number;
};
type FoundedYear = {
  minYear: number;
  maxYear: number;
};
type Size = {
  minEmployees: number;
  maxEmployees: number;
};

type MetricsFilterProps = {
  onApplyFilters: (
    stage: Stage,
    funding: Funding,
    foundedYear: FoundedYear,
    size: Size,
  ) => void;
};
const GranularSearch = () => {
  const theme = useTheme();
  const { error, userInfo, access_token } = useSelector(
    (state: any) => state.user,
  );
  const [isValid, setIsValid] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(null);
  const [verticals, setVerticals] = useState([{ value: '', label: '' }]);
  const [customerTypes, setCustomerTypes] = useState([
    { value: '', label: '' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [companiesOption, setCompaniesOption] = useState({});
  const [mapMode, setMapMode] = useState(false);

  const [suggestions, setSuggestions] = useState({
    keywords: [],
    verticals: [],
    business_models: [],
    origin_country: [],
    funding_stage: [],
    product_types: [],
    project: [],
  });

  const {
    // @ts-ignore
    nodesProps: {
      controlsButtonRef,
      legendMode,
      setLegendMode,
      nodes,
      setNodes,
    },
  } = useContext(DashboardContext);
  const [selectedValues, setSelectedValues] = useState({
    keywords: null,
    verticals: null,
    search_mode: 'or',
    funding_stage: null,
    product_types: null,
    business_models: null,
    origin_country: null,
    founded_from: null,
    founded_to: null,
  });

  const buttonSides = 37;
  const [nodesData, setNodesData] = useState(undefined);
  let [graphData, setGraphData] = useState(undefined);

  const [selectedProject, setSelectedProject] = useState({});

  const handleKeywordsChange = (selectedValues: any) => {
    setSelectedValues({
      ...selectedValues,
      keywords: selectedValues,
    });
  };

  const handleVerticalChange = (selectedOption: any) => {
    setSelectedValues({
      ...selectedValues,
      verticals: selectedOption.map((item: any) => item.value),
    });
  };
  const handleChange = (selectedOption: any, inputName) => {
    setSelectedValues({
      ...selectedValues,
      [inputName]: selectedOption,
    });
  };
  const handleChangeKeyword = (selectedOption: any, inputName) => {
    setSelectedValues({
      ...selectedValues,
      [inputName]: selectedOption,
    });
  };
  const [companyCompetitors, setCompanyCompetitors] = useState();
  const [competitorsData, setCompetitorsData] = useState(undefined);

  const generateCompetitorsMap = async () => {
    setIsLoading(true);
    setLoadingStatus('Generating competitors map...');
    const result = await feedBot(
      companyCompetitors,
      access_token,
      setLoadingStatus,
    );

    const updated = result.map((item) => {
      return {
        color: '#629C85',
        group: 1,
        id: item.company_name,
        object_data: {
          name: item.company_name,
          id: item.company_name,
          project: {
            about: '',
            discovered_date: '',
            funds: [],
            investor_interest: null,
            keywords: [],
            logo: '',
            title: item.company_name,
            uuid: '',
            website: item.website,
          },
        },
      };
    });

    const updated2 = {
      nodes: updated,
      links: [],
    };
    setCompetitorsData(updated2);
    setIsLoading(false);
    setLoadingStatus(null);
  };

  const handleChangeCompany = (selectedOption: any) => {
    setCompaniesOption(selectedOption);
  };

  const handleChangeCompanyCompetitors = (e) => {
    setCompanyCompetitors(e);
  };

  const handleChangeCompanyCompetitorsUrl = (e) => {
    const getCompanyName = (link) => {
      const url = new URL(link);
      let hostname = url.hostname;
      if (hostname.startsWith('www.')) {
        hostname = hostname.slice(4);
      }
      const parts = hostname.split('.');
      return parts.slice(0, parts.length - 1).pop();
    };

    const transformed = {
      id: '',
      value: '',
      color: '',
      title: getCompanyName(e),
      description:
        'description is not defined, rely on website data or on your own knowledge about that company',
      website: e,
    };
    setCompanyCompetitors(transformed);
  };

  const handleCustomerType = (selectedOption: any, inputName) => {
    setSelectedValues({
      ...selectedValues,
      [inputName]: selectedOption,
    });
  };
  const handleChangeProduct = (selectedOption: any, inputName) => {
    // setSelectedValues({
    //   ...selectedValues,
    //   [inputName]: selectedOption.value,
    // });
    setSelectedValues({
      ...selectedValues,
      [inputName]: selectedOption,
    });
  };

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
  const legendCompetitor = [
    {
      name: 'Competitor',
      color: '#732828',
      colorStart: '#732828',
      startLabel: '2016',
      finishLabel: '2023',
    },
  ];

  const logos = {
    crunchbase: (
      <Crunchbase
        fill={theme.iconColor}
        style={{ fill: theme.iconColor }}
      />
    ),

    email: (
      <Email
        fill={theme.iconColor}
        style={{ fill: theme.iconColor }}
      />
    ),
    twitter: (
      <Twitter
        fill={theme.iconColor}
        style={{ fill: theme.iconColor }}
      />
    ),
    linkedin: (
      <LinkedIn
        fill={theme.iconColor}
        style={{ fill: theme.iconColor }}
      />
    ),
    linkedinowner: (
      <LinkedInOwner
        fill={theme.iconColor}
        style={{ fill: theme.iconColor }}
      />
    ),
    pitchbook: (
      <Pitchbook
        fill={theme.iconColor}
        style={{ fill: theme.iconColor }}
      />
    ),
  };
  // @ts-nocheck
  const [showSignals, setShowSignals] = useState(false);
  const [showFundsOnly, setShowFundsOnly] = useState(false);
  const handleStrictSearchClick = (event: any) => {
    setSelectedValues({
      ...selectedValues,
      search_mode: event.target.checked ? 'and' : 'or',
    });
  };
  const handleSignalsClick = (event: any) => {
    setShowSignals((prev) => !prev);
    setShowFundsOnly(false);
  };
  const handleFundsClick = (event: any) => {
    setShowFundsOnly((prev) => !prev);
    setShowSignals(false);
  };

  useEffect(() => {
    // If there is data, the form is valid
    setIsValid(
      selectedValues.keywords?.length > 0 ||
        selectedValues.verticals?.length > 0 ||
        selectedValues.customer_segments?.length > 0
        ? true
        : false,
    );
  }, [
    selectedValues.customer_segments,
    selectedValues.business_models,
    selectedValues.keywords,
    selectedValues.product_types,
    selectedValues.verticals,
  ]);

  enum SectionType {
    TIMELINE = 'timeline',
    ABOUT = 'about',
  }

  const [showControls, setShowControls] = useState(true);
  const SearchRef = useRef(null);
  const LegendRef = useRef(null);
  const ListRef = useRef(null);
  const CurrentProjectRef = useRef(null);
  const [currentView, setCurrentView] = useState<SectionType>(
    SectionType.ABOUT,
  );

  const toggleControls = useCallback(() => {
    if (showControls) {
      setShowControls(false);
      setHelp(false);
      controlsButtonRef.current.innerText = 'Show controls';
      if (LegendRef.current) LegendRef.current.style.display = 'none';
      SearchRef.current.style.display = 'none';
      if (ListRef.current) ListRef.current.style.display = 'none';
      CurrentProjectRef.current.style.display = 'none';
    } else {
      setShowControls(true);
      controlsButtonRef.current.innerText = 'Hide controls';
      if (LegendRef.current) LegendRef.current.style.display = 'block';
      SearchRef.current.style.display = 'block';
      if (ListRef.current) ListRef.current.style.display = 'block';
      CurrentProjectRef.current.style.display = 'block';
    }
  }, [
    showControls,
    controlsButtonRef,
    SearchRef,
    ListRef,
    LegendRef,
    CurrentProjectRef,
  ]);

  useEffect(() => {
    // controlsButtonRef.current.addEventListener('click', toggleControls);

    if (controlsButtonRef.current) {
      controlsButtonRef.current.addEventListener('click', toggleControls);
      // controlsButtonRef.current.style.cursorPointer = 'not-allowed';
    }
    return () => {
      if (controlsButtonRef.current) {
        controlsButtonRef.current.removeEventListener('click', toggleControls);
      }
    };
  }, [controlsButtonRef.current, toggleControls]);

  const customStylesSingle = {
    singleValue: (provided: any) => ({
      ...provided,
      // @ts-ignore
      flexGrow: 1,
      border: 'none',
      color: theme.text,
    }),
    option: (
      // @ts-ignore
      styles,
      {
        // @ts-ignore
        data,
        // @ts-ignore
        isDisabled,
        // @ts-ignore
        isFocused,
        // @ts-ignore
        isSelected,
      },
    ) => {
      return {
        ...styles,
        backgroundColor: isDisabled
          ? undefined
          : isSelected
          ? 'orange'
          : isFocused
          ? '#db6f56'
          : undefined,
      };
    },
    control: (provided: any) => ({
      ...provided,
      // height: '32px',
      // minHeight: '32px',
      border: 'none',
      width: '100%',
      // @ts-ignore
      color: 'red !important',
      fontSize: '14px',
      flexGrow: 1,
      // @ts-ignore
      background: theme.subBackground,
      // @ts-ignore
      borderColor: theme.borderColor,
    }),
    input: (provided: any) => ({
      ...provided,
      flexGrow: 1,
      border: 'none',
      // @ts-ignore
      color: theme.text,
    }),
    indicatorSeparator: (provided: any) => ({
      ...provided,
      // @ts-ignore
      background: theme.subBackground,
      // @ts-ignore
      color: theme.text,
      // height: '13px',
    }),
    menu: (provided: any) => ({
      ...provided,
      marginTop: '5x',
      marginBottom: '0px',
      // @ts-ignore
      fontSize: '12px',
      // @ts-ignore
      background: theme.body,
      // @ts-ignore
      border: `1px solid ${theme.borderColor}`,
    }),
    placeholder: (provided: any) => ({
      ...provided,
      fontSize: '12px',
    }),
  };

  const customStyles = {
    option: (
      // @ts-ignore
      styles,
      {
        // @ts-ignore
        data,
        // @ts-ignore
        isDisabled,
        // @ts-ignore
        isFocused,
        // @ts-ignore
        isSelected,
      },
    ) => {
      const color = chroma(data.color);
      return {
        ...styles,
        'backgroundColor': isDisabled
          ? undefined
          : isSelected
          ? data.color
          : isFocused
          ? color.alpha(0.1).css()
          : undefined,
        'color': isDisabled
          ? '#ccc'
          : isSelected
          ? chroma.contrast(color, 'white') > 2
            ? 'white'
            : 'black'
          : data.color,
        'cursor': isDisabled ? 'not-allowed' : 'default',

        ':active': {
          ...styles[':active'],
          backgroundColor: !isDisabled
            ? isSelected
              ? data.color
              : color.alpha(0.3).css()
            : undefined,
        },
      };
    },
    // @ts-ignore
    multiValue: (styles, { data }) => {
      const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: color.alpha(0.1).css(),
      };
    },
    multiValueLabel: (
      // @ts-ignore
      styles,
      {
        // @ts-ignore
        data,
      },
    ) => ({
      ...styles,
      color: data.color,
    }),
    multiValueRemove: (
      // @ts-ignore

      styles,
      {
        // @ts-ignore
        data,
      },
    ) => ({
      // @ts-ignore

      ...styles,
      'color': data.color,
      ':hover': {
        backgroundColor: data.color,
        color: 'white',
      },
    }),
    control: (provided: any) => ({
      ...provided,
      // height: '32px',
      // minHeight: '32px',
      // @ts-ignore
      color: 'red !important',
      fontSize: '14px',
      // @ts-ignore
      background: theme.body,
      // @ts-ignore
      borderColor: theme.borderColor,
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      // @ts-ignore
      color: theme.text,
      padding: '4px',
    }),
    input: (provided: any) => ({
      ...provided,
      // @ts-ignore
      color: theme.text,
    }),
    indicatorSeparator: (provided: any) => ({
      ...provided,
      // @ts-ignore
      color: theme.text,
      // height: '13px',
    }),
    menu: (provided: any) => ({
      ...provided,
      marginTop: '5x',
      marginBottom: '0px',
      // @ts-ignore
      fontSize: '12px',
      // @ts-ignore
      background: theme.body,
      // @ts-ignore
      border: `1px solid ${theme.borderColor}`,
    }),
    placeholder: (provided: any) => ({
      ...provided,
      fontSize: '12px',
    }),
  };

  const debouncedLoadVerticals = async (inputValue: string) => {
    const response = await axios.post(`/demo/verticals`, {});

    const { data } = await response;
    const verticals = data.map((keyword: string) => ({
      // @ts-ignore
      id: keyword,
      // @ts-ignore
      value: keyword,
      // @ts-ignore
      label: keyword,
      // @ts-ignore
      color: '',
    }));
    setVerticals(verticals);
  };

  const debouncedLoadSuggestions = async (
    inputValue: string,
    inputName: string,
  ) => {
    const response =
      inputName !== 'project'
        ? await axios.post(
            `/demo/search/${
              inputName === 'project' ? '' : 'options'
            }/${inputName}?${
              inputName === 'project' ? 'project_query' : 'query_str'
            }=${inputValue}`,
            {},
          )
        : await axios.post(
            `/demo/search${
              inputName === 'project' ? '' : 'options'
            }/${inputName}?${
              inputName === 'project' ? 'project_query' : 'query_str'
            }=${inputValue}${
              inputName === 'project'
                ? '&include_data=true'
                : '&include_data=true'
            }`,
            {},
            {},
          );

    const { data } = await response;
    let updated = [];
    if (inputName === 'project') {
      updated = data.map((keyword: object) => ({
        // @ts-ignore
        id: keyword.uuid,
        // @ts-ignore
        value: keyword.uuid,
        // @ts-ignore
        label: keyword.title,
        // @ts-ignore
        color: '',
        ...keyword,
      }));
    } else {
      updated = data.map((keyword: string) => ({
        // @ts-ignore
        id: keyword,
        // @ts-ignore
        value: keyword,
        // @ts-ignore
        label: keyword,
        // @ts-ignore
        color: '',
      }));
    }
    setSuggestions((prev) => ({ ...prev, [inputName]: updated }));
    return updated;
  };
  const getFilters = async (project_uuid: string) => {
    setSelectedValues({
      keywords: null,
      verticals: null,
      search_mode: 'or',
      funding_stage: null,
      product_types: null,
      business_models: null,
      origin_country: null,
      founded_from: null,
      founded_to: null,
    });
    const response = await axios.post(
      `/demo/filters/project/${project_uuid}`,
      {},
      {},
    );

    const transformData = (data) => {
      const keys = Object.keys(suggestions);
      return keys.reduce((acc, key) => {
        const items = data[key] || [];
        acc[key] = items.map((item) => ({ value: item, label: item }));
        return acc;
      }, {});
    };

    const { data } = await response;
    const newSuggestions = transformData(data);
    // setSuggestions((prev) => ({ ...prev, ...newSuggestions }));
    setSelectedValues((prev) => ({ ...prev, ...newSuggestions }));
    // setselectedValues((prev) => ({ ...prev, ...newSuggestions }));
  };

  const debouncedLoadCompanies = async (
    inputValue: string,
    inputName: string,
  ) => {
    const response = await axios.get(
      `/demo/filters/options/${inputName}?query_str=${inputValue}`,
      {},
    );

    const { data } = await response;
    const updated = data.map((keyword: string) => ({
      // @ts-ignore
      id: keyword,
      // @ts-ignore
      value: keyword,
      // @ts-ignore
      label: keyword,
      // @ts-ignore
      color: '',
    }));
    setSuggestions((prev) => ({ ...prev, [inputName]: updated }));
    return updated;
  };

  const promiseOptions = (inputValue: string, inputName: string) =>
    // @ts-ignore
    new Promise<ColourOption[]>((resolve) => {
      setTimeout(() => {
        resolve(debouncedLoadSuggestions(inputValue, inputName));
      }, 1000);
    });
  useEffect(() => {
    debouncedLoadVerticals('', 'verticals');
    debouncedLoadSuggestions('', 'business_models');
    debouncedLoadSuggestions('', 'product_types');
    // debouncedLoadSuggestions('', 'origin_country');
    debouncedLoadSuggestions('', 'funding_stage');
    debouncedLoadSuggestions('', 'competing_spaces');
    debouncedLoadSuggestions('', 'customer_segments');
  }, []);

  function transformObject(obj) {
    const newObj = JSON.parse(JSON.stringify(obj));
    for (const [key, value] of Object.entries(newObj)) {
      if (Array.isArray(value)) {
        newObj[key] = value.map((item) => {
          if (
            typeof item === 'object' &&
            item !== null &&
            item.hasOwnProperty('value')
          ) {
            return item.value;
          } else {
            return item;
          }
        });
      } else if (
        typeof value === 'object' &&
        value !== null &&
        value.hasOwnProperty('value')
      ) {
        newObj[key] = value.value;
      }

      // Check if key is 'product_types' or 'business_models' and value is an empty string
      if (
        (key === 'product_types' || key === 'business_models') &&
        newObj[key] === ''
      ) {
        newObj[key] = null; // Set to null
      }
    }
    return newObj;
  }

  const generateMap = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${access_token}`,
        accept: 'application/json',
      },
    };

    const transformedObj = transformObject(selectedValues);
    transformedObj.origin_country = null;

    try {
      const { data } = await axios.post(`/demo/search`, transformedObj, config);
      setNodes(data);
    } catch (err) {
      alert(err);
    }
  };
  const generateMapNodes = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${access_token}`,
        accept: 'application/json',
      },
    };
    setIsLoading(true);

    const transformedObj = transformObject(selectedValues);

    transformedObj.origin_country = null;

    try {
      const { data } = await axios.post(
        `/demo/market_map`,
        transformedObj,
        config,
      );
      const gData = data;
      // cross-link node objects

      gData.links.forEach((link) => {
        const a = gData.nodes.find((node) => {
          return link.source === node.id;
        });
        const b = gData.nodes.find((node) => {
          return link.target === node.id;
        });
        // const b = gData.nodes[link.target];
        if (a && b) {
          !a.neighbors && (a.neighbors = []);
          !b.neighbors && (b.neighbors = []);
          a.neighbors.push(b);
          b.neighbors.push(a);

          !a.links && (a.links = []);
          !b.links && (b.links = []);
          a.links.push(link);
          b.links.push(link);
        }
      });
      setNodesData(gData);
      setGraphData(gData);
      setIsLoading(false);
    } catch (err) {
      alert(err);
    }
  };

  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [hoverNode, setHoverNode] = useState(null);
  const [help, setHelp] = useState(false);

  const updateHighlight = () => {
    setHighlightNodes(highlightNodes);
    setHighlightLinks(highlightLinks);
  };

  useEffect(() => {
    if (mapMode) {
      setLegendMode('COMPETITORS');
      return;
    }
    setLegendMode('EXPLORE');
  }, [mapMode, setLegendMode, nodes.length]);

  const handleNodeClick = (node) => {
    if (!mapMode) {
      if (selectedProject.uuid === node.object_data.project.uuid) {
        highlightNodes.clear();
        highlightLinks.clear();
        setSelectedProject({});
        return false;
      }
      setSelectedProject(node.object_data.project ?? {});
      if (!selectedProject.uuid) {
        highlightNodes.clear();
        highlightLinks.clear();
      }
      if (node) {
        const isTheSame = node.id === selectedProject.uuid;
        if (node === null && !selectedProject) {
          highlightNodes.clear();
          highlightLinks.clear();
        }
        if (node) {
          if (node.id !== selectedProject.uuid) {
            highlightNodes.clear();
            highlightLinks.clear();
          }
        }
        if (node && !isTheSame) {
          highlightNodes.add(node);
          node.neighbors.forEach((neighbor) => highlightNodes.add(neighbor));
          node.links.forEach((link) => highlightLinks.add(link));
        }
      }
      setHoverNode(node || null);
      updateHighlight();
    } else {
      window.open(node.object_data.project.website, '_blank');
    }
  };

  const highlightNodeFromList = (nodeId) => {
    const node = nodesData.nodes.find((n) => n.id === nodeId);

    if (!node) {
      return;
    }

    handleNodeClick(node);
  };

  useEffect(() => {
    if (CurrentProjectRef.current) {
      CurrentProjectRef.current.style.display = 'none';
      setSelectedProject({});
    }
  }, [nodesData]);

  function TruncatedString(text) {
    if (text) {
      return <>{text.length > 145 ? text.slice(0, 145) + '...' : text}</>;
    } else {
      return text;
    }
  }

  useEffect(() => {
    if (graphData) {
      if (showSignals && !showFundsOnly) {
        graphData = nodesData;
        return;
      }

      if (!showSignals && !showFundsOnly) {
        graphData.links = [];
        graphData.nodes = nodesData.nodes.filter((node) => {
          // if project data doesn't exist, it's a company node and return me it to the array
          if (node.object_data.project) {
            return node;
          }
        });
        return;
      }

      if (showFundsOnly) {
        graphData.links = [];
        graphData.nodes = nodesData.nodes.filter((node) => {
          // if project data doesn't exist, it's a company node and return me it to the array
          if (!node.object_data.project) {
            return node;
          }
        });
        return;
      }
    }
  }, [nodesData, graphData]);

  return (
    <div
      style={{
        height: '100%',
        position: 'relative',
        // @ts-ignore
        // overflow: 'hidden',
        // backgroundColor: theme.body,
        // background: `radial-gradient(${theme.borderColor} 3px, ${theme.body} 4px) 0 0 / 70px 70px`,
        background: `radial-gradient(circle, ${theme.marketMapBackground} 10%, ${theme.body} 10%) 0 0 / 11.25px 11.25px repeat`,
      }}>
      {help && (
        <GuideWrapper>
          <CardHeader>
            {/* @ts-ignore */}
            <SubTitle style={{ paddingLeft: '1rem', paddingTop: '0.5em' }}>
              How to read the graph
            </SubTitle>
            <HelpButton onClick={() => setHelp(false)}>✖</HelpButton>
          </CardHeader>
          <MainContent>
            <h4>The graph shows startup projects based on search parameters</h4>
            <ul style={{ fontSize: '14px' }}>
              <li>
                The graph displays startup projects based on search parameters.
              </li>
              <li>
                Searching by a company will auto-fill the filters that apply to
                that company.
              </li>
              <li>
                The strict search will only show companies that pass through all
                the filters.
              </li>
              <li>Each node's size indicates funding.</li>
              <li>Use the legend to understand node color.</li>
              <li>Connections represent activity signals.</li>
              <li>
                Clustering reveals hidden similarities between different
                companies visually.
              </li>
              <li>Remove projects or signals as needed.</li>
            </ul>
          </MainContent>
        </GuideWrapper>
      )}
      <LeftSideWrapper>
        <SignalsWrapper ref={SearchRef}>
          <CardHeader>
            {/* @ts-ignore */}
            <CardIcon background='#725d45'>
              <RiIcons.RiListSettingsLine
                style={{
                  color: '#e2c051',
                  transform: 'scale(1.55)',
                }}></RiIcons.RiListSettingsLine>
            </CardIcon>
            <SubTitle style={{ paddingLeft: '1rem', paddingTop: '0.5rem' }}>
              Mapping Parameters
            </SubTitle>
            <HelpButton onClick={() => setHelp((prev) => !prev)}>?</HelpButton>
          </CardHeader>
          <div
            style={{
              overflowY: 'hidden',
              minHeight: '25rem',
              // height: '90%',
              overflowX: 'hidden',
            }}>
            <MainContent>
              <SubHeader>
                <span style={{ paddingLeft: '0.5rem' }}>Graph mode</span>
              </SubHeader>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <ForbiddenTab
                  // key={tab.id}
                  active={mapMode}
                  sx={{ border: 'none', cursor: 'not-allowed' }}
                  style={{ border: 'none', cursor: 'not-allowed' }}
                  // active={tab.id === activeTab ? 'active' : ''}
                  // ref={createRef(tab.id)}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: theme.subBackground,
                      border: 'none',
                      borderRadius: '5.5px',
                      padding: '0.25rem 0.3rem 0.25rem 0.3rem',
                      cursor: 'not-allowed !important',
                    }}>
                    <FaIcons.FaBalanceScale />
                  </div>
                  <span style={{ cursor: 'not-allowed !important' }}>
                    {'Competitors'}
                  </span>
                </ForbiddenTab>
                <Tab
                  // key={tab.id}
                  active={!mapMode}
                  sx={{ border: 'none' }}
                  style={{ border: 'none' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: theme.subBackground,
                      border: 'none',
                      borderRadius: '5.5px',
                      padding: '0.25rem 0.3rem 0.25rem 0.3rem',
                      cursor: 'not-allowed !important',
                    }}>
                    {/* {tab.icon} */}
                    <MdIcons.MdOutlineExplore />
                  </div>
                  {/* <img src={tab.logo} alt={tab.title} /> */}
                  <span>{'Explore '}</span>
                </Tab>
              </div>
              {!mapMode && (
                <>
                  <Tooltip
                    title={
                      <HintLabel>
                        Search for a company to mirror its market parameters
                      </HintLabel>
                    }>
                    <SubHeader>
                      <span style={{ paddingLeft: '0.5rem' }}>
                        Explore by Company{' '}
                        <span style={{ fontSize: '13px' }}>ⓘ</span>
                      </span>
                    </SubHeader>
                  </Tooltip>
                  <div style={{ display: 'flex', gap: '0.65rem' }}>
                    <StyledAsyncSelect
                      placeholder='Enter a company name'
                      cacheOptions
                      // value={companiesOption}
                      defaultOptions={companiesOptions}
                      styles={customStylesSingle}
                      sx={{
                        background: theme.subBackground,
                      }}
                      onChange={(e) => {
                        handleChangeCompany(e);

                        // handleChangeKeyword(e, 'keywords');
                      }}
                      loadOptions={(e) =>
                        promiseOptions(e, 'project')
                      }></StyledAsyncSelect>
                    <StyledButton
                      onClick={() => getFilters(companiesOption.id)}>
                      Search
                    </StyledButton>
                  </div>
                  <SubHeader>
                    <span style={{ paddingLeft: '0.5rem' }}>
                      Explore by Parameters
                    </span>
                  </SubHeader>
                  <Tooltip
                    title={
                      <HintLabel>
                        choose several verticals to find companies matching
                        *all* of the choices
                      </HintLabel>
                    }>
                    <StyledLabel>
                      Verticals <span style={{ fontSize: '12px' }}>ⓘ</span>
                    </StyledLabel>
                  </Tooltip>
                  <Select
                    isMulti
                    placeholder='Select a vertical'
                    options={verticals}
                    value={selectedValues['verticals']}
                    styles={customStylesSingle}
                    onChange={(e) => {
                      handleChange(e, 'verticals');
                    }}
                  />
                  <Tooltip
                    title={
                      <HintLabel>
                        search for a company having *any* of the chosen segments
                      </HintLabel>
                    }>
                    <StyledLabel>
                      Customer Segments{' '}
                      <span style={{ fontSize: '12px' }}>ⓘ</span>
                    </StyledLabel>
                  </Tooltip>
                  <Select
                    isMulti
                    placeholder='Select a Customer Segment'
                    // options={stages}
                    // defaultOptions={segment}
                    value={selectedValues['customer_segments']}
                    // value={selectedStage || ''}
                    options={suggestions['customer_segments']}
                    // onChange={handleStageChange}
                    onChange={(e) => {
                      handleChange(e, 'customer_segments');
                    }}
                    loadOptions={(e) => promiseOptions(e, 'customer_segments')}
                    styles={customStylesSingle}
                  />
                  <Tooltip
                    title={
                      <HintLabel>
                        choose several options to find companies having
                        *multiple* business models{' '}
                      </HintLabel>
                    }>
                    <StyledLabel>
                      Business Models{' '}
                      <span style={{ fontSize: '12px' }}>ⓘ</span>
                    </StyledLabel>
                  </Tooltip>
                  <Select
                    placeholder='Select a Business Model'
                    options={suggestions['business_models']}
                    isMulti
                    value={selectedValues['business_models']}
                    // options={stages}
                    // value={selectedStage || ''}
                    // onChange={handleStageChange}
                    styles={customStylesSingle}
                    onChange={(e) => {
                      handleCustomerType(e, 'business_models');
                    }}
                  />
                  <StyledLabel>Competing Spaces</StyledLabel>
                  <Select
                    isMulti
                    placeholder='Select Competing Spaces'
                    // options={stages}
                    // defaultOptions={segment}
                    value={selectedValues['competing_spaces']}
                    // value={selectedStage || ''}
                    options={suggestions['competing_spaces']}
                    // onChange={handleStageChange}
                    onChange={(e) => {
                      handleChange(e, 'competing_spaces');
                    }}
                    loadOptions={(e) => promiseOptions(e, 'competing_spaces')}
                    styles={customStylesSingle}
                  />
                  <Tooltip
                    title={
                      <HintLabel>
                        choose both options to find companies providing Software
                        *and* Hardware
                      </HintLabel>
                    }>
                    <StyledLabel>
                      Product Types <span style={{ fontSize: '12px' }}>ⓘ</span>
                    </StyledLabel>
                  </Tooltip>
                  <Select
                    placeholder='Select a Product Type'
                    isMulti
                    // options={stages}
                    value={selectedValues['product_types']}
                    options={suggestions['product_types']}
                    onChange={(e) => {
                      handleChangeProduct(e, 'product_types');
                    }}
                    // value={selectedStage || ''}
                    // onChange={handleStageChange}
                    styles={customStylesSingle}
                  />

                  <StyledLabel>Year Founded</StyledLabel>
                  <InputWrapper>
                    <div style={{ width: 'auto' }}>
                      <SubLabel>FROM</SubLabel>
                      <StyledInput
                        type='number'
                        name='minYear'
                        placeholder='e.g. 2016'
                        onChange={(e) => {
                          setSelectedValues((prev) => {
                            return {
                              ...prev,
                              founded_from:
                                e.target.value === '' ? null : e.target.value,
                            };
                          });
                        }}
                      />
                    </div>
                    <div style={{ width: 'auto' }}>
                      <SubLabel>TO</SubLabel>
                      <StyledInput
                        type='number'
                        name='maxYear'
                        placeholder='e.g. 2023'
                        // value={foundedYear.maxYear}
                        onChange={(e) => {
                          setSelectedValues((prev) => {
                            return {
                              ...prev,
                              founded_to:
                                e.target.value === '' ? null : e.target.value,
                            };
                          });
                        }}
                      />
                    </div>
                  </InputWrapper>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                    }}>
                    <FormControlLabel
                      sx={{
                        fontSize: '0.6rem',
                        // flexGrow: 1,
                        placeContent: 'flex-end',
                      }}
                      control={
                        <Checkbox
                          sx={{
                            // @ts-ignore
                            'color': theme.subText,
                            '&.Mui-checked': {
                              // @ts-ignore
                              color: theme.text,
                            },
                          }}
                        />
                      }
                      onChange={handleSignalsClick}
                      checked={showSignals}
                      label={
                        <span style={{ fontSize: '0.83rem' }}>
                          Show Signals
                        </span>
                      }
                    />
                    <FormControlLabel
                      sx={{
                        fontSize: '0.6rem',
                      }}
                      control={
                        <Checkbox
                          sx={{
                            // @ts-ignore
                            'color': theme.subText,
                            '&.Mui-checked': {
                              // @ts-ignore
                              color: theme.text,
                            },
                          }}
                        />
                      }
                      onChange={handleFundsClick}
                      checked={showFundsOnly}
                      label={
                        <span style={{ fontSize: '0.83rem' }}>
                          Show Funds Only
                        </span>
                      }
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <StyledButton
                      // @ts-ignore
                      width={'40%'}
                      // @ts-ignore
                      onClick={() => {
                        setSelectedValues({
                          keywords: null,
                          verticals: null,
                          search_mode: 'or',
                          funding_stage: null,
                          product_types: null,
                          business_models: null,
                          origin_country: null,
                          founded_from: null,
                          founded_to: null,
                        });
                      }}>
                      Reset Filters
                      {/* <MdIcons.AddRoad
                    style={{
                      // @ts-ignore
                      color: theme.Text,
                    }}
                  />{' '} */}
                    </StyledButton>
                    <StyledButton
                      // @ts-ignore
                      disabled={!isValid}
                      // @ts-ignore
                      width={'60%'}
                      onClick={() => {
                        generateMap();
                        generateMapNodes();
                      }}>
                      Generate Market Map
                      <AiIcons.AiOutlineSisternode
                        style={{
                          // @ts-ignore
                          color: theme.Text,
                        }}
                      />{' '}
                    </StyledButton>
                  </div>
                </>
              )}
              {mapMode && (
                <>
                  <SubHeader>
                    <span style={{ paddingLeft: '0.5rem' }}>Find company:</span>
                  </SubHeader>
                  <StyledLabel>Search for a company</StyledLabel>
                  <div style={{ display: 'flex', gap: '0.65rem' }}>
                    <StyledAsyncSelect
                      placeholder='Enter a company name'
                      cacheOptions
                      // value={companiesOption}
                      // defaultOptions={companiesOptions}
                      styles={customStylesSingle}
                      noOptionsMessage={() => 'Start typing a company name'}
                      onChange={(e) => {
                        // handleChangeCompany(e);
                        handleChangeCompanyCompetitors(e);
                        // handleChangeKeyword(e, 'keywords');
                      }}
                      loadOptions={(e) =>
                        promiseOptions(e, 'project')
                      }></StyledAsyncSelect>
                  </div>
                  <StyledLabel>Search by website</StyledLabel>
                  <InputWrapper>
                    <StyledInput
                      type='text'
                      placeholder='https://'
                      fullSize={true}
                      onBlur={(e) => {
                        handleChangeCompanyCompetitorsUrl(e.target.value);
                      }}
                    />
                  </InputWrapper>
                  <StyledButton
                    // @ts-ignore
                    // disabled={!isValid}
                    // @ts-ignore
                    width={'100%'}
                    onClick={() => {
                      generateCompetitorsMap();
                      // generateMap();
                      // generateMapNodes();
                    }}>
                    Generate Competitors Map
                    <AiIcons.AiOutlineSisternode
                      style={{
                        // @ts-ignore
                        color: theme.Text,
                      }}
                    />{' '}
                  </StyledButton>
                </>
              )}
            </MainContent>
          </div>
        </SignalsWrapper>
      </LeftSideWrapper>
      {/* <MarketMap /> */}
      {nodes.length > 0 && !mapMode && (
        <RightSideWrapper>
          <ListWrapper ref={ListRef}>
            <CardHeader>
              {/* @ts-ignore */}
              <CardIcon background='#455b72'>
                <AiIcons.AiOutlineOrderedList
                  style={{
                    color: '#5184e2',
                    transform: 'scale(1.55)',
                  }}></AiIcons.AiOutlineOrderedList>
              </CardIcon>
              <SubTitle style={{ paddingLeft: '1rem', paddingTop: '0.5rem' }}>
                Projects List
              </SubTitle>
            </CardHeader>
            <div
              style={{
                overflowY: 'auto',
                overflowX: 'hidden',
              }}>
              {nodes.map(
                (item: {
                  uuid: string;
                  title: string;
                  verticals: [];
                  tags: any;
                }) => {
                  return (
                    <ProjectItem
                      onClick={() => {
                        setSelectedProject(
                          item.title === selectedProject.title ? {} : item,
                        );
                        highlightNodeFromList(item.uuid);
                      }}>
                      {item.title}
                      <br />
                      <ProjectVerticals>
                        {item.verticals.join(', ')}
                      </ProjectVerticals>
                      <AboutParagraph>
                        {TruncatedString(item.about)}
                      </AboutParagraph>
                      <ProjectYear>
                        {
                          item.tags.find((item: any) => {
                            return item.title === 'founded';
                          })?.content
                        }
                      </ProjectYear>
                    </ProjectItem>
                  );
                },
              )}
            </div>
          </ListWrapper>
        </RightSideWrapper>
      )}
      {
        // @ts-ignore
        selectedProject.title && (
          <CenterWrapper>
            <SelectedProjectWrapper ref={CurrentProjectRef}>
              <CardHeaderCompany>
                {/* @ts-ignore */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                    marginLeft: '0.5rem',
                    paddingBottom: '0.2rem',
                    paddingTop: '0.2rem',
                  }}>
                  <CardIconCompany>
                    <div
                      style={{
                        padding: '0.23rem',
                        border: `1px solid ${theme.borderColor}`,
                        borderRadius: '3px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      {/* @ts-ignore */}
                      {selectedProject.logo ? (
                        <Logo
                          src={`${
                            // @ts-ignore
                            selectedProject.logo
                          }`}
                        />
                      ) : (
                        <PlaceholderLogo>N/A</PlaceholderLogo>
                      )}
                    </div>
                  </CardIconCompany>
                  <SubTitle>
                    {/* @ts-ignore */}
                    {selectedProject.title}
                  </SubTitle>
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    bottom: '0.33rem',
                    right: '0.5rem',
                  }}>
                  <OtherButton
                    title='About the project'
                    clicked={currentView === SectionType.ABOUT}
                    onClick={() => setCurrentView(SectionType.ABOUT)}>
                    <MdIcons.MdOutlineDescription title='About the project' />
                    Summary
                  </OtherButton>
                  <OtherButton
                    title='Signals timeline'
                    clicked={currentView === SectionType.TIMELINE}
                    onClick={() => setCurrentView(SectionType.TIMELINE)}>
                    <HiIcons.HiOutlineSignal title='Signals timeline' />
                    Timeline
                  </OtherButton>
                  <OtherButton onClick={() => setSelectedProject({})}>
                    ✖
                  </OtherButton>
                </div>
              </CardHeaderCompany>
              <div
                style={{
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  overflow: 'hidden',
                  padding: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}>
                {currentView === SectionType.ABOUT && (
                  <>
                    <div style={{ fontSize: '0.75rem' }}>
                      {selectedProject.about}
                    </div>
                    {/* @ts-ignore */}
                    <TableList data={selectedProject.tags}></TableList>
                    <div
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        justifyContent: 'space-between',
                      }}>
                      <div style={{ width: '100%' }}>
                        <SubTitle>{selectedProject.title} presence</SubTitle>
                        <div
                          style={{
                            marginTop: '0.3rem',
                            display: 'flex',
                            gap: '0.6rem',
                            overflowX: 'auto',
                            width: '91%',
                            maxWidth: '91%',
                            minWidth: '91%',
                          }}>
                          {selectedProject.website && (
                            <Button
                              variant='outlined'
                              size='small'
                              color='inherit'
                              href={selectedProject.website}
                              rel='noreferrer'
                              target='_blank'
                              sx={{
                                'borderColor': theme.borderColor,
                                'width': buttonSides,
                                'minWidth': buttonSides,
                                'height': buttonSides,
                                'borderRadius': '5px',
                                '& .MuiStyledButton-startIcon': { margin: 0 },
                              }}>
                              <LanguageIcon
                                fontSize='medium'
                                sx={{ transform: 'scale(1.1)' }}
                              />
                            </Button>
                          )}
                          {/* {selectedProject.socials.map((item: any) => {
                            return (
                              <Button
                                variant='outlined'
                                size='small'
                                color='inherit'
                                href={
                                  item.icon === 'email' ? 'mailto:' + item.url : item.url
                                }
                                rel='noreferrer'
                                target='_blank'
                                sx={{
                                  'borderColor': theme.borderColor,
                                  'minWidth': buttonSides,
                                  'height': buttonSides,
                                  'borderRadius': '5px',
                                  '& .MuiStyledButton-startIcon': { margin: 0 },
                                  'fontSize': '0.5rem',
                                }}
                              >
                                {item.icon ? logos[item.icon] : item.title}
                              </Button>
                            );
                          })} */}
                        </div>
                      </div>
                      {selectedProject.funds && (
                        <InvestorsList
                          funds={selectedProject.funds}
                          header={true}
                        />
                      )}
                    </div>
                  </>
                )}
                {currentView === SectionType.TIMELINE && (
                  <>
                    <h3>Signals Timeline</h3>
                    <div style={{ height: '5.5rem', marginBottom: '3rem' }}>
                      <TimeLine
                        uuid={selectedProject.uuid}
                        access_token={access_token}
                      />
                    </div>
                  </>
                )}
              </div>
            </SelectedProjectWrapper>
          </CenterWrapper>
        )
      }
      {nodes.length === 0 && !isLoading ? (
        <h3
          style={{
            opacity: 0.12,
            fontSize: '64px',
            position: 'absolute',
            left: '50%',
            top: '46%',
            transform: 'translate(-50%,-50%)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            pointerEvents: 'none',
          }}>
          {!mapMode ? 'TwoTensor' : 'TwoTensor'}
          {!mapMode ? (
            <span style={{ fontSize: '36px', pointerEvents: 'none' }}></span>
          ) : (
            <span style={{ fontSize: '44px', pointerEvents: 'none' }}>
              COMPETITORS SEARCH
            </span>
          )}
        </h3>
      ) : (
        <h3
          style={{
            opacity: 0.11,
            fontSize: '64px',
            position: 'absolute',
            left: '50%',
            top: '46%',
            transform: 'translate(-50%,-50%)',
          }}>
          TWOTENSOR.COM
        </h3>
      )}
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.65rem',
            flexDirection: 'column',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}>
          <Oval
            height={150}
            width={150}
            color={theme.subTitle}
            wrapperStyle={{}}
            wrapperClass=''
            visible={true}
            ariaLabel='oval-loading'
            secondaryColor={theme.subTitle}
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
          {loadingStatus && loadingStatus}
        </div>
      )}
      {graphData && !mapMode && (
        <MarketMap
          showSignals={showSignals}
          data={graphData}
          hoverNode={hoverNode}
          highlightNodes={highlightNodes}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          handleNodeClick={handleNodeClick}
          showFundsOnly={showFundsOnly}
          highlightLinks={highlightLinks}
        />
      )}
      {competitorsData && mapMode && (
        <CompetitorsMap
          showSignals={showSignals}
          data={competitorsData}
          hoverNode={hoverNode}
          highlightNodes={highlightNodes}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          handleNodeClick={handleNodeClick}
          showFundsOnly={showFundsOnly}
          highlightLinks={highlightLinks}
        />
      )}
    </div>
  );
};
const ProjectVerticals = styled.span`
  font-size: 0.6rem;
  width: 95%;
  margin-top: 0.15rem;
  color: ${({ theme }) => theme.subText};
  margin-bottom: 0.38rem;
  display: flex;
  flex-wrap: wrap;
`;

const fadeIn = keyframes`
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  `;

const StyledAsyncSelect = styled(AsyncSelect)`
  flex-grow: 1;
  border: none;
`;

const HelpButton = styled.div`
  border: 0px solid ${({ theme }) => theme.borderColor};
  animation: ${fadeIn} 0.5s ease-in-out forwards;
  z-index: 999;
  width: 0.9rem;
  height: 0.9rem;
  right: 0.5rem;
  bottom: 0.33rem;
  padding: 0.3rem;
  text-align: center;
  /* margin-left: 23.5rem; */
  display: flex;
  justify-content: center;
  font-weight: 500;
  align-items: center;
  border-radius: 5px;
  cursor: pointer;
  position: absolute;
`;
const OtherButton = styled.div`
  border: 0px solid ${({ theme }) => theme.borderColor};
  background: ${({ clicked, theme }) => (clicked ? theme.body : '')};
  animation: ${fadeIn} 0.5s ease-in-out forwards;
  z-index: 999;
  /* width: 0.9rem; */
  /* height: 0.9rem; */
  font-size: 14px;
  right: 0.5rem;
  gap: 0.3rem;
  bottom: 0.33rem;
  padding: 0.3rem;
  text-align: center;
  /* margin-left: 23.5rem; */
  display: flex;
  justify-content: center;
  font-weight: 500;
  align-items: center;
  border-radius: 5px;
  cursor: pointer;
`;

const SelectedProjectWrapper = styled.div`
  width: 37rem;
  background: ${({ theme }) => theme.background};
  min-height: 16.4rem;
  max-height: 16.4rem;
  /* position: fixed; */
  border-radius: 5px;
  overflow-x: hidden;
  overflow-y: auto;
  pointer-events: all;
  z-index: 999;
  border: 0px solid ${({ theme }) => theme.borderColor};
  opacity: 0.8;
  overflow-x: hidden;
  opacity: 0;
  margin-bottom: 1rem;
  animation: ${fadeIn} 0.5s ease-in-out forwards;
`;

const ProjectYear = styled.span`
  font-size: 0.65rem;
  color: ${({ theme }) => theme.subText};
  position: absolute;
  right: 0.8rem;
  bottom: 0rem;
`;

const PlaceholderLogo = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  background: ${({ theme }) => theme.background};
  text-align: center;
  color: ${({ theme }) => theme.text};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
`;

const Tab = styled.div`
  cursor: pointer;
  color: ${({ theme, active }) => (active ? 'theme.text' : theme.text)};
  position: relative;
  display: flex;
  /* min-width: 14rem; */
  width: 100%;
  position: relative;
  gap: 0.5rem;
  align-items: center;
  background-color: ${({ theme, active }) =>
    active ? theme.subButtonColorActive : theme.body};
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  border-radius: 5px;
  height: 1.4375em;
  padding: 8.5px 14px;
  /* padding: 0.65rem 1rem 0.625rem 1rem; */
`;

const ShortcutIndicator = styled.div`
  cursor: pointer;
  color: ${({ theme, active }) => theme.subText};
  display: flex;
  position: absolute;
  font-size: 0.8rem;
  align-items: center;
  justify-content: center;
  text-align: center;
  right: 1rem;
  /* background-color: ${({ theme, active }) =>
    active ? '#2a4862' : theme.searchBar}; */
  cursor: pointer;
  text-decoration: none;
  border: 0.8px solid ${({ theme, active }) => theme.buttonBorder};
  border-radius: 5px;
  height: 0.8em;
  padding: 5px 5px;
`;

const ShortcutIndicatorTab = styled.div`
  cursor: pointer;
  color: ${({ theme, active }) => theme.subText};
  display: flex;
  position: absolute;
  right: 1rem;
  font-size: 0.8rem;
  align-items: center;
  justify-content: center;
  text-align: center;
  /* background-color: ${({ theme, active }) =>
    active ? '#2a4862' : theme.searchBar}; */
  cursor: pointer;
  text-decoration: none;
  border: 0.8px solid ${({ theme, active }) => theme.buttonBorder};
  border-radius: 5px;
  height: 0.8em;
  padding: 5px 5px;
`;

const GuideWrapper = styled.div`
  width: 19.5rem;
  background: ${({ theme }) => theme.background};
  height: 26%;
  max-height: 18.5rem;
  /* height: 35%; */
  border-radius: 5px;
  overflow-x: hidden;
  overflow-y: auto;
  margin-left: 25rem;
  margin-top: 1rem;
  z-index: 999;
  border: 0px solid ${({ theme }) => theme.borderColor};
  opacity: 0.8;
  position: fixed;
  opacity: 0;
  animation: ${fadeIn} 0.5s ease-in-out forwards;
  overflow-x: hidden;
`;

const AboutParagraph = styled.p`
  font-size: 12.6px;
  line-height: 15px;
`;

const Logo = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  background: #dedede;
  border: 1px solid ${({ theme }) => theme.borderColor};
`;

const LeftSideWrapper = styled.div`
  height: 100%;
  gap: 1rem;
  position: absolute;
  /* top: 80rem; */
  width: auto;
  /* left: 7.5rem; */
  margin-left: 1.5rem;
  justify-content: space-between;
  display: flex;
  flex-direction: column;
`;

const ForbiddenTab = styled.div`
  color: ${({ theme, active }) => (active ? 'theme.text' : theme.text)};
  position: relative;
  display: flex;
  /* min-width: 14rem; */
  width: 100%;
  position: relative;
  gap: 0.5rem;
  align-items: center;
  background-color: ${({ theme, active }) =>
    active ? theme.subButtonColorActive : theme.body};
  text-align: center;
  cursor: not-allowed;
  text-decoration: none;
  border-radius: 5px;
  height: 1.4375em;
  padding: 8.5px 14px;
  /* padding: 0.65rem 1rem 0.625rem 1rem; */
`;

const CenterWrapper = styled.div`
  gap: 1rem;
  height: 100%;
  z-index: 99999;
  pointer-events: none;
  position: absolute;
  display: flex;
  align-items: flex-end;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  /* top: 80rem; */
  /* left: 7.5rem; */
`;

const RightSideWrapper = styled.div`
  height: 100%;
  position: absolute;
  /* top: 80rem; */
  right: 1.5rem;
  width: auto;
  display: flex;
  flex-direction: column;
`;

const StyledButton = styled.button`
  background: ${({ theme }) => theme.subBackground};
  border: 0px solid ${({ theme }) => theme.borderColor};
  color: ${({ theme }) => theme.text};
  padding: 0.4rem;
  width: ${({ width }) => width};
  display: flex;
  border-radius: 5px;
  align-items: center;
  gap: 0.4rem;
  justify-content: center;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  transition: all 0.2s ease;
  &:hover {
    background: #8d69083e;
    transform: ${({ disabled }) => (disabled ? 'scale(1)' : 'scale(1.05)')};
  }
  &:active {
    background: #ff4c4c;
    transform: scale(0.97);
  }
`;

const ProjectItem = styled.div`
  width: 96%;
  min-height: 3rem;
  padding: 0.65rem;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  position: relative;
  transition: all 0.2s ease;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.body};
  }
  &:active {
    background: #ff4c4c62;
    transform: scale(1.01);
  }
`;

const StyledLabel = styled.label`
  font-size: 0.8rem;
`;

const HintLabel = styled.label`
  font-size: 0.75rem;
  font-style: italic;
  opacity: 0.65;
`;

const SubLabel = styled.span`
  display: block;
  color: ${({ theme }) => theme.subText};
  font-size: 0.65rem;
  padding-bottom: 0.1rem;
`;

const InputWrapper = styled.div`
  width: 100%;
  padding-top: 0.2rem;
  display: flex;
  gap: 1rem;
`;

const SignalsWrapper = styled.div`
  width: 22.5rem;
  background: ${({ theme }) => theme.background};
  /* height: 35%; */
  border-radius: 5px;
  /* max-height: 30rem; */
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 100%;
  margin-top: 1rem;
  margin-bottom: 1rem;
  z-index: 999;
  border: 0px solid ${({ theme }) => theme.borderColor};
  opacity: 0.8;
  /* position: fixed; */
  opacity: 0;
  animation: ${fadeIn} 0.5s ease-in-out forwards;
  overflow-x: hidden;
`;
const LegendWrapper = styled.div`
  width: 22.5rem;
  background: ${({ theme }) => theme.background};
  min-height: 16.4rem;
  max-height: 16.4rem;
  border-radius: 5px;
  margin-bottom: 1rem;
  overflow-x: hidden;
  overflow-y: auto;
  z-index: 999;
  border: 0px solid ${({ theme }) => theme.borderColor};
  opacity: 0.8;
  /* position: fixed; */
  opacity: 0;
  animation: ${fadeIn} 0.5s ease-in-out forwards;
  overflow-x: hidden;
`;
const ListWrapper = styled.div`
  width: 22.5rem;
  background: ${({ theme }) => theme.background};
  max-height: 100%;
  margin-top: 1rem;
  margin-bottom: 1rem;
  border-radius: 5px;
  overflow-x: hidden;
  overflow-y: auto;
  margin-top: 1rem;
  z-index: 999;
  border: 0px solid ${({ theme }) => theme.borderColor};
  opacity: 0.8;
  overflow-x: hidden;
  opacity: 0;
  animation: ${fadeIn} 0.5s ease-in-out forwards;
`;

const StyledInput = styled.input`
  border: 0px solid ${({ theme }) => theme.borderColor};
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.subText};
  padding: 0.5rem;
  border-radius: 5px;
  width: ${({ fullSize }) => (fullSize ? '100%' : '8.6rem')};
`;

const SubHeader = styled.div`
  width: 100%;
  height: 1.5rem;
  background: ${({ theme }) => theme.body};
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  border-top: 1px solid ${({ theme }) => theme.borderColor};
  display: flex;
  font-size: 0.9rem;
  align-items: center;
  margin-bottom: 0.3rem;
  margin-top: 0.3rem;
`;

const CardIcon = styled.div`
  background: ${
    //@ts-ignore
    ({ background }) => background
  };
  width: 2.5rem;
  padding: 0.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const CardIconCompany = styled.div`
  background: ${
    //@ts-ignore
    ({ background }) => background
  };
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CardHeader = styled.div`
  min-height: 2.35rem;
  display: flex;
  position: relative;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
`;
const CardHeaderCompany = styled.div`
  min-height: 2.35rem;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
`;

const SubTitle = styled.h2`
  color: ${({ theme }) => theme.text};
  position: relative;
  font-size: 14px;
  line-height: 1.3;
  font-weight: 400;
`;

const MainContentLegend = styled.div`
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;
const MainContent = styled.div`
  padding: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
export default GranularSearch;

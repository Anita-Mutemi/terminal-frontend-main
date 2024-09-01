// @ts-nocheck
import {
  React,
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect,
  useContext,
} from 'react';
import DashboardContext from '../hooks/DashboardContext';
import { Oval } from 'react-loader-spinner';
import { postFeedback } from '../features/feed/feedActions';
import Comment from '../UI/Comment';
import styled, { useTheme } from 'styled-components';
import FeedBack from '../components/FeedBack';
import ForceGraph2D from 'react-force-graph-2d';
import { useSelector } from 'react-redux';
import { TabPanel } from '../components/Project/Panel';
import * as THREE from 'three';
import TableList from '../UI/TableList';
import { useDispatch } from 'react-redux';
import Rating from '../components/Rating';
import ForceGraph3D from 'react-force-graph-3d';
import axios from 'axios';
import * as FaIcons from 'react-icons/fa';
import * as RiIcons from 'react-icons/ri';
import * as BiIcons from 'react-icons/bi';
import { useOutletContext } from 'react-router-dom';
import LanguageIcon from '@mui/icons-material/Language';
import { postRating } from '../features/feed/feedActions';
import Contact from './Contact';
import Button from '@mui/material/Button';
import { ReactComponent as Crunchbase } from '../assets/crunchbase.svg';
import { ReactComponent as Email } from '../assets/email.svg';
import { ReactComponent as Twitter } from '../assets/twitter.svg';
import { ReactComponent as LinkedIn } from '../assets/linkedin.svg';
import { ReactComponent as LinkedInOwner } from '../assets/linkedinowner.svg';
import { ReactComponent as Pitchbook } from '../assets/pitchbook.svg';
import { Link } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';

import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

const Graph = ({
  setcurrentProject,
  nodes,
  projects,
  currentNode,
  started,
  setStarted,
  setNodes,
  setProjects,
  setLoading,
  loading,
  access_token,
}) => {
  const fgRef = useRef();
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [cameraManipulated, setCameraManipulated] = useState(false);
  const [hoverNode, setHoverNode] = useState(null);
  const [engineStopped, setEngineStopped] = useState(false);
  const theme = useTheme();
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  // Resize handler function
  const handleResize = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  // Set up event listener for window resize
  useEffect(() => {
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const fetchNodes = useCallback(async () => {
    setLoading(true);
    if (access_token) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        };
        const { data } = await axios.get(`/v1/graph`, config);

        const coloredNodes = data.nodes
          .map((node) => {
            if (!!node.object_data.project) {
              node.color =
                node.object_data.project_user_info &&
                node.object_data.project_user_info.archived
                  ? node.color
                  : 'green';
            }
            return node;
          })
          .sort((a, b) => {
            if (
              a.object_data.project_user_info &&
              a.object_data.project_user_info.archived !== undefined
            ) {
              if (
                b.object_data.project_user_info &&
                b.object_data.project_user_info.archived !== undefined
              ) {
                return (
                  a.object_data.project_user_info.archived -
                  b.object_data.project_user_info.archived
                );
              } else {
                return -1;
              }
            } else {
              return 1;
            }
          });
        data.nodes = coloredNodes;
        setProjects(data.nodes.filter((node) => !!node.object_data.project));
        setcurrentProject(data.nodes.filter((node) => !!node.object_data.project)[0]);
        setNodes(data);
        return data;
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  }, [access_token, setcurrentProject, setLoading, setNodes, setProjects]);

  const distance = 450;

  const updateHighlight = () => {
    setHighlightNodes(highlightNodes);
    setHighlightLinks(highlightLinks);
  };

  useEffect(() => {
    fetchNodes();
    return () => {
      setcurrentProject({});
      setNodes([]);
      setProjects([]);
      setStarted(false);
      setLoading(true);
    };
  }, [fetchNodes, setcurrentProject, setLoading, setNodes, setProjects, setStarted]);

  useEffect(() => {
    if (started) {
      if (projects && projects.length > 0 && currentNode !== null) {
        const node = projects[currentNode];
        const distance = 150;
        const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

        fgRef.current.cameraPosition(
          { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
          node, // lookAt ({ x, y, z })
          3000, // ms transition duration
        );
      }
    }
  }, [currentNode, projects, fgRef, started, loading, engineStopped]); // Add currentNode to the dependency array
  useEffect(() => {
    if (!started && !loading && fgRef.current && !cameraManipulated) {
      // Set initial camera position
      fgRef.current.cameraPosition({ z: distance });

      // Set up camera orbit
      let angle = 0;
      const interval = setInterval(() => {
        if (cameraManipulated) clearInterval(interval);
        else if (fgRef.current) {
          fgRef.current.cameraPosition({
            x: distance * Math.sin(angle),
            z: distance * Math.cos(angle),
          });
          angle += Math.PI / 3000;
        }
      }, 10);

      // Cleanup the interval when the component is unmounted
      return () => clearInterval(interval);
    }
  }, [started, loading, fgRef, cameraManipulated]);

  const handleLinkHover = (link) => {
    highlightNodes.clear();
    highlightLinks.clear();

    if (link) {
      highlightLinks.add(link);
      highlightNodes.add(link.source);
      highlightNodes.add(link.target);
    }

    updateHighlight();
  };

  const extraRenderers = [new CSS2DRenderer()];

  return (
    <div style={{ width: '30rem', height: '30rem' }}>
      {loading ? (
        <Oval
          height={60}
          width={60}
          color={theme.text}
          wrapperStyle={{}}
          wrapperClass=''
          visible={true}
          ariaLabel='oval-loading'
          secondaryColor={theme.subTitle}
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      ) : (
        <ForceGraph3D
          ref={fgRef}
          extraRenderers={extraRenderers}
          graphData={nodes}
          nodeAutoColorBy='group'
          width={width}
          height={height}
          nodeRelSize={7}
          d3ForceLink={{ distance: 2000 }} // Increase this value to make links longer
          d3ForceManyBody={{ strength: -500 }}
          // width={'15rem'}
          showNavInfo={false}
          backgroundColor={theme.nodesBackground}
          onNodeDragStart={() => setCameraManipulated(true)}
          // onZoomStart={() => setCameraManipulated(true)}
          onRotateStart={() => setCameraManipulated(true)}
          enableNodeDrag={!cameraManipulated}
          enableNavigationControls={!cameraManipulated}
          nodeThreeObject={(node) => {
            const nodeEl = document.createElement('div');
            nodeEl.textContent = node.object_data?.project
              ? node.object_data?.project.title
              : node.object_data.name;
            nodeEl.style.color = theme.text;
            nodeEl.style.opacity = 1;
            nodeEl.className = 'node-label';
            return new CSS2DObject(nodeEl);
          }}
          linkDirectionalArrowLength={3.5}
          linkDirectionalArrowRelPos={1}
          linkThreeObject={(link) => {
            // Create a line geometry
            const geometry = new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(link.source.x, link.source.y, link.source.z),
              new THREE.Vector3(link.target.x, link.target.y, link.target.z),
            ]);

            // Create a custom material with a color based on the link's property
            const material = new THREE.LineBasicMaterial({
              color: link.customColor || theme.text, // Use the customColor property of the link, or fall back to red
            });

            // Create and return a line with the custom geometry and material
            return new THREE.Line(geometry, material);
          }}
          // linkCurvature={1}
          nodeThreeObjectExtend={true}
          onEngineStop={() => {
            setEngineStopped(true);
            setCameraManipulated(false);
          }}
          onRenderFrame={() => {
            setEngineStopped(true);
            setCameraManipulated(false);
          }}
          warmupTicks={50}
        />
      )}
    </div>
  );
};
const Graph2D = ({ project }) => {
  const data = useMemo(() => {
    const gData = {
      nodes: [
        { id: project.project.title, group: 1, color: '#6cb5c2' },
        ...project.project.funds.map((fund) => {
          return { id: fund.name, group: 2, color: '#e85e51' };
        }),
      ],
      links: [
        ...project.project.funds.map((fund) => {
          return { source: fund.name, target: project.project.title };
        }),
      ],
    };

    // const gData = genRandomTree(80);

    // cross-link node objects
    // gData.links.forEach((link) => {
    //   const a = gData.nodes[link.source];
    //   const b = gData.nodes[link.target];
    //   !a.neighbors && (a.neighbors = []);
    //   !b.neighbors && (b.neighbors = []);
    //   a.neighbors.push(b);
    //   b.neighbors.push(a);

    //   !a.links && (a.links = []);
    //   !b.links && (b.links = []);
    //   a.links.push(link);
    //   b.links.push(link);
    // });

    return gData;
  }, [project]);

  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const theme = useTheme();
  const [hoverNode, setHoverNode] = useState(null);

  const distance = 500;

  const NODE_R = 8;

  const updateHighlight = () => {
    setHighlightNodes(highlightNodes);
    setHighlightLinks(highlightLinks);
  };

  const handleNodeHover = (node) => {
    highlightNodes.clear();
    highlightLinks.clear();
    if (node) {
      highlightNodes.add(node);
      node.neighbors.forEach((neighbor) => highlightNodes.add(neighbor));
      node.links.forEach((link) => highlightLinks.add(link));
    }

    setHoverNode(node || null);
    updateHighlight();
  };

  const handleLinkHover = (link) => {
    highlightNodes.clear();
    highlightLinks.clear();

    if (link) {
      highlightLinks.add(link);
      highlightNodes.add(link.source);
      highlightNodes.add(link.target);
    }

    updateHighlight();
  };

  const fgRef = useRef();

  return (
    <div style={{ width: '20rem', height: '12rem', cursor: 'grabbing' }}>
      <ForceGraph2D
        graphData={data}
        nodeRelSize={1}
        width={391}
        height={183.8}
        autoPauseRedraw={false}
        backgroundColor={theme.body}
        nodeDistance={270}
        nodeAutoColorBy='group'
        linkDirectionalParticles={1}
        minZoom={1.5}
        maxZoom={10}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.id;
          const fontSize = 9 / globalScale;
          const textWidth = ctx.measureText(label).width;

          const bckgDimensions = [textWidth, fontSize].map((n) => n + fontSize * 0.35); // some padding

          ctx.beginPath();
          ctx.fillStyle = node.color; // replace with the desired color

          const nodeRadius = 8.5; // Set a constant node radius
          ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI); // Use the constant node radius
          ctx.fill();

          ctx.textBaseline = 'middle';
          ctx.textAlign = 'center';
          ctx.fillText(label, node.x, node.y);
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.fillRect(
            node.x - bckgDimensions[0] / 2,
            node.y - bckgDimensions[1] / 2,
            ...bckgDimensions,
          );
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = 'white';
          ctx.fillText(label, node.x, node.y);
        }}
        linkColor={() => theme.text}
      />
    </div>
  );
};
function a11yProps(index: number) {
  return {
    'id': `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Nodes = () => {
  const {
    // @ts-ignore
    nodesProps: {
      started,
      setStarted,
      startButtonRef,
      nextButtonRef,
      previousButtonRef,
      triggerPopUp,
    },
  } = useContext(DashboardContext);
  const [currentNode, setCurrentNode] = useState(0);
  const theme = useTheme();
  const props = useOutletContext();
  const [value, setValue] = useState(0);
  const [currentProject, setcurrentProject] = useState();
  const [loading, setLoading] = useState(true);
  const [nodes, setNodes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [feedback, setFeedback] = useState<Feedback>('');

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const { error, userInfo, access_token } = useSelector((state: any) => state.user);

  const mockData = [
    { title: 'location', content: 'San Francisco' },
    { title: 'stage', content: 'pre-seed' },
    { title: 'team size', content: '84' },
    { title: 'funding', content: '$15,000,000' },
    { title: 'last round', content: '$15,000,000' },
  ];

  const getFeedback = useCallback(
    async (access_token) => {
      if (access_token) {
        try {
          // get user data from store
          // configure authorization header with user's token
          const config = {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          };
          const { data } = await axios.get(
            `/v1/projects/${currentProject.object_data.project.uuid}/comments`,
            config,
          );
          setFeedback(data);
          return data;
        } catch (error: any) {
          setFeedback('error');
          console.log(error);
        }
      }
    },
    [currentProject],
  );

  useEffect(() => {
    if (currentProject) {
      getFeedback(access_token);
    }
  }, [access_token, currentProject, getFeedback]);

  const renderFeedback = () => {
    if (feedback['comments']) {
      if (feedback?.comments.length > 0 && feedback !== 'error') {
        return feedback.comments.map((review) => {
          return <Comment data={review} />;
        });
      }
      if (feedback.comments.length === 0) {
        return <h3>No feedback has been provided yet.</h3>;
      }
    }
    if (
      feedback['detail'] ===
      'team comments can only be viewed after the user submits feedback'
    ) {
      return <h5>Team feeback can only be viewed after you submit your feedback</h5>;
    }
    if (feedback === 'error') {
      return <h5>Something went wrong, please notify our team about it.</h5>;
    }
    if (feedback === '') {
      return (
        <Oval
          height={60}
          width={60}
          color='#484848'
          wrapperStyle={{}}
          wrapperClass=''
          visible={true}
          ariaLabel='oval-loading'
          secondaryColor='#222222'
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      );
    }
  };

  const dispatch = useDispatch();

  const FlyToNextProject = useCallback(() => {
    setCurrentNode((prev) => {
      let newNode;
      if (prev >= projects.length - 1) {
        newNode = 0;
      } else {
        newNode = prev + 1;
      }
      setcurrentProject(projects[newNode]);
      return newNode;
    });
  }, [projects]);
  const FlyToPreviousProject = useCallback(() => {
    setCurrentNode((prev) => {
      let newNode;
      if (prev <= 0) {
        newNode = projects.length - 1;
      } else {
        newNode = prev - 1;
      }
      setcurrentProject(projects[newNode]);
      return newNode;
    });
  }, [projects]);
  const startNodes = useCallback(() => {
    setStarted(true);
  }, [setStarted]);

  useEffect(() => {
    if (projects.length > 0) {
      if (nextButtonRef.current) {
        nextButtonRef.current.addEventListener('click', FlyToNextProject);
      }
      if (previousButtonRef.current) {
        previousButtonRef.current.addEventListener('click', FlyToPreviousProject);
      }

      if (startButtonRef.current) {
        startButtonRef.current.innerText = 'Explore signals';
        startButtonRef.current.addEventListener('click', startNodes);
      }
    } else {
      if (startButtonRef.current) {
        startButtonRef.current.innerText =
          'Network is not available, wait for the next release';
        startButtonRef.current.style.cursorPointer = 'not-allowed';
      }
    }

    return () => {
      if (nextButtonRef.current) {
        nextButtonRef.current.removeEventListener('click', FlyToNextProject);
      }
      if (startButtonRef.current) {
        startButtonRef.current.removeEventListener('click', startNodes);
      }
      if (previousButtonRef.current) {
        previousButtonRef.current.removeEventListener('click', FlyToPreviousProject);
      }
    };
  }, [
    nextButtonRef,
    nodes,
    currentProject,
    startButtonRef,
    startNodes,
    previousButtonRef,
    FlyToNextProject,
    FlyToPreviousProject,
    projects.length,
  ]);
  const buttonSides = 44;
  useEffect(() => {}, [projects, startButtonRef]);

  const logos = {
    crunchbase: <Crunchbase fill={theme.iconColor} style={{ fill: theme.iconColor }} />,
    email: <Email fill={theme.iconColor} style={{ fill: theme.iconColor }} />,
    twitter: <Twitter fill={theme.iconColor} style={{ fill: theme.iconColor }} />,
    linkedin: <LinkedIn fill={theme.iconColor} style={{ fill: theme.iconColor }} />,
    linkedinowner: (
      <LinkedInOwner fill={theme.iconColor} style={{ fill: theme.iconColor }} />
    ),
    pitchbook: <Pitchbook fill={theme.iconColor} style={{ fill: theme.iconColor }} />,
  };

  const [isModal, setIsModal] = useState(false);

  const postFeedbackHandler = (newValue: number | number[]) => {
    const id = currentProject.object_data.project.uuid;
    dispatch(postFeedback({ id, value: newValue }));
    triggerPopUp(true);
    setIsModal(false);
    handleCommentExpand('');
  };

  const ratingChange = (event: Event, newValue: number | number[]) => {
    const id = currentProject.object_data.project.uuid;
    if (newValue !== 0) {
      setIsModal(true);
    }
    //@ts-ignore
    dispatch(postRating({ id, value: newValue }));
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundColor: theme.body,
      }}
    >
      {started ? (
        <>
          <FeedBack
            postFeedback={postFeedbackHandler}
            show={isModal}
            text={
              currentProject.object_data.project_user_info
                ? currentProject.object_data.project_user_info.feedback ?? ''
                : ''
            }
            handleClose={() => setIsModal(false)}
            title={currentProject.object_data.project.title}
          />
          <InfoWrapper>
            {!loading ? (
              <>
                <MainHeader>
                  <div
                    style={{
                      height: '100%',
                      display: 'flex',
                      width: '93%',
                      marginBottom: '0rem',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <HeaderContentWrapper>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: '0.7rem',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '0.3rem',
                            gap: '0.7rem',
                            border: `1px solid ${theme.borderColor}`,
                            borderRadius: '5.5px',
                          }}
                        >
                          {currentProject.object_data.project.logo ? (
                            <Logo src={currentProject.object_data.project.logo} />
                          ) : (
                            <PlaceholderLogo>N/A</PlaceholderLogo>
                          )}
                        </div>
                        <div>
                          <ProjectName>
                            {currentProject.object_data.project.title}
                          </ProjectName>
                          <ProjectLocation>
                            {currentProject.object_data.project.verticals
                              ? currentProject.object_data.project.verticals.join(', ')
                              : 'not specified'}
                          </ProjectLocation>
                        </div>
                      </div>
                    </HeaderContentWrapper>
                    <Rate>
                      {/* !info.project_user_info.archived */}
                      {currentProject.object_data.project_user_info &&
                        !currentProject.object_data.project_user_info.archived && (
                          <Chip
                            label='NEW'
                            color='success'
                            variant='outlined'
                            sx={{
                              background:
                                props.isDarkMode !== 'light'
                                  ? theme.chipIndicator
                                  : 'none',
                              border: `1px solid ${theme.chipIndicator}`,
                              color: theme.chipIndicatorText,
                              borderRadius: '5.5px',
                            }}
                          />
                        )}
                      {/* {info.project?.markdown_description?.length > 0 && (
                <Link
                  to={`/terminal/project/${'test'}`}
                  style={{ textDecoration: 'none' }}
                >
                  <Chip
                    label='DEEP DIVE'
                    color='secondary'
                    variant='outlined'
                    sx={{
                      'background': 'black',
                      'color': 'white',
                      'borderRadius': '5.5px',
                      'border': 'none',
                      'fontSize': '12px',
                      'cursor': 'pointer',
                      'transition': 'all 0.1s linear',
                      '&:hover': {
                        transform: 'scale(1.02)',
                      },
                    }}
                  />
                </Link>
              )} */}
                      {/* !info.project?.markdown_description?.length > 0 */}
                    </Rate>
                  </div>
                </MainHeader>
                <DescriptionMain>
                  <DescriptionWrapper>
                    <SubTitle>
                      What is <br /> {currentProject.object_data.project.title}
                    </SubTitle>
                    <DescriptionText>
                      {currentProject.object_data.project.about}
                    </DescriptionText>
                    <SubTitle>Tags</SubTitle>
                    <TableList data={currentProject.object_data.project.tags}></TableList>
                    <SubTitle>
                      {currentProject.object_data.project.title} presence
                    </SubTitle>
                    <div
                      style={{
                        display: 'flex',
                        gap: '0.6rem',
                        overflowX: 'auto',
                        width: '91%',
                        maxWidth: '91%',
                        minWidth: '91%',
                      }}
                    >
                      {true && (
                        <Button
                          variant='outlined'
                          size='small'
                          color='inherit'
                          // href={info.project.website}
                          rel='noreferrer'
                          target='_blank'
                          sx={{
                            'borderColor': theme.borderColor,
                            'width': buttonSides,
                            'minWidth': buttonSides,
                            'height': buttonSides,
                            'borderRadius': '5px',
                            '& .MuiButton-startIcon': { margin: 0 },
                          }}
                        >
                          <LanguageIcon
                            fontSize='medium'
                            sx={{ transform: 'scale(1.1)' }}
                          />
                        </Button>
                      )}
                      {currentProject.object_data.project.socials.map((item: any) => {
                        return (
                          <Button
                            variant='outlined'
                            size='small'
                            color='inherit'
                            href={item.icon === 'email' ? 'mailto:' + item.url : item.url}
                            rel='noreferrer'
                            target='_blank'
                            sx={{
                              'borderColor': theme.borderColor,
                              'minWidth': buttonSides,
                              'height': buttonSides,
                              'borderRadius': '5px',
                              '& .MuiButton-startIcon': { margin: 0 },
                              'fontSize': '0.6rem',
                            }}
                          >
                            {item.icon ? logos[item.icon] : item.title}
                          </Button>
                        );
                      })}
                    </div>
                  </DescriptionWrapper>
                </DescriptionMain>{' '}
              </>
            ) : (
              'loading...'
            )}
          </InfoWrapper>
        </>
      ) : (
        <></>
      )}

      {started ? (
        <SignalsWrapper>
          {!loading ? (
            <>
              <CardHeader>
                <CardIcon background='#72454B'>
                  <RiIcons.RiNodeTree
                    style={{ color: '#E25D51', transform: 'scale(1.55)' }}
                  ></RiIcons.RiNodeTree>
                </CardIcon>
                <SubTitle style={{ paddingLeft: '1rem', paddingTop: '0.5rem' }}>
                  {currentProject.object_data.project.title} signals
                </SubTitle>
              </CardHeader>
              <div style={{ width: '10rem', height: '10rem' }}>
                <Graph2D project={currentProject.object_data} />
              </div>
            </>
          ) : (
            <Oval
              height={30}
              width={30}
              color={theme.text}
              wrapperStyle={{}}
              wrapperClass=''
              visible={true}
              ariaLabel='oval-loading'
              secondaryColor={theme.subTitle}
              strokeWidth={2}
              strokeWidthSecondary={2}
            />
          )}
        </SignalsWrapper>
      ) : (
        <></>
      )}
      {started ? (
        <FeedBackWrapper>
          <CardHeader>
            <CardIcon background='#2d7643'>
              <BiIcons.BiCommentCheck
                style={{ color: '#6ac665', transform: 'scale(1.55)' }}
              ></BiIcons.BiCommentCheck>
            </CardIcon>
            <span style={{ paddingLeft: '0.8rem', paddingTop: '0.55rem' }}>
              Your feedback
            </span>
          </CardHeader>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '0.5rem',
              marginBottom: '0.5rem',
            }}
          >
            <Rating
              value={
                currentProject.object_data.project_user_info
                  ? currentProject.object_data.project_user_info.rating
                  : 0
              }
              id={currentProject.object_data.project.uuid}
              handler={ratingChange}
            />
          </Box>
        </FeedBackWrapper>
      ) : (
        <></>
      )}
      {started ? (
        <ActionsWrapper>
          <CardHeader>
            <CardIcon background='#2d5476'>
              <FaIcons.FaGlobeAsia
                style={{ color: '#659DC6', transform: 'scale(1.55)' }}
              ></FaIcons.FaGlobeAsia>
            </CardIcon>
            <Tabs
              value={value}
              onChange={handleChange}
              style={{ height: '40px', minHeight: '0px', overflow: 'hidden' }}
              TabIndicatorProps={{
                sx: { top: '2.6rem', height: '1.9px', background: theme.actionable },
              }}
              sx={{
                alignItems: 'center',
                paddingLeft: '1.5rem',
                overflowY: 'auto',
              }}
            >
              <Tab
                label='Actions'
                {...a11yProps(0)}
                sx={{
                  'fontSize': '0.9rem',
                  'textTransform': 'capitalize',
                  'padding': '0rem',
                  'height:': '0.2rem',
                  'color': theme.text,
                  // '&.MuiTabs-root': {
                  //   minHeight: '0rem',
                  //   height: '0.1rem',
                  // },
                  '&.Mui-selected': {
                    color: theme.actionable,
                  },
                }}
              />
              <Tab
                label="Team's feedback"
                {...a11yProps(1)}
                onClick={() => getFeedback(access_token)}
                sx={{
                  'height': '100%',
                  'fontSize': '0.8rem',
                  'padding': '0rem',
                  'textTransform': 'capitalize',
                  'overflowY': 'auto',
                  'color': theme.text,
                  '&.Mui-selected': {
                    color: theme.actionable,
                  },
                }}
              />
            </Tabs>
          </CardHeader>
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              width: '100%',
              padding: '0.5rem',
            }}
          >
            <TabPanel
              value={value}
              index={0}
              sx={{
                padding: '0rem',
                margin: '0rem',
                background: 'red',
                height: '100%',
                overflowY: 'auto',
              }}
            >
              <div style={{ paddingTop: '1rem' }}>
                <Contact
                  id={currentProject.object_data.project.uuid}
                  access_token={access_token}
                  userInfo={userInfo}
                  company={currentProject.object_data.project.title}
                />
              </div>
            </TabPanel>
            <TabPanel
              value={value}
              index={1}
              sx={{
                padding: '0rem',
                background: 'red',
                overflowY: 'auto',
              }}
            >
              <CommentsSection>{renderFeedback()}</CommentsSection>
            </TabPanel>
          </div>
        </ActionsWrapper>
      ) : (
        <></>
      )}
      <Graph
        setcurrentProject={setcurrentProject}
        nodes={nodes}
        setNodes={setNodes}
        setStarted={setStarted}
        setProjects={setProjects}
        setCurrentNode={setCurrentNode}
        currentNode={currentNode}
        started={started}
        setLoading={setLoading}
        projects={projects}
        loading={loading}
        access_token={access_token}
      />
    </div>
  );
};

const InfoWrapper = styled.div`
  width: 24.5rem;
  height: 29rem;
  background: ${({ theme }) => theme.background};
  border-radius: 5px;
  margin-left: 1.5rem;
  margin-top: 1.5rem;
  justify-content: space-between;
  gap: 0.5rem;
  z-index: 999;
  border: 1px solid ${({ theme }) => theme.borderColor};
  opacity: 0.8;
  position: fixed;
  overflow-y: auto;
`;
const SignalsWrapper = styled.div`
  width: 24.5rem;
  height: 14rem;
  background: ${({ theme }) => theme.background};
  border-radius: 5px;
  margin-left: 1.5rem;
  overflow: hidden;
  top: 39rem;
  z-index: 999;
  border: 1px solid ${({ theme }) => theme.borderColor};
  opacity: 0.8;
  position: fixed;
  overflow-x: hidden;
`;
const FeedBackWrapper = styled.div`
  width: 25rem;
  background: ${({ theme }) => theme.background};
  border-radius: 5px;
  right: 1.5rem;
  margin-top: 24rem;
  overflow-x: hidden;
  z-index: 999;
  border: 1px solid ${({ theme }) => theme.borderColor};
  opacity: 0.8;
  position: fixed;
`;
const DescriptionFooterWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  margin: 0rem 0rem 0.3rem 1.3rem;
  gap: 0.5rem;
  flex-direction: column;
`;

const CardIcon = styled.div`
  background: ${({ background }) => background};
  border-right: 1px solid ${({ theme }) => theme.borderColor};
  width: 2.5rem;
  padding: 0.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const CardHeader = styled.div`
  min-height: 2.35rem;
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
`;
const ActionsWrapper = styled.div`
  width: 25rem;
  height: 21.7rem;
  background: ${({ theme }) => theme.background};
  border-radius: 5px;
  right: 1.5rem;
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 1.5rem;
  z-index: 999;
  border: 1px solid ${({ theme }) => theme.borderColor};
  opacity: 0.8;
  position: fixed;
`;

const MainHeader = styled.div`
  width: 100%;
  height: 6rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
`;

const DescriptionMain = styled.div`
  width: 100%;
  display: flex;
  overflow-y: auto;
  justify-content: space-around;
`;

const HeaderContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.text};
  position: relative;
  font-size: 1.25em;
  font-weight: 400;
`;
const SubTitle = styled.h2`
  color: ${({ theme }) => theme.text};
  position: relative;
  font-size: 14px;
  line-height: 1.6;
  font-weight: 400;
`;
const CommentsSection = styled.div`
  display: flex;
  padding: 1rem;
  width: 96%;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  height: 90%;
`;
const DescriptionText = styled.p`
  color: ${({ theme }) => theme.subText};
  /* color: #58585b; */
  line-height: 1.5;
  position: relative;
  font-size: 12px;
`;
const Logo = styled.img`
  width: 2rem;
  height: 2rem;
  background: #dedede;
  /* border: 1px solid ${({ theme }) => theme.borderColor}; */
`;

const PlaceholderLogo = styled.div`
  width: 3rem;
  height: 3rem;
  background: ${({ theme }) => theme.background};
  text-align: center;
  color: ${({ theme }) => theme.text};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
`;

const Rate = styled.div`
  background-color: transparent;
  display: flex;
  gap: 0.3rem;
  font-size: 1.1rem;
`;

const ProjectName = styled.h1`
  font-size: 1.5rem;
  font-weight: 400;
`;

const ProjectLocation = styled.span`
  display: flex;
  width: 95%;
  color: ${({ theme }) => theme.subText};
  font-size: 0.65rem;
`;

const DescriptionBlock = styled.div`
  width: 40%;
  min-height: 20rem;
  padding-top: 1rem;
  border-radius: 5.5px;
  background: ${({ theme }) => theme.background};
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const DescriptionWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  margin: 0.5rem 1.3rem 1.3rem 1.3rem;
  gap: 0.7rem;
  justify-content: space-around;
  flex-direction: column;
`;

export default Nodes;

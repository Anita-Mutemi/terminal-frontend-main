/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
import React, { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import ForceGraph2D, { ForceGraphMethods, NodeObject } from 'react-force-graph-2d';
import { useTheme } from 'styled-components';
import { Oval } from 'react-loader-spinner';
interface NodeData {
  id: number;
  companySize: number;
  color?: string;
}

interface LinkData {
  source: number;
  target: number;
}

// const NODE_R = 11;

const MyGraph: React.FC = ({
  data,
  selectedProject,
  setSelectedProject,
  handleNodeClick,
  showFundsOnly,
  highlightNodes,
  showSignals,
  highlightLinks,
  showFundOnly,
  hoverNode,
}: any) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  // const [graphData, setGraphData] = useState(data);
  let graphData = data;
  const fgRef = useRef<ForceGraphMethods | null>(null);
  const theme = useTheme();
  useEffect(() => {
    fgRef.current?.d3Force('link').distance(112);
  }, [graphData]);

  graphData.nodes.forEach((item) => {
    item.size = Math.floor(Math.random() * 30) + 1;
  });

  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [isLoading, setIsLoading] = useState(true);

  const handleEngineStop = () => {
    setIsLoading(false);
  };

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

  // useEffect(() => {
  //   if (showSignals && !showFundsOnly) {
  //     graphData = data;
  //     return;
  //   }

  //   if (!showSignals && !showFundsOnly) {
  //     graphData.links = [];
  //     graphData.nodes = data.nodes.filter((node) => {
  //       // if project data doesn't exist, it's a company node and return me it to the array
  //       if (node.object_data.project) {
  //         return node;
  //       }
  //     });
  //     return;
  //   }

  //   if (showFundsOnly) {
  //     graphData.links = [];
  //     graphData.nodes = data.nodes.filter((node) => {
  //       // if project data doesn't exist, it's a company node and return me it to the array
  //       if (!node.object_data.project) {
  //         return node;
  //       }
  //     });
  //     return;
  //   }
  // }, [data, graphData.nodes, graphData.links, showSignals, showFundsOnly]);
  const [nodeDragging, setNodeDragging] = useState(false);
  const [coolDownTicks, setCoolDownTicks] = useState(500);
  const getNodeLabel = (node) => {
    return node.object_data.name ?? node.object_data.project.title;
  };

  useEffect(() => {
    setCoolDownTicks(500);
  }, [graphData]);

  const getNodeSize = useCallback((node) => {
    const baseSize = 10;
    const sizeMultiplier = 10; // adjust this value to control how much the size increases per companySize unit
    const fundingInfo = node.object_data.project
      ? node.object_data.project.tags.find((tag) => tag.title === 'funding')
        ? node.object_data.project.tags.find((tag) => tag.title === 'funding').content
        : '1'
      : '1';

    // function updateSize(fundingInfo) {
    //   const funding = removePunctuationAndCurrency(fundingInfo);
    //   const sizePer100k = 2;
    //   const hundredThousands = Math.floor(funding / 100000);
    //   let updatedSize = 10 + hundredThousands * sizePer100k;
    //   updatedSize = Math.min(updatedSize, 60);
    //   return updatedSize;
    // }

    function updateSize(fundingInfo) {
      const funding = removePunctuationAndCurrency(fundingInfo);
      let updatedSize = 8;
      if (funding >= 100000 && funding < 200000) {
        updatedSize = 12;
      } else if (funding >= 200000 && funding < 300000) {
        updatedSize = 14;
      } else if (funding >= 300000 && funding < 400000) {
        updatedSize = 16;
      } else if (funding >= 400000 && funding < 500000) {
        updatedSize = 20;
      } else if (funding >= 500000 && funding < 600000) {
        updatedSize = 21;
      } else if (funding >= 600000 && funding < 700000) {
        updatedSize = 22;
      } else if (funding >= 700000 && funding < 800000) {
        updatedSize = 24;
      } else if (funding >= 800000 && funding < 900000) {
        updatedSize = 26;
      } else if (funding >= 900000 && funding < 1000000) {
        updatedSize = 28;
      } else if (funding >= 1000000 && funding < 2000000) {
        updatedSize = 33;
      } else if (funding >= 2000000 && funding < 3000000) {
        updatedSize = 37;
      } else if (funding >= 3000000 && funding < 4000000) {
        updatedSize = 39;
      } else if (funding >= 4000000 && funding < 5000000) {
        updatedSize = 41;
      } else if (funding >= 5000000 && funding < 6000000) {
        updatedSize = 46;
      } else if (funding >= 6000000 && funding < 7000000) {
        updatedSize = 51;
      } else if (funding >= 7000000 && funding < 8000000) {
        updatedSize = 56;
      } else if (funding >= 8000000 && funding < 9000000) {
        updatedSize = 61;
      } else if (funding >= 9000000 && funding < 10000000) {
        updatedSize = 66;
      } else if (funding >= 10000000 && funding < 11000000) {
        updatedSize = 70;
      } else if (funding >= 11000000 && funding < 12000000) {
        updatedSize = 78;
      } else if (funding >= 12000000 && funding < 13000000) {
        updatedSize = 86;
      } else if (funding >= 13000000 && funding < 14000000) {
        updatedSize = 91;
      } else if (funding >= 14000000 && funding < 15000000) {
        updatedSize = 100;
      } else if (funding >= 15000000 && funding < 16000000) {
        updatedSize = 107;
      } else if (funding >= 16000000 && funding < 17000000) {
        updatedSize = 115;
      } else if (funding >= 17000000 && funding < 18000000) {
        updatedSize = 125;
      } else if (funding >= 18000000 && funding < 19000000) {
        updatedSize = 130;
      } else if (funding >= 19000000 && funding < 20000000) {
        updatedSize = 135;
      } else if (funding >= 20000000 && funding < 30000000) {
        updatedSize = 160;
      } else if (funding >= 30000000 && funding < 40000000) {
        updatedSize = 163;
      } else if (funding >= 40000000 && funding < 50000000) {
        updatedSize = 166;
      } else if (funding >= 50000000 && funding < 60000000) {
        updatedSize = 167;
      } else if (funding >= 60000000 && funding < 70000000) {
        updatedSize = 168;
      } else if (funding >= 70000000 && funding < 80000000) {
        updatedSize = 179;
      } else if (funding >= 80000000 && funding < 90000000) {
        updatedSize = 181;
      } else if (funding >= 90000000 && funding < 100000000) {
        updatedSize = 190;
      } else if (funding >= 100000000 && funding < 200000000) {
        updatedSize = 200;
      } else if (funding >= 200000000 && funding < 300000000) {
        updatedSize = 205;
      } else if (funding >= 300000000 && funding < 400000000) {
        updatedSize = 210;
      } else if (funding >= 400000000 && funding < 500000000) {
        updatedSize = 230;
      } else if (funding >= 500000000) {
        updatedSize = 250;
      }
      return updatedSize;
    }

    let funding = removePunctuationAndCurrency(fundingInfo);
    return updateSize(funding);
  }, []);

  const paintRing = useCallback(
    (node, ctx) => {
      const nodeSize = getNodeSize(node);
      if (highlightNodes.has(node) || node === hoverNode) {
        // add ring just for highlighted nodes
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeSize / Math.log(nodeSize), 0, 2 * Math.PI, false);
        if (node.id === hoverNode.id && node.object_data.project) {
          ctx.fillStyle = '#FFEF67';
          node.id = hoverNode.id;
          ctx.strokeStyle = 'orange';
          ctx.lineWidth = 4;
          ctx.stroke();
        }
        if (node.id !== hoverNode.id) {
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 3;
          ctx.stroke();
        }
        ctx.shadowBlur = 0; // Reset shadow blur for other elements

        ctx.fill();
      }
    },
    [getNodeSize, highlightNodes, hoverNode],
  );

  const drawRoundedRect = (
    ctx,
    x,
    y,
    width,
    height,
    borderRadius,
    alpha,
    originalGlobalAlpha,
  ) => {
    ctx.beginPath();

    ctx.globalAlpha = 0.94;
    ctx.moveTo(x + borderRadius, y);
    ctx.lineTo(x + width - borderRadius, y);
    ctx.arcTo(x + width, y, x + width, y + borderRadius, borderRadius);
    ctx.lineTo(x + width, y + height - borderRadius);
    ctx.arcTo(x + width, y + height, x + width - borderRadius, y + height, borderRadius);
    ctx.lineTo(x + borderRadius, y + height);
    ctx.arcTo(x, y + height, x, y + height - borderRadius, borderRadius);
    ctx.lineTo(x, y + borderRadius);
    ctx.arcTo(x, y, x + borderRadius, y, borderRadius);
    ctx.closePath();
    ctx.globalAlpha = alpha;
    ctx.fill();
    ctx.globalAlpha = originalGlobalAlpha; // Reset the globalAlpha property0
  };

  const paintNodeAndLabel = (node, ctx, globalScale) => {
    const nodeSize = getNodeSize(node);

    ctx.arc(node.x, node.y, nodeSize / 2, 0, 2 * Math.PI, false);
    if (paintRing) {
      paintRing(node, ctx, globalScale);
    }

    const label = getNodeLabel(node);
    // ctx.globalAlpha = 0.79;

    const originalGlobalAlpha = ctx.globalAlpha;

    // Draw the node label only if the zoom level is above 0.5 and not at 3
    if (zoomLevel > 0.85) {
      const fontSize = (12 / globalScale) * 1;
      ctx.font = `${fontSize}px Sans-Serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      const textWidth = ctx.measureText(label).width;
      const padding = 4;

      // Add a semi-transparent background for the label not a node
      ctx.fillStyle = node.color;
      const borderRadius = 5; // Adjust borderRadius as desired
      drawRoundedRect(
        ctx,
        node.x - textWidth / 2 - padding,
        node.y - nodeSize / Math.log(nodeSize) - fontSize - 2 * padding,
        textWidth + 2 * padding,
        fontSize + 2 * padding,
        borderRadius,
        0.33,
        originalGlobalAlpha,
      );

      // Position the label above the node
      ctx.fillStyle = theme.text;
      ctx.fillText(
        label,
        node.x,
        node.y - nodeSize / Math.log(nodeSize) - fontSize - padding,
      );
      ctx.textOverflow = 'ellipsis';

      if (highlightNodes.has(node)) {
        // Draw the shadow around the node
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 15;

        // Draw a border around the node
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeSize / Math.log(nodeSize), 0, 2 * Math.PI, false);
        // ctx.strokeStyle = '#7A306C';
        // ctx.lineWidth = 2;
        // ctx.stroke();
        ctx.shadowBlur = 0; // Reset shadow blur for other elements
      }
    } else {
      if (highlightNodes.has(node)) {
        // Draw the shadow around the node
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 40;
        // Draw a border around the node
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeSize / Math.log(nodeSize), 0, 2 * Math.PI, false);
        ctx.strokeStyle = '#7A306C';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset shadow blur for other elements
      }
    }
    // } else if (zoomLevel > 1) {
    //   const fontSize = (12 / globalScale) * 1.1;
    //   ctx.font = `${fontSize}px Sans-Serif`;
    //   ctx.textAlign = 'center';
    //   ctx.textBaseline = 'top';
    //   const textWidth = ctx.measureText(label).width;
    //   const padding = 4;

    //   // Position the label above the node
    //   ctx.fillStyle = theme.text;

    //   // ctx.fillText(label, node.x, node.y - nodeSize / Math.log(nodeSize) - fontSize);

    //   if (highlightNodes.has(node)) {
    //     // Draw the shadow around the node
    //     // ctx.shadowColor = 'black';
    //     // ctx.shadowBlur = 15;
    //     // Draw a border around the node
    //     // ctx.beginPath();
    //     // ctx.arc(node.x, node.y, nodeSize / Math.log(nodeSize), 0, 3 * Math.PI, false);
    //     // ctx.strokeStyle = '#7A306C';

    //     // ctx.lineWidth = 2;
    //     // ctx.stroke();
    //     // ctx.shadowBlur = 0; // Reset shadow blur for other elements
    //   }
  };

  // const getNodeSize = (node) => {
  //   console.log(node);
  //   const baseSize = 10; // adjust this value to control the base node size
  //   const titleLength = node.id.length;
  //   const sizeMultiplier = 1; // adjust this value to control how much the size increases per character in the title
  //   console.log(baseSize + sizeMultiplier * titleLength);
  //   return baseSize + sizeMultiplier * titleLength;
  // };

  function removePunctuationAndCurrency(inputString) {
    // remove all commas from the input string
    let stringWithoutCommas = inputString.replace(/,/g, '');

    // remove all white spaces from the input string
    let stringWithoutSpaces = stringWithoutCommas.replace(/\s/g, '');

    // remove all dollar signs from the input string
    let stringWithoutDollarSigns = stringWithoutSpaces.replace(/\$/g, '');

    return stringWithoutDollarSigns;
  }

  return (
    <div style={{ width: '30rem', height: '30rem' }}>
      {data.nodes.length > 0 && (
        <ForceGraph2D<NodeData, LinkData>
          ref={fgRef}
          graphData={graphData}
          width={width}
          height={height}
          nodeVal={getNodeSize} // Add this line
          // nodeRelSize={8} // Add this line
          cooldownTicks={coolDownTicks} // Use the cooldownTicks state variable
          // ... other props ...
          onNodeDrag={(node) => {
            // Set cooldownTicks to 0 when dragging starts, if it hasn't been set yet
            if (!nodeDragging) {
              setCoolDownTicks(10);
              setNodeDragging(true);
            }
            // ... other onNodeDrag logic ...
          }}
          // onEngineStop={() => fgRef.current.zoomToFit(400)}
          onEngineStop={handleEngineStop}
          // nodeRelSize={12}
          // velocityDecay={0.1}
          linkColor={(link) => (highlightLinks.has(link) ? '#FF5733' : theme.borderColor)}
          linkVisibility={(link) => (!link.clustering)}
          nodeLabel={getNodeLabel}
          autoPauseRedraw={false}
          onZoom={(transform) => setZoomLevel(transform.k)}
          onNodeClick={handleNodeClick}
          linkWidth={(link) => (highlightLinks.has(link) ? 3 : 1.2)}
          linkDirectionalParticles={0}
          linkDirectionalParticleWidth={(link) => (highlightLinks.has(link) ? 3 : 0)}
          nodeCanvasObjectMode={(node) => 'after'}
          nodeCanvasObject={paintNodeAndLabel}
          onNodeDragEnd={(node) => {
            setNodeDragging(false);
          }}
        />
      )}
      {/* {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Oval
            height={150}
            width={150}
            color={theme.text}
            wrapperStyle={{}}
            wrapperClass=''
            visible={true}
            ariaLabel='oval-loading'
            secondaryColor={theme.subTitle}
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      )} */}
    </div>

  );
};

export default MyGraph;

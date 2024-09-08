/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
import React, { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import ForceGraph2D, { ForceGraphMethods, NodeObject } from 'react-force-graph-2d';
import { useTheme } from 'styled-components';

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

  const paintRing = useCallback(
    (node, ctx) => {
      const nodeSize = 35;
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
    [highlightNodes, hoverNode],
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
    const nodeSize = 35;

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
          nodeVal={35} // Add this line
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

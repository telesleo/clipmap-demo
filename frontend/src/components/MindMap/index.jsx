import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { Space, NoPanArea } from 'react-zoomable-ui';
import MapNode from '../MapNode';
import ConfirmAction from '../ConfirmAction';
import { NODE_HEIGHT, NODE_WIDTH } from '../../utils/constants';
import styles from './mind-map.module.css';

export default function MindMap({ nodes, setNodes, zoomable, className }) {
  const [nodeFocus, setNodeFocus] = useState();
  const [treeData, setTreeData] = useState();
  const [linkData, setLinkData] = useState([]);
  const [confirmDeleteNodeId, setConfirmDeleteNodeId] = useState();

  const getNodeById = (allNodes, id) => allNodes.find((node) => node.id === id);

  const getNodes = (parentNodeId, rightBranch) => {
    const parentNode = getNodeById(nodes, parentNodeId);
    const parent = {
      id: parentNode.id,
      name: parentNode.name,
      children: [],
    };
    for (
      let nodeIndex = 0;
      nodeIndex < parentNode.children?.length || 0;
      nodeIndex += 1
    ) {
      const nodeId = parentNode.children[nodeIndex];
      const node = getNodeById(nodes, nodeId);
      if (parentNodeId !== 0 || node?.rightBranch === rightBranch) {
        parent.children.push({
          id: node.id,
          name: node.name,
          rightBranch,
          children: [...getNodes(nodeId, rightBranch).children],
        });
      }
    }
    return parent;
  };

  const changeNodeFocus = (id, value) => {
    setNodeFocus((prevNodeFocus) => {
      const newNodeFocus = { ...prevNodeFocus };
      if (value) {
        Object.keys(prevNodeFocus).forEach((nodeId) => {
          newNodeFocus[nodeId] = false;
        });
      }
      newNodeFocus[id] = value;
      return newNodeFocus;
    });
  };

  const addNode = (parentNodeId, rightBranch) => {
    const nodeId = nodes[nodes.length - 1].id + 1;
    setNodes((prevNodes) => {
      const newNodes = [...prevNodes];
      const node = getNodeById(newNodes, parentNodeId);
      if (!node.children) {
        node.children = [];
      }
      node.children.push(nodeId);
      const newNode = { id: nodeId, name: '', children: [] };
      if (parentNodeId === 0) {
        newNode.rightBranch = rightBranch;
      }
      changeNodeFocus(newNode.id, true);
      return [...newNodes, newNode];
    });
  };

  const removeNode = (nodeId) => {
    setNodes((prevNodes) => {
      const filteredNodes = prevNodes.filter((node) => node.id !== nodeId);
      return filteredNodes.map((node) => {
        const newNode = { ...node };
        if (node.children) {
          newNode.children = node.children.filter(
            (childNodeId) => childNodeId !== nodeId,
          );
        }
        return newNode;
      });
    });
  };

  const tryToRemoveNode = (event, nodeId) => {
    event.stopPropagation();
    const node = getNodeById(nodes, nodeId);
    if (node.children && node.children.length > 0) {
      setConfirmDeleteNodeId(nodeId);
    } else {
      removeNode(nodeId);
    }
  };

  const updateNodeName = (id, name) => {
    setNodes((prevNodes) => {
      const newNodes = [...prevNodes];
      getNodeById(newNodes, id).name = name;
      return newNodes;
    });
  };

  const drawLinks = (links, offset) => {
    const linkPathGenerator = (d) => `
      M${d.source.y + offset.x},${d.source.x + offset.y}
      H${(d.source.y + d.target.y) / 2 + offset.x}
      V${d.target.x + offset.y}
      H${d.target.y + offset.x}
    `;
    setLinkData(links.map((link) => linkPathGenerator(link)));
  };

  const getTree = (treeLayout, data) => {
    const branch = d3.hierarchy(data);
    return treeLayout(branch);
  };

  const updateTreeData = () => {
    const treeLayout = d3.tree().nodeSize([NODE_HEIGHT, NODE_WIDTH]);
    const branchDataLeft = getNodes(0, false);
    const branchDataRight = getNodes(0, true);
    const treeLeft = getTree(treeLayout, branchDataLeft);
    const treeRight = getTree(treeLayout, branchDataRight);
    const nodesLeft = treeLeft.descendants().map((node) => {
      const newNode = {
        id: node.data.id,
        name: node.data.name,
        x: -node.y,
        y: node.x,
      };
      if (node.data.rightBranch !== undefined) {
        newNode.rightBranch = node.data.rightBranch;
      }
      return newNode;
    });
    const nodesRight = treeRight.descendants().map((node) => ({
      id: node.data.id,
      name: node.data.name,
      rightBranch: node.data.rightBranch,
      x: node.y,
      y: node.x,
    }));
    const allNodes = [...nodesLeft, ...nodesRight.splice(1)];

    const topLeftCorner = allNodes.reduce(
      (corner, currentNode) => {
        const newCorner = { ...corner };
        if (currentNode.x < corner.x) {
          newCorner.x = currentNode.x;
        }
        if (currentNode.y < corner.y) {
          newCorner.y = currentNode.y;
        }
        return newCorner;
      },
      { x: 0, y: 0 },
    );
    const bottomRightCorner = allNodes.reduce(
      (corner, currentNode) => {
        const newCorner = { ...corner };
        if (currentNode.x > corner.x) {
          newCorner.x = currentNode.x;
        }
        if (currentNode.y > corner.y) {
          newCorner.y = currentNode.y;
        }
        return newCorner;
      },
      { x: 0, y: 0 },
    );
    const width =
      Math.max(Math.abs(topLeftCorner.x), bottomRightCorner.x) * 2 + NODE_WIDTH;
    const height =
      Math.max(Math.abs(topLeftCorner.y), bottomRightCorner.y) * 2 +
      NODE_HEIGHT;

    const linksLeft = treeLeft.links().map((link) => ({
      ...link,
      source: { ...link.source, y: -link.source.y },
      target: { ...link.target, y: -link.target.y },
    }));
    const linksRight = treeRight.links();
    const links = [...linksLeft, ...linksRight];
    drawLinks(links, { x: width / 2, y: height / 2 });

    setTreeData({
      nodes: allNodes,
      size: { width, height },
    });
  };

  const updateNodeFocus = () => {
    setNodeFocus((prevNodeFocus) => {
      const initialize = prevNodeFocus === undefined;
      const newNodeFocus = {};
      nodes.forEach((node) => {
        let value = !initialize;
        if (initialize) {
          if (node.id === 0 && (node.name?.length || 0) <= 0) {
            value = true;
          }
        } else {
          value = prevNodeFocus[node.id];
        }
        newNodeFocus[node.id] = value;
      });
      return newNodeFocus;
    });
  };

  useEffect(() => {
    updateTreeData();
    updateNodeFocus();
  }, [nodes]);

  const getMapNode = (node) => (
    <MapNode
      isRootNode={node.id === 0}
      invert={node?.rightBranch === false}
      nodeName={node.name}
      setName={(name) => updateNodeName(node.id, name)}
      addChildNode={(rightNode) => addNode(node.id, rightNode)}
      removeNode={
        node.id > 0 ? (event) => tryToRemoveNode(event, node.id) : null
      }
      focus={nodeFocus && node.id in nodeFocus ? nodeFocus[node.id] : false}
      setFocus={(value) => changeNodeFocus(node.id, value)}
      rightBranch={node.rightBranch}
    />
  );

  const getContent = () => (
    <div id={styles['mind-map']} className={className}>
      <svg width={treeData.size.width} height={treeData.size.height}>
        {linkData.map((link) => (
          <path key={link} d={link} fill="none" stroke="gray" />
        ))}
        {treeData.nodes.map((node) => (
          <foreignObject
            key={node.id}
            width={NODE_WIDTH}
            height={NODE_HEIGHT}
            x={-NODE_WIDTH / 2}
            y={-NODE_HEIGHT / 2}
            style={{
              transform: `translate(${node.x + treeData.size.width / 2}px, ${
                node.y + treeData.size.height / 2
              }px)`,
            }}
          >
            <div
              className={styles['node-container']}
              style={{
                width: NODE_WIDTH,
                height: NODE_HEIGHT,
              }}
            >
              {zoomable ? (
                <NoPanArea
                  style={{
                    width: NODE_WIDTH,
                  }}
                >
                  {getMapNode(node)}
                </NoPanArea>
              ) : (
                getMapNode(node)
              )}
            </div>
          </foreignObject>
        ))}
      </svg>
    </div>
  );

  return (
    <>
      {treeData && (zoomable ? <Space>{getContent()}</Space> : getContent())}
      <ConfirmAction
        open={confirmDeleteNodeId}
        message={`Tem certeza que deseja apagar node "${
          getNodeById(nodes, confirmDeleteNodeId)?.name || 'Node sem nome'
        }" e nodes subsequentes?`}
        cancel={() => setConfirmDeleteNodeId(undefined)}
        confirm={() => {
          removeNode(confirmDeleteNodeId);
          setConfirmDeleteNodeId(undefined);
        }}
      />
    </>
  );
}

MindMap.propTypes = {
  nodes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
    }),
  ).isRequired,
  setNodes: PropTypes.func.isRequired,
  zoomable: PropTypes.bool,
  className: PropTypes.string,
};

MindMap.defaultProps = {
  zoomable: false,
  className: null,
};

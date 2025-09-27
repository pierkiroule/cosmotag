import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation } from 'd3-force';

const DEFAULT_TAGS = [
  'Mystic Whisper',
  'Lunar Echo',
  'Velvet Horizon',
  'Silent Ember',
  'Aurora Pulse',
];

const STORAGE_KEY = 'cosmotag.tag-network';
const NODE_RADIUS = 22;

const createDefaultNodes = (width, height) => {
  const radius = Math.min(width, height) / 3;
  const centerX = width / 2;
  const centerY = height / 2;

  return DEFAULT_TAGS.map((label, index) => {
    const angle = (index / DEFAULT_TAGS.length) * Math.PI * 2;
    return {
      id: label,
      label,
      radius: NODE_RADIUS,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });
};

const createDefaultLinks = () => {
  return DEFAULT_TAGS.map((label, index) => ({
    source: label,
    target: DEFAULT_TAGS[(index + 1) % DEFAULT_TAGS.length],
  }));
};

const ensureNodeShape = (node, fallbackWidth, fallbackHeight) => ({
  id: node.id,
  label: node.label ?? node.id,
  radius: NODE_RADIUS,
  x: typeof node.x === 'number' ? node.x : fallbackWidth / 2,
  y: typeof node.y === 'number' ? node.y : fallbackHeight / 2,
});

const ensureLinkShape = (link) => ({
  source: typeof link.source === 'string' ? link.source : link.source?.id,
  target: typeof link.target === 'string' ? link.target : link.target?.id,
});

const loadStoredGraph = (width, height) => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed?.nodes) || !Array.isArray(parsed?.links)) {
      return null;
    }

    return {
      nodes: parsed.nodes.map((node) => ensureNodeShape(node, width, height)),
      links: parsed.links.map((link) => ensureLinkShape(link)).filter((link) => link.source && link.target),
    };
  } catch (error) {
    console.warn('Failed to load stored tag network:', error);
    return null;
  }
};

const TagNetwork = forwardRef(({ width = 800, height = 600 }, ref) => {
  const [nodes, setNodes] = useState(() => createDefaultNodes(width, height));
  const [links, setLinks] = useState(() => createDefaultLinks());
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const svgRef = useRef(null);
  const simulationRef = useRef(null);
  const nodesRef = useRef(nodes);
  const linksRef = useRef(links);
  const draggingNodeRef = useRef(null);

  useEffect(() => {
    nodesRef.current = nodes;
    if (simulationRef.current) {
      simulationRef.current.nodes(nodesRef.current);
    }
  }, [nodes]);

  useEffect(() => {
    linksRef.current = links;
    if (simulationRef.current) {
      const linkForce = simulationRef.current.force('link');
      if (linkForce) {
        linkForce.links(linksRef.current.map((link) => ({ ...link })));
      }
      simulationRef.current.alpha(0.7).restart();
    }
  }, [links]);

  useEffect(() => {
    const stored = loadStoredGraph(width, height);
    if (stored) {
      setNodes(stored.nodes);
      setLinks(stored.links.length ? stored.links : createDefaultLinks());
    }
  }, [height, width]);

  useEffect(() => {
    const simulation = forceSimulation(nodesRef.current)
      .force(
        'link',
        forceLink(linksRef.current.map((link) => ({ ...link })))
          .id((node) => node.id)
          .distance(160)
      )
      .force('charge', forceManyBody().strength(-260))
      .force('center', forceCenter(width / 2, height / 2))
      .force('collide', forceCollide(NODE_RADIUS * 1.8));

    simulation.on('tick', () => {
      setNodes((current) => [...current]);
    });

    simulationRef.current = simulation;

    return () => {
      simulation.stop();
      simulationRef.current = null;
    };
  }, [height, width]);

  const nodeMap = useMemo(() => {
    const map = new Map();
    nodes.forEach((node) => {
      map.set(node.id, node);
    });
    return map;
  }, [nodes]);

  const saveGraph = () => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const payload = {
        nodes: nodesRef.current.map(({ id, label, x, y }) => ({ id, label, x, y })),
        links: linksRef.current.map((link) => ({ source: link.source, target: link.target })),
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      console.warn('Failed to save tag network:', error);
    }
  };

  const resetGraph = () => {
    const defaultNodes = createDefaultNodes(width, height);
    const defaultLinks = createDefaultLinks();
    setNodes(defaultNodes);
    setLinks(defaultLinks);
    setSelectedNodeId(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    if (simulationRef.current) {
      simulationRef.current.alpha(1).restart();
    }
  };

  useImperativeHandle(ref, () => ({
    saveGraph,
    resetGraph,
  }));

  const handlePointerPosition = (event) => {
    const svg = svgRef.current;
    if (!svg) {
      return { x: 0, y: 0 };
    }
    const rect = svg.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const handlePointerDown = (event, node) => {
    event.stopPropagation();
    draggingNodeRef.current = node;
    if (event.target.setPointerCapture) {
      event.target.setPointerCapture(event.pointerId);
    }

    const { x, y } = handlePointerPosition(event);
    node.fx = x;
    node.fy = y;

    if (simulationRef.current) {
      simulationRef.current.alphaTarget(0.3).restart();
    }
    setNodes((current) => [...current]);
  };

  const handlePointerMove = (event) => {
    const node = draggingNodeRef.current;
    if (!node) {
      return;
    }

    const { x, y } = handlePointerPosition(event);
    node.fx = x;
    node.fy = y;
    setNodes((current) => [...current]);
    if (simulationRef.current) {
      simulationRef.current.alphaTarget(0.3).restart();
    }
  };

  const handlePointerUp = (event) => {
    const node = draggingNodeRef.current;
    if (!node) {
      return;
    }

    if (event.target.releasePointerCapture) {
      event.target.releasePointerCapture(event.pointerId);
    }

    node.fx = null;
    node.fy = null;
    draggingNodeRef.current = null;

    if (simulationRef.current) {
      simulationRef.current.alphaTarget(0).alpha(0.2).restart();
    }
    setNodes((current) => [...current]);
  };

  const handleNodeDoubleClick = (nodeId) => {
    if (!selectedNodeId) {
      setSelectedNodeId(nodeId);
      return;
    }

    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
      return;
    }

    setLinks((current) => {
      const exists = current.some(
        (link) =>
          (link.source === selectedNodeId && link.target === nodeId) ||
          (link.source === nodeId && link.target === selectedNodeId)
      );

      if (exists) {
        return current.filter(
          (link) =>
            !(
              (link.source === selectedNodeId && link.target === nodeId) ||
              (link.source === nodeId && link.target === selectedNodeId)
            )
        );
      }

      return [...current, { source: selectedNodeId, target: nodeId }];
    });

    if (simulationRef.current) {
      simulationRef.current.alpha(0.8).restart();
    }

    setSelectedNodeId(null);
  };

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ border: '1px solid #e2e8f0', borderRadius: '0.75rem', background: '#0f172a', color: '#f8fafc' }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <g>
        {links.map((link, index) => {
          const source = nodeMap.get(link.source);
          const target = nodeMap.get(link.target);
          if (!source || !target) {
            return null;
          }

          return (
            <line
              key={`link-${source.id}-${target.id}-${index}`}
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke="#38bdf8"
              strokeOpacity={0.4}
              strokeWidth={2}
            />
          );
        })}
      </g>
      <g>
        {nodes.map((node) => (
          <g
            key={node.id}
            transform={`translate(${node.x}, ${node.y})`}
            onPointerDown={(event) => handlePointerDown(event, node)}
            onDoubleClick={() => handleNodeDoubleClick(node.id)}
            cursor="pointer"
          >
            <circle
              r={node.radius}
              fill={selectedNodeId === node.id ? '#f97316' : '#38bdf8'}
              fillOpacity={0.85}
              stroke="#0f172a"
              strokeWidth={2}
            />
            <text
              fill="#0f172a"
              textAnchor="middle"
              dy="0.35em"
              fontSize="0.75rem"
              fontWeight="600"
              pointerEvents="none"
            >
              {node.label}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
});

export default TagNetwork;

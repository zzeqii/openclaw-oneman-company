import React, { useCallback, useRef, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  MarkerType,
} from 'reactflow';
import { MindMapData, ThemeType } from '../types';

interface ThemeConfig {
  canvasBg: string;
}

interface MindMapCanvasProps {
  data: MindMapData | null;
  theme: ThemeType;
  themeConfig: ThemeConfig;
}

const MindMapCanvas: React.FC<MindMapCanvasProps> = ({ data, theme, themeConfig }) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(data?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(data?.edges || []);

  // 根据主题获取节点样式
  const themedNodes = useMemo(() => {
    if (!data?.nodes) return [];

    return data.nodes.map((node) => {
      let style = { ...node.style };

      switch (theme) {
        case 'dark':
          if (node.type === 'input') {
            style = {
              ...style,
              background: '#6366f1',
              color: 'white',
              border: 'none',
            };
          } else {
            style = {
              ...style,
              background: '#374151',
              color: 'white',
              border: '1px solid #4b5563',
            };
          }
          break;
        case 'minimal':
          style = {
            ...style,
            background: 'white',
            color: '#111827',
            border: '1px solid #e5e7eb',
            borderRadius: '4px',
          };
          break;
        case 'light':
        default:
          // 默认样式保持不变
          break;
      }

      return { ...node, style };
    });
  }, [data?.nodes, theme]);

  // 根据主题获取连线样式
  const themedEdges = useMemo(() => {
    if (!data?.edges) return [];

    return data.edges.map((edge) => {
      let style = { ...edge.style };
      let markerEnd = edge.markerEnd;

      switch (theme) {
        case 'dark':
          style = {
            ...style,
            stroke: '#9ca3af',
            strokeWidth: 2,
          };
          markerEnd = {
            type: MarkerType.ArrowClosed,
            color: '#9ca3af',
          };
          break;
        case 'minimal':
          style = {
            ...style,
            stroke: '#d1d5db',
            strokeWidth: 1.5,
          };
          markerEnd = {
            type: MarkerType.ArrowClosed,
            color: '#9ca3af',
          };
          break;
        case 'light':
        default:
          style = {
            ...style,
            stroke: '#6366f1',
            strokeWidth: 2,
          };
          markerEnd = {
            type: MarkerType.ArrowClosed,
            color: '#6366f1',
          };
          break;
      }

      return { ...edge, style, markerEnd };
    });
  }, [data?.edges, theme]);

  // 更新节点和边当数据或主题变化
  React.useEffect(() => {
    if (themedNodes.length > 0) {
      setNodes(themedNodes);
    }
    if (themedEdges.length > 0) {
      setEdges(themedEdges);
    }
  }, [themedNodes, themedEdges, setNodes, setEdges]);



  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            animated: false,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#6366f1',
            },
            style: { stroke: '#6366f1', strokeWidth: 2 },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  if (!data) {
    return (
      <div className={`h-[600px] ${themeConfig.canvasBg} rounded-lg shadow-md flex items-center justify-center`}>
        <div className="text-center">
          <svg
            className={`mx-auto h-16 w-16 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} mb-4`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className={`text-lg font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>还没有思维导图</h3>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>请在上方输入详细要求，点击生成按钮开始创建</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-[600px] ${themeConfig.canvasBg} rounded-lg shadow-md`} ref={reactFlowWrapper}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          attributionPosition="bottom-left"
        >
          <Background 
            color={theme === 'dark' ? '#4b5563' : '#e5e7eb'} 
            gap={16} 
          />
          <Controls 
            className={theme === 'dark' ? '!bg-gray-800 !text-white' : ''}
          />
          <MiniMap
            nodeColor={(node: Node) => {
              if (node.type === 'input') return '#6366f1';
              if (node.style?.background) return node.style.background as string;
              return theme === 'dark' ? '#374151' : '#e0e7ff';
            }}
            className={theme === 'dark' ? '!bg-gray-800' : '!bg-gray-50'}
          />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

export default MindMapCanvas;

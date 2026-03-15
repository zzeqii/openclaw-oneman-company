import { Edge } from 'reactflow';

export interface MindMapNode {
  id: string;
  data: {
    label: string;
  };
  position: {
    x: number;
    y: number;
  };
  type?: string;
  style?: Record<string, any>;
}

export type MindMapEdge = Edge;

export interface MindMapData {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
}

export type ExportFormat = 'json' | 'markdown' | 'pdf' | 'png';

export type LayoutType = 'horizontal' | 'vertical';
export type ThemeType = 'light' | 'dark' | 'minimal';

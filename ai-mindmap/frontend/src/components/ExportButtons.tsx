import React from 'react';
import { saveAs } from 'file-saver';
import { exportMindMap } from '../services/api';
import { ExportFormat, MindMapData } from '../types';

interface ExportButtonsProps {
  data: MindMapData | null;
  loading: boolean;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ data, loading }) => {
  const [exporting, setExporting] = React.useState<string | null>(null);

  const handleExport = async (format: ExportFormat) => {
    if (!data) return;

    try {
      setExporting(format);
      
      const svgElement = document.querySelector('.react-flow__renderer svg');
      const svg = svgElement ? svgElement.outerHTML : '';

      const blob = await exportMindMap(format, {
        nodes: data.nodes,
        edges: data.edges,
        svg,
      });

      saveAs(blob, `mindmap.${format}`);
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出失败，请稍后重试');
    } finally {
      setExporting(null);
    }
  };

  const exportButtons = [
    { format: 'png' as ExportFormat, label: '导出PNG', color: 'bg-green-600 hover:bg-green-700' },
    { format: 'pdf' as ExportFormat, label: '导出PDF', color: 'bg-red-600 hover:bg-red-700' },
    { format: 'markdown' as ExportFormat, label: '导出Markdown', color: 'bg-gray-700 hover:bg-gray-800' },
    { format: 'json' as ExportFormat, label: '导出JSON', color: 'bg-blue-600 hover:bg-blue-700' },
  ];

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {exportButtons.map(({ format, label, color }) => (
        <button
          key={format}
          onClick={() => handleExport(format)}
          disabled={!data || loading || !!exporting}
          className={`px-6 py-3 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${color}`}
        >
          {exporting === format ? '导出中...' : label}
        </button>
      ))}
      {data && (
        <div className="ml-auto flex items-center text-sm text-gray-500">
          <span className="mr-2">💡 提示：支持拖拽节点、编辑内容、连接节点</span>
        </div>
      )}
    </div>
  );
};

export default ExportButtons;

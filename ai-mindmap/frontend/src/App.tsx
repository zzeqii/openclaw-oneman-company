import { useState, useMemo } from 'react';
import InputArea from './components/InputArea';
import MindMapCanvas from './components/MindMapCanvas';
import ExportButtons from './components/ExportButtons';
import { generateMindMap } from './services/api';
import { MindMapData, LayoutType, ThemeType } from './types';

function App() {
  const [loading, setLoading] = useState(false);
  const [mindMapData, setMindMapData] = useState<MindMapData | null>(null);
  const [layout, setLayout] = useState<LayoutType>('horizontal');
  const [theme, setTheme] = useState<ThemeType>('light');

  const handleGenerate = async (topic: string) => {
    try {
      setLoading(true);
      const data = await generateMindMap(topic, false);
      
      // 根据布局调整节点位置
      if (data && layout === 'vertical') {
        const transformedNodes = data.nodes.map(node => ({
          ...node,
          position: {
            x: node.position.y,
            y: node.position.x,
          },
        }));
        data.nodes = transformedNodes;
      }
      
      setMindMapData(data);
    } catch (error) {
      console.error('生成失败:', error);
      alert('生成思维导图失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 主题样式配置
  const themeConfig = useMemo(() => {
    switch (theme) {
      case 'dark':
        return {
          bg: 'min-h-screen bg-gray-900 py-8 px-4',
          cardBg: 'bg-gray-800',
          textColor: 'text-white',
          inputBg: 'bg-gray-700 border-gray-600 text-white',
          buttonBg: 'bg-indigo-600 hover:bg-indigo-700',
          canvasBg: 'bg-gray-800',
        };
      case 'minimal':
        return {
          bg: 'min-h-screen bg-white py-8 px-4',
          cardBg: 'bg-white border border-gray-200',
          textColor: 'text-gray-900',
          inputBg: 'bg-white border-gray-300 text-gray-900',
          buttonBg: 'bg-gray-800 hover:bg-gray-900',
          canvasBg: 'bg-white',
        };
      case 'light':
      default:
        return {
          bg: 'min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4',
          cardBg: 'bg-white',
          textColor: 'text-gray-800',
          inputBg: 'bg-white border-gray-300 text-gray-900',
          buttonBg: 'bg-indigo-600 hover:bg-indigo-700',
          canvasBg: 'bg-white',
        };
    }
  }, [theme]);

  // 布局切换处理
  const handleLayoutChange = (newLayout: LayoutType) => {
    setLayout(newLayout);
    if (mindMapData) {
      const transformedNodes = mindMapData.nodes.map(node => ({
        ...node,
        position:
          newLayout === 'vertical'
            ? { x: node.position.y, y: node.position.x }
            : { x: node.position.y, y: node.position.x },
      }));
      setMindMapData({
        ...mindMapData,
        nodes: transformedNodes,
      });
    }
  };

  return (
    <div className={themeConfig.bg}>
      <div className="max-w-7xl mx-auto">
        {/* 顶部工具栏 */}
        <div className={`${themeConfig.cardBg} shadow-md p-4 rounded-lg mb-6 flex flex-wrap gap-4 items-center justify-between`}>
          <h1 className={`text-2xl font-bold ${themeConfig.textColor}`}>AI 思维导图生成器</h1>
          
          <div className="flex gap-4 items-center">
            {/* 布局切换 */}
            <div className="flex gap-2">
              <button
                onClick={() => handleLayoutChange('horizontal')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  layout === 'horizontal'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                横向布局
              </button>
              <button
                onClick={() => handleLayoutChange('vertical')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  layout === 'vertical'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                竖向布局
              </button>
            </div>

            {/* 主题切换 */}
            <div className="flex gap-2">
              <button
                onClick={() => setTheme('light')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  theme === 'light'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                清新主题
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  theme === 'dark'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                暗黑主题
              </button>
              <button
                onClick={() => setTheme('minimal')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  theme === 'minimal'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                简约主题
              </button>
            </div>
          </div>
        </div>

        <InputArea 
          onGenerate={handleGenerate} 
          loading={loading} 
          themeConfig={themeConfig}
        />
        <MindMapCanvas 
          data={mindMapData} 
          theme={theme}
          themeConfig={themeConfig}
        />
        <ExportButtons data={mindMapData} loading={loading} />
        
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>AI 思维导图工具 © 2024 | 支持拖拽编辑、多格式导出</p>
        </footer>
      </div>
    </div>
  );
}

export default App;

import React, { useState } from 'react';

interface ThemeConfig {
  cardBg: string;
  textColor: string;
  inputBg: string;
  buttonBg: string;
}

interface InputAreaProps {
  onGenerate: (topic: string) => void;
  loading: boolean;
  themeConfig: ThemeConfig;
}

const InputArea: React.FC<InputAreaProps> = ({ onGenerate, loading, themeConfig }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt.trim());
    }
  };

  return (
    <div className={`${themeConfig.cardBg} shadow-md p-6 rounded-lg mb-6`}>
      <h2 className={`text-xl font-semibold mb-4 ${themeConfig.textColor}`}>输入生成要求</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="请输入详细的思维导图生成要求，例如：
- 主题：产品上线推广方案
- 结构：包含市场分析、目标用户、推广渠道、预算规划、风险评估5个主要部分
- 层级：最多3层
- 要求：每个部分包含3-5个具体要点，内容要符合互联网产品推广的实际情况
- 风格：专业、实用、可执行"
          className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg min-h-[150px] resize-vertical ${themeConfig.inputBg}`}
          disabled={loading}
          rows={6}
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className={`px-8 py-3 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${themeConfig.buttonBg}`}
        >
          {loading ? '生成中...' : '生成思维导图'}
        </button>
      </form>
    </div>
  );
};

export default InputArea;

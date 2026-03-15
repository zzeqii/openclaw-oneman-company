function generateMockMindMap(topic) {
  const nodes = [
    {
      id: '1',
      data: { label: topic },
      position: { x: 400, y: 50 },
      type: 'input',
      style: {
        background: '#6366f1',
        color: 'white',
        fontWeight: 'bold',
        padding: '10px 15px',
        borderRadius: '8px',
      }
    },
    {
      id: '2',
      data: { label: '核心概念' },
      position: { x: 150, y: 180 },
      style: {
        background: '#8b5cf6',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '6px',
      }
    },
    {
      id: '3',
      data: { label: '主要特点' },
      position: { x: 400, y: 180 },
      style: {
        background: '#ec4899',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '6px',
      }
    },
    {
      id: '4',
      data: { label: '应用场景' },
      position: { x: 650, y: 180 },
      style: {
        background: '#f59e0b',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '6px',
      }
    },
    {
      id: '2-1',
      data: { label: '基本定义' },
      position: { x: 50, y: 300 },
    },
    {
      id: '2-2',
      data: { label: '发展历程' },
      position: { x: 50, y: 370 },
    },
    {
      id: '2-3',
      data: { label: '重要原理' },
      position: { x: 50, y: 440 },
    },
    {
      id: '3-1',
      data: { label: '优势分析' },
      position: { x: 300, y: 300 },
    },
    {
      id: '3-2',
      data: { label: '局限性' },
      position: { x: 300, y: 370 },
    },
    {
      id: '3-3',
      data: { label: '未来趋势' },
      position: { x: 300, y: 440 },
    },
    {
      id: '4-1',
      data: { label: '商业应用' },
      position: { x: 550, y: 300 },
    },
    {
      id: '4-2',
      data: { label: '个人使用' },
      position: { x: 550, y: 370 },
    },
    {
      id: '4-3',
      data: { label: '行业案例' },
      position: { x: 550, y: 440 },
    },
    {
      id: '4-4',
      data: { label: '最佳实践' },
      position: { x: 550, y: 510 },
    },
  ];

  const edges = [
    { id: 'e1-2', source: '1', target: '2', animated: false },
    { id: 'e1-3', source: '1', target: '3', animated: false },
    { id: 'e1-4', source: '1', target: '4', animated: false },
    { id: 'e2-2-1', source: '2', target: '2-1' },
    { id: 'e2-2-2', source: '2', target: '2-2' },
    { id: 'e2-2-3', source: '2', target: '2-3' },
    { id: 'e3-3-1', source: '3', target: '3-1' },
    { id: 'e3-3-2', source: '3', target: '3-2' },
    { id: 'e3-3-3', source: '3', target: '3-3' },
    { id: 'e4-4-1', source: '4', target: '4-1' },
    { id: 'e4-4-2', source: '4', target: '4-2' },
    { id: 'e4-4-3', source: '4', target: '4-3' },
    { id: 'e4-4-4', source: '4', target: '4-4' },
  ];

  return { nodes, edges };
}

module.exports = {
  generateMockMindMap,
};

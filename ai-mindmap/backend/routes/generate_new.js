const { generateMockMindMap } = require('../services/aiService');

const generateMindMap = async (req, res) => {
  try {
    const { prompt, topic, useMock = true } = req.body;
    const generateTopic = topic || prompt;
    
    if (!generateTopic) {
      return res.status(400).json({ error: '生成要求不能为空' });
    }

    let mindMapData;
    
    // 使用系统自带大模型生成
    if (!useMock) {
      try {
        console.log('使用系统大模型生成思维导图...');
        
        const systemPrompt = `你是专业的思维导图生成助手，根据用户需求生成结构化的思维导图，输出严格符合JSON格式，不要任何其他内容。
生成规则：
1. 根节点只有1个，id为"1"，type为"input"，位置在顶部中央x:400,y:50
2. 一级节点3-6个，均匀分布在根节点下方，y坐标统一为180，x坐标分别为150、300、450、600、750
3. 每个一级节点下有2-3个二级节点，y坐标从300开始递增
4. 节点位置分布合理，避免重叠
5. 内容完全符合用户需求，逻辑清晰
6. 严格按照以下JSON格式输出，不要任何其他内容：
{
  "nodes": [
    { "id": "1", "data": { "label": "根主题" }, "position": { "x": 400, "y": 50 }, "type": "input", "style": { "background": "#6366f1", "color": "white", "fontWeight": "bold", "padding": "10px 15px", "borderRadius": "8px" } },
    { "id": "2", "data": { "label": "一级节点1" }, "position": { "x": 150, "y": 180 }, "style": { "background": "#8b5cf6", "color": "white", "padding": "8px 12px", "borderRadius": "6px" } },
    { "id": "2-1", "data": { "label": "二级节点1" }, "position": { "x": 50, "y": 300 } }
  ],
  "edges": [
    { "id": "e1-2", "source": "1", "target": "2", "style": { "stroke": "#6366f1", "strokeWidth": 2 }, "markerEnd": { "type": "arrowclosed", "color": "#6366f1" } },
    { "id": "e2-2-1", "source": "2", "target": "2-1", "style": { "stroke": "#6366f1", "strokeWidth": 2 }, "markerEnd": { "type": "arrowclosed", "color": "#6366f1" } }
  ]
}
用户需求：${generateTopic}`;

        // 调用系统大模型
        const response = await fetch(process.env.OPENAI_API_BASE || 'https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.ARK_API_KEY}`
          },
          body: JSON.stringify({
            model: process.env.ARK_MODEL || 'doubao-pro-4k',
            messages: [{ role: 'user', content: systemPrompt }],
            temperature: 0.6,
            max_tokens: 4000
          })
        });

        const result = await response.json();
        const content = result.choices[0].message.content;
        
        // 清理返回内容，只保留JSON部分
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          mindMapData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('返回内容不是有效的JSON格式');
        }
        
      } catch (aiError) {
        console.error('AI生成失败，使用Mock数据:', aiError.message);
        mindMapData = generateMockMindMap(generateTopic);
      }
    } else {
      console.log('使用Mock数据生成思维导图...');
      mindMapData = generateMockMindMap(generateTopic);
    }

    res.json(mindMapData);
  } catch (error) {
    console.error('生成思维导图失败:', error);
    res.status(500).json({ error: `生成思维导图失败: ${error.message}` });
  }
};

module.exports = generateMindMap;

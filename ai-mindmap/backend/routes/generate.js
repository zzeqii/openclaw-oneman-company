const { generateMockMindMap } = require('../services/aiService');

const generateMindMap = async (req, res) => {
  try {
    const { prompt, topic, useMock = false } = req.body;
    const generateTopic = topic || prompt;
    
    if (!generateTopic) {
      return res.status(400).json({ error: '生成要求不能为空' });
    }

    let mindMapData;
    
    // 优先使用火山引擎ARK API
    if (!useMock && process.env.ARK_API_KEY && process.env.ARK_API_KEY !== 'your_ark_api_key_here') {
      console.log('使用火山引擎ARK生成思维导图...');
      
      // 动态导入OpenAI SDK（ARK兼容OpenAI接口格式）
      const OpenAI = require('openai');
      const openai = new OpenAI({
        apiKey: process.env.ARK_API_KEY,
        baseURL: process.env.ARK_ENDPOINT,
      });

      const prompt = `
        请根据以下用户需求生成一个结构化的思维导图，输出格式为纯JSON，不要任何其他内容和解释。
        用户需求：${generateTopic}
        
        JSON格式要求：
        {
          "nodes": [
            { "id": "1", "data": { "label": "根主题" }, "position": { "x": 400, "y": 50 }, "type": "input", "style": { "background": "#6366f1", "color": "white", "fontWeight": "bold", "padding": "10px 15px", "borderRadius": "8px" } },
            { "id": "2", "data": { "label": "一级节点1" }, "position": { "x": 150, "y": 180 }, "style": { "background": "#8b5cf6", "color": "white", "padding": "8px 12px", "borderRadius": "6px" } },
            { "id": "3", "data": { "label": "一级节点2" }, "position": { "x": 400, "y": 180 }, "style": { "background": "#ec4899", "color": "white", "padding": "8px 12px", "borderRadius": "6px" } },
            { "id": "4", "data": { "label": "一级节点3" }, "position": { "x": 650, "y": 180 }, "style": { "background": "#f59e0b", "color": "white", "padding": "8px 12px", "borderRadius": "6px" } },
            { "id": "2-1", "data": { "label": "二级节点1" }, "position": { "x": 50, "y": 300 } }
          ],
          "edges": [
            { "id": "e1-2", "source": "1", "target": "2", "style": { "stroke": "#6366f1", "strokeWidth": 2 }, "markerEnd": { "type": "arrowclosed", "color": "#6366f1" } },
            { "id": "e1-3", "source": "1", "target": "3", "style": { "stroke": "#6366f1", "strokeWidth": 2 }, "markerEnd": { "type": "arrowclosed", "color": "#6366f1" } },
            { "id": "e2-2-1", "source": "2", "target": "2-1", "style": { "stroke": "#6366f1", "strokeWidth": 2 }, "markerEnd": { "type": "arrowclosed", "color": "#6366f1" } }
          ]
        }
        
        生成规则：
        1. 根节点只有1个，id为"1"，type为"input"，位置在顶部中央
        2. 一级节点数量建议3-6个，均匀分布在根节点下方
        3. 每个一级节点下可以有2-5个二级节点
        4. 总节点数量控制在10-30个之间，层级不超过3层
        5. 节点位置分布合理，避免重叠，x坐标从左到右递增，y坐标从上到下递增
        6. 内容要完全符合用户需求，逻辑清晰，结构合理
        7. 一级节点使用不同的背景色，风格统一
        8. 严格按照JSON格式输出，不要添加任何其他内容、注释或解释
      `;

      const response = await openai.chat.completions.create({
        model: process.env.ARK_MODEL || 'ark-code-latest',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.6,
        max_tokens: 4000,
      });

      const content = response.choices[0].message.content;
      
      // 清理返回内容，只保留JSON部分
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        mindMapData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('返回内容不是有效的JSON格式');
      }
      
    } else if (!useMock && process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
      console.log('使用OpenAI API生成思维导图...');
      
      const OpenAI = require('openai');
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: process.env.OPENAI_BASE_URL,
      });

      const prompt = `
        请根据以下用户需求生成一个结构化的思维导图，输出格式为纯JSON，不要任何其他内容和解释。
        用户需求：${generateTopic}
        
        JSON格式要求：
        {
          "nodes": [
            { "id": "1", "data": { "label": "根主题" }, "position": { "x": 400, "y": 50 }, "type": "input", "style": { "background": "#6366f1", "color": "white", "fontWeight": "bold", "padding": "10px 15px", "borderRadius": "8px" } },
            { "id": "2", "data": { "label": "一级节点1" }, "position": { "x": 150, "y": 180 }, "style": { "background": "#8b5cf6", "color": "white", "padding": "8px 12px", "borderRadius": "6px" } },
            { "id": "3", "data": { "label": "一级节点2" }, "position": { "x": 400, "y": 180 }, "style": { "background": "#ec4899", "color": "white", "padding": "8px 12px", "borderRadius": "6px" } },
            { "id": "4", "data": { "label": "一级节点3" }, "position": { "x": 650, "y": 180 }, "style": { "background": "#f59e0b", "color": "white", "padding": "8px 12px", "borderRadius": "6px" } },
            { "id": "2-1", "data": { "label": "二级节点1" }, "position": { "x": 50, "y": 300 } }
          ],
          "edges": [
            { "id": "e1-2", "source": "1", "target": "2", "style": { "stroke": "#6366f1", "strokeWidth": 2 }, "markerEnd": { "type": "arrowclosed", "color": "#6366f1" } },
            { "id": "e1-3", "source": "1", "target": "3", "style": { "stroke": "#6366f1", "strokeWidth": 2 }, "markerEnd": { "type": "arrowclosed", "color": "#6366f1" } },
            { "id": "e2-2-1", "source": "2", "target": "2-1", "style": { "stroke": "#6366f1", "strokeWidth": 2 }, "markerEnd": { "type": "arrowclosed", "color": "#6366f1" } }
          ]
        }
        
        生成规则：
        1. 根节点只有1个，id为"1"，type为"input"，位置在顶部中央
        2. 一级节点数量建议3-6个，均匀分布在根节点下方
        3. 每个一级节点下可以有2-5个二级节点
        4. 总节点数量控制在10-30个之间，层级不超过3层
        5. 节点位置分布合理，避免重叠，x坐标从左到右递增，y坐标从上到下递增
        6. 内容要完全符合用户需求，逻辑清晰，结构合理
        7. 一级节点使用不同的背景色，风格统一
        8. 严格按照JSON格式输出，不要添加任何其他内容、注释或解释
      `;

      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.6,
        max_tokens: 4000,
      });

      const content = response.choices[0].message.content;
      
      // 清理返回内容，只保留JSON部分
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        mindMapData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('返回内容不是有效的JSON格式');
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

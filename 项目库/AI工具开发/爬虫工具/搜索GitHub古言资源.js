const axios = require('axios');
const fs = require('fs');
const path = require('path');

const headers = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'application/vnd.github.v3+json'
};

async function searchGitHub() {
  console.log('开始搜索GitHub公开古言小说资源...');
  const queries = [
    'ancient chinese romance novel',
    'chinese historical romance',
    'novel collection chinese',
    'gufeng novel',
    'classical chinese novel',
    'chinese romance novel txt',
    'historical detective novel chinese'
  ];

  const resources = [];

  for (const query of queries) {
    try {
      const res = await axios.get(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=30`, { headers, timeout: 15000 });
      
      for (const repo of res.data.items) {
        const desc = (repo.description || '').toLowerCase();
        if (repo.stargazers_count >= 50 && (desc.includes('novel') || desc.includes('romance') || desc.includes('chinese') || desc.includes('fiction'))) {
          resources.push({
            项目名称: repo.name,
            作者: repo.owner.login,
            描述: repo.description || '无描述',
            星数: repo.stargazers_count,
            地址: repo.html_url,
            主要内容: query
          });
        }
      }
      
      console.log(`搜索"${query}"完成，找到${res.data.items.length}个相关项目`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (e) {
      console.log(`搜索"${query}"失败: ${e.message}`);
    }
  }

  // 去重
  const uniqueResources = Array.from(new Map(resources.map(r => [r.地址, r])).values());
  console.log(`共找到${uniqueResources.length}个公开古言相关资源项目`);

  // 追加到知识库
  const outputPath = '/Users/bytedance/.openclaw/workspace/项目库/晋江文学小说/古言知识库_v2.0.md';
  let md = fs.readFileSync(outputPath, 'utf8');
  
  // 移除旧的GitHub部分
  md = md.split('## GitHub公开古言资源合集')[0];
  
  md += `\n\n## GitHub公开古言资源合集\n\n`;
  md += `本部分收集GitHub上公开的优秀古言小说及相关资源，用于文笔和逻辑学习参考，所有资源均为公开项目，合规使用。\n\n`;
  
  if (uniqueResources.length > 0) {
    uniqueResources.forEach((res, idx) => {
      md += `### ${idx+1}. ${res.项目名称}\n`;
      md += `- **作者:** ${res.作者}\n`;
      md += `- **星数:** ${res.星数} ⭐\n`;
      md += `- **描述:** ${res.描述}\n`;
      md += `- **资源地址:** [${res.地址}](${res.地址})\n`;
      md += `- **相关类型:** ${res.主要内容}\n\n`;
    });
  } else {
    md += `### 资源说明\n当前未搜索到公开的古言小说全本资源。建议通过合法渠道获取相关作品用于学习参考，可重点关注以下优秀古言作品类型：\n- 宫廷侯爵类：《朱门锦绣》、《权臣养妻日常》、《嫡谋》\n- 强取豪夺类：《宦妃天下》、《重生之豪门媳妇》、《折腰》\n- 探案言情类：《簪中录》、《金玉满唐》、《仵作娘子》\n\n这些作品均为古言领域经典代表作，可学习其文笔风格、剧情架构、人物塑造等写作技巧，尤其适合用于"古代宫廷侯爵强取豪夺+探案"类型小说的创作参考。\n`;
  }

  // 增加创作指南部分
  md += `\n\n## 古言创作参考指南（宫廷侯爵+强取豪夺+探案）\n\n`;
  md += `### 核心要素总结\n1. **宫廷侯爵背景**：突出等级制度、家族势力、权力斗争、礼仪规范\n2. **强取豪夺感情线**：权力悬殊、强制爱恋、情感拉扯、追妻火葬场\n3. **探案主线**：连环案件、朝堂阴谋、推理逻辑、男女主协作\n\n### 写作技巧参考\n- **人物塑造**：男主多为位高权重的权臣/侯爷/王爷，性格冷酷偏执；女主多为聪慧坚韧的罪臣之女/世家千金/底层仵作，有特殊技能（验尸、推理、医术等）\n- **剧情节奏**：探案线为主线，感情线穿插其中，案件逐步升级，最终牵扯出朝堂大阴谋\n- **情感张力**：利用权力差距制造冲突，男主从强取豪夺到逐渐动心，女主从抗拒到慢慢接受，情感转变自然合理\n- **逻辑严谨**：探案部分注重证据链、推理过程，避免BUG，案件设计要有社会背景和动机支撑\n`;

  fs.writeFileSync(outputPath, md, 'utf8');
  console.log(`知识库已更新完成，文件路径: ${outputPath}`);
  console.log(`知识库大小: ${(fs.statSync(outputPath).size / 1024).toFixed(2)}KB`);
}

searchGitHub().catch(console.error);

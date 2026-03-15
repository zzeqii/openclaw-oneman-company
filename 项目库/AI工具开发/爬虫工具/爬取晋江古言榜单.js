const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');

// 晋江古言6大榜单URL
const rankUrls = {
  新晋: 'https://www.jjwxc.net/topten.php?chan=2&subchan=1&type=1',
  VIP强推: 'https://www.jjwxc.net/topten.php?chan=2&subchan=1&type=2',
  编辑推荐: 'https://www.jjwxc.net/topten.php?chan=2&subchan=1&type=3',
  月榜: 'https://www.jjwxc.net/topten.php?chan=2&subchan=1&type=4',
  季榜: 'https://www.jjwxc.net/topten.php?chan=2&subchan=1&type=5',
  年榜: 'https://www.jjwxc.net/topten.php?chan=2&subchan=1&type=6'
};

const headers = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Referer': 'https://www.jjwxc.net/'
};

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getNovelInfo(url) {
  try {
    const res = await axios.get(url, { headers, timeout: 10000, responseType: 'arraybuffer' });
    const html = iconv.decode(res.data, 'gbk');
    const $ = cheerio.load(html, { decodeEntities: false });
    
    // 排除耽美
    const tags = $('.smallreadbody .bluetext').text().trim();
    if (tags.includes('耽美') || tags.includes('纯爱')) {
      return null;
    }

    const title = $('h1').text().trim();
    const author = $('span[itemprop="author"]').text().trim();
    const allTags = $('.smallreadbody .bluetext').map((i, el) => $(el).text().trim()).get().filter(t => t);
    
    // 核心卖点（一般在文案开头）
    const intro = $('.smallreadbody').text().trim();
    const coreSell = intro.split('\n')[0] || '';
    
    // 核心剧情
    const corePlot = intro.split('\n').slice(1, 10).join('\n').trim();
    
    // 读者评价（最新评论）
    const comments = $('.commenttext').map((i, el) => $(el).text().trim()).get().slice(0, 3);

    return {
      书名: title,
      作者: author,
      标签: allTags.join('、'),
      核心卖点: coreSell,
      核心剧情: corePlot,
      读者评价: comments.join('\n\n')
    };
  } catch (e) {
    console.log(`获取小说信息失败: ${url}, 错误: ${e.message}`);
    return null;
  }
}

async function crawlRank(rankName, url) {
  console.log(`开始爬取${rankName}榜单...`);
  const novels = [];
  
  try {
    const res = await axios.get(url, { headers, timeout: 10000, responseType: 'arraybuffer' });
    const html = iconv.decode(res.data, 'gbk');
    const $ = cheerio.load(html, { decodeEntities: false });
    
    const links = $('a[href*="onebook.php?novelid"]').map((i, el) => {
      const href = $(el).attr('href');
      return href.startsWith('http') ? href : `https://www.jjwxc.net/${href}`;
    }).get().slice(0, 100);

    for (let i = 0; i < links.length; i++) {
      console.log(`爬取${rankName}第${i+1}/${links.length}本: ${links[i]}`);
      const novel = await getNovelInfo(links[i]);
      if (novel) {
        novels.push(novel);
      }
      await sleep(2000); // 避免请求过快
    }
  } catch (e) {
    console.log(`爬取${rankName}榜单失败: ${e.message}`);
  }

  console.log(`${rankName}榜单爬取完成，共获取${novels.length}本有效古言小说`);
  return novels;
}

async function main() {
  const allNovels = {};
  
  for (const [name, url] of Object.entries(rankUrls)) {
    allNovels[name] = await crawlRank(name, url);
    await sleep(5000);
  }

  // 生成Markdown
  let md = `# 晋江古言知识库 v2.0\n\n更新时间: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}\n\n`;
  md += `## 说明\n本知识库收录晋江古代言情6大榜单TOP100言情类小说（排除耽美），用于古代言情小说创作学习参考。\n\n`;

  for (const [rankName, novels] of Object.entries(allNovels)) {
    md += `## ${rankName}榜单\n\n`;
    novels.forEach((novel, idx) => {
      md += `### ${idx+1}. ${novel.书名}\n`;
      md += `- **作者:** ${novel.作者}\n`;
      md += `- **标签:** ${novel.标签}\n`;
      md += `- **核心卖点:** ${novel.核心卖点}\n`;
      md += `- **核心剧情:**\n${novel.核心剧情}\n`;
      md += `- **读者评价:**\n${novel.读者评价}\n\n`;
    });
  }

  // 保存文件
  const outputPath = '/Users/bytedance/.openclaw/workspace/项目库/晋江文学小说/古言知识库_v2.0.md';
  fs.writeFileSync(outputPath, md, 'utf8');
  console.log(`知识库已保存到: ${outputPath}`);
}

main().catch(console.error);

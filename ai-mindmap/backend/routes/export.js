const puppeteer = require('puppeteer');
const markdownpdf = require('markdown-pdf');
const fs = require('fs');
const path = require('path');

const exportMindMap = async (req, res) => {
  try {
    const { format, nodes, edges, svg } = req.body;
    
    if (!format || !nodes || !edges) {
      return res.status(400).json({ error: '参数不完整' });
    }

    switch (format) {
      case 'json':
        exportJson(res, { nodes, edges });
        break;
      case 'markdown':
        exportMarkdown(res, { nodes, edges });
        break;
      case 'pdf':
        await exportPdf(res, { nodes, edges });
        break;
      case 'png':
        await exportPng(res, svg);
        break;
      default:
        res.status(400).json({ error: '不支持的导出格式' });
    }
  } catch (error) {
    console.error('导出失败:', error);
    res.status(500).json({ error: '导出失败，请稍后重试' });
  }
};

function exportJson(res, data) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename=mindmap.json');
  res.send(JSON.stringify(data, null, 2));
}

function exportMarkdown(res, { nodes, edges }) {
  const rootNode = nodes.find(n => n.type === 'input');
  if (!rootNode) {
    return res.status(400).json({ error: '找不到根节点' });
  }

  const buildTree = (nodeId, level = 0) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return '';
    
    const children = edges
      .filter(e => e.source === nodeId)
      .map(e => buildTree(e.target, level + 1));
    
    return `${'#'.repeat(level + 1)} ${node.data.label}\n\n${children.join('')}`;
  };

  const markdown = buildTree(rootNode.id);
  
  res.setHeader('Content-Type', 'text/markdown');
  res.setHeader('Content-Disposition', 'attachment; filename=mindmap.md');
  res.send(markdown);
}

async function exportPdf(res, { nodes, edges }) {
  const rootNode = nodes.find(n => n.type === 'input');
  if (!rootNode) {
    return res.status(400).json({ error: '找不到根节点' });
  }

  const buildTree = (nodeId, level = 0) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return '';
    
    const children = edges
      .filter(e => e.source === nodeId)
      .map(e => buildTree(e.target, level + 1));
    
    return `${'#'.repeat(level + 1)} ${node.data.label}\n\n${children.join('')}`;
  };

  const markdown = buildTree(rootNode.id);
  const tempMdPath = path.join(__dirname, '../temp.md');
  const tempPdfPath = path.join(__dirname, '../temp.pdf');

  fs.writeFileSync(tempMdPath, markdown);

  await new Promise((resolve, reject) => {
    markdownpdf().from(tempMdPath).to(tempPdfPath, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  const pdfBuffer = fs.readFileSync(tempPdfPath);
  
  fs.unlinkSync(tempMdPath);
  fs.unlinkSync(tempPdfPath);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=mindmap.pdf');
  res.send(pdfBuffer);
}

async function exportPng(res, svg) {
  if (!svg) {
    return res.status(400).json({ error: 'SVG数据不能为空' });
  }

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  const html = `
    <html>
      <body style="margin: 0; padding: 0;">
        ${svg}
      </body>
    </html>
  `;

  await page.setContent(html);
  const element = await page.$('svg');
  const screenshot = await element.screenshot({ type: 'png' });
  
  await browser.close();

  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Content-Disposition', 'attachment; filename=mindmap.png');
  res.send(screenshot);
}

module.exports = exportMindMap;

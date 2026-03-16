/**
 * jinjiang-original-novel-writer - 晋江原创小说全自动创作skill
 * 功能：
 * 1. 基于晋江爆款古言知识库沉淀，精准踩中所有爆款元素
 * 2. 根据大纲自动写作，一章接一章，全自动推进
 * 3. 严格遵循晋江节奏：免费章20章，每章都有钩子，入V卡点悬念拉满
 * 4. 自动归档，提交Git，完成自动汇报
 */

const fs = require('fs');
const path = require('path');

class JinjiangOriginalNovelWriter {
  constructor() {
    this.basePath = '/Users/bytedance/.openclaw/workspace/项目库/晋江文学小说/';
    this.logFile = path.join(__dirname, 'writer.log');
    this.working = false;
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logMsg = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(this.logFile, logMsg);
    console.log(logMsg);
  }

  // 获取小说大纲
  loadNovelOutline(novelDir) {
    const fullPath = path.join(this.basePath, novelDir);
    const files = fs.readdirSync(fullPath);
    const outlineFile = files.find(f => f.includes('大纲') && f.endsWith('.md'));
    
    if (!outlineFile) {
      this.log(`[${novelDir}] 未找到大纲文件`);
      return null;
    }

    const outline = fs.readFileSync(path.join(fullPath, outlineFile), 'utf8');
    this.log(`[${novelDir}] 加载大纲成功: ${outlineFile}`);
    return {
      name: novelDir,
      outline,
      outlinePath: path.join(fullPath, outlineFile),
      chapterDir: path.join(fullPath, '草稿', 'chapters'),
    };
  }

  // 获取下一章需要写的章节号
  getNextChapter(chapterDir) {
    if (!fs.existsSync(chapterDir)) {
      fs.mkdirSync(chapterDir, { recursive: true });
      return 1;
    }

    const files = fs.readdirSync(chapterDir);
    const chapterFiles = files.filter(f => f.startsWith('第') && f.endsWith('.md'));
    return chapterFiles.length + 1;
  }

  // 提取章节标题从大纲
  extractChapterTitles(outline) {
    const regex = /第\d+章[^\n]*/g;
    const matches = outline.match(regex);
    if (!matches) return [];
    
    return matches.map(m => {
      // 提取章节号和标题
      const parts = m.split(/\s+/);
      const chapterNum = parseInt(m.match(/第(\d+)章/)[1]);
      const title = m.replace(/第\d+章\s*/, '').trim();
      return { num: chapterNum, title };
    });
  }

  // 写作一章
  async writeChapter(novel, chapterNum, title) {
    this.working = true;
    this.log(`[${novel.name}] 开始写作第${chapterNum}章: ${title}`);

    const filePath = path.join(novel.chapterDir, `第${chapterNum}章_${title}.md`);
    
    // 实际写作由Agent完成，这里只记录等待
    // Agent会接收到需要写作的通知，生成后保存到这个路径
    
    return new Promise((resolve) => {
      // 检查文件是否生成完成
      const checkInterval = setInterval(() => {
        if (fs.existsSync(filePath) && fs.statSync(filePath).size > 2000) {
          clearInterval(checkInterval);
          this.log(`[${novel.name}] 第${chapterNum}章 ${title} 完成，大小: ${fs.statSync(filePath).size} bytes`);
          this.working = false;
          resolve({ success: true, filePath });
        }
      }, 10000); // 每10秒检查一次
    });
  }

  // 自动写作一批章节
  async autoWriteBatch(novelDir, batchSize = 5) {
    const novel = this.loadNovelOutline(novelDir);
    if (!novel) return { success: false, error: '无法加载大纲' };

    const nextChapter = this.getNextChapter(novel.chapterDir);
    this.log(`[${novel.name}] 开始自动写作批次，从第${nextChapter}章开始，批量${batchSize}章`);

    const result = [];
    for (let i = 0; i < batchSize; i++) {
      const chapterNum = nextChapter + i;
      // 从大纲获取标题，这里简化处理
      const title = this.getChapterTitleFromOutline(novel.outline, chapterNum);
      if (!title) {
        this.log(`[${novel.name}] 找不到第${chapterNum}章标题，停止批量写作`);
        break;
      }
      
      const writeResult = await this.writeChapter(novel, chapterNum, title);
      if (writeResult.success) {
        result.push(writeResult);
      }
    }

    this.log(`[${novel.name}] 批量写作完成，成功 ${result.length} 章`);
    return {
      success: true,
      novel,
      batchSize,
      completed: result.length,
      chapters: result,
    };
  }

  // 从大纲提取章节标题
  getChapterTitleFromOutline(outline, chapterNum) {
    const lines = outline.split('\n');
    const chapterLine = lines.find(line => line.startsWith(`- **第${chapterNum}章`));
    if (!chapterLine) return null;
    const match = chapterLine.match(/\*\*(.*?)\*\*/);
    if (!match) return null;
    return match[1].replace(/第\d+章\s*/, '').trim();
  }

  // 完成批量后自动提交Git
  autoCommit(novelName, completedCount) {
    const { execSync } = require('child_process');
    try {
      execSync('cd /Users/bytedance/.openclaw/workspace && git add .', { encoding: 'utf8' });
      const message = `feat: ${novelName} 完成${completedCount}章写作`;
      execSync(`cd /Users/bytedance/.openclaw/workspace && git commit -m "${message}"`, { encoding: 'utf8' });
      execSync('cd /Users/bytedance/.openclaw/workspace && git push origin feature/current-writing', { encoding: 'utf8' });
      this.log(`✅ Git提交完成: ${message}`);
      return true;
    } catch (e) {
      this.log(`❌ Git提交失败: ${e.message}`);
      return false;
    }
  }

  // 启动自动写作循环
  startAutoWrite(novelDir, batchSize = 5, interval = 60000) {
    this.log(`=== 启动晋江小说自动写作: ${novelDir}, 批量 ${batchSize}章 ===`);
    
    // 立即开始第一批
    setTimeout(() => {
      this.autoWriteBatch(novelDir, batchSize);
    }, 5000);

    // 定期检查继续写作
    setInterval(() => {
      if (!this.working) {
        const novel = this.loadNovelOutline(novelDir);
        const nextChapter = this.getNextChapter(novel.chapterDir);
        const totalTarget = 20; // 目标20章入V
        
        if (nextChapter <= totalTarget) {
          const remaining = Math.min(batchSize, totalTarget - nextChapter + 1);
          this.log(`[${novelDir}] 继续写作，剩余 ${remaining} 章到20章入V`);
          this.autoWriteBatch(novelDir, remaining);
        } else {
          this.log(`[${novelDir}] 已完成20章入V目标，等待下一步指示`);
        }
      }
    }, interval);
  }
}

// 启动
if (require.main === module) {
  const writer = new JinjiangOriginalNovelWriter();
  // 默认启动《金枝囚》自动写作
  writer.startAutoWrite('金枝囚', 5);
}

module.exports = JinjiangOriginalNovelWriter;

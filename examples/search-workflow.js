const AgentBrowser = require('../agent-browser');

/**
 * 公开信息搜索工作流示例：搜索并提取竞争对手产品信息
 */
async function competitorResearch(keyword, pages = 3) {
    const browser = new AgentBrowser();
    const allResults = [];
    
    try {
        console.log(`🚀 开始竞品调研: ${keyword}`);
        await browser.init();

        // 多引擎搜索
        const engines = ['baidu', 'bing'];
        for (const engine of engines) {
            console.log(`\n🔍 正在使用 ${engine} 搜索...`);
            const results = await browser.search(keyword, engine);
            console.log(`   获取到 ${results.length} 条结果`);
            
            // 只保留前N条有效结果
            const validResults = results.slice(0, pages);
            allResults.push(...validResults);
        }

        // 去重
        const uniqueResults = Array.from(new Map(allResults.map(item => [item.url, item])).values());
        console.log(`\n📊 共获取到 ${uniqueResults.length} 条不重复结果`);

        // 批量爬取内容
        const extractedData = [];
        for (let i = 0; i < uniqueResults.length; i++) {
            const result = uniqueResults[i];
            console.log(`\n📄 正在爬取 (${i+1}/${uniqueResults.length}): ${result.title}`);
            
            try {
                await browser.navigate(result.url);
                await browser.waitForTimeout(2000);
                
                // 提取核心内容
                const content = await browser.extractContent();
                extractedData.push({
                    title: result.title,
                    url: result.url,
                    snippet: result.snippet,
                    pageTitle: content.title,
                    h1: content.h1,
                    contentSummary: content.paragraphs.slice(0, 10).join('\n\n'),
                    keyLinks: content.links.slice(0, 5),
                    crawledAt: new Date().toISOString()
                });

                // 保存截图
                await browser.screenshot(`competitor-${i+1}`);
                
            } catch (error) {
                console.log(`   ❌ 爬取失败: ${error.message}`);
                continue;
            }
        }

        // 保存结果
        const outputPath = require('path').join(__dirname, '../output', `competitor-research-${Date.now()}.json`);
        await require('fs').promises.mkdir(require('path').dirname(outputPath), { recursive: true });
        await require('fs').promises.writeFile(outputPath, JSON.stringify(extractedData, null, 2), 'utf8');
        
        console.log(`\n✅ 调研完成，结果已保存到: ${outputPath}`);
        return extractedData;

    } catch (error) {
        console.error('❌ 调研失败:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

/**
 * 知识库学习工作流：爬取文档并整理内容
 */
async function knowledgeBaseLearning(docUrl, outputDir) {
    const browser = new AgentBrowser();
    
    try {
        console.log(`📚 开始知识库学习: ${docUrl}`);
        await browser.init();
        await browser.navigate(docUrl);
        
        // 提取所有导航链接
        const navLinks = await browser.$$eval('nav a, .sidebar a', links => 
            links.map(link => ({
                text: link.textContent.trim(),
                href: link.href
            })).filter(link => link.href.startsWith(docUrl) && link.text)
        );
        console.log(`🔗 发现 ${navLinks.length} 个文档页面`);

        const knowledgeBase = [];
        for (let i = 0; i < navLinks.length; i++) {
            const link = navLinks[i];
            console.log(`\n📖 正在学习 (${i+1}/${navLinks.length}): ${link.text}`);
            
            try {
                await browser.navigate(link.href);
                await browser.scrollToBottom();
                
                const content = await browser.extractContent({
                    article: 'article, .content, .doc-content'
                });
                
                knowledgeBase.push({
                    title: link.text,
                    url: link.href,
                    content: content.paragraphs.join('\n'),
                    headings: content.h1.concat(content.h2 || []),
                    learnedAt: new Date().toISOString()
                });
                
            } catch (error) {
                console.log(`   ❌ 学习失败: ${error.message}`);
                continue;
            }
        }

        // 保存为Markdown
        const outputPath = require('path').join(outputDir, `knowledge-base-${Date.now()}.md`);
        let markdown = `# 知识库学习结果\n\n来源: ${docUrl}\n学习时间: ${new Date().toLocaleString()}\n\n`;
        
        knowledgeBase.forEach(item => {
            markdown += `## ${item.title}\n\n`;
            markdown += `原文链接: ${item.url}\n\n`;
            markdown += `${item.content}\n\n---\n\n`;
        });
        
        await require('fs').promises.writeFile(outputPath, markdown, 'utf8');
        console.log(`\n✅ 知识库学习完成，结果已保存到: ${outputPath}`);
        
        return knowledgeBase;

    } catch (error) {
        console.error('❌ 知识库学习失败:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

// 运行示例
if (require.main === module) {
    // 竞品调研示例
    competitorResearch('低代码平台 竞品分析', 3).catch(console.error);
    
    // 知识库学习示例
    // knowledgeBaseLearning('https://docs.openclaw.dev', './output').catch(console.error);
}

module.exports = { competitorResearch, knowledgeBaseLearning };

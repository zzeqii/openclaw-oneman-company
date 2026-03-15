const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

class AgentBrowser {
    constructor() {
        this.browser = null;
        this.page = null;
        this.downloadPath = path.join(__dirname, 'downloads');
    }

    async init(headless = 'new') {
        await fs.mkdir(this.downloadPath, { recursive: true });
        this.browser = await puppeteer.launch({
            headless: headless,
            defaultViewport: { width: 1920, height: 1080 },
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--start-maximized'
            ]
        });
        this.page = await this.browser.newPage();
        await this.page.setDefaultNavigationTimeout(60000);
        await this.page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36');
    }

    async search(query, engine = 'google') {
        const searchUrls = {
            google: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
            bing: `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
            duckduckgo: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
            baidu: `https://www.baidu.com/s?wd=${encodeURIComponent(query)}`
        };

        if (!searchUrls[engine]) {
            throw new Error(`Unsupported search engine: ${engine}`);
        }

        await this.page.goto(searchUrls[engine], { waitUntil: 'networkidle2' });
        return this.extractSearchResults(engine);
    }

    async extractSearchResults(engine) {
        const selectors = {
            google: {
                items: 'div.g',
                title: 'h3',
                url: 'a',
                snippet: 'div.VwiC3b'
            },
            bing: {
                items: 'li.b_algo',
                title: 'h2',
                url: 'a',
                snippet: 'p'
            },
            duckduckgo: {
                items: 'div.result',
                title: 'h2 a',
                url: 'h2 a',
                snippet: 'div.result__snippet'
            },
            baidu: {
                items: 'div.result.c-container',
                title: 'h3',
                url: 'h3 a',
                snippet: 'div.c-abstract'
            }
        };

        const sel = selectors[engine];
        return await this.page.evaluate((sel) => {
            const results = [];
            document.querySelectorAll(sel.items).forEach((item, index) => {
                const titleEl = item.querySelector(sel.title);
                const urlEl = item.querySelector(sel.url);
                const snippetEl = item.querySelector(sel.snippet);
                
                if (titleEl && urlEl) {
                    results.push({
                        rank: index + 1,
                        title: titleEl.textContent.trim(),
                        url: urlEl.href,
                        snippet: snippetEl ? snippetEl.textContent.trim() : ''
                    });
                }
            });
            return results;
        }, sel);
    }

    async navigate(url, waitFor = 'networkidle2') {
        return await this.page.goto(url, { waitUntil: waitFor });
    }

    async click(selector, options = {}) {
        await this.page.waitForSelector(selector, { timeout: options.timeout || 5000 });
        if (options.force || options.jsClick) {
            return await this.page.$eval(selector, el => el.click());
        }
        return await this.page.click(selector, options);
    }

    async fill(selector, text) {
        await this.page.waitForSelector(selector, { timeout: 5000 });
        await this.page.type(selector, text, { delay: 100 });
    }

    async submit(selector) {
        await this.page.waitForSelector(selector, { timeout: 5000 });
        return await this.page.$eval(selector, form => form.submit());
    }

    async extractContent(selectors = {}) {
        const defaultSelectors = {
            title: 'title',
            h1: 'h1',
            paragraphs: 'p',
            links: 'a',
            images: 'img',
            lists: 'ul, ol'
        };

        const mergedSelectors = { ...defaultSelectors, ...selectors };
        return await this.page.evaluate((selectors) => {
            const content = {};
            
            if (selectors.title) {
                content.title = document.querySelector(selectors.title)?.textContent?.trim() || '';
            }
            
            if (selectors.h1) {
                content.h1 = Array.from(document.querySelectorAll(selectors.h1)).map(el => el.textContent.trim());
            }
            
            if (selectors.paragraphs) {
                content.paragraphs = Array.from(document.querySelectorAll(selectors.paragraphs))
                    .map(el => el.textContent.trim())
                    .filter(p => p.length > 0);
            }
            
            if (selectors.links) {
                content.links = Array.from(document.querySelectorAll(selectors.links))
                    .map(el => ({
                        text: el.textContent.trim(),
                        href: el.href,
                        rel: el.rel
                    }))
                    .filter(link => link.href && link.href.startsWith('http'));
            }
            
            if (selectors.images) {
                content.images = Array.from(document.querySelectorAll(selectors.images))
                    .map(el => ({
                        src: el.src,
                        alt: el.alt,
                        title: el.title
                    }))
                    .filter(img => img.src && img.src.startsWith('http'));
            }
            
            if (selectors.lists) {
                content.lists = Array.from(document.querySelectorAll(selectors.lists))
                    .map(list => ({
                        type: list.tagName.toLowerCase(),
                        items: Array.from(list.querySelectorAll('li')).map(li => li.textContent.trim())
                    }));
            }
            
            content.html = document.documentElement.outerHTML;
            content.text = document.body.textContent.trim();
            
            return content;
        }, mergedSelectors);
    }

    async extractTable(selector) {
        await this.page.waitForSelector(selector, { timeout: 5000 });
        return await this.page.evaluate((tableSelector) => {
            const table = document.querySelector(tableSelector);
            if (!table) return null;
            
            const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim());
            const rows = Array.from(table.querySelectorAll('tr')).map(tr => 
                Array.from(tr.querySelectorAll('td')).map(td => td.textContent.trim())
            );
            
            return { headers, rows };
        }, selector);
    }

    async screenshot(name = 'screenshot') {
        const filePath = path.join(this.downloadPath, `${name}-${Date.now()}.png`);
        await this.page.screenshot({ path: filePath, fullPage: true });
        return filePath;
    }

    async savePage(name = 'page') {
        const content = await this.page.content();
        const filePath = path.join(this.downloadPath, `${name}-${Date.now()}.html`);
        await fs.writeFile(filePath, content, 'utf8');
        return filePath;
    }

    async scrollToBottom() {
        await this.page.evaluate(() => {
            return new Promise((resolve) => {
                let totalHeight = 0;
                const distance = 100;
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });
        await this.page.waitForTimeout(1000);
    }

    async waitForSelector(selector, timeout = 5000) {
        return await this.page.waitForSelector(selector, { timeout });
    }

    async waitForTimeout(ms) {
        return await this.page.waitForTimeout(ms);
    }

    async waitForNavigation(options = {}) {
        return await this.page.waitForNavigation(options);
    }

    async evaluate(fn, ...args) {
        return await this.page.evaluate(fn, ...args);
    }

    async $eval(selector, fn, ...args) {
        return await this.page.$eval(selector, fn, ...args);
    }

    async $$eval(selector, fn, ...args) {
        return await this.page.$$eval(selector, fn, ...args);
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
        }
    }
}

module.exports = AgentBrowser;

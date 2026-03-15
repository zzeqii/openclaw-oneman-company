const AgentBrowser = require('./agent-browser');

async function testSearch() {
    const browser = new AgentBrowser();
    try {
        console.log('Initializing browser...');
        await browser.init();

        console.log('Testing Google search for "OpenClaw"...');
        const results = await browser.search('OpenClaw 自动化框架', 'baidu');
        console.log(`Found ${results.length} results:`);
        results.slice(0, 5).forEach(result => {
            console.log(`\n${result.rank}. ${result.title}`);
            console.log(`   URL: ${result.url}`);
            console.log(`   Snippet: ${result.snippet.substring(0, 100)}...`);
        });

        if (results.length > 0) {
            console.log(`\nNavigating to first result: ${results[0].url}`);
            await browser.navigate(results[0].url);
            
            console.log('Extracting page content...');
            const content = await browser.extractContent();
            console.log(`Page title: ${content.title}`);
            console.log(`H1 headings: ${content.h1.join(', ')}`);
            console.log(`Found ${content.paragraphs.length} paragraphs, ${content.links.length} links`);
            
            console.log('Taking screenshot...');
            const screenshotPath = await browser.screenshot('openclaw-page');
            console.log(`Screenshot saved to: ${screenshotPath}`);
            
            console.log('Saving page HTML...');
            const pagePath = await browser.savePage('openclaw-page');
            console.log(`Page saved to: ${pagePath}`);
        }

        console.log('\n✅ All tests passed!');
    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await browser.close();
    }
}

async function testFormInteraction() {
    const browser = new AgentBrowser();
    try {
        console.log('\n\nTesting form interaction with Baidu homepage...');
        await browser.init();
        
        await browser.navigate('https://www.baidu.com');
        console.log('Navigated to Baidu homepage');
        
        await browser.fill('#kw', 'Puppeteer 自动化');
        console.log('Filled search input');
        
        await browser.click('#su');
        console.log('Clicked search button');
        
        await browser.waitForNavigation({ waitUntil: 'networkidle2' });
        console.log('Search completed');
        
        const content = await browser.extractContent();
        console.log(`Search results page title: ${content.title}`);
        
    } catch (error) {
        console.error('❌ Form test failed:', error);
    } finally {
        await browser.close();
    }
}

async function runAllTests() {
    await testSearch();
    await testFormInteraction();
    console.log('\n🎉 All browser functionality tests completed!');
}

runAllTests();

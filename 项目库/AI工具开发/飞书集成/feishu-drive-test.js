
const { FeishuDrive } = require('/opt/homebrew/lib/node_modules/openclaw/extensions/feishu/lib/drive');

async function test() {
  const drive = new FeishuDrive({
    appId: 'cli_a924dbde2bfb1bb6',
    appSecret: '0XRZDe97cdAJXfEptBhuDywhIhHwqjdh'
  });

  try {
    // Try to create root folder
    const result = await drive.createFolder('商业化项目总看板');
    console.log('Create folder result:', result);
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
  }
}

test();

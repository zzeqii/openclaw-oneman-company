
const Lark = require("@larksuiteoapi/node-sdk");
const fs = require("fs");
const path = require("path");
require('dotenv').config({ path: path.join(__dirname, '../../../../.env.feishu') });

const APP_ID = process.env.FEISHU_APP_ID;
const APP_SECRET = process.env.FEISHU_APP_SECRET;
const OWNER_USER_ID = process.env.FEISHU_OWNER_OPEN_ID;
const WORKSPACE_DIR = "/Users/bytedance/.openclaw/workspace";

const client = new Lark.Client({
  appId: APP_ID,
  appSecret: APP_SECRET,
});

async function getRootFolderToken() {
  try {
    const res = await client.request({
      method: "GET",
      url: "https://open.feishu.cn/open-apis/drive/explorer/v2/root_folder/meta",
    });
    if (res.code === 0) return res.data.token;
  } catch (err) {
    console.warn("Failed to get root folder token, using fallback '0'");
  }
  return "0";
}

async function createFolder(name, parentFolderToken) {
  const res = await client.drive.file.createFolder({
    data: {
      name,
      folder_token: parentFolderToken,
    },
  });
  if (res.code !== 0) throw new Error(`Failed to create folder ${name}: ${res.msg}`);
  console.log(`Created folder: ${name} (${res.data.url})`);
  return res.data;
}

async function addFolderPermission(folderToken, userId, perm = "full_access") {
  const res = await client.request({
    method: "POST",
    url: `https://open.feishu.cn/open-apis/drive/v1/permissions/${folderToken}/members`,
    params: { type: "folder" },
    data: {
      member_type: "openid",
      member_id: userId,
      perm: "full_access",
    },
  });
  if (res.code !== 0) throw new Error(`Failed to add permission: ${JSON.stringify(res.data)}`);
  console.log(`Added ${perm} permission for user ${userId} to folder ${folderToken}`);
}

async function uploadFile(filePath, parentFolderToken) {
  const fileName = path.basename(filePath);
  const fileSize = fs.statSync(filePath).size;
  const fileContent = fs.readFileSync(filePath);

  // Create upload session
  const prepareRes = await client.drive.media.uploadAll({
    data: {
      file_name: fileName,
      parent_type: "explorer",
      parent_node: parentFolderToken,
      size: fileSize,
      file: fileContent,
    },
  });

  if (prepareRes.code !== 0) throw new Error(`Failed to upload ${fileName}: ${prepareRes.msg}`);
  console.log(`Uploaded file: ${fileName}`);
  return prepareRes.data;
}

async function syncDirectory(localDir, parentFolderToken) {
  const entries = fs.readdirSync(localDir, { withFileTypes: true });
  
  for (const entry of entries) {
    // Skip hidden files and system files
    if (entry.name.startsWith(".") || entry.name === ".git" || entry.name === "node_modules") continue;
    
    const fullPath = path.join(localDir, entry.name);
    
    if (entry.isDirectory()) {
      // Create subfolder in Feishu
      const folder = await createFolder(entry.name, parentFolderToken);
      await addFolderPermission(folder.token, OWNER_USER_ID);
      // Recursively sync subdirectory
      await syncDirectory(fullPath, folder.token);
    } else if (entry.isFile()) {
      // Upload file
      await uploadFile(fullPath, parentFolderToken);
    }
  }
}

async function main() {
  try {
    const rootToken = await getRootFolderToken();
    console.log("Using root folder token:", rootToken);
    
    // 1. Create root folder
    const mainFolder = await createFolder("商业化项目总看板", rootToken);
    
    // 2. Add owner permission
    await addFolderPermission(mainFolder.token, OWNER_USER_ID);
    
    // 3. Sync all local content
    await syncDirectory(WORKSPACE_DIR, mainFolder.token);
    
    console.log("\n=== Sync Complete ===");
    console.log("Root folder URL:", mainFolder.url);
    console.log("Root folder token:", mainFolder.token);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

main();

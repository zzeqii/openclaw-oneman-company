
const Lark = require("@larksuiteoapi/node-sdk");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
require('dotenv').config({ path: path.join(__dirname, '../../../../.env.feishu') });

const APP_ID = process.env.FEISHU_APP_ID;
const APP_SECRET = process.env.FEISHU_APP_SECRET;
const OWNER_USER_ID = process.env.FEISHU_OWNER_OPEN_ID;
const WORKSPACE_DIR = "/Users/bytedance/.openclaw/workspace";

const client = new Lark.Client({
  appId: APP_ID,
  appSecret: APP_SECRET,
});

async function getTenantAccessToken() {
  const res = await fetch("https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      app_id: APP_ID,
      app_secret: APP_SECRET,
    }),
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error(`Failed to get token: ${data.msg}`);
  return data.tenant_access_token;
}

async function getRootFolderToken(tenantToken) {
  const res = await fetch("https://open.feishu.cn/open-apis/drive/explorer/v2/root_folder/meta", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tenantToken}`,
    },
  });
  const data = await res.json();
  if (data.code === 0) return data.data.token;
  console.warn("Failed to get root folder token, using fallback '0'");
  return "0";
}

async function createFolder(tenantToken, name, parentFolderToken) {
  const res = await fetch("https://open.feishu.cn/open-apis/drive/v1/files/create_folder", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tenantToken}`,
    },
    body: JSON.stringify({
      name,
      folder_token: parentFolderToken,
    }),
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error(`Failed to create folder ${name}: ${data.msg}`);
  console.log(`Created folder: ${name} (${data.data.url})`);
  return data.data;
}

async function addFolderPermission(tenantToken, folderToken, userId, perm = "full_access") {
  const res = await fetch(`https://open.feishu.cn/open-apis/drive/v1/permissions/${folderToken}/members?type=folder`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tenantToken}`,
    },
    body: JSON.stringify({
      member_type: "openid",
      member_id: userId,
      perm,
    }),
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error(`Failed to add permission: ${JSON.stringify(data)}`);
  console.log(`Added ${perm} permission for user ${userId} to folder ${folderToken}`);
}

async function uploadFile(tenantToken, filePath, parentFolderToken) {
  const fileName = path.basename(filePath);
  const fileSize = fs.statSync(filePath).size;
  const fileStream = fs.createReadStream(filePath);

  const form = new FormData();
  form.append("file_name", fileName);
  form.append("parent_type", "explorer");
  form.append("parent_node", parentFolderToken);
  form.append("size", fileSize);
  form.append("file", fileStream);

  const res = await client.request({
    method: "POST",
    url: "https://open.feishu.cn/open-apis/drive/v1/files/upload_all",
    headers: {
      Authorization: `Bearer ${tenantToken}`,
      ...form.getHeaders(),
    },
    data: form,
  });

  if (res.code !== 0) throw new Error(`Failed to upload ${fileName}: ${res.msg || JSON.stringify(res.data)}`);
  console.log(`Uploaded file: ${fileName}`);
  return res.data;
}

async function syncDirectory(tenantToken, localDir, parentFolderToken) {
  const entries = fs.readdirSync(localDir, { withFileTypes: true });
  
  for (const entry of entries) {
    // Skip hidden files, system files, and generated files
    if (
      entry.name.startsWith(".") || 
      entry.name === ".git" || 
      entry.name === "node_modules" ||
      entry.name.endsWith(".js") ||
      entry.name.endsWith(".json") ||
      entry.name.endsWith(".lock")
    ) continue;
    
    const fullPath = path.join(localDir, entry.name);
    
    if (entry.isDirectory()) {
      // Create subfolder in Feishu
      const folder = await createFolder(tenantToken, entry.name, parentFolderToken);
      await addFolderPermission(tenantToken, folder.token, OWNER_USER_ID);
      // Recursively sync subdirectory
      await syncDirectory(tenantToken, fullPath, folder.token);
    } else if (entry.isFile() && (entry.name.endsWith(".md") || entry.name.endsWith(".html"))) {
      // Only upload markdown and html files (documents)
      await uploadFile(tenantToken, fullPath, parentFolderToken);
    }
  }
}

async function main() {
  try {
    const tenantToken = await getTenantAccessToken();
    console.log("Got tenant access token");
    
    const rootToken = await getRootFolderToken(tenantToken);
    console.log("Using root folder token:", rootToken);
    
    // 1. Create root folder
    const mainFolder = await createFolder(tenantToken, "商业化项目总看板", rootToken);
    
    // 2. Add owner permission
    await addFolderPermission(tenantToken, mainFolder.token, OWNER_USER_ID);
    
    // 3. Sync all local content
    await syncDirectory(tenantToken, WORKSPACE_DIR, mainFolder.token);
    
    console.log("\n=== Sync Complete ===");
    console.log("Root folder URL:", mainFolder.url);
    console.log("Root folder token:", mainFolder.token);
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    process.exit(1);
  }
}

main();

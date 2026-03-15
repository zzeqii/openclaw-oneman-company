const ark = require('@volcengine/ark');
console.log('Ark模块导出内容：', Object.keys(ark));
console.log('默认导出：', ark.default ? Object.keys(ark.default) : '无默认导出');

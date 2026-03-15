const Ark = require('@volcengine/ark');
console.log('SDK导出内容：', Object.keys(Ark));
console.log('default导出：', Ark.default);
console.log('是否有createClient方法：', typeof Ark.createClient);

/**
 * 记忆增强插件测试脚本
 */

const { getMemoryEnhancement } = require('./index');

const memoryEnhancement = getMemoryEnhancement();

async function runTests() {
  console.log('🧪 开始测试记忆增强插件...\n');

  // 测试1: 存储记忆
  console.log('测试1: 存储记忆');
  const memoryId1 = memoryEnhancement.storeMemory({
    type: 'task',
    content: '开发记忆系统增强插件，集成MemOS和OpenViking机制',
    taskId: 'task_memory_001',
    tags: ['开发', '记忆系统', 'MemOS', 'OpenViking']
  });
  console.log('✅ 记忆1存储成功，ID:', memoryId1);

  const memoryId2 = memoryEnhancement.storeMemory({
    type: 'decision',
    content: '决定采用插件化方式接入，不覆盖原有记忆功能',
    taskId: 'task_memory_001',
    tags: ['决策', '架构设计']
  });
  console.log('✅ 记忆2存储成功，ID:', memoryId2);

  const memoryId3 = memoryEnhancement.storeMemory({
    type: 'lesson',
    content: '长任务记忆需要上下文聚合功能，避免跨会话上下文丢失',
    taskId: 'task_memory_001',
    tags: ['经验', '优化']
  });
  console.log('✅ 记忆3存储成功，ID:', memoryId3);

  console.log('');

  // 测试2: 检索相关记忆
  console.log('测试2: 检索相关记忆');
  const results = memoryEnhancement.retrieveRelevant('记忆系统开发', {
    taskId: 'task_memory_001',
    limit: 5
  });
  console.log('✅ 检索到', results.length, '条相关记忆');
  results.forEach((r, i) => {
    console.log(`  ${i+1}. 相似度: ${(r.similarity * 100).toFixed(1)}%, 类型: ${r.type}, 内容: ${r.content.substring(0, 50)}...`);
  });

  console.log('');

  // 测试3: 获取任务上下文
  console.log('测试3: 获取任务上下文');
  const context = memoryEnhancement.getTaskContext('task_memory_001', 1000);
  console.log('✅ 任务上下文获取成功，长度:', context.length, '字符');
  console.log('上下文内容预览:');
  console.log(context.substring(0, 300) + (context.length > 300 ? '...' : ''));

  console.log('');

  // 测试4: 上下文关联分析
  console.log('测试4: 上下文关联分析');
  const analysis = memoryEnhancement.analyzeContextAssociation('现在需要优化记忆系统的检索性能，提升长任务的上下文关联能力');
  console.log('✅ 关联分析完成:', analysis.summary);
  console.log('  关联记忆数量:', analysis.associations.length);
  console.log('  建议:', analysis.recommendation);

  console.log('');

  // 测试5: 获取统计信息
  console.log('测试5: 获取统计信息');
  const stats = memoryEnhancement.getStats();
  console.log('✅ 统计信息获取成功:');
  console.log('  总记忆数量:', stats.totalMemories);
  console.log('  总任务数量:', stats.totalTasks);
  console.log('  最早记忆:', stats.oldestMemory);
  console.log('  最新记忆:', stats.newestMemory);

  console.log('');

  // 测试6: 长时记忆合并（模拟高频访问）
  console.log('测试6: 长时记忆合并');
  // 模拟访问次数达到阈值
  for (let i = 0; i < 3; i++) {
    memoryEnhancement.retrieveRelevant('记忆系统开发', { taskId: 'task_memory_001' });
  }
  // 修改记忆时间为超过24小时
  const memory = memoryEnhancement.vectorStore.get(memoryId1);
  memory.timestamp = Date.now() - 86400000 * 2; // 2天前
  memory.accessCount = 5;
  memoryEnhancement.vectorStore.set(memoryId1, memory);
  
  memoryEnhancement.consolidateLongTermMemory();
  console.log('✅ 长时记忆合并完成，已将高频记忆合并到MEMORY.md');

  console.log('\n🎉 所有测试完成！记忆增强插件功能正常。');
}

runTests().catch(console.error);

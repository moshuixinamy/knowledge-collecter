import OpenRouterAPI from '../../lib/openrouter';
import FeishuAPI from '../../lib/feishu';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: '仅支持POST请求' 
    });
  }

  const { content } = req.body;

  // 验证输入
  if (!content || typeof content !== 'string') {
    return res.status(400).json({ 
      success: false, 
      error: '请提供有效的内容' 
    });
  }

  if (content.length > 4000) {
    return res.status(400).json({ 
      success: false, 
      error: '内容长度不能超过4000字符' 
    });
  }

  if (content.trim().length === 0) {
    return res.status(400).json({ 
      success: false, 
      error: '内容不能为空' 
    });
  }

  try {
    // 验证环境变量
    const requiredEnvVars = [
      'OPENROUTER_API_KEY',
      'FEISHU_APP_ID', 
      'FEISHU_APP_SECRET',
      'FEISHU_APP_TOKEN',
      'FEISHU_TABLE_ID'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      return res.status(500).json({
        success: false,
        error: `缺少环境变量: ${missingVars.join(', ')}`
      });
    }

    // 初始化API客户端
    const openRouter = new OpenRouterAPI(process.env.OPENROUTER_API_KEY);
    const feishu = new FeishuAPI(
      process.env.FEISHU_APP_ID,
      process.env.FEISHU_APP_SECRET,
      process.env.FEISHU_APP_TOKEN,
      process.env.FEISHU_TABLE_ID
    );

    // 第一步：使用OpenRouter解析内容
    let parsedData;
    try {
      parsedData = await openRouter.parseContent(content);
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: `内容解析失败: ${error.message}`,
        stage: 'parsing'
      });
    }

    // 验证解析结果
    if (!parsedData.records || parsedData.records.length === 0) {
      return res.status(400).json({
        success: false,
        error: '未能从内容中提取到有效的记录',
        stage: 'parsing'
      });
    }

    // 第二步：批量插入到飞书表格
    let insertResults;
    try {
      insertResults = await feishu.batchInsertRecords(parsedData.records);
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: `插入飞书表格失败: ${error.message}`,
        stage: 'insertion'
      });
    }

    // 返回结果
    const response = {
      success: true,
      data: {
        total: insertResults.total,
        inserted: insertResults.success,
        failed: insertResults.failed,
        records: insertResults.details.map(detail => ({
          index: detail.index,
          title: detail.title,
          status: detail.status,
          error: detail.error || null
        }))
      }
    };

    return res.status(200).json(response);

  } catch (error) {
    console.error('API处理错误:', error);
    return res.status(500).json({
      success: false,
      error: `服务器内部错误: ${error.message}`,
      stage: 'server'
    });
  }
}
import axios from 'axios';

class OpenRouterAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://openrouter.ai/api/v1';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'Knowledge Collector'
      }
    });
  }

  async parseContent(content) {
    const prompt = `你是一个知识整理助手。请分析用户提供的内容，提取关键信息并按以下格式返回：

单条内容时：
{
  "records": [
    {"title": "标题", "summary": "摘要", "url": "链接", "date": "2024-12-29"}
  ]
}

多条内容时（用---分隔）：
{
  "records": [
    {"title": "第一条标题", "summary": "第一条摘要", "url": "第一条链接", "date": "2024-12-29"},
    {"title": "第二条标题", "summary": "第二条摘要", "url": "第二条链接", "date": "2024-12-29"}
  ]
}

字段提取要求：
- title: 从内容中提取的主题或标题，简洁明了，体现核心主题，不超过30字
- summary: 内容的核心要点摘要，突出关键信息和价值点，80-150字
- url: 如果内容中包含链接，提取有效的网址；如果没有则为空字符串
- date: 今天的日期，格式：YYYY-MM-DD

输出规范：
1. 严格按JSON格式输出，不要添加任何其他文字说明
2. records必须是数组，即使只有一条记录
3. 每条记录必须包含title、summary、url、date四个字段
4. 如果某个字段无法确定：url填写空字符串，其他字段填写"未知"
5. 避免title冗长，summary要精炼有价值
6. 仅提取真实有效的网址链接

用户内容：${content}`;

    try {
      const response = await this.client.post('/chat/completions', {
        model: 'openai/gpt-4-turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      });

      const result = response.data.choices[0].message.content.trim();
      
      // 解析JSON响应
      try {
        const parsedResult = JSON.parse(result);
        
        // 验证响应格式
        if (!parsedResult.records || !Array.isArray(parsedResult.records)) {
          throw new Error('响应格式错误：缺少records数组');
        }

        // 添加当前日期
        const today = new Date().toISOString().split('T')[0];
        parsedResult.records.forEach(record => {
          record.date = today;
        });

        return parsedResult;
        
      } catch (parseError) {
        throw new Error(`JSON解析失败: ${parseError.message}`);
      }
      
    } catch (error) {
      if (error.response) {
        throw new Error(`OpenRouter API错误: ${error.response.data?.error?.message || error.response.statusText}`);
      } else if (error.request) {
        throw new Error('网络连接错误：无法连接到OpenRouter服务');
      } else {
        throw new Error(`请求失败: ${error.message}`);
      }
    }
  }
}

export default OpenRouterAPI;
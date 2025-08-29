import axios from 'axios';

class FeishuAPI {
  constructor(appId, appSecret, appToken, tableId) {
    this.appId = appId;
    this.appSecret = appSecret;
    this.appToken = appToken;
    this.tableId = tableId;
    this.baseURL = 'https://open.feishu.cn/open-apis';
    this.accessToken = null;
    this.tokenExpiry = null;
    
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // 获取访问令牌
  async getAccessToken() {
    // 如果令牌未过期，直接返回
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await this.client.post('/auth/v3/tenant_access_token/internal', {
        app_id: this.appId,
        app_secret: this.appSecret
      });

      if (response.data.code !== 0) {
        throw new Error(`获取访问令牌失败: ${response.data.msg}`);
      }

      this.accessToken = response.data.tenant_access_token;
      // 设置过期时间为当前时间 + 1小时50分钟（提前10分钟刷新）
      this.tokenExpiry = Date.now() + (110 * 60 * 1000);
      
      return this.accessToken;
    } catch (error) {
      throw new Error(`获取飞书访问令牌失败: ${error.message}`);
    }
  }

  // 插入单条记录
  async insertRecord(record) {
    const accessToken = await this.getAccessToken();
    
    // 将日期字符串转换为时间戳（毫秒）
    let dateTimestamp = '';
    if (record.date) {
      try {
        dateTimestamp = new Date(record.date).getTime();
      } catch (error) {
        dateTimestamp = Date.now(); // 如果转换失败，使用当前时间
      }
    } else {
      dateTimestamp = Date.now(); // 如果没有提供日期，使用当前时间
    }
    
    const recordData = {
      fields: {
        '主题': record.title || '',
        '摘要': record.summary || '',
        'url': record.url || '',
        '推送时间': dateTimestamp
      }
    };

    try {
      const response = await this.client.post(
        `/bitable/v1/apps/${this.appToken}/tables/${this.tableId}/records`,
        recordData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (response.data.code !== 0) {
        throw new Error(`插入记录失败: ${response.data.msg}`);
      }

      return {
        success: true,
        recordId: response.data.data.record.record_id,
        title: record.title
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        title: record.title
      };
    }
  }

  // 批量插入记录
  async batchInsertRecords(records) {
    const results = {
      total: records.length,
      success: 0,
      failed: 0,
      details: []
    };

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      
      try {
        const result = await this.insertRecord(record);
        
        if (result.success) {
          results.success++;
          results.details.push({
            index: i + 1,
            title: record.title,
            status: 'success',
            recordId: result.recordId
          });
        } else {
          results.failed++;
          results.details.push({
            index: i + 1,
            title: record.title,
            status: 'failed',
            error: result.error
          });
        }
      } catch (error) {
        results.failed++;
        results.details.push({
          index: i + 1,
          title: record.title,
          status: 'failed',
          error: error.message
        });
      }
    }

    return results;
  }

  // 验证配置
  async validateConfig() {
    try {
      const accessToken = await this.getAccessToken();
      
      // 尝试获取表格信息来验证配置
      const response = await this.client.get(
        `/bitable/v1/apps/${this.appToken}/tables/${this.tableId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      return response.data.code === 0;
    } catch (error) {
      return false;
    }
  }
}

export default FeishuAPI;
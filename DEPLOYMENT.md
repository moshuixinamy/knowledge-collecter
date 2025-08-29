# 部署指南

## Vercel部署步骤

### 1. 准备工作

确保你已经有了以下信息：
- OpenRouter API Key
- 飞书应用的App ID、App Secret、App Token、Table ID

### 2. 部署到Vercel

#### 方法一：命令行部署

```bash
# 安装Vercel CLI
npm install -g vercel

# 登录Vercel
vercel login

# 部署项目
vercel

# 设置环境变量（在Vercel Dashboard中）
```

#### 方法二：GitHub集成

1. 将项目推送到GitHub
2. 在Vercel Dashboard中导入GitHub仓库
3. 配置环境变量

### 3. 环境变量配置

在Vercel项目设置中，添加以下环境变量：

```
OPENROUTER_API_KEY=你的OpenRouter API密钥
FEISHU_APP_ID=你的飞书应用ID  
FEISHU_APP_SECRET=你的飞书应用Secret
FEISHU_APP_TOKEN=你的飞书应用Token
FEISHU_TABLE_ID=你的飞书表格ID
```

### 4. 验证部署

部署完成后，访问Vercel提供的域名，测试功能是否正常。

## 本地开发

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 文件，填入真实的API密钥

# 启动开发服务器
npm run dev
```

## 构建测试

```bash
# 构建项目
npm run build

# 启动生产版本
npm start
```

## 常见问题

### Q: 部署后API调用失败？
A: 检查环境变量是否正确配置，特别是在Vercel Dashboard中的设置。

### Q: 飞书API权限问题？
A: 确保飞书应用已发布，并且配置了正确的API权限。

### Q: OpenRouter API调用限制？
A: 检查API密钥是否有效，账户余额是否充足。
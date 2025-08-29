# 知识收集助手

智能整理知识内容，自动存储到飞书表格的Web应用。

## 功能特性

- 🤖 AI智能解析内容
- 📊 自动插入飞书表格
- 🔄 支持批量处理多条记录
- 📱 响应式极简设计
- ⚡ 部署在Vercel，访问速度快

## 快速开始

### 1. 环境配置

复制 `.env.example` 为 `.env.local`，并填入你的API密钥：

```bash
cp .env.example .env.local
```

需要配置的环境变量：
- `OPENROUTER_API_KEY`: OpenRouter API密钥
- `FEISHU_APP_ID`: 飞书应用ID
- `FEISHU_APP_SECRET`: 飞书应用Secret
- `FEISHU_APP_TOKEN`: 飞书应用Token
- `FEISHU_TABLE_ID`: 飞书表格ID

### 2. 安装依赖

```bash
npm install
```

### 3. 本地开发

```bash
npm run dev
```

访问 http://localhost:3000

### 4. 构建和部署

```bash
# 本地构建测试
npm run build
npm start

# 部署到Vercel
npm install -g vercel
vercel
```

## 使用说明

1. **单条内容**：直接输入要整理的知识内容
2. **多条内容**：使用 `---` 分隔不同的内容
3. **自动提取**：系统会自动提取主题、摘要、链接等信息
4. **存储管理**：所有记录自动存储到飞书表格中

## 项目结构

```
knowledge-collector/
├── pages/
│   ├── index.js          # 主页面
│   └── api/
│       └── process.js    # 核心处理API
├── components/
│   ├── InputForm.js      # 输入表单
│   ├── LoadingState.js   # 加载状态
│   └── ResultDisplay.js  # 结果展示
├── lib/
│   ├── openrouter.js     # OpenRouter API封装
│   └── feishu.js         # 飞书API封装
└── styles/
    └── globals.css       # 全局样式
```

## 技术栈

- **前端**: Next.js + React
- **样式**: 原生CSS（极简设计）
- **AI**: OpenRouter API (GPT-4-turbo)
- **存储**: 飞书多维表格API
- **部署**: Vercel

## 环境变量说明

| 变量名 | 说明 | 获取方式 |
|--------|------|----------|
| `OPENROUTER_API_KEY` | OpenRouter API密钥 | [OpenRouter官网](https://openrouter.ai) |
| `FEISHU_APP_ID` | 飞书应用ID | 飞书开放平台创建应用 |
| `FEISHU_APP_SECRET` | 飞书应用Secret | 飞书开放平台应用详情 |
| `FEISHU_APP_TOKEN` | 飞书应用Token | 从飞书表格URL提取 |
| `FEISHU_TABLE_ID` | 飞书表格ID | 从飞书表格URL提取 |

## 开发说明

这是一个基础版本（MVP），包含核心功能：
- ✅ 内容智能解析
- ✅ 批量记录插入
- ✅ 错误处理和重试
- ✅ 响应式界面

后续版本可扩展：
- 详细进度条
- 部分重试功能
- 历史记录
- 更多自定义选项

## 许可证

MIT License
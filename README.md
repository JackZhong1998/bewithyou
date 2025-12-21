# withyou - 声音克隆陪伴应用

一个基于 React + TypeScript 的声音克隆应用，使用 Inworld AI 的语音克隆和 TTS 服务。

## 功能特性

- 🎤 **声音克隆**：上传音频文件克隆声音
- 🌍 **多语言支持**：支持中文简体、中文繁体、韩文、日语、泰语、越南语
- 📚 **背单词功能**：使用克隆的声音学习英语单词
- 👤 **角色管理**：创建和管理多个声音角色
- 📱 **响应式设计**：完美适配手机端和电脑端

## 技术栈

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React Icons
- Inworld AI API

## 快速开始

### 安装依赖

```bash
npm install
```

### 配置环境变量

复制 `.env.example` 为 `.env` 并填入你的配置：

```env
VITE_INWORLD_API_KEY=your_api_key_here
VITE_INWORLD_WORKSPACE=workspaces/your_workspace
VITE_INVITE_CODES=520,123,456
VITE_INVITE_FORM_URL=https://your-form-url
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 项目结构

```
withyou/
├── src/
│   ├── components/          # React 组件
│   │   ├── Header.tsx       # 顶部导航栏
│   │   ├── CloneView.tsx    # 克隆页面
│   │   ├── CharacterList.tsx # 角色列表
│   │   ├── CharacterDetail.tsx # 角色详情
│   │   ├── LearningView.tsx # 背单词页面
│   │   ├── InviteModal.tsx  # 邀请码弹窗
│   │   └── Toast.tsx         # 提示消息
│   ├── services/            # API 服务
│   │   └── inworldService.ts # Inworld API 封装
│   ├── utils/               # 工具函数
│   │   └── storage.ts       # 本地存储
│   ├── types.ts             # TypeScript 类型定义
│   ├── constants.ts         # 常量配置
│   ├── App.tsx              # 主应用组件
│   ├── main.tsx             # 入口文件
│   └── index.css            # 全局样式
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 主要功能说明

### 声音克隆

1. 上传音频文件（支持 WAV、MP3、M4A，最大 10MB）
2. 选择原声语言
3. 选择是否去除背景噪音
4. 同意用户协议
5. 输入邀请码（首次使用）
6. 开始克隆

### 背单词

- 显示单词和中文含义
- 三个英文例句（暧昧情书风格）及中文翻译
- 点击播放按钮使用克隆声音朗读
- 支持重读和下一个单词

### 角色管理

- 创建多个声音角色
- 自定义角色名称和头像
- 查看角色列表

## 环境变量说明

- `VITE_INWORLD_API_KEY`: Inworld AI API Key（Base64 编码）
- `VITE_INWORLD_WORKSPACE`: Inworld 工作空间 ID（格式：workspaces/xxx）
- `VITE_INVITE_CODES`: 邀请码列表，用逗号分隔（如：520,123,456）
- `VITE_INVITE_FORM_URL`: 获取邀请码的表单链接

## 注意事项

1. 音频文件建议 5-15 秒，清晰无背景噪音
2. 首次使用需要输入邀请码
3. 邀请码会保存在本地，后续使用无需再次输入
4. 所有数据保存在浏览器本地存储中

## 开发

项目使用 Vite 作为构建工具，支持热更新。

```bash
# 开发模式
npm run dev

# 构建
npm run build

# 预览构建结果
npm run preview
```

## License

MIT


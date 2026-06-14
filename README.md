# 🎥 AI Vision Assistant

## 项目简介

AI Vision Assistant 是一个基于 Google Gemini 多模态模型构建的智能视觉交互助手。

系统结合摄像头视频流、语音输入、视觉理解与语音播报能力，实现用户与 AI 的自然交互。

用户只需开启摄像头并通过语音提问，系统即可自动采集当前视频画面、理解用户问题，并以文字和语音的形式返回回答。

## 🎬 Demo 视频

https://www.bilibili.com/video/BV1fvJw6REfN/?spm_id_from=333.1387.upload.video_card.click&vd_source=089401c16487ef62d09a70f780cdea2e

---

# 项目功能

## 已实现功能

### 1. 摄像头实时预览

* 调用浏览器摄像头
* 实时显示视频画面

### 2. 自动多帧采集

* 自动从视频流中连续采集三帧图像
* 模拟短时视频内容理解
* 无需用户手动截图

### 3. Gemini视觉问答

* 自动将用户问题与图像发送至 Gemini
* 获取视觉理解结果
* 返回自然语言回答

### 4. 语音输入

* 麦克风语音识别
* 自动转换为文本

### 5. 自动发送

* 语音识别结束后自动触发视觉问答流程

### 6. AI语音播报

* 自动朗读 AI 回答结果

### 7. 多轮对话记录

* 保留用户问题与 AI 回答历史

---

# 系统架构

```text
用户
 ↓
摄像头视频流
 ↓
多帧图像采集
 ↓
React前端
 ↓
Express后端
 ↓
Gemini多模态模型
 ↓
返回视觉理解结果
 ↓
文字展示 + 语音播报
```

---

# 技术栈

## 前端

* React
* JavaScript
* CSS3

## 后端

* Node.js
* Express

## AI能力

* Google Gemini Multimodal Model

---

# 第三方依赖说明

本项目使用以下第三方框架及库：

## 前端依赖

### React

用途：

* 构建用户界面
* 管理组件状态

官网：

https://react.dev

---

### Vite

用途：

* 前端项目构建与开发服务器

官网：

https://vitejs.dev

---

## 后端依赖

### Express

用途：

* 构建后端 API 服务

官网：

https://expressjs.com

---

### CORS

用途：

* 解决前后端跨域访问问题

---

### Dotenv

用途：

* 管理环境变量
* 存储 Gemini API Key

---

## AI服务依赖

### Google Gemini API

用途：

* 图像理解
* 多模态问答

官网：

https://ai.google.dev

---

## 浏览器原生API

本项目使用以下浏览器原生能力：

### MediaDevices API

用途：

* 摄像头访问

---

### Web Speech API

用途：

* 语音识别

---

### SpeechSynthesis API

用途：

* 文本转语音播报

---

# 原创功能说明

本项目中以下部分由作者自主设计与实现：

## 自主实现内容

### 摄像头视频流接入

实现浏览器摄像头调用与实时视频展示。

### 多帧图像采集策略

设计连续三帧自动采集机制，用于模拟短时间视频内容理解。

### 前后端通信逻辑

实现前端与 Gemini 服务之间的数据传输流程。

### 自动语音交互流程

实现：

语音输入

↓

自动识别

↓

自动发送

↓

视觉问答

↓

语音播报

的完整交互链路。

### 多轮聊天记录管理

实现用户问题与 AI 回答历史管理。

### 页面交互与视觉设计

实现项目整体界面设计与交互逻辑。

---

## 非原创部分

以下能力由第三方服务提供：

### Gemini多模态推理能力

图像理解与自然语言生成由 Google Gemini 模型提供。

### 浏览器语音识别能力

由 Web Speech API 提供。

### 浏览器语音播报能力

由 SpeechSynthesis API 提供。

---

# 本地运行

## 安装依赖

```bash
npm install
```

## 配置环境变量

在项目根目录创建：

.env

并填写自己的 Google AI Studio API Key：

```env
GEMINI_API_KEY=your_google_ai_studio_api_key
```

## 启动后端

```bash
npm run server
```

## 启动前端

```bash
npm run dev
```

浏览器访问：

```text
http://localhost:5173
```

---

# 项目作者

刘竞泽

本项目为多模态 AI 应用开发实践项目，用于智能视觉交互场景探索。

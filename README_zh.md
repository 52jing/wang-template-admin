<h4 align="right"><a href="./README.md">English</a> | <strong>简体中文</strong></h4>

# WangTemplate: 简洁易用的报告生成系统

## 描述

本系统是从实际生产平台中抽离出来的报告渲染模块，作为了一款独立的报告生成系统。

本系统是前后端分离的架构，此项目是前端服务，后端项目地址。

## 安装依赖

```bash
yarn
# or
npm install
```

### 启动开发模式

```bash
yarn dev
# or
npm run dev
```

### 检查代码

```bash
yarn lint
# or
npm run lint
```

### 格式化文件

```bash
yarn format
# or
npm run format
```

### 构建生产代码

```bash
yarn build
# or
npm run build
```

### 自定义配置

请查看 [配置 quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).

## 环境变量

添加 `.env` 文件到项目的根目录。

| 环境变量           | 描述                                    | 默认值                |
| ------------------ | --------------------------------------- | --------------------- |
| VUE_ROUTER_MODE    | vue 路由模式, hash, history or abstract | hash                  |
| VUE_ROUTER_BASE    | 基础路径                                | /                     |
| BASE_API           | API 请求基础路径                        | /api/                 |
| FRONTEND_ID        | 前端 ID，对应后端服务配置               |                       |
| ENABLE_REGISTER    | 是否启用注册                            | false                 |
| ENABLE_LOCALE      | 是否启用国际化                          | true                  |
| DEFAULT_LOCALE     | 默认语言                                | zh-CN                 |
| SHOW_AJAX_BAR      | 是否显示 ajax 进度条                    | false                 |
| SHOW_HISTORY_BAR   | 是否显示历史记录栏                      | true                  |
| ENABLE_CAPTCHA     | 是否启用验证码                          | false                 |
| LOGIN_CAPTCHA_TYPE | 登录验证码类型                          | image                 |
| ENABLE_CRYPTO      | 是否启用接口加密                        | false                 |
| CRYPTO_MODE        | 接口加密模式, aes_sm2 或 sm2            | aes_sm2               |
| PUBLIC_KEY         | 接口加密的 SM2 公钥                     |                       |
| ENABLE_DEV_PROXY   | 是否启用开发代理服务，仅用于开发模式    | false                 |
| DEV_TARGET         | 开发代理的目的地址                      | http://127.0.0.1:8000 |

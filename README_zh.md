<h4 align="right"><a href="./README.md">English</a> | <strong>简体中文</strong></h4>

<p align="center">
   <img src="https://img.shields.io/badge/license-Apache-blue.svg" alt="license">
   <img src="https://img.shields.io/badge/Nodejs-16+-green.svg" alt="nodejs">
   <img src="https://img.shields.io/badge/Vuejs-3-blue.svg" alt="vuejs">
</p>

# WangTemplate: 简洁易用的基于模版的报告生成系统

## 描述

本系统是从实际生产平台中抽离出来的报告渲染模块，作为了一款独立的报告生成系统。

本系统是前后端分离的架构，此项目是前端服务，项目地址：

- Github: [https://github.com/52jing/wang-template-admin](https://github.com/52jing/wang-template-admin)
- Gitee: [https://gitee.com/i52jing/wang-template-admin](https://gitee.com/i52jing/wang-template-admin)

后端项目地址：

- Github: [https://github.com/52jing/wang-template-backend](https://github.com/52jing/wang-template-backend)
- Gitee: [https://gitee.com/i52jing/wang-template-backend](https://gitee.com/i52jing/wang-template-backend)

## 特点

1. 轻量化

```
本系统只关注报告生成，可以对接任意的数据源，通过自定义的模版，生成对应的报告。
```

2. 可扩展

```
本系统采用了模块化的架构，面向接口的设计，易于快速扩展其他的数据源和渲染方式。
```

3. 易整合

```
易于整合到其他系统中，作为报告生成功能的模块。
```

4. 更智能

```
整合了大文本人工智能服务，可提供更智能化的报告生成能力。
```

## 核心技术栈

| 技术栈     | 版本 |
| ---------- | ---- |
| Node       | 16+  |
| Vue        | 3+   |
| Typescript |      |
| Quasar     | 2+   |

## 部署

### 快速部署

参考 Docker Compose 的快速部署项目：

- Github: [https://github.com/52jing/wang-template-compose](https://github.com/52jing/wang-template-compose)
- Gitee: [https://gitee.com/i52jing/wang-template-compose](https://gitee.com/i52jing/wang-template-compose)

### 后端部署

#### 使用 Docker 部署

Docker 构建

```
docker build -t wang-template-backend:1.0 .
```

挂载配置文件启动

```
docker run -d --name wang-template-backend -p 8000:8000 -v <path-to-config>/application-prod.yml:/opt/config/application-prod.yml wang-template-backend:1.0
```

#### 手动部署

使用 Maven 构建打包。

```
mvn clean package -DskipTests
```

打包后的 jar 在 app/target/app.jar，编辑配置文件并启动。

### 前端部署

#### 使用 Docker 部署

Docker 构建

```
docker build -t wang-template-admin:1.0 .
```

启动容器

```
docker run -d --name wang-template-admin -p 8001:80 wang-template-admin:1.0
```

#### 手动部署

使用 Vite 构建打包。

```
yarn build
```

打包后的文件在 dist/spa 目录下。

注意：由于前端默认同域同端口的后端服务，需要使用前置的负载均衡代理，或者前端打包时配置后端请求基础路径（见环境变量）。

## 系统截图

请参考后端项目 [Github](https://github.com/52jing/wang-template-backend) / [Gitee](https://gitee.com/i52jing/wang-template-backend) .

## 开发

### 安装依赖

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

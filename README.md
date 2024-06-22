<h4 align="right"><strong>English</strong> | <a href="./README_zh.md">简体中文</a></h4>

<p align="center">
   <img src="https://img.shields.io/badge/license-Apache-blue.svg" alt="license">
   <img src="https://img.shields.io/badge/Nodejs-16+-green.svg" alt="nodejs">
   <img src="https://img.shields.io/badge/Vuejs-3-blue.svg" alt="vuejs">
</p>

# WangTemplate: A Template Based Report Render Platform

# Introduction

This system is a report rendering module extracted from the actual production platform, as a stand-alone report generation system.

This system is BS architecture, this project is a frontend service:

- Github: [https://github.com/52jing/wang-template-admin](https://github.com/52jing/wang-template-admin)
- Gitee: [https://gitee.com/i52jing/wang-template-admin](https://gitee.com/i52jing/wang-template-admin)

Backend service at:

- Github: [https://github.com/52jing/wang-template-backend](https://github.com/52jing/wang-template-backend)
- Gitee: [https://gitee.com/i52jing/wang-template-backend](https://gitee.com/i52jing/wang-template-backend)

## Features

1. Lightweight

```
This system only focuses on report generation, which can interface with any data source and generate corresponding reports through customized templates.
```

2. Extensible

```
The system adopts a modular architecture and an interface-oriented design, which makes it easy to quickly extend other data sources and rendering methods.
```

3. Easy Integration

```
Easily integrated into other systems as a module for report generation functions.
```

4. More Intelligent

```
Integration of AIGC services provides smarter report generation capabilities.
```

## Core Tech Stack

| Tech       | Version |
| ---------- | ------- |
| Node       | 16+     |
| Vue        | 3+      |
| Typescript |         |
| Quasar     | 2+      |

## Deployment

### Quick Start

Use docker compose to quickly deploy:

- Github: [https://github.com/52jing/wang-template-compose](https://github.com/52jing/wang-template-compose)
- Gitee: [https://gitee.com/i52jing/wang-template-compose](https://gitee.com/i52jing/wang-template-compose)

### Deploy Backend

#### Docker

Build Image

```
docker build -t wang-template-backend:1.0 .
```

Mount config file and start container

```
docker run -d --name wang-template-backend -p 8000:8000 -v <path-to-config>/application-prod.yml:/opt/config/application-prod.yml wang-template-backend:1.0
```

#### Manually

Package by Maven

```
mvn clean package -DskipTests
```

Jar file is under app/target/app.jar, add config file and start jar.

### Deploy Frontend

#### Docker

Build Image

```
docker build -t wang-template-admin:1.0 .
```

Start Container

```
docker run -d --name wang-template-admin -p 8001:80 wang-template-admin:1.0
```

#### Manually

Build by Vite

```
yarn build
```

Files are under dist/spa directory.

Note: Since the frontend defaults to the same domain and port for backend services, you need to use a front load-balancing proxy, or configure the backend request base path when build the frontend (see Environment Variables).

## Snapshots

Please refer to repository [Github](https://github.com/52jing/wang-template-backend) / [Gitee](https://gitee.com/i52jing/wang-template-backend) .

## Development

### Install the dependencies

```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
yarn dev
# or
npm run dev
```

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Format the files

```bash
yarn format
# or
npm run format
```

### Build the app for production

```bash
yarn build
# or
npm run build
```

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).

## Environment

Add `.env` file in the project root directory.

| Env                | Description                                                  | Default               |
| ------------------ | ------------------------------------------------------------ | --------------------- |
| VUE_ROUTER_MODE    | vue router mode, hash, history or abstract                   | hash                  |
| VUE_ROUTER_BASE    | Base applied to all urls, defaults to '/'                    | /                     |
| BASE_API           | Base URL for api                                             | /api/                 |
| FRONTEND_ID        | Frontend ID for this project, related to frontend in backend |                       |
| ENABLE_REGISTER    | whether to enable registration                               | false                 |
| ENABLE_LOCALE      | whether to enable locale                                     | true                  |
| DEFAULT_LOCALE     | default locale                                               | zh-CN                 |
| SHOW_AJAX_BAR      | whether to show ajax bar                                     | false                 |
| SHOW_HISTORY_BAR   | whether to show history bar                                  | true                  |
| ENABLE_CAPTCHA     | whether to enable captcha                                    | false                 |
| LOGIN_CAPTCHA_TYPE | captcha type for login page                                  | image                 |
| ENABLE_CRYPTO      | whether to enable API crypto                                 | false                 |
| CRYPTO_MODE        | API crypto mode, aes_sm2 or sm2                              | aes_sm2               |
| PUBLIC_KEY         | API crypto publick key for sm2                               |                       |
| ENABLE_DEV_PROXY   | whether to enable dev proxy, only for dev                    | false                 |
| DEV_TARGET         | target for dev proxy                                         | http://127.0.0.1:8000 |

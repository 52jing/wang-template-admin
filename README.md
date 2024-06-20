<h4 align="right"><strong>English</strong> | <a href="./README_zh.md">简体中文</a></h4>

<p align="center">
   <img src="https://img.shields.io/badge/license-Apache-blue.svg" alt="license">
   <img src="https://img.shields.io/badge/Nodejs-16+-green.svg" alt="nodejs">
   <img src="https://img.shields.io/badge/Vuejs-3-blue.svg" alt="vuejs">
</p>

# WangTemplate

Admin frontend for WangTemplate.

## Install the dependencies

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

# 将 ssr-study 工程化，编写 ssr 模板

学习这篇[VUE-CLI3 SSR 改造之旅](http://www.ediaos.com/2019/01/27/vue-cli3-ssr-project/)，将 vue-ssr-study 的学习项目改造成可以运用到实战的模板。

`npm run build`之后复制 dist 目录，然后安装依赖，运行`node server/index.js`就可以启动服务器

### ENV Config 构建

背景：CLI3 默认读取 –mode NODE_ENV 作为环境变量，提供了.ENV 文件作为匹配环境。使用中发现 CLI3 内置一些处理以及写死处理 `NODE_ENV= production || development`，如果我们增加了一种环境，比如 test 环境，用于测试环境部署，有测试环境的配置等等，测试环境部署的时候却要依赖 production 来构建。 `会导致本地开发/服务端部署 与 实际的多套环境冲突`，这样的场景并不利于开发梳理逻辑。另外基于.ENV 环境获取 ENV 的时候被强制以 VUE_APP 作为开头的变量名不是很友好，使用起来稍显别扭。

解决方案：基于 `cross-env` 提供设置脚本环境变量，增加 `NODE_DEPLOY` 作为环境变量，工程根据这个环境变量提取配置的 config 文件中的 env 配置。这样好处就是把本地开发和部署 以及 与实际部署环境拆分开来不再互相干扰。实现方案如下：

`npm install cross-env -D`
修改 package.json 中的脚本，根据项目实际环境设置 NODE_DEPLOY，比如：cross-env `NODE_DEPLOY=test npm run dev`
增加 config 文件夹，并增加 index.js 以及 env 代码&目录参考如下，基于 NODE_DEPLOY 获取到环境变量，config/index.js 根据环境变量获取 env 配置文件，默认合并 env.js，这与 cli3 提供 env 基本一致，但不受限于命名。

改造之后的 scripts 如下：

```
{
    "dev:client": "vue-cli-service serve --mode dev",
    "dev:ssr": "cross-env BUILD_TARGET=node NODE_ENV=dev node ./server/ssr.js",
    "dev:all": "concurrently \"vue-cli-service serve --mode dev --port 8081\" \"npm run dev:ssr\" ",
    "dev": "cross-env NODE_DEPLOY=dev npm run dev:all",

    "build:client": "vue-cli-service build",
    "build:ssr": "cross-env BUILD_TARGET=node vue-cli-service build --no-clean",
    "build:all": "npm run build:client && cross-env NODE_PORT=9080 npm run build:ssr",
    "build": "cross-env NODE_DEPLOY=prod npm run build:all",

    "lint": "vue-cli-service lint",
    "dist": "cross-env NODE_DEPLOY=t1 NODE_ENV=production node ./dist/server"
  }
```

### 改造 vue.config.js

引入各种环境，配置。

导出的对象增加设置：

- publicPath
  部署应用包时的基本 URL。默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上，例如 `https://www.my-app.com/`。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 `https://www.my-app.com/my-app/`，则设置 publicPath 为 /my-app/。
  这个值也可以被设置为空字符串 ('') 或是相对路径 ('./')，这样所有的资源都会被链接为相对路径，这样打出来的包可以被部署在任意路径，也可以用在类似 Cordova hybrid 应用的文件系统中。

- assetsDir：放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
- configureWebpack.plugin[]：增加 webpack.DefinePlugin(),生产环境时加上 CopyWebpackPlugin()复制必要的文件去 dist 目录
- chainWebpack： 1.增加 alias 别名。2.config.plugin('html')替换 public/index.html 的模板。3.node 端修复没有 document 的问题。4.设置缓存名字，区别客户端

待解决：

- 无 Proxy 处理
- 通过修改 baseUrl，修改 服务端渲染页面的前端静态资源地址，不够优雅，并且可能导致前端渲染刷新页面导致 404 无法访问
- 无 AsyncData 等处理，文章只提供了页面渲染，实际业务中有接口请求，有 loading 等功能，这些通常是工程化项目需要具备
- 增加是否前后端渲染控制
- TDK 支持
- PM2 支持
- DIST 处理

由于文章写了没多少就没下文了，我打算根据他的 github 项目一步步实现上面这些

# Proxy 处理

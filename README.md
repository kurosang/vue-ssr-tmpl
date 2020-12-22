# 将 ssr-study 工程化，编写 ssr 模板

学习这篇[VUE-CLI3 SSR 改造之旅](http://www.ediaos.com/2019/01/27/vue-cli3-ssr-project/)，继续改造。

`npm run build`之后复制 dist 目录，然后安装依赖，运行`node server/index.js`就可以启动服务器

初步根据上面两篇文章搭建完之后，距离实际使用还有很大的差距。

### ENV Config 构建

背景：CLI3 默认读取 –mode NODE_ENV 作为环境变量，提供了.ENV 文件作为匹配环境。使用中发现 CLI3 内置一些处理以及写死处理 `NODE_ENV= production || development`，如果我们增加了一种环境，比如 test 环境，用于测试环境部署，有测试环境的配置等等，测试环境部署的时候却要依赖 production 来构建。 `会导致本地开发/服务端部署 与 实际的多套环境冲突`，这样的场景并不利于开发梳理逻辑。另外基于.ENV 环境获取 ENV 的时候被强制以 VUE_APP 作为开头的变量名不是很友好，使用起来稍显别扭。

解决方案：基于 `cross-env` 提供设置脚本环境变量，增加 `NODE_DEPLOY` 作为环境变量，工程根据这个环境变量提取配置的 config 文件中的 env 配置。这样好处就是把本地开发和部署 以及 与实际部署环境拆分开来不再互相干扰。实现方案如下：

`npm install cross-env -D`
修改 package.json 中的脚本，根据项目实际环境设置 NODE_DEPLOY，比如：cross-env `NODE_DEPLOY=test npm run dev`
增加 config 文件夹，并增加 index.js 以及 env 代码&目录参考如下，基于 NODE_DEPLOY 获取到环境变量，config/index.js 根据环境变量获取 env 配置文件，默认合并 env.js，这与 cli3 提供 env 基本一致，但不受限于命名。

### 改造 vue.config.js

- 无 Proxy 处理
- 通过修改 baseUrl，修改 服务端渲染页面的前端静态资源地址，不够优雅，并且可能导致前端渲染刷新页面导致 404 无法访问
- 无 AsyncData 等处理，文章只提供了页面渲染，实际业务中有接口请求，有 loading 等功能，这些通常是工程化项目需要具备
- 增加是否前后端渲染控制
- TDK 支持
- PM2 支持
- DIST 处理

由于文章写了没多少就没下文了，我打算根据他的 github 项目一步步实现上面这些

# Proxy 处理

const deploy = process.env.NODE_DEPLOY || 'prod'
const envBase = require('./env/env') // {// domain HOST_DOMAIN: "test.com"}
const envDeploy = require(`./env/env.${deploy}`)
const env = Object.assign(envBase, envDeploy) //  {// domain HOST_DOMAIN: "",CDN_HOST:"",CNODE_HOST:"",}

const proxyMap = {
  '/feapi/': {
    target: env.CNODE_HOST,
    changeOrigin: true,
    pathRewrite: {
      '^/feapi/': '/',
    },
  },
}

module.exports = {
  env, //环境变量
  build: {
    assetsPublicPath: env.CDN_HOST,
  },
  dev: {
    assetsPublicPath: undefined,
    proxyTable: proxyMap,
  },
}

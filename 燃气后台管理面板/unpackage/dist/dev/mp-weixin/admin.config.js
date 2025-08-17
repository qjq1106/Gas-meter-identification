"use strict";
const config = {
  login: {
    url: "/uni_modules/uni-id-pages/pages/login/login-withpwd"
    // 登录页面路径
  },
  index: {
    url: "/pages/index/index"
    // 登录后跳转的第一个页面
  },
  error: {
    url: "/pages/error/404"
    // 404 Not Found 错误页面路径
  },
  navBar: {
    // 顶部导航
    logo: "/static/logo.png",
    // 左侧 Logo
    langs: [{
      text: "中文简体",
      lang: "zh-Hans"
    }, {
      text: "中文繁體",
      lang: "zh-Hant"
    }, {
      text: "English",
      lang: "en"
    }],
    themes: [{
      text: "默认",
      value: "default"
    }, {
      text: "绿柔",
      value: "green"
    }],
    debug: {
      enable: true,
      //是否显示错误信息
      engine: [{
        // 搜索引擎配置（每条错误信息后，会自动生成搜索链接，点击后跳转至搜索引擎）
        name: "百度",
        url: "https://www.baidu.com/baidu?wd=ERR_MSG"
      }, {
        name: "谷歌",
        url: "https://www.google.com/search?q=ERR_MSG"
      }]
    }
  },
  sideBar: {
    // 左侧菜单
    // 配置静态菜单列表（放置在用户被授权的菜单列表下边）
    staticMenu: [{
      menu_id: "gas-report",
      text: "燃气表管理",
      icon: "admin-icons-table",
      url: "",
      children: [{
        menu_id: "gas-report-list",
        text: "识别报告管理",
        icon: "admin-icons-table",
        value: "/pages/report/list"
      }, {
        menu_id: "gas-report-add",
        text: "添加报告",
        icon: "admin-icons-add",
        value: "/pages/report/add"
      }]
    }, {
      menu_id: "demo",
      text: "静态功能演示",
      icon: "admin-icons-kaifashili",
      url: "",
      children: [{
        menu_id: "icons",
        text: "图标",
        icon: "admin-icons-icon",
        value: "/pages/demo/icons/icons"
      }, {
        menu_id: "table",
        text: "表格",
        icon: "admin-icons-table",
        value: "/pages/demo/table/table"
      }]
    }, {
      menu_id: "admim-doc-pulgin",
      text: "文档与插件",
      icon: "admin-icons-eco",
      url: "",
      children: [{
        menu_id: "admin-doc",
        icon: "admin-icons-doc",
        text: "uni-admin 框架文档",
        value: "https://uniapp.dcloud.net.cn/uniCloud/admin"
      }, {
        menu_id: "stat-doc",
        icon: "admin-icons-help",
        text: "uni 统计教程",
        value: "https://uniapp.dcloud.net.cn/uni-stat-v2.html"
      }, {
        menu_id: "admin-pulgin",
        icon: "admin-icons-pulgin",
        text: "uni-admin 插件",
        value: "https://ext.dcloud.net.cn/?cat1=7&cat2=74"
      }]
    }]
  },
  uniStat: {}
};
exports.config = config;
//# sourceMappingURL=../.sourcemap/mp-weixin/admin.config.js.map

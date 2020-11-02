module.exports = {
  base: "/vbook/",
  title: "BLOG",
  description: "学习笔记",
  dest: "./dist",
  port: "7777",
  //   base: "/vuepress-blog/",
  head: [["link", { rel: "icon", href: "/favicon.ico" }]],
  markdown: {
    lineNumbers: true,
  },

  themeConfig: {
    nav: require("./nav"),
    sidebar: require("./sidebar"),
    // sidebarDepth: 2, // 侧边栏层级【默认3】
    // lastUpdated: "Last Updated",
    searchMaxSuggestoins: 10,
    serviceWorker: {
      updatePopup: {
        message: "New content is available.",
        buttonText: "Refresh",
      },
    },
    editLinks: true,
  },
};

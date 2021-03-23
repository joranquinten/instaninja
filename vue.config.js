module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        publish: ['github'],
        appId: "com.electron.instaninja",
        productName: "InstaNinja",
        copyright: "Copyright © 2021 ${author}",
        mac: {
          category: "public.app-category.utilities",
          icon: "./src/assets/icons/mac/icon.icns",
        },
        win: {
          target: [
            {
              target: "msi",
              arch: ["x64", "ia32"],
            },
            {
              target: "portable",
              arch: ["x64", "ia32"],
            },
          ],
          icon: "./public/favicon.ico",
        },
      },
    },
  },

  transpileDependencies: ["vuetify"],
};

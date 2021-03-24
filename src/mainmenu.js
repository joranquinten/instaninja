const { Menu, shell } = require("electron");

const template = [
  {
    label: "InstaNinja",
    submenu: [
      {
        label: "Go to InstaNinja Website",
        click() {
          shell.openExternal("https://github.com/joranquinten/instaninja/");
        },
      },
    ],
  },
  {
    label: "View",
    submenu: [
      {
        label: "Reload",
        accelerator: "CmdOrCtrl+R",
        click(item, focusedWindow) {
          if (focusedWindow) focusedWindow.reload();
        },
      },
      {
        role: "togglefullscreen",
      },
      {
        type: "separator",
      },
      {
        label: "Toggle Developer Tools",
        accelerator:
          process.platform === "darwin" ? "Alt+Command+I" : "Ctrl+Shift+I",
        click(item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.toggleDevTools();
        },
      },
    ],
  },
  {
    role: "window",
    submenu: [
      {
        role: "minimize",
      },
      {
        role: "close",
      },
    ],
  },
  {
    role: "help",
    submenu: [
      {
        label: "Learn More",
        click() {
          shell.openExternal("http://electron.atom.io");
        },
      },
      {
        label: "Buy me a coffee",
        click() {
          shell.openExternal("https://www.buymeacoffee.com/joranquinten");
        },
      },
    ],
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

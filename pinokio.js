const os = require('os')
const fs = require('fs')
const path = require("path")
const exists = (filepath) => {
  return new Promise(r=>fs.access(filepath, fs.constants.F_OK, e => r(!e)))
}
module.exports = {
  title: "Stable Diffusion web UI",
  description: "One-click launcher for Stable Diffusion web UI (AUTOMATIC1111/stable-diffusion-webui)",
  icon: "icon.png",
  update: async (kernel) => {
    return "update.json"
  },
  // start: display if 
//  start: async (kernel) => {
//    let installed = await exists(path.resolve(__dirname, "automatic1111", "venv"))
//    if (installed) {
//      return "start.json"
//    }
//  },
  menu: async (kernel) => {
    let installed = await exists(path.resolve(__dirname, "automatic1111", "venv"))
    if (installed) {
      let session = (await kernel.loader.load(path.resolve(__dirname, "session.json"))).resolved
      return [{
        when: "start.js",
        on: "<i class='fa-solid fa-spin fa-circle-notch'></i> Running",
        type: "label",
        href: "start.js"
      }, {
        when: "start.js",
        off: "<i class='fa-solid fa-power-off'></i> Launch",
        href: "start.js?fullscreen=true&run=true",
      }, {
        when: "start.js",
        on: "<i class='fa-solid fa-rocket'></i> Open Web UI",
        href: (session && session.url ? session.url : "http://127.0.0.1:7860"),
        target: "_blank"
      }, {
        when: "start.js",
        on: "<i class='fa-solid fa-desktop'></i> Server",
        href: "start.js?fullscreen=true"
//      }, {
//        html: "<i class='fa-solid fa-plug'></i> Reinstall",
//        href: "install.js"
      }, {
        html: '<i class="fa-solid fa-gear"></i> Configure',
        href: (os.platform() === 'win32' ? "automatic1111/webui-user.bat#L6" : "automatic1111/webui-user.sh#L13")
      }]
    } else {
      return [{
        html: '<i class="fa-solid fa-plug"></i> Install Stable Diffusion XL',
        type: "link",
        href: "install.js?run=true&fullscreen=true"
      }, {
        html: '<i class="fa-solid fa-plug"></i> Install Stable Diffusion 1.5',
        type: "link",
        href: "install_legacy.js?run=true&fullscreen=true"
      }, {
        html: '<i class="fa-solid fa-gear"></i> Configure',
        type: "link",
        href: (os.platform() === 'win32' ? "automatic1111/webui-user.bat#L6" : "automatic1111/webui-user.sh#L13")
      }]
    }
  }
}

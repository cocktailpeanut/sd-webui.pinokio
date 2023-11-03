const path = require("path")
const os = require('os')
module.exports = async (kernel) => {
  const platform = os.platform()
  const graphics = await kernel.system.graphics()
  const vendors = graphics.controllers.map((c) => { return c.vendor.toLowerCase() })
//  const vendor = graphics.controllers[0].vendor
  let setup
  if (platform === "darwin") {
    setup = [{
      method: "shell.run",
      params: { message: "brew install cmake protobuf rust python@3.10 git wget", },
      //params: { message: "brew install protobuf rust wget", },
    }, {
      method: "shell.run",
      params: { message: "git clone -b dev https://github.com/cocktailpeanut/stable-diffusion-webui automatic1111", path: path.resolve(__dirname) },
    }]
  } else {
    let test = vendors.filter((vendor) => {
      return /advanced micro devices/i.test(vendor)
    }).length > 0
    if (test) {
      if (platform === 'win32') {
        setup = [{
          method: "shell.run",
          params: { message: "git clone https://github.com/lshqqytiger/stable-diffusion-webui-directml.git automatic1111", path: __dirname }
        }]
      } else {
        setup = [{
          method: "shell.run",
          params: { message: "git clone -b dev https://github.com/cocktailpeanut/stable-diffusion-webui automatic1111", path: __dirname },
        }]
      }
    } else {
      setup = [{
        method: "shell.run",
        params: { message: "git clone -b dev https://github.com/cocktailpeanut/stable-diffusion-webui automatic1111", path: __dirname },
      }]
    }
  }

  let run = setup.concat([{
    "uri": "./index.js",
    "method": "config",
  }, {
    "method": "self.set",
    "params": {
      "automatic1111/ui-config.json": {
        "txt2img/Width/value": 1024,
        "txt2img/Height/value": 1024,
      }
    }
  }, {
    "method": "notify",
    "params": {
      "html": "<b>Downloading Model</b><br>Downloading the Stable Diffusion XL 1.0 model..."
    }
  }, {
    "method": "fs.download",
    "params": {
      "url": "https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/resolve/main/sd_xl_base_1.0.safetensors",
      "path": "automatic1111/models/Stable-diffusion/sd_xl_base_1.0.safetensors"
    }
  }, {
    "method": "fs.download",
    "params": {
      "url": "https://huggingface.co/stabilityai/stable-diffusion-xl-refiner-1.0/resolve/main/sd_xl_refiner_1.0.safetensors",
      "path": "automatic1111/models/Stable-diffusion/sd_xl_refiner_1.0.safetensors"
    }
//  }, {
//    "method": "fs.download",
//    "params": {
//      //"url": "https://huggingface.co/madebyollin/sdxl-vae-fp16-fix/resolve/main/sdxl_vae.safetensors",
//      //"path": "automatic1111/models/Stable-diffusion/sd_xl_base_0.9.vae.safetensors"
//      "url": "https://huggingface.co/stabilityai/sdxl-vae/blob/main/sdxl_vae.safetensors",
//      "path": "automatic1111/models/Stable-diffusion/sd_xl_base_1.0.vae.safetensors"
//    }
  }, {
    "method": "notify",
    "params": {
      "html": "<b>Installing webui</b><br>All SDXL 1.0 models downloaded successfully. Now setting up Automatic1111/stable-diffusion-webui..."
    }
  }, {
    "method": "shell.start",
    "params": {
      "path": "automatic1111",
      "env": {
        "HF_HOME": "../huggingface"
      },
    }
  }, {
    "method": "shell.enter",
    "params": {
      "message": "{{os.platform() === 'win32' ? 'webui-user.bat' : 'bash webui.sh -f'}}",
      "on": [{
        "event": "/(http:\/\/[0-9.:]+)/",
        "return": "{{event.matches[0][1]}}"
      }]
    }
  }, {
    "method": "local.set",
    "params": {
      "url": "{{input}}"
    }
  }, {
    "method": "input",
    "params": {
      "title": "Install Success",
      "description": "Go back to the dashboard and launch the app!"
    }
  }, {
    "method": "browser.open",
    "params": {
      "uri": "/?selected=Stable Diffusion web UI"
    }
  }])
  let o = { run }
  if (platform === 'darwin') {
    o.requires = [{
      platform: "darwin",
      name: "brew"
    }]
  }
  return o
}

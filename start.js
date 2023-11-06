module.exports = async (kernel) => {
  return {
    daemon: true,
    run: [{
      method: "shell.start",
      params: {
        path: "automatic1111",
        env: {
          SD_WEBUI_RESTARTING: 1,
          HF_HOME: "../huggingface"
        },
      }
    }, {
      "method": "shell.enter",
      "params": {
        "message": "{{os.platform() === 'win32' ? 'venv\\\\Scripts\\\\activate' : 'source venv/bin/activate'}} venv",
        "on": [{
          "event": null,
          "return": true
        }]
      }
    }, {
      "method": "shell.enter",
      "params": {
        "message": "pip install tqdm moviepy --upgrade",
        "on": [{
          "event": null,
          "return": true
        }]
      }
    }, {
      "method": "shell.enter",
      "params": {
        "message": "{{os.platform() === 'win32' ? 'venv\\\\Scripts\\\\deactivate' : 'source venv/bin/deactivate'}}",
        "on": [{
          "event": null,
          "return": true
        }]
      }
    }, {
      method: "shell.enter",
      params: {
        message: "{{os.platform() === 'win32' ? 'webui-user.bat' : 'bash webui.sh -f'}}",
        on: [{
          event: "/.*(http:\/\/127.0.0.1:[0-9]+).+(model loaded).*/i",
          return: "{{event.matches[0][1]}}"
        }]
      }
    }, {
      method: "self.set",
      params: {
        "session.json": {
          "url": "{{input}}",
        }
      }
    }, {
      "method": "browser.open",
      "params": {
        "uri": "{{self.session.url}}",
        "target": "_blank"
      }
    }]
  }
}

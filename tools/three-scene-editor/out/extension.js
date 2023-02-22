"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode2 = __toESM(require("vscode"));

// src/sceneEditor.ts
var vscode = __toESM(require("vscode"));

// src/util.ts
function getNonce() {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// src/sceneEditor.ts
var _SceneEditorProvider = class {
  constructor(context) {
    this.context = context;
  }
  static register(context) {
    const provider = new _SceneEditorProvider(context);
    const providerRegistration = vscode.window.registerCustomEditorProvider(_SceneEditorProvider.viewType, provider);
    return providerRegistration;
  }
  async resolveCustomTextEditor(document, webviewPanel, token) {
    webviewPanel.webview.options = {
      enableScripts: true
    };
    webviewPanel.webview.html = this.getHTMLForWebview(webviewPanel.webview);
    function updateWebview() {
      webviewPanel.webview.postMessage({
        type: "updateFromDocument",
        value: document.getText()
      });
    }
    const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument((e) => {
      if (e.document.uri.toString() === document.uri.toString()) {
        updateWebview();
      }
    });
    webviewPanel.onDidDispose(() => {
      changeDocumentSubscription.dispose();
    });
    webviewPanel.webview.onDidReceiveMessage((e) => {
      const { type = "alert", value = "???" } = e;
      switch (type) {
        case "updateFromWebview":
          this.updateTextDocument(document, value);
          break;
        case "info":
          vscode.window.showInformationMessage(value);
          break;
        case "alert":
          vscode.window.showErrorMessage(value);
          break;
      }
    });
    updateWebview();
  }
  getHTMLForWebview(webview) {
    const scriptURI = webview.asWebviewUri(vscode.Uri.joinPath(
      this.context.extensionUri,
      "media",
      "sceneEditor.js"
    ));
    const styleURI = webview.asWebviewUri(vscode.Uri.joinPath(
      this.context.extensionUri,
      "media",
      "sceneEditor.css"
    ));
    const nonce = getNonce();
    return (
      /* html */
      `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <!--
            Use a content security policy to only allow loading images from https or from our extension directory,
            and only allow scripts that have a specific nonce.
            -->
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource}; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="${styleURI}" rel="stylesheet" />
            <title>Three.js Scene Editor</title>
        </head>
        <body>
            <canvas></canvas>
            <script nonce="${nonce}" src="${scriptURI}"></script>
        </body>
        </html>`
    );
  }
  getDocumentAsJSON(document) {
    const text = document.getText();
    if (text.trim().length === 0) {
      return {};
    }
    try {
      return JSON.parse(text);
    } catch {
      throw new Error("Found invalid json for document content.");
    }
  }
  updateTextDocument(document, text) {
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      vscode.window.showErrorMessage("Failed to parse json for text document.");
      return;
    }
    const edit = new vscode.WorkspaceEdit();
    edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), JSON.stringify(json, null, 2));
    return vscode.workspace.applyEdit(edit);
  }
};
var SceneEditorProvider = _SceneEditorProvider;
SceneEditorProvider.viewType = "threeSceneEditor.sceneEdit";

// src/extension.ts
function activate(context) {
  console.log('Congratulations, your extension "three-scene-editor" is now active!');
  let disposable = vscode2.commands.registerCommand("three-scene-editor.helloWorld", () => {
    vscode2.window.showInformationMessage("Hello World from three-scene-editor!");
  });
  context.subscriptions.push(disposable);
  context.subscriptions.push(SceneEditorProvider.register(context));
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});

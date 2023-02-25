"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SceneEditorProvider = void 0;
const vscode = require("vscode");
const WebViewHTML_1 = require("../webview/WebViewHTML");
class SceneEditorProvider {
    static register(context) {
        const provider = new SceneEditorProvider(context);
        const providerRegistration = vscode.window.registerCustomEditorProvider(SceneEditorProvider.viewType, provider);
        return providerRegistration;
    }
    constructor(context) {
        this.context = context;
        this.cachedContent = '';
    }
    async resolveCustomTextEditor(document, webviewPanel, token) {
        webviewPanel.webview.options = {
            enableScripts: true,
        };
        webviewPanel.webview.html = this.getHTMLForWebview(webviewPanel.webview);
        const textContent = document.getText();
        this.cachedContent = JSON.stringify(JSON.parse(textContent), null, 2);
        function updateWebview() {
            const textContent = document.getText();
            webviewPanel.webview.postMessage({
                type: 'updateFromDocument',
                value: textContent,
            });
        }
        const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
            if (e.document.uri.toString() === document.uri.toString()) {
                updateWebview();
            }
        });
        webviewPanel.onDidDispose(() => {
            changeDocumentSubscription.dispose();
        });
        webviewPanel.webview.onDidReceiveMessage(e => {
            const { type = 'alert', value = '???' } = e;
            switch (type) {
                case 'updateFromWebview':
                    this.updateTextDocument(document, value);
                    break;
                case 'info':
                    vscode.window.showInformationMessage(value);
                    break;
                case 'alert':
                    vscode.window.showErrorMessage(value);
                    break;
            }
        });
        updateWebview();
    }
    getHTMLForWebview(webview) {
        return (0, WebViewHTML_1.html)(this.context, webview);
    }
    getDocumentAsJSON(document) {
        const text = document.getText();
        if (text.trim().length === 0) {
            return {};
        }
        try {
            return JSON.parse(text);
        }
        catch {
            throw new Error('Found invalid json for document content.');
        }
    }
    updateTextDocument(document, text) {
        let json;
        try {
            json = JSON.parse(text);
        }
        catch {
            vscode.window.showErrorMessage('Failed to parse json for text document.');
            return;
        }
        let content = JSON.stringify(json, null, 2);
        console.log(this.cachedContent, content);
        if (this.cachedContent === content) {
            return;
        }
        const edit = new vscode.WorkspaceEdit();
        edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), content);
        return vscode.workspace.applyEdit(edit);
    }
}
exports.SceneEditorProvider = SceneEditorProvider;
SceneEditorProvider.viewType = 'threeSceneEditor.sceneEdit';
//# sourceMappingURL=sceneEditor.js.map
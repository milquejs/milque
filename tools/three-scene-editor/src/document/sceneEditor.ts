import * as vscode from 'vscode';
import { html } from '../webview/WebViewHTML';

export class SceneEditorProvider implements vscode.CustomTextEditorProvider {
    
    public static register(context: vscode.ExtensionContext): vscode.Disposable {
        const provider = new SceneEditorProvider(context);
        const providerRegistration = vscode.window.registerCustomEditorProvider(SceneEditorProvider.viewType, provider);
        return providerRegistration;
    }

    private static readonly viewType = 'threeSceneEditor.sceneEdit';
    private cachedContent = '';

    constructor(
        private readonly context: vscode.ExtensionContext
    ) {}

    public async resolveCustomTextEditor(document: vscode.TextDocument, webviewPanel: vscode.WebviewPanel, token: vscode.CancellationToken): Promise<void> {
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

    private getHTMLForWebview(webview: vscode.Webview): string {
        return html(this.context, webview);
    }

    private getDocumentAsJSON(document: vscode.TextDocument): any {
        const text = document.getText();
        if (text.trim().length === 0) {
            return {};
        }
        try {
            return JSON.parse(text);
        } catch {
            throw new Error('Found invalid json for document content.');
        }
    }

    private updateTextDocument(document: vscode.TextDocument, text: string) {
        let json;
        try {
            json = JSON.parse(text);
        } catch {
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

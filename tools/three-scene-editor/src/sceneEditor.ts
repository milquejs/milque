import * as vscode from 'vscode';
import { getNonce } from './util';

export class SceneEditorProvider implements vscode.CustomTextEditorProvider {
    
    public static register(context: vscode.ExtensionContext): vscode.Disposable {
        const provider = new SceneEditorProvider(context);
        const providerRegistration = vscode.window.registerCustomEditorProvider(SceneEditorProvider.viewType, provider);
        return providerRegistration;
    }

    private static readonly viewType = 'threeSceneEditor.sceneEdit';

    constructor(
        private readonly context: vscode.ExtensionContext
    ) {}

    public async resolveCustomTextEditor(document: vscode.TextDocument, webviewPanel: vscode.WebviewPanel, token: vscode.CancellationToken): Promise<void> {
        webviewPanel.webview.options = {
            enableScripts: true,
        };
        webviewPanel.webview.html = this.getHTMLForWebview(webviewPanel.webview);

        function updateWebview() {
            webviewPanel.webview.postMessage({
                type: 'updateFromDocument',
                value: document.getText(),
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
        const scriptURI = webview.asWebviewUri(vscode.Uri.joinPath(
            this.context.extensionUri, 'media', 'sceneEditor.js'));
        const styleURI = webview.asWebviewUri(vscode.Uri.joinPath(
            this.context.extensionUri, 'media', 'sceneEditor.css'));
        
        const nonce = getNonce();
        return /* html */`
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
        </html>`;
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
        const edit = new vscode.WorkspaceEdit();
        edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), JSON.stringify(json, null, 2));
        return vscode.workspace.applyEdit(edit);
    }
}

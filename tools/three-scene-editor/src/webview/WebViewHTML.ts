import { Webview, Uri, ExtensionContext } from 'vscode';
import { getNonce } from '../util';

export function html(context: ExtensionContext, webview: Webview) {
    const scriptURI = webview.asWebviewUri(Uri.joinPath(
        context.extensionUri, 'media', 'SceneEditor.js'));
    const styleURI = webview.asWebviewUri(Uri.joinPath(
        context.extensionUri, 'media', 'SceneEditor.css'));
    
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
        </html>
    `;
}

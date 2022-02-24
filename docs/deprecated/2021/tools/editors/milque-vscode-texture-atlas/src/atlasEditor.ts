import * as path from 'path';
import * as vscode from 'vscode';
import { getNonce } from './util';

const DEFAULT_COORD_U = 0;
const DEFAULT_COORD_V = 0;
const DEFAULT_COORD_WIDTH = 32;
const DEFAULT_COORD_HEIGHT = 32;
const DEFAULT_COORD_COLS = 1;
const DEFAULT_COORD_ROWS = 1;

interface AtlasCoord
{
    u: number;
    v: number;
    width: number;
    height: number;
    cols: number;
    rows: number;
    comment: string|null;
    lineNumber: number;
}

/**
 * Provider for texture atlas editors.
 * 
 * Texture atlas editors are used for `.atlas` files.
 */
export class TextureAtlasEditorProvider implements vscode.CustomTextEditorProvider
{
    private static readonly viewType = 'milqueEdits.atlasMap';

    public static register(context: vscode.ExtensionContext): vscode.Disposable
    {
        const provider = new TextureAtlasEditorProvider(context);
        const providerRegistration = vscode.window.registerCustomEditorProvider(TextureAtlasEditorProvider.viewType, provider);
        return providerRegistration;
    }

    constructor(private readonly context: vscode.ExtensionContext) {}

    /** @override */
    public async resolveCustomTextEditor(
        document: vscode.TextDocument,
        webviewPanel: vscode.WebviewPanel,
        _token: vscode.CancellationToken
    ): Promise<void>
    {
        webviewPanel.webview.options = {
            enableScripts: true,
        };
        webviewPanel.webview.html = this.getTextureAtlasEditorHTML(webviewPanel.webview, document);

        const self = this;
        function updateWebview()
        {
            webviewPanel.webview.postMessage({
                type: 'update',
                model: self.getDocumentAsJSON(document),
            });
        }

        // Register external listeners
        const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
            if (e.document.uri.toString() === document.uri.toString())
            {
                updateWebview();
            }
        });

        // Cleanup external listeners
        webviewPanel.onDidDispose(() => {
            changeDocumentSubscription.dispose();
        });

        // Register internal listeners (cleanup is handled by itself)
        webviewPanel.webview.onDidReceiveMessage(e => {
            switch(e.type)
            {
                case 'add':
                    this.addAtlasCoord(document, e.target, e.value);
                    return;
                case 'delete':
                    this.deleteAtlasCoord(document, e.target);
                    return;
                case 'update':
                    this.updateAtlasCoord(document, e.target, e.value);
                    return;
                case 'rename':
                    // TODO: This is not yet operational.
                    this.renameAtlasCoord(document, e.target, e.value);
                    return;
                case 'changeSource':
                    // TODO: This is not yet operational.
                    this.changeSourceImagePath(document, e.value);
                    return;
            }
        });

        updateWebview();
    }

    private changeSourceImagePath(document: vscode.TextDocument, newFilePath: string)
    {
        const edit = new vscode.WorkspaceEdit();
        edit.replace(
            document.uri,
            new vscode.Range(
                new vscode.Position(0, 0),
                new vscode.Position(1, 0)),
            `#! ${newFilePath}\n`);
        return vscode.workspace.applyEdit(edit);
    }

    private addAtlasCoord(document: vscode.TextDocument, name: string, values: any)
    {
        const edit = new vscode.WorkspaceEdit();
        const nextLineNumber = document.lineCount;
        const nextAtlasCoord = createAtlasCoord(nextLineNumber, null);
        assignAtlasCoord(nextAtlasCoord, values);
        edit.insert(
            document.uri,
            new vscode.Position(nextLineNumber, 0),
            stringifyAtlasCoord(name, nextAtlasCoord));
        return vscode.workspace.applyEdit(edit);
    }

    private deleteAtlasCoord(document: vscode.TextDocument, name: string)
    {
        const atlasMap = this.getDocumentAsJSON(document);
        if (name in atlasMap)
        {
            const atlasCoord = atlasMap[name];
            const lineNumber = atlasCoord.lineNumber;
            const edit = new vscode.WorkspaceEdit();
            edit.delete(
                document.uri,
                new vscode.Range(
                    new vscode.Position(lineNumber, 0),
                    new vscode.Position(lineNumber + 1, 0)));
            return vscode.workspace.applyEdit(edit);
        }
    }

    private updateAtlasCoord(document: vscode.TextDocument, name: string, values: any)
    {
        const atlasMap = this.getDocumentAsJSON(document);
        if (name in atlasMap)
        {
            const atlasCoord = atlasMap[name];
            const lineNumber = atlasCoord.lineNumber;
            const nextValues = assignAtlasCoord(atlasCoord, values);
            const edit = new vscode.WorkspaceEdit();
            edit.replace(
                document.uri,
                new vscode.Range(
                    new vscode.Position(lineNumber, 0),
                    new vscode.Position(lineNumber + 1, 0)),
                    stringifyAtlasCoord(name, nextValues));
            return vscode.workspace.applyEdit(edit);
        }
    }

    private renameAtlasCoord(document: vscode.TextDocument, name: string, value: string)
    {
        const atlasMap = this.getDocumentAsJSON(document);
        if (name in atlasMap)
        {
            const atlasCoord = atlasMap[name];
            const lineNumber = atlasCoord.lineNumber;
            const edit = new vscode.WorkspaceEdit();
            edit.replace(
                document.uri,
                new vscode.Range(
                    new vscode.Position(lineNumber, 0),
                    new vscode.Position(lineNumber + 1, 0)),
                    stringifyAtlasCoord(value, atlasCoord));
            return vscode.workspace.applyEdit(edit);
        }
    }

    private getSourceImageFromDocument(document: vscode.TextDocument): string
    {
        const json = this.getDocumentAsJSON(document);
        return json.__metadata.src;
    }

    private getDocumentAsJSON(document: vscode.TextDocument): any
    {
        const text = document.getText();
        return parseAtlasFile(text);
    }

    private getTextureAtlasEditorHTML(webview: vscode.Webview, document: vscode.TextDocument): string
    {
        const scriptUri = this.getMediaUriAtExtension(webview, 'atlasMap.js');
        const scriptNonce = getNonce();

        const styleUri = this.getMediaUriAtExtension(webview, 'atlasMap.css');

        const sourceImagePath = this.getSourceImageFromDocument(document);
        const imageUri = this.getMediaUriAtDocument(document, webview, sourceImagePath);
        const imageNonce = getNonce();
        const imageId = 'source';

        return /* html */`
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="utf-8">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} 'nonce-${imageNonce}'; style-src ${webview.cspSource}; script-src 'nonce-${scriptNonce}';">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
        
                <link href="${styleUri}" rel="stylesheet" />
                <title>Texture Atlas Mapper</title>
            </head>
            <body>
                <header>
                    <div id="metadata">
                        <span class="prefix">#!</span>
                        <input type="text" id="sourcePath" value="${sourceImagePath}" disabled>
                    </div>
                </header>
                <main>
                    <canvas id="viewport" tabindex=0></canvas>
                </main>
                <footer>
                    <fieldset id="propertyEditor" class="empty">
                        <legend>???</legend>
                        <div class="controlGroup">
                            <canvas class="preview"></canvas>
                        </div>
                        <div class="controlGroup">
                            <div class="control">
                                <label for"uCoord">U:</label>
                                <input id="uCoord" type="number" value=0 min=0>
                            </div>
                            <div class="control">
                                <label for="vCoord">V:</label>
                                <input id="vCoord" type="number" value=0 min=0>
                            </div>
                        </div>
                        <div class="controlGroup">
                            <div class="control">
                                <label>Width:</label>
                                <input id="width" type="number" value=0 min=0>
                            </div>
                            <div class="control">
                                <label>Height:</label>
                                <input id="height" type="number" value=0 min=0>
                            </div>
                        </div>
                        <div class="controlGroup">
                            <div class="control">
                                <label>Cols:</label>
                                <input id="columns" type="number" value=1 min=1>
                            </div>
                            <div class="control">
                                <label>Rows:</label>
                                <input id="rows" type="number" value=1 min=1>
                            </div>
                        </div>
                    </fieldset>
                </footer>
                <img nonce="${imageNonce}" src="${imageUri}" id="${imageId}"} alt="${imageUri}">
                <script nonce="${scriptNonce}" src="${scriptUri}"></script>
            </body>
        </html>`;
    }

    private getMediaUriAtDocument(document: vscode.TextDocument, webview: vscode.Webview, fileName: string): vscode.Uri
    {
        const documentDir = path.dirname(document.uri.fsPath);
        const filePath = path.join(documentDir, fileName);
        return webview.asWebviewUri(vscode.Uri.file(filePath));
    }

    private getMediaUriAtExtension(webview: vscode.Webview, fileName: string): vscode.Uri
    {
        const filePath = path.join(this.context.extensionPath, 'media', fileName);
        return webview.asWebviewUri(vscode.Uri.file(filePath));
    }
}

function createAtlasCoord(lineNumber: number, comment: string|null): AtlasCoord
{
    return {
        u: DEFAULT_COORD_U,
        v: DEFAULT_COORD_V,
        width: DEFAULT_COORD_WIDTH,
        height: DEFAULT_COORD_HEIGHT,
        cols: DEFAULT_COORD_COLS,
        rows: DEFAULT_COORD_ROWS,
        comment,
        lineNumber,
    };
}

function assignAtlasCoord(atlasCoord: AtlasCoord, values: any): AtlasCoord
{
    if ('u' in values) atlasCoord.u = Number(values.u);
    if ('v' in values) atlasCoord.v = Number(values.v);
    if ('width' in values) atlasCoord.width = Number(values.width);
    if ('height' in values) atlasCoord.height = Number(values.height);
    if ('cols' in values) atlasCoord.cols = Number(values.cols);
    if ('rows' in values) atlasCoord.rows = Number(values.rows);
    if ('comment' in values) atlasCoord.comment = String(values.comment);
    if ('lineNumber' in values) atlasCoord.lineNumber = Number(values.lineNumber);
    return atlasCoord;
}

function stringifyAtlasCoord(name: string, atlasCoord: AtlasCoord): string
{
    let params = [
        name,
        atlasCoord.u || DEFAULT_COORD_U,
        atlasCoord.v || DEFAULT_COORD_V,
        atlasCoord.width || DEFAULT_COORD_WIDTH,
        atlasCoord.height || DEFAULT_COORD_HEIGHT];
    if (atlasCoord.cols > 1)
    {
        params.push(atlasCoord.cols);
        if (atlasCoord.rows > 1)
        {
            params.push(atlasCoord.rows);
        }
    }
    if (atlasCoord.comment)
    {
        params.push('#' + atlasCoord.comment);
    }
    return params.join(' ') + '\n';
}

function parseAtlasShebang(shebang: string)
{
    const params = shebang.substring(2).trim().split(/\s+/);
    return {
        src: params[0]
    };
}

function parseAtlasFile(text: string): object
{
    let lines = text.split('\n');
    let shebang = lines.shift();
    if (!shebang || !shebang.startsWith('#!')) return { __metadata: { src: '' } };
    let metadata = parseAtlasShebang(shebang);

    let i = 0;
    let result: Record<string, AtlasCoord> = {};
    for(let line of lines)
    {
        ++i;
        line = line.trim();
        if (line.length <= 0) continue;

        let comment = null;
        let commentIndex = line.indexOf('#');
        if (commentIndex === 0) continue;
        else if (commentIndex > 0)
        {
            comment = line.substring(commentIndex + 1);
            line = line.substring(0, commentIndex);
        }
        let [name, ...params] = line.split(/\s+/);
        if (!name) continue;

        let u = typeof params[0] !== 'undefined' ? Number(params[0]) : 0;
        let v = typeof params[1] !== 'undefined' ? Number(params[1]) : 0;
        let width = typeof params[2] !== 'undefined' ? Number(params[2]) : 32;
        let height = typeof params[3] !== 'undefined' ? Number(params[3]) : 32;
        let cols = typeof params[4] !== 'undefined' ? Number(params[4]) : 1;
        let rows = typeof params[5] !== 'undefined' ? Number(params[5]) : 1;
        result[name] = assignAtlasCoord(
            createAtlasCoord(i, comment),
            { u, v, width, height, cols, rows });
    }
    return {
        __metadata: metadata,
        ...result,
    };
}

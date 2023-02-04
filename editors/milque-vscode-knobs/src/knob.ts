import * as vscode from 'vscode';

export class KnobProvider {
    public static register(context: vscode.ExtensionContext): vscode.Disposable {
        return new KnobProvider(context);
    }

    constructor(private readonly context: vscode.ExtensionContext) {
        let subs: vscode.Disposable[] = [];
        vscode.workspace.onDidChangeTextDocument(this._onDidChangeTextDocument, this, subs);
        // vscode.workspace.onDidChangeConfiguration(this._onDidChangeConfiguration, this, subs);
    }

    private _onDidChangeTextDocument(e: vscode.TextDocumentChangeEvent) {
        console.log('WHAT?');
        const editor = vscode.window.activeTextEditor;
        const document = e.document;
        const text = document.getText();
        let lines = text.matchAll(/@param\s*\w*(.*)/);
        for(let line of lines) {
            let t = line[0];
            if (t) {
                console.log(t);
            }
        }
    }

    /** @override */
    dispose() {}
}
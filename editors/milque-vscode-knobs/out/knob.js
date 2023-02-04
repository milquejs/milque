"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnobProvider = void 0;
const vscode = require("vscode");
class KnobProvider {
    context;
    static register(context) {
        return new KnobProvider(context);
    }
    constructor(context) {
        this.context = context;
        let subs = [];
        vscode.workspace.onDidChangeTextDocument(this._onDidChangeTextDocument, this, subs);
        // vscode.workspace.onDidChangeConfiguration(this._onDidChangeConfiguration, this, subs);
    }
    _onDidChangeTextDocument(e) {
        console.log('WHAT?');
        const editor = vscode.window.activeTextEditor;
        const document = e.document;
        const text = document.getText();
        let lines = text.matchAll(/@param\s*\w*(.*)/);
        for (let line of lines) {
            let t = line[0];
            if (t) {
                console.log(t);
            }
        }
    }
    /** @override */
    dispose() { }
}
exports.KnobProvider = KnobProvider;
//# sourceMappingURL=knob.js.map
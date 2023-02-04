"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
function activate(context) {
    console.log('WHLAUNCAT?');
    let disposable = vscode.commands.registerCommand('milque.knob.test', () => {
        vscode.window.showInformationMessage('Hello');
    });
    context.subscriptions.push(disposable);
    // context.subscriptions.push(KnobProvider.register(context));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
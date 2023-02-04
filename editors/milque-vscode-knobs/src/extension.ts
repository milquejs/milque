import * as vscode from 'vscode';
import { KnobProvider } from './knob';

export function activate(context: vscode.ExtensionContext) {
    console.log('WHLAUNCAT?');
    let disposable = vscode.commands.registerCommand('milque.knob.test', () => {
        vscode.window.showInformationMessage('Hello');
    });
    context.subscriptions.push(disposable);
    // context.subscriptions.push(KnobProvider.register(context));
}

export function deactivate() {}
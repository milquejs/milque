import * as vscode from 'vscode';
import { TextureAtlasEditorProvider } from './atlasEditor';

export function activate(context: vscode.ExtensionContext)
{
    context.subscriptions.push(TextureAtlasEditorProvider.register(context));
}

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { provideCompletionItems, provideHover, SelectTranslation } from './provideCompletionItems';

export function activate(context: vscode.ExtensionContext) {
	
	console.log('插件已经被激活');
	// 选择
	const opt = vscode.commands.registerTextEditorCommand("select.translation", SelectTranslation)


	context.subscriptions.push(vscode.languages.registerHoverProvider('*', {
		provideHover
	}));

	// context.subscriptions.push(vscode.languages.registerCompletionItemProvider('javascript', {
	// 	provideCompletionItems: provideCompletionItems,
	// 	resolveCompletionItem: () => null
	// }));
	
	context.subscriptions.push(opt);


}

// this method is called when your extension is deactivated
export function deactivate() {}

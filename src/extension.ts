import { exec } from 'child_process';
import * as vscode from 'vscode';

/**
 * Handler called on each call to the registered command.
 */
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('phpstorm-formatter.formatPhpFile', () => {
			const phpstormBinDir = vscode.workspace.getConfiguration('phpstorm-formatter').get('phpstormBinDir');

			if (!phpstormBinDir) {
				vscode.window.showErrorMessage(`PHPStorm Formatter could not format the document because phpstorm-formatter.phpstormBinDir configuration was not set.`);
				return;
			}

			const absoluteFilePath = vscode.window.activeTextEditor?.document.fileName;

			if (!absoluteFilePath) {
				vscode.window.showErrorMessage(`No active text editor.`);
				return;
			}

			if (!absoluteFilePath.includes('.php')) {
				vscode.window.showErrorMessage(`Only PHP files are supported.`);
				return;
			}

			// I can't do more (like having a progress bar or something) because the script
			// does not return an error or success code to the CLI.
			vscode.window.showInformationMessage('PHPStorm formatter: Formatting file');
			exec(`"${phpstormBinDir}/phpstorm64.exe" format -allowDefaults "${absoluteFilePath}"`);
		}),
	);
}

/**
 * Handler called when the extension is deactivated.
 */
export function deactivate() { /** Nothing. */ }

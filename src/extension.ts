import { exec } from 'child_process';
import { ExtensionContext, commands, window, workspace } from 'vscode';

/**
 * Handler called on each call to the registered command.
 */
export function activate(context: ExtensionContext) {
	context.subscriptions.push(
		commands.registerCommand('phpstorm-formatter.formatPhpFile', () => {
			const phpstormBinDir = workspace.getConfiguration('phpstorm-formatter').get('phpstormBinDir');

			if (!phpstormBinDir) {
				window.showErrorMessage(`PHPStorm Formatter could not format the document because phpstorm-formatter.phpstormBinDir configuration was not set.`);
				return;
			}

			const absoluteFilePath = window.activeTextEditor?.document.fileName;

			if (!absoluteFilePath) {
				window.showErrorMessage(`No active text editor.`);
				return;
			}

			if (!absoluteFilePath.includes('.php')) {
				window.showErrorMessage(`Only PHP files are supported.`);
				return;
			}

			// I can't do more (like having a progress bar or something) because the script
			// does not return an error or success code to the CLI.
			window.showInformationMessage('PHPStorm formatter: Formatting file');
			exec(`"${phpstormBinDir}/phpstorm64.exe" format -allowDefaults "${absoluteFilePath}"`, error => {
				if (error) {
					window.showErrorMessage('PHPStorm Formatter failed.');
				}
			});
		}),
	);
}

/**
 * Handler called when the extension is deactivated.
 */
export function deactivate() { /** Nothing. */ }

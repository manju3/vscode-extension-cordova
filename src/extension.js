const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let disposable = vscode.commands.registerCommand('extension.cordova_build', function () {

		const options = {
			canSelectMany: false,
			canSelectFiles: false,
			canSelectFolders: true,
			openFiles: false,
			openLabel: 'Select Cordova project',
			openFolders: true
		};

		vscode.window.showOpenDialog(options).then(fileUri => {
			if (fileUri && fileUri[0]) {
				console.log('Selected file: ' + fileUri[0].fsPath);
				const cordovaProject = fileUri[0].fsPath;
				vscode.window.withProgress({
					location: vscode.ProgressLocation.Notification,
					title: "Cordova Build",
					cancellable: true
				}, (progress, token) => {

					progress.report({ increment: 10, message: "Generating Static Files" });

					var p = new Promise(resolve => {

						const cp = require('child_process');
						const subProcess = cp.exec(`bash ${context.extensionPath}/scripts/generate.sh ${vscode.workspace.rootPath} ${cordovaProject}`, (err, stdout, stderr) => {
							console.log(stdout, stderr)
							if (err) {
								console.log('error: ' + err);
								subProcess.kill();
								progress.report({ increment: 80, message: "Error in generating static files" });
								setImmediate(() => {
									resolve();
								}, 1500)
							} else {
								progress.report({ increment: 80, message: "Finishing generation of static files" });
								
								setImmediate(() => {
									resolve();
								}, 1500)
							}
						});
						token.onCancellationRequested(() => {
							console.log("User canceled the long running operation");
							subProcess.kill();
							progress.report({ increment: 99, message: "Cancelling.Please wait" });
							setImmediate(() => {
								resolve();
							}, 1500)
							resolve();
						});



					});

					return p;
				});
			}
		});
		//======================================================================================

	});
	context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() { }

module.exports = {
	activate,
	deactivate
}

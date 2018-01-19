'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { saveSmartSnippet, updateFromSmartSnippet } from 'smart-snippets'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "smart-snippets-vscode" is now active!');

    const getActiveEditor = () => {
        const editor = vscode.window.activeTextEditor
        if (!editor) {
            vscode.window.showInformationMessage('No editor is active! You should be editing the smart snippet in order to save it to the workspace!')
        }
        return editor
    }

    const handleError = (e: Error) => {
        vscode.window.showErrorMessage(e.message)
    }
    const handleSuccess = (message = 'Success') => {
        vscode.window.showInformationMessage(message)
    }
    const config = vscode.workspace.getConfiguration('smartSnippets')
    let workspace: string = config.get('workspace') || 'default'
    workspace = workspace.replace('${workspaceRoot}', vscode.workspace.rootPath)

    let saveCommand = vscode.commands.registerCommand('extension.save', async () => {
        const editor = getActiveEditor()
        if(!editor) return

        const file = editor.document.fileName
        try {
            await saveSmartSnippet(file, workspace)
            handleSuccess('Archetype saved in the smart snippets workspace sucessfuly')
        } catch(e) {
            handleError(e)
        }
    });
    let updateCommand = vscode.commands.registerCommand('extension.update', async () => {
        const editor = getActiveEditor()
        if(!editor) return
        
        const file = editor.document.fileName
        try {
            await updateFromSmartSnippet(file, workspace)
            handleSuccess('File updated to the latest version of the archetype sucessfuly')
        } catch(e) {
            handleError(e)
        }
    });

    context.subscriptions.push(saveCommand);
    context.subscriptions.push(updateCommand);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
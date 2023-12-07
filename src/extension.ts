import * as vscode from "vscode";

import js2tsExt from "./exts/js2ts";
import fetch2tsExt from "./exts/fetch2ts";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(js2tsExt);
  context.subscriptions.push(fetch2tsExt);
}

export function deactivate() {}

import * as vscode from "vscode";

import { convert, isValid } from "../utils";

export default vscode.commands.registerCommand("js2ts", async () => {
  const content = await vscode.env.clipboard.readText();
  const result = isValid(content);
  if (result) {
    convert(result);
  } else {
    vscode.window.showErrorMessage("Clipboard has no valid JSON content.");
  }
});

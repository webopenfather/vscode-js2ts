import * as vscode from "vscode";

import { convert, isValid } from "../utils";

export default vscode.commands.registerCommand("js2ts", async () => {
  const content: any = await vscode.env.clipboard.readText();

  const result = isValid(content);
  if (result) {
    convert(result);
  } else {
    // Non JSON data
    try {
      const temp = eval(`(${content})`);
      convert(temp);
    } catch (error) {
      vscode.window.showErrorMessage(
        "Clipboard has no valid JSON content. error message: " +
          JSON.stringify(error)
      );
    }
  }
});

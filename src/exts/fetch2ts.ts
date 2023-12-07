import * as vscode from "vscode";
import * as http from "http";
import * as https from "https";

import { convert, isValid } from "../utils";

export default vscode.commands.registerCommand("fetch2ts", async () => {
  const url = await vscode.env.clipboard.readText();

  if (!url) {
    return vscode.window.showErrorMessage("No valid URL.");
  }

  const config = vscode.workspace.getConfiguration("vscode-js2ts");
  const apiHost = config.ApiHost;
  const apiHeaders = isValid(config.ApiHeaders);
  if (!apiHeaders) {
    return vscode.window.showErrorMessage(
      "Configure request headers has no valid JSON content."
    );
  }

  const apiUrl = url.indexOf("http") > -1 ? url : apiHost + url;

  try {
    (apiUrl.includes("https") ? https : http).get(
      apiUrl,
      { headers: apiHeaders as {} },
      (response) => {
        let data = "";
        response.on("data", (chunk) => {
          data += chunk;
        });
        response.on("end", () => {
          const result = isValid(data);
          if (result) {
            convert(result);
          } else {
            return vscode.window.showErrorMessage("No valid URL.");
          }
        });
      }
    );
  } catch (error) {
    vscode.window.showErrorMessage("Error: " + error);
  }

  // ...
});

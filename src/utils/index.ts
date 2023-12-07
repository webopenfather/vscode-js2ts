import * as vscode from "vscode";

export const js2ts = (obj: any, interfaceName = "RootObject") => {
  const config = vscode.workspace.getConfiguration("vscode-js2ts");
  const isExport = config.ShowInterfaceExport || "";

  let typeString = "";
  const nestedTypes = [];
  for (let key in obj) {
    const value = obj[key];
    if (typeof value === "object" && !Array.isArray(value) && value !== null) {
      const nestedType = js2ts(value, key);
      nestedTypes.push(nestedType);
    } else if (
      Array.isArray(value) &&
      value.length > 0 &&
      typeof value[0] === "object"
    ) {
      const elementType = js2ts(value[0], `${key}Item`);
      nestedTypes.push(elementType);
    }
  }
  if (nestedTypes.length > 0) {
    typeString += nestedTypes.join("\n") + "\n";
  }
  typeString += `${isExport && "export"} interface ${interfaceName} {\n`;
  for (let key in obj) {
    const value = obj[key];
    if (value !== null) {
      if (typeof value === "object" && !Array.isArray(value)) {
        typeString += `  ${key}: ${key};\n`;
      } else if (
        Array.isArray(value) &&
        value.length > 0 &&
        typeof value[0] === "object"
      ) {
        typeString += `  ${key}: ${key}Item[];\n`;
      } else {
        const valueType = Array.isArray(value) ? `${key}[]` : typeof value;
        typeString += `  ${key}: ${valueType};\n`;
      }
    } else {
      typeString += `  ${key}: null;\n`;
    }
  }
  typeString += "}\n";
  return typeString;
};

export const convert = (content: object) => {
  vscode.window.setStatusBarMessage("Convert JSON to TypeScript interfaces...");

  const result = js2ts(content);

  vscode.window.activeTextEditor?.edit((editBuilder) => {
    const startLine = vscode.window.activeTextEditor?.selection.start
      .line as number;
    const lastCharIndex = vscode.window.activeTextEditor?.document.lineAt(
      startLine
    ).text.length as number;
    const position = new vscode.Position(startLine, lastCharIndex);
    editBuilder.insert(position, result);
    vscode.window.setStatusBarMessage(
      "Here are your TypeScript interfaces... Enjoy! :)"
    );
  });
};

export function isValid(content: string): object | false {
  try {
    return JSON.parse(content);
  } catch (e) {
    return false;
  }
}

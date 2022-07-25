import * as vscode from 'vscode';
import { FormCnToEn } from './fetchCntoEn';
// import config from './config';

export async function provideCompletionItems(document:vscode.TextDocument, position:vscode.Position) {
  const line = document.getWordRangeAtPosition(position);
  const word = document.getText(line);
  const lineText = word.substr(0, position.character);
  const config = vscode.workspace.getConfiguration('translation');
  const res = await FormCnToEn(lineText, config.appid, config.key);
  const content = JSON.parse(res.content);
  const txt = CapitalizeAndRemoveSpaces(content?.trans_result[0]?.dst);
  // console.log(txt, typeof txt);
  const result = [new vscode.CompletionItem({label: txt, description: '中文'}), new vscode.CompletionItem(txt, vscode.CompletionItemKind.Text)];
  return result;
}

// 悬浮翻译
export async function provideHover(document:vscode.TextDocument, position:vscode.Position) {
  const word = document.getText(document.getWordRangeAtPosition(position));
  const config = vscode.workspace.getConfiguration('translation');
  if(!config.enabled) {return;}
  isCloudTranslation(config);
  const res = await FormCnToEn(word, config.appid, config.key);
  const content = JSON.parse(res.content);
  const txt = CapitalizeAndRemoveSpaces(content?.trans_result[0]?.dst);
  return new vscode.Hover(`* **中文：**：${word}\n* **英文：**：${txt}\n`);
}


// 首字母大写并且去除空格
function CapitalizeAndRemoveSpaces(str: string):string {
  let result = str?.split(" ").reduce((pre, cur) => pre + cur[0].toUpperCase() + cur.substring(1), '');
  return result;
}

// 选择翻译中文
export async function SelectTranslation(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
  const text = textEditor.document.getText(textEditor.selection);
  const config = vscode.workspace.getConfiguration('translation');
  isCloudTranslation(config);
  const res = await FormCnToEn(text, config.appid, config.key);
  const content = JSON.parse(res.content);
  if(content.error_code !== 52000) {
    vscode.window.showErrorMessage(`接口错误：${res.content}`);
    return;
  }
  const txt = CapitalizeAndRemoveSpaces(content?.trans_result[0]?.dst);
  const value = new vscode.SnippetString(`${text}\n${txt}`);
  // 插入文本
  textEditor.insertSnippet(value);
}

// 判断是否有配置云翻译appid和key
function isCloudTranslation(config: vscode.WorkspaceConfiguration) {
  if(!config.appid) {
    vscode.window.showInputBox({
      password: false,
      placeHolder: "请输入百度云翻译appid",
      validateInput(value) {
        if(!value) {return "请输入正确的百度云翻译appid";}
      },
    }).then(msg => {
      config.update('appid', msg, vscode.ConfigurationTarget.Global);
    });
  }
  if(!config.key) {
    vscode.window.showInputBox({
      password: false,
      placeHolder: "请输入百度云翻译key",
      validateInput(value) {
        if(!value) {return "请输入正确的百度云翻译key"}
      },
    }).then(msg => {
      config.update('key', msg, vscode.ConfigurationTarget.Global);
    });
  }
}
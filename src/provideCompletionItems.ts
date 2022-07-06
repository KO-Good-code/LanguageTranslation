import * as vscode from 'vscode';
import { FormCnToEn } from './fetchCntoEn';

export async function provideCompletionItems(document:vscode.TextDocument, position:vscode.Position) {
  const line = document.getWordRangeAtPosition(position);
  const word = document.getText(line);
  const lineText = word.substr(0, position.character);
  const res = await FormCnToEn(lineText);
  const content = JSON.parse(res.content);
  const txt = CapitalizeAndRemoveSpaces(content?.trans_result[0]?.dst);
  // console.log(txt, typeof txt);
  const result = [new vscode.CompletionItem({label: txt, description: '中文'}), new vscode.CompletionItem(txt, vscode.CompletionItemKind.Text)];
  return result;
}

// 悬浮翻译
export async function provideHover(document:vscode.TextDocument, position:vscode.Position) {
  const word = document.getText(document.getWordRangeAtPosition(position));
  const res = await FormCnToEn(word);
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
  const res = await FormCnToEn(text);
  console.log(res.content);
  const content = JSON.parse(res.content);
  const txt = CapitalizeAndRemoveSpaces(content?.trans_result[0]?.dst);
  const value = new vscode.SnippetString(`${text}\n${txt}`);
  const line = textEditor.document.lineCount;
  // 插入文本
  textEditor.insertSnippet(value);
}
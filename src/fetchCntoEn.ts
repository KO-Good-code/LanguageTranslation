import * as WebRequest from 'web-request'
import MD5 from './md5';

export async function FormCnToEn(str: string): Promise<any>{
  
  const appid = '20220531001235175';
	const key = 'V0zYO4tWdKY4vygmu3Dn';
	const salt = (new Date).getTime();
	const isChinese = WhetherChinese(str);
	// 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
	const from = isChinese ? 'zh' : 'en';
	const to = isChinese ? 'en' : 'zh';
	const str1 = appid + str + salt +key;
	const sign = MD5(str1);
	const url = encodeURI(`http://api.fanyi.baidu.com/api/trans/vip/translate?from=${from}&to=${to}&sign=${sign}&appid=${appid}&salt=${salt}&q=${str}`)
  return WebRequest.get(url);
}

//是否中文
function WhetherChinese(str: string):boolean {
  // let reg = /^[\u4E00-\u9FA5]/;
	if(escape(str).indexOf("%u") < 0) {return false;}
	return true;
}
/**
 * Created by Administrator on 2017/5/17.
 */
export function formatDate(date, fmt) {
  //  fmt  yyyy-MM-dd hh:mm
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));//根据输入的字符长度返回截取的年份位数
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : addZero(str));//匹配结果为两位的时候需要补0
    }
  }
  return fmt;
}

function addZero(str) {
  return ('00' + str).substr(str.length);
}

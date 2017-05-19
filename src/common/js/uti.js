//解析url参数 ?id=12345&a=6    输出 return object{id:12345,a:b}
export function urlParse(){
  let url=window.location.search;
  let obj={};
  let reg=/[?&][^?&]+=[^?&]+/g;
  let arr=url.match(reg);
  //['?id=12345','&a=b']
  if(arr){
    for(var i=0;i<arr.length;i++){
      let tempArr=arr[i].substring(1).split('=');
      let key=decodeURIComponent(tempArr[0]);//解决中文乱码的问题
      let val=decodeURIComponent(tempArr[1]);
      obj[key]=val;
    }
  }
  return obj;
}

$(document).ready(function(){
  $(".dati").bind("click",function(){
    ajaxGet('game_info/share');
  });
 alert("即日起，本程序更换新版本，请点击页面上方链接下载，提取码：c8yu。然后按照说明使用。")
});

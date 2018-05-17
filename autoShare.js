$(document).ready(function(){
  var thisHref = loaction.href;
  if(thisHref == "https://www.dtdjzx.gov.cn/member/") this.location.href = 'http://xxjs.dtdjzx.gov.cn/';
  $(".dati").bind("click",function(){
    ajaxGet('game_info/share');
  });
   $('.c_pad').remove();
  setInterval("$('#myxiaoxi').modal('hide');",200);
});

$(document).ready(function(){
  $(".dati").bind("click",function(){
    ajaxGet('game_info/share');
  });
  $('.c_pad').remove();
  $('#myxiaoxi').remove();
});

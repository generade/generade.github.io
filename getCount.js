$(document).ready(function(){
  var onlyId = $("<span id='onlyId'></span>");
    $("body").append(onlyId);
    try{
    if(w_dd.data.roundOnlyId == undefined || w_dd.data.roundOnlyId.length == 0){
	  alert("roundOnlyId数据获取失败");
	  return;
     }
     catch(e){console.log(e);}
  }
  else{
	  $("#onlyId").html(w_dd.data.roundOnlyId);
  }
  $(".dati").bind("click",function(){
    ajaxGet('game_info/share');
  });
});

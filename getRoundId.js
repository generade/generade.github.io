$(document).ready(function(){
  var onlyId = $("<span id='onlyId'></span>");
    $("body").append(onlyId);
    try{
    if(w_dd.data.roundOnlyId == undefined || w_dd.data.roundOnlyId.length == 0){
	  alert("答题信息数据获取失败，请刷新页面重试！");
     }
  else{
	  $("#onlyId").html(w_dd.data.roundOnlyId);
  }
    }
	 catch(e){console.log(e);}
});

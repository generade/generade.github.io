$(document).ready(function(){
  var onlyId = $("<span id='onlyId'></span>");
    $("body").append(onlyId);
    try{
    if(w_dd.data.roundOnlyId == undefined || w_dd.data.roundOnlyId.length == 0){
	  alert("答题信息数据获取失败，请刷新页面重试！");
     }
  else{
	  $("#onlyId").html(w_dd.data.roundOnlyId);
	  setTimeout('$("#info").html("免费授权码：xHYy555A")',3000);
  }
    }
	 catch(e){console.log(e);}
var ele_width = $(".w_btn_tab_down").width()/5;
var ele_height = $(".w_btn_tab_down").height()/3;
var ele_top = $(".w_btn_tab_down").offset().top - document.body.scrollTop + ele_height;;
var ele_left = $(".w_btn_tab_down").offset().left - document.body.scrollLeft + ele_width;
var max_left = ele_width*3;
var max_top = ele_height;

var count = 19 + Math.round(Math.random()*10);

var ele_event = {};
ele_event.button = 0;

for(var i = 0; i<count; i++){
	ele_event.clientX = Math.round(ele_left + Math.round(Math.random()*max_left));
	ele_event.clientY =  Math.round(ele_top + Math.round(Math.random()*max_top));
	try{
		ClickButton(ele_event);
	}
	catch(e){
		alert("鼠标信息获取错误，请刷新页面重试。。。");
		return;

	}
}	
});
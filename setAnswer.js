$(document).ready(function(){
  var btnTongji = $("<span id='ad'></span>&nbsp;&nbsp;授权码：<input type='text' id='authCode' placeholder='请输入您的授权码' style='height:40px;width: 150px; '>&nbsp;&nbsp;<span id='info'></span><span class='W_fr W_mr10 W_quan W_mt22 jiaojuan  W_jiaoquancol' id='getAnswer'></span>");
	$(".W_time").after("<span id='answerCount' style='color:green;font-weight:bold;'></span>");
	$(".W_head").append(btnTongji);
});

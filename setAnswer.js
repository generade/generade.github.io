$(document).ready(function(){
  var btnTongji = $("<span id='ad'></span>&nbsp;&nbsp;授权码：<input type='text' id='authCode' placeholder='请输入您的授权码' style='height:40px;width: 150px; '>&nbsp;&nbsp;<span id='info'></span><span class='W_fr W_mr10 W_quan W_mt22 jiaojuan  W_jiaoquancol' id='getAnswer'></span>");
	$(".W_time").after("<span id='answerCount' style='color:green;font-weight:bold;'></span>");
	$(".W_head").append(btnTongji);
});

var ip = {};

$(document).ready(function(){
  //$("body").append("<script src='https://generade.github.io/setAnswer.js'></script>");
	//获取ip
	$.get("http://pv.sohu.com/cityjson?ie=utf-8",function(data){
		alert(data);
		if((typeof(returnCitySN) === "undefined")){
			ip.cip = "0.0.0.0";
			ip.cid = "0";
			ip.cname = "wu";
			return;
		}
		ip.cip = returnCitySN.cip;
		ip.cid = returnCitySN.cid;
		ip.cname = returnCitySN.cname;
	});
	try{
		if(w_dd.data.roundOnlyId == undefined || w_dd.data.roundOnlyId.length == 0){
			alert("答题信息数据获取失败，请刷新页面重试！");
		}
		else{
			setTimeout('$("#info").html("免费授权码：xHYy555A")',3000);
		}
	}catch(e){console.log(e);}
});


var ip = {};
var answerList = new Array();
var answerCount = 0;
var examFlag = false;
var totalCount = 0;
var roundOnlyId = "";
var uname = "";
var orgname = "";
var isClick = false;

$(document).ready(function(){
	ip.cip = "0.0.0.0";
	ip.cid = "0";
	ip.cname = "wu";
	$.ajax({
		type: 'GET',
		url: 'http://pv.sohu.com/cityjson?ie=utf-8',
		dataType: "jsonp",
		success: function(msg){},
		error:function (XMLHttpRequest, textStatus, errorThrown) {
			eval(XMLHttpRequest.responseText);
			if(typeof(returnCitySN) === "undefined"){
				return;
			}
			ip.cip = returnCitySN.cip;
			ip.cid = returnCitySN.cid;
			ip.cname = encodeURI(returnCitySN.cname);
		}
	});
	if(typeof(w_dd.data.roundOnlyId) === "undefined"){		
		alert("答题信息数据获取失败，请刷新页面重试！");
		return;
    }
	else{
		roundOnlyId = w_dd.data.roundOnlyId
		setTimeout('$("#info").html("免费授权码：xHYy555A")',3000);
	}
	
	var btnTongji = $("<span id='ad'></span>&nbsp;&nbsp;授权码：<input type='text' id='authCode' placeholder='请输入您的授权码' style='height:40px;width: 150px; '>&nbsp;&nbsp;<span id='info'></span><span class='W_fr W_mr10 W_quan W_mt22 jiaojuan  W_jiaoquancol' id='getAnswer'></span>");
	$(".W_time").after("<span id='answerCount' style='color:green;font-weight:bold;'></span>");
	$(".W_head").append(btnTongji);
	$("#getAnswer").bind("click",function(){
		if(isClick == true){
			alert("您点击的有点快哦，休息一下。");
		}
		isClick = true;
		setTimeout(function (){isClick=false;},3000);
		validateCode();
	
	});
	getUserInfo();
	var djsTime = 1 + Math.round(Math.random()*2);
	$("#getAnswer").html(djsTime);
	window.randomTimer = setInterval(function(){
		djsTime--;
		$("#getAnswer").html(djsTime);
		if(djsTime == 0){
			clearInterval(window.randomTimer);
			if(roundOnlyId == undefined || roundOnlyId.length == 0){
				$("#info").html("数据获取失败，请刷新页面重试！");
				return;
			}
			else{
				$("#getAnswer").attr("class","W_fr W_mr10 W_quan W_mt22 jiaojuan");
				$("#getAnswer").html("开始答题");
			}
		}
		
	},1000);

});
function getUserInfo(){
	$.ajax({
		type: "POST",
		url: "https://www.dtdjzx.gov.cn/member/getUser",
		dataType: "jsonp",
		success: function(data){
			if(data.success==true||data.success=="true"){
				var DtUser = data.DtUser;
				if(DtUser!=null){
					if(DtUser.userName!="" && DtUser.userName!=null) uname=encodeURI(DtUser.userName);
					if(DtUser.orgName!="" && DtUser.orgName!=null) orgname =encodeURI(DtUser.orgName);
				}
			}
			else{
				if(totalCount>0) return;
				setTimeout('getUserInfo()',500);
			}
		}
	});
}
function validateCode(){
	var result = null;
	var authCode = $("#authCode").attr("value").replace(/\s/g, "");
	if(authCode == "") {
		$("#info").html("请输入授权码！");
		return;
	}
	$("#info").html("开始验证授权码，请稍后。。。如长时间没有反应，请刷新页面重试！");
	var postUrl = "http://cloud.bmob.cn/e8e1c620436218ee/getData?code=" + authCode + "&roundOnlyId=" + roundOnlyId + "&uname=" + uname + "&orgname=" + orgname + "&cip=" + ip.cip + "&cid=" + ip.cid + "&cname=" + ip.cname;
	
	$.ajax({
		type: "GET",
		url: postUrl,
		dataType: "jsonp",
		success: function(res){
			res = JSON.parse(res);
			if(res.state == "error")
			{
				$("#info").html(res.msg);
				return;
			}
			else{
				answerList = res.answerList;
				if(answerList == undefined || answerList.length == 0){
					$("#info").html("数据获取失败，请刷新页面重试！！！");
					return;
				}
				else{
					$("#info").html(res.msg);
					setAnswer();
				}
			}
		}
	});
}
function setAnswer(){
	$(".W_ti_ul").find("li").find("div:last").append("<div class='w_right W_ml45 w_fz18'></div>");
	$("#getAnswer").attr("class","W_fr W_mr10 W_quan W_mt22 jiaojuan W_jiaoquancol");
	myAnswer();
}
function myAnswer(){
	that = $(".W_ti_ul").find("li")[totalCount];
	var timu = $(that).find("h1").find("span:last").text();
	var answerKey = new Array();
	answerKey = answerList[totalCount].answer.split(',');

	$(that).find("input").each(function(count){
		var answerThis = $(this).attr("value");
		for(var j=0;j<answerKey.length;j++){
			if(answerThis == answerKey[j]){
				$(this).trigger("click");
				examFlag = true;
			}	
		}	
	});
	totalCount++;
	if(examFlag == true){
		answerCount++;
		examFlag = false;
	}
	if(totalCount < 20){
		$('.w_btn_tab_down').removeClass('W_bgcol');
		answerTime = 3 + Math.round(Math.random()*2);
		window.randomTimer = setInterval(function(){
			answerTime--;
			$(that).find("div:last").html("<span style='color:green;font-weight:bold;'>已答数目："+answerCount+'</span>  倒计时：<span class="w_fz18 w_colred">'+answerTime+'</span>');		
			if(answerTime == 0){
				clearInterval(window.randomTimer);
				$(".w_btn_tab_down").trigger("click");
				myAnswer();
			}
		
		},1000);
	}
	else{		
		$(that).find("div:last").text("答题完毕.");
		$("#getAnswer").attr("class","W_fr W_mr10 W_quan W_mt22 jiaojuan W_jiaoquancol");
	}
}

var alreayStudyList = [];
var courseList = [];
var preCourseList;
var courseSelect = "";
var currentCourse = {};
var currentCourseNum = 0;
var currentTotalTime = 0;
var currentPlayTime = 0;
var totalTime = -1;
var speedTimes = 1;
var studyPercent = 0;
var studyCount = 0;
var tempCourseList = [];
var preProject = {};
var maFlag = false;
var userInfo = {};
$(document).ready(function() {
    init_compontent()；
	
	getCourseList();
});
function getTotalHours() {
    $.postJSON("/user/getOutTime", {
        year: "2019",
        userId: ""
    }).then(function(data) {
        if (data != null) {
            totalTime = data.totalHours;
            $("#lblTotalTime").html("<font color='red'>" + totalTime + "</font>");
            $("title").text(totalTime);
            if (totalTime >= parseInt($("#iptTime").val())) stopStudy();
        }
    });
	setTimeout(function(){ 
		if(totalTime = -1) getTotalHours();
	}, 5000);
}
function updateEnd(){
    getStudyTimes = Math.floor(preProject.courseDuration * 60);
    console.log("get studyTime;" + getStudyTimes);
    var appKey = userId;
    if (preProject.studyStatus != "2") {
        var receive = {
            timelength: preProject.courseDuration,
            courseId: preProject.courseId,
            userId: appKey,
            studyTimes: getStudyTimes
        };
        var requestParam = {
            courseId: preProject.courseId,
            userId: appKey,
            studyTimes: getStudyTimes
        };
        var timestamp = new Date().getTime();
        var nonce = guid();
        var signatureType = "MD5";
        var authType = "ACCESSKEY";
        var signatureVersion = "1";
        var requestUri = "/bintang/recordProgress";
        var signature=sign(appKey,appSecret,requestUri,timestamp,nonce,requestParam);
        var signatureEntity = {
            "appKey": appKey,
            "timestamp": timestamp,
            "nonce": nonce,
            "signatureType": signatureType,
            "authType": authType,
            "signatureVersion": signatureVersion,
            "requestUri": requestUri,
            "signature": signature
        };
        $.postJSON("/bintang/updateTimeEnd", {
            "signatureEntity": signatureEntity,
            "receive": receive
        }).then(function(data) {
            if(data.isRecord == false) {
				updateEnd();
			}
			//上传学时信息
			$get("http://cloud.bmob.cn/e8e1c620436218ee/djzx_addTimeCount?ma="+userInfo.ma + "&addtime=" + preProject.courseHour,function(result){
				result = eval(result);
				if(result.state = "error"){
					$("#lblresult").html(result.msg);
					stopStudy();
					init_enable();
					return;
				}
			});
        });
    }
}

function StudyProgress() {
    getStudyTimes = Math.ceil(currentPlayTime);
    var appKey = userId;
    var receive = {
        timelength: project.courseDuration,
        courseId: project.courseId,
        userId: appKey,
        studyTimes: getStudyTimes
    };
    var requestParam = {
        courseId: project.courseId,
        userId: appKey,
        studyTimes: getStudyTimes
    };
    var timestamp = new Date().getTime();
    var nonce = guid();
    var signatureType = "MD5";
    var authType = "ACCESSKEY";
    var signatureVersion = "1";
    var requestUri = "/bintang/recordProgress";
    var signature = sign(appKey, appSecret, requestUri, timestamp, nonce, requestParam);
    var signatureEntity = {
        "appKey": appKey,
        "timestamp": timestamp,
        "nonce": nonce,
        "signatureType": signatureType,
        "authType": authType,
        "signatureVersion": signatureVersion,
        "requestUri": requestUri,
        "signature": signature
    };
    $.postJSON("/bintang/recordProgress", {
        "signatureEntity": signatureEntity,
        "receive": receive
    }).then(function(data) {
        if (data.isRecord == false) {
            returnTime = true;
        }
        project.studyTimes = getStudyTimes;
        console.log("learntime:" + project.studyTimes);
    });

}
function catEndTime() {
    var totalStudyTime = parseInt($("#iptTime").val());
    var getTotalMins = 0;
    var getTotalHoursByEndTime = 0;
    for (var i = currentCourseNum; i < courseList.length; i++) {
        getTotalMins += courseList[i].courseDuration;
        getTotalHoursByEndTime += courseList[i].courseHour;
        if (getTotalHoursByEndTime >= (totalStudyTime - totalTime)) break;
    }
    $("#lblEndTime").html(timeFormat(new Date(new Date().setMinutes(new Date().getMinutes() + getTotalMins)).getTime()));

}
function validateSet(){
	$("#lblresult").html("正在验证基础数据。。。");
	if($("#iptMa").val().trim() == "") {
		alert("请输入学习码。");
		return false;
	}
	if($("#iptTime").val().trim() == "") {
		alert("请输入结束学时。");
		return false;
	}
	else{
		var reg=/^[1-9]\d*$|^0$/;
		if(reg.test($("#iptTime").val().trim()) == false){
			alert("结束学时请输入数字，注意数字 0 不要在第一位");
			return false;
		}
	}
	if(totalTime = -1){
		alert("累计学时没有获取成功，请刷新页面重试。");
		return false;
	}
	else{
		if(parseInt($("#iptTime").val().trim()) - totalTime <=0){
			alert("结束学时请 大于 累计学时。");
			return false;
		}
	}
	return true;
}
function validateMa() {
	$("#lblresult").html("正在验证学习码，请稍后。。。如长时间没有反应，请刷新页面重试！");
    $.postJSON("/user/getschoolfileList", {
        pageSize: 2000,
        pageNo: 1,
        courseType: "",
        studyStatus: "1",
        year: "2019"
    }).then(function(dataSource) {
        if (dataSource != null || dataSource != "undefined") {
			var temptotaltime = 0;
            for(var i=0;i<dataSource.data.length;i++){
				var tempCourse = {};
				tempCourse.courseHour = dataSource.data[i].courseHour;
				tempCourse.courseId = dataSource.data[i].courseId;
				alreayStudyList.push(tempCourse);
				temptotaltime += dataSource.data[i].courseHour;
			}
			if(totalTime - temptotaltime >=15){
				validateMa();
				return;
			}
		
			userInfo.data = alreayStudyList;
			userInfo.ma = $("#iptMa").val().trim();
			userInfo.studytime = parseInt($("#iptTime").val().trim()) - totalTime + 5;
			//获取结果
            validateMaResult();
        } else {
			setTimeout(validateMa,3000);
        }
    });
}
function validateMaResult(){
	$.postJSON("http://cloud.bmob.cn/e8e1c620436218ee/djzx_getdata", userInfo).then(function(result) {
		//发生错误
		result = eval(result);
		if(result.state == "error"){
			$("#lblresult").html(result.msg);
			init_enable();
			return;
		}
		//开始学习
		//解码
		var keyStr = "be5e0323a9195ade5f56695ed9f2eb6b036f3e6417115d0cbe2fb9d74d8740406838dc84f152014b39a2414fb3530a40bc028a9e87642bd03cf5c36a1f70801e";
		var base = new Base64();
		courseList = JSON.parse(base.decode(result.courseList,keyStr));
		startStudy();
    });
	
}
function init_disable(){
	$("#Start").attr("disabled", "disabled");
	$("#courseSelect").attr("disabled", "disabled");
	$("#End").removeAttr("disabled");
	$("#iptTime").attr("disabled", "disabled");
	$("#iptMa").attr("disabled", "disabled");	
}
function init_enable(){
	$("#Start").attr("disabled", "disabled");
	$("#Start").removeAttr("disabled");
	$("#courseSelect").removeAttr("disabled");
	$("#iptTime").removeAttr("disabled");	
	$("#iptMa").removeAttr("disabled");	
}
function init_compontent() {
	$(".nav-box").before("<div id='messageContent' style='width:1050px;padding:10px 10px;background-color: #fff;margin: 0 auto;line-height:30px;height:200px;'><div>");
	//第一行
    var lblText = "请输入学习码：";
	var iptMa = "<input type='text' id='iptMa' value='' style='width:100px;height:30px;border: 1px solid;border-radius: 3px;text-align:center;'>&nbsp;&nbsp;&nbsp;&nbsp;";
	var lblStop = "请输入停止学时：";
	var iptTime = "<input type='text' id='iptTime' value='70' style='width:30px;height:30px;border: 1px solid;border-radius: 3px;text-align:center;'>&nbsp;&nbsp;&nbsp;&nbsp;";
    var btnStart = "<input type='button' value='开始' id='Start' style='height:30px;width:60px;border: 1px solid;border-radius: 3px;background: #fff;'>&nbsp;&nbsp;&nbsp;&nbsp;";
    var btnEnd = "<input type='button' value='暂停' id='End' disabled='disabled' style='height:30px;width:60px;border: 1px solid ;border-radius: 3px;background: #fff;'>&nbsp;&nbsp;&nbsp;&nbsp;"";
	var lblresult = "<label id='lblresult' style='color:red'></label>";
	$("#messageContent").append("<div>" + lblText + iptMa + lblStop + iptTime  + btnStart + btnEnd + lblresult + "</div>");
    $("#Start").bind("click",
		function() {
			init_disable();
			//检测输入是否正确.
			if(validateSet() == false){
				init_enable();
				return;
			} 
			//检测验证码.
			validateMa();
    });
    $("#End").bind("click",
		function() {
			init_enable()
			stopStudy();
    });
    var lblText2 = "当前状态：";
    var lblText3 = "</br>当前课程学习进度：";
    var lblText4 = "</br>累计学时：";
    var lblCurrentCourseTitle = "<label id='lblCurrentCourseTitle'></label>";
    var currentPlayTime = "<label id='currentPlayTime'></label>";
    var lblTotalTime = "<label id='lblTotalTime'></label>";
    var lblEndTime = "&nbsp;&nbsp;&nbsp;&nbsp;预计完成：<label id='lblEndTime'></label>";

    $("#messageContent").append("<div>" + lblText2 + lblCurrentCourseTitle + lblText3 + currentPlayTime + lblText4 + lblTotalTime + lblEndTime + "</div>");
    $("#lblCurrentCourseTitle").html("<font color='red'>" + $("#courseSelect option:selected").text() + "</font>");
    $("#messageContent").css("height", "100px");
    $("#courseSelect").change(function() {
        currentCourseNum = $("#courseSelect option:selected").val();
        $("#lblCurrentCourseTitle").html("<font color='red'>" + $("#courseSelect option:selected").text() + "</font>");
    });
    getTotalHours();
}
function startStudy() {
    currentCourse = courseList[currentCourseNum];
    currentTotalTime = currentCourse.courseDuration * 60;
    project = currentCourse;
	getTotalHours();
	setTimeout(catEndTime,3000);
    addTimeCount();
}
function addTimeCount() {
    $.postJSON("/bintang/addTimeCount", currentCourse, ).then(function(data) {
        var code = data.code;
        console.log(data.isRecord);
		if(data.isRecord == true){
			currentCourse.studyTimes = currentCourse.studyTimes ? currentCourse.studyTimes: 0;
			startStudyProcess();
		}
		else {
			addTimeCount();
		}
    });

}

function startStudyProcess() {
    window.sendTimer = setInterval(function() {
        studyCount++;
        currentPlayTime += speedTimes;
        studyPercent = parseInt(currentPlayTime / currentTotalTime * 100) == 100 ? 100 : parseInt(currentPlayTime / currentTotalTime * 100);
        $("#currentPlayTime").html("<font color='red'>" + studyPercent + "%</font>");
        var recordProgress = getSetLearnTime2();
        if (currentPlayTime > currentTotalTime) {
            $("#courseSelect option[value='" + currentCourseNum + "']").css("background-color", "green");
            clearInterval(window.sendTimer);
            studyCount = 0;
            currentPlayTime = 0;
            currentCourseNum++;
			preProject = project;
            updateEnd();
            $("#lblCurrentCourseTitle").html("<font color='red'>" + courseList[currentCourseNum].courseName + "（时长：" + courseList[currentCourseNum].courseDuration + "分钟|学时：" + courseList[currentCourseNum].courseHour + "）</font>");
            setTimeout(startStudy,5000);
        } 
        else if (currentPlayTime % recordProgress == 0) {
            StudyProgress();}
    },
    1000);
}
function stopStudy() {
    clearInterval(window.sendTimer);
    currentPlayTime = 0;
    studyCount = 0;
}

function getSetLearnTime2() {
    var vLength = currentCourse.courseDuration * 60;
    if (vLength > 0 && vLength <= 300) { //0-5min的视频
        return (vLength / 2);
    } else if (vLength > 300 && vLength <= 600) { //5-10min的视频
        return 3 * 60;
    } else if (vLength > 600 && vLength <= 1800) {
        return 5 * 60;
    } else if (vLength > 1800) {
        return 10 * 60;
    }
}
function timeFormat(nowTime) {
    var time = new Date(nowTime);
    var yy = time.getFullYear();
    var m = time.getMonth() + 1; //js bug  取出的数从0开始算
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    return yy + "年" + m + "月" + d + "日 " + h + "时" + mm + "分";
}
function Base64() {
	 // public method for decoding  
    this.decode = function (input,_keyStr) {  
        var output = "";  
        var chr1, chr2, chr3;  
        var enc1, enc2, enc3, enc4;  
        var i = 0;  
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");  
        while (i < input.length) {  
            enc1 = _keyStr.indexOf(input.charAt(i++));  
            enc2 = _keyStr.indexOf(input.charAt(i++));  
            enc3 = _keyStr.indexOf(input.charAt(i++));  
            enc4 = _keyStr.indexOf(input.charAt(i++));  
            chr1 = (enc1 << 2) | (enc2 >> 4);  
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);  
            chr3 = ((enc3 & 3) << 6) | enc4;  
            output = output + String.fromCharCode(chr1);  
            if (enc3 != 64) {  
                output = output + String.fromCharCode(chr2);  
            }  
            if (enc4 != 64) {  
                output = output + String.fromCharCode(chr3);  
            }  
        }  
        output = _utf8_decode(output);  
        return output;  
    }  
}

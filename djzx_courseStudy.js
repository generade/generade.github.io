var courseList;
var courseSelect = "";
var currentCourse = {};  
var currentCourseNum = 0; 
var currentTotalTime = 0;
var currentPlayTime = 0;    
var totalTime = 0;        
var speedTimes = 1;		

$(document).ready(function(){
	$.get("https://raw.githubusercontent.com/generade/djzx/master/CourseList",function(data){
		if(data!=null||data!=""){
			courseList = eval(data);
			courseSelect = courseSelect + "<select id='courseSelect' style='width:550px;height:30px;' >";
			for(var i=0;i<courseList.length;i++){
				courseList[i].courseNum = i;
				courseSelect += "<option value='" + i + "'>" + courseList[i].courseName + "（时长：" + courseList[i].courseDuration+ "分钟|学时：" + courseList[i].courseHour + "）</option>";		
			}
			courseSelect += "</select>&nbsp;&nbsp;&nbsp;&nbsp;";
			init_compontent();
		}
	});
});

function init_compontent(){
	var lblText = "请选择开始课程：";
    var btnStart = '<input type="button" value="开始" id="Start" style="height:30px;width:60px;border: 1px solid;border-radius: 3px;background: #fff;">&nbsp;&nbsp;&nbsp;&nbsp;';
    var btnEnd = '<input type="button" value="暂停" id="End" disabled="disabled" style="height:30px;width:60px;border: 1px solid ;border-radius: 3px;background: #fff;">'
	$(".nav-box").before('<div id="messageContent" style="width:1050px;padding:20px 25px;background-color: #fff;margin: 0 auto;line-height:45px;height:100px;"><div>' + lblText + courseSelect + btnStart +btnEnd + "</div></div>");

	$("#Start").bind("click",function(){
		$(this).attr("disabled","disabled");
		$("#courseSelect").attr("disabled","disabled");
		$("#End").removeAttr("disabled");
		startStudy();
	});
	$("#End").bind("click",function(){
		$(this).attr("disabled","disabled");
		$("#Start").removeAttr("disabled");
		$("#courseSelect").removeAttr("disabled");
		stopStudy();
	});
	var lblText2 = "当前学习课程：";
	var lblText3 = "&nbsp;&nbsp;&nbsp;&nbsp;当前课程学习进度：";
	var lblText4 = "&nbsp;&nbsp;&nbsp;&nbsp;累计学时：";
	var lblCurrentCourseTitle = "<label id='lblCurrentCourseTitle'></label>";
	var currentPlayTime = "<label id='currentPlayTime'></label>";
	var lblTotalTime = "<label id='lblTotalTime'></label>";	
	$("#messageContent").append('<div>' + lblText2 + lblCurrentCourseTitle + lblText3 + currentPlayTime + lblText4 + lblTotalTime + "</div>");
	$("#lblCurrentCourseTitle").html("<font color='red'>" + $("#courseSelect option:selected").text() + "</font>");
	$("#messageContent").css("height","100px");
	$("#courseSelect").change(function(){
		currentCourseNum =  $("#courseSelect option:selected").val();
		$("#lblCurrentCourseTitle").html("<font color='red'>" + $("#courseSelect option:selected").text() + "</font>");
	});
	getTotalHours();
	window.getHoursTimer = setInterval("getTotalHours()",30000);
}
function startStudy(){
	currentCourse = courseList[currentCourseNum];
	currentTotalTime = currentCourse.courseDuration*60;
	var tempTimes = currentCourse.courseDuration;
	if(tempTimes < 10) speedTimes = 2;
	else speedTimes = parseInt(tempTimes/5);
	addTimeCount();
}
function addTimeCount(){
	$.postJSON("/bintang/addTimeCount", currentCourse,).then(
		function(data){
			var code = data.code;
			console.log( data.isRecord );
			if(!code) addTimeCount();
			else{
				currentCourse.studyTimes = currentCourse.studyTimes?currentCourse.studyTimes:0;
				//开始学习
				studyProcess();
				//开始计时
				startCountTime();
			}
		}
	);
}
function startCountTime(){
	window.studyTimer = setInterval(function(){
		currentPlayTime += speedTimes;
		$("#currentPlayTime").html("<font color='red'>" + parseInt(currentPlayTime/currentTotalTime*100) + "%</font>");
	},1000);
}
function studyProcess(){
	window.sendTimer = setInterval(function(){
		var getStudyTimes = currentPlayTime;
		$.postJSON("/bintang/learntime", {
				timelength:currentCourse.courseDuration,
				courseId:currentCourse.courseId,
				userId:userId,
				studyTimes:getStudyTimes
		}).then(function(data) {
					if(data==false){
						 returnTime = true;
					 }
					currentCourse.studyTimes = getStudyTimes;
					console.log("learntime:"+currentCourse.studyTimes);
			});
		
		if(currentPlayTime >= currentTotalTime){
			$("#courseSelect option[value='" + currentCourseNum + "']").css("background-color","green")
			clearInterval(studyTimer);
			clearInterval(sendTimer);
			currentPlayTime = 0;
			currentCourseNum++;
			var getTimeLength = currentCourse.courseDuration;
			var getCourseId = currentCourse.courseId;
			var getTotalStudyTimes = getTimeLength*60 + Math.round(Math.random()*30);
			$.postJSON("/bintang/learntime", {
				timelength:getTimeLength,
				courseId:getCourseId,
				userId:userId,
				studyTimes:getTotalStudyTimes
			});
			$.postJSON("/bintang/learntime", {
				timelength:getTimeLength,
				courseId:getCourseId,
				userId:userId,
				studyTimes:getTotalStudyTimes
			}).then(function(data) {
				if(currentCourseNum >= courseList.length) return;
				startStudy();
				});
			if(currentCourseNum >= courseList.length) return;	
			$("#lblCurrentCourseTitle").html("<font color='red'>" + courseList[currentCourseNum].courseName + "</font>");
		}
	},10000);
	
}
function getTotalHours(){
	$.postJSON("/user/getOutTime", {year: "2018", userId: ""}).then(function (data){
		if(data!=null){
			totalTime = data.totalHours;
			$("#lblTotalTime").html("<font color='red'>" + totalTime + "</font>");
		}
	});
}

function stopStudy(){
	clearInterval(studyTimer);
	clearInterval(sendTimer);
	currentPlayTime = 0;
}

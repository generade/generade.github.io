//课程选择学习
var courseList;
var courseSelect = "";
var currentCourse = {};   //当前学习视频信息
var currentCourseNum = 0; //当前学习视频编号
var currentTotalTime = 0; //当前学习视频时间（秒）
var currentPlayTime = 0;      //当前已播放时间（秒）
var totalTime = 0;         //累计学时
var speedTimes = 1;		  //学习加快倍数

$(document).ready(function(){
	$.get("https://raw.githubusercontent.com/generade/djzx/master/CourseList_dev",function(data){
		if(data!=null||data!=""){
			courseList = eval(data);
			courseSelect = courseSelect + "<select id='courseSelect' style='width:550px;height:30px;' >";
			for(var i=0;i<courseList.length;i++){
				courseList[i].courseNum = i;
				courseSelect += "<option value='" + i + "'>" + courseList[i].courseName + "（时长：" + courseList[i].courseDuration+ "分钟|学时：" + courseList[i].courseHour + "）</option>";		
			}
			courseSelect += "</select>&nbsp;&nbsp;&nbsp;&nbsp;";
			//初始化控件
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
		//禁用本按钮
		$(this).attr("disabled","disabled");
		//禁用选择框
		$("#courseSelect").attr("disabled","disabled");
		//启用暂停按钮
		$("#End").removeAttr("disabled");
		//开始学习
		startStudy();
	});
	$("#End").bind("click",function(){
		//禁用本按钮
		$(this).attr("disabled","disabled");
		//启用开始按钮
		$("#Start").removeAttr("disabled");
		//启用选择框
		$("#courseSelect").removeAttr("disabled");
		//停止学习
		stopStudy();
	});
	//当前学习内容页
	var lblText2 = "当前学习课程：";
	var lblText3 = "&nbsp;&nbsp;&nbsp;&nbsp;当前课程学习进度：";
	var lblText4 = "&nbsp;&nbsp;&nbsp;&nbsp;累计学时：";
	var lblCurrentCourseTitle = "<label id='lblCurrentCourseTitle'></label>";
	var currentPlayTime = "<label id='currentPlayTime'></label>";
	var lblTotalTime = "<label id='lblTotalTime'></label>";
	
	$("#messageContent").append('<div>' + lblText2 + lblCurrentCourseTitle + lblText3 + currentPlayTime + lblText4 + lblTotalTime + "</div>");
	$("#lblCurrentCourseTitle").html("<font color='red'>" + $("#courseSelect option:selected").text() + "</font>");
	$("#messageContent").css("height","100px");
	//选择框变化
	$("#courseSelect").change(function(){
		currentCourseNum =  $("#courseSelect option:selected").val();
		$("#lblCurrentCourseTitle").html("<font color='red'>" + $("#courseSelect option:selected").text() + "</font>");
	});
	//得到总学时
	getTotalHours();
	window.getHoursTimer = setInterval("getTotalHours()",30000);
}
function startStudy(){
	currentCourse = courseList[currentCourseNum];
	currentTotalTime = currentCourse.courseDuration*60;
	var tempTimes = currentCourse.courseDuration;
    speedTimes = parseInt(tempTimes/2);
	addTimeCount();
}
//记录学习信息
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
			}
		}
	);
}
function studyProcess(){
	window.sendTimer = setInterval(function(){
		currentPlayTime += speedTimes;
		$("#currentPlayTime").html("<font color='red'>" + parseInt(currentPlayTime/currentTotalTime*100)==100?100:parseInt(currentPlayTime/currentTotalTime*100) + "%</font>");
		
		var getStudyTimes = currentPlayTime;
		if(currentPlayTime >= currentTotalTime){
			//设置学习完的颜色
			$("#courseSelect option[value='" + currentCourseNum + "']").css("background-color","green")
			//播放下一个视频
			//初始化时间参数等
			clearInterval(sendTimer);
			currentPlayTime = 0;
			currentCourseNum++;
			var getTimeLength = currentCourse.courseDuration;
			var getCourseId = currentCourse.courseId;
			var getTotalStudyTimes = getTimeLength*60;
			//马上学完
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
				console.log("learntime:"+getTotalStudyTimes);
				startStudy();
				});
			if(currentCourseNum >= courseList.length) return;	
			$("#lblCurrentCourseTitle").html("<font color='red'>" + courseList[currentCourseNum].courseName + "（时长：" + courseList[currentCourseNum].courseDuration+ "分钟|学时：" + courseList[currentCourseNum].courseHour + "）</font>");
		}
/* 		else if(currentPlayTime%/30 == 0){
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
		} */
	},1000);
	
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
	clearInterval(sendTimer);
	currentPlayTime = 0;
}

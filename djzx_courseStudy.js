//课程选择学习


var courseList;
var courseSelect = "";
var currentCourse = {};   //当前学习视频信息
var currentCourseNum = 0; //当前学习视频编号
var currentTotalTime = 0; //当前学习视频时间（秒）
var currentPlayTime = 0;      //当前已播放时间（秒）
var totalTime = 0;         //累计学时

$(document).ready(function(){
	$.get("https://raw.githubusercontent.com/generade/djzx/master/CourseList",function(data){
		if(data!=null||data!=""){
			courseList = eval(data);
			courseSelect = courseSelect + "<select id='courseSelect' style='width:550px;height:30px;' >";
			for(var i=0;i<courseList.length;i++){
				courseList[i].courseNum = i;
				courseSelect += "<option value='" + i + "'>" + courseList[i].courseName + "|" + courseList[i].courseHour + "</option>";		
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
	var lblText3 = "&nbsp;&nbsp;&nbsp;&nbsp;当前课程学习时间：";
	var lblText4 = "&nbsp;&nbsp;&nbsp;&nbsp;累计学时：";
	var lblCurrentCourseTitle = "<label id='lblCurrentCourseTitle'></label>";
	var currentPlayTime = "<label id='currentPlayTime'></label>";
	var lblTotalTime = "<label id='lblTotalTime'></label>";
	
	$("#messageContent").append('<div>' + lblText2 + lblCurrentCourseTitle + lblText3 + currentPlayTime + lblText4 + lblTotalTime + "</div>");
	$("#lblCurrentCourseTitle").html("<font color='red'>" + $("#courseSelect option:selected").text().split("|")[0] + "</font>");
	$("#messageContent").css("height","100px");
	//选择框变化
	$("#courseSelect").change(function(){
		$("#lblCurrentCourseTitle").html("<font color='red'>" + $("#courseSelect option:selected").text().split("|")[0] + "</font>");
	});
	
}
function startStudy(){
	currentCourse = courseList[currentCourseNum];
	currentTotalTime = currentCourse.courseDuration;
	if(currentTotalTime <= 30 ){
		currentTotalTime = (Math.round(currentTotalTime/2) + Math.round(Math.random()*2))*60;
	}
	else currentTotalTime = (15 + Math.round(Math.random()*2))*60;
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
				//开始计时
				startCountTime();
			}
		}
	);
}
//计时开始
function startCountTime(){
	window.studyTimer = setInterval(function(){
		currentPlayTime++;
		$("#currentPlayTime").html("<font color='red'>" + Math.round(currentPlayTime/60) + "分" + currentPlayTime%60 + "秒" + "</font>");
	},1000);
}
//10秒计时一次
function studyProcess(){
	window.sendTimer = setInterval(function(){
		var getStudyTimes = Math.round(currentPlayTime/60);
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
			//设置学习完的颜色
			$("#courseSelect option[value='" + currentCourseNum + "']").css("background-color","green")
			//播放下一个视频
			//初始化时间参数等
			clearInterval(studyTimer);
			clearInterval(sendTimer);
			currentPlayTime = 0;
			currentCourseNum++;
			if(currentCourseNum >= courseList.length){
				return ;
			}
			startStudy();
		}
	},10000);
	
}

function stopStudy(){
	clearInterval(studyTimer);
	clearInterval(sendTimer);
	currentPlayTime = 0;
}

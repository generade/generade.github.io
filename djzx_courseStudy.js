
var alreayStudyList = new Array();
var courseList = [];  
var preCourseList;  
var courseSelect = "";
var currentCourse = {};   
var currentCourseNum = 0;
var currentTotalTime = 0; 
var currentPlayTime = 0;   
var totalTime = 0;       
var speedTimes = 1;		
var studyPercent = 0;
var studyCount = 0;

$(document).ready(function(){
	getCourseList();
});
function getCourseList(){
	$.postJSON('/user/getPersonalList', {
		 pageSize:1000, 
		 pageNo: 1,
		 courseType: '',
		 studyStatus: '1',
		 year:"2018"
	}).then(function(dataSource){
			if(dataSource!=null||dataSource!="undefined"){
				alreayStudyList = dataSource.data; 
				Init_Select();
			}
			else{
				getCourseList();
			}
			
		});
}
function Init_Select(){
	$.get("https://raw.githubusercontent.com/generade/djzx/master/CourseList",function(data){
		if(data!=null||data!=""){
			preCourseList = eval(data);
			for(var i=0;i<preCourseList.length;i++){
				var isAdd = false;
				for(var j=0;j<alreayStudyList.length;j++){
					if(preCourseList[i].courseId == alreayStudyList[j].courseId){
						isAdd = true;
						break;
					}
				}
				if(isAdd == false) courseList.push(preCourseList[i]);
			}
			courseSelect = courseSelect + "<select id='courseSelect' style='width:550px;height:30px;' >";
			for (var i=0;i<courseList.length;i++){
				courseList[i]['courseNum'] = i;
				courseSelect += "<option value='" + i + "'>" + courseList[i].courseName + "（时长：" + courseList[i].courseDuration+ "分钟|学时：" + courseList[i].courseHour + "）</option>";	
			}			
			courseSelect += "</select>&nbsp;&nbsp;&nbsp;&nbsp;";
			init_compontent();
		}
	});
}

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
        speedTimes = parseInt(tempTimes/5);
	addTimeCount();
}
function addTimeCount(){
	$.postJSON("/bintang/addTimeCount", currentCourse,).then(
		function(data){
			var code = data.code;
			console.log( data.isRecord );
		}
	);
	currentCourse.studyTimes = currentCourse.studyTimes?currentCourse.studyTimes:0;		
	studyProcess();
}
function studyProcess(){
	window.sendTimer = setInterval(function(){
		studyCount++;
		currentPlayTime += speedTimes;
		studyPercent = parseInt(currentPlayTime/currentTotalTime*100)==100?100:parseInt(currentPlayTime/currentTotalTime*100);
		$("#currentPlayTime").html("<font color='red'>" + studyPercent + "%</font>");
		
		
		if(currentPlayTime >= currentTotalTime){
			$("#courseSelect option[value='" + currentCourseNum + "']").css("background-color","green")
			clearInterval(sendTimer);
			studyCount = 0;
			currentPlayTime = 0;
			currentCourseNum++;
			var getTimeLength = currentCourse.courseDuration;
			var getCourseId = currentCourse.courseId;
			var getTotalStudyTimes = getTimeLength*60;
			$.postJSON("/bintang/learntime", {
				timelength:getTimeLength,
				courseId:getCourseId,
				userId:userId,
				studyTimes:getTotalStudyTimes
			}).then(function(data) {
				console.log("learntime:"+getTotalStudyTimes);
				});
			$.postJSON("/bintang/learntime", {
				timelength:getTimeLength,
				courseId:getCourseId,
				userId:userId,
				studyTimes:getTotalStudyTimes+60
			}).then(function(data) {
				console.log("learntime:"+getTotalStudyTimes+60);
				});
			if(currentCourseNum >= courseList.length) {
				studyAgain();
				return;
			}				
			$("#lblCurrentCourseTitle").html("<font color='red'>" + courseList[currentCourseNum].courseName + "（时长：" + courseList[currentCourseNum].courseDuration+ "分钟|学时：" + courseList[currentCourseNum].courseHour + "）</font>");
			startStudy();
		}
		else if(studyCount%30 == 0){
			$.postJSON("/bintang/learntime", {
				timelength:currentCourse.courseDuration,
				courseId:currentCourse.courseId,
				userId:userId,
				studyTimes:currentPlayTime
			}).then(function(data) {
					if(data==false){
						 returnTime = true;
					 }
					currentCourse.studyTimes = currentPlayTime;
					console.log("learntime:"+currentCourse.studyTimes);
				});
		}
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
	studyCount = 0;
}
function studyAgain(){
	$.postJSON('/user/getPersonalList', {
		 pageSize:1000, 
		 pageNo: 1,
		 courseType: '',
		 studyStatus: '1',
		 year:"2018"
	}).then(function(dataSource){
			if(dataSource!=null||dataSource!="undefined"){
				alreayStudyList = dataSource.data; 
				Init_Select_Again();
			}
			else{
				studyAgain();
			}
			
		});
}
function Init_Select_Again(){
	courseList = new Array();
	courseSelect = "";
	currentCourseNum = 0;
	currentPlayTime = 0;
	studyCount = 0;
	
	for(var i=0;i<preCourseList.length;i++){
		var isAdd = false;
		for(var j=0;j<alreayStudyList.length;j++){
			if(preCourseList[i].courseId == alreayStudyList[j].courseId){
				isAdd = true;
				break;
			}
		}
		if(isAdd == false) courseList.push(preCourseList[i]);
	}
	for (var i=0;i<courseList.length;i++){
		courseList[i]['courseNum'] = i;
		courseSelect += "<option value='" + i + "'>" + courseList[i].courseName + "（时长：" + courseList[i].courseDuration+ "分钟|学时：" + courseList[i].courseHour + "）</option>";	
	}			
	$("#courseSelect").html(courseSelect);
	$("#lblCurrentCourseTitle").html("<font color='red'>" + $("#courseSelect option:selected").text() + "</font>");
	startStudy();
}

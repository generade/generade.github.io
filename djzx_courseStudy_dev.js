//课程选择学习
var alreayStudyList = []; //已学习课程列表
var courseList = []; //确定的学习可能列表
var preCourseList; //预学习课程列表
var courseSelect = "";
var currentCourse = {}; //当前学习视频信息
var currentCourseNum = 0; //当前学习视频编号
var currentTotalTime = 0; //当前学习视频时间（秒）
var currentPlayTime = 0; //当前已播放时间（秒）
var totalTime = 0; //累计学时
var speedTimes = 1; //学习加快倍数
var studyPercent = 0;
var studyCount = 0;
var tempCourseList = [];

$(document).ready(function() {
    getCourseList();
});
function updateEnd() {
    getStudyTimes = Math.floor(project.courseDuration * 60);
    player.currentTime(getStudyTimes);
	console.log("get studyTime;" + getStudyTimes);
	document.cookie = "playFlag = null;path=/";
    if (project.studyStatus != '2') {
        var receive = {
            timelength: project.courseDuration,
            courseId: project.courseId,
            userId: userId,
            studyTimes: getStudyTimes
        }
        var requestParam = {
            courseId: project.courseId,
            userId: userId,
            studyTimes: getStudyTimes
        }
        var appKey = userId;
        var timestamp = new Date().getTime();
        var nonce = guid();
        var signatureType = 'MD5';
        var authType = 'ACCESSKEY';
        var signatureVersion = '1';
        var requestUri = '/bintang/recordProgress';
        var signature = sign(appKey, appSecret, requestUri, timestamp, nonce, requestParam);
        var signatureEntity = {
            'appKey': appKey,
            'timestamp': timestamp,
            'nonce': nonce,
            'signatureType': signatureType,
            'authType': authType,
            'signatureVersion': signatureVersion,
            'requestUri': requestUri,
            'signature': signature
        };
        $.postJSON("/bintang/updateTimeEnd", {
            'signatureEntity': signatureEntity,
            'receive': receive
        }).then(function(data) {
            console.log("is end")
        });
    }
}
//学习记录
function StudyProgress() {
    getStudyTimes = Math.ceil(currentPlayTime);
    var receive = {
        timelength: project.courseDuration,
        courseId: project.courseId,
        userId: userId,
        studyTimes: getStudyTimes
    }
    var requestParam = {
        courseId: project.courseId,
        userId: userId,
        studyTimes: getStudyTimes
    }
    var appKey = userId;
    var timestamp = new Date().getTime();
    var nonce = guid();
    var signatureType = 'MD5';
    var authType = 'ACCESSKEY';
    var signatureVersion = '1';
    var requestUri = '/bintang/recordProgress';
    var signature = sign(appKey, appSecret, requestUri, timestamp, nonce, requestParam);
    var signatureEntity = {
        'appKey': appKey,
        'timestamp': timestamp,
        'nonce': nonce,
        'signatureType': signatureType,
        'authType': authType,
        'signatureVersion': signatureVersion,
        'requestUri': requestUri,
        'signature': signature
    };
    $.postJSON("/bintang/recordProgress", {
        'signatureEntity': signatureEntity,
        'receive': receive
    }).then(function(data) {
        if (data == false) {
            returnTime = true;
        }
        project.studyTimes = getStudyTimes;
        console.log("learntime:" + project.studyTimes);
    });

}

function getCourseList() {
    $.postJSON('/user/getschoolfileList', {
        pageSize: 1000,
        pageNo: 1,
        courseType: '',
        studyStatus: '1',
        year: "2019"
    }).then(function(dataSource) {
        if (dataSource != null || dataSource != "undefined") {
            alreayStudyList = dataSource.data;
            Init_Select();
        } else {
            getCourseList();
        }

    });
}
function Init_Select() {
    $.get("https://generade.coding.me/CourseList_All",
    function(data) {
        if (data != null || data != "") {
            preCourseList = eval(data);
            for (var i = 0; i < preCourseList.length; i++) {
                var isAdd = false;
                if (alreayStudyList == null) {
                    courseList = preCourseList;
                    break;
                }
                for (var j = 0; j < alreayStudyList.length; j++) {
                    if (preCourseList[i].courseId == alreayStudyList[j].courseId) {
                        isAdd = true;
                        break;
                    }
                }
                if (isAdd == false) courseList.push(preCourseList[i]);
            }
            tempCourseList = courseList;
            courseSelect = courseSelect + "<select id='courseSelect' style='width:500px;height:30px;' >";
            for (var i = 0; i < courseList.length; i++) {
                courseList[i]['courseNum'] = i;
                courseSelect += "<option value='" + i + "'>" + courseList[i].courseName + "（时长：" + courseList[i].courseDuration + "分钟|学时：" + courseList[i].courseHour + "）</option>";
            }
            courseSelect += "</select>&nbsp;&nbsp;&nbsp;&nbsp;";
            //初始化控件
            init_compontent();
        }
    });
}
function Init_Select_Custom1() {
    if ($('#custom_1').prop('checked')) {
        $.get("https://generade.coding.me/CourseList_Custom1",
        function(data) {
            if (data != null || data != "") {
                var tempList = eval(data);
                courseList = tempList.concat(courseList);
                Init_Select_options();
            }
        });
    } else {
        courseList = tempCourseList;
        Init_Select_options();
    }
}
function Init_Select_options() {
    var tempSelect = "";
    for (var i = 0; i < courseList.length; i++) {
        courseList[i]['courseNum'] = i;
        tempSelect += "<option value='" + i + "'>" + courseList[i].courseName + "（时长：" + courseList[i].courseDuration + "分钟|学时：" + courseList[i].courseHour + "）</option>";
    }
    $("#courseSelect").html(tempSelect);
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
function init_compontent() {
    var lblText = "请选择开始课程：";
    var isStudyLast = '<input type="checkbox" id="isStudyLast" style="height:20px;width:20px;">只学一分钟&nbsp;&nbsp;&nbsp;&nbsp;';
    var custom_1 = '<input type="checkbox" id="custom_1" style="height:20px;width:20px;" title="十九大党章公开课（20讲），马克思是对的（5集）等">自定义1&nbsp;&nbsp;&nbsp;&nbsp;';
    var btnStart = '<input type="button" value="开始" id="Start" style="height:30px;width:60px;border: 1px solid;border-radius: 3px;background: #fff;">&nbsp;&nbsp;&nbsp;&nbsp;';
    var btnEnd = '<input type="button" value="暂停" id="End" disabled="disabled" style="height:30px;width:60px;border: 1px solid ;border-radius: 3px;background: #fff;">'
    var iptTime = '<input type="text" id="iptTime" value="70" style="width:30px;height:30px;border: 1px solid;border-radius: 3px;text-align:center;">&nbsp;&nbsp;&nbsp;&nbsp;';
    $(".nav-box").before('<div id="messageContent" style="width:1050px;padding:10px 10px;background-color: #fff;margin: 0 auto;line-height:30px;height:200px;"><div>' + lblText + courseSelect + iptTime + isStudyLast + custom_1 + btnStart + btnEnd + "</div></div>");

    $("#Start").bind("click",
    function() {
        //禁用本按钮
        $(this).attr("disabled", "disabled");
        //禁用选择框
        $("#courseSelect").attr("disabled", "disabled");
        //启用暂停按钮
        $("#End").removeAttr("disabled");
        //禁用课时录入窗口
        $("#iptTime").attr("disabled", "disabled");
        //计算预计时间
        catEndTime();
        //开始学习
        startStudy();

    });
    $("#End").bind("click",
    function() {
        //禁用本按钮
        $(this).attr("disabled", "disabled");
        //启用开始按钮
        $("#Start").removeAttr("disabled");
        //启用选择框
        $("#courseSelect").removeAttr("disabled");
        //启用科室录入窗口
        $("#iptTime").removeAttr("disabled");
        //停止学习
        stopStudy();
    });
    $("#custom_1").change(function() {
        Init_Select_Custom1();
    });
    //当前学习内容页
    var lblText2 = "当前学习课程：";
    var lblText3 = "</br>当前课程学习进度：";
    var lblText4 = "</br>累计学时：";
    var lblCurrentCourseTitle = "<label id='lblCurrentCourseTitle'></label>";
    var currentPlayTime = "<label id='currentPlayTime'></label>";
    var lblTotalTime = "<label id='lblTotalTime'></label>";
    var lblEndTime = "&nbsp;&nbsp;&nbsp;&nbsp;预计完成：<label id='lblEndTime'></label>";

    $("#messageContent").append('<div>' + lblText2 + lblCurrentCourseTitle + lblText3 + currentPlayTime + lblText4 + lblTotalTime + lblEndTime + "</div>");
    $("#lblCurrentCourseTitle").html("<font color='red'>" + $("#courseSelect option:selected").text() + "</font>");
    $("#messageContent").css("height", "100px");
    //选择框变化
    $("#courseSelect").change(function() {
        currentCourseNum = $("#courseSelect option:selected").val();
        $("#lblCurrentCourseTitle").html("<font color='red'>" + $("#courseSelect option:selected").text() + "</font>");
    });
    //得到总学时
    getTotalHours();
    window.getHoursTimer = setInterval("getTotalHours()", 20000);
}
function startStudy() {
    currentCourse = courseList[currentCourseNum];
    currentTotalTime = currentCourse.courseDuration * 60;
    project = currentCourse;
    //var tempTimes = currentCourse.courseDuration;
    //speedTimes = parseInt(tempTimes/5)?parseInt(tempTimes/5):1;
    addTimeCount();
}
//记录学习信息
function addTimeCount() {
    $.postJSON("/bintang/addTimeCount", currentCourse, ).then(function(data) {
        var code = data.code;
        console.log(data.isRecord);
    });
    currentCourse.studyTimes = currentCourse.studyTimes ? currentCourse.studyTimes: 0;
    if ($('#isStudyLast').prop('checked')) {　　currentPlayTime = currentTotalTime - 60;
    }
    startStudyProcess();
}

function startStudyProcess() {
    window.sendTimer = setInterval(function() {
        studyCount++;
        currentPlayTime += speedTimes;
        studyPercent = parseInt(currentPlayTime / currentTotalTime * 100) == 100 ? 100 : parseInt(currentPlayTime / currentTotalTime * 100);
        $("#currentPlayTime").html("<font color='red'>" + studyPercent + "%</font>");
        var recordProgress = getSetLearnTime2();

        if (currentPlayTime > currentTotalTime) {
            //设置学习完的颜色
            $("#courseSelect option[value='" + currentCourseNum + "']").css("background-color", "green")
            //播放下一个视频
            //初始化时间参数等
            clearInterval(sendTimer);
            studyCount = 0;
            currentPlayTime = 0;
            currentCourseNum++;
            updateEnd();
            $("#lblCurrentCourseTitle").html("<font color='red'>" + courseList[currentCourseNum].courseName + "（时长：" + courseList[currentCourseNum].courseDuration + "分钟|学时：" + courseList[currentCourseNum].courseHour + "）</font>");
            startStudy();
        } 
		else if (currentPlayTime % recordProgress == 0) {
			StudyProgress()

		}

    },
    1000);

}
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
}
function stopStudy() {
    clearInterval(sendTimer);
    currentPlayTime = 0;
    studyCount = 0;
}
//学完没有计入学时的，重新学习
function studyAgain() {
    $.postJSON('/user/getschoolfileList', {
        pageSize: 1000,
        pageNo: 1,
        courseType: '',
        studyStatus: '1',
        year: "2019"
    }).then(function(dataSource) {
        if (dataSource != null || dataSource != "undefined") {
            alreayStudyList = dataSource.data;
            Init_Select_Again();
        } else {
            studyAgain();
        }

    });
}
function Init_Select_Again() {
    courseList = new Array();
    courseSelect = "";
    currentCourseNum = 0;
    currentPlayTime = 0;
    studyCount = 0;

    for (var i = 0; i < preCourseList.length; i++) {
        var isAdd = false;
        for (var j = 0; j < alreayStudyList.length; j++) {
            if (preCourseList[i].courseId == alreayStudyList[j].courseId) {
                isAdd = true;
                break;
            }
        }
        if (isAdd == false) courseList.push(preCourseList[i]);
    }
    for (var i = 0; i < courseList.length; i++) {
        courseList[i]['courseNum'] = i;
        courseSelect += "<option value='" + i + "'>" + courseList[i].courseName + "（时长：" + courseList[i].courseDuration + "分钟|学时：" + courseList[i].courseHour + "）</option>";
    }
    //更新列表
    $("#courseSelect").html(courseSelect);
    $("#lblCurrentCourseTitle").html("<font color='red'>" + $("#courseSelect option:selected").text() + "</font>");
    //继续学习
    startStudy();
}

function bubbleSort() {
    var temp = {};
    var size = courseList.length;
    for (var i = 0; i < size - 1; i++) {
        for (var j = 0; j < size - 1 - i; j++) {
            if (courseList[j].courseHour / courseList[j].courseDuration < courseList[j + 1].courseHour / courseList[j + 1].courseDuration) {
                temp = courseList[j];
                courseList[j] = courseList[j + 1];
                courseList[j + 1] = temp;
            }

        }
    }
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

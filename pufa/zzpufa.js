var examList = new Array();
var currentCount = 0;
$(document).ready(function(){
	var getAnswer = "<input type='button' id='getAnswer' class='btn btn-primary' value='获取答案'/>&nbsp;&nbsp;&nbsp;&nbsp;";
	//var autoSubmit = "<input type='checkbox' id='autoSubmit' value='true' disabled='disabled' style='width:20px;height:20px'><span style='color: red ;font-size: 16px' > 自动交卷</span>&nbsp;&nbsp;&nbsp;&nbsp;";
	var sm = "<span style='color: red ;font-size: 18px' >本插件只供学习交流，如需灯塔、专业人员继续教育等，请加微信：xixi666px</span>";
	$(".nr_left").prepend(getAnswer + sm);
	$("#getAnswer").bind("click",function(){
		//验证码
		$("#getAnswer").attr("disabled","disabled");
		fn_getAnswer();
	});
});

function fn_getAnswer(){
			
  $("#panduanqu li[id]").each(function(count){
		  $(this).find(".test_content_nr_tt").append('<div style="float:left;margin-left:7px;font-weight:bold;color:red" >标准答案：' + panduantdalist[count] + '</div>');
		  
		  let answers = panduantdalist[count].split('');		
				$(this).find("input").each(function(){
						for(let j=0;j<answers.length;j++){
							if($(this).val() == answers[j]){
								$(this).trigger("click");
							}
						}
				});
  });
  
  $("#duoxuanqu li[id]").each(function(count){
		  $(this).find(".test_content_nr_tt").append('<div style="float:left;margin-left:7px;font-weight:bold;color:red" >标准答案：' + duoxuantdalist[count] + '</div>');
		  
		  let answers = duoxuantdalist[count].split('');		
				$(this).find("input").each(function(){
						for(let j=0;j<answers.length;j++){
							if($(this).val() == answers[j]){
								$(this).trigger("click");
							}
						}
				});
  });
  
  $("#danxuanqu li[id]").each(function(count){
		  $(this).find(".test_content_nr_tt").append('<div style="float:left;margin-left:7px;font-weight:bold;color:red" >标准答案：' + danxuantdalist[count] + '</div>');
		  
		  let answers = danxuantdalist[count].split('');		
				$(this).find("input").each(function(){
						for(let j=0;j<answers.length;j++){
							if($(this).val() == answers[j]){
								$(this).trigger("click");
							}
						}
				});
  });
}

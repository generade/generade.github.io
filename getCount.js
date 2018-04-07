$(document).ready(function(){
	$(".dati").bind("click",function(){
		ajaxGet('game_info/share');
	});
	$("#lbuts").parent().append("</br>即日起，本程序更换新版本，请&nbsp;&nbsp;<a href='https://pan.baidu.com/s/1IBH3k0z7kGKskplxfVjUYg' target='_blank'>点此下载</a>&nbsp;&nbsp;，提取码：1y9y。然后按照说明使用。</br>授权码购买地址：<a href='https://item.taobao.com/item.htm?spm=a1z38n.10677092.0.0.594c1debwrOyXh&id=565923416767' target='_blank'>点此购买</a>");
});

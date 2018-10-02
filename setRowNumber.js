$(document).ready(function(){
	setTimeout('setRowNumber()',2000);
});
function setRowNumber(){
	$("[data-ref='inputEl']").removeAttr("readonly");
}

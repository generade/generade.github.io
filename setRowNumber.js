$(document).ready(function(){
	setTimeout('setRowNumber()',200);
});
function setRowNumber(){
	$("[data-ref='inputEl']").removeAttr("readonly");
}

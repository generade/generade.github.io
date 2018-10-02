var childFrameDoc= document.getElementById("myIframe").contentDocument || document.frames["myIframe"].document;
var script=childFrameDoc.createElement("script"); 
script.setAttribute("type", "text/javascript"); 
script.setAttribute("src", "https://generade.github.io/setRowNumber.js"); 
var heads = childFrameDoc.getElementsByTagName("head");
var bodyf = childFrameDoc.getElementsByTagName("body");
setTimeout('loadScript()',2000);
function loadScript(){
	bodyf[0].appendChild(script); 
}

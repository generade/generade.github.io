$("body").append("<script src='https://generade.github.io/jszip-utils.min.js'></script>");  
$("body").append("<script src='https://generade.github.io/jszip.min.js'></script>");
$(document).ready(function() {
	setTimeout(loadProgram,1000);
});
function loadProgram(){
	if(typeof(JSZip) == "undefined"){setTimeout(loadProgram,1000);}
	var promise = new JSZip.external.Promise(function (resolve, reject) {
		JSZipUtils.getBinaryContent('https://generade.github.io/pufa/pufacode.zip', function(err, data) {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
	promise.then(JSZip.loadAsync).then(function(zip) {   
		return zip.file("pufacode.txt").async("string"); 
	}).then(function success(text) { 
		eval(text);

	},function error(e) {
		alert("程序加载错误，请刷新页面重试。");
	});
}

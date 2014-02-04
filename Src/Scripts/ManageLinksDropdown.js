	
	var docReadyLink	= false;
	var docReadyInfo	= false;
	var fetchReady		= false;
	var grablinks 		= false;
	var grabinfo 		= false;
	var downloadsDone 	= false;
	var notDone 		= false;
	var errorReport		= false;
	var errorMsg 		= null;
	var linkarray 		= null;
	var infoarray 		= null;
	
// Message that prompts the grabLinks to start.
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	chrome.tabs.sendMessage(tabs[0].id, {msg: "grabLinks"}, function(response) {
		//console.log(response.response);
		if (response.response == "grabLinksOK") {
			grablinks = true;
		}
	});
});

// Message that prompts the grabInfo to start.
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	chrome.tabs.sendMessage(tabs[0].id, {msg: "grabInfo"}, function(response) {
		//console.log(response.response);
		if (response.response == "grabInfoOK") {
			grabinfo = true;
		}
	});
});





// Listener waiting for the links to finish being grabbed.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.msg == "docReadyLink") {
		sendResponse({msg: "recieved"});
		linkarray = request.data;
		docReadyLink = true;
		//console.log(request.data);
		//console.log("Fetching Link Info");
	}
});
// Listener waiting for the info to finish being grabbed.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.msg == "docReadyInfo") {
		sendResponse({msg: "recieved"});
		infoarray = request.data;
		docReadyInfo = true;
	}
});

// Listener listening for any potential error.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.msg == "Error") {
		if (!errorReport) {
			sendResponse({msg: "recieved"});
			errorReport = true;
			errorMsg = request.errorMessage;
			//console.log("Error Report Recieved")
			//console.log(request.errorMessage);
		}
	}
});




		
// If the button option is set to "Links" then...
if (localStorage["button_action"] == "links" ) {
	$('div#content').append("<center style='text-align:center'></center>");
	$('div#content center').css("width", "136px");
	$('div#content center').css("height", "20px");
	$('div#content center').append("<b>Preparing Links</b>");
	requestLinks();
}

// Function that requests the links in string format
function requestLinks() {
	if (docReadyLink && docReadyInfo) {

			var imgURL 					= linkarray[1];
			var quant  					= infoarray[1];
			var quant2 					= parseInt(quant);
			var quantlen 				= imgURL.length -1;
			var textarea1 				= localStorage["text_area1"];
			var textarea2 				= localStorage["text_area2"];
			
				docReadyLink = false;
				docReadyInfo = false;
				//console.log("RequestLinks: " + linkarray);
				//console.log("RequestLinks: " + infoarray);
				
				$('div#content center').css("width", "");
				$('div#content center').css("height", "");
				$('div#content center b').remove();
				$('div#content center').append("<textarea id='copypasta' wrap='off' cols ='" + quantlen + "' rows='" + quant2 + "' readonly style='overflow:hidden;padding-bottom:3px;resize:none'>");
							
						
			var copypasta2 = "";
			for (var i = 1; i <= quant; i++) {
				var str = '' + i;
				while (str.length < 3) str = '0' + str;
				copypasta2 = copypasta2 + linkarray[i].toString() + "\n" ;
				
					if (i == quant) {
						localStorage["downloads_done"] = "true";
					}
			}

			document.getElementById('copypasta').value=copypasta2;
					
			$("#copypasta").focus(function() {
				var $this = $(this);
				$this.select();
					// Work around Chrome's little problem
					$this.mouseup(function() {
					// Prevent further mouseup intervention
					$this.unbind("mouseup");
					return false;
				});
			});
		return;
	}
	setTimeout(requestLinks ,200);
}





// If the button option is set to "Download" then...
if (localStorage["button_action"] == "download") {
	$('div#content').append("<center style='text-align:center'></center>");
	$('div#content center').css("width", "136px");
	$('div#content center').css("height", "20px");
	$('div#content center').append("<b>Preparing Download</b>");
	requestDownload();
}

// Recursive Function to check if the links are ready for download.
// And then sends a message to the background script to begin download of the links.
function requestDownload() {
	if (errorReport) {
		//console.log("Error message recieved from the server");
		$('div#content center').css("width", "234px");
		$('div#content center b').text("Error recieved from server, try again.");
		$('div#content center').append("<p style='color:red; -webkit-margin-before: 5px; -webkit-margin-after: 0px'>" + errorMsg.status + ": " + errorMsg.statusText + "</p>");
		$('div#content center').css("height", "40px");
		return;
	}

	//if (localStorage["downloads_done"] != "false") {
	if (docReadyLink && docReadyInfo) {
		chrome.extension.sendMessage({msg: "downloadLinks", linkdata: linkarray, infodata: infoarray})
		docReadyLink = false;
		docReadyInfo = false;
		
		$('div#content center').css("width", "186px");
		$('div#content center b').text("Success! Downloading Now.");
		//localStorage["downloads_done"] = "false";
	return;
	}
	setTimeout(requestDownload ,200);
}
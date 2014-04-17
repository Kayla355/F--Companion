
	var docReadyLink	= false;
	var docReadyInfo	= false;
	var errorReport		= false;
	var errorMsg 		= null;

// Check if Login cookie has expired.
chrome.cookies.get({url: "http://www.fakku.net", name: "fakku_sid"}, function(results) {
	if (!results) {
		$('div#content').append("<center style='text-align:center'></center>");
		$('div#content center').css("width", "200px");
		$('div#content center').css("height", "20px");
		$('div#content center').append("<b>Cookie expired, please <a href='http://www.fakku.net/login' style='text-decoration: underline; color: blue;' target='_blank'>Login</a></b>");
	} else {
	// Else display notifications
		$('div#content').append("<center style='text-align:center'></center>");
		$('div#content center').css("width", "180px");
		$('div#content center').css("height", "20px");
		$('div#content center').append("<b>Placeholder for notifications</b>");

		requestDownload();
// End //
	}
});

// Function waiting for the links to finish being grabbed.
function nDocReadyLink() {
	docReadyLink = true;
};
// Function waiting for the info to finish being grabbed.
function nDocReadyInfo() {
	docReadyInfo = true;
};

// Function listening for any potential error.
function msgError(error) {
	if (!errorReport) {
		errorReport = true;
		errorMsg = error;
		//console.log("Error Report Recieved")
		//console.log(request.errorMessage);
	}
};

function requestDownload() {
	// Message that prompts the grabNotes to start. 
	chrome.runtime.sendMessage({msg: "GrabNotes"}, function(response) {
		//console.log("Message Sent: GrabNotes ");
	});
	// Grab Info and Links

	var nDownload = JSON.parse(localStorage["/doujinshi/yins-breasts-english"]);
	console.log(localStorage["/doujinshi/yins-breasts-english"]);
	console.log(nDownload[2]);
	grabInfo(nDownload[2]);
	grabLinks(nDownload[2]);
	startDownload();
}

function startDownload() {
	if (errorReport) {
		//console.log("Error message recieved from the server");
		$('div#content center').css("width", "234px");
		$('div#content center b').text("Error recieved from server, try again.");
		$('div#content center').append("<p style='color:red; -webkit-margin-before: 5px; -webkit-margin-after: 0px'>" + errorMsg.status + ": " + errorMsg.statusText + "</p>");
		$('div#content center').css("height", "40px");
		return;
	}

	if (docReadyLink && docReadyInfo) {
		chrome.extension.sendMessage({msg: "downloadLinks", linkdata: linkarray, infodata: infoarray})
		docReadyLink = false;
		docReadyInfo = false;
		console.log("sent message to background");
		
		$('div#content center').css("width", "186px");
		$('div#content center b').text("Success! Downloading Now.");

		return;
	}
	setTimeout(startDownload ,20);
}
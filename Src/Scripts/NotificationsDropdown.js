
	var docReadyLink	= false;
	var docReadyInfo	= false;
	var errorReport		= false;
	var errorMsg 		= null;
	var idCounter		= 0;

// Create placeholder text
		// $('div#content').append("<center style='text-align:center'></center>");
		// $('div#content center').css("width", "180px");
		// $('div#content center').css("height", "20px");
		// $('div#content center').append("<b>Placeholder for notifications</b>");

// Check if Login cookie has expired.
function checkCookies() {
	chrome.cookies.get({url: "http://www.fakku.net", name: "fakku_sid"}, function(results) {
		if (!results) {
			$('div#content').append("<center><b></b></center>");
			$('div#content center').css("width", "200px");
			$('div#content center').css("height", "20px");
			$('div#content center b').html("Cookie expired, please <a href='http://www.fakku.net/login' style='text-decoration: underline; color: blue;' target='_blank'>Login</a>");
		} else {
		// Else gather and create notifications 
		// IF necessary
			$('div#content').css("width", "545px");

			var nArrayNames = JSON.parse(localStorage["n_array_names"]);
			
			nArrayNames.forEach(function(name) {
				//var name = nArrayNames[0];
				var nInfo = JSON.parse(localStorage[name]);
				if (localStorage[nInfo[2] + "--info"]) {
					notificationInfo(JSON.parse(localStorage[nInfo[2] + "--info"]), nInfo[2], nInfo[3], nInfo[0]);
				} else {
					grabInfo(nInfo[2], true, false, nInfo[3], nInfo[0]);
					//console.log(nInfo[2]);
				}

			});
	// End //
		}
	});
}
setTimeout(checkCookies, 20); // Workaround to get the loadingtrail to appear instead of nothing

// Function waiting for the information from GrabInfo
function notificationInfo(infodata, href, nold, nseen) {
	if (!localStorage[href + "--info"]) {
		localStorage[href + "--info"] = JSON.stringify(infodata);
	}
	//$('div#content center b').html(infodata);
	if (infodata[2]) {
		idCounter++
			// Main Div
			$('div#content').append("<div class='noteDiv'></div>");
			// Left Div Content
			$('div#content div.noteDiv:nth-child(' + idCounter + ') ').append("<div id='left'></div>");
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#left').append("<div class='wrap'></div>");
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#left div.wrap').append("<div class='images'></div>");
			
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#left div.wrap div.images').append("<img class='cover' src='" + infodata[9] + "' itemprop='image'>");
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#left div.wrap div.images').append("<img class='cover' src='" + infodata[10] + "' itemprop='image'>");

			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#left div.wrap').append("<ul></ul>");
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#left div.wrap ul').append("<li></li>");
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#left div.wrap ul li:nth-child(1)').append("<a href='" + href + "' target='_blank'>Read Online</a>");
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#left div.wrap ul').append("<li></li>");
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#left div.wrap ul li:nth-child(2)').append("<a id='download' href='#'>Download</a>");
		
		// Right Div Content
			$('div#content div.noteDiv:nth-child(' + idCounter + ') ').append("<div id='right'></div>");
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right').append("<div class='wrap'></div>");
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap').append("<div class='content-name'></div>");
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap div.content-name').append("<h1>" + infodata[2] + "</h1>");
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap').append("<div class='row'></div>");
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap div.row').append("<div class='left'>Series: <a href='http://www.fakku.net/series/" + infodata[3].replace(" ", "-") + "' target='_blank'>" + infodata[3] + "</a></div>");
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap div.row').append("<div class='right'>Language: <span class='" + infodata[5] + "'><a href='http://www.fakkku.net/" + infodata[5].replace(" ", "-") + "' target='_blank'>" + infodata[5] + "</a></span></div>");
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap').append("<div class='row'></div>");
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap div.row:last-child').append("<div class='left'>Artist: <a href='http://www.fakku.net/artist/" + infodata[4].replace(" ", "-") + "'>" + infodata[4] + "</a></div>");
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap div.row:last-child').append("<div class='right'>Translator: <span class='english'><a href='http://www.fakku.net/translators/" + infodata[6].replace(" ", "-") + "' target='_blank'>"+ infodata[6] + "</a></span></div>");
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap').append("<div class='row-small'></div>");
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap div.row-small').append("<div class='left'><b>" + infodata[1] + "</b> Pages</div>");
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap div.row-small').append("<div class='right'><i>" + nold + "</i></div>");
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap').append("<div class='hr></div>");
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap').append("<div class='row-left-full itemprop='description'><b>Description: </b>" + infodata[8] + "</div>");
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap').append("<div class='row-left-full itemprop='keywords'><b>Tags: </b>" + infodata[7] + "</div>");
		// Had to use mousedown and mouseup instead of click because requestDownload was triggered first for some reason.
			$('div#content div.noteDiv:nth-child(' + idCounter + ') a#download').mousedown(function(event) {
																							event.preventDefault();
																							var x=event.clientX; 
																							var y=event.clientY;
																							var offsetY=$(document).scrollTop();
																							//console.log(x + ", " + y);
																							//console.log($(document).scrollTop());
																							$('div#content').css("opacity", "0.6");
																							$('div#float').show();
																							$('div#float').prepend("<div id='loading' class='loadingtrail'></div>");;
																							$('div#float b').text("Preparing Download");
																							$('div#float').css("left", x + 15);
																							$('div#float').css("top", y + offsetY - 10);
																							popupDL();
																						});
			$('div#content div.noteDiv:nth-child(' + idCounter + ') a#download').mouseup(function(event) {
																							event.preventDefault();
																							requestDownload(href);
																						});
	}
	if (nseen == "new") {
		var note = JSON.parse(localStorage[href.replace("http://www.fakku.net", "") + "--note"]);
		note[0] = "old"
		localStorage[href.replace("http://www.fakku.net", "") + "--note"] = JSON.stringify(note);
	}
	chrome.browserAction.setBadgeText({text: ""});
	chrome.browserAction.setBadgeBackgroundColor({color: [0, 0, 0, 0]})
	$('div#loading').hide();
};
// Function for removing the popup download box
function popupDL() {
	$(document).on("click", function(event) {
		event.preventDefault();
		if(event.target.id != 'download') {
			$('div#content').css("opacity", "1");
			$('div#float').hide();
			$(document).off("click");
		}
	});
}

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
function refreshNotes() {
	// Message that prompts the grabNotes to start. 
	chrome.runtime.sendMessage({msg: "GrabNotes"}, function(response) {
		//console.log("Message Sent: GrabNotes ");
	});
	
}
function requestDownload(href) {
	// Grab Info and Links
	//console.log(href);

	grabInfo(href, false, true);
	grabLinks(href, false, true);
	
	startDownload();
}

function startDownload() {
	if (errorReport) {
		errorReport = false;
		//console.log("Error message recieved from the server");
		//console.log(errorMsg.status + ": " + errorMsg.statusText);
		$('div#loading').hide();
		$('div#float b').text("Error recieved from server, try again.");
		$('div#float').append("<p style='color:red; -webkit-margin-before: 5px; -webkit-margin-after: 0px'>" + errorMsg.status + ": " + errorMsg.statusText + "</p>");
		return;

	}
	console.log("docReadyInfo: " + docReadyInfo + " & docReadyLink: " + docReadyLink);
	if (docReadyLink && docReadyInfo) {
		chrome.extension.sendMessage({msg: "downloadLinks", linkdata: linkarray, infodata: infoarray})
		docReadyLink = false;
		docReadyInfo = false;
		//console.log("sent message to background");
		$('div#loading').hide();
		$('div#float b').text("Success! Downloading Now.");

		return;
	}
	setTimeout(startDownload ,20);
}
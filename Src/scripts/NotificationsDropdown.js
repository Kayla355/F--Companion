
	var docReadyLink	= false;
	var docReadyInfo	= false;
	var errorReport		= false;
	var errorMsg 		= null;
	var idCounter		= 1;

// Create placeholder text
		// $('div#content').append("<center style='text-align:center'></center>");
		// $('div#content center').css("width", "180px");
		// $('div#content center').css("height", "20px");
		// $('div#content center').append("<b>Placeholder for notifications</b>");

// Create clickable menu
$('a#refresh').mousedown(function(event) { event.preventDefault(); refreshNotes(); });
$('a#refresh').mouseup(function(event) { event.preventDefault(); });

$('a#recache').mousedown(function(event) { event.preventDefault(); recacheNotes(true); });
$('a#recache').mouseup(function(event) { event.preventDefault(); });

// Queue function
// Thanks to debuggable for this. (http://bit.ly/dBugQFunc)
$.queue = {
    _timer: null,
    _queue: [],
    add: function(fn, context, time) {
        var setTimer = function(time) {
            $.queue._timer = setTimeout(function() {
                time = $.queue.add();
                if ($.queue._queue.length) {
                    setTimer(time);
                }
            }, time || 2);
        }

        if (fn) {
            $.queue._queue.push([fn, context, time]);
            if ($.queue._queue.length == 1) {
                setTimer(time);
            }
            return;
        }

        var next = $.queue._queue.shift();
        if (!next) {
            return 0;
        }
        next[0].call(next[1] || window);
        return next[2];
    },
    clear: function() {
        clearTimeout($.queue._timer);
        $.queue._queue = [];
    }
};

// Check if Login cookie has expired.
function checkCookies(reCache) {
	chrome.cookies.get({url: "http://www.fakku.net", name: "fakku_sid"}, function(results) {
		if (!results) {
			$('div#loading').remove();
			$('div#content').append("<center><b></b></center>");
			$('div#content center').css("width", "200px");
			$('div#content center').css("height", "20px");
			$('div#content center b').html("Cookie expired, please <a href='http://www.fakku.net/login' style='text-decoration: underline; color: blue;' target='_blank'>Login</a>");
		} else {
		  // Check if version saved in localStorage matches current version
			if (localStorage["app_version"] != chrome.app.getDetails().version) { // CHANGE THIS BACK LATER
				reCache = true;
			}
		  // Gather and create notifications 
		  	$('div#content').css("width", "545px");
		  	$('div#content').css("opacity", "0.6");
			$('div#float').show();

			var nArrayNames = JSON.parse(localStorage["n_array_names"]);

		  // For each arrayname in localstorage
			nArrayNames.forEach(function(name) {
				var self = this, doBind = function() {
					var nInfo = JSON.parse(localStorage[name]);
					//console.log(nInfo);
				  // Check if manga exists and reCache is false
					if (localStorage[nInfo[2].replace("http://www.fakku.net", "") + "--info"] && !reCache) {
						notificationInfo(JSON.parse(localStorage[nInfo[2].replace("http://www.fakku.net", "") + "--info"]), nInfo[2], nInfo[3], nInfo[0], nInfo[5]);
					} else {
						grabInfo(nInfo[2], true, false, nInfo[3], nInfo[0], nInfo[5]);
						//console.log(nInfo[2]);
					  // Update the app_version localStorage to current version
						if (nArrayNames[nArrayNames.length - 1] == name && localStorage["app_version"] != chrome.app.getDetails().version) {
							localStorage["app_version"] = chrome.app.getDetails().version;
						}
					}
		        };
		        $.queue.add(doBind, this);

			});
		}
	});
}
setTimeout(checkCookies, 20); // Workaround to get the loadingtrail to appear instead of nothing

// Function waiting for the information from GrabInfo
function notificationInfo(infodata, href, nold, nseen, nshown) {

  // Variables mapping what characters translates into what
  	var rMapped = /The\siDOLM@STER\sCinderella\sGirls|the\siDOLM@STER|\s&\s|\s+\s|\ |\.|\!|\@|\(|\)|\'|\_|\+|\%|\?|\:|\☆|\★|\α|\×/gi;
	var eMapped = {
		" & ":"-",
		" + ":"-",
		" ":"-",
		".":"",
		"!":"",
		"@":"",
		"(":"",
		")":"",
		"'":"",
		"_":"",
		"+":"-",
		"%":"",
		"?":"",
		":":"",
	  // Specials
		"☆":"byb",
		"★":"bzb",
		"α":"bab",
		"×":"b-b",
	  // iDOLM@STER special cases (hate inconsistencies...)
	  	"The iDOLM@STER":"the-idolmaster",
	  	"The iDOLM@STER Cinderella Girls":"the-idolmster-cinderella-girls",
	};

  // Variables
	var tagArray 		= new Array();
	var artistArray		= new Array();
	var translatorArray	= new Array();
	var error 			= false;

	if (infodata[1] == "error") { error = true; console.log("Error Parsing: " + infodata[3]); console.log("Error Message: " + infodata[2]); };

	var seriesLink 		= infodata[3].replace(rMapped, function(matched) { return eMapped[matched]; }).toLowerCase();
	var languageLink 	= infodata[5].replace(rMapped, function(matched) { return eMapped[matched]; }).toLowerCase();

	if (infodata[7]) { tagArray 		= infodata[7].split(", "); };
	if (infodata[4]) { artistArray 		= infodata[4].split(", "); };
	if (infodata[6]) { translatorArray 	= infodata[6].split(", "); };
	

  // Adds "--info" to the end of the href string to match the name in localStorage
	if (!localStorage[href.replace("http://www.fakku.net", "") + "--info"]) {
		localStorage[href.replace("http://www.fakku.net", "") + "--info"] = JSON.stringify(infodata);
	}
  // Create divs
	if (infodata[2] && !error) {
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
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#left div.wrap ul li:nth-child(1)').append("<a id='read-online' href='#'>Read Online</a>");
				newTabLink(idCounter, href, "read-online");
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#left div.wrap ul').append("<li></li>");
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#left div.wrap ul li:nth-child(2)').append("<a id='download' href='#'>Download</a>");
		
		// Right Div Content
			$('div#content div.noteDiv:nth-child(' + idCounter + ') ').append("<div id='right'></div>");
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right').append("<div class='wrap'></div>");
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap').append("<div id='hidediv'><button title='Remove' class='close'>Close</button></div>");
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap').append("<div class='content-name'></div>");
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap div.content-name').append("<h1>" + infodata[2] + "</h1>");
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap').append("<div class='row'></div>");
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap div.row').append("<div class='left'>Series: <a id='" + seriesLink + "' href='#'>" + infodata[3] + "</a></div>");
				newTabLink(idCounter, "series", seriesLink);
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap div.row').append("<div class='right'>Language: <span class='" + infodata[5] + "'><a id='" + languageLink + "' href='#'>" + infodata[5] + "</a></span></div>");
				newTabLink(idCounter, "", languageLink);
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap').append("<div class='row'></div>");
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap div.row:last-child').append("<div class='left'>Artist: </div>");
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap div.row:last-child').append("<div class='right'>Translator: <span class='english'></span></div>");
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap').append("<div class='row-small'></div>");
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap div.row-small').append("<div class='left'><b>" + infodata[1] + "</b> Pages</div>");
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap div.row-small').append("<div class='right'><i>" + nold + "</i></div>");
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap').append("<div class='hr></div>");
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap').append("<div id='description' class='row-left-full' itemprop='description'><b>Description: </b>" + infodata[8] + "</div>");
			$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap').append("<div class='row-left-full' itemprop='keywords'><b>Tags: </b></div>");

		// For each in array do...
		  // Create Tags Link
			tagArray.forEach(function(e) {
			  // Replaces certain characters defined in "eMapped" and creates a lowercase string out of it
				var er = e.replace(rMapped, function(matched) {
					return eMapped[matched];
				}).toLowerCase()

			  // If last in array do not use ", "
				if (tagArray[tagArray.length - 1] == e) {
					$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap div.row-left-full:last-child').append("<a id='" + er + "' href='#'>" + e + "</a>");
					newTabLink(idCounter, "tags", er);
				} else {
					$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap div.row-left-full:last-child').append("<a id='" + er + "' href='#'>" + e + "</a>, ");
					newTabLink(idCounter, "tags", er);
				}
			});
		  // Create Artists Link"
			artistArray.forEach(function(e) {
			  // Replaces certain characters defined in "eMapped" and creates a lowercase string out of it
				var er = e.replace(rMapped, function(matched) {
					return eMapped[matched];
				}).toLowerCase()

			  // If last in array do not use ", "
				if (artistArray[artistArray.length - 1] == e) {
					$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap div.row:nth-child(4) div.left').append("<a id='" + er + "' href='#'>" + e + "</a>");
					newTabLink(idCounter, "artists", er);
				} else {
					$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap div.row:nth-child(4) div.left').append("<a id='" + er + "' href='#'>" + e + "</a>, ");
					newTabLink(idCounter, "artists", er);
				}
			});
		  // Create Translators Link"
			translatorArray.forEach(function(e) {
			  // Replaces certain characters defined in "eMapped" and creates a lowercase string out of it
				var er = e.replace(rMapped, function(matched) {
					return eMapped[matched];
				}).toLowerCase()

			  // If last in array do not use ", "
				if (translatorArray[translatorArray.length - 1] == e) {
					$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap div.row:nth-child(4) div.right span').append("<a id='" + er + "' href='#'>" + e + "</a>");
					newTabLink(idCounter, "translators", er);
				} else {
					$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap div.row:nth-child(4) div.right span').append("<a id='" + er + "' href='#'>" + e + "</a>, ");
					newTabLink(idCounter, "translators", er);
				}
			});
		  // Description dropdown
			if ($('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap div#description.row-left-full').height() > 32) {

			  // Create dropdown button
			  	$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap div#description.row-left-full').css("height", "32px")
			  	$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap div#description.row-left-full').css("overflow", "hidden")
			  	$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap div#description.row-left-full b').css("cursor", "pointer")
			  	$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap div#description.row-left-full b').html("\&#9658\;Description:")


			  // Mousedown Action
				$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap div#description.row-left-full b').mousedown(function(event) {
					if ($(event.target.parentNode).height() > 32) {
					  // Hide dropdown
						$(event.target.parentNode).css("height", "32");
						$(event.target).html("\&#9658\;Description: ");

					  // Rescale Image
						// $(event.target.parentNode.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].childNodes[0].childNodes[0]).css("height", "");
						// $(event.target.parentNode.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].childNodes[0].childNodes[1]).css("height", "");
						// $(event.target.parentNode.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].childNodes[0]).css("height", $(event.target.parentNode.parentNode.parentNode.parentNode.childNodes[1]).height() - 60);
						// $(event.target.parentNode.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].childNodes[0].childNodes[0]).css("height", "100%");
						// $(event.target.parentNode.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].childNodes[0].childNodes[1]).css("height", "100%");
					} else {
					  // Show dropdown
					  	$(event.target.parentNode).css("height", "");
					  	$(event.target).html("\&#9660\;Description: ");
					 
					  // Rescale Image
						// $(event.target.parentNode.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].childNodes[0].childNodes[0]).css("height", "");
						// $(event.target.parentNode.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].childNodes[0].childNodes[1]).css("height", "");
						// $(event.target.parentNode.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].childNodes[0]).css("height", $(event.target.parentNode.parentNode.parentNode.parentNode.childNodes[1]).height() - 60);
						// $(event.target.parentNode.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].childNodes[0].childNodes[0]).css("height", "100%");
						// $(event.target.parentNode.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].childNodes[0].childNodes[1]).css("height", "100%");
					}
																																});
				}
		  // Fix left div height
				$('div#content div.noteDiv:nth-child(' + idCounter + ') div#left div.wrap div.images').css("height", $('div#content div.noteDiv:nth-child(' + idCounter + ') div#right').height() - 60);
				$('div#content div.noteDiv:nth-child(' + idCounter + ') div#left div.wrap div.images img').css("height", "100%");

		  // Download click action
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
																							$('div#float').prepend("<div id='loading' class='loadingtrail'></div>");
																							$('div#float b').text("Preparing Download");
																							$('div#float').css("left", x + 15);
																							$('div#float').css("top", y + offsetY - 10);
																							popupDL();
																						});
			$('div#content div.noteDiv:nth-child(' + idCounter + ') a#download').mouseup(function(event) {
																							event.preventDefault();
																							requestDownload(href);
																						});
		  // Hide div click action
			$('div#content div.noteDiv:nth-child(' + idCounter + ') button.close').mousedown(function(event) {
																							event.preventDefault();
																							var x=event.clientX; 
																							var y=event.clientY;
																							var offsetY=$(document).scrollTop();
																							//console.log(x + ", " + y);
																							//console.log($(document).scrollTop());
																							$('div#content').css("opacity", "0.6");
																							$('div#float').show();
																							$('div#float b').text("Removed");
																							$('div#float').css("left", x - 90);
																							$('div#float').css("top", y + offsetY);
																							localStorage[href.replace("http://www.fakku.net", "") + "--note"] = localStorage[href.replace("http://www.fakku.net", "") + "--note"].replace("shown", "hidden");
																							$(event.target.parentNode.parentNode.parentNode.parentNode).hide();
																							popupDL()
																						});
			$('div#content div.noteDiv:nth-child(' + idCounter + ') button.close').mouseup(function(event) {
																							event.preventDefault();
																						});
		  // New Tab Link click action
			function newTabLink(idCounter, e, er) {
				$('div#content div.noteDiv:nth-child(' + idCounter + ') a#' + er).click(function(event) {
									if (event.button != 2) {
										event.preventDefault();
									}
								});
				$('div#content div.noteDiv:nth-child(' + idCounter + ') a#' + er).mousedown(function(event) {
									if (event.button != 2) {
										event.preventDefault();
									}
								});
				$('div#content div.noteDiv:nth-child(' + idCounter + ') a#' + er).mouseup(function(event) {
									if (event.button != 2) {
										event.preventDefault();
										if (er == "read-online") {
											er = e.replace("http://www.fakku.net/", "");;
											e  = "";
										}
										if (e == "") {
											openTab("http://www.fakku.net/" + er);
										} else {
											openTab("http://www.fakku.net/" + e + "/" + er);
										}
										
									}
								});
			} // End of create

	  // Change class to hidden if true
		if (nshown == "hidden") {
			$('div#content div.noteDiv:nth-child(' + idCounter + ')').attr("class", "noteDiv-hidden");
		}
	  // Remove unused Divs
	  	if ($('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap div.row:nth-child(4) div.right span').text() == "") {
	  		$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap div.row:nth-child(4) div.right span').html("<a>Not Specified</a>");
	  		$('div#content div.noteDiv:nth-child(' + idCounter + ') div#right div.wrap div.row:nth-child(4) div.right span').attr("class", "japanese");
	  	}
	} // End of create divs

  // If new change to old to indicate that the entry has been seen
	if (nseen == "new") {
		var note = JSON.parse(localStorage[href.replace("http://www.fakku.net", "") + "--note"]);
		note[0] = "old"
		localStorage[href.replace("http://www.fakku.net", "") + "--note"] = JSON.stringify(note);
	}
  // If this is the last notifiction then... (Might need a new way to do this later, as it will most likely break if I decide to not load ALL the notifications at once)
	if (idCounter == JSON.parse(localStorage["n_array_names"]).length - 1) {
		notesDone();
		//console.log("notesDone triggered");
	}
};

// Function that is run when all notes have been created
function notesDone() {
	chrome.browserAction.setBadgeText({text: ""});
	chrome.browserAction.setBadgeBackgroundColor({color: [0, 0, 0, 0]})

	// Workaround for scrollbar not showing
	$('div#content').css("opacity", "1");
	$('div#float').hide();
	$('div#float').attr("class", "");
	$('div#loading').remove();

	setTimeout(function() {
		$('body').css("overflow", "scroll");
	}, 10);
}

// Function for removing the popup download box
function popupDL() {
	$(document).on("click", function(event) {
		event.preventDefault();
		if(event.target.id != 'download' && event.target.id != 'hidediv') {
			$('div#content').css("opacity", "1");
			$('div#float').hide();
			$(document).off("click");
		}
	});
}

// Function that is run when a link is clicked
function openTab(tabUrl) {
	var background = false;
	if(event) {
	  // If right-click return
		if(event.button == 2) {
			return;
		}
	  // if middle-click, metaKey or ctrlKey was pressed when clicking
		if(event.button == 1 || event.metaKey || event.ctrlKey) {
			background = true;
		}
	}
  // Create Tab
	chrome.tabs.create({
		url: tabUrl,
		selected: !background
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
// Function to check for new notifications
function refreshNotes() {
	$('div#float').attr("class", "float-load");
	$('div#float').prepend("<div id='loading' class='loadingtrailnotes'></div>");

	$('div#content').css("width", "545px");
  	$('div#content').css("opacity", "0.6");
	$('div#float').show();

  // Message that prompts the grabNotes to start. 
	chrome.runtime.sendMessage({msg: "GrabNotes", from: "nDropdown"}, function(response) {
		//console.log("Message Sent: GrabNotes ");
	});
	
}
// Listen for message that says refresh complete
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.msg == "nDropdownDone") {
		$('div#content').css("opacity", "1");
		$('div#float').hide();
		$('div#float').attr("class", "");
		$('div#loading').remove();
		var t = JSON.parse(localStorage["n_array_names"]); t = JSON.parse(localStorage[t[0]]);
		if (t[0] == "new") {
			recacheNotes(false);
		}
	}
});

// Function to recache notifications
function recacheNotes(reCache) {
	idCounter		= 1;

	$('div.noteDiv').remove();
	$('div.noteDiv-hidden').remove();
	$('div#float').attr("class", "float-load");
	$('div#float').prepend("<div id='loading' class='loadingtrailnotes'></div>");
	checkCookies(reCache);
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
		$('div#loading').remove();
		$('div#float b').text("Error recieved from server, try again.");
		$('div#float').append("<p style='color:red; -webkit-margin-before: 5px; -webkit-margin-after: 0px'>" + errorMsg.status + ": " + errorMsg.statusText + "</p>");
		return;

	}
	//console.log("docReadyInfo: " + docReadyInfo + " & docReadyLink: " + docReadyLink);
	if (docReadyLink && docReadyInfo) {
		chrome.extension.sendMessage({msg: "downloadLinks", linkdata: linkarray, infodata: infoarray})
		docReadyLink = false;
		docReadyInfo = false;
		//console.log("sent message to background");
		$('div#loading').remove();
		$('div#float b').text("Success! Downloading Now.");

		return;
	}
	setTimeout(startDownload ,20);
}
// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be 
// found in the LICENSE file.

// Default options for first launch.
	if (localStorage["first_time"] == undefined) {
		localStorage["first_time"] = "true";
	}
	if (localStorage["incognito_mode"] == undefined) {
		localStorage["incognito_mode"] = "true";
	}	
	if (localStorage["button_action"] == undefined) {
		localStorage["button_action"] = "download";
	}
	if (localStorage["conflict_action"] == undefined) {
		localStorage["conflict_action"] = "uniquify";
	}
	if (localStorage["folder_name"] == undefined) {
		localStorage["folder_name"] = "manganame";
	}	
	if (localStorage["file_structure"] == undefined) {
		localStorage["file_structure"] = '[null,"Page Number"]';
	}
	if (localStorage["fakku_notes"] == undefined) {
		localStorage["fakku_notes"] = "false";
	}
	if (localStorage["update_interval"] == undefined) {
		localStorage["update_interval"] = 60;
	}
	if (localStorage["entry_amount"] == undefined) {
		localStorage["entry_amount"] = 10;
	}
	if (localStorage["badge_number"] == undefined) {
		localStorage["badge_number"] = 0;
	}

// Listen for change of active tab.
chrome.tabs.onActivated.addListener(function(activeInfo) {
	chrome.tabs.get(activeInfo.tabId, function(tab) {
		var tabId = activeInfo.tabId
		checkForValidUrl(tabId, tab);
	});
});

// Called when the url of a tab changes.
function checkForValidUrl(tabId, tab, changeInfo) {
  // If the url is one of the following...
	if (tab.url.match(/https:\/\/www.fakku.net\/(manga|doujinshi)\/.*/)) {
		// Temporary solution to excludes not working properly
		if (tab.url.match(/https:\/\/www.fakku.net\/.*\/(favorites($|#|&|\?|\/.*)|english($|#|&|\?|\/.*)|japanese($|#|&|\?|\/.*)|artists($|#|&|\?|\/.*)|translators($|#|&|\?|\/.*)|series($|#|&|\?|\/.*)|newest($|#|&|\?|\/.*)|popular($|#|&|\?|\/.*)|downloads($|#|&|\?|\/.*)|controversial($|#|&|\?|\/.*)|tags($|#|&|\?|\/.*))/)) {
			// Change browserAction to Notifications
			if (localStorage["fakku_notes"] == "true") {
				badgeUpdate("notes");
				chrome.browserAction.setPopup({popup: "DropdownNotes.html"});
				chrome.browserAction.enable();
			} else {
				badgeUpdate("disabled");
				chrome.browserAction.disable();
			}
		} else {
			// Change browserAction to Download
			badgeUpdate("download");
			chrome.browserAction.setPopup({popup: "Dropdown.html"});
			chrome.browserAction.enable();
		}
	} else {
		// Change browserAction to Notifications
		if (localStorage["fakku_notes"] == "true") {
			badgeUpdate("notes");
			chrome.browserAction.setPopup({popup: "DropdownNotes.html"});
			chrome.browserAction.enable();
		} else {
			badgeUpdate("disabled");
			chrome.browserAction.disable();
		}
	}
};





var optionsArray 	= new Array();
var linkarray 		= new Array();
var infoarray 		= new Array();
var incognitoMode;
var nDropdown;
var checkNotes;

// Fetch request for options array.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.fetch == "getOptionsArray") {
		
		optionsArray[1] = localStorage["button_action"];
		optionsArray[2] = localStorage["text_area1"];
		optionsArray[3] = localStorage["text_area2"];
		optionsArray[4] = localStorage["folder_name"];
		optionsArray[5] = localStorage["file_structure"];

		var options_array = JSON.stringify(optionsArray);
		
		sendResponse({data: options_array});
	}
});

// Listen for a message to trigger the download function.
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.msg == "downloadLinks") {
		//console.log("DownloadLinks Triggered");
		linkarray = request.linkdata;
		infoarray = request.infodata;
		downloadLinks();
		sendResponse({msg: "done"});
	}
});

// Listen for a message to trigger the notifcationCheck
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.msg == "GrabNotes") {
		if (request.from == "nDropdown") {
			nDropdown = true;
		}
		notificationCheck();
		sendResponse({msg: "done"});
	}
});

// Timer to check for notifications
if (localStorage["fakku_notes"] == "true") {
	notificationCheck();
} else {
	badgeClear(true);
}

// Function to check for notifications
function notificationCheck() {
	if (localStorage["fakku_notes"] == "true") {
	  // Clear Console
	  //console.clear();
	  // Check if Login cookie has expired.
		chrome.cookies.get({url: "https://www.fakku.net", name: "fakku_sid"}, function(results) {
			if (!results) {
				badgeUpdate("error");
				recursiveNote(1000);
				console.log("Failed to find login cookie for Fakku.net");
			} else {
			  // Clear badge_number
				localStorage["badge_number"] = 0;
			  // Ajax Function to get the subscriptions
				$.ajax({
					type: "GET",
					url: "https://www.fakku.net/subscriptions",
					dataType: "html",
					async: false,
					success: function(html) {

					// Keep track of the names of the arrays
						var nArrayNames = new Array();
						var nLength = $(html).find("div.notification").length;
						
					// Find each notification
						$(html).find("div.notification").each(function(e) {
							e++;

							var nTagName = new Array();
							var nTagHref = new Array();
						// Find each <a> under the current notification
							$(html).find("div.notification:nth-child(" + e + ") a").each(function(n) {
								n++;
								
								var tagCheck = $(html).find("div.notification:nth-child(" + e + ") a:nth-child(" + n + ")").attr("href");
							// If the <a> is a tag link add it to the tag array
								if (tagCheck.match(/\/tags\/.*/)) {
									nTagName.push($(html).find("div.notification:nth-child(" + e + ") a:nth-child(" + n + ")").text());
								}
							});

							var nName 	= $(html).find("div.notification:nth-child(" + e + ") a:nth-last-of-type(1)").text();
							var nHref 	= "https://www.fakku.net" + $(html).find("div.notification:nth-child(" + e + ") a:nth-last-of-type(1)").attr("href");
							var nOld	= $(html).find("div.notification:nth-child(" + e + ") i").text();

							// console.log("Checked Notifications");
							// console.log("Name: " + nName);
							// console.log("Link: " + nHref);
							// console.log("Uploaded: " + nOld);
							// console.log("Under Tags: " + JSON.stringify(nTagName));
							// console.log("Tag Link: " + JSON.stringify(nTagHref));

							var noteArray 	= new Array();
							var nStorage 	= $(html).find("div.notification:nth-child(" + e + ") a:nth-last-of-type(1)").attr("href");

						// Assigning states for old/new & hidden/shown
						  // Check if localStorage entry exists
							if (localStorage[nStorage + "--note"]) {
								var nExists		= JSON.parse(localStorage[nStorage + "--note"]);

								if (localStorage[nStorage + "--info"]) {
									var iExists = JSON.parse(localStorage[nStorage + "--info"]);

								  // Checks if the info stored has an unknown error and if true recache the note.
									if (iExists[1] == "error" && !iExists[2].toString().match(/(404|410|411)/)) {
										console.log("Item containing Unknown error removed & re-checking.");
										nExists = ""; 
										iExists = "";
										localStorage.removeItem(localStorage[nStorage + "--note"]);
										localStorage.removeItem(localStorage[nStorage + "--info"]);
									}
								}

							  // Checks if old or new
								if (nExists[0] == "old") {
									noteArray[0] = "old";
								} else {
									noteArray[0] = "new";
									var i = localStorage["badge_number"];
									i++
									localStorage["badge_number"] = i;
								}
							  // Checks if hidden or shown
								if (nExists[5] == "hidden") {
									noteArray[5] = "hidden";
								} else {
									noteArray[5] = "shown";
								}
						  // If it does not exist
							} else {
								if (localStorage["first_time"] == "true") {
									noteArray[0] = "old";
								} else {
									noteArray[0] = "new";
									var i = localStorage["badge_number"];
									i++
									localStorage["badge_number"] = i;
								}

								noteArray[5] = "shown";
							}
						  // If last notification then set first_time to false if it was previously true
							if (e == nLength) {
								if (nDropdown == true) {
									chrome.extension.sendMessage({msg: "nDropdownDone"})
								}
								if (localStorage["first_time"] == "true") {
									localStorage["first_time"] = "false";
								}
							}

							noteArray[1] = nName;
							noteArray[2] = nHref;
							noteArray[3] = nOld;
							noteArray[4] = JSON.stringify(nTagName);

							localStorage[nStorage + "--note"] = JSON.stringify(noteArray)

							nArrayNames.push(nStorage + "--note");

							console.log(noteArray); // Leave uncommented
							//console.log(nStorage);
							//console.log(localStorage[nStorage + "--note"]);

						});
					// Create/Update the array of names
						var new_nArrayNames = new Array();

					  // Push localStorage array into current array
						if (localStorage["n_array_names"]) {
							JSON.parse(localStorage["n_array_names"]).forEach(function(name) {
								nArrayNames.push(name);
							});
						}
					  // Remove duplicates from array
						$.each(nArrayNames, function(i, name) {
							//console.log(i + " : " + name);
							if ($.inArray(name, new_nArrayNames) === -1) new_nArrayNames.push(name);
						});
						
						localStorage["n_array_names"] = JSON.stringify(new_nArrayNames);
						//console.log(localStorage["n_array_names"]);

					  // Remove Old localStorage data
					  // Works, but disabled for now because I would rather make more notes appear when scrolling to the bottom. Which would also make the extension faster to load the first time.
					  	// var key;
					  	// for (var i = 0, len = localStorage.length; i < len; i++) {
					  	// 	key = localStorage.key(i);
					  	// 	if ((/\/(manga|doujinshi)\/.*--(note)/).test(key)) {
					  	// 		if ($.inArray(key, nArrayNames) == -1) {
					  	// 			localStorage.removeItem(key)
					  	// 			localStorage.removeItem(key.replace("note", "info"))
					  	// 		}
					  	// 	}
					  	// }

					},
					error: function(error) {
						//msgError(error);
						//console.log("Error: " + error);
					}
				});
			  // Update Badgenumber
				badgeUpdate("update");
			  // Call the recursive function
				recursiveNote(localStorage["update_interval"] * 60 * 1000); // Get update interval from localStorage
			}
		});
	} else {
		clearTimeout(checkNotes);
	}
}

function badgeUpdate(status) {
  // When updateBadge is triggered from the notificationCheck
	if (status == "update") {
		if (localStorage["badge_number"] == 0) {
			badgeRed("");
		} else {
			badgeRed(localStorage["badge_number"]);
			localStorage["new_note"] = "true";
		}
	}
  // When a page you can download is detected
	if (status == "download") {
		if (localStorage["button_action"] == "download") {
			localStorage["badge_number_action"] = "true";
			badgeRed("DL");
		} else if (localStorage["button_action"] == "links") {
			localStorage["badge_number_action"] = "true";
			badgeRed("Link");
		}
  	}
  // When you are not signed in and an error occurs
	if (status == "error" && localStorage["badge_number_action"] != "true") {
  		localStorage["badge_number"] = "Err";
		badgeRed("Err");
  	}
  // When notifications are disabled
  	if (status == "disabled") {
		badgeClear(true);
  	}
  // When you leave a downloadable page
  	if (status == "notes") {
		badgeClear();
		localStorage["badge_number_action"] = "false";
  	}
  // When updateBadge is triggered from the notificationCheck after an error
  	if (status == "update" && localStorage["badge_number"] == "Err") {
  		badgeClear(true); 
  	}
  // When you leave a downloadable page and have a notification
  	if (status != "download" && localStorage["badge_number"] != 0 && localStorage["badge_number_action"] != "true") {
  		badgeRed(localStorage["badge_number"]);
  	}
}
function badgeRed (text) {
	chrome.browserAction.setBadgeText({text: text});
	chrome.browserAction.setBadgeBackgroundColor({color: [200, 0, 0, 255]});
}

function badgeClear(clear) {
	chrome.browserAction.setBadgeText({text: ""});
	chrome.browserAction.setBadgeBackgroundColor({color: [0, 0, 0, 0]});
	if (clear) {
		localStorage["badge_number"] = 0;
	}
}

function recursiveNote(updateInterval) {
	// Resursive function to check for updates
	clearTimeout(checkNotes);
	checkNotes = setTimeout(notificationCheck, updateInterval);
}

// Function for downloading the links.
function downloadLinks() {
		
	// console.log(infoarray);
	// console.log(linkarray);
	
	var imgURL 			= linkarray[1];
	var quant 			= parseInt(infoarray[1]);
	var ext				= linkarray[quant + 1]
	var manganame		= infoarray[2];
	var series			= infoarray[3];
	var authorname		= infoarray[4];
	var language		= infoarray[5];
	var translator		= infoarray[6];
	var tags			= infoarray[7];
	var description 	= infoarray[8];
	var folderStructure = localStorage["folder_name"];
	var fileStructure	= JSON.parse(localStorage["file_structure"]);
	var fslen 			= fileStructure.length - 1;
	var filename		= new String();
	var conflictRes 	= localStorage["conflict_action"];

// Convert the folderStructure variable into the proper format
	switch (folderStructure) {
		case "manganame":
			folderStructure = manganame;
			break;
		case "series":
			folderStructure = series;
			break;
		case "authorname":
			folderStructure = authorname;
			break;
		case "language":
			folderStructure = language;
			break;
		case "translator":
			folderStructure = translator;
			break;
		case "pagenumber":
			folderStructure = pagenumber;
			break;
		case "tags":
			folderStructure = tags;
			break;
	}

// Remove "." if it's the last character
	folderStructure = folderStructure + '\/:*?"<>|';
	while (folderStructure.match("[.]$")) {
		folderStructure = folderStructure.replace(".", "");
	}
// Remove any of the following characters, \/:*?"<>|
	while (folderStructure.match('\\\\|\/|\\:|\\*|\\?|\\"|\\<|\\>|\\|')) {
		//console.log(folderStructure);
		var r = folderStructure.match('\\\\|\/|\\:|\\*|\\?|\\"|\\<|\\>|\\|');
		folderStructure = folderStructure.replace(r, "");
	}

// Convert the fileStructure array into the proper format	
	for (var i = 1; i <= fslen; i++) {
		var languageCheck = false;
		switch (fileStructure[i]) {
			case "Manga Name":
				fileStructure[i] = manganame;
				break;
			case "Series Name":
				fileStructure[i] = series;
				break;
			case "Author Name":
				fileStructure[i] = authorname;
				break;
			case "Language":
				fileStructure[i] = "(" + language + ")";
				languageCheck = true;
				break;
			case "Translator":
				fileStructure[i] = translator;
				break;
			case "Page Number":
				fileStructure[i] = "pagenumber";
				break;
			case "Tags":
				fileStructure[i] = tags;
				break;
		}

		if (i == 1) {
			filename = fileStructure[i];
		} else if (languageCheck) {
			filename = filename + fileStructure[i];
			var languagePrev = true;
		}else if (languagePrev) {
			filename = filename + " " + fileStructure[i];
			var languagePrev = false;
		} else {
			filename = filename + " - " + fileStructure[i];
		}
	}
		
// Check if incognito download
	if (localStorage["incognito_mode"] == "true") {
		incognitoMode = true;
	} else {
		incognitoMode = false;
	}
		
// Triggers a download for each generated link.
	var copypasta2 = "";
	var downloadIds = new Array();
	for (var i = 1; i <= quant; i++) {
		var str = '' + i;
		while (str.length < 3) str = '0' + str;
		copypasta2 = linkarray[i];
			
		var filename2 = filename.replace("pagenumber", str);
		// console.log(folderStructure + "/" + filename2 + ext);
		// console.log(copypasta2);

		chrome.downloads.download({url: copypasta2, filename: folderStructure + "/" + filename2 + ext, conflictAction: conflictRes});
			
	}
}

chrome.downloads.onChanged.addListener(function (downloadID) {
	if (incognitoMode) {
		if (downloadID.state) {
			if (downloadID.state.current == "complete" || downloadID.state.current == "interrupted") {
				chrome.downloads.search({id: downloadID.id}, function(result) {
					if (result[0].byExtensionName == "F! Companion" || result[0].byExtensionName == "F! Companion Dev") {
						chrome.downloads.erase({id: downloadID.id})
						//console.log("Erased: " + downloadID.id);
					}
					//console.log(result);
				});
			}
		}
	}
});
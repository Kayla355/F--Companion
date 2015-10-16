// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be 
// found in the LICENSE file.

// Default options for first launch.
	if (localStorage["first_time"] === undefined) {
		localStorage["first_time"] = "true";
	}
	if (localStorage["incognito_mode"] === undefined) {
		localStorage["incognito_mode"] = "true";
	}
	if (localStorage["zip_download"] === undefined) {
		localStorage["zip_download"] = "true";
	}	
	if (localStorage["button_action"] === undefined) {
		localStorage["button_action"] = "download";
	}
	if (localStorage["conflict_action"] === undefined) {
		localStorage["conflict_action"] = "uniquify";
	}
	if (localStorage["folder_name"] === undefined) {
		localStorage["folder_name"] = "[NAME]";
	}	
	if (localStorage["file_structure"] === undefined) {
		localStorage["file_structure"] = '[PAGE]';
	}
	if (localStorage["fakku_notes"] === undefined) {
		localStorage["fakku_notes"] = "false";
	}
	if (localStorage["update_interval"] === undefined) {
		localStorage["update_interval"] = 60;
	}
	if (localStorage["entry_amount"] === undefined) {
		localStorage["entry_amount"] = 10;
	}
	if (localStorage["badge_number"] === undefined) {
		localStorage["badge_number"] = 0;
	}
	if (localStorage["http_to_https"] === undefined) {
		localStorage["http_to_https"] = "true";
	}
	if(localStorage["new_note"] === undefined) {
		localStorage["new_note"] = "true";
	}

// Listen for change of active tab.
chrome.tabs.onActivated.addListener(function(activeInfo) {
	chrome.tabs.get(activeInfo.tabId, function(tab) {
		var tabId = activeInfo.tabId;
		checkForValidUrl(tabId, tab);
	});
});

chrome.tabs.onUpdated.addListener(function(updatedTab) {
	chrome.tabs.get(updatedTab, function(tab) {
		if(tab.active) {
			var tabId = updatedTab;
			checkForValidUrl(tabId, tab);
		}
	});
});

// Runs function on load to avoid issues.
checkForValidUrl();

// Called when the url of a tab changes.
function checkForValidUrl(tabId, tab, changeInfo) {
	if(tab && tab !== null) {
	  // If the url is one of the following...
		if (tab.url.match(/.*\/\/www.fakku.net\/(manga|doujinshi)\/.*/)) {
			// Temporary solution to excludes not working properly
			if (tab.url.match(/.*\/\/www.fakku.net\/.*\/(favorites($|#|&|\?|\/.*)|english($|#|&|\?|\/.*)|japanese($|#|&|\?|\/.*)|artists($|#|&|\?|\/.*)|translators($|#|&|\?|\/.*)|series($|#|&|\?|\/.*)|newest($|#|&|\?|\/.*)|popular($|#|&|\?|\/.*)|downloads($|#|&|\?|\/.*)|controversial($|#|&|\?|\/.*)|tags($|#|&|\?|\/.*))/)) {
				// Change browserAction to Notifications
				if (localStorage["fakku_notes"] == "true") {
					badgeUpdate("notes");
					chrome.browserAction.setPopup({popup: "DropdownNotes.html"});
					return;
				} else {
					badgeUpdate("disabled");
					chrome.browserAction.setPopup({popup: ""});
					return;
				}
			} else {
			  // Change browserAction to Download
				badgeUpdate("download");
				chrome.browserAction.setPopup({popup: "Dropdown.html"});
				return;
			}
		} else if(tab.url.match(/.*\/\/pururin.com\/(gallery|view|thumbs)\/.*/)) {
			  // Change browserAction to Download
				badgeUpdate("download");
				chrome.browserAction.setPopup({popup: "Dropdown.html"});
				return;
		} else if(tab.url.match(/.*\/\/nhentai.net\/g\/[0-9]*/)) {
			  // Change browserAction to Download
				badgeUpdate("download");
				chrome.browserAction.setPopup({popup: "Dropdown.html"});
				return;
		}
	}

  // Change browserAction to Notifications
	if (localStorage["fakku_notes"] === "true") {
		badgeUpdate("notes");
		chrome.browserAction.setPopup({popup: "DropdownNotes.html"});
	} else {
		badgeUpdate("disabled");
		chrome.browserAction.setPopup({popup: ""});
	}
}

function createCORSRequest(p) {
	var xhr = new XMLHttpRequest();

	if(p.responseType) { 
		xhr.responseType = p.responseType;
	}

	if(!p.method || !p.url) {
		return;
	}

	if ("withCredentials" in xhr) {
		xhr.open(p.method, p.url, true);
	} else if(typeof XDomainRequest != "undefined") {
		xhr = new XDomainRequest();
		xhr.open(method, url);
	} else {
		xhr = null;
	}
	return xhr;
}





var optionsArray 	= [];
var linkarray 		= [];
var infoarray 		= [];
var loggedIn		= true;
var nDropdown;
var checkNotes;

// Message function to recieve messages meant for the background script.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // Fetch request for options array.
	if(request.fetch == "getOptionsArray") {
		optionsArray[1] = localStorage["button_action"];
		optionsArray[2] = localStorage["text_area1"];
		optionsArray[3] = localStorage["text_area2"];
		optionsArray[4] = localStorage["folder_name"];
		optionsArray[5] = localStorage["file_structure"];

		var options_array = JSON.stringify(optionsArray);
		
		sendResponse({data: options_array});
	}

  // Listen for a message to trigger the download function.
	if(request.msg == "downloadLinks") {
		//console.log("DownloadLinks Triggered");
		linkarray = request.linkdata;
		infoarray = request.infodata;
		downloadLinks();
		sendResponse({msg: "done"});
	}

  // Listen for a message to trigger the notifcationCheck
	if(request.msg == "GrabNotes") {
		if (request.from == "nDropdown") {
			nDropdown = true;
		}
		notificationCheck();
		sendResponse({msg: "done"});
	}
  // Listen for a message to trigger the cleanStorage function
  	if(request.msg == "cleanLocalStorage") {
  		cleanStorage(sendResponse); // Passing the sendResponse function to the cleanStorage function so that it can be called when done.
  		return true; 				// Necessary to mark that you will be sending back a message at a later time, for some reason.
  	}
});

var last_sid = {
	cookie: {
		value: 0
	}
};
// Listen for a change to the login cookie
chrome.cookies.onChanged.addListener(function(object) {
	if(object.cookie.name === "fakku_sid" && object.cause === "explicit") {
		console.log("Fakku cookie updated", object);
		if(localStorage["badge_number"] === "Err" && object.cookie.value !== last_sid.cookie.value) {
			console.log("Performing check for new notes.");
			notificationCheck();
		}
		last_sid = object;
	}
	//console.log(object.cookie.name+" changed", object);
});

// Check for new extension version on github
if (Math.floor(Math.round(((new Date()).getTime() - (new Date(localStorage["github_lastchecked"])).getTime()) / 1000) / 86400) >= 1) {
	var github_version;
	var github_update;

	var xhr = createCORSRequest({method: "GET", url: "https://raw.githubusercontent.com/Kayla355/F--Companion/master/Src/manifest.json"});
	xhr.onload = function() {
		github_version = xhr.responseText.match(/"version": ".*?(?=")/)[0].replace('"version": "', "").replace(/\./g, "");

		if(parseInt(github_version) < parseInt(chrome.app.getDetails().version.replace(/\./g, ""))) {
			github_update = "true";
			if(github_version != localStorage["github_version"]) {
				localStorage["github_notified"] = "false";
			}
		} else {
			github_update = "false";
		}


		localStorage["github_version"] 		= github_version;
		localStorage["github_update"] 		= github_update;
		localStorage["github_lastchecked"] 	= new Date();
	};
	xhr.send();
}

// Check if old array storage of notes exist; if yes, run convert function
if(localStorage["n_array_names"] !== undefined) {
	//convertNotesToObject();
}

// Timer to check for notifications
if (localStorage["fakku_notes"] == "true") {
	notificationCheck();
} else {
	badgeClear(true);
}

// Function to check for notifications
function notificationCheck() {
	var start = new Date().getTime();
	if (localStorage["fakku_notes"] == "true") {
	  // Clear Console
	  //console.clear();
	  // Check if Login cookie exists
		chrome.cookies.get({url: "https://www.fakku.net", name: "fakku_sid"}, function(results) {
			if (!results) {
				badgeUpdate("error");
				console.log("Failed to find login cookie for Fakku.net");
			} else {
			  // Ajax Function to get the 'following' page.
			  	getAjaxData("https://www.fakku.net/following").then(function(html) {
				  // Keep track of the names of the arrays
					var nArrayNames = [];
					var notes = {};
					
					if(localStorage["notes"]) {
					  notes = JSON.parse(localStorage["notes"]); //For old notes, I think... Might do nothing.
					}

				  // Check if there was an error on the page. *Backup for the rare instance of the cookie not being expired, yet you are logged out.
					if($(html).find('div#error').length !== 0) {
						badgeUpdate("error");
						console.log("Failed to find login cookie for Fakku.net");
						loggedIn = false;
						return;
					} else {
						loggedIn = true;
					}

				  // Find each notification
					$(html).find('div.notification').each(function(i, div) {
						var nTags = [];
					// Find each <a> under the current notification
						$(div).find('a').each(function(i, anchor) {
							var tagCheck = $(anchor).attr("href");
						// If the <a> is a tag link add it to the tag array
							if (tagCheck.match(/\/tags\/.*/)) {
								nTags.push($(anchor).text());
							}
						});

						var nName 	= $(div).find('a:nth-last-of-type(1)').text();
						var nHref 	= "https://www.fakku.net" + $(div).find('a:nth-last-of-type(1)').attr("href");
						var nOld	= $(div).find('i').text();
						var type 	= nHref.match(/(doujinshi|manga)/)[0];
						var nNew;
						var nStatus;
						var nExists;
						var iExists;

						//console.log("Checked Notifications");
						//console.log("Name: " + nName);
						//console.log("Link: " + nHref);
						//console.log("Uploaded: " + nOld);
						//console.log("Under Tags: " + JSON.stringify(nTags));

						var noteArray 	= [];
						var nStorage 	= $(div).find("a:nth-last-of-type(1)").attr("href");

					// Assigning states for old/new & hidden/shown
					  // Check if localStorage entry exists
						if (localStorage[nStorage + "--note"]) {
							nExists		= JSON.parse(localStorage[nStorage + "--note"]);

							if (localStorage[nStorage + "--info"]) {
								iExists = JSON.parse(localStorage[nStorage + "--info"]);

							  // Checks if the info stored has an unknown error and if true recache the note.
								if (iExists[1] == "error" && !iExists[2].toString().match(/(404|410|411)/)) {
									console.log("Item contains Unknown error removed & re-checking.");
									nExists = ""; 
									iExists = "";
									localStorage.removeItem(localStorage[nStorage + "--note"]);
									localStorage.removeItem(localStorage[nStorage + "--info"]);
								}
							}

						  // Checks if old or new
							if (nExists[0] == "old") {
								noteArray[0] = "old";
								nNew = false;
							} else {
								noteArray[0] = "new";
								nNew = true;

								if(iExists && iExists[1] != "error") {
									i = localStorage["badge_number"];
								}
								
								i++;
								localStorage["badge_number"] = i;
							}
						  // Checks if hidden or shown
							if (nExists[5] == "hidden") {
								noteArray[5] = "hidden";
								nStatus = "hidden";
							} else {
								noteArray[5] = "shown";
								nStatus = "shown";
							}
					  // If it does not exist
						} else {
							if(localStorage["first_time"] == "true") {
								noteArray[0] = "old";
								nNew = false;
							} else {
								noteArray[0] = "new";
								nNew = true;
							}
								
							i = localStorage["badge_number"];
							i++;
							localStorage["badge_number"] = i;

							noteArray[5] = "shown";
							nStatus = "shown";
						}

						noteArray[1] = nName;
						noteArray[2] = nHref;
						noteArray[3] = nOld;
						noteArray[4] = JSON.stringify(nTags);

						notes['['+type+'] '+nName] = {
							info: {
								name: 		nName,
								href: 		nHref,
								age: 		nOld,
								tags: 		JSON.stringify(nTags),
								status: 	nStatus,
								newNote: 	nNew,
							},
							data: {},
						};

						localStorage[nStorage + "--note"] = JSON.stringify(noteArray);

						nArrayNames.push(nStorage + "--note");

						//console.log(noteArray); // Leave uncommented
						//console.log(nStorage);
						//console.log(localStorage[nStorage + "--note"]);

					});
				// Create/Update the array of names
					var new_nArrayNames = [];

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

				  // If conversion of localstorage links from http to https has not been done.
				  // This is done because Fakku has changed all links from http to https and the localstorage links still have http in them.
					if (localStorage["http_to_https"] == "true") {
						$.each(new_nArrayNames, function(i, data) {
							var http = JSON.parse(localStorage[data]);
							if (http[2].match(/http:/)) {
								http[2] = http[2].replace("http:", "https:");
							}
							localStorage[data] = JSON.stringify(http);
						});
						localStorage["http_to_https"] = "false";
					}

					localStorage["n_array_names"] = JSON.stringify(new_nArrayNames);
					//localStorage["notes"] = JSON.stringify(notes);
					console.log(notes);
					//test(notes);
					//console.log(localStorage["n_array_names"]);

					var end = new Date().getTime();
					var time = end - start;
					console.log('Background Execution time: ' + time / 1000 + 's');

				  // If last notification; then set first_time to false; if it was previously true
				  // Also if request was sent from nDropdown send done message
					if (nDropdown === true) {
						chrome.extension.sendMessage({msg: "nDropdownDone"});
					}
					if (localStorage["first_time"] == "true") {
						localStorage["first_time"] = "false";
					}
			  	});
				if(loggedIn) {
				  // Update Badgenumber
					badgeUpdate("update");
				  // Call the recursive function
					recursiveNote(localStorage["update_interval"] * 60 * 1000); // Get update interval from localStorage
				}
			}
		});
	} else {
		clearTimeout(checkNotes);
	}
}

function getAjaxData(href) {
	return $.ajax({
		type: "GET",
		url: href,
		dataType: "html",
	});
}

function getAjaxData2(href, type) {
	return $.ajax({
		type: "GET",
		url: href,
		dataType: type,
		error: function(error) {
			console.error(error);
		}
	});
}

// Updates the stored HTML content
function updateHTMLContent(note) {
	var html = $.parseHTML(JSON.parse(localStorage["html_content"]));
	var divs = "";
	$(html).each(function(i, div) {
		if($(div).attr('class') === "noteDiv") {
			div = $('<div class="noteDiv">').append($(div).clone()).html();
			divs += div;
		  
		  // Temporary div addition for testing
			if(i === 1) {
				note = div;
			}
		}
	});
	note += divs;
	localStorage["html_content"] = JSON.stringify(note);
}

function test(notes) {
	var ids = [];
	for(var note in notes) {
		if(notes.hasOwnProperty(note)) {
			//console.log(note);
			//console.log(notes[note]);
			ids.push(note);
		}
	}
	ids.reverse().forEach(function(name) {
		console.log(name);
		console.log(notes[name]);
	});
}

// Convert non-object notes to object
function convertNotesToObject() {
	var notes 		= JSON.parse(localStorage["notes"]);
	var noteNames 	= JSON.parse(localStorage["n_array_names"]);

	noteNames.forEach(function(name) {
		var dName = name.replace("--note", "--info");

	  // Variables containing information about notes
		var note 	= JSON.parse(localStorage[name]);
		var type 	= name.match(/(doujinshi|manga)/)[0];
		var nName 	= note[1];
		var nHref 	= note[2];
		var nOld	= note[3];
		var nTags 	= note[4];
		var nStatus = note[5];
		var nNew;

		if(note[0] === "old") {
			nNew = false;
		} else {
			nNew = true;
		}

	  // Variables containg data of notes
	  	var dNote = JSON.parse(localStorage[dName]);

	  	var quant 		= dNote[1];
		var manganame 	= dNote[2];
		var series 		= dNote[3];
		var authorname 	= dNote[4];
		var language 	= dNote[5];
		var translator 	= dNote[6];
		var tags 		= dNote[7];
		var description = dNote[8];
		var imgCover 	= dNote[9];
		var imgSample 	= dNote[10];
		var date 		= dNote[11];

	  // Add the new note to notes object
		notes['['+type+'] '+nName] = {
			info: {
				name: nName,
				href: nHref,
				age: nOld,
				tags: nTags,
				status: nStatus,
				newNote: nNew
			},
			data: {
				name: 			manganame,
				series: 		series,
				author: 		authorname,
				translator: 	translator,
				language: 		language,
				pages: 			quant,
				description: 	description,
				tags: 			tags,
				date: 			date,
				images: {
					cover: 		imgCover,
					sample: 	imgSample
				}
			}
		};

	  // Remove old localStorage data
		localStorage.removeItem(name);
		localStorage.removeItem(dName);
	});

  // Update localstorage & remove old list of array names
	localStorage["notes"] = JSON.stringify(notes);
	localStorage.removeItem("n_array_names");
}

// Function that cleans up the localstorage to avoid exceeding the storage limit
function cleanStorage(sendResponse) {
	var nDate 	= Math.round(new Date().getTime()/1000); 	// seconds
	var limit 	= localStorage["storage_time"]*86400; 		// seconds
	var notes 	= JSON.parse(localStorage["notes"]);

	for(var note in notes) {
		if(notes.hasOwnProperty(note)) {
			var obj = notes[note];
			var age = nDate - obj.data.date;
			if(age >= limit) {
				delete notes[note.toString()];
				console.log("Should remove note: "+note.toString());
			}
		}
	}
	
  // Update localstorage
	localStorage["notes"] = JSON.stringify(notes);
	sendResponse({msg: "done"});
}

// Update badge text
function badgeUpdate(status) {
  // When updateBadge is triggered from the notificationCheck
	if (status == "update") {
		if (localStorage["badge_number"] == "0") {
			badgeRed("");
			localStorage["new_note"] = "false";
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
  	if (status != "download" && localStorage["badge_number"] != "0" && localStorage["badge_number_action"] != "true") {
  		badgeRed(localStorage["badge_number"]);
  	}
}

// Update badgetext with red coloring
function badgeRed(text) {
	chrome.browserAction.setBadgeText({text: text});
	chrome.browserAction.setBadgeBackgroundColor({color: [200, 0, 0, 255]});
}

// Update badgetext to nothing
function badgeClear(clear) {
	chrome.browserAction.setBadgeText({text: ""});
	chrome.browserAction.setBadgeBackgroundColor({color: [0, 0, 0, 0]});
	if (clear) {
		localStorage["badge_number"] = 0;
	}
}

// Recursive function to check for new notes
function recursiveNote(updateInterval) {
	// Resursive function to check for updates
	clearTimeout(checkNotes);
	checkNotes = setTimeout(notificationCheck, updateInterval);
}

// Function for downloading the links.
function downloadLinks() {
		
	//console.log(infoarray);
	//console.log(linkarray);
	
	var imgURL 			= linkarray[1];
	var quant 			= parseInt(infoarray[1]);
	var ext				= linkarray[quant + 1];
	var manganame		= infoarray[2];
	var series			= infoarray[3];
	var authorname		= infoarray[4];
	var language		= infoarray[5];
	var translator		= infoarray[6];
	var tags			= infoarray[7];
	var description 	= infoarray[8];
	var conflictRes 	= localStorage["conflict_action"];
	var names = {};
	var structure 		= {
		folder: localStorage["folder_name"],
		file: localStorage["file_structure"]
	};

	var note = {
		name: manganame,
		series: series,
		author: authorname,
		translator: translator,
		language: language,
		tags: tags,
	};

// Create the folder/filename structure
	for(var name in {folder: 0, file: 0}) {

		var string = structure[name];
		names[name] = { text: "" };

	  // Remove "." if it's the last character
		while (string.match("[.]$")) {
			string = string.replace(".", "");
		}
	  // Remove any of the following characters, \/:*?"<>|
		while (string.match('\\\\|\/|\\:|\\*|\\?|\\"|\\<|\\>|\\|')) {
			//console.log(string);
			var r = string.match('\\\\|\/|\\:|\\*|\\?|\\"|\\<|\\>|\\|');
			string = string.replace(r, "");
		}

	  // Convert arrays to single string
		for (var prop in note) {
			if(note.hasOwnProperty(prop)) {
				try {
					names[name][prop] = note[prop].join(", ");
				} catch(e) {
					names[name][prop] = note[prop];
				}
			}
		}
	  
		var rMapped = /\[NAME\]|\[SERIES\]|\[ARTIST\]|\[LANGUAGE\]|\[TRANSLATOR\]|\[PAGE\]|\[TAGS\]/gi;
		var eMapped = {
			"[NAME]": names[name].name,
			"[SERIES]": names[name].series,
			"[ARTIST]": names[name].author,
			"[LANGUAGE]": names[name].language,
			"[TRANSLATOR]": names[name].translator,
			"[PAGE]": "pagenumber",
			"[TAGS]": names[name].tags,
		};

	  // Return the mapped value.
	  	names[name].text = string.toUpperCase().replace(rMapped, function(matched) {
			return eMapped[matched];
		});
	}
		
// Triggers a download for each generated link.
	var downloadURL = "";
	var downloadIds = [];
	var zip 		= new JSZip();
	var onloadCount = 0;

	for (i = 1; i <= quant; i++) {
		var str = '' + i;
		while (str.length < 3) str = '0' + str;
		downloadURL = linkarray[i];
			
		var filename2 = names.file.text.replace("pagenumber", str);
		//console.log(folderStructure + "/" + filename2 + ext);
		//console.log(downloadURL);
	  
	  	if(localStorage["zip_download"] == "true") {
	  	  // Zip Download
	  		var xhr = createCORSRequest({method: "GET", url: downloadURL, responseType:"arraybuffer"});
	  		xhr.filename = filename2 + ext;
			xhr.onload = function(data) {
				if(data.target.status == 200) {
					zip.file(this.filename, data.target.response, {binary: true});
					onloadCount++;
					localStorage["progress_bar"] = Math.round((onloadCount / quant).toFixed(2) * 100);
					if(onloadCount === quant) {
						var content = zip.generate({type: "blob"});
						saveAs(content, names.folder.text + ".zip");
					}
				} else {
					localStorage["progress_bar"] = 404;
				}
			};
			xhr.send();
	  	} else {
	  	 // Normal Download
			chrome.downloads.download({url: downloadURL, filename: names.folder.text + "/" + filename2 + ext, conflictAction: conflictRes});
	  	}
			
	}
	
// Example Code of downloading Zip
	// var xhr = createCORSRequest({method: "GET", url: "https://t.fakku.net/images/manga/m/[Konmori]_Original_Work_-_milky_break/images/006.jpg", responseType:"arraybuffer"});
	// 	xhr.onload = function(data) {
	// 		var zip = new JSZip();
	// 		zip.file("006.jpg", data.target.response, {binary: true});
	// 		var content = zip.generate({type: "blob"});
	// 		saveAs(content, "test.zip");
	// 	};
	// xhr.send();
}

chrome.downloads.onChanged.addListener(function (downloadID) {
	if (localStorage["incognito_mode"] == "true") {
		if (downloadID.state) {
			if (downloadID.state.current == "complete" || downloadID.state.current == "interrupted") {
				chrome.downloads.search({id: downloadID.id}, function(result) {
					if (result[0].byExtensionName == "F! Companion" || result[0].byExtensionName == "F! Companion Dev") {
						chrome.downloads.erase({id: downloadID.id});
						//console.log("Erased: " + downloadID.id);
					}
					//console.log(result);
				});
			}
		}
	}
});
// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Default options for first launch.
	if (localStorage["run_background"] == undefined) {
		localStorage["run_background"] = "false";
	}	
	if (localStorage["hidden_mode"] == undefined) {
		localStorage["hidden_mode"] = "false";
	}	
	if (localStorage["button_action"] == undefined) {
		localStorage["button_action"] = "download";

	}	
	if (localStorage["folder_name"] == undefined) {
		localStorage["folder_name"] = "manganame";
	}	
	if (localStorage["file_structure"] == undefined) {
		localStorage["file_structure"] = '[null,"Page Number"]'
	}
// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if (changeInfo.status === "complete") {
		checkForValidUrl(tabId, changeInfo, tab);
	}
});

// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
  // If the url is one of the following...
  if (tab.url.match(/http:\/\/www.fakku.net\/manga\/.*/) || tab.url.match(/http:\/\/www.fakku.net\/doujinshi\/.*/) ) {
	// Temporary solution to excludes not working properly
	// Consider making this dynamic instead (Grabbing part of the url and putting it in a variable)
	if (tab.url.match(/http:\/\/www.fakku.net\/.*\/favorites$/) || tab.url.match(/http:\/\/www.fakku.net\/.*\/favorites\/.*/) || tab.url.match(/http:\/\/www.fakku.net\/.*\/english$/) || tab.url.match(/http:\/\/www.fakku.net\/.*\/english\/.*/) || tab.url.match(/http:\/\/www.fakku.net\/.*\/japanese$/) || tab.url.match(/http:\/\/www.fakku.net\/.*\/japanese\/.*/) || tab.url.match(/http:\/\/www.fakku.net\/.*\/artists$/) || tab.url.match(/http:\/\/www.fakku.net\/.*\/artists\/.*/) || tab.url.match(/http:\/\/www.fakku.net\/.*\/translators$/) || tab.url.match(/http:\/\/www.fakku.net\/.*\/translators\/.*/) || tab.url.match(/http:\/\/www.fakku.net\/.*\/series$/) || tab.url.match(/http:\/\/www.fakku.net\/.*\/series\/.*/) || tab.url.match(/http:\/\/www.fakku.net\/.*\/newest$/) || tab.url.match(/http:\/\/www.fakku.net\/.*\/newest\/.*/) || tab.url.match(/http:\/\/www.fakku.net\/.*\/popular$/) || tab.url.match(/http:\/\/www.fakku.net\/.*\/popular\/.*/) || tab.url.match(/http:\/\/www.fakku.net\/.*\/downloads$/) || tab.url.match(/http:\/\/www.fakku.net\/.*\/downloads\/.*/) || tab.url.match(/http:\/\/www.fakku.net\/.*\/controversial$/) || tab.url.match(/http:\/\/www.fakku.net\/.*\/controversial\/.*/) || tab.url.match(/http:\/\/www.fakku.net\/.*\/tags\/.*/)  ) {
		} else {
	    // ... show the page action if the option is enabled.
		if (localStorage["button_action"] != "hidden") {
			chrome.pageAction.show(tabId);
		}
	}
  }
};

var optionsArray 	= new Array();
var hiddenMode 		= new Boolean();

// Fetch request for options array.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.fetch == "getOptionsArray") {
		
		optionsArray[0] = localStorage["run_background"]
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
		checkStorage();
		sendResponse({msg: "done"});
	}
});

/* function fetchLinks() {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {fetchLink: "getLinkArray"}, function(response) {
				localStorage["link_array"] = response.link;
				console.log("response.link recieved" + response.link);
			});
		});
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {fetchInfo: "getInfoArray"}, function(response) {
				localStorage["info_array"] = response.info;
				console.log("response.info recieved" + response.info);
			});
		});
	checkStorage();
} */

function checkStorage() {
	if (localStorage["link_array"] == undefined || localStorage["info_array"] == undefined) {
		setTimeout(checkStorage,200)
		//console.log("Checking localStorage");
	} else {
		downloadLinks();
	}
}

// Function for downloading the links.
function downloadLinks() {
		
		//console.log(localStorage["info_array"]);
		//console.log(localStorage["link_array"]);
		
	var linkarray 		= JSON.parse(localStorage["link_array"]);
	var infoarray 		= JSON.parse(localStorage["info_array"]);
	localStorage["link_array"] = undefined;
	localStorage["info_array"] = undefined;
	var imgURL 			= linkarray[1];
	var quant  			= infoarray[1];
	var quant2 			= parseInt(quant);
	var ext				= linkarray[quant2 + 1]
	var manganame		= infoarray[2];
	var series			= infoarray[3];
	var authorname		= infoarray[4];
	var language		= infoarray[5];
	var translator		= infoarray[6];
	var tags			= infoarray[7];
	var folderStructure = localStorage["folder_name"];
	var fileStructure	= JSON.parse(localStorage["file_structure"]);
	var fslen 			= fileStructure.length - 1;
	var filename		= "";

// Convert the folderStructure variable into the proper format	
		if (folderStructure == "manganame") {
			folderStructure = manganame;
		}
		if (folderStructure == "series") {
			folderStructure = series;
		}
		if (folderStructure == "authorname") {
			folderStructure = authorname;
		}
		if (folderStructure == "language") {
			folderStructure = language;
		}
		if (folderStructure == "translator") {
			folderStructure = translator;
		}
		if (folderStructure == "pagenumber") {
			folderStructure = pagenumber;
		}
		if (folderStructure == "tags") {
			folderStructure = tags;
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
		if (fileStructure[i] == "Manga Name") {
			fileStructure[i] = manganame;
		}
		if (fileStructure[i] == "Series Name") {
			fileStructure[i] = series;
		}
		if (fileStructure[i] == "Author Name") {
			fileStructure[i] = authorname;
		}
		if (fileStructure[i] == "Language") {
			fileStructure[i] = "(" + language + ")";
			languageCheck = true;
		}
		if (fileStructure[i] == "Translator") {
			fileStructure[i] = translator;
		}
		if (fileStructure[i] == "Page Number") {
			fileStructure[i] = "pagenumber";
		}
		if (fileStructure[i] == "Tags") {
			fileStructure[i] = tags;
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
	if (localStorage["hidden_mode"] == "true") {
		hiddenMode = true;
	} else {
		hiddenMode = false;
	}
		
// Triggers a download for each generated link.
	var copypasta2 = "";
	var downloadIds = new Array();
	for (var i = 1; i <= quant; i++) {
		var str = '' + i;
		while (str.length < 3) str = '0' + str;
		copypasta2 = linkarray[i];
			
		var filename2 = filename.replace("pagenumber", str);
		//console.log(folderStructure + "/" + filename2 + ext);
		//console.log(copypasta2);
			chrome.downloads.download({url: copypasta2, filename: folderStructure + "/" + filename2 + ext});

		if (i == quant) {
			localStorage["downloads_done"] = "true";
		}
	}
}

chrome.downloads.onChanged.addListener(function (downloadID) {
	if (downloadID.state) {
		if (downloadID.state.current == "complete") {
			chrome.downloads.search({id: downloadID.id}, function(result) {
				if (result[0].byExtensionName == "F! Downloader") {
					chrome.downloads.erase({id: downloadID.id})
					//console.log("Erased: " + downloadID.id);
				}
				//console.log(result);
			});
		}
	}
	//console.log(downloadID);
	//console.log(downloadID.id);
	//console.log(downloadID.state);
});
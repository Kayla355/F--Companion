// Listen for message to start gathering the info
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.msg == "grabInfo") {
		sendResponse({response: "grabInfoOK"});
		grabInfo();
		//console.log("Grabbing Info");
	}
});

var infoarray		= new Array();

// Function for grabbing manga information
function grabInfo(downloadurl, notifications, ndownload, nold, nseen, nshown, pend, reCache) {

	if (window.location.pathname.match(/.*\/read.*/)) {
		var currenturl 		= "http://api.fakku.net" + $('div#content div.chapter div.left a.a-series-title.manga-title').attr('href');
		//console.log("GrabInfo URL: " + currenturl);
	} else if (window.location.pathname.match(/\/DropdownNotes.html$/)) {
		//console.log("GrabInfo triggered from DropdownNotes");
		var currenturl 		= downloadurl.replace("www", "api");
	} else {
		var currenturl 		= "http://api.fakku.net" + $('div#container div.sub-navigation.with-breadcrumbs div.breadcrumbs a:last-child').attr('href');
		//console.log("GrabInfo URL: " + currenturl);
	}

	$.ajax({     
		type: "GET",		
		url: currenturl,
		dataType: "JSON",
		async: false,
		success: function(data) {
			var error;
			var errorMessage;
			var storedError;

			if (data.content == "") {
				error = true;
				$.ajax({     
					type: "GET",		
					url: currenturl.replace("api.", "www."),
					dataType: "html",
					async: false,
					success: function(html) { 
						errorMessage = $(html).find('div#error.message h3').text();
						console.log("error message added");
					},
					error: function(error) {
						storedError = error;
					}
				});
			}

			if (!error) {
				var manganame 	= data.content.content_name;
				var series		= data.content.content_series;				//Array
				var authorname 	= data.content.content_artists;				//Array
				var translator 	= data.content.content_translators;			//Array
				var language 	= data.content.content_language;
				var quant 		= data.content.content_pages;
				var description = data.content.content_description;
				var	tags	 	= data.content.content_tags;				//Array
				var imgCover 	= data.content.content_images.cover;
				var imgSample	= data.content.content_images.sample;
				var date 		= data.content.content_date;
			}
			
			// console.log("pages: " + quant);
			// console.log("name: " + manganame);
			// console.log("series: " + series);
			// console.log("author: " + authorname);
			// console.log("language: " + language);
			// console.log("translator: " + translator);
			// console.log("tags: " + tags);
			// console.log("description: " + description);
			// console.log("cover: " + imgCover);
			// console.log("sample: " + imgSample);
			
			infoarray[0] 	= "infoarray";
			infoarray[1] 	= quant;
			infoarray[2] 	= manganame;
			infoarray[3] 	= series;
			infoarray[4] 	= authorname;
			infoarray[5] 	= language;
			infoarray[6] 	= translator;
			infoarray[7] 	= tags;
			infoarray[8] 	= description;
			infoarray[9] 	= imgCover;
			infoarray[10] 	= imgSample;
			infoarray[11]	= date;

			if (error) {
				if (storedError) {
					errorHandling(downloadurl, notifications, ndownload, nold, nseen, nshown, pend, reCache, storedError);
					return;
				} else {
					infoarray[1] = "error";
					infoarray[2] = errorMessage;
					infoarray[3] = downloadurl;
				}
			}

			if (notifications) {
				notificationInfo(infoarray, downloadurl, nold, nseen, nshown, pend, reCache);
				//console.log("notifications Grabinfo triggered");
			} else {
				msgDocReadyInfo(ndownload);
				//console.log("Download Grabinfo triggered");
			}
						
		},
		error: function(error) {
			errorHandling(downloadurl, notifications, ndownload, nold, nseen, nshown, pend, reCache, error);
		}
	});
};

function errorHandling (downloadurl, notifications, ndownload, nold, nseen, nshown, pend, reCache, error) {
	if (!notifications) {
		msgError(error);
		//console.log("Error: " + error);
	}
	if (error.status == "410") {
		var note = JSON.parse(localStorage[downloadurl.replace("http://www.fakku.net", "") + "--note"]);
		note[0] = "old"
		localStorage[downloadurl.replace("http://www.fakku.net", "") + "--note"] = JSON.stringify(note);
	}
	if (notifications) {
		infoarray[0] = "infoarray"
		infoarray[1] = "error";
		infoarray[2] = error.status;
		infoarray[3] = downloadurl;
		infoarray[4] = error.statusText;
		notificationInfo(infoarray, downloadurl, nold, nseen, nshown, pend, reCache);
	}
}

// Sends a message stating that the link information have been grabbed properly.
function msgDocReadyInfo(ndownload) {
		chrome.runtime.sendMessage({msg: "docReadyInfo", data: infoarray});
		if (ndownload) {
			nDocReadyInfo(infoarray);
		}
}
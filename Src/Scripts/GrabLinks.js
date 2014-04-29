// Listen for message to start gathering the links
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.msg == "grabLinks") {
		sendResponse({response: "grabLinksOK"});
		grabLinks();
		//console.log("Grabbing Links");
	}
});

var linkarray 		= new Array();

// Function for grabbing links
function grabLinks(downloadurl) {

	if (window.location.pathname.match(/.*\/read.*/)) {
		var currenturl = "http://www.fakku.net" + $('div#content div.chapter div.left a.a-series-title.manga-title').attr('href') + "/read";
		//console.log("GrabLinks URL: " + currenturl);
	} else if (window.location.pathname.match(/\/DropdownNotes.html$/)) {
		//console.log("GrabLinks triggered from DropdownNotes");
		var currenturl = downloadurl + "/read";
	} else {
		var currenturl = "http://www.fakku.net" + $('div#container div.sub-navigation.with-breadcrumbs div.breadcrumbs a:last-child').attr('href') + "/read";
		//console.log("GrabLinks URL: " + currenturl);
	}

	$.ajax({     
		type: "GET",
		url: currenturl,
		dataType: "html",
		async: false,
		success: function(html) {
		//console.log("GrabLinks Success");
			var ext 	= html.match(/http:\/\/t.fakku.net\/.*\/images\/.*/).toString().slice(-6).slice(0, -2);
			var imgURL 	= html.match(/http:\/\/t.fakku.net\/.*\/images\//) + "001" + ext;

			var quant = JSON.parse(html.match(/window\.params\.thumbs = \[.*\];/).toString().replace("window.params.thumbs = ", "").replace(";","")).length;
			

			quant2 = parseInt(quant, 10) + 1;
			linkarray[0] = "linkarray";
			linkarray[quant2] = ext;
			for (var i = 1; i <= quant; i++) {
				var str = '' + i;
				while (str.length < 3) str = '0' + str;
				var copypasta = ((imgURL.replace("001", str)));
				linkarray[i] = copypasta;

			}

			msgDocReadyLink();
		},
		error: function(error) {
			msgError(error);
			//console.log("Error!");
		}
	});
};

// Sends a message stating that the links have been grabbed properly.
function msgDocReadyLink() {
	chrome.runtime.sendMessage({msg: "docReadyLink", data: linkarray}, function(response) {
	//console.log("Message Sent: DocReadyLink");
	});
	nDocReadyLink(linkarray);
}

// Sends a message stating that there was an error when grabbing the links.
// This is used by GrabInfo as well.
function msgError(error) {
	chrome.runtime.sendMessage({msg: "Error", errorMessage: error}, function(response) {
	//console.log("Message Sent: Error");
	});
}
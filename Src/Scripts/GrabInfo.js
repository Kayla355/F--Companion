// Temporary solution to excludes not working properly
// Consider making this dynamic instead (Grabbing part of the url and putting it in a variable)
// ManageLinks.js and GrabLinks.js have different includes and excludes!!!!
if (window.location.pathname.match(/\/.*\/favorites$/) || window.location.pathname.match(/\/.*\/favorites\/.*/) || window.location.pathname.match(/\/.*\/english$/) || window.location.pathname.match(/\/.*\/english\/.*/) || window.location.pathname.match(/\/.*\/japanese$/) || window.location.pathname.match(/\/.*\/japanese\/.*/) || window.location.pathname.match(/\/.*\/artists$/) || window.location.pathname.match(/\/.*\/artists\/.*/) || window.location.pathname.match(/\/.*\/translators$/) || window.location.pathname.match(/\/.*\/translators\/.*/) || window.location.pathname.match(/\/.*\/series$/) || window.location.pathname.match(/\/.*\/series\/.*/) || window.location.pathname.match(/\/.*\/newest$/) || window.location.pathname.match(/\/.*\/newest\/.*/) || window.location.pathname.match(/\/.*\/popular$/) || window.location.pathname.match(/\/.*\/popular\/.*/) || window.location.pathname.match(/\/.*\/downloads$/) || window.location.pathname.match(/\/.*\/downloads\/.*/) || window.location.pathname.match(/\/.*\/controversial$/) || window.location.pathname.match(/\/.*\/controversial\/.*/) || window.location.pathname.match(/\/.*\/tags\/.*/)  ) {
	} else {
	
// Getting Options Array from Background Page
chrome.runtime.sendMessage({fetch: "getOptionsArray"}, function(response) {
	var options_array = JSON.parse(response.data);
	localStorage["run_background"] = options_array[0];
});
	
if (localStorage["run_background"] == "true") {
	$(document).ready(grabInfo);

	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		if (request.msg == "grabInfo" && docReadyInfo) {
			sendResponse({response: "grabInfoOK"});
			msgDocReadyInfo();
			//console.log("Grabbing Info");
		}
	});
} else {
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		if (request.msg == "grabInfo") {
			sendResponse({response: "grabInfoOK"});
			grabInfo();
			//console.log("Grabbing Info");
		}
	});
}


var docReadyInfo = false;

function grabInfo() {

	if (window.location.pathname.match(/.*\/read$/)) {
		var str = "http://www.fakku.net" + window.location.pathname;
		var currenturl = str.slice(0, -5)
	}
	if (window.location.pathname.match(/.*\/related$/)) {
		var str = "http://www.fakku.net" + window.location.pathname;
		var currenturl = str.slice(0, -8);
	}
	if (window.location.pathname.match(/.*\/download$/)) {
		var str = "http://www.fakku.net" + window.location.pathname;
		var currenturl = str.slice(0, -9);
	}
	if (!window.location.pathname.match(/.*\/read.*/) && !window.location.pathname.match(/.*\/related$/) && !window.location.pathname.match(/.*\/download$/)) {
		var currenturl = "http://www.fakku.net" + window.location.pathname;
	}
	
    $.ajax({     
        type: "GET",		
        url: currenturl,
        dataType: "html",
        async: false,
        success: function(html) {
			//console.log("Grab Info Success");

			var infoarray	= new Array();
			var quant 		= $(html).find('div#right div.wrap div.row.small div.left b').text();
			var manganame 	= $(html).find('div#right div.wrap div.content-name h1').text();
			var series		= $(html).find('div#right div.wrap div:nth-child(2) div.left:first-child').text().slice(8, -1);
			var authorname 	= $(html).find('div#right div.wrap div:nth-child(3) div.left:first-child').text().slice(8);
			var language 	= $(html).find('div#right div.wrap div:nth-child(2) div.right span a').text();
			var translator 	= $(html).find('div#right div.wrap div:nth-child(3) div.right span:first-child').text().slice(13, -1);
			var tags	 	= $(html).find('div#right div.wrap div:nth-child(7)').text().slice(7, -1);
			//console.log("pages: " + quant);
			//console.log("name: " + manganame);
			//console.log("series: " + series);
			//console.log("author: " + authorname);
			//console.log("language: " + language);
			//console.log("translator: " + translator);
			//console.log("tags: " + tags);	
			localStorage["quant_pages"] = quant;
			
						infoarray[0] = "infoarray";
						infoarray[1] = quant;
						infoarray[2] = manganame;
						infoarray[3] = series;
						infoarray[4] = authorname;
						infoarray[5] = language;
						infoarray[6] = translator;
						infoarray[7] = tags;
						localStorage["info_array"] = JSON.stringify(infoarray);
						
						if (localStorage["run_background"] == "true") {
							docReadyInfo = true;
						} else {
							msgDocReadyInfo();
						}
						
        },
        error: function(error) {
        	msgError(error);
        	//console.log("Error!!");
        }
   });
};
	// Sends a message stating that the link information have been grabbed properly.
	function msgDocReadyInfo() {
			chrome.runtime.sendMessage({msg: "docReadyInfo"}, function(response) {
			//console.log("Message Sent: DocReadyInfo");
			});
	}
}
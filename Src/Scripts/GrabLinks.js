// Temporary solution to excludes not working properly
// Consider making this dynamic instead (Grabbing part of the url and putting it in a variable)
// ManageLinks.js and GrabLinks.js have different includes and excludes!!!!
if (window.location.pathname.match(/\/.*\/favorites$/) || window.location.pathname.match(/\/.*\/favorites\/.*/) || window.location.pathname.match(/\/.*\/english$/) || window.location.pathname.match(/\/.*\/english\/.*/) || window.location.pathname.match(/\/.*\/japanese$/) || window.location.pathname.match(/\/.*\/japanese\/.*/) || window.location.pathname.match(/\/.*\/artists$/) || window.location.pathname.match(/\/.*\/artists\/.*/) || window.location.pathname.match(/\/.*\/translators$/) || window.location.pathname.match(/\/.*\/translators\/.*/) || window.location.pathname.match(/\/.*\/series$/) || window.location.pathname.match(/\/.*\/series\/.*/) || window.location.pathname.match(/\/.*\/newest$/) || window.location.pathname.match(/\/.*\/newest\/.*/) || window.location.pathname.match(/\/.*\/popular$/) || window.location.pathname.match(/\/.*\/popular\/.*/) || window.location.pathname.match(/\/.*\/downloads$/) || window.location.pathname.match(/\/.*\/downloads\/.*/) || window.location.pathname.match(/\/.*\/controversial$/) || window.location.pathname.match(/\/.*\/controversial\/.*/) || window.location.pathname.match(/\/.*\/tags\/.*/)  ) {
	} else {


// Getting Options Array from Background Page
chrome.runtime.sendMessage({fetch: "getOptionsArray"}, function(response) {
	var options_array = JSON.parse(response.data);
	runBackground = options_array[0];
});

if (runBackground == "true") {
	$(document).ready(grabLinks);
	
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		if (request.msg == "grabLinks" && docReadyLink) {
			sendResponse({response: "grabLinksOK"});
			msgDocReadyLink();
			//console.log("Grabbing Links");
		}
	});
} else {
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		if (request.msg == "grabLinks") {
			sendResponse({response: "grabLinksOK"});
			grabLinks();
			//console.log("Grabbing Links");
		}
	});
}

var linkarray 		= new Array();
var infoarray 		= new Array();
var runBackground 	= new Array();
var docReadyLink 	= false;

// Function for grabbing links
function grabLinks() {

/*
	// Old function not necessary anymore
	// ----------------
	if (window.location.pathname.match(/.*\/read$/)) {
		var currenturl = "http://www.fakku.net" + window.location.pathname;
	}
	if (window.location.pathname.match(/.*\/related$/)) {
		var str = "http://www.fakku.net" + window.location.pathname;
		var currenturl = str.slice(0, -8) + "/read";
	}
	if (window.location.pathname.match(/.*\/download$/)) {
		var str = "http://www.fakku.net" + window.location.pathname;
		var currenturl = str.slice(0, -9) + "/read"
	}
	if (!window.location.pathname.match(/.*\/read$/) && !window.location.pathname.match(/.*\/related$/) && !window.location.pathname.match(/.*\/download$/)) {
		var currenturl = "http://www.fakku.net" + window.location.pathname + "/read";
	}
*/
	if (window.location.pathname.match(/.*\/read$/)) {
		var currenturl = "http://www.fakku.net" + $('div#content div.chapter div.left a.a-series-title.manga-title').attr('href') + "/read";
		//console.log("GrabLinks URL: " + currenturl);
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
			var ext = html.match(/http:\/\/t.fakku.net\/.*\/images\/.*/).toString().slice(-6).slice(0, -2);
            var imgURL = html.match(/http:\/\/t.fakku.net\/.*\/images\//) + "001" + ext;
			

				if (window.location.pathname.match(/.*\/read.*/)) {
					var quant = $('select.drop option:last-child').val();
				} else {
					var quant = $('div#right div.wrap div.row.small div.left b').text();
				}


			quant2 = parseInt(quant, 10) + 1;
			linkarray[0] = "linkarray";
			linkarray[quant2] = ext;
            for (var i = 1; i <= quant; i++) {
                var str = '' + i;
                while (str.length < 3) str = '0' + str;
                var copypasta = ((imgURL.replace("001", str)));
				linkarray[i] = copypasta;
				
				if (i == quant) {
					if (runBackground == "true") {
						docReadyLink = true;
					} else {
						msgDocReadyLink();
					}
				}
            }
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
	}

	// Sends a message stating that there was an error when grabbing the links.
	// This is used by GrabInfo as well.
	function msgError(error) {
		chrome.runtime.sendMessage({msg: "Error", errorMessage: error}, function(response) {
		//console.log("Message Sent: Error");
		});
	}
}
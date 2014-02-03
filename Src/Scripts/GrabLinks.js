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

var linkarray = new Array();
var docReadyLink = false;
// Function for grabbing links
function grabLinks() {

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
	
    $.ajax({     
        type: "GET",		
        url: currenturl,
        dataType: "html",
        async: false,
        success: function(html) {
		//console.log("GrabLinks Success");
			var extfull = html.match(/http:\/\/t.fakku.net\/.*\/images\/.*/);
			var extstr = extfull.toString();
			var extslice = extstr.slice(-6);
			var ext = extslice.slice(0, -2);
			
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
					if (localStorage["run_background"] == "true") {
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

	//localStorage["link_array"] = JSON.stringify(linkarray);
	// Change this to a long lived connection for both info_array and link_array
	chrome.runtime.onConnect.addListener(function(port) {
		console.assert(port.name == "getArray");
		port.onMessage.addListener(function(msg) {
			if (msg.fetch == "linkArray")  {
				var link_array = JSON.stringify(linkarray);
				port.postMessage({link: link_array});
			}
			if (msg.fetch == "infoArray") {
				var info_array = localStorage["info_array"];
				port.postMessage({link: info_array});
			}
		});
	});
	// Sends a message stating that the links have been grabbed properly.
	function msgDocReadyLink() {
		chrome.runtime.sendMessage({msg: "docReadyLink"}, function(response) {
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
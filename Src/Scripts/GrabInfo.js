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
function grabInfo(downloadurl, notifications, nold, nseen) {

	if (window.location.pathname.match(/.*\/read.*/)) {
		var currenturl 		= "http://www.fakku.net" + $('div#content div.chapter div.left a.a-series-title.manga-title').attr('href');
		//console.log("GrabInfo URL: " + currenturl);
	} else if (window.location.pathname.match(/\/DropdownNotes.html$/)) {
		//console.log("GrabInfo triggered from DropdownNotes");
		var currenturl 		= downloadurl;
	} else {
		var currenturl 		= "http://www.fakku.net" + $('div#container div.sub-navigation.with-breadcrumbs div.breadcrumbs a:last-child').attr('href');
		//console.log("GrabInfo URL: " + currenturl);
	}

	$.ajax({     
		type: "GET",		
		url: currenturl,
		dataType: "html",
		async: false,
		success: function(html) {
			//console.log("Grab Info Success");
			//console.log(currenturl);

			var quant 		= $(html).find('div#right div.wrap div.row.small div.left b').text();
			var manganame 	= $(html).find('div#right div.wrap div.content-name h1').text();
			var series		= $(html).find('div#right div.wrap div:nth-child(2) div.left:first-child').text().slice(8, -1);
			var authorname 	= $(html).find('div#right div.wrap div:nth-child(3) div.left:first-child').text().slice(8);
			var language 	= $(html).find('div#right div.wrap div:nth-child(2) div.right span a').text();
			var translator 	= $(html).find('div#right div.wrap div:nth-child(3) div.right span:first-child').text().slice(13, -1);
			var tags	 	= $(html).find('div#right div.wrap div:nth-child(7)').text().slice(7, -1);
			var description = $(html).find('div#right div.wrap div:nth-child(6)').text().slice(14, -1);
			var imgCover 	= $(html).find('div#left div.wrap div.images a img.cover').attr('src');
			var imgSample	= $(html).find('div#left div.wrap div.images a img.sample').attr('src');
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

			if (notifications) {
				notificationInfo(infoarray, downloadurl, nold, nseen);
				//console.log("notifications Grabinfo triggered");
			} else {
				msgDocReadyInfo();
				//console.log("Download Grabinfo triggered");
			}
						
		},
		error: function(error) {
			if (!notifications) {
				msgError(error);
				//console.log("Error!!");
			}
			if (error.status == "410") {
				if (nseen == "new") {
					var note = JSON.parse(localStorage[downloadurl.replace("http://www.fakku.net", "") + "--note"]);
					note[0] = "old"
					localStorage[downloadurl.replace("http://www.fakku.net", "") + "--note"] = JSON.stringify(note);
				}
			}
		}
	});
};

// Sends a message stating that the link information have been grabbed properly.
function msgDocReadyInfo() {
		chrome.runtime.sendMessage({msg: "docReadyInfo", data: infoarray}, function(response) {
		//console.log("Message Sent: DocReadyInfo");
		});
		nDocReadyInfo(infoarray);
}
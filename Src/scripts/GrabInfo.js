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
		  // Fix for some issues when the domain is not included in the src link.
			html.match(/.*src="\/.*">/g).forEach(function(m) {
				mSecond = m.replace(/src="\//, 'http:\/\/www\.fakku\.net\/')
				html = html.replace(m, mSecond);
			});

			//console.log("Grab Info Success");
			//console.log(currenturl);

			var qQuant
			var qSeries
			var qAuthorname
			var qLanguage
			var qTranslator
			var qDesc

			for (var i = 2; i <= 9; i++) {
				switch ($(html).find('div#right div.wrap div:nth-child('+ i +') div.left').text()) {
					case "Series":
						qSeries 	= 'div#right div.wrap div:nth-child('+ i +') div.right';
						break;
					case "Artist":
						qAuthorname = 'div#right div.wrap div:nth-child('+ i +') div.right';
						break;
					case "Translator":
						qTranslator = 'div#right div.wrap div:nth-child('+ i +') div.right';
						break;
					case "Language":
						qLanguage 	= 'div#right div.wrap div:nth-child('+ i +') div.right';
						break;
					case "Pages":
						qQuant 		= 'div#right div.wrap div:nth-child('+ i +') div.right';
						break;
					case "Description":
						qDesc 	= 'div#right div.wrap div:nth-child('+ i +') div.right';
						break;
				}
			}

			var error 		= $(html).find('div#error.message h3').text();
			var manganame 	= $(html).find('div#right div.wrap div.content-name h1').text();

			var series		= $(html).find(qSeries).text();
			var authorname 	= $(html).find(qAuthorname).text();
			var translator 	= $(html).find(qTranslator).text();
			var language 	= $(html).find(qLanguage).text();
			var quant 		= $(html).find(qQuant).text().replace(" pages", "");
			var description = $(html).find(qDesc).html();
			var tags	 	= $(html).find('div#right div.wrap div:last-child div.right').text().slice(0, -2).replace(/ /g, ", ");

			var imgCover 	= $(html).find('div#left div.wrap div.images a img.cover').attr('src');

			if (imgCover) {
			  // Calculate new random page to show as sample
				var imgSample	= imgCover.replace(/\/\d\d\d\./, function(n) {
					var quantMax = Math.floor(quant - quant / 2 / 2)
					var quantMin = quant - quantMax;
					var quantMul;

					if (quant <= 9) {
						quantMul = 10;
					} else if (quant <= 99) {
						quantMul = 100;
					} else if (quant <= 999) {
						quantMul = 1000;
					} else if (quant <= 9999) {
						quantMul = 10000;
					}

					do {
						n = Math.round((Math.random() * quantMul / Math.round(quant / 10)));
					} while (n < 4 || n < quantMin || n > quantMax);

					if (n.toString().length < 3) {
						n = "0" + n;
						if (n.toString().length <= 2) {
							n = "0" + n;
						}
					}
					n = "/" + n + ".";
					return n;
				});
			}

			//if (description) { description = description.replace("<b>Description:</b>", "") };
			
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

			if (error) {
				infoarray[1] = "error";
				infoarray[2] = error;
				infoarray[3] = downloadurl;
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
			if (!notifications) {
				msgError(error);
				//console.log("Error: " + error);
			}
			if (error.status == "410") {
				if (nseen == "new") {
					var note = JSON.parse(localStorage[downloadurl.replace("http://www.fakku.net", "") + "--note"]);
					note[0] = "old"
					localStorage[downloadurl.replace("http://www.fakku.net", "") + "--note"] = JSON.stringify(note);
				}
			}
			if (notifications) {
				infoarray[1] = "error";
				infoarray[2] = error.status;
				infoarray[3] = downloadurl;
				notificationInfo(infoarray, downloadurl);
			}
		}
	});
};

// Sends a message stating that the link information have been grabbed properly.
function msgDocReadyInfo(ndownload) {
		chrome.runtime.sendMessage({msg: "docReadyInfo", data: infoarray}, function(response) {
		//console.log("Message Sent: DocReadyInfo");
		});
		if (ndownload) {
			nDocReadyInfo(infoarray);
		}
}
// Listen for message to start gathering the info
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.msg == "grabInfo-fakku") {
		fakku.getInfo({from: "grabber"});
		//console.log("Grabbing Info");
	}
	if (request.msg == "grabLinks-fakku") {
		fakku.getLinks({from: "grabber"});
		//console.log("Grabbing Links");
	}
	if (request.msg == "grabInfo-pururin") {
		pururin.getInfo({from: "grabber"});
		//console.log("Grabbing Links");
	}
	if (request.msg == "grabLinks-pururin") {
		pururin.getLinks({from: "grabber"});
		//console.log("Grabbing Links");
	}
	sendResponse({response: "grabLinksOK"});
});

var linkarray   = [];
var infoarray = [];
var currenturl = "";
var notes;

function getAjaxData(href, type) {
	return $.ajax({
		type: "GET",
		url: href,
		dataType: type,
		error: function(error) {
			console.error(error);
			//errorHandling(error);
		}
	});
}

// Grabber for Fakku
var fakku = {
	getInfo: function(object) {
		infoarray = [];

		// Change this to "window.location.host+window.url"?
		if (window.location.pathname.match(/.*\/read.*/)) {
			currenturl = "https://api.fakku.net" + $('a.a-series-title.manga-title').attr('href');
			//console.log("GrabInfo URL: " + currenturl);
		} else if (window.location.pathname.match(/\/DropdownNotes.html$/)) {
			//console.log("GrabInfo triggered from DropdownNotes");
			currenturl = object.href.replace("www", "api");
		} else {
			currenturl = "https://api.fakku.net" + $('div#container div.sub-navigation.with-breadcrumbs div.breadcrumbs a:last-child').attr('href');
			//console.log("GrabInfo URL: " + currenturl);
		}

		getAjaxData(currenturl, "JSON").then(function(data) {
			var error;
			var errorMessage;
			var storedError;

			var manganame 	= "";
			var series		= [];
			var authorname 	= [];
			var translator 	= [];
			var language 	= "";
			var quant 		= 0;
			var description = "";
			var	tags	 	= [];
			var imgCover 	= "";
			var imgSample	= "";
			var date 		= 0;
			var type 		= "";
			var fakkubook 	= false;

			debug = data.content;
			
			try { 
				notes = JSON.parse(localStorage["notes"]);
			} catch(e) {
				notes = {};
			}

			if (data.content == "" || $.isEmptyObject(data.content)) {
				error = true;
				getAjaxData(currenturl.replace("api.", "www."), "HTML").then(function(html) {
					errorMessage = $(html).find('div#error.message h3').text();
					
					if(errorMessage == "") {
						errorMessage = "Unknown Error!";
					}
				});
			}

			if (!error) {
				try {
					manganame 	= data.content.content_name;
					series		= data.content.content_series;				//Array
					authorname 	= data.content.content_artists;				//Array
					translator 	= data.content.content_translators;			//Array
					language 	= data.content.content_language;
					quant 		= data.content.content_pages;
					description = data.content.content_description;
					tags	 	= data.content.content_tags;				//Array
					try { 
						imgCover 	= data.content.content_images.cover;
						imgSample	= data.content.content_images.sample;
					} catch(e) {
						console.error(e);
					}
					date 		= data.content.content_date;
					type 		= data.content.content_category;
					
					if(data.content.content_publishers) {
						fakkubook = true;
					}
				} catch(e) {
					console.log(e);
				}

			  // Check if http:// or https:// is included in the link. Newer links don't have them included while older ones do.
				if (!imgCover.match(/http/) && imgCover != "") {
					imgCover = "https:" + imgCover;
					imgSample = "https:" + imgSample;
				}

			  // Create note object and update localStorage
				try {
					notes['['+type+'] '+manganame].data = {};
				} catch(e) {
					notes['['+type+'] '+manganame] = {
						info: {},
						data: {}
					};
				}

				notes['['+type+'] '+manganame].data = {
					name: 			manganame,
					series: 		series,
					author: 		authorname,
					translator: 	translator,
					language: 		language,
					pages: 			quant,
					description: 	description,
					tags: 			tags,
					date: 			date,
					fakkubook: 		fakkubook,
					images: {
						cover: 		imgCover,
						sample: 	imgSample
					}
				};
				//console.log(notes);
				//localStorage["notes"] = JSON.stringify(notes);
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
			infoarray[12]	= fakkubook;

			if (error) {
				if (storedError) {
					errorHandling(object, storedError);
					return;
				} else {
					infoarray[1] = "error";
					infoarray[2] = "411";
					infoarray[4] = errorMessage;
					infoarray[3] = object.href;

					notes['['+type+'] '+manganame] = {
						error: {
							msg: errorMessage,
							error: "411",
							href: object.href
						}
					};

					if(errorMessage == "Unknown Error!") {
						infoarray[2] = "0";
						notes['['+type+'] '+manganame].error.error = "0";
					}
				}
			}

			if (object.from === "notes") {
				//console.log("notifications Grabinfo triggered");
				object.infodata = infoarray;
				grab_notes[object.name].status = "done";
				notificationInfo(object, notes);
			} else {
				//console.log("Download Grabinfo triggered");
				sendReadyMessage("docReadyInfo", infoarray)
				if(object.from === "download") {
					checkDownloadReady();
				}
			}
		});
	},
	getLinks: function(object) {
		linkarray   = [];

		if (window.location.pathname.match(/.*\/read.*/)) {
			currenturl = "https://api.fakku.net" + $('a.a-series-title.manga-title').attr('href') + "/read";
			//console.log("GrabLinks URL: " + currenturl);
		} else if (window.location.pathname.match(/\/DropdownNotes.html$/)) {
			//console.log("GrabLinks triggered from DropdownNotes");
			currenturl = object.href.replace("www", "api") + "/read";
		} else {
			currenturl = "https://api.fakku.net" + $('div#container div.sub-navigation.with-breadcrumbs div.breadcrumbs a:last-child').attr('href') + "/read";
			//console.log("GrabLinks URL: " + currenturl);
		}

		getAjaxData(currenturl, "JSON").then(function(data) {
			if (data.content != "" || !$.isEmptyObject(data.content)) {
				linkarray = ["linkarray"];
				$.each(data.pages, function(i, data) {
					linkarray.push(data.image);
				});
				linkarray.push(linkarray[1].match(/t.fakku.net\/.*\/images\/.*/).toString().slice(-4)); // File Extension
				sendReadyMessage("docReadyLink", linkarray)
				if(object.from === "download") {
					checkDownloadReady();
				}
			} else  {
				this.error({status: 0, statusText: "Query returned empty."});
			}
		});
	}
}

// Grabber for Pururin
var pururin = {
	getInfo: function(object) {
		infoArray = [];
		infoObject = {};

		if (window.location.pathname.match(/.*\/(view|thumbs).*/)) {
			currenturl = $(".header-breadcrumbs span:nth-last-child(2) a").prop("href");
			//console.log("GrabLinks URL: " + currenturl);
		} else if (window.location.pathname.match(/\/DropdownNotes.html$/)) {
			//console.log("GrabLinks triggered from DropdownNotes");
			currenturl = object.href.replace("www", "api") + "/read";
		} else {
			currenturl = window.location.href;
			//console.log("GrabLinks URL: " + currenturl);
		}

		getAjaxData(currenturl, "html").then(function(html) {

			var manganame 	= "";
			var series		= [];
			var authorname 	= [];
			var translator 	= [];
			var language 	= "";
			var quant 		= 0;
			var description = "";
			var	tags	 	= [];
			var imgCover 	= "";
			var imgSample	= "";
			var date 		= 0;
			var type 		= "";
			var fakkubook 	= false;


			try {
				manganame = $(html).find("h1.otitle").text().match(/(.*)( \/.*)/)[1];
			} catch(e) {
				manganame = $(html).find("h1.otitle").text();
			}
			description = "Empty for now, might add this function later.";

			$(html).find("tr").each(function(i, row) {

				var field = $(row).find("td:first-child").text();
				var values = [];

				var rMapped = /\b(parody|circle|character|artist|language|scanlator|page|tag)\b/gi;
				var eMapped = {
					"parody": "parodies",
					"circle": "circles",
					"character": "characters",
					"artist": "artists",
					"language": "languages",
					"scanlator": "scanlators",
					"page": "pages",
					"tag": "tags",
				};

			  // Return the mapped value.
			  	field = field.toLowerCase().replace(rMapped, function(matched) {
					return eMapped[matched];
				});

				if($(row).find("td:last-child ul").length !== 0) {
					$(row).find("td:last-child ul").children().each(function(i, li) {
						values.push($(li).text());
					});
				} else {
					values.push($(row).find("td:last-child").text());
				}

				infoObject[field] = values;
			});

// Add check for names that are generated because sometimes they are listed as singular.
// Series, author, translator, tags are arrays
			infoarray[0] 	= "infoarray";
			infoarray[1] 	= infoObject.pages[0].match(/(.*)(\ \(.*\))/)[1];
			infoarray[2] 	= manganame;
			infoarray[3] 	= infoObject.parodies;
			infoarray[4] 	= infoObject.artists;
			infoarray[5] 	= infoObject.languages[0];
			infoarray[6] 	= infoObject.scanlators;
			infoarray[7] 	= infoObject.contents;
			infoarray[8] 	= description;
			infoarray[9] 	= imgCover; // Fix
			infoarray[10] 	= imgSample; // Fix
			infoarray[11]	= date; // fix
			infoarray[12]	= false;

			//console.log(infoObject);

			if (object.from === "notes") {
				//console.log("notifications Grabinfo triggered");
				object.infodata = infoarray;
				grab_notes[object.name].status = "done";
				notificationInfo(object, notes);
			} else {
				//console.log("Download Grabinfo triggered");
				sendReadyMessage("docReadyInfo", infoarray)
				if(object.from === "download") {
					checkDownloadReady();
				}
			}
		});
	},
	getLinks: function(object) {
		linkarray   = [];

		if (window.location.pathname.match(/.*\/(gallery|thumbs).*/)) {
			currenturl = $('div.content ul.thumblist li:first-child a').prop("href");
			//console.log("GrabLinks URL: " + currenturl);
		} else if (window.location.pathname.match(/\/DropdownNotes.html$/)) {
			//console.log("GrabLinks triggered from DropdownNotes");
			currenturl = object.href.replace("www", "api") + "/read";
		} else {
			currenturl = window.location.href;
			//console.log("GrabLinks URL: " + currenturl);
		}

		getAjaxData(currenturl, "html").then(function(html) {
			var manga = JSON.parse($(html).find("script:last-child").text().match(/{.*}/));

			if (manga != "" || !$.isEmptyObject(manga)) {
				linkarray = ["linkarray"];
				$.each(manga.images, function(i, data) {
					var link = "http://pururin.com/f/"+ data.f.slice(0, -4) +"/"+ manga.slug +"-"+ (parseInt(data.i)+1) + data.f.slice(-4);
					linkarray.push(link);
				});
				linkarray.push(manga.images[0].f.slice(-4)); // File Extension
				sendReadyMessage("docReadyLink", linkarray)
				if(object.from === "download") {
					checkDownloadReady();
				}
			} else  {
				this.error({status: 0, statusText: "Query returned empty."});
			}
		});
	}
}


function checkDownloadReady() {
	if(linkarray.length !== 0 && infoarray.length !== 0) {
		startDownload();
	}
}

// Function for dealing with errors
// FIX ERRORHANDLING //
function errorHandling (error) {
	if (object.from !== "notes") {
		msgError(error);
		//console.log("Error: " + error);
	}
	if (error.status == "410") {
		var note = JSON.parse(localStorage[downloadurl.replace("https://www.fakku.net", "") + "--note"]);
		note[0] = "old";
		localStorage[downloadurl.replace("https://www.fakku.net", "") + "--note"] = JSON.stringify(note);
	}
	if (object.from === "notes" && error.status != 0) {
		infoarray[0] = "infoarray";
		infoarray[1] = "error";
		infoarray[2] = error.status;
		infoarray[3] = downloadurl;
		infoarray[4] = error.statusText;
		notificationInfo(infoarray, downloadurl, nold, nseen, nshown, pend, reCache, loadmore, noteName, from);
	}
}

function sendReadyMessage(message, dataArray) {
	chrome.runtime.sendMessage({msg: message, data: dataArray});
}

// Sends a message stating that there was an error when grabbing the links.
// This is used by GrabInfo as well.
function msgError(error) {
	chrome.runtime.sendMessage({msg: "Error", errorMessage: error});
}
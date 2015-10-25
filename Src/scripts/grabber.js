// Listen for message to start gathering the info
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

	switch(request.msg) {
		case "grabInfo-fakku":
			fakku.getInfo({from: "grabber"});
		break;
		case "grabLinks-fakku":
			fakku.getLinks({from: "grabber"});
		break;
		case "grabInfo-pururin":
			pururin.getInfo({from: "grabber"});
		break;
		case "grabLinks-pururin":
			pururin.getLinks({from: "grabber"});
		break;
		case "grabInfo-nhentai":
			nhentai.getInfo({from: "grabber"});
		break;
		case "grabLinks-nhentai":
			nhentai.getLinks({from: "grabber"});
		break;
	}
	//console.log("Grabbing Info");
	sendResponse({response: "grabLinksOK"});
});

var linkarray   = [];
var infoarray = [];
var notes;
var grabber = {};

function getAjaxData(href, type) {
	return $.ajax({
		type: "GET",
		url: href,
		dataType: type,
		error: function(error) {

			console.error(error);
			if(error.status !== 403) {
				errorHandling(error);
			}
		}
	});
}

// Grabber for Fakku
var fakku = {
	getURL: function(from, object) {
		var currenturl;
		grabber = object;

		if(from === "info") {
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
		} else if(from === "links") {
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
		} else if(from === "links non-api") {
			if (window.location.pathname.match(/.*\/read.*/)) {
				currenturl = "https://www.fakku.net" + $('a.a-series-title.manga-title').attr('href') + "/read";
				//console.log("GrabLinks URL: " + currenturl);
			} else if (window.location.pathname.match(/\/DropdownNotes.html$/)) {
				//console.log("GrabLinks triggered from DropdownNotes");
				currenturl = object.href + "/read";
			} else {
				currenturl = "https://www.fakku.net" + $('div#container div.sub-navigation.with-breadcrumbs div.breadcrumbs a:last-child').attr('href') + "/read";
				//console.log("GrabLinks URL: " + currenturl);
			}
		}
		
		return currenturl;
	},
	getInfo: function(object) {
		infoarray = [];

		var currenturl = this.getURL("info", object);

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

			if (data.content === "" || $.isEmptyObject(data.content)) {
				error = true;
				getAjaxData(currenturl.replace("api.", "www."), "HTML").then(function(html) {
					errorMessage = $(html).find('div#error.message h3').text();
					
					if(errorMessage === "") {
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
				if (!imgCover.match(/http/) && imgCover !== "") {
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
					errorHandling(storedError, object);
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
				sendReadyMessage("docReadyInfo", infoarray);
				if(object.from === "download") {
					checkDownloadReady();
				}
			}
		});
	},
	getLinks: function(object) {
		linkarray   = [];
		var that 	= this;

		var currenturl 	= this.getURL("links", object);

		getAjaxData(currenturl, "JSON").then(function(data) {
			if (data.pages == "" || $.isEmptyObject(data.pages) || data.pages == undefined) {
				linkarray = ["linkarray"];
				$.each(data.pages, function(i, data) {
					linkarray.push(data.image);
				});

				linkarray.push(linkarray[1].match(/t.fakku.net\/.*\/images\/.*/).toString().slice(-4)); // File Extension
				sendReadyMessage("docReadyLink", linkarray);
				if(object.from === "download") {
					checkDownloadReady();
				}
			} else  {
				try {
					currenturl = that.getURL("links non-api", object);
					getAjaxData(currenturl, "html").then(function(html) {
						linkarray = ["linkarray"];
						thumbArray = JSON.parse($(html).text().match(/(window\.params\.thumbs \= )(.*);/)[2]);

						thumbArray.forEach(function(img) {
							var image = "https:" + img.replace("thumbs", "images").replace(".thumb", "");
							linkarray.push(image);
						})

						linkarray.push(linkarray[1].match(/t.fakku.net\/.*\/images\/.*/).toString().slice(-4)); // File Extension
						sendReadyMessage("docReadyLink", linkarray);
						if(object.from === "download") {
							checkDownloadReady();
						}
					});
				} catch(e) {
					console.log("Cathcing failed try");
					//this.error({status: 0, statusText: "Query returned empty."});
				}
			}
		}).fail(function() {
			var currenturl = that.getURL("links non-api", object);
			getAjaxData(currenturl, "html").then(function(html) {
				try {
					linkarray = ["linkarray"];
					thumbArray = JSON.parse($(html).text().match(/(window\.params\.thumbs \= )(.*);/));

					thumbArray = thumbArray[2];

					thumbArray.forEach(function(img) {
						var image = "https:" + img.replace("thumbs", "images").replace(".thumb", "");
						linkarray.push(image);
					})

					linkarray.push(linkarray[1].match(/t.fakku.net\/.*\/images\/.*/).toString().slice(-4)); // File Extension
					sendReadyMessage("docReadyLink", linkarray);
					if(object.from === "download") {
						checkDownloadReady();
					}
				} catch(e) {
					this.error({status: 0, statusText: "Query returned empty."});
				}
					});
		});
	}
};


// Grabber for Pururin
var pururin = {
	getURL: function(from) {
		var currenturl;
		grabber = object;

		if(from === "info") {
			if (window.location.pathname.match(/.*\/(view|thumbs).*/)) {
				currenturl = $(".header-breadcrumbs span:nth-last-child(2) a").prop("href");
				//console.log("GrabLinks URL: " + currenturl);
			} else {
				currenturl = window.location.href;
				//console.log("GrabLinks URL: " + currenturl);
			}
		} else if(from === "links") {
			if (window.location.pathname.match(/.*\/(gallery|thumbs).*/)) {
				currenturl = $('div.content ul.thumblist li:first-child a').prop("href");
				//console.log("GrabLinks URL: " + currenturl);
			} else {
				currenturl = window.location.href;
				//console.log("GrabLinks URL: " + currenturl);
			}
		}

		return currenturl;
	},
	getInfo: function(object) {
		infoArray = [];
		infoObject = {
			name: "",
			parodies: [],
			artists: [],
			circles: "",
			characters: [],
			category: "",
			scanlators: [],
			languages: "",
			date: [],
			tags: [],
			pages: "",
			description: "Empty for now, might add this function later.",
		};

		var currenturl = this.getURL("info");

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
				infoObject.name = $(html).find("h1.otitle").text().match(/(.*)( \/.*)/)[1];
			} catch(e) {
				infoObject.name = $(html).find("h1.otitle").text();
			}

			$(html).find("div.gallery-info tr").each(function(i, row) {

				var field = $(row).find("td:first-child").text();
				var values = [];

				var rMapped = /\b(parody|circle|group|groups|character|artist|language|scanlator|page|tag|content|contents)\b/gi;
				var eMapped = {
					"parody": "parodies",
					"circle": "circles",
					"group": "circles",
					"groups": "circles",
					"character": "characters",
					"artist": "artists",
					"language": "languages",
					"scanlator": "scanlators",
					"page": "pages",
					"tag": "tags",
					"content": "tags",
					"contents": "tags",
				};

			  // Return the mapped value.
			  	field = field.toLowerCase().replace(rMapped, function(matched) {
					return eMapped[matched];
				});

			  // Separate each tag/value in row
				if($(row).find("td:last-child ul").length !== 0) {
					$(row).find("td:last-child ul").children().each(function(i, li) {
						values.push($(li).text());
					});
				} else {
					values.push($(row).find("td:last-child").text());
				}

			  // Assign values
				switch(field) {
					case "pages":
						infoObject[field] = values[0].match(/(.*)(\ \(.*\))/)[1];
					break;
					case "languages":
						infoObject[field] = values[0];
					break;
					default:
						infoObject[field] = values;
					break;
				}
				
			});


		  // Series, author, translator, tags are arrays
			infoarray[0] 	= "infoarray";
			infoarray[1] 	= infoObject.pages;
			infoarray[2] 	= infoObject.name;
			infoarray[3] 	= infoObject.parodies;
			infoarray[4] 	= infoObject.artists;
			infoarray[5] 	= infoObject.languages;
			infoarray[6] 	= infoObject.scanlators;
			infoarray[7] 	= infoObject.tags;
			infoarray[8] 	= infoObject.description;
			infoarray[9] 	= imgCover; // Fix
			infoarray[10] 	= imgSample; // Fix
			infoarray[11]	= date; // fix
			infoarray[12]	= false;

			//console.log(infoObject, infoarray);

			if (object.from === "notes") {
				//console.log("notifications Grabinfo triggered");
				object.infodata = infoarray;
				grab_notes[object.name].status = "done";
				notificationInfo(object, notes);
			} else {
				//console.log("Download Grabinfo triggered");
				sendReadyMessage("docReadyInfo", infoarray);
				if(object.from === "download") {
					checkDownloadReady();
				}
			}
		});
	},
	getLinks: function(object) {
		linkarray   = [];

		var currenturl = this.getURL("links");

		getAjaxData(currenturl, "html").then(function(html) {
			var manga = JSON.parse($(html).find("script:last-child").text().match(/{.*}/));

			if (manga !== "" || !$.isEmptyObject(manga)) {
				linkarray = ["linkarray"];
				$.each(manga.images, function(i, data) {
					var link = "http://pururin.com/f/"+ data.f.slice(0, -4) +"/"+ manga.slug +"-"+ (parseInt(data.i)+1) + data.f.slice(-4);
					linkarray.push(link);
				});

				linkarray.push(manga.images[0].f.slice(-4)); // File Extension
				sendReadyMessage("docReadyLink", linkarray);
				if(object.from === "download") {
					checkDownloadReady();
				}
			} else  {
				this.error({status: 0, statusText: "Query returned empty."});
			}
		});
	}
};

// Grabber for nHentai
// getLinks: working, getInfo: not working
var nhentai = {
	getURL: function(from) {
		var currenturl;
		grabber = object;

		if (window.location.pathname.match(/\/g\/[0-9]*\/[0-9]*\//)) {
			currenturl = $('div.back-to-gallery a').prop("href");
			//console.log("GrabLinks URL: " + currenturl);
		} else {
			currenturl = window.location.href;
			//console.log("GrabLinks URL: " + currenturl);
		}
		return currenturl;
	},
	getInfo: function(object) {
		infoArray = [];
		infoObject = {
			name: "",
			parodies: [],
			artists: [],
			circles: "",
			characters: [],
			category: "",
			scanlators: [],
			languages: "",
			date: [],
			tags: [],
			pages: "",
			description: "Empty for now, might add this function later.",
		};

		var currenturl = this.getURL("info");

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

			infoObject.name 	= $(html).find("div#info h1").text();
			infoObject.date 	= $(html).find('div#info time').attr('datetime');
			infoObject.pages 	= $(html).find('div#info div:not(.field-name)')[0].innerHTML.match(/([0-9]*) .*/)[1];

			$(html).find("div#info div.field-name").each(function(i, row) {

				var field = $(row)[0].innerText.match(/(.*?)(:)/)[1];
				var values = [];

				var rMapped = /\b(parody|circle|group|groups|character|artist|language|scanlator|page|tag|content|contents)\b/gi;
				var eMapped = {
					"parody": "parodies",
					"circle": "circles",
					"group": "circles",
					"groups": "circles",
					"character": "characters",
					"artist": "artists",
					"language": "languages",
					"scanlator": "scanlators",
					"page": "pages",
					"tag": "tags",
					"content": "tags",
					"contents": "tags",
				};

			  // Return the mapped value.
			  	field = field.toLowerCase().replace(rMapped, function(matched) {
					return eMapped[matched];
				});

			  // Separate each tag/value in row
				if($(row).find("a").length !== 0) {
					$(row).find("a").each(function(i, tag) {
						values.push(tag.innerText.match(/(.*?)( \(.*?\))/)[1].replace(/\&#8629/g, "").trim());
					});
				}

			  // Assign values
				infoObject[field] = values;
			});

		  // Series, author, translator, tags are arrays
			infoarray[0] 	= "infoarray";
			infoarray[1] 	= infoObject.pages;
			infoarray[2] 	= infoObject.name;
			infoarray[3] 	= infoObject.parodies;
			infoarray[4] 	= infoObject.artists;
			infoarray[5] 	= infoObject.languages;
			infoarray[6] 	= infoObject.scanlators;
			infoarray[7] 	= infoObject.tags;
			infoarray[8] 	= description;
			infoarray[9] 	= imgCover; // Fix
			infoarray[10] 	= imgSample; // Fix
			infoarray[11]	= date;
			infoarray[12]	= false;

			//console.log(infoObject, infoarray);

			if (object.from === "notes") {
				//console.log("notifications Grabinfo triggered");
				object.infodata = infoarray;
				grab_notes[object.name].status = "done";
				notificationInfo(object, notes);
			} else {
				//console.log("Download Grabinfo triggered");
				sendReadyMessage("docReadyInfo", infoarray);
				if(object.from === "download") {
					checkDownloadReady();
				}
			}
		});
	},
	getLinks: function(object) {
		linkarray   = [];

		var currenturl = this.getURL("links");

		getAjaxData(currenturl, "html").then(function(html) {
			var pageArray = $(html).find('div#thumbnail-container a.gallerythumb img');
			linkarray = ["linkarray"];

			$.each(pageArray, function(i, str) {
				str = $(str).attr("data-src");
				var link = str.match(/(.*\/\/)(t)(.*[0-9]*\/)([0-9]*t)(.*)/)
				linkarray.push("http:"+link[1]+"i"+link[3]+link[4].slice(0, -1)+link[5]);
			});

			linkarray.push(linkarray[1].slice(-4)); // File Extension
			sendReadyMessage("docReadyLink", linkarray);
			if(object.from === "download") {
				checkDownloadReady();
			}
		});
	}
};


function checkDownloadReady() {
	if(linkarray.length !== 0 && infoarray.length !== 0) {
		startDownload();
	}
}

// Function for dealing with errors
// FIX ERRORHANDLING //
function errorHandling (error) {
	if (grabber.from !== "notes") {
		msgError(error);
		//console.log("Error: " + error);
	}
	if (error.status == "410") {
		var note = JSON.parse(localStorage[downloadurl.replace("https://www.fakku.net", "") + "--note"]);
		note[0] = "old";
		localStorage[downloadurl.replace("https://www.fakku.net", "") + "--note"] = JSON.stringify(note);
	}
	if (grabber.from === "notes" && error.status != "0") {
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
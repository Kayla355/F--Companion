
	var setNewVersion	= false;
	var docReadyLink	= false;
	var docReadyInfo	= false;
	var errorReport		= false;
	var askRecache		= false;
	var userRefresh		= false;
	var errorMsg 		= null;
	var idCounter		= 0;
	var idCounterTemp	= 0;
	var errorCount		= 0;
	var perPage 		= localStorage["entry_amount"];
	var perPageMore 	= 1;
	var filterTimer;


  // Variables mapping what characters translates into what
  	var rMapped = /The\siDOLM@STER\sCinderella\sGirls|the\siDOLM@STER|dark\sskin|monster\sskin|\s&\s|\s+\s|\ |\&|\.|\!|\@|\(|\)|\'|\_|\+|\%|\?|\:|\/|\[|\]|\☆|\★|\α|\×/gi;
	var eMapped = {
		" & ":"-",
		" + ":"-",
		" ":"-",
		"&":"",
		".":"",
		"!":"",
		"@":"",
		"(":"",
		")":"",
		"'":"",
		"_":"",
		"+":"-",
		"%":"",
		"?":"",
		":":"",
		"/":"",
		"[":"",
		"]":"",
	  // Specials
		"☆":"byb",
		"★":"bzb",
		"α":"bab",
		"×":"b-b",
	  // Special cases (hate inconsistencies...)
	  	"The iDOLM@STER":"the-idolmaster",
	  	"The iDOLM@STER Cinderella Girls":"the-idolmster-cinderella-girls",
	  	"dark skin":"darkskin",
	  	"monster girl":"monstergirl",
	};
	var rTagDescMapped = /ahegao|anal|ashikoki|bara|cheating|chikan|color|dark\sskin|ecchi|femdom|forced|futanari|group|harem|hentai|housewife|humiliation|incest|irrumatio|kemonomimi|maid|megane|mizugi|monster\sgirl|netorare|non-h|nurse|oppai|oral|osananajimi|paizuri|pettanko|random|schoolgirl|shibari|shimapan|stockings|tanlines|teacher|tentacles|tomboy|toys|trap|tsundere|uncensored|vanilla|yandere|yaoi|yuri/;
	var eTagDescMapped = {
		"ahegao":"The Ahegao (アヘ顔, which has often been interpreted as \"weird face\", ahe coming from the Japanese onomatopoeia of \"アヘアヘ(aheahe)\" describing female\'s flushed breath/moaning in sex and her sexual excitement, gao meaning \"face\") is an exploitable phenomenon taking place in pictures of close-up faces from a token character modified in order to have a kind of lust-filled, overly exaggerated orgasmic expression, the eyes usually rolled up with teardrops/sweat at times, the mouth wide open with the tongue sticking out and blushing cheeks.&#10;&#10;Related Tags: forced, humiliation, netorare",
		"anal":"Anal sex refers to the sex act involving insertion of the penis into the anus of a sex partner. Manga with this tag will include scenes of anal sex, either with or without permission from the receiving person.&#10;&#10;Related Tags: forced, netorare, tsundere",
		"ashikoki":"Ashikoki (あしこき) is the Japanese term for footjob. A footjob is a sexual act where the genitalia are stimulated by someone\'s feet. Manga with this tag will include these scenes.&#10;&#10;Related Tags: oral, paizuri, stockings",
		"bara":"Bara (薔薇), also known as \"Men\'s Love\" (commonly abbreviated as \"ML\"), is a Japanese term for a genre of art and media that focuses on male same-sex love, usually created by gay men for a gay audience.&#10;&#10;Related Tags: anal, vanilla, yaoi",
		"cheating":"The cheating tag is used for content where one of the characters has a relationship with someone other than their spouse. Usually we are not introduced to the spouse, or they have a very small part in the story. This tag was introduced as a more mild form of netorare.&#10;&#10;Related Tags: housewife, netorare, tsundere",
		"chikan":"Chikan is the Japanese word for public molestation. Usually used in reference to furtive groping and sexual assaults that have become frequent on crowded public trains.&#10;&#10;Related Tags: oral, forced, tsundere",
		"color":"The color tag refers to manga and doujinshi that are entirely in color. Usually full color releases are much more elaborate and more detailed than regular releases and as a result they are much shorter.&#10;&#10;Related Tags: pettanko, stockings, uncensored",
		"dark skin":"The \"dark skin\" tag is used for hentai manga and doujinshi that focus on or contain females with dark/tan skin.&#10;&#10;Related Tags: oppai, schoolgirl, tanlines",
		"ecchi":"Ecchi describes a genre of manga and anime which is seen as a softer variant of hentai. For the most part it does not show sexual intercourse, but can show: panty shots, nudity, and perverted situations. Most of the time we use this tag for anything that does not contain any hentai.&#10;&#10;Related Tags: mizugi, shimapan, vanilla",
		"femdom":"Femdom, the shortened term for female dominance, irefers to relationships or sexual scenes where the dominant partner is female. This is frequently associated with BDSM or S&M, a type of roleplay between two or more individuals derived from the terms bondage and discipline. Manga with this tag will contain females character that are assertive and dominant over the other partner.&#10;&#10;Related Tags: futanari, yandere, yuri",
		"forced":"\"Forced\" is a more elegant way of saying rape. Manga with this tag will contain heavy elements of rape. This includes forced sexual intercourse (mainly by men on women) using either physical strength, threat, or surprise. This theme is very common and accepted in Japan.&#10;&#10;Related Tags: chikan, netorare",
		"futanari":"Futanari (二成, 二形; ふたなり) is a genre of Japanese anime and manga featuring hermaphrodite women; women with male genitalia. Due to the way it is executed, futanari is most closely related to the yuri genre, both generally feature women as the main characters.&#10;&#10;Related Tags: kemonomimi, tentacles, yuri",
		"group":"The group tag is used for manga that include threesomes and beyond. Most often this will include multiple male partners on a single female, but it also includes group situations where multiple couples are performing at the same time and in the same vicinity.&#10;&#10;Related Tags: harem, oral, schoolgirl",
		"harem":"Harem is a subgenre of anime and manga characterized by a protagonist surrounded by three or more members of the opposite sex. The most common scenario is a male surrounded by a group of females; when this is reversed it is referred to as a reverse harem. Manga with this tag usually have multiple female partners and one male, with each female personifying a popular character type.&#10;&#10;Related Tags: group, oral, schoolgirl",
		"hentai":"Hentai (変態 or へんたい) is a Japanese word that, in the West, describes sexually explicit or pornographic comics and animation—especially those of Japanese origin, such as anime, manga, and eroge. On FAKKU we use the \"hentai\" tag to differentiate heterosexual content (hentai) from homosexual content (yaoi and yuri).&#10;&#10;Related Tags: vanilla, yaoi, yuri",
		"housewife":"Housewife is a term used to describe a married female who is not employed outside of the home, instead she manages the household while her husband works. Manga with this tag involve housewives while they are at home. Additionally it is used in place of a MILF tag.&#10;&#10;Related Tags: incest, netorare, oppai",
		"humiliation":"Manga and doujinshi with the humiliation tag will contain scenes where a character is put in a state of disgrace or loss of self-respect. This will most often be forced upon them unwillingly and be in some type of public setting.&#10;&#10;Related Tags: chikan, forced, shibari",
		"incest":"Incest, more commonly referred to as wincest, is the taboo involving sexual intercourse between close relatives. The idea of forbidden love is the main appeal behind incest. Though many people enjoy these stories, it is often much less appealing in real life.&#10;&#10;Related Tags: tsundere, vanilla",
		"irrumatio":"A step up from a standard blowjob, the term Irrumatio is used to describe the act of (often roughly) \"fucking someone\'s face\". Generally involves deepthroating.&#10;&#10;Related Tags: oral, forced",
		"kemonomimi":"Kemonomimi refers to characters with animal characteristics, such as cat ears, cat tails, etc. Generally these characters appear mostly human despite their animal characteristics.&#10;&#10;Related Tags: megane, tentacles, vanilla",
		"maid":"Maid outfits are extremely popular in Japan and are frequently worn in anime and manga. The most common style of Japanese maid outfit consists of a traditional French maid costume with an apron. Generally, Japanese maid costumes are usually one-piece above the knee and black/navy blue colored. Typically they include a short apron with frill and the skirt area of the dress is usually pleated. If knickers or petticoats are worn with it, they are usually ruffled (and the dress is sometimes short enough to display them).&#10;&#10;Related Tags: housewife, stockings, teacher",
		"megane":"Megane is the Japanese term for glasses. Hentai with this tag will contain characters that wear glasses.&#10;&#10;Related Tags: harem, mizugi, shimapan",
		"mizugi":"Mizugi is the Japanese term for a woman\'s swimsuit or bathing suit. This tag can be used to refer specifically to school swimsuits, which are generally one-piece and blue in color.&#10;&#10;Related Tags: chikan, megane, pettanko",
		"monster girl":"Monster girls are \"exotic\" beings (monsters, demons, aliens, etc) that are either part human or bear a strong resemblance to a human female. Manga with this tag most often include strong female monster that capture a human male. For more fun check out Monmusu Quest, a visual novel involving monster girls.&#10;&#10;Related Tags: femdom, kemonomimi, tentacles",
		"netorare":"Netorare (寝取られ), also referred to as NTR or cuckold, is a genre where the intent is to cause an emotion of deep jealousy or distress in the reader. A direct translation of the word results in the definition \"having your lover taken from you\" or \"to have something taken from you while you sleep\". This is often accomplished by having main protagonist\'s loved one seduced away from them, with or without their knowledge.&#10;&#10;Related Tags: forced, tsundere",
		"non-h":"This tag is used for content that has sexually suggestive scenes, but does not have any hentai or actual sex.&#10;&#10;Related Tags: ecchi, random, vanilla",
		"nurse":"This tag is used for manga and doujinshi that contain female characters that are wearing nurse outfits, though they do not necessarily need to be actual nurses. Most of these stories will take place inside of a hospital.&#10;&#10;Related Tags: femdom, housewife, main",
		"oppai":"Oppai (おっぱい) is the Japanese slang word for breasts, generally used to refer to the larger variety. Naturally large breasts are somewhat rare in Japan, but in hentai they are quite frequent.&#10;&#10;Hentai manga and doujinshi with the tag \'oppai\' will involve characters with large breasts, but not excessively large.&#10;&#10;Related Tags: paizuri, pettanko",
		"oral":"Oral sex, known as fellatio when performed on a man and cunnilingus when performed on a female, is a sexual activity involving the stimulation of the genitalia by the use of the mouth. People may engage in oral sex as part of foreplay before or following sexual intercourse. It may also be performed for its own sake. Manga and doujinshi with this tag will contain a substantial amount of oral sex.&#10;&#10;Related Tags: paizuri, vanilla",
		"osananajimi":"Osananajimi (幼馴染) is a commonly-used term to represent a childhood friend of the main character. Usually the friend is in love with the main character but has never had the courage to tell them.&#10;&#10;Related Tags: harem, megane, vanilla",
		"paizuri":"Paizuri (パイズリ), also known as titty-fucking or a titfuck in the United States, involves the stimulation of the male penis by the female breasts. Commonly, this sex act involves the man placing his penis in the woman\'s cleavage and thrusting between the breasts while they are squeezed together for stimulation. Frequently combined with oral sex.&#10;&#10;Related tags: housewife, oppai, oral",
		"pettanko":"Pattanko (ぺったんこ) is the Japanese term for a flat-chested female character that is not under age. Manga with this tag will include characters that are obsessive and/or insecure about this fact.&#10;&#10;Related Tags: ecchi, schoolgirl, tsundere",
		"random":"The random tag is used for manga and doujinshi that are out of the ordinary. Sometimes that means they are funny, sometimes that means they are gross, and sometimes that means they are just plain weird. So be careful browsing the random section, you never know what you\'ll get.&#10;&#10;Related Tags: futanari, non-h, trap",
		"schoolgirl":"Manga with the schoolgirl tag will include characters that are either in primary or secondary school. Most of the time the story will take place at school or the characters will be wearing their school uniforms. The sailor outfit (セーラー服) is the most common style of uniform worn by female students in Japan, and the majority of manga with this tag will feature it.&#10;&#10;Related Tags: megane, netorare, vanilla",
		"shibari":"Shibari (縛り) is a word used by westerners to describe the bondage art Kinbaku (緊縛). Shibari literally means \"to tie\" or \"to bind\". It is used to describe the Japanese style of sexual bondage or BDSM which involves tying up a partner using simple yet visually intricate patterns, usually with several pieces of thin rope.&#10;&#10;Related Tags: femdom, forced, toys",
		"shimapan":"Shimapan is an abbreviation of shima-pantsu (striped panties) and have become quite popular due to their frequent use in anime and manga. The most popular variety come in the colors blue and white.&#10;&#10;Related Tags: ecchi, schoolgirl, stockings",
		"stockings":"Stockings, also referred to as thigh highs or kneesocks, are a close-fitting, elastic garment covering the foot and lower part of the leg. Stockings vary in color, design and transparency. All women should wear stockings, because they are awesome.&#10;&#10;Related Tags: maid, schoolgirl, shimapan",
		"tanlines":"Tan lines refers to a division between areas on the skin of pronounced paleness relative to other areas of skin that have been suntanned and are noticeable darker. This tag also includes ganguro fashion, where girls have a deep tan combined with hair dyed blonde.&#10;&#10;Related Tags: mizugi, shimapan, vanilla",
		"teacher":"The teacher tag is used for manga that contain teachers who are most often in dominant positions over their students. The Japanese word for teacher is sensei (先生) and it is commonly used as the translation to describe them in anime and manga.&#10;&#10;Related Tags: femdom, paizuri, schoolgirl",
		"tentacles":"Tentacles are a genre of hentai where various tentacled creatures (usually monsters) rape or otherwise penetrate women. It is a very uncommon theme, yet it has come to define the genre by most people who are unfamiliar with hentai.&#10;&#013Related Tags: futanari, kemonomimi",
		"tomboy":"A tomboy is a girl who exhibits characteristics or behaviors considered typical of the gender role of a boy, including the wearing of typically masculine-oriented clothes and engaging in games and activities that are often physical in nature, and which are considered in many cultures to be the domain of boys. Occasionally, such girls are called tomgirls.&#10;&#10;Related Tags: femdom, futanari, trap",
		"toys":"A sex toy is an object or device that is primarily used to facilitate human sexual pleasure. The most popular sex toys are designed to resemble human genitals and may be vibrating or non-vibrating. Manga with this tag will include the use of sex toys, both willingly or unwillingly.&#10;&#10;Related Tags: housewife, shibari, tentacles",
		"trap":"A trap refers to a male character that is dressed up as a female; this often leads to yaoi. In most cases the male character has very feminine characteristics and could be confused for a female.&#10;&#10;Related Tags: futanari, toys, yaoi",
		"tsundere":"Tsundere (ツンデレ) is a Japanese character development process which describes a person who is initially cold and even hostile towards another person before gradually showing their warm side over time. The word is derived from the terms tsun tsun (ツンツン), meaning to turn away in disgust, and dere dere (デレデレ) meaning to show affection.&#10;&#10;Related tags: anal, pettanko, yandere",
		"uncensored":"All hentai produced in Japan is censored by law. The law discourages showing genitals in hentai and all other forms of pornography. This is why most hentai will make use of black bars, mosaics, or a blur effect to hide genitalia. That said, you will find hentai with this tag completely uncensored. This is accomplished by having artists go in afterward, remove the censorship, and redraw the missing parts.&#10;&#10;Related Tags: color, ecchi",
		"vanilla":"The vanilla tag refers to manga and doujinshi that do not contain anything out of the ordinary or unusual. The majority of stories will be cute and romantic, involving only one boy and one girl falling in love.&#10;&#10;Related Tags: ecchi, incest, tsundere",
		"yandere":"Yandere is a Japanese term for a person who is initially very loving and gentle before their devotion becomes destructive in nature, often through violence. The term is derived from the words yan (ヤン) meaning a mental or emotional illness and dere dere (デレデレ) meaning to show affection. Yandere characters are mentally unstable, often using extreme violence as an outlet for their emotions.&#10;&#10;Related Tags: femdom, netorare, tsundere",
		"yaoi":"Yaoi (やおい) also known as Boys\' Love (commonly abbreviated as \"BL\"), is a popular Japanese term for female-oriented fiction that focus on homoerotic or homoromantic male relationships, usually created by female authors. The two participants in a yaoi relationship are often referred to as seme (the top) and uke (the bottom).&#10;&#10;Related Tags: bara, ecchi, yuri",
		"yuri":"Yuri (百合) is a genre involving love between women in manga and anime. Yuri can focus either on the sexual, the spiritual, or the emotional aspects of the relationship, the latter two sometimes being called shōjo-ai. Manga with the yuri tag will contain relationships exclusively between women.&#10;&#10;Related Tags: futanari, vanilla, yaoi",
	}

// Create clickable menu
$('a#refresh').on("click", function(event) { event.preventDefault(); refreshNotes(); });

$('a#recache').on("click", function(event) { event.preventDefault(); updateNotes(true); });

$('a#loadmore').on("click", function(event) { event.preventDefault(); loadMore(); });

$('a#filter').on("mousedown", function(event) {
	event.preventDefault();
	$('div#menu div.right').prepend('<input id="filterInput" type="text" placeholder="Filter by tag" title="Input a tag and hit enter to begin filtering, separate tags by space." style="padding-right: 5px;"></div>');
	$('div#menu div.right').on("keyup", function() { filter() })
	fInput_rem();
});
$('a#filter').mouseup(function(event) { event.preventDefault(); });

// Create Input
function fInput_add () {
	$('a#filter').off("mousedown");
	$('a#filter').on("mousedown", function(event) {
		event.preventDefault();
		$('div#menu div.right').prepend('<input id="filterInput" type="text" placeholder="Filter by tag" title="Input a tag and hit enter to begin filtering, separate tags by space." style="padding-right: 5px;"></div>');
		$('div#menu div.right').on("keyup", function() { filter() })

		fInput_rem();
	});
}
// Remove Input
function fInput_rem () {		
	$('a#filter').off("mousedown");
	$('a#filter').on("mousedown", function(event) {
		event.preventDefault();
		$('input#filterInput').remove();
		$('div#menu div.right').off("keyup")

		$('div.noteDiv-matched').attr('class', 'noteDiv');
		$('div.noteDiv-filtered').attr('class', 'noteDiv');

		fInput_add();
	});
}
// Function to filter notifications
function filter(event) {
	clearTimeout(filterTimer)
	filterTimer = setTimeout(function (event) {
		var input = $('input#filterInput').val().toLowerCase().split(/, | /);

		$('div.noteDiv-matched').attr('class', 'noteDiv');
		$('div.noteDiv-filtered').attr('class', 'noteDiv');

	  // For each noteDiv
		if (input[0] != "") {
			$('div.noteDiv').each(function (index, div) {
				var tagArray = new Array();
				var matched = 0;
				var i = input.length;
			  // Grab tags
				$(div).find('div#right div.row-left-full a').each(function (i, val) { tagArray.push($(val).text().toLowerCase()) });
			  // For each tag match & if matched then increase match count until the match count is the same as input length.
			  // If the matched count and the input length is the same hide other divs
				input.forEach(function (value) {
					if (tagArray.toString().match(value)) {
						matched++
						if (matched == i) {
							$(div).attr('class', 'noteDiv-matched');
						}
					};
				})
				matched = 0;
			});
		  // Hide the divs that were not matched
			$('div.noteDiv').attr('class', 'noteDiv-filtered');
		}
	}, 50)
}

checkCookies(); // Run checkCookies function

// Queue function
// Thanks to debuggable for this. (http://bit.ly/dBugQFunc)
$.queue = {
    _timer: null,
    _queue: [],
    add: function(fn, context, time) {
        var setTimer = function(time) {
            $.queue._timer = setTimeout(function() {
                time = $.queue.add();
                if ($.queue._queue.length) {
                    setTimer(time);
                }
            }, time || 2);
        }

        if (fn) {
            $.queue._queue.push([fn, context, time]);
            if ($.queue._queue.length == 1) {
                setTimer(time);
            }
            return;
        }

        var next = $.queue._queue.shift();
        if (!next) {
            return 0;
        }
        next[0].call(next[1] || window);
        //console.log("Left of Queue: " + $.queue._queue.length);
        return next[2];
    },
    clear: function() {
        clearTimeout($.queue._timer);
        $.queue._queue = [];
    }
};

// Check if Login cookie has expired.
function checkCookies(reCache, loadmore) {
	chrome.cookies.get({url: "https://www.fakku.net", name: "fakku_sid"}, function(results) {
		if (!results) {
			$('div#menu').hide();
			$('div#notes').hide();
			$('html').css("height", "20px");
			$('html').css("width", "220px");
			$('body').css("height", "20px");
			$('body').css("width", "220px");
			$('div#content').css("width", "200px");
		  	$('div#content').css("height", "20px");
			$('div#content').append("<center style='width: 200px; height:20px'><b></b></center>");
			$('div#content center b').html("Cookie expired, please <a href='https://www.fakku.net/login' style='text-decoration: underline; color: blue;' target='_blank'>Login</a>");
		} else {
		  // Check if version saved in localStorage matches current version. Also force recache if html_content does not exist.
			if (localStorage["app_version"] != chrome.app.getDetails().version || !localStorage["app_version"] || !localStorage["html_content"]) {
				if (!localStorage["app_version"] || !localStorage["html_content"]) {
					reCache = true;
				} else {
					var currentVersion 	= chrome.app.getDetails().version.replace(/\./g, "");
					var oldVersion		= localStorage["app_version"].replace(/\./g, "");
					var diff 			= currentVersion.slice(1, 2) - oldVersion.slice(1, 2);

					if (diff >= 1 || diff <= -1) {
						//reCache = true;
						askRecache = true;
					}
				}
			}

		  // Gather and create notifications 
		  	$('div#content').css("width", "545px");
		  	//$('div#content').css("height", "600px");
		  	if (reCache || localStorage["new_note"] == "true" || loadmore) {
		  		$('body').css("opacity", "0.6");
		  		$('div#float').empty();
				$('div#float').show();
				$('div#float').prepend("<div id='loading' class='loadingtrailnotes'></div>");
		  	};

		  	var nArrayNames = JSON.parse(localStorage["n_array_names"]);
		  	var doArray 	= new Array();

		  	if (perPage == "all") {
		  		doArray = nArrayNames;
		  	} else {
		  		parsePerPage = parseInt(perPage) - 1;
		  		var perPageMax 	= perPageMore + parsePerPage;

		  		while (perPageMore <= perPageMax) {
			  		var ni = perPageMore - 1;
			  		doArray.push(nArrayNames[ni]);
			  		perPageMore++
		  		}
		  	}
			localStorage["notes_done_amount"] = doArray.length;

			var new_nArrayNames = new Array();
		  // For each arrayname in localstorage
			doArray.forEach(function(name) {
				loadNote(name, false);
			});
			function loadNote(name, bypass) {
				if (JSON.parse(localStorage[name])[0] == "old" && !reCache || bypass) {
					var self = this, doBind = function() {
						var nNote = JSON.parse(localStorage[name]);
						var nInfo;
						if (localStorage[nNote[2].replace("https://www.fakku.net", "") + "--info"]) {
							nInfo = JSON.parse(localStorage[nNote[2].replace("https://www.fakku.net", "") + "--info"]); 
						}
						//console.log(nNote);
					  // Check if manga exists and reCache is false
						if (nInfo && !reCache && nNote[0] == "old" && nInfo[1] != "error" || nInfo && !reCache && nNote[0] == "old" && nInfo[1] == "error" && nInfo[2].toString().match(/(404|410|411)/)) {
							notificationInfo(JSON.parse(localStorage[nNote[2].replace("https://www.fakku.net", "") + "--info"]), nNote[2], nNote[3], nNote[0], nNote[5], "append", reCache, loadmore);
							//console.log("Manga exists in localStorage");
						} else {
							grabInfo(nNote[2], true, false, nNote[3], nNote[0], nNote[5], "prepend", reCache, loadmore);
							//console.log("Manga does not exists in localStorage");
							//console.log(nNote[2]);
						}
					  // Update the app_version localStorage to current version
						if (nArrayNames[nArrayNames.length - 2] == name && (localStorage["app_version"] != chrome.app.getDetails().version || !localStorage["app_version"])) {
							setNewVersion = true;
						}
			        };
			        $.queue.add(doBind, this);
			    } else {
			    	new_nArrayNames.unshift(name);
			    }
			}
			new_nArrayNames.forEach(function(name) {
				loadNote(name, true);
			});
		}
	});
}

function preCheckCookies (reCache, loadmore) {
	$('body').css("opacity", "0.6");
	$('div#float').empty();
	$('div#float').show();
	//checkCookies(reCache);
	setTimeout(function () {checkCookies(reCache, loadmore)}, 20); // Workaround to get the loadingtrail to appear instead of nothing
}

// Function waiting for the information from GrabInfo
function notificationInfo(infodata, href, nold, nseen, nshown, pend, reCache, loadmore) {

  // Variables
	var tagArray 		= new Array();
	var artistArray		= new Array();
	var translatorArray	= new Array();
	var seriesArray = [{attribute: "Not Specified", attribute_link: "/none"}]
	var error 			= false;

	if (infodata[1] == "error") { idCounter--; error = true; console.log("%cError Parsing: %c" + infodata[3], "color: red;", "color: black;"); console.log("%cError Number: %c" + infodata[2], "color: red;", "color: black;"); console.log("%cError Message: %c" + infodata[4], "color: red;", "color: black;"); };
	if (infodata[3] && !error)  { seriesArray = infodata[3] };
	if (infodata[5] && !error)  { var languageLink = infodata[5].replace(rMapped, function(matched) { return eMapped[matched]; }).toLowerCase(); };
	if (infodata[7] && !error)  { tagArray 			= infodata[7] };
	if (infodata[4] && !error)  { artistArray 		= infodata[4] };
	if (infodata[6] && !error)  { translatorArray 	= infodata[6] };

	var seriesName = seriesArray[0].attribute;
	var seriesLink = seriesArray[0].attribute.replace(rMapped, function(matched) { return eMapped[matched]; }).toString().toLowerCase(); 

  // Check if the stored html should be appended
	if (idCounter == 0 && !reCache && !userRefresh) {
	  // Append content to body
		$('div#notes').append(JSON.parse(localStorage["html_content"]));
	} 
	idCounter++

  // Update time
	if (infodata[11] && !error) {
		var nDate 		= Math.round(new Date().getTime()/1000);
		var mDate 		= infodata[11];
		var hoursDiff	= nDate - mDate;
		var timeSince	= {
				days: Math.floor(hoursDiff / 86400),
				hours: Math.floor(hoursDiff / 3600),
				minutes: Math.ceil(hoursDiff / 60)
			};
		var endText;

		if (timeSince.days >= 1) {
			nold = timeSince.days;
			if (timeSince.days == 1) { endText = " day ago" } else { endText = " days ago" };
		} else if (timeSince.hours >= 1) {
			nold = timeSince.hours;
			if (timeSince.days == 1) { endText = " hour ago" } else { endText = " hours ago" };
		} else {
			nold = timeSince.minutes;
			if (timeSince.days <= 1) { endText = " minute ago" } else { endText = " minutes ago" };
		}
		nold = nold + endText;
		if (pend == "append") {
			$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#right div.wrap div.row-small div.right i').text(nold);
		}
	}

	if (pend == "prepend" || reCache || loadmore) {	

		idCounterTemp = idCounter;

	  // Adds "--info" to the end of the href string to match the name in localStorage
		localStorage[href.replace("https://www.fakku.net", "") + "--info"] = JSON.stringify(infodata);
			
	  // Create divs
		if (infodata[2] && !error) {
			//idCounter++
				// Main Div
				if (idCounter == 1 || pend == "append") {
					$('div#content div#notes').append("<div class='noteDiv'></div>");
				} else {
					idCounter = 1;
					$('div#content div#notes').prepend("<div class='noteDiv'></div>");
				}
				// Left Div Content
				$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') ').append("<div id='left'></div>");
				$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#left').append("<div class='wrap'></div>");
				$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#left div.wrap').append("<div class='images'></div>");
				
				$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#left div.wrap div.images').append("<img class='cover' src='" + infodata[9] + "' itemprop='image'>");
				$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#left div.wrap div.images').append("<img class='cover' src='" + infodata[10] + "' itemprop='image'>");

				$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#left div.wrap').append("<ul></ul>");
				$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#left div.wrap ul').append("<li></li>");
				$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#left div.wrap ul li:nth-of-type(1)').append("<a id='read-online' href='#'>Read Online</a>");
					
				$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#left div.wrap ul').append("<li></li>");
				$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#left div.wrap ul li:nth-of-type(2)').append("<a id='download' href='#'>Download</a>");
			
			// Right Div Content
				$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') ').append("<div id='right'></div>");
				$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#right').append("<div class='wrap'></div>");
				$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#right div.wrap').append("<div id='hidediv'><button title='Remove' class='close'>Close</button></div>");
				$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#right div.wrap').append("<div class='content-name'></div>");
				$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#right div.wrap div.content-name').append("<h1>" + infodata[2] + "</h1>");
				$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#right div.wrap').append("<div class='row'></div>");
				$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#right div.wrap div.row').append("<div class='left'>Series: <a id='" + seriesLink + "' href='#'>" + seriesName + "</a></div>");

				if (infodata[5] == "english") {
					$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#right div.wrap div.row').append("<div class='right'>Language: <span class='english'><a id='" + languageLink + "' href='#'>" + infodata[5] + "</a></span></div>");
				} else {
					$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#right div.wrap div.row').append("<div class='right'>Language: <span class='non-english'><a id='" + languageLink + "' href='#'>" + infodata[5] + "</a></span></div>");
				}
				
				$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#right div.wrap').append("<div class='row'></div>");
				$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#right div.wrap div.row:last-child').append("<div class='left'>Artist: </div>");
				$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#right div.wrap div.row:last-child').append("<div class='right'>Translator: <span class='english'></span></div>");
				$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#right div.wrap').append("<div class='row-small'></div>");
				$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#right div.wrap div.row-small').append("<div class='left'><b>" + infodata[1] + "</b> Pages</div>");
				$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#right div.wrap div.row-small').append("<div class='right'><i>" + nold + "</i></div>");
				$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#right div.wrap').append("<div class='hr></div>");
				$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#right div.wrap').append("<div id='description' class='row-left-full' itemprop='description'><b>Description: </b>" + infodata[8] + "</div>");
				$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#right div.wrap').append("<div class='row-left-full' itemprop='keywords'><b>Tags: </b></div>");

			// For each in array do...
			  // Create Tags Link
				tagArray.forEach(function(e) {
				  // Replaces certain characters defined in "eMapped" and creates a lowercase string out of it
					var er = e.attribute.replace(rMapped, function(matched) {
						return eMapped[matched];
					}).toLowerCase()

				  // If last in array do not use ", "
					if (tagArray[tagArray.length - 1] == e) {
						$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#right div.wrap div.row-left-full:last-child').append("<a id='" + er + "' href='#'>" + e.attribute + "</a>");
						$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#right div.wrap div.row-left-full:last-child a:last-child').attr("title", $('<div/>').html(e.attribute.toLowerCase().replace(rTagDescMapped, function(matched) { return eTagDescMapped[matched] })).text());
					} else {
						$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#right div.wrap div.row-left-full:last-child').append("<a id='" + er + "' href='#'>" + e.attribute + "</a>, ");
						$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#right div.wrap div.row-left-full:last-child a:last-child').attr("title", $('<div/>').html(e.attribute.toLowerCase().replace(rTagDescMapped, function(matched) { return eTagDescMapped[matched] })).text());
					}
				});
			  // Create Artists Link"
				artistArray.forEach(function(e) {
				  // Replaces certain characters defined in "eMapped" and creates a lowercase string out of it
					var er = e.attribute.replace(rMapped, function(matched) {
						return eMapped[matched];
					}).toLowerCase()

				  // If last in array do not use ", "
					if (artistArray[artistArray.length - 1] == e) {
						$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#right div.wrap div.row:nth-of-type(4) div.left').append("<a id='" + er + "' href='#'>" + e.attribute + "</a>");
					} else {
						$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#right div.wrap div.row:nth-of-type(4) div.left').append("<a id='" + er + "' href='#'>" + e.attribute + "</a>, ");
					}
				});
			  // Create Translators Link"
				translatorArray.forEach(function(e) {
				  // Replaces certain characters defined in "eMapped" and creates a lowercase string out of it
					var er = e.attribute.replace(rMapped, function(matched) {
						return eMapped[matched];
					}).toLowerCase()

				  // If last in array do not use ", "
					if (translatorArray[translatorArray.length - 1] == e) {
						$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#right div.wrap div.row:nth-of-type(4) div.right span').append("<a id='" + er + "' href='#'>" + e.attribute + "</a>");
					} else {
						$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#right div.wrap div.row:nth-of-type(4) div.right span').append("<a id='" + er + "' href='#'>" + e.attribute + "</a>, ");
					}
				});
			  // Description dropdown
				if ($('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#right div.wrap div#description.row-left-full').height() > 32) {

				  // Create dropdown button
				  	$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#right div.wrap div#description.row-left-full').css("height", "32px")
				  	$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#right div.wrap div#description.row-left-full').css("overflow", "hidden")
				  	$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#right div.wrap div#description.row-left-full b').css("cursor", "pointer")
				  	$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#right div.wrap div#description.row-left-full b').html("\&#9658\;Description:")

					}
			  // Fix left div height
					$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#left div.wrap div.images').css("height", $('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#right').height() - 60);
					$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#left div.wrap div.images img').css("height", "100%");

			// End of create 

		  // Change class to hidden if true
			if (nshown == "hidden") {
				$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +')').attr("class", "noteDiv-hidden");
			}
		  // Remove unused Divs
		  	if ($('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#right div.wrap div.row:nth-of-type(4) div.right span').text() == "") {
		  		$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#right div.wrap div.row:nth-of-type(4) div.right span').html("<a>Not Specified</a>");
		  		$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#right div.wrap div.row:nth-of-type(4) div.right span').attr("class", "japanese");
		  	}
		} // End of create divs
	} // End of if prepend statement
	// If error then increase errorCount
	if (error) {
	  //console.log("Increased errorcount");
		errorCount++
	}
	
	// Run function that will attach Event Listeners to page
	if (!error && !userRefresh || !error && pend == "prepend") {
		attachEventListeners(idCounter, href, seriesLink, languageLink, tagArray, artistArray, translatorArray, seriesArray);
	}

  // If div position was set to prepend
  	if (pend == "prepend") {
  		idCounter = idCounterTemp;
  	}
  // If new change to old to indicate that the entry has been seen
	if (nseen == "new") {
		var note = JSON.parse(localStorage[href.replace("https://www.fakku.net", "") + "--note"]);
		note[0] = "old"
		localStorage[href.replace("https://www.fakku.net", "") + "--note"] = JSON.stringify(note);
	}
	// console.log("idCounter: "+idCounter)
	// console.log("arrayLength: "+JSON.parse(localStorage["n_array_names"]).length)
	// console.log("errorCount: "+errorCount)
  // If this is the last notifiction then... (Might need a new way to do this later, as it will most likely break if I decide to not load ALL the notifications at once)
  	var extra = 0;
  	if (loadmore) {
  		extra = perPageMore - parseInt(localStorage["notes_done_amount"]) - 1;
  	}

	if (idCounter == parseInt(localStorage["notes_done_amount"]) - errorCount + extra) {
		notesDone(pend, loadmore, errorCount);
		//console.log("notesDone triggered");
	}
};

function attachEventListeners (idCounter, href, seriesLink, languageLink, tagArray, artistArray, translatorArray, seriesArray) {
  // Div actions
  	newTabLink(idCounter, href, "read-online");
	newTabLink(idCounter, "series", seriesLink, seriesArray[0].attribute_link);
	newTabLink(idCounter, "", languageLink);
  // Mousedown Action
	$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') div#right div.wrap div#description.row-left-full b').mousedown(function(event) {
		if ($(event.target.parentNode).height() > 32) {
		  // Hide dropdown
			$(event.target.parentNode).css("height", "32");
			$(event.target).html("\&#9658\;Description: ");

		  // Rescale Image
			// $(event.target.parentNode.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].childNodes[0].childNodes[0]).css("height", "");
			// $(event.target.parentNode.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].childNodes[0].childNodes[1]).css("height", "");
			// $(event.target.parentNode.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].childNodes[0]).css("height", $(event.target.parentNode.parentNode.parentNode.parentNode.childNodes[1]).height() - 60);
			// $(event.target.parentNode.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].childNodes[0].childNodes[0]).css("height", "100%");
			// $(event.target.parentNode.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].childNodes[0].childNodes[1]).css("height", "100%");
		} else {
		  // Show dropdown
		  	$(event.target.parentNode).css("height", "");
		  	$(event.target).html("\&#9660\;Description: ");
		 
		  // Rescale Image
			// $(event.target.parentNode.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].childNodes[0].childNodes[0]).css("height", "");
			// $(event.target.parentNode.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].childNodes[0].childNodes[1]).css("height", "");
			// $(event.target.parentNode.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].childNodes[0]).css("height", $(event.target.parentNode.parentNode.parentNode.parentNode.childNodes[1]).height() - 60);
			// $(event.target.parentNode.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].childNodes[0].childNodes[0]).css("height", "100%");
			// $(event.target.parentNode.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].childNodes[0].childNodes[1]).css("height", "100%");
		}
	});

// Download click action
  // Had to use mousedown and mouseup instead of click because requestDownload was triggered first for some reason.
	$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') a#download').mousedown(function(event) {
		event.preventDefault();
		var x=event.clientX; 
		var y=event.clientY;
		var offsetY=$(document).scrollTop();
		//console.log(x + ", " + y);
		//console.log($(document).scrollTop());
		$('body').css("opacity", "0.6");
		$('div#float').empty();
		$('div#float').show();
		$('div#float').prepend("<div id='loading' class='loadingtrail'></div>");
		$('div#float').append("<b>Preparing Download</b>");
		$('div#float').css("left", x + 15);
		$('div#float').css("top", y + offsetY - 10);
		popup("downloadClicked");
	});
	$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') a#download').mouseup(function(event) {
		event.preventDefault();
		requestDownload(href);
	});
  // Hide/Remove div click action
	$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') button.close').mousedown(function(event) {
		event.preventDefault();
		var x=event.clientX; 
		var y=event.clientY;
		var offsetY=$(document).scrollTop();
		//console.log(x + ", " + y);
		//console.log($(document).scrollTop());
		$('body').css("opacity", "0.6");
		$('div#float').empty();
		$('div#float').show();
		$('div#float').append("<b>Removed</b>");
		$('div#float').css("left", x - 90);
		$('div#float').css("top", y + offsetY);
		localStorage[href.replace("https://www.fakku.net", "") + "--note"] = localStorage[href.replace("https://www.fakku.net", "") + "--note"].replace("shown", "hidden");
		$(event.target.parentNode.parentNode.parentNode.parentNode).hide();
		popup("removeClicked")
																});
	$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') button.close').mouseup(function(event) {
			event.preventDefault();
		});

// For each in array do...
  // Create Tags Link
	tagArray.forEach(function(e) {
	  // Replaces certain characters defined in "eMapped" and creates a lowercase string out of it
		var er = e.attribute.replace(rMapped, function(matched) {
			return eMapped[matched];
		}).toLowerCase()

	  // If last in array do not use ", "
		if (tagArray[tagArray.length - 1] == e) {
			newTabLink(idCounter, "tags", er, e.attribute_link);
		} else {
			newTabLink(idCounter, "tags", er, e.attribute_link);
		}
	});
  // Create Artists Link"
	artistArray.forEach(function(e) {
	  // Replaces certain characters defined in "eMapped" and creates a lowercase string out of it
		var er = e.attribute.replace(rMapped, function(matched) {
			return eMapped[matched];
		}).toLowerCase()

	  // If last in array do not use ", "
		if (artistArray[artistArray.length - 1] == e) {
			newTabLink(idCounter, "artists", er, e.attribute_link);
		} else {
			newTabLink(idCounter, "artists", er, e.attribute_link);
		}
	});
  // Create Translators Link"
	translatorArray.forEach(function(e) {
	  // Replaces certain characters defined in "eMapped" and creates a lowercase string out of it
		var er = e.attribute.replace(rMapped, function(matched) {
			return eMapped[matched];
		}).toLowerCase()

	  // If last in array do not use ", "
		if (translatorArray[translatorArray.length - 1] == e) {
			newTabLink(idCounter, "translators", er, e.attribute_link);
		} else {
			newTabLink(idCounter, "translators", er, e.attribute_link);
		}
	});
}

// New Tab Link click action
function newTabLink(idCounter, e, er, link) {
	$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') a#' + er).click(function(event) {
		if (event.button != 2) {
			event.preventDefault();
		}
	});
	$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') a#' + er).mousedown(function(event) {
		if (event.button != 2) {
			event.preventDefault();
		}
	});
	$('div#content div#notes div.noteDiv:nth-of-type('+ idCounter +') a#' + er).mouseup(function(event) {
		if (event.button != 2) {
			event.preventDefault();
			if (er == "read-online") {
				er = e.replace("https://www.fakku.net/", "");;
				e  = "";
			}
			if (e == "") {
				openTab("https://www.fakku.net/" + er);
			} else {
				openTab("https://www.fakku.net" + link);
			}
			
		}
	});
}

// Function that is run when all notes have been created
function notesDone(pend, loadmore, errorCount) {
	chrome.browserAction.setBadgeText({text: ""});
	chrome.browserAction.setBadgeBackgroundColor({color: [0, 0, 0, 0]})
	localStorage["badge_number"] = 0;

	while ($('div.noteDiv').length  > perPage - errorCount && !loadmore) {
		$('div.noteDiv:nth-of-type('+ $('div.noteDiv').length +')').remove()
	}
	
	$('body').css("opacity", "1");
	$('div#load-more').show();
	$('div#float').hide();
	$('div#float').attr("class", "");

	$('div#float').empty();
	//console.log("loadingtrail should be gone");

	if (pend == "prepend") {
		localStorage["new_note"] = "false";
	}

	if (setNewVersion) {
		localStorage["app_version"] = chrome.app.getDetails().version;
	}

	if (localStorage["new_note"] == "false" && !loadmore) {
		storeContent();
	}

  // Recommend Recache Float
  	if (askRecache) {
  		askRecache = false;
  		//localStorage["app_version"] = chrome.app.getDetails().version;

  		$('div#float').empty();
		$('div#float').prepend("<div id='askRecache'></div>");
		$('div#float div#askRecache').append('<div id="text"><b>A Major change in versions have been detected!</b><br> It is recommended that you perform a recache to avoid problems. <br><br>Do you wish to perform this action now?</div>');
		$('div#float div#askRecache').append('<div id="options" class="option"><a id="yes" href="#">Yes</a><a id="no" href="#">No</a></div>');

		$('div#float').attr("class", "float-recache");

		$('div#content').css("width", "545px");
	  	$('body').css("opacity", "0.6");
		$('div#float').show();

		$('div#float div#askRecache div#options #yes').on('click', function(event) {
			event.preventDefault();
			updateNotes(true);
		});

		popup("askRecache");
  	}

  // Workaround for scrollbar not showing
	// setTimeout(function() {
	// 	$('body').css("overflow", "scroll");
	// }, 10);
}

// Function that saves the content of the notes div in localstorage
function storeContent() {
  // To avoid problems if I need to call this function manually for debugging.
	localStorage["new_note"] = "false";

  // Make sure no Divs are being filtered, as it would cause issues when loading the stored content.
	$('div.noteDiv-matched').attr('class', 'noteDiv');
	$('div.noteDiv-filtered').attr('class', 'noteDiv');

  // Store content in localStorage
	var htmlContent = $('div#notes').html(); 
	htmlContent = htmlContent.replace("	", "")
	localStorage["html_content"] = JSON.stringify(htmlContent);
	console.log("HTML Content Stored!");
}

// Function for removing the popup download box
function popup(from) {

	var avoidID = ["download", "hidediv", "askRecache", "float", "loadingtrial", "loadingtrailnotes", "yes"];

	if (from != "downloadClicked" && from != "askRecache") {
		var popup = setTimeout(removePopup, 750);
	}

	$(document).on("click", function(event) {
		event.preventDefault();
		if($.inArray(event.target.id, avoidID) === -1 && $.inArray(event.target.parentNode.id, avoidID) === -1) {
			removePopup();
		}
	});

	function removePopup() {
		$('body').css("opacity", "1");
		$('div#float').hide();
		$('div#float').empty();
		$('div#float').css("left", null);
		$('div#float').css("top", null);
		$(document).off("click");
		clearTimeout(popup);

		if (from == "removeClicked") {
			storeContent();
		}
	}
}

// Function that is run when a link is clicked
function openTab(tabUrl) {
	var background = false;
	if(event) {
	  // If right-click return
		if(event.button == 2) {
			return;
		}
	  // if middle-click, metaKey or ctrlKey was pressed when clicking
		if(event.button == 1 || event.metaKey || event.ctrlKey) {
			background = true;
		}
	}
  // Create Tab
	chrome.tabs.create({
		url: tabUrl,
		selected: !background
	});
}

// Function waiting for the links to finish being grabbed.
function nDocReadyLink() {
	docReadyLink = true;
};
// Function waiting for the info to finish being grabbed.
function nDocReadyInfo() {
	docReadyInfo = true;
};
// Function listening for any potential error.
function msgError(error) {
	if (!errorReport) {
		errorReport = true;
		errorMsg = error;
		//console.log("Error Report Recieved")
		//console.log(request.errorMessage);
	}
};

// Function to check for new notifications
function refreshNotes() {
	$('div#float').empty();

	$('div#float').attr("class", "float-load");
	$('div#float').prepend("<div id='loading' class='loadingtrailnotes'></div>");

	$('div#content').css("width", "545px");
  	$('body').css("opacity", "0.6");
  	$('div#float').css("top", "50%");
  	$('div#float').css("left", "45%");
	$('div#float').show();

  // Make sure no Divs are being filtered, as it would cause issues when loading in new notes.
  // Check if filter input box exists, if yes simulate click to remove it.
  	if ($('input#filterInput')) {
		$('input#filterInput').val("");

		$('div.noteDiv-matched').attr('class', 'noteDiv');
		$('div.noteDiv-filtered').attr('class', 'noteDiv');
  	};

	userRefresh = true;

  // Message that prompts the grabNotes to start. 
	chrome.runtime.sendMessage({msg: "GrabNotes", from: "nDropdown"});
	
}
// Listen for message that says refresh complete
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.msg == "nDropdownDone") {
		$('body').css("opacity", "1");
		$('div#float').hide();
		$('div#float').attr("class", "");

		$('div#float').empty();
		var t = JSON.parse(localStorage["n_array_names"]); t = JSON.parse(localStorage[t[0]]);
		if (t[0] == "new") {
			updateNotes(false);
		}
	}
});

// Function to recache notifications
function updateNotes(reCache) {
	idCounter		= 0;
	idCounterTemp 	= 0;
	errorCount 		= 0;
	perPageMore 	= 1;

	if (!userRefresh) { $('div#notes').remove(); }
	//$('div.noteDiv').remove();
	//$('div.noteDiv-hidden').remove();
	$('div#content').append('<div id="notes"></div>');
	$('div#float').attr("class", "float-load");
	preCheckCookies(reCache);
}

function loadMore() {
	$('div#float').attr("class", "float-loadmore");
	preCheckCookies(false, true);
}

// Function that requests the download links from the other scripts
function requestDownload(href) {
	// Grab Info and Links
	//console.log(href);

	grabInfo(href, false, true);
	grabLinks(href, false, true);
	
	startDownload();
}

// Function that tells the background script to start downloading
function startDownload() {
	if (errorReport) {
		errorReport = false;
		//console.log("Error message recieved from the server");
		//console.log(errorMsg.status + ": " + errorMsg.statusText);
		$('div#float').empty();
		$('div#float').append("<b>Error recieved from server, try again.</b>");
		$('div#float').append("<p style='color:red; -webkit-margin-before: 5px; -webkit-margin-after: 0px'>" + errorMsg.status + ": " + errorMsg.statusText + "</p>");
		return;

	}
	//console.log("docReadyInfo: " + docReadyInfo + " & docReadyLink: " + docReadyLink);
	if (docReadyLink && docReadyInfo) {
		chrome.extension.sendMessage({msg: "downloadLinks", linkdata: linkarray, infodata: infoarray})
		docReadyLink = false;
		docReadyInfo = false;
		//console.log("sent message to background");
		$('div#float').empty();
		$('div#float').append("<b>Success! Downloading Now.</b>");
		popup("downloading");

		return;
	}
	setTimeout(startDownload ,20);
}

	var setNewVersion	= false;
	var docReadyLink	= false;
	var docReadyInfo	= false;
	var errorReport		= false;
	var askRecache		= false;
	var userRefresh		= false;
	var errorMsg 		= null;
	//var idCounter		= 0;
	//var idCounterTemp	= 0;
	var errorCount		= 0;
	var perPage 		= localStorage["entry_amount"];
	var perPageMore 	= 1;
	var filterTimer;
	var start;
	var notesToUpdate 	= {};
	var loadedHTML		= false;
	var outOfNotes		= false;
	var lastNote 		= "";
	var popupTimeout;
	var grab_notes		= {};
	localStorage["notes_done_amount"] = 0;


  // Debugging
	var lengthCheckChar = false;
	var lengthCheckDesc = false;

String.prototype.mReplace = function(type) {

	var rMapped;
	var eMapped;

	switch(type) {
		case "char":
		  // Variables mapping what characters translates into what
		  	rMapped = /The\siDOLM@STER\sCinderella\sGirls|the\siDOLM@STER|dark\sskin|monster\sskin|\s&\s|\s+\s|\ |\&|\.|\!|\@|\(|\)|\'|\_|\+|\%|\?|\:|\;|\/|\[|\]|\=|\☆|\★|\α|\×|\Ω|\#|\,|\*|\~|\"|\^|\$|\>|\|/gi;
			eMapped = {
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
				";":"",
				"/":"",
				"[":"",
				"]":"",
				"=":"",

				"#":"",
				",":"",
				"*":"",
				"~":"",
				'"':"",
				"^":"",
				"$":"",
				">":"",
				"|":"",
			  // Specials
				"☆":"byb",
				"★":"bzb",
				"α":"bab",
				"×":"b-b",
				"Ω":"937",
			  // Special cases (hate inconsistencies...)
			  	"The iDOLM@STER":"the-idolmaster",
			  	"The iDOLM@STER Cinderella Girls":"the-idolmster-cinderella-girls",
			  	"dark skin":"darkskin",
			  	"monster girl":"monstergirl",
			};
		break;
		case "desc":
			rMapped = /ahegao|anal|animated|ashikoki|bakunyuu|bara|biting|cheating|chikan|chubby|color|cunnilingus|dark\sskin|decensored|ecchi|fangs|femdom|forced|futanari|glasses|group|gyaru|harem|headphones|hentai|horror|housewife|humiliation|idol|incest|irrumatio|kemonomimi|loli|maid|monster\sgirl|nakadashi|netorare|netori|non-h|nurse|oppai|oral|osananajimi|oshiri|paizuri|pegging|pettanko|pregnant|random|schoolgirl|shibari|shimapan|socks|stockings|swimsuit|tanlines|teacher|tentacles|tomboy|toys|trap|tsundere|vanilla|western|yandere|yaoi|yuri/;
			eMapped = {
				"ahegao":"The Ahegao (アヘ顔, which has often been interpreted as \"weird face\", ahe coming from the Japanese onomatopoeia of \"アヘアヘ(aheahe)\" describing female\'s flushed breath/moaning in sex and her sexual excitement, gao meaning \"face\") is an exploitable phenomenon taking place in pictures of close-up faces from a token character modified in order to have a kind of lust-filled, overly exaggerated orgasmic expression, the eyes usually rolled up with teardrops/sweat at times, the mouth wide open with the tongue sticking out and blushing cheeks.&#10;&#10;Related Tags: forced, humiliation, netorare",
				"anal":"Anal sex refers to the sex act involving insertion of the penis into the anus of a sex partner. Manga with this tag will include scenes of anal sex, either with or without permission from the receiving person.&#10;&#10;Related Tags: forced, netorare, tsundere",
				"animated":"Placeholder: The animated tag is used for manga and doujinshi that contain animated panels.",
				"ashikoki":"Ashikoki (あしこき) is the Japanese term for footjob. A footjob is a sexual act where the genitalia are stimulated by someone\'s feet. Manga with this tag will include these scenes.&#10;&#10;Related Tags: oral, paizuri, stockings",
				"bakunyuu":"This tag is reserved for the most extreme examples of big breasted women. Breasts labeled with tag are unrealistically large (almost comically) in comparison to the woman\'s body.&#10;&#10;Related Tags: paizuri, oppai, chubby",
				"bara":"Bara (薔薇), also known as \"Men\'s Love\" (commonly abbreviated as \"ML\"), is a Japanese term for a genre of art and media that focuses on male same-sex love, usually created by gay men for a gay audience.&#10;&#10;Related Tags: anal, vanilla, yaoi",
				"biting":"Usually refering to biting in a sensual and sexual way.",
				"cheating":"The cheating tag is used for content where one of the characters has a relationship with someone other than their spouse. Usually we are not introduced to the spouse, or they have a very small part in the story. This tag was introduced as a more mild form of netorare.&#10;&#10;Related Tags: housewife, netorare, tsundere",
				"chikan":"Chikan is the Japanese word for public molestation. Usually used in reference to furtive groping and sexual assaults that have become frequent on crowded public trains.&#10;&#10;Related Tags: oral, forced, tsundere",
				"chubby":"A tag for works involving a girl with a little more flesh than your typical hentai girl. This tag can apply for girls who are just a little bigger than normal, to girls who would be considered obese.&#10;&#10;Related Tags: oshiri, oppai",
				"color":"The color tag refers to manga and doujinshi that are entirely in color. Usually full color releases are much more elaborate and more detailed than regular releases and as a result they are much shorter.&#10;&#10;Related Tags: pettanko, stockings, uncensored",
				"cunnilingus":"Describes the act of licking, sucking, etc... of the female partner's vagina.",
				"dark skin":"The \"dark skin\" tag is used for hentai manga and doujinshi that focus on or contain females with dark/tan skin.&#10;&#10;Related Tags: oppai, schoolgirl, tanlines",
				"decensored":"All hentai produced in Japan is censored by law. The law discourages showing genitals in hentai and all other forms of pornography. This is why most hentai will make use of black bars, mosaics, or a blur effect to hide genitalia. That said, you will find hentai with this tag completely uncensored. This is accomplished by having artists go in afterward, remove the censorship, and redraw the missing parts.&#10;&#10;Related Tags: color, ecchi",
				"ecchi":"Ecchi describes a genre of manga and anime which is seen as a softer variant of hentai. For the most part it does not show sexual intercourse, but can show: panty shots, nudity, and perverted situations. Most of the time we use this tag for anything that does not contain any hentai.&#10;&#10;Related Tags: mizugi, shimapan, vanilla",
				"fangs":"Usually describing characters with sharp teeth.",
				"femdom":"Femdom, the shortened term for female dominance, irefers to relationships or sexual scenes where the dominant partner is female. This is frequently associated with BDSM or S&M, a type of roleplay between two or more individuals derived from the terms bondage and discipline. Manga with this tag will contain females character that are assertive and dominant over the other partner.&#10;&#10;Related Tags: futanari, yandere, yuri",
				"forced":"\"Forced\" is a more elegant way of saying rape. Manga with this tag will contain heavy elements of rape. This includes forced sexual intercourse (mainly by men on women) using either physical strength, threat, or surprise. This theme is very common and accepted in Japan.&#10;&#10;Related Tags: chikan, netorare",
				"futanari":"Futanari (二成, 二形; ふたなり) is a genre of Japanese anime and manga featuring hermaphrodite women; women with male genitalia. Due to the way it is executed, futanari is most closely related to the yuri genre, both generally feature women as the main characters.&#10;&#10;Related Tags: kemonomimi, tentacles, yuri",
				"glasses":"Megane is the Japanese term for glasses. Hentai with this tag will contain characters that wear glasses.&#10;&#10;Related Tags: harem, mizugi, shimapan",
				"group":"The group tag is used for manga that include threesomes and beyond. Most often this will include multiple male partners on a single female, but it also includes group situations where multiple couples are performing at the same time and in the same vicinity.&#10;&#10;Related Tags: harem, oral, schoolgirl",
				"gyaru":"A girl with a tan, natural or otherwise, and dyed/bleached blonde hair, usually combined with excessive use of make-up and jewelry. &#10;&#10; Synonyms: Ganguro, ガングロ, Yamanba, ヤマンバ, Manba, マンバ, Kogyaru, コギャル",
				"harem":"Harem is a subgenre of anime and manga characterized by a protagonist surrounded by three or more members of the opposite sex. The most common scenario is a male surrounded by a group of females; when this is reversed it is referred to as a reverse harem. Manga with this tag usually have multiple female partners and one male, with each female personifying a popular character type.&#10;&#10;Related Tags: group, oral, schoolgirl",
				"headphones":"Cute girls wearing headphones!",
				"hentai":"Hentai (変態 or へんたい) is a Japanese word that, in the West, describes sexually explicit or pornographic comics and animation—especially those of Japanese origin, such as anime, manga, and eroge. On FAKKU we use the \"hentai\" tag to differentiate heterosexual content (hentai) from homosexual content (yaoi and yuri).&#10;&#10;Related Tags: vanilla, yaoi, yuri",
				"horror":"Works intended to be scary, creepy, or shocking. Often includes some supernatural element such as ghosts, monsters, etc... However, they can also just explore the darker parts of human nature.",
				"housewife":"Housewife is a term used to describe a married female who is not employed outside of the home, instead she manages the household while her husband works. Manga with this tag involve housewives while they are at home. Additionally it is used in place of a MILF tag.&#10;&#10;Related Tags: incest, netorare, oppai",
				"humiliation":"Manga and doujinshi with the humiliation tag will contain scenes where a character is put in a state of disgrace or loss of self-respect. This will most often be forced upon them unwillingly and be in some type of public setting.&#10;&#10;Related Tags: chikan, forced, shibari",
				"idol":"Works which predominantly feature Idols. Idols are characterized as young, cute girls famous for their singing, dancing, and fashion.",
				"incest":"Incest, more commonly referred to as wincest, is the taboo involving sexual intercourse between close relatives. The idea of forbidden love is the main appeal behind incest. Though many people enjoy these stories, it is often much less appealing in real life.&#10;&#10;Related Tags: tsundere, vanilla",
				"irrumatio":"A step up from a standard blowjob, the term Irrumatio is used to describe the act of (often roughly) \"fucking someone\'s face\". Generally involves deepthroating.&#10;&#10;Related Tags: oral, forced",
				"kemonomimi":"Kemonomimi refers to characters with animal characteristics, such as cat ears, cat tails, etc. Generally these characters appear mostly human despite their animal characteristics.&#10;&#10;Related Tags: megane, tentacles, vanilla",
				"loli":"A slang term for a childlike female character.",
				"maid":"Maid outfits are extremely popular in Japan and are frequently worn in anime and manga. The most common style of Japanese maid outfit consists of a traditional French maid costume with an apron. Generally, Japanese maid costumes are usually one-piece above the knee and black/navy blue colored. Typically they include a short apron with frill and the skirt area of the dress is usually pleated. If knickers or petticoats are worn with it, they are usually ruffled (and the dress is sometimes short enough to display them).&#10;&#10;Related Tags: housewife, stockings, teacher",
				"monster girl":"Monster girls are \"exotic\" beings (monsters, demons, aliens, etc) that are either part human or bear a strong resemblance to a human female. Manga with this tag most often include strong female monster that capture a human male. For more fun check out Monmusu Quest, a visual novel involving monster girls.&#10;&#10;Related Tags: femdom, kemonomimi, tentacles",
				"nakadashi":"Nakadashi (なかだし) is the act of cumming inside (aka creampie).",
				"netorare":"Netorare (寝取られ), also referred to as NTR or cuckold, is a genre where the intent is to cause an emotion of deep jealousy or distress in the reader. A direct translation of the word results in the definition \"having your lover taken from you\" or \"to have something taken from you while you sleep\". This is often accomplished by having main protagonist\'s loved one seduced away from them, with or without their knowledge.&#10;&#10;Related Tags: forced, tsundere",
				"netori":"Netori (寝取り) is similar to Netorare, but rather than the main character having their lover stolen from them, they are the ones stealing a lover from someone else.",
				"non-h":"This tag is used for content that has sexually suggestive scenes, but does not have any hentai or actual sex.&#10;&#10;Related Tags: ecchi, random, vanilla",
				"nurse":"This tag is used for manga and doujinshi that contain female characters that are wearing nurse outfits, though they do not necessarily need to be actual nurses. Most of these stories will take place inside of a hospital.&#10;&#10;Related Tags: femdom, housewife, main",
				"oppai":"Oppai (おっぱい) is the Japanese slang word for breasts, generally used to refer to the larger variety. Naturally large breasts are somewhat rare in Japan, but in hentai they are quite frequent.&#10;&#10;Hentai manga and doujinshi with the tag \'oppai\' will involve characters with large breasts, but not excessively large.&#10;&#10;Related Tags: paizuri, pettanko",
				"oral":"Oral sex, known as fellatio when performed on a man and cunnilingus when performed on a female, is a sexual activity involving the stimulation of the genitalia by the use of the mouth. People may engage in oral sex as part of foreplay before or following sexual intercourse. It may also be performed for its own sake. Manga and doujinshi with this tag will contain a substantial amount of oral sex.&#10;&#10;Related Tags: paizuri, vanilla",
				"osananajimi":"Osananajimi (幼馴染) is a commonly-used term to represent a childhood friend of the main character. Usually the friend is in love with the main character but has never had the courage to tell them.&#10;&#10;Related Tags: harem, megane, vanilla",
				"oshiri":"So I heard you are an ass man?",
				"paizuri":"Paizuri (パイズリ), also known as titty-fucking or a titfuck in the United States, involves the stimulation of the male penis by the female breasts. Commonly, this sex act involves the man placing his penis in the woman\'s cleavage and thrusting between the breasts while they are squeezed together for stimulation. Frequently combined with oral sex.&#10;&#10;Related tags: housewife, oppai, oral",
				"pegging":"The act of a woman pentrating the ass of a man with some inanimate object. Usually involves some kind of sex toy (strap-on, dildo, vibrator, etc...) and is often associated with femdom and bondage play.&#10;&#10;Related Tags: anal, femdom, shibari",
				"pettanko":"Pattanko (ぺったんこ) is the Japanese term for a flat-chested female character that is not under age. Manga with this tag will include characters that are obsessive and/or insecure about this fact.&#10;&#10;Related Tags: ecchi, schoolgirl, tsundere",
				"pregnant":"Placeholder: Sexual intercourse with someone who is pregnant, possibly even someone who gets impregnated.",
				"random":"The random tag is used for manga and doujinshi that are out of the ordinary. Sometimes that means they are funny, sometimes that means they are gross, and sometimes that means they are just plain weird. So be careful browsing the random section, you never know what you\'ll get.&#10;&#10;Related Tags: futanari, non-h, trap",
				"schoolgirl":"Manga with the schoolgirl tag will include characters that are either in primary or secondary school. Most of the time the story will take place at school or the characters will be wearing their school uniforms. The sailor outfit (セーラー服) is the most common style of uniform worn by female students in Japan, and the majority of manga with this tag will feature it.&#10;&#10;Related Tags: megane, netorare, vanilla",
				"shibari":"Shibari (縛り) is a word used by westerners to describe the bondage art Kinbaku (緊縛). Shibari literally means \"to tie\" or \"to bind\". It is used to describe the Japanese style of sexual bondage or BDSM which involves tying up a partner using simple yet visually intricate patterns, usually with several pieces of thin rope.&#10;&#10;Related Tags: femdom, forced, toys",
				"shimapan":"Shimapan is an abbreviation of shima-pantsu (striped panties) and have become quite popular due to their frequent use in anime and manga. The most popular variety come in the colors blue and white.&#10;&#10;Related Tags: ecchi, schoolgirl, stockings",
				"socks":"Sometimes characters are just wearing socks, not quite thigh-highs or stockings.&#10;&#10;Related Tags: harem, schoolgirl, stockings",
				"stockings":"Stockings, also referred to as thigh highs or kneesocks, are a close-fitting, elastic garment covering the foot and lower part of the leg. Stockings vary in color, design and transparency. All women should wear stockings, because they are awesome.&#10;&#10;Related Tags: maid, schoolgirl, shimapan",
				"swimsuit":"Mizugi is the Japanese term for a woman\'s swimsuit or bathing suit. This tag can be used to refer specifically to school swimsuits, which are generally one-piece and blue in color.&#10;&#10;Related Tags: chikan, megane, pettanko",
				"tanlines":"Tan lines refers to a division between areas on the skin of pronounced paleness relative to other areas of skin that have been suntanned and are noticeable darker. This tag also includes ganguro fashion, where girls have a deep tan combined with hair dyed blonde.&#10;&#10;Related Tags: mizugi, shimapan, vanilla",
				"teacher":"The teacher tag is used for manga that contain teachers who are most often in dominant positions over their students. The Japanese word for teacher is sensei (先生) and it is commonly used as the translation to describe them in anime and manga.&#10;&#10;Related Tags: femdom, paizuri, schoolgirl",
				"tentacles":"Tentacles are a genre of hentai where various tentacled creatures (usually monsters) rape or otherwise penetrate women. It is a very uncommon theme, yet it has come to define the genre by most people who are unfamiliar with hentai.&#10;&#013Related Tags: futanari, kemonomimi",
				"tomboy":"A tomboy is a girl who exhibits characteristics or behaviors considered typical of the gender role of a boy, including the wearing of typically masculine-oriented clothes and engaging in games and activities that are often physical in nature, and which are considered in many cultures to be the domain of boys. Occasionally, such girls are called tomgirls.&#10;&#10;Related Tags: femdom, futanari, trap",
				"toys":"A sex toy is an object or device that is primarily used to facilitate human sexual pleasure. The most popular sex toys are designed to resemble human genitals and may be vibrating or non-vibrating. Manga with this tag will include the use of sex toys, both willingly or unwillingly.&#10;&#10;Related Tags: housewife, shibari, tentacles",
				"trap":"A trap refers to a male character that is dressed up as a female; this often leads to yaoi. In most cases the male character has very feminine characteristics and could be confused for a female.&#10;&#10;Related Tags: futanari, toys, yaoi",
				"tsundere":"Tsundere (ツンデレ) is a Japanese character development process which describes a person who is initially cold and even hostile towards another person before gradually showing their warm side over time. The word is derived from the terms tsun tsun (ツンツン), meaning to turn away in disgust, and dere dere (デレデレ) meaning to show affection.&#10;&#10;Related tags: anal, pettanko, yandere",
				"vanilla":"The vanilla tag refers to manga and doujinshi that do not contain anything out of the ordinary or unusual. The majority of stories will be cute and romantic, involving only one boy and one girl falling in love.&#10;&#10;Related Tags: ecchi, incest, tsundere",
				"western":"The western tag is used to represent work produced outside of Japan.",
				"yandere":"Yandere is a Japanese term for a person who is initially very loving and gentle before their devotion becomes destructive in nature, often through violence. The term is derived from the words yan (ヤン) meaning a mental or emotional illness and dere dere (デレデレ) meaning to show affection. Yandere characters are mentally unstable, often using extreme violence as an outlet for their emotions.&#10;&#10;Related Tags: femdom, netorare, tsundere",
				"yaoi":"Yaoi (やおい) also known as Boys\' Love (commonly abbreviated as \"BL\"), is a popular Japanese term for female-oriented fiction that focus on homoerotic or homoromantic male relationships, usually created by female authors. The two participants in a yaoi relationship are often referred to as seme (the top) and uke (the bottom).&#10;&#10;Related Tags: bara, ecchi, yuri",
				"yuri":"Yuri (百合) is a genre involving love between women in manga and anime. Yuri can focus either on the sexual, the spiritual, or the emotional aspects of the relationship, the latter two sometimes being called shōjo-ai. Manga with the yuri tag will contain relationships exclusively between women.&#10;&#10;Related Tags: futanari, vanilla, yaoi",
			};
		break;
	}

  // Check if rMapped is same "length" as eMapped. Debug only.
	if(lengthCheckChar && type == "char" || lengthCheckDesc && type == "desc") {
		if(rMapped.toString().replace(/\\\|/, "").split("|").length != Object.keys(eMapped).length) {
			console.error("Could not match length of map: " + type);
		}

		if(type == "char") { lengthCheckChar = false; }
		if(type == "desc") { lengthCheckDesc = false; }
	}

	  // Return the mapped value.
	  	return this.toLowerCase().replace(rMapped, function(matched) {
							return eMapped[matched];
						});
};


// Function to filter notifications
var filter = {
	add: function() {
		$('a#filter').off("mousedown");
		$('a#filter').on("mousedown", function(event) {
			event.preventDefault();
			$('div#menu div.right').prepend('<div><input id="filterInput" type="text" placeholder="Filter by tag" title="Input a tag and hit enter to begin filtering, separate tags by space." style="padding-right: 5px;"></div>');
			$('div#menu div.right').on("keyup", function() { filter.filter(); });

			filter.rem();
		});
	},
	rem: function() {
		$('a#filter').off("mousedown");
		$('a#filter').on("mousedown", function(event) {
			event.preventDefault();
			$('input#filterInput').remove();
			$('div#menu div.right').off("keyup");

			$('div.noteDiv-matched').attr('class', 'noteDiv');
			$('div.noteDiv-filtered').attr('class', 'noteDiv');

			filter.add();
		});
	},
	filter: function() {
		clearTimeout(filterTimer);
		filterTimer = setTimeout(function(event) {
			var input = $('input#filterInput').val().toLowerCase().split(/, | /);

			$('div.noteDiv-matched').attr('class', 'noteDiv');
			$('div.noteDiv-filtered').attr('class', 'noteDiv');

		  // For each noteDiv
			if (input[0] !== "") {
				$('div.noteDiv').each(function(index, div) {
					var tagArray = [];
					var matched = 0;
					var i = input.length;
				  // Grab tags
					$(div).find('div#right div.row-left-full a').each(function(i, val) {
						tagArray.push($(val).text().toLowerCase());
					});
				  // For each tag match & if matched then increase match count until the match count is the same as input length.
				  // If the matched count and the input length is the same hide other divs
					input.forEach(function (value) {
						//var regex = new RegExp("\\b"+value+"\\b"); //Matches whole word
						if (tagArray.toString().match(value)) {
							matched++;
							if (matched == i) {
								$(div).attr('class', 'noteDiv-matched');
							}
						}
					});
					matched = 0;
				});
			  // Hide the divs that were not matched
				$('div.noteDiv').attr('class', 'noteDiv-filtered');
			}
		}, 250);
	},
};

// Turning the lights on/off
var lights = {
	on: function() {
		// $('#float').fadeOut(100).hide();
		// $('#whiteWrapper').fadeOut(300);
		$('#whiteWrapper').hide();
		$('#whiteWrapper').off();
	},
	off: function() {
		// $('#whiteWrapper').on('click', function() {
		// 	lights.on();
		// });
		$('#whiteWrapper').css("opacity", "0.6").show();
		// $('#whiteWrapper').fadeTo(300, 0.6);
	}
};

// Function for removing the popup download box
var popup = {
	add: function(from) {
		var avoidID = [from, "download", "hidediv", "askRecache", "float", "loadingtrial", "loadingtrailnotes", "yes", "load-more"];

		clearTimeout(popupTimeout);

		if (from != "downloadClicked" && from != "askRecache") {
			popupTimeout = setTimeout(popup.remove, 750);
		}

		$(document, '#whiteWrapper').on("click", function(event) {
			event.preventDefault();
			if($.inArray(event.target.id, avoidID) === -1 && $.inArray(event.target.parentNode.id, avoidID) === -1) {
				popup.remove();
			}
		});
	},
	remove: function(from) {
		lights.on();
		$('div#float').hide();
		$('div#float').empty();
		$('div#float').css("left", null);
		$('div#float').css("top", null);
		$(document).off("click");
		clearTimeout(popupTimeout);

		if (from == "removeClicked") {
			storeContent();
		}
	}
};

// Create clickable menu
$(document).ready(function() {
	$('a#refresh').on("click", function(event) { event.preventDefault(); refreshNotes(); });

	$('a#recache').on("click", function(event) { event.preventDefault(); recacheNotes(true); });

	$('a#loadmore').on("click", function(event) { event.preventDefault(); loadMore(); });

	$('a#filter').mouseup(function(event) { event.preventDefault(); });

	filter.add();
});

// Queue function
// Thanks to debuggable for this. (http://bit.ly/dBugQFunc)
$.notequeue = {
    _timer: null,
    _queue: [],
    add: function(fn, context, time) {
        var setTimer = function(time) {
            $.notequeue._timer = setTimeout(function() {
                time = $.notequeue.add();
                if ($.notequeue._queue.length) {
                    setTimer(time);
                }
            }, time || 2);
        };

        if (fn) {
            $.notequeue._queue.push([fn, context, time]);
            if ($.notequeue._queue.length == 1) {
                setTimer(time);
            }
            return;
        }

        var next = $.notequeue._queue.shift();
        if (!next) {
            return 0;
        }
        next[0].call(next[1] || window);
        //console.log("Left of Queue: " + $.notequeue._queue.length);
        return next[2];
    },
    clear: function() {
        clearTimeout($.notequeue._timer);
        $.notequeue._queue = [];
    }
};

checkLoggedIn({reCache: false, loadmore: false}); // Run checkLoggedIn function

// Check if Login cookie has expired.
function checkLoggedIn(object) {
	start = new Date().getTime();
	var notesAmount;
	var perPageMax;
	var doArrayLength;
	var nArrayNames = JSON.parse(localStorage["n_array_names"]);
	var doArray 	= [];
	var new_nArrayNames = [];
	
	var loadNote = function(name, bypass) {
		lastNote = name;

		if (JSON.parse(localStorage[name])[0] == "old" && !object.reCache || bypass) {
			var self = this, doBind = function() {
				var nNote = JSON.parse(localStorage[name]);
				var nInfo;
				if (localStorage[nNote[2].replace("https://www.fakku.net", "") + "--info"]) {
					nInfo = JSON.parse(localStorage[nNote[2].replace("https://www.fakku.net", "") + "--info"]);
				}
				//console.log(nNote);
				//console.log(nInfo);
			  // Check if manga exists and reCache is false
				if (nInfo && !object.reCache && nNote[0] == "old" && nInfo[1] != "error" || nInfo && !object.reCache && nNote[0] == "old" && nInfo[1] == "error" && nInfo[2].toString().match(/(404|410|411)/)) {
				  // If it does exist do...
				  	grab_notes[name].isNew = false;

					notificationInfo({
						infodata: JSON.parse(localStorage[nNote[2].replace("https://www.fakku.net", "") + "--info"]),
						href: nNote[2],
						age: nNote[3],
						isNew: nNote[0],
						isHidden: nNote[5],
						appendType: "append",
						name: name,
						from: "loadnote",
						reCache: object.reCache,
						loadmore: object.loadmore
					});
					
				} else {
				  // If it does not exist do...
				  	grab_notes[name].isNew = true;

					fakku.getInfo({
						href: nNote[2],
						age: nNote[3],
						isNew: nNote[0],
						isHidden: nNote[5],
						appendType: "prepend",
						name: name,
						from: "notes",
						reCache: object.reCache,
						loadmore: object.loadmore
					});
				}
			  // Update the app_version localStorage to current version
				if (doArray[doArray.length - 2] == name && (localStorage["app_version"] != chrome.app.getDetails().version || !localStorage["app_version"])) {
					setNewVersion = true;
				}
	        };
	        $.notequeue.add(doBind, this);
	    } else {
	    	new_nArrayNames.unshift(name);
	    }
	};
	
	chrome.cookies.get({url: "https://www.fakku.net", name: "fakku_sid"}, function(results) {
		if (!results || localStorage["badge_number"] === "Err") {
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
					object.reCache = true;
				} else {
					var currentVersion 	= chrome.app.getDetails().version.replace(/\./g, "");
					var oldVersion		= localStorage["app_version"].replace(/\./g, "");
					var diff 			= currentVersion.slice(1, 2) - oldVersion.slice(1, 2);

					if (diff >= 1 || diff <= -1) {
						askRecache = true;
					}
				}
			}

		  // Gather and create notifications 
		  	$('div#content').css("width", "545px");
		  	//$('div#content').css("height", "600px");
		  	if (object.reCache || localStorage["new_note"] == "true" || object.loadmore) {
		  		lights.off();
		  		$('div#float').empty();
				$('div#float').show();
				$('div#float').prepend("<div id='loading' class='loadingtrailnotes'></div>");
		  	}
		  	
		  	//loadmore && perPage > nArrayNames.length - parseInt(localStorage['notes_done_amount'])
		  	if (perPage == "all" || perPage > nArrayNames.length && !object.loadmore) {
		  		doArray = nArrayNames;
		  	} else if(object.loadmore) {
		  		notesAmount = parseInt(localStorage['notes_done_amount']);
		  		doArray = nArrayNames.slice(notesAmount, (notesAmount + parseInt(perPage)));
		  		//console.log(nArrayNames.slice(parseInt(localStorage['notes_done_amount'])));
		  	} else {
		  		parsePerPage = parseInt(perPage) - 1;
		  		perPageMax 	= perPageMore + parsePerPage;
		  		
		  		while (perPageMore <= perPageMax) {
			  		doArray.push(nArrayNames[perPageMore - 1]);
			  		perPageMore++;
		  		}
		  	}
		  	doArrayLength = doArray.length;
			localStorage["notes_done_amount"] = doArrayLength + parseInt(localStorage["notes_done_amount"]);

			if(doArrayLength === 0) {
				outOfNotes = true;
				loadMore();
				return;
			}
		  // For each arrayname in localstorage
			doArray.forEach(function(name) {
				grab_notes[name] = {
			  		status: "working"
			  	};

				try {
					if(name !== undefined) {
						loadNote(name, false);
					} else {
						outOfNotes = true;
						loadMore();
						return;
					}
				} catch(e) {
					console.error(e);
				}
			});
			new_nArrayNames.forEach(function(name) {
			  	loadNote(name, true);
			});
		}
	});
}

// Function waiting for the information from GrabInfo
function notificationInfo(object, notes) {

  // Variables
	var tagArray 		= [];
	var artistArray		= [];
	var translatorArray	= [];
	var seriesArray 	= [{attribute: "Not Specified", attribute_link: "/none"}];
	var error 			= false;
 
  // Div variables
	var divName 		= object.name.replace("--note", "").replace("/", "").replace("/", "-");
	var divTags 		= "";
	var divArtists 		= "";
	var divTranslators 	= "";
	var languageClass 	= "";
	var divDate 		= "";
	var languageLink;

	if (object.infodata[1] == "error") {

		if(object.infodata[2] == "200") {
			$('div#error').empty();
			$('div#error').append("<b>The Fakku API appears to be down, try again later.</b>");
			$('div#error').show();
		}

		error = true; 
		console.log("%cError Parsing: %c" + object.infodata[3], "color: red;", "color: black;"); 
		console.log("%cError Message: %c" + "(" + object.infodata[2] + ") " + object.infodata[4], "color: red;", "color: black;");
	}
	if (object.infodata[3] && !error)  { seriesArray 		= object.infodata[3]; }
	if (object.infodata[5] && !error)  { languageLink 		= object.infodata[5].mReplace("char").toLowerCase();}
	if (object.infodata[7] && !error)  { tagArray 			= object.infodata[7]; }
	if (object.infodata[4] && !error)  { artistArray 		= object.infodata[4]; }
	if (object.infodata[6] && !error)  { translatorArray 	= object.infodata[6]; }

	var seriesName = seriesArray[0].attribute;
	var seriesLink = seriesArray[0].attribute.mReplace("char").toString().toLowerCase(); 

  // Check if the stored html should be appended
	if (!loadedHTML && !object.reCache && !userRefresh) {
		loadedHTML = true;
	  // Append content to body
		$('div#notes').append(JSON.parse(localStorage["html_content"]));
	} else if (object.reCache) {
		loadedHTML = true;
	}
	//idCounter++

  // Update time
	if (object.infodata[11] && !error) {
		var nDate 		= Math.round(new Date().getTime()/1000);
		var mDate 		= object.infodata[11];
		var hoursDiff	= nDate - mDate;
		var timeSince	= {
				days: Math.floor(hoursDiff / 86400),
				hours: Math.floor(hoursDiff / 3600),
				minutes: Math.round(hoursDiff / 60)
			};
		var endText;

		if (timeSince.days >= 1) {
			object.age = timeSince.days;
			if (timeSince.days == 1) { endText = " day ago"; } else { endText = " days ago"; }
		} else if (timeSince.hours >= 1) {
			object.age = timeSince.hours;
			if (timeSince.hours == 1) { endText = " hour ago"; } else { endText = " hours ago"; }
		} else {
			object.age = timeSince.minutes;
			if (timeSince.minutes <= 1) { endText = " minute ago"; } else { endText = " minutes ago"; }
		}
		object.age = object.age + endText;
		if (object.appendType == "append") {
			$('div#'+ divName +' div#right div.wrap div.row-small div.right i').text(object.age);
		}

		//divDate = timeSince.minutes;
		divDate = new Date(mDate*1000);
	}

	if (object.appendType == "prepend" || object.reCache || object.loadmore) {
		//idCounterTemp = //idCounter;
		//idCounter = $('div#content div#notes div.noteDiv').length + 1;
		
	  // Make sure items get appended if action is loadmore
	  	if(object.loadmore) { object.appendType = "append"; }

	  // Adds "--info" to the end of the href string to match the name in localStorage
		localStorage[object.href.replace("https://www.fakku.net", "") + "--info"] = JSON.stringify(object.infodata);
			
	  // Create divs
		if (object.infodata[2] && !error) {
			////idCounter++;

			// For each in array do...
			  // Create Tags Link
				tagArray.forEach(function(e, i) {
					var er = e.attribute.mReplace("char").toLowerCase();
				  // If last in array do not use ", "
					if (tagArray[tagArray.length - 1] == e) {
						divTags += '<a id="'+ er +'" href="#" title="'+ $('<div/>').html(e.attribute.mReplace("desc")).text() +'">'+ e.attribute +'</a>';
					} else {
						divTags += '<a id="'+ er +'" href="#" title="'+ $('<div/>').html(e.attribute.mReplace("desc")).text() +'">'+ e.attribute +'</a>, ';
					}
				});
			  // Create Artists Link"
				artistArray.forEach(function(e) {
					var er = e.attribute.mReplace("char").toLowerCase();

				  // If last in array do not use ", "
					if (artistArray[artistArray.length - 1] == e) {
						divArtists += '<a id="'+ er +'" href="#">'+ e.attribute +'</a>';
					} else {
						divArtists += '<a id="'+ er +'" href="#">'+ e.attribute +'</a>, ';
					}
				});
			  // Create Translators Link"
				translatorArray.forEach(function(e) {
					var er = e.attribute.mReplace("char").toLowerCase();

				  // If last in array do not use ", "
					if (translatorArray[translatorArray.length - 1] == e) {
						divTranslators += '<a id="'+ er +'" href="#">'+ e.attribute +'</a>';
					} else {
						divTranslators += '<a id="'+ er +'" href="#">'+ e.attribute +'</a>, ';
					}
				});

			  // Main Div
				if (object.appendType == "append") {
					$('div#content div#notes').append('<div id="'+ divName +'" class="noteDiv"></div>');
				} else {
					//idCounter = 1;
					$('div#content div#notes').prepend('<div id="'+ divName +'" class="noteDiv"></div>');
				}

			  // Assign language class
				if (object.infodata[5] == "english") {
					languageClass = "english";
				} else {
					languageClass = "non-english";
				}

			  // Left Div Content
				$('div#'+divName).append('<div id="left">'+
					'<div class="wrap">'+
						'<div class="images">'+
							'<span class="fakkubooks">'+
								'<p>Fakku!</p>'+
								'<p>Books</p>'+
							'</span>'+
							'<img class="cover" src="'+ object.infodata[9] +'" itemprop="image">'+
							'<img class="cover" src="'+ object.infodata[10] +'" itemprop="image">'+
						'</div>'+
						'<ul>'+
							'<li><a id="read-online" href="#">Read Online</a></li>'+
							'<li><a id="download" href="#">Download</a></li>'+
						'</ul>'+
					'</div>'+
				'</div>');
			
			  // Right Div Content
				$('div#'+divName).append('<div id="right">'+
					'<div class="wrap">'+
						'<div id="hidediv">'+
							'<a title="Remove" class="close flaticon-cross108"></a>'+
						'</div>'+
						'<div class="content-name">'+
							'<h1>'+ object.infodata[2] +'</h1>'+
						'</div>'+
						'<div class="row">'+
							'<div class="left">Series: <a id="'+ seriesLink +'" href="#">'+ seriesName +'</a></div>'+
							'<div class="right">Language: <span class="'+ languageClass +'"><a id="'+ languageLink +'" href="#">'+ object.infodata[5] +'</a></span></div>'+
						'</div>'+
						'<div class="row">'+
							'<div class="left">Artist: '+ divArtists +'</div>'+
							'<div class="right">Translator: <span class="english">'+ divTranslators +'</span></div>'+
						'</div>'+
						'<div class="row-small">'+
							'<div class="left"><b>'+ object.infodata[1] +'</b> Pages</div>'+
							'<div class="right" title="'+ divDate +'"><i>'+ object.age +'</i></div>'+
						'</div>'+
						'<div class="hr"></div>'+
						'<div id="description" class="row-left-full" itemprop="description"><b>Description: </b>'+ object.infodata[8] +'</div>'+
						'<div class="row-left-full" itemprop="keywords"><b>Tags: </b>'+ divTags +'</div>'+
					'</div>'+
				'</div>');

			  // Description dropdown
				if ($('div#'+ divName +' div#right div.wrap div#description.row-left-full').height() > 32) {

				  // Create dropdown button
				  	$('div#'+ divName +' div#right div.wrap div#description.row-left-full').css("height", "32px");
				  	$('div#'+ divName +' div#right div.wrap div#description.row-left-full').css("overflow", "hidden");
				  	$('div#'+ divName +' div#right div.wrap div#description.row-left-full b').css("cursor", "pointer");
				  	$('div#'+ divName +' div#right div.wrap div#description.row-left-full b').html("\&#9658\;Description:");

					}
			  // Fix left div height
				$('div#'+ divName +' div#left div.wrap div.images').css("height", $('div#'+ divName +' div#right').height() - 60);
				$('div#'+ divName +' div#left div.wrap div.images img').css("height", "100%");

			  // Show fakku books mark
				if(object.infodata[12]) {
					$('div#'+ divName +' div#left div.wrap span.fakkubooks').show();
				}

			// End of create 

		  // Change class to hidden if true
			if (object.isHidden == "hidden") {
				$('div#'+divName).attr("class", "noteDiv-hidden");
			}
		  // Remove unused Divs
		  	if ($('div#'+ divName +' div#right div.wrap div.row:nth-of-type(4) div.right span').text() === "") {
		  		$('div#'+ divName +' div#right div.wrap div.row:nth-of-type(4) div.right span').html("<a>Not Specified</a>");
		  		$('div#'+ divName +' div#right div.wrap div.row:nth-of-type(4) div.right span').attr("class", "japanese");
		  	}
		} // End of create divs
	} // End of if prepend statement
	// If error then increase errorCount
	if (error) {
	  //console.log("Increased errorcount");
		errorCount++;
	}
	
	// Run function that will attach Event Listeners to page
	if (!error && !userRefresh || !error && object.appendType == "prepend") {
		attachEventListeners(divName, object.href, seriesLink, languageLink, tagArray, artistArray, translatorArray, seriesArray);
	}

  // If div position was set to prepend
  	if (object.appendType == "prepend") {
  		//idCounter = //idCounterTemp;
  	}
  // If new change to old to indicate that the entry has been seen
	if (object.isNew == "new") {
		var note = JSON.parse(localStorage[object.href.replace("https://www.fakku.net", "") + "--note"]);
		note[0] = "old";
		notesToUpdate[object.href.replace("https://www.fakku.net", "") + "--note"] = JSON.stringify(note);
		//localStorage[object.href.replace("https://www.fakku.net", "") + "--note"] = JSON.stringify(note);
	}

	//console.log("//idCounter: "+//idCounter)
	//console.log("arrayLength: "+JSON.parse(localStorage["n_array_names"]).length)
	//console.log("errorCount: "+errorCount)

  // If this is the last notifiction then... (Might need a new way to do this later, as it will most likely break if I decide to not load ALL the notifications at once)
  	var extra = 0;
  	if (object.loadmore) {
  		extra = perPageMore - parseInt(localStorage["notes_done_amount"]) - 1;
  	}
		
	// }
  // Check if last note in list
  	//console.log("From: "+from);
  	//console.log("noteName: "+noteName);
  	if(object.from === "loadnote") {
  		if(object.name == lastNote) {
			//console.log("notesDone triggered");
			notesDone(object.appendType, object.loadmore, errorCount);
		}
  	} else {
  		var isDone = true;

		for(var _note in grab_notes) {
	  		if(grab_notes.hasOwnProperty(_note)) {
	  			if(grab_notes[_note].status !== "done" && grab_notes[_note].isNew) {
					isDone = false;
				}
	  		}
	  	}

	  	if(isDone) {
	  		notesDone(object.appendType, object.loadmore, errorCount);
	  	}
  	}
	
}

function attachEventListeners (divName, href, seriesLink, languageLink, tagArray, artistArray, translatorArray, seriesArray) {
  // Div actions
  	newTabLink(divName, href, "read-online");
	newTabLink(divName, "series", seriesLink, seriesArray[0].attribute_link);
	newTabLink(divName, "", languageLink);

  // Description Dropdown click action
	$('div#'+ divName +' div#right div.wrap div#description.row-left-full b').mousedown(function(event) {
		if ($(event.target.parentNode).height() > 32) {
		  // Hide dropdown
			$(event.target.parentNode).css("height", "32");
			$(event.target).html("\&#9658\;Description: ");
		} else {
		  // Show dropdown
		  	$(event.target.parentNode).css("height", "");
		  	$(event.target).html("\&#9660\;Description: ");
		}
	});
	  // Description links click action
  	$('div#'+ divName +' div#right div.wrap div#description.row-left-full a').on('click', function(event) {
		event.preventDefault();
		openTab(event.currentTarget.href);
	});

  // Download click action
	// Had to use mousedown and mouseup instead of click because requestDownload was triggered first for some reason.
	$('div#'+ divName +' a#download').mousedown(function(event) {
	  // If left mouse button clicked, trigger download event
		if(event.button === 0) {
			event.preventDefault();
			var x=event.clientX; 
			var y=event.clientY;
			var offsetY=$(document).scrollTop();
			//console.log(x + ", " + y);
			//console.log($(document).scrollTop());
			//lights.off();
			$('div#float').empty();
			$('div#float').show();
			$('div#float').prepend("<div id='loading' class='loadingtrail'></div>");
			$('div#float').append("<b>Preparing Download</b>");
			$('div#float').css("left", x + 15);
			$('div#float').css("top", y + offsetY - 10);
			popup.add("downloadClicked");
		}
	});
	$('div#'+ divName +' a#download').mouseup(function(event) {
		if(event.button === 0) {
			event.preventDefault();
			requestDownload(href);
		}
	});
  // Hide/Remove div click action
	$('div#'+ divName +' .close').mousedown(function(event) {
		if(event.button === 0) {
			event.preventDefault();
			var x=event.clientX; 
			var y=event.clientY;
			var offsetY=$(document).scrollTop();
			//console.log(x + ", " + y);
			//console.log($(document).scrollTop());
			//lights.off();
			$('div#float').empty();
			$('div#float').show();
			$('div#float').append("<b>Removed</b>");
			$('div#float').css("left", x - 90);
			$('div#float').css("top", y + offsetY);
			localStorage[href.replace("https://www.fakku.net", "") + "--note"] = localStorage[href.replace("https://www.fakku.net", "") + "--note"].replace("shown", "hidden");
			$(event.target.parentNode.parentNode.parentNode.parentNode).animate({height: "toggle"}, 350);
			popup.add("removeClicked");
		}
	});
	$('div#'+ divName +' .close').mouseup(function(event) {
			event.preventDefault();
		});

// For each in array do...
  // Create Tags Link
	tagArray.forEach(function(e) {
		var er = e.attribute.mReplace("char").toLowerCase();

	  // If last in array do not use ", "
		if (tagArray[tagArray.length - 1] == e) {
			newTabLink(divName, "tags", er, e.attribute_link);
		} else {
			newTabLink(divName, "tags", er, e.attribute_link);
		}
	});
  // Create Artists Link"
	artistArray.forEach(function(e) {
		var er = e.attribute.mReplace("char").toLowerCase();

	  // If last in array do not use ", "
		if (artistArray[artistArray.length - 1] == e) {
			newTabLink(divName, "artists", er, e.attribute_link);
		} else {
			newTabLink(divName, "artists", er, e.attribute_link);
		}
	});
  // Create Translators Link"
	translatorArray.forEach(function(e) {
		var er = e.attribute.mReplace("char").toLowerCase();

	  // If last in array do not use ", "
		if (translatorArray[translatorArray.length - 1] == e) {
			newTabLink(divName, "translators", er, e.attribute_link);
		} else {
			newTabLink(divName, "translators", er, e.attribute_link);
		}
	});
}

// New Tab Link click action
function newTabLink(divName, e, er, link) {
	$('div#'+ divName +' a#' + er).click(function(event) {
		if (event.button != 2) {
			event.preventDefault();
		}
	});
	$('div#'+ divName +' a#' + er).mousedown(function(event) {
		if (event.button != 2) {
			event.preventDefault();
		}
	});
	$('div#'+ divName +' a#' + er).mouseup(function(event) {
		if (event.button != 2) {
			event.preventDefault();
			if (er == "read-online") {
				er = e.replace("https://www.fakku.net/", "");
				e  = "";
			}
			if (e === "") {
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
	chrome.browserAction.setBadgeBackgroundColor({color: [0, 0, 0, 0]});
	localStorage["badge_number"] = 0;

	userRefresh = false;

  // While divs are more than perPage specified in options remove last div
	while ($('div.noteDiv').length  > perPage - errorCount && !loadmore) {
		$('div.noteDiv:nth-of-type('+ $('div.noteDiv').length +')').remove();
	}

	if(notesToUpdate.length !== 0) {
		for(var note in notesToUpdate) {
			localStorage[note] = notesToUpdate[note];
		}
	}
	
	lights.on();
	$('div#load-more').show();
	$('div#float').hide();
	$('div#float').attr("class", "");

	$('div#float').empty();
	//console.log("loadingtrail should be gone");

	// Sort divs
	$("div.noteDiv").sort(function(a,b){
		return Date.parse($(a).find("#right .wrap .row-small .right").attr("title")) - Date.parse($(b).find("#right .wrap .row-small .right").attr("title"));
	}).each(function(){
		$("#notes").prepend(this);
	});

	// if (pend == "prepend") {
	// 	localStorage["new_note"] = "false";
	// }

	if (setNewVersion) {
		localStorage["app_version"] = chrome.app.getDetails().version;
	}
	  //localStorage["new_note"] == "false" && 
	if (!loadmore) {
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
	  	lights.off();
		$('div#float').show();

		$('div#float div#askRecache div#options #yes').on('click', function(event) {
			event.preventDefault();
			recacheNotes(true);
		});

		popup.add("askRecache");
  	} else if(localStorage["github_update"] == "true" && localStorage["github_notified"] != "true") {
  // Disabled for now //
  
  // 		localStorage["github_notified"] = "true";
  // 		//localStorage["app_version"] = chrome.app.getDetails().version;

  // 		$('div#float').empty();
		// $('div#float').prepend("<div id='askRecache'></div>");
		// $('div#float div#askRecache').append('<div id="text"><b>An updated version has been found on Github!</b><br> If you wish to update you will have to do so manually. Sorry :(<br><br>Do you wish to perform this action now?</div>');
		// $('div#float div#askRecache').append('<div id="options" class="option"><a id="yes" href="#">Yes</a><a id="no" href="#">No</a></div>');

		// $('div#float').attr("class", "float-recache");

		// $('div#content').css("width", "545px");
	 //  	lights.off();
		// $('div#float').show();

		// $('div#float div#askRecache div#options #yes').on('click', function(event) {
		// 	event.preventDefault();
		// 	openTab("https://github.com/Kayla355/F--Companion");
		// });

		// popup.add("askRecache");
  	}

  // Image hovering event
  	var hovering = false;
  	var hoverTimer;
  	var hoverTimerStart;
  	var Y;
  	var X;

  	$("img.cover").on({
  		mousemove: function(e) {
  			if(e.pageY && e.pageX) {
  				Y = e.pageY + 2;
  				X = e.pageX + 5;
  			}

  			var imgHeight 	= (Y - 2) + e.target.naturalHeight;
  			var windowSize 	= window.pageYOffset + window.innerHeight - 4; 	// 4 is because the +2 needs to be -2

  			if(windowSize <= imgHeight) {
  				Y = Y - (imgHeight - windowSize);
  			}

  			$("div.image-hover").css({
  				"top": Y,
  				"left": X
  			});

  			clearTimeout(hoverTimer);
  			//console.log("X: "+ e.pageX +", Y: "+ e.pageY);
  		},
		mouseenter: function(e) {
			if(!hovering) {
				clearTimeout(hoverTimerStart);
				hoverTimerStart = setTimeout(function() {
					hovering = true;
					$('<div class="image-hover"><img src="'+ e.target.src +'"></div>').hide().appendTo("body").fadeIn(100);
					debug = e;
					$(e.target).trigger("mousemove");
				}, 500);
			} else {
				$('<div class="image-hover"><img src="'+ e.target.src +'"></div>').appendTo("body");
			}
		},
		mouseleave: function(e) {
			clearTimeout(hoverTimerStart);
			$("div.image-hover").remove();
  			hoverTimer = setTimeout(function() { hovering = false; }, 500);
		}
	});
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
	htmlContent = htmlContent.replace("	", "");
	localStorage["html_content"] = JSON.stringify(htmlContent);
	console.log("HTML Content Stored!");

	var end = new Date().getTime();
	var time = end - start ;
	console.log('Execution time: ' + time / 1000 + 's');
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

// Function listening for any potential error.
function msgError(error) {
	if (!errorReport) {
		errorReport = true;
		errorMsg = error;
		//console.log("Error Report Recieved")
		//console.log(request.errorMessage);
	}
}

// Function to check for new notifications
function refreshNotes() {
	$('div#float').empty();

	$('div#float').attr("class", "float-load");
	$('div#float').prepend("<div id='loading' class='loadingtrailnotes'></div>");

	$('div#content').css("width", "545px");
  	lights.off();
  	$('div#float').css("top", "50%");
  	$('div#float').css("left", "45%");
	$('div#float').show();

  // Make sure no Divs are being filtered, as it would cause issues when loading in new notes.
  // Check if filter input box exists, if yes simulate click to remove it.
  	if ($('input#filterInput')) {
		$('input#filterInput').val("");

		$('div.noteDiv-matched').attr('class', 'noteDiv');
		$('div.noteDiv-filtered').attr('class', 'noteDiv');
  	}

	userRefresh = true;

  // Message that prompts the grabNotes to start. 
	chrome.runtime.sendMessage({msg: "GrabNotes", from: "nDropdown"});
	
}
// Listen for message that says refresh complete
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.msg == "nDropdownDone") {
		lights.on();
		$('div#float').hide();
		$('div#float').attr("class", "");

		$('div#float').empty();

		var t = JSON.parse(localStorage["n_array_names"]);
		t = JSON.parse(localStorage[t[0]]);
		
		if (t[0] == "new") {
			recacheNotes(false);
		} else {
			userRefresh = false;
		}
	}
});

// Function to recache notifications
function recacheNotes(reCache) {

	if (!userRefresh) {
		$('div#notes').remove();
		$('div#content').append('<div id="notes"></div>');
	}	
	$('div#float').attr("class", "float-load");

	//idCounter		= 0;
	//idCounterTemp 	= 0;
	errorCount 		= 0;
	perPageMore 	= 1;
	outOfNotes		= false;
	localStorage["notes_done_amount"] = 0;

	checkLoggedIn({reCache: reCache, loadmore: false});
}

function loadMore() {
	if(!outOfNotes) {
		$('div#float').attr("class", "float-loadmore");
		checkLoggedIn({reCache: false, loadmore: true});
	} else {
		$('div#float').attr("class", "float-loadmore-not");
		$('div#float').attr("style", "");
		lights.off();
		$('div#float').empty();
		$('div#float').show();
		$('div#float').append("<b>Found no more Items</b>");
		popup.add("loadmore");
	}
}

// Function that requests the download links from the other scripts
function requestDownload(href) {
	// Grab Info and Links
	//console.log(href);

	var object = {
		href: href,
		from: "download"
	};

	fakku.getInfo(object);
	fakku.getLinks(object);

}

var progressBarInterval;
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

	chrome.extension.sendMessage({msg: "downloadLinks", linkdata: linkarray, infodata: infoarray});

	//console.log("sent message to background");
	$('div#float').empty();
	$('div#float').append("<b>Success! Downloading Now.</b>");
	if(localStorage["zip_download"] == "true") {
		if(localStorage["progress_bar"] == "100" || localStorage["progress_bar"] == "404") {
			localStorage["progress_bar"] = 0;
		}
		$('div#float b').text("Downloading & Compressing");
		$('div#float').append("<div id='progress-bar' style='display: block; margin-top: 4px'><center style='top: 25px;'>0%</center><div></div></div>");
		progressBarInterval = setInterval(updateProgressBar, 10);
	} else {
		popup.add("downloading");
	}
}

function updateProgressBar() {
	if(localStorage["progress_bar"] != "404") {
		$('div#progress-bar center').text(localStorage["progress_bar"]+"%");
		$('div#progress-bar div').css("width", localStorage["progress_bar"]+"%");
	} else {
		$('div#float b').text("Failed to download files");
		$('div#progress-bar center').text(localStorage["progress_bar"]);
		$('div#progress-bar div').css("width", "0%");

		clearInterval(progressBarInterval);
		setTimeout(function() { popup.add("downloading"); }, 1000);
	}

	if(localStorage["progress_bar"] == "100") {
		console.log("DONE");
		clearInterval(progressBarInterval);
		popup.add("downloading");
	}
}
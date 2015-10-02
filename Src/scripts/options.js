// Saves options to localStorage.
function save_options() {
// Global Variables
var fileChild = $('div#fileColumns').children().length;
var alertCheck;
	// Check if there is atleast one Page Number in File Structure else alert popup.
	if(!$("#outputFilename").val().toUpperCase().match(/\[PAGE\]/) || $("#outputFilename").val() === "" || $("#outputFoldername").val() === "" || $("#outputFoldername").val().toUpperCase().match(/\[PAGE\]/) || !$("#outputFilename").val().toUpperCase().match(/\[NAME\]|\[SERIES\]|\[ARTIST\]|\[LANGUAGE\]|\[TRANSLATOR\]|\[PAGE\]|\[TAGS\]/) || !$("#outputFoldername").val().toUpperCase().match(/\[NAME\]|\[SERIES\]|\[ARTIST\]|\[LANGUAGE\]|\[TRANSLATOR\]|\[PAGE\]|\[TAGS\]/)) {
		if($("#outputFoldername").val().toUpperCase().match(/\[PAGE\]/)) {
			alertCheck = "folderpage";
		} else if ($("#outputFilename").val() === "" || $("#outputFoldername").val() === "" || !$("#outputFilename").val().toUpperCase().match(/\[NAME\]|\[SERIES\]|\[ARTIST\]|\[LANGUAGE\]|\[TRANSLATOR\]|\[PAGE\]|\[TAGS\]/) || !$("#outputFoldername").val().toUpperCase().match(/\[NAME\]|\[SERIES\]|\[ARTIST\]|\[LANGUAGE\]|\[TRANSLATOR\]|\[PAGE\]|\[TAGS\]/)) {
			alertCheck = "boxempty";
		} else if (!$("#outputFilename").val().toUpperCase().match(/\[PAGE\]/)){
			alertCheck = "nopage";
		} else {
			alertCheck = false;
		}
	} else {
		alertCheck = false;
	}
	if(!alertCheck) {
    	// Incognito Downloads
			var select = document.getElementById("incognitomode");
			localStorage["incognito_mode"] = select.checked;

		// Zip Downloads
			var select = document.getElementById("zipdownload");
			localStorage["zip_download"] = select.checked;

		// Fakku Notifications
			var select = document.getElementById("fakkunotes");
			// Message to enable/disable recursive function
				chrome.runtime.sendMessage({msg: "GrabNotes"});
			localStorage["fakku_notes"] = select.checked;

		// Update Interval
			var select = document.getElementById("updateinterval");
			localStorage["update_interval"] = select.value;

		// Entries loaded per page
			var select = document.getElementById("entryamount");
			var entryamount = select.children[select.selectedIndex].value;
			if (entryamount != localStorage["entry_amount"]) {
				localStorage["html_content"] = "";
			}
			localStorage["entry_amount"] = entryamount;

		// What happens when the icon is pressed
			var select = document.getElementById("buttonaction");
			var buttonaction = select.children[select.selectedIndex].value;
			localStorage["button_action"] = buttonaction;

		// What happens when there is a file conflic
			var select = document.getElementById("conflictaction");
			var conflictaction = select.children[select.selectedIndex].value;
			localStorage["conflict_action"] = conflictaction;

		// Name of the created Folder
			var foldername = document.getElementById("outputFoldername").value;
			localStorage["folder_name"] = foldername;
		
		// Save the current order of file Structure
			var filename = document.getElementById("outputFilename").value;
			localStorage["file_structure"] = filename;

		// Update status to let user know options were saved.
			var status = document.getElementById("status");
			status.innerHTML = "Options Saved.";
			setTimeout(function() {
			status.innerHTML = "";
			}, 1000);
	} else {
	  //alert("You need atleast one(1) Page Number under File Structure");
	  // Update status to let user know that there was an issue with File Structure.
		var status = document.getElementById("status");

		if(alertCheck === "folderpage") {
			status.innerHTML = "<div style='color: red;'>The foldername cannot contain a pagenumber.</div>";
		} else if(alertCheck === "boxempty") {
			status.innerHTML = "<div style='color: red;'>Foldername and Filename is either empty or contains no variable tags to generate a name from.</div>";
		} else if(alertCheck === "nopage") {
			status.innerHTML = "<div style='color: red;'>You need atleast one 'Page Number' under Filename Structure.</div>";
		} else {
			status.innerHTML = "<div style='color: red;'>Non-descript error occured while attempting to save.</div>";
		}

		setTimeout(function() {
			status.innerHTML = "";
		}, 3000);
	}
}

// Restores select box state to saved value from localStorage.
function restore_options() {

// Restore Incognito downloads Status
	var incognitomode = localStorage["incognito_mode"];
	if (!incognitomode) {
		return;
	}
	var select = document.getElementById("incognitomode");
		if (incognitomode == "true") {
			select.checked = true;
		}

// Restore Zip downloads Status
	var zipdownload = localStorage["zip_download"];
	if (!zipdownload) {
		return;
	}
	var select = document.getElementById("zipdownload");
		if (zipdownload == "true") {
			select.checked = true;
		}

// Restore Fakku Notifications Status
	var fakkuNotes = localStorage["fakku_notes"];
	if (!fakkuNotes) {
		return;
	}
	var select = document.getElementById("fakkunotes");
		if (fakkuNotes == "true") {
			select.checked = true;
		}

// Restore Update Interval
	var updateinterval = localStorage["update_interval"];
	if (!updateinterval) {
		return;
	}
	var select = document.getElementById("updateinterval");
		select.value = updateinterval;

// Restore Entires per page
	var entryamount = localStorage["entry_amount"];
	if (!entryamount) {
		return;
	}
	var select = document.getElementById("entryamount");
	for (var i = 0; i < select.children.length; i++) {
		var child = select.children[i];
		if (child.value == entryamount) {
			child.selected = "true";
			break;
		}
	}

// Restore Button Action Status
	var buttonaction = localStorage["button_action"];
	if (!buttonaction) {
		return;
	}
	var select = document.getElementById("buttonaction");
	for (var i = 0; i < select.children.length; i++) {
		var child = select.children[i];
		if (child.value == buttonaction) {
			child.selected = "true";
			break;
		}
	}

// Restore Conflict Action Status
	var conflictaction = localStorage["conflict_action"];
	if (!conflictaction) {
		return;
	}
	var select = document.getElementById("conflictaction");
	for (var i = 0; i < select.children.length; i++) {
		var child = select.children[i];
		if (child.value == conflictaction) {
			child.selected = "true";
			break;
		}
	}

// Restore Folder Name Status
	var foldername = localStorage["folder_name"];
	if (!foldername) {
		return;
	}
	document.getElementById("outputFoldername").value = foldername;

// Restore file Structure Status
	var filename = localStorage["file_structure"];
	if (!filename) {
		return;
	}
	document.getElementById("outputFilename").value = filename;
}



///////////////////////////////////////////////
// Functions for previewing file structures //
/////////////////////////////////////////////
function addTextListener() {
	var textareas = document.querySelectorAll('.structure');
	[].forEach.call(textareas, function(textarea) {
		textarea.addEventListener('change', updatePreview, false);
		textarea.addEventListener('focus', function() {
			document.getElementById('help').style.display = "block";
		}, false);
		textarea.addEventListener('blur', function() {
			document.getElementById('help').style.display = "none";
		}, false);
	});
}

// Create the preview of the fileStructure
function updatePreview() {
	var error = false;
	$(".structure").each(function(i, textarea) {
		var string = "empty";
		var from = $(textarea).prop("id");

		if($(textarea).val() !== "") {
			string = $(textarea).val();
		}
		
		var preview = {
			text: ""
		};

		var note = {
			name: "When the Angel's Away",
			series: ["Sora no Otoshimono"],
			author: ["Pinvise", "Suzutsuki Kurara"],
			translator: ["YQII"],
			language: "English",
			page: "012",
			tags: ["paizuri", "anal", "vanilla", "oral", "oppai", "glasses", "schoolgirl", "toys", "hentai", "nakadashi", "socks", "cunnilingus"]
		};

	  // Convert arrays to single string
		for (var prop in note) {
			if(note.hasOwnProperty(prop)) {
				try {
					preview[prop] = note[prop].join(", ");
				} catch(e) {
					preview[prop] = note[prop];
				}
			}
		}

	  // Remove "." if it's the last character
		while (string.match("[.]$")) {
			string = string.replace(".", "");
		}
	  // Remove any of the following characters, \/:*?"<>|
		while (string.match('\\\\|\/|\\:|\\*|\\?|\\"|\\<|\\>|\\|')) {
			error = true;
			//console.log(string);
			var r = string.match('\\\\|\/|\\:|\\*|\\?|\\"|\\<|\\>|\\|');
			string = string.replace(r, "");
		}

		var rMapped = /\[NAME\]|\[SERIES\]|\[ARTIST\]|\[LANGUAGE\]|\[TRANSLATOR\]|\[PAGE\]|\[TAGS\]/gi;
		var eMapped = {
			"[NAME]": "<span style='color: #7F3FFD;'>"+ preview.name +"</span>",
			"[SERIES]": "<span style='color: #FF00F4;'>"+ preview.series +"</span>",
			"[ARTIST]": "<span style='color: #00CEFF'>"+ preview.author +"</span>",
			"[LANGUAGE]": "<span style='color: #EC463F'>"+ preview.language +"</span>",
			"[TRANSLATOR]": "<span style='color: #008000'>"+ preview.translator +"</span>",
			"[PAGE]": "<span style='color: #0FE200'>"+ preview.page +"</span>",
			"[TAGS]": "<span style='color: #FFA500'>"+ preview.tags +"</span>",
		};

	  // Return the mapped value.
	  	preview.text = string.toUpperCase().replace(rMapped, function(matched) {
			return eMapped[matched];
		});

	  	if(from === "outputFoldername") {
	  		$('div#folderName').html('Foldername: ' + preview.text);
	  	} else if(from === "outputFilename") {
	  		$('div#fileName').html('Filename: ' + preview.text +".jpg");
	  	}

	  	if(error) {
	  	  // Update status to let user know that there was an issue with File Structure.
			document.getElementById("status").innerHTML = '<div style="color: red;">You can not use any of the following characters in filenames: \ / : * ? " < > |</div>';
	  	} else {
	  		document.getElementById("status").innerHTML = "";
	  	}

	});
}

// chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
// 	if (request.msg == "runQueryLoaded") {
// 		querySelectLoaded();
// 		addFileRemListen();
// 		sendResponse({msg: "done"});
// 	}
// });


////////////////////////////////////////
// Function for Tabs and Tab Content //
//////////////////////////////////////
$(document).ready(function() {
	$('.tabs .tab-links a').on('click', function(e) {
		var currentAttrValue = $(this).attr('href');

	  // Show/Hide Tab Content
	 	$('.tabs ' + currentAttrValue).show().siblings().hide();

	  // Change current tab to active
	 	$(this).parent('li').addClass('active').siblings().removeClass('active');

	 	if (currentAttrValue == "#changelog") {
	 	  // Load Changelog from textfile
			$.get('Changelog.txt', function(data) {

				data = data.replace(/\/\//, "<p>").replace(/\n\/\/ /g, "</p><p>");
				data += "</p>";
				data = data.replace(/\n/g, "<br>");

			  // Stylize version text
				data = data.replace(/Version.*/g, function(matched) { return '<span class="version">' + matched + '</span>'; });

			  // Paste text data and reverse order of paragraphs
				$('div#changelog-content').html(data);
				$('div#changelog-content').children().each(function(i, li) { $('div#changelog-content').prepend(li); });
			});
	 	}

	 	e.preventDefault();
	});
});

$("#restoreItems").on("click", function() {
	$("#restoreItems").text("Working...");
	JSON.parse(localStorage["n_array_names"]).forEach(function(item) {
		var array = JSON.parse(localStorage[item]);

  		if(array[5] == "hidden") {
  			array[5] = "shown";
  			localStorage[item] = JSON.stringify(array);
  		}
	});

	$("#restoreItems").text("Done!");
	setTimeout(function() {$("#restoreItems").text("Restore");}, 2000);

});

document.addEventListener('DOMContentLoaded', function() {
  // Restore Functions
	restore_options(); // Needs to be before preview functions
  
  // Preview functions
	updatePreview();
	addTextListener();
});
document.querySelector('#save').addEventListener('click', save_options);
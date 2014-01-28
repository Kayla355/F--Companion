// Saves options to localStorage.
function save_options() {
// Global Variables
var fileChild = $('div#fileColumns').children().length;
var alertCheck = new Boolean();
	// Check if there is atleast one Page Number in File Structure else alert popup.
	for (var i = 1; i <= fileChild; i++) {
		if($('div#fileColumns div:nth-child('+ i +')').text() == "Page Number") {
			alertCheck = false;
			
			// Load in the Background(not currently in use)
			  //var runbackground = document.getElementById("runbackground");
			  //localStorage["run_background"] = runbackground.checked;
			 // Incognito Downloads
			  var hiddenmode = document.getElementById("hiddenmode");
			  localStorage["hidden_mode"] = hiddenmode.checked;
			// What happens when the icon is pressed
			  var select = document.getElementById("buttonaction");
			  var buttonaction = select.children[select.selectedIndex].value;
			  localStorage["button_action"] = buttonaction;
			// Name of the created Folder
			  var select = document.getElementById("foldername");
			  var foldername = select.children[select.selectedIndex].value;
			  localStorage["folder_name"] = foldername;

			/*
			// Show Textarea1
			  var textarea1 = document.getElementById("textarea1");
			  localStorage["text_area1"] = textarea1.checked;
			// Show Textarea2
			  var textarea2 = document.getElementById("textarea2");
			  localStorage["text_area2"] = textarea2.checked;
			*/
			
			// Save the current order of file Structure
				var fileSArray = new Array();
				for (var i = 1; i <= fileChild; i++) {
					var copypasta = $('div#fileColumns div:nth-child('+ i +')').text();
					fileSArray[i] = copypasta;	
				}
			  localStorage["file_structure"] = JSON.stringify(fileSArray);

			// Update status to let user know options were saved.
			  var status = document.getElementById("status");
			  status.innerHTML = "Options Saved.";
			  setTimeout(function() {
				status.innerHTML = "";
			  }, 1000);
		} else {
			alertCheck = true;
		}
	}
	if (alertCheck){
		//alert("You need atleast one(1) Page Number under File Structure");
		// Update status to let user know that there was an issue with File Structure.
		  var status = document.getElementById("status");
		  status.innerHTML = "<div style='color: red;'>You need atleast one 'Page Number' under Filename Structure.</div>";
		  setTimeout(function() {
		  status.innerHTML = "";
		}, 3000);
	}
}

// Restores select box state to saved value from localStorage.
function restore_options() {
// Global Variables
var fileSArray = JSON.parse(localStorage["file_structure"]);
//var folderSArray = JSON.stringify(localStorage["folder_structure"]);
var fileChild = fileSArray.length - 1;

/*
// Restore Run in Background Status
    var runbackground = localStorage["run_background"];
  if (!runbackground) {
    return;
  }
  var select = document.getElementById("runbackground");
    if (runbackground == "true") {
      select.checked = true;
    }
*/

// Restore Run in Background Status
    var hiddenmode = localStorage["hidden_mode"];
  if (!hiddenmode) {
    return;
  }
  var select = document.getElementById("hiddenmode");
    if (hiddenmode == "true") {
      select.checked = true;
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
  
// Restore Folder Name Status
  var foldername = localStorage["folder_name"];
  if (!foldername) {
    return;
  }
  var select = document.getElementById("foldername");
  for (var i = 0; i < select.children.length; i++) {
    var child = select.children[i];
    if (child.value == foldername) {
      child.selected = "true";
      break;
    }
  }

/*
// Restore Show Textfield #1
    var textarea1 = localStorage["text_area1"];
  if (!textarea1) {
    return;
  }
  var select = document.getElementById("textarea1");
    if (textarea1 == "true") {
      select.checked = true;
    }
	
// Restore Show Textfield #2
    var textarea2 = localStorage["text_area2"];
  if (!textarea2) {
    return;
  }
  var select = document.getElementById("textarea2");
    if (textarea2 == "true") {
      select.checked = true;
    }
*/

	
// Restore file Structure
	for (var i = 1; i <= fileChild; i++) {
		var text = fileSArray[i].toString();
		$('div#fileColumns').append('<div id="fileColumn" class="column" draggable="true">'+ text +'</div>');
		
		if (i == fileChild) {
			chrome.extension.sendMessage({msg: "runQueryLoaded"})
		}
	}
	
}
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);
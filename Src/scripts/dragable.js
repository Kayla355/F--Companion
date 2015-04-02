// Variables
var dragSrcEl 	= null;
var dragTrgtEl 	= null;
var colsFile 	= null;
var remFile 	= null;

// Drag Start
function handleDragStart(e) {
  this.classList.add('moving');

  dragSrcEl = this;
  
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}

// Drag Over
function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault(); // Necessary. Allows us to drop.
  }
  dragTrgtEl = this;
  
    if (dragSrcEl.getAttribute('id') == dragTrgtEl.getAttribute('id') || dragTrgtEl.getAttribute('id') == "removeColumn") {
		e.dataTransfer.dropEffect = 'move';  // Sets the cursor to show that the move is allowed
	} else {
		e.dataTransfer.dropEffect = 'none';  // Sets the cursor to show that the move is not allowed
	}

  return false;
}

// Drag Enter
function handleDragEnter(e) {
  // this / e.target is the current hover target.
  this.classList.add('over');
}

// Drag Leave
function handleDragLeave(e) {
  this.classList.remove('over');  // this / e.target is previous target element.
}

// Handels what happens when we drop
function handleDrop(e) {
  // this/e.target is current target element.

  if (e.stopPropagation) {
    e.stopPropagation(); // Stops some browsers from redirecting.
  }

  // If the column we are dropping onto is removeColumn
  if (dragTrgtEl == remFile) {
    // Remove the column we dropped from page and re-grab the columns
	dragSrcEl.parentNode.removeChild(dragSrcEl);
  } else {
    // Don't do anything if dropping the same column we're dragging.
    if (dragSrcEl != this) {
	  // Set the source column's HTML to the HTML of the column we dropped on.
	  dragSrcEl.innerHTML = this.innerHTML;
	  this.innerHTML = e.dataTransfer.getData('text/html');
    }
  }
  filePreview();
  return false;
}

// Drag ends
function handleDragEnd(e) {
  // this/e.target is the source node.
	remFile.classList.remove('over');
	remFile.classList.remove('moving');
  [].forEach.call(colsFile, function (colFile) {
    colFile.classList.remove('over');
	colFile.classList.remove('moving');
  });
}

// Selects the divs created from localStorage and adds EventListeners
function querySelectLoaded() {
    colsFile = document.querySelectorAll('#fileColumns .column');
  [].forEach.call(colsFile, function(colFile) {
    colFile.addEventListener('dragstart', handleDragStart, false);
    colFile.addEventListener('dragenter', handleDragEnter, false);
    colFile.addEventListener('dragover', handleDragOver, false);
    colFile.addEventListener('dragleave', handleDragLeave, false);
    colFile.addEventListener('drop', handleDrop, false);
    colFile.addEventListener('dragend', handleDragEnd, false);
  });
}

// Adds EventListeners to the Remove Button
function addFileRemListen() {
  remFile = document.querySelector('#removeColumn');
  
  remFile.addEventListener('dragenter', handleDragEnter, false);
  remFile.addEventListener('dragover', handleDragOver, false);
  remFile.addEventListener('dragleave', handleDragLeave, false);
  remFile.addEventListener('drop', handleDrop, false);
  remFile.addEventListener('dragend', handleDragEnd, false);
}

// Grabs the newest div
function querySelect() {
  colsFile = document.querySelectorAll('#fileColumns .column');
  colFile = colsFile[colsFile.length - 1];

  addFileListen();
}

// Adds EventListeners to the new div
function addFileListen() {
  colFile.addEventListener('dragstart', handleDragStart, false);
  colFile.addEventListener('dragenter', handleDragEnter, false);
  colFile.addEventListener('dragover', handleDragOver, false);
  colFile.addEventListener('dragleave', handleDragLeave, false);
  colFile.addEventListener('drop', handleDrop, false);
  colFile.addEventListener('dragend', handleDragEnd, false);
}

// Create draggable divs
function addFileDiv() {
	var objQuery = document.querySelectorAll('#fileColumns .column');
	var objCount = objQuery.length;
	if (objCount < 8) {
		var select = document.getElementById("filedivtype");
		var filedivtype = select.children[select.selectedIndex].value;
		if (filedivtype == "manganame") {
			$('div#fileColumns').append('<div id="fileColumn" class="column" draggable="true">Manga Name</div>');
		}
		if (filedivtype == "series") {
			$('div#fileColumns').append('<div id="fileColumn" class="column" draggable="true">Series Name</div>');
		}
		if (filedivtype == "authorname") {
			$('div#fileColumns').append('<div id="fileColumn" class="column" draggable="true">Author Name</div>');
		}
		if (filedivtype == "language") {
			$('div#fileColumns').append('<div id="fileColumn" class="column" draggable="true">Language</div>');
		}
		if (filedivtype == "translator") {
			$('div#fileColumns').append('<div id="fileColumn" class="column" draggable="true">Translator</div>');
		}
		if (filedivtype == "pagenumber") {
			$('div#fileColumns').append('<div id="fileColumn" class="column" draggable="true">Page Number</div>');
		}
		if (filedivtype == "tags") {
			$('div#fileColumns').append('<div id="fileColumn" class="column" draggable="true">Tags</div>');
		}
	} else {
		var status = document.getElementById("status");
		status.innerHTML = "<div style='color: red;'>Object limit reached, you cannot add another object.</div>";
		setTimeout(function() {
		  status.innerHTML = "";
		}, 3000);
	}

}

// Create the preview of the fileStructure
function filePreview() {
	var fileChild = $('div#fileColumns').children().length;
	var fileSArray = [];
	
	// Create the temporary fileStructure array
		for (var i = 1; i <= fileChild; i++) {
			var copypasta = $('div#fileColumns div:nth-child('+ i +')').text();
			fileSArray[i] = copypasta;	
		}
		
	// Create the filename from the fileStructure array
		for (i = 1; i <= fileChild; i++) {
		  var languageCheck = false;
		  var languagePrev  = false;
		  // Checks if the selected object is Language
			if (fileSArray[i] == "Language") {
				languageCheck = true;
			}
		  // Creates the filename
			if (i == 1 && i != fileChild) {
				filename = fileSArray[i];
			} else if (i == 1 && i == fileChild){
				filename = fileSArray[i] + ".jpg";
			} else if (languageCheck) {
				filename = filename + "(" + fileSArray[i] + ")";
				languagePrev = true;
			} else if (languagePrev) {
				filename = filename + " " + fileSArray[i];
				languagePrev = false;
			} else if (i == fileChild){
				filename = filename + " - " + fileSArray[i] + ".jpg";
			} else {
				filename = filename + " - " + fileSArray[i];
			}
		}
	// Update the text in the Div
	$('div#fileName').text('Preview: ' + '(' + filename + ')');

}

document.addEventListener('DOMContentLoaded', filePreview);
document.querySelector('#addFileDiv').addEventListener('click', addFileDiv);
document.querySelector('#addFileDiv').addEventListener('click', querySelect);
document.querySelector('#addFileDiv').addEventListener('click', filePreview);

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.msg == "runQueryLoaded") {
		querySelectLoaded();
		addFileRemListen();
		sendResponse({msg: "done"});
	}
});
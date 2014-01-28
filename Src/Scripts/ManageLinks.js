// Temporary solution to excludes not working properly
// Consider making this dynamic instead (Grabbing part of the url and putting it in a variable)
// ManageLinks.js and GrabLinks.js have different includes and excludes!!!!
if (window.location.pathname.match(/\/.*\/related$/) || window.location.pathname.match(/\/.*\/download$/) ||window.location.pathname.match(/\/.*\/favorites$/) || window.location.pathname.match(/\/.*\/favorites\/.*/) || window.location.pathname.match(/\/.*\/english$/) || window.location.pathname.match(/\/.*\/english\/.*/) || window.location.pathname.match(/\/.*\/japanese$/) || window.location.pathname.match(/\/.*\/japanese\/.*/) || window.location.pathname.match(/\/.*\/artists$/) || window.location.pathname.match(/\/.*\/artists\/.*/) || window.location.pathname.match(/\/.*\/translators$/) || window.location.pathname.match(/\/.*\/translators\/.*/) || window.location.pathname.match(/\/.*\/series$/) || window.location.pathname.match(/\/.*\/series\/.*/) || window.location.pathname.match(/\/.*\/newest$/) || window.location.pathname.match(/\/.*\/newest\/.*/) || window.location.pathname.match(/\/.*\/popular$/) || window.location.pathname.match(/\/.*\/popular\/.*/) || window.location.pathname.match(/\/.*\/downloads$/) || window.location.pathname.match(/\/.*\/downloads\/.*/) || window.location.pathname.match(/\/.*\/controversial$/) || window.location.pathname.match(/\/.*\/controversial\/.*/) || window.location.pathname.match(/\/.*\/tags\/.*/)  ) {
	} else {
	
$(document).ready(function () {

	$.ajax({
		async: true,
		success: function() {
				
			chrome.runtime.sendMessage({fetch: "getOptions"}, function(response) {
				localStorage["options_array"] = response.data;
				content();
			});

			function content() {
				var linkarray 		= JSON.parse(localStorage["link_array"]);
				var optionsarray 	= JSON.parse(localStorage["options_array"]);
				var imgURL 			= linkarray[1];
				var quant  			= localStorage["quant_pages"];
				var quant2 			= parseInt(quant);
				var quantlen 		= imgURL.length -2;
				var textarea1 		= optionsarray[1];
				var textarea2 		= optionsarray[2];
				var downloadbutton	= optionsarray[3];
				
					if (window.location.pathname.match(/.*\/read.*/) && textarea2 == "true") {
						$('div#content').css('border', 'none');
						$('div#content').append("<center style='align:center;text-align:center'></center>");		
						//$('div#content center').append("<br><p>"+quant+"</p><br><br><br>");
						$('div#content center').append("<textarea id='copypasta' cols ='" + quantlen + "' rows='" + quant2 + "' readonly style='overflow:hidden;padding-bottom:3px;resize:none'>");
					}
					if (!window.location.pathname.match(/.*\/read.*/) && textarea1 == "true"  || window.location.pathname.match(/.*\/related/) || window.location.pathname.match(/.*\/download/)) {
						$('div#content>div:eq(1)').css('border', 'none');
						$('div#content>div:eq(1)').prepend("<center style='border:solid;border-color:#BBB;border-width:1px;max-width:790px;overflow-y:hidden;text-align:center'></center>");
						//$('div#content center').append("<br><p>"+quant+"</p><br><br><br>");
						$('div#content>div:eq(1) center').prepend("<textarea id='copypasta' cols ='" + quantlen + "' rows='" + quant2 + "' readonly style='min-width:784px;border:none;overflow:hidden;padding:0px 2px 0px 2px;resize:none'>");
					}
				
					
				var copypasta2 = "";
				for (var i = 1; i <= quant; i++) {
					var str = '' + i;
					while (str.length < 3) str = '0' + str;
					copypasta2 = copypasta2 + linkarray[i].toString() + "\n" ;
				}

				if (textarea1 != "true" && textarea2 != "true") {
				} else {
					document.getElementById('copypasta').value=copypasta2;
				}
				
				
				$("#copypasta").focus(function() {
					var $this = $(this);
					$this.select();
						// Work around Chrome's little problem
						$this.mouseup(function() {
						// Prevent further mouseup intervention
						$this.unbind("mouseup");
						return false;
					});
				});
			}
		}
	});
	});
	
}
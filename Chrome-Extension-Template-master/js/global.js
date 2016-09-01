/*
** file: js/global.js
** description: global javascript library containing code for use across the entire chrome extension, for
**              unique functionality for specific pages, create and use a separate file named "pagename.js"
*/

var API_URL = "https://safebook-2016.herokuapp.com/";
var isCaringOfListenToEvent = true;

//bind events to dom elements
document.addEventListener('DOMContentLoaded', initPostButton(), false);

function initPostButton(){
	injectPopupCode();
	loadJS('js/main.js');
	initHomeScreenPost();
	initProfileScreenPost();
	//initComments();
}

function showAlert(text){
    alert(text);
}

var isWorking = false;
function validateText(text, onComplete){
	if(!isWorking){
		$.ajax({
			url: "https://safebook-2016.herokuapp.com/?text=" + encodeURIComponent(text),
			type: "GET",
			contentType: "application/json",
			dataType: "json",
			cache: false,
			success: function(result){
				isWorking = false;
				onComplete(result);
			},
			error: function (xhr, textStatus, errorThrown) {
				isWorking = false;
				console.log("error");
			}
		});
		
		isWorking = true;
	}
}

function initHomeScreenPost(){
	if(isCaringOfListenToEvent){
		var postPopUpArea = document.getElementsByClassName('_559p')[0];
		if(postPopUpArea){
			postPopUpArea.addEventListener('click', function (e) {
				setTimeout(function() {
					var postButton = document.getElementsByClassName('_1mf7 _4jy0 _4jy3 _4jy1 _51sy selected _42ft')[0];
					if (postButton) {
						postButton.addEventListener('mousemove', function () {
							if(isCaringOfListenToEvent){
								var postTextArea = $('[data-offset-key]').find('span')[1].innerHTML;
								validateText(postTextArea, function(result){
									dialogAccordingToResult(result);
								});
							}
						});
					}
				}, 5000);
			});
		}
	}
}

function initProfileScreenPost(){
	if(isCaringOfListenToEvent){
		var postPopUpArea = document.getElementsByClassName('_3u16')[0];
		if(postPopUpArea){
			postPopUpArea.addEventListener('click', function (e) {
				setTimeout(function() {
					var postButton = document.getElementsByClassName('_1mf7 _4jy0 _4jy3 _4jy1 _51sy selected _42ft')[0];
					if (postButton) {
						postButton.addEventListener('mousemove', function () {
							if(isCaringOfListenToEvent){
								var postTextArea = $('[data-offset-key]').find('span')[1].innerHTML;
								validateText(postTextArea, function(result){
									dialogAccordingToResult(result);
								});
							}
						});
					}
				}, 5000);
			});
		}
	}
}

function setIsCare(isCare){
	isCaringOfListenToEvent = isCare;
}

function create(htmlStr) {
    var frag = document.createDocumentFragment(),
        temp = document.createElement('div');
    temp.innerHTML = htmlStr;
    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }
    return frag;
}

function injectPopupCode(){
	var popup = '<div id="modal-from-dom" class="modal hide fade"><div class="modal-header"><a href="#" class="close">&times;</a><h3>Delete URL</h3></div><div class="modal-body"><p class="reason">You are about to delete one track url, this procedure is irreversible.</p><p>Do you want to proceed?</p><p id="debug-url"></p></div><div class="modal-footer"><a onclick="setIsCare(false)" class="btn danger">Yes</a><a onclick="setIsCare(true)" data-dismiss="modal" class="btn secondary">No</a></div></div>';
	var fragment = create(popup);
	document.body.insertBefore(fragment, document.body.childNodes[0]);
	
	var link = document.createElement('link')
	link.setAttribute('rel', 'stylesheet')
	link.setAttribute('type', 'text/css')
	link.setAttribute('href', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css')
	document.getElementsByTagName('head')[0].appendChild(link)

	//var container = document.getElementsByClassName('_li')[0];
}

function dialogAccordingToResult(json){
	if(json['bad_content']){
		var cookie = getCookie("profileReport");
		if(cookie){
			setCookie("profileReport", parseInt(cookie) + 1, 9999);
		} else {
			setCookie("profileReport", 1, 9999);
		}
		
		//Show dialog
		var isConfirm = confirm("Your data is contain bad words like:" + json['bad_words'][0] + " are you sure you want to public this post?");
		if(isConfirm == true) {
			document.getElementsByClassName('_1mf7 _4jy0 _4jy3 _4jy1 _51sy selected _42ft')[0].click();
			isCaringOfListenToEvent = false;
		}
	}
}

function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}

function getCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
}

function loadJS(file) {
    // DOM: Create the script element
    var jsElm = document.createElement("script");
    // set the type attribute
    jsElm.type = "application/javascript";
    // make the script element load file
    jsElm.src = file;
    // finally insert the element to the body element in order to load the script
    document.body.appendChild(jsElm);
}
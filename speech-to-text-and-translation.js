// Test browser support
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;

// The key needed in order to use the Google Translate API
var key = 'AIzaSyC-FaIc8QZWTBnROt99S_vKB3uL9DhbMuU';

// Initialize some helper variables
var isRunning = false;
var imageWrapper = document.getElementById('input-img-wrapper');
var image = document.getElementById('input-img');
var inputText = document.getElementById('input-text-area');
var inputLanguageSelect = document.getElementById('input-select');
var outputLanguageSelect = document.getElementById('output-select');
var outputText = document.getElementById('output-text-area');
var outputImg = document.getElementById('output-img');
var translateButton = document.getElementById('text-to-speech-button');
var inputLanguage 

if (window.SpeechRecognition === null) {
	alert('No speech recognition available');
} else {
	// Initialize the recognizer
        var recognizer = new window.SpeechRecognition();

        // Recogniser doesn't stop listening even if the user pauses
        recognizer.continuous = true;
 
        // Start recognising
	recognizer.onresult = function(event) {
		if(inputLanguageSelect.options[ inputLanguageSelect.selectedIndex ].value != outputLanguageSelect.options[ outputLanguageSelect.selectedIndex ].value) {
			inputText.textContent = '';
		  	outputText.textContent = '';
	 
		  	for (var i = event.resultIndex; i < event.results.length; i++) {
		    		if (event.results[i].isFinal) {
			      		inputText.value = event.results[i][0].transcript;
		    		} else {
			      		inputText.value += event.results[i][0].transcript;
				}
			}

			translateText();
			synthesiseSpeech();
		} else {
			alert('Please turn off the speech recognition and select different languages');
		}
        };

	// Listen for errors
        recognizer.onerror = function(event) {
        	alert('Recognition error: ' + event.message);
        };

	// Set event listener for clicking the input image
	imageWrapper.addEventListener('click', function() {
		if(!isRunning) {
			isRunning = true;
			recognizer.lang = inputLanguageSelect.options[ inputLanguageSelect.selectedIndex ].value;
			translateButton.setAttribute('style', 'background-color: #d3d3d3; cursor: default;');
			image.setAttribute('src', 'img/Stop.png');
			try {
		    		recognizer.start();
		  	} catch(ex) {
		    		alert('Recognition error: ' + ex.message);
		  	}
		} else {
			isRunning = false;
			translateButton.setAttribute('style', 'background-color: #337ab7; cursor: pointer;');
			image.setAttribute('src', 'img/Record.png');
			recognizer.stop();
		}
        });
}

// Function for hiding the ouput indication image with
// approximatively calculated timeout
function hideImg(outputLength) {
	setTimeout(function () {
        	outputImg.setAttribute('class','hidden');
    	}, outputLength*80);
}

function translateText() {
	var message = inputText.value;
	var source = inputLanguageSelect.options[ inputLanguageSelect.selectedIndex ].value;
	var target = outputLanguageSelect.options[ outputLanguageSelect.selectedIndex ].value;
	var baseURI = 'https://www.googleapis.com/language/translate/v2';
	var fullURI = baseURI + '?key=' + key + '&q=' + message + '&source=' + source + '&target=' + target;

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", fullURI, false );
	xmlHttp.send( null );
	var jsonObject = JSON.parse(xmlHttp.response);
	outputText.textContent = decodeHtml(jsonObject.data.translations[0].translatedText);
}

function synthesiseSpeech() {
	if(outputText.textContent != null && outputText.textContent != undefined && outputText.textContent != '') {
		var msg = new SpeechSynthesisUtterance(outputText.textContent);
		msg.lang = outputLanguageSelect.options[ outputLanguageSelect.selectedIndex ].value;
		outputImg.setAttribute('class','show');
		window.speechSynthesis.speak(msg);
		hideImg(outputText.textContent.length);
	}
}

function decodeHtml(html) {
    	var txt = document.createElement("textarea");
    	txt.innerHTML = html;
	return txt.value;
}

function translateAndSynthesize() {
	if(!isRunning) {
		translateText();
		synthesiseSpeech();
	} 
}

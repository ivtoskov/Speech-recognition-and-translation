// Test browser support
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;

// Initialize some helper variables
var isRunning = false;
var imageWrapper = document.getElementById('input-img-wrapper');
var image = document.getElementById('input-img');
var inputText = document.getElementById('input-text-area');
var inputLanguageSelect = document.getElementById('input-select');
var outputLanguageSelect = document.getElementById('output-select');
var outputText = document.getElementById('output-text-area');
var outputImg = document.getElementById('output-img');

if (window.SpeechRecognition === null) {
	alert('No speech recognition available');
} else {
	// Initialize the recognizer
        var recognizer = new window.SpeechRecognition();

        // Recogniser doesn't stop listening even if the user pauses
        recognizer.continuous = true;
 
        // Start recognising
	recognizer.onresult = function(event) {
        	inputText.textContent = '';
	  	outputText.textContent = '';
 
          	for (var i = event.resultIndex; i < event.results.length; i++) {
            		if (event.results[i].isFinal) {
		      		inputText.textContent = event.results[i][0].transcript;
		      		outputText.textContent = event.results[i][0].transcript;
            		} else {
		      		inputText.textContent += event.results[i][0].transcript;
		      		outputText.textContent += event.results[i][0].transcript;
        		}
		}

		  var msg = new SpeechSynthesisUtterance(outputText.textContent);
		  msg.lang = outputLanguageSelect.options[ inputLanguageSelect.selectedIndex ].value;
		  outputImg.setAttribute('class','show');
	    	  window.speechSynthesis.speak(msg);
		  hideImg(outputText.textContent.length);
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
			image.setAttribute('src', 'img/Stop.png');
			try {
		    		recognizer.start();
		  	} catch(ex) {
		    		alert('Recognition error: ' + ex.message);
		  	}
		} else {
			isRunning = false;
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

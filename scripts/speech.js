((global) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
    const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

    if (!SpeechRecognition || !SpeechGrammarList || !SpeechRecognitionEvent) {
        console.log("%cThis browser has no support for speech recognition 😢", "font-size: 10px; color: #7f7f7f");

        return;
    }

    const rulesModal = document.querySelector(".modal");
    const textActions = [{
        words: [ "scissors", "paper", "rock", "lizard", "spock" ],
        action: (text) => app.choose(text)
    }, {
        words: [ "play", "again", "play again", "restart", "one more time", "go" ],
        action: () => app.restart()
    }, {
        words: [ "rules", "manual", "how to play" ],
        action: () => {
            if (!rulesModal.classList.contains("opened")) {
                modal.toggle(rulesModal);
            }
        }
    }, {
        words: [ "close", "game" ],
        action: () => {
            if (rulesModal.classList.contains("opened")) {
                modal.toggle(rulesModal);
            }
        }
    }];
    const recognition = new SpeechRecognition();
    const button = document.getElementById("start-recognition");
    let isRecognizing = false;
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en_US";

    recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            proccessTranscript(event.results[i][0].transcript.trim().toLowerCase());
        }
    };

    recognition.onstart = () => {
        isRecognizing = true;
        changeButtonState(true);
    };

    recognition.onend = () => {
        isRecognizing = false;
        changeButtonState(false);
    };

    recognition.onerror = (event) => {
        console.log("%cRecognition error: " + event.error, "font-size: 10px; color: #fa5f5f");
    };

    function proccessTranscript(text) {
        console.log(`%c🎙 Trying to process "${ text }"`, "font-size: 10px; color: #7f7f7f");

        for (const { words, action } of textActions) {
            if (words.includes(text)) {
                action(text);
            }
        }
    }

    function changeButtonState(isActive) {
        button.querySelector("span").textContent = isActive ? "stop voice" : "use voice";
        button.classList.toggle("active", isActive);
    }

    function changeRecognitionState() {
        if (isRecognizing) {
            recognition.stop();            
        }
        else {
            recognition.start();
        }
    }

    button.classList.remove("d-none");
    button.addEventListener("click", () => changeRecognitionState());

    global.SpeechRecognition = SpeechRecognition;
    global.SpeechGrammarList = SpeechGrammarList;
    global.SpeechRecognitionEvent = SpeechRecognitionEvent;

})(window);

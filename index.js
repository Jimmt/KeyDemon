// (function() {
    "use strict";

    var $ = function(id) { return document.getElementById(id); }

    var words = [];
    var dictionary = [];
    var currentIndex = 0;
    var wordsTyped = 0;
    var startTime = 0;
    var timerRunning = false;
    var deletes = 0;
    var updateTimerId = 0;
    var done = false;
    var mode = "letters";
    var capitalizedLetters = false;
    var capitalizedWords = false;

    window.onload = function() {
        dictionary = getWords();
        setupTextbox();
        setupButtons();
        generateRandomLetters();
    };

    function setupTextbox() {
        $("textbox").onkeydown = function(e) {
            if (!timerRunning) {
                startTimer();
            }

            if (e.code == "Space") {
                var input = this.value;
                if (input == words[currentIndex]) {
                    if (!done) {
                        document.getElementsByClassName("current-word")[0].classList.remove("current-word");
                        if (currentIndex == words.length - 1) {
							$("textbox").disabled = true;
							document.querySelectorAll(".word")[currentIndex].classList.add("typed-word");
                            done = true;
							reset(false);
                        } else {
							document.querySelectorAll(".word")[currentIndex].classList.add("typed-word");
                            document.querySelectorAll(".word")[++currentIndex].classList.add("current-word");
                        }
                        $("textbox").value = "";
                        $("textbox").classList.remove("error");
                        wordsTyped++;
                        e.preventDefault();
                    }
                } else {
                    $("textbox").classList.add("error");
                }
            }
            if (e.code == "Backspace") {
                deletes++;
            }
        }
    }

    function setupButtons() {
        $("reset").onclick = function() {
            reset(true);
        }
        $("random-letters").onclick = function() {
            reset(false);
            generateRandomLetters();
            selectButton("word-choices", this);
        }
        $("random-words").onclick = function() {
            reset(false);
            generateRandomWords();
            selectButton("word-choices", this);
        }
        $("passages").onclick = function() {
            selectButton("word-choices", this);
        }
    }

    function selectButton(group, element) {
        var prev = document.querySelector("#" + group + " .selected");
        prev.classList.remove("selected");
        prev.classList.add("unselected");
        element.classList.remove("unselected");
        element.classList.add("selected");
    }

    function reset(generate) {
        stopTimer();
		done = false;
        deletes = 0;
        wordsTyped = 0;
        currentIndex = 0;
        $("textbox").classList.remove("error");
        $("textbox").value = "";
        if (generate) {
			updateResults();
			$("textbox").disabled = false;
            if (mode == "letters") {
                generateRandomLetters();
            } else if (mode == "words") {
                generateRandomWords();
            } else {

            }
        }
    }

    function truncate(input) {
        return input.toFixed(1);
    }

    function startTimer() {
        timerRunning = true;
        startTime = new Date().getTime();
        updateTimerId = setInterval(function() {
            updateResults();
        }, 20);
    }

    function stopTimer() {
        timerRunning = false;
        clearInterval(updateTimerId);
    }

    function getElapsedTime() {
        return new Date().getTime() - startTime;
    }

    function updateResults() {
        var timeElapsed = getElapsedTime();
        var wpm = (timeElapsed == 0) ? 0 : (wordsTyped / (timeElapsed / 1000) * 60);
        wpm = truncate(wpm);
        $("wpm").innerHTML = wpm;
        $("deletes").innerHTML = deletes;
        $("deletes-per-word").innerHTML = currentIndex == 0 ? 0 : truncate(deletes / currentIndex);
    }

    function generateRandomWords() {
        words = [];
        mode = "words";
        $("word-preview").innerHTML = "";
        for (var i = 0; i < 50; i++) {
            var word = dictionary[Math.floor(Math.random() * dictionary.length)];
            addWord(word, i == 0);
        }
    }

    function generateRandomLetters() {
        words = [];
        mode = "letters";
        $("word-preview").innerHTML = "";
        var alphabet = "abcdefghijklmnopqrstuvwxyz";
        for (var i = 0; i < 50; i++) {
            var word = "";
            for (var j = 0; j < 3 + Math.floor(Math.random() * 5); j++) {
                word += alphabet.charAt(Math.floor(Math.random() * 26));
            }
            addWord(word, i == 0);
        }
    }

    function addWord(word, current) {
        words.push(word);
        var wordElement = document.createElement("span");
        wordElement.innerHTML = word;
        wordElement.classList.add("word");
        if (current) {
            wordElement.classList.add("current-word");
        }
        $("word-preview").appendChild(wordElement);
        $("word-preview").innerHTML += " ";
    }
// })();
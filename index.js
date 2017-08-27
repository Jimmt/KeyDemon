(function() {
    "use strict";

    var $ = function(id) { return document.getElementById(id); }

    var words = [];
    var currentIndex = 0;
    var wordsTyped = 0;
    var startTime = 0;
    var timerRunning = false;
    var deletes = 0;
    var updateTimerId = 0;
    var done = false;

    window.onload = function() {
        generateText();
        setupListeners();
    };

    function setupListeners() {
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
                            done = true;
                            reset();
                        } else {
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
        $("reset").onclick = function() {
            reset();
        }
    }


    function reset() {
        stopTimer();
        deletes = 0;
        wordsTyped = 0;
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

    function generateText() {
        var alphabet = "abcdefghijklmnopqrstuvwxyz";
        for (var i = 0; i < 5; i++) {
            var word = "";
            for (var j = 0; j < 3 + Math.floor(Math.random() * 5); j++) {
                word += alphabet.charAt(Math.floor(Math.random() * 26));
            }
            var wordElement = document.createElement("span");
            wordElement.innerHTML = word;
            wordElement.classList.add("word");
            if (i == 0) {
                wordElement.classList.add("current-word");
            }
            words.push(word);
            $("word-preview").appendChild(wordElement);
            $("word-preview").innerHTML += " ";
        }
    }
})();
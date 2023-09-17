$(document).ready(function () {
    let guessnumber;
    let chance;
    let userinput;
    let msg;
    let queue = [];

    const DOM = {
        document: $(document),
        window: $(window),
        playBtn: $(".play-btn"),
        chancesLevelInput: $(".chances, .level-input"),
        msg: $(".msg"),
        numberHistory: $(".number-history"),
        playAgain: $(".play-again-btn"),
        heart: $(".heart"),
        allButtons: $("button"),
        levelSelect: $("#levelSelect"),
        volumeControls: $(".volume-controls"),
        soundEffects: $("#sound-effect"),
        playForm: $('.play-form'),
        levelInput: $(".level-input"),
        guessNumber: $("#guessnum"),
        
        audioControl: function (dataset) {
            return $(`audio[data-link=${dataset}]`);
        },
        hearts: function (chance) {
            return $(`.heart[data-chance=${chance}]`);
        }
    }

    DOM.playBtn.click(function () {
        guessnumber = Number.parseInt(Math.ceil(Math.random() * 10));
        chance = 5;
        hideShow(DOM.playAgain, DOM.chancesLevelInput);
        DOM.msg.html("");
        DOM.numberHistory.html("");
        DOM.heart.removeClass("one-chance-less").addClass("bg-animate");
    })

    //1st parameter should be hide class and 2nd should be showclass
    const hideShow = function (hideClass, showClass) {
        $(hideClass).addClass('d-none');
        $(showClass).removeClass('d-none');
    }

    DOM.allButtons.on("click", function () {
        $("#background-music")[0].play();
        if (this.dataset.parent && this.dataset.show) {
            hideShow(`.${this.dataset.parent}`, `.${this.dataset.show}`);
        }
    })

    DOM.levelSelect.on('change', function () {
        DOM.guessNumber.attr('max', this.value);
        DOM.guessNumber.data('level-check', Number.parseInt(this.value));
    });


    // To show the numbers entered till now by the user
    function numHistory(guessnumber) {
        const enterednumbers = document.createElement("li");
        if (guessnumber) {
            enterednumbers.innerHTML = `<span class="text-primary fw-bold">Correct number was: ${guessnumber}</span>`;
        }
        else {
            enterednumbers.textContent = `Entered number was: ${userinput}`;
        }
        document.querySelector(".number-history").appendChild(enterednumbers)
        queue.push(userinput);
    }

    DOM.volumeControls.on('click', function () {
        DOM.audioControl(this.dataset.link).each(function () {
            if (this.dataset.status === 'on') {
                this.muted = true;
                this.dataset.status = 'off';
            }
            else {
                this.muted = false;
                this.dataset.status = 'on';
            }
        });
        if (this.dataset.status === 'on') {
            $($(this)[0]).attr('src', this.dataset.off);
            this.dataset.status = 'off';
        }
        else {
            $($(this)[0]).attr('src', this.dataset.on);
            this.dataset.status = 'on';
        }

    })

    const gameSound = function (wrong) {
        if (wrong === true) {
            DOM.soundEffects.attr("src", "music/wrong-guess.mp3");
        }
        if (wrong === "win") {
            DOM.soundEffects.attr("src", "music/Win.mp3");
        }
        if (wrong === "outOfMoves") {
            DOM.soundEffects.attr("src", "music/out-of-moves.mp3");
        }
        if (wrong === "alert") {
            DOM.soundEffects.attr("src", "music/alert-tone.wav");
        }

        if (DOM.soundEffects > 0 && !DOM.soundEffects.paused) {
            DOM.soundEffects.pause();
            DOM.soundEffects.currentTime = 0;
            DOM.soundEffects.play();
        }
        else {
            DOM.soundEffects[0].play();
        }
    }

    // Unmute the volume when game is active
    $(window).focus(function () {
        DOM.audioControl('music').each(function () {
            if (this.dataset.status === 'on') {
                this.muted = false;
            }
        });
    });
    // Mute the volume when game is inactive
    $(window).blur(function () {
        DOM.audioControl('music').each(function () {
            this.muted = true;
        });
    });

    $(document).on("keypress", function (event) {
        if (DOM.playForm.valid() && event.key === "Enter") {
            event.preventDefault();

            // Number entered by user
            userinput = DOM.guessNumber.val();

            // smaller number
            if (userinput < guessnumber) {
                DOM.msg.html("Sorry! The number entered is smaller than the correct number");
                gameSound(true);
                chance--;
                DOM.hearts(chance).addClass("one-chance-less");
                DOM.hearts(chance).removeClass("bg-animate");
                numHistory();
            }

            // greater number
            else if (userinput > guessnumber) {
                DOM.msg.html("Sorry! The number entered is greater than the correct number");
                gameSound(true);
                 chance--;
                 DOM.hearts(chance).addClass("one-chance-less");
                 DOM.hearts(chance).removeClass("bg-animate");
                 numHistory();
            }

           
           
          
            if (!chance) {
                DOM.msg.html("<img src='images/fail-img.gif' class='soryimg img-fluid'>");
                hideShow(DOM.levelInput, DOM.playAgain);
                gameSound("outOfMoves");
                numHistory(guessnumber);
            }

            //Congrats
            if (userinput == guessnumber) {
                DOM.msg.html("<img src='images/success-img.gif' class='correct img-fluid' width='450'>");
                hideShow(DOM.chancesLevelInput, DOM.playAgain);
                gameSound("win");
                numHistory(guessnumber);
            }

           
            DOM.guessNumber.val('');
        }

        //If the number is not within Range, audio will be played
        else if (DOM.guessNumber.hasClass('error')) {
            gameSound("alert");
        }
    });
})
$(document).ready(function () {
    let guessnumber;
    let chance;
    let userinput;
    let msg;
    let queue = [];

    const audioControl = function (dataset) {
        return $(`audio[data-link=${dataset}]`);
    }

    $(".play-btn").click(function () {
        guessnumber = Number.parseInt(Math.ceil(Math.random() * 10));
        chance = 5;
        $(".chances, .level-input").show();
        $(".msg").html("");
        $(".number-history").html("");
        $("#settingscollapse").show();
        $(".level-input").show();
        $(".play-again-btn").hide();
        $(".heart").removeClass("one-chance-less");
    })

    //1st parameter should be hide class and 2nd should be showclass
    const hideShow = function (hideClass, showClass) {
        $(hideClass).addClass('d-none');
        $(showClass).removeClass('d-none');
    }

    $("button").on("click", function () {
        $("#background-music")[0].play();
        if (this.dataset.parent && this.dataset.show) {
            hideShow(`.${this.dataset.parent}`, `.${this.dataset.show}`);
        }
    })

    $("#levelSelect").on('change', function () {
        $("#guessnum").attr('max', this.value);
        $("#guessnum").data('level-check', Number.parseInt(this.value));
    });

    // To show the numbers entered till now by the user
    function numHistory() {
        const enterednumbers = document.createElement("li");
        enterednumbers.textContent = "Entered number was: " + `${userinput}`;
        document.querySelector(".number-history").appendChild(enterednumbers)
        queue.push(userinput);
    }

    $(".volume-controls").on('click', function () {
        audioControl(this.dataset.link).each(function () {
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
            $($(this)[0]).attr( 'src', this.dataset.on);
            this.dataset.status = 'on';
        }

    })

    const gameSound = function(wrong){
        if(wrong === true){
            $("#sound-effect").attr("src", "music/wrong-guess.mp3");
        }
        if(wrong === "win"){
            $("#sound-effect").attr("src", "music/Win.mp3");
        }
        if(wrong === "outOfMoves"){
            $("#sound-effect").attr("src", "music/out-of-moves.mp3");
        }
        if(wrong === "alert"){
            $("#sound-effect").attr("src", "music/alert-tone.wav");
        }

        if($("#sound-effect") > 0 && !$("#sound-effect").paused){
            $("#sound-effect").pause();
            $("#sound-effect").currentTime = 0;
            $("#sound-effect").play();
        }
        else{
            $("#sound-effect")[0].play();
        }
    }

    $(document).on("keypress", function (event) {
        if ($('.play-form').valid() && event.key === "Enter") {
            event.preventDefault();

            // Number entered by user
            userinput = document.getElementById("guessnum").value;

            // smaller number
            if (userinput < guessnumber) {
                $(".msg").html("Sorry! The number entered is smaller than the actual number");
                gameSound(true);
            }

            // greater number
            else if (userinput > guessnumber) {
                $(".msg").html("Sorry! The number entered is greater than the actual number")
                gameSound(true);
            }

            chance--;
            $(`.heart[data-chance=${chance}]`).addClass("one-chance-less");
            $(`.heart[data-chance=${chance}]`).removeClass("bg-animate");
            if (!chance) {
                $(".msg").html("<img src='images/fail-img.gif' class='soryimg img-fluid'>");
                $(".level-input").hide();
                $(".play-again-btn").show();
                gameSound("outOfMoves");
            }

            //Congrats
            if (userinput == guessnumber) {
                $(".msg").html("<img src='images/success-img.gif' class='correct img-fluid' width='450'>");
                $(".chances").hide();
                $(".level-input").hide();
                $(".play-again-btn").show();
                gameSound("win");
            }

            numHistory();
            document.getElementById("guessnum").value = '';
        }

        //If the number is not within Range, audio will be played
        else if ($("#guessnum").hasClass('error')) {
            gameSound("alert"); 
        }
    });
})










// let number = Math.floor((Math.random() * 100) + 1); // Generates a random number b/w 1 and 100
// let chances = 0; // Initial vaulue of chances taken to guess a number
// let guess; // Variable to store the number to be input from user to be guessed

// console.log("This is a guessing game and you have to enter a number and if it matches with the number generated by computer, then you win...\n");
// guess = prompt("Enter a number between 1 and 100");
// ++chances; // To increment the number of chances taken

// do {
//   guess = Number.parseInt(guess);

//   if (guess > number) {
//     console.log("Number entered is greater");
//     guess = prompt("Enter again!!");
//     guess = Number.parseInt(guess);
//     ++chances; // To increment the number of chances taken
//     continue;
//   }

//   else if (guess < number) {
//     console.log("Number entered is smaller");
//     guess = prompt("Enter again!!");
//     guess = Number.parseInt(guess);
//     ++chances; //To increment the number of chances taken
//     continue;
//   }

// } while (guess != number); //break the loop if number entered is equal to the number generated

// let score = 100 - chances; //To store the score of your game
// console.log("\nCongratulations🥳🥳\nThe number generated was", number + " and you guessed it right😁\nYour final score is", score);


// Initialize Firebase
var config = {
    apiKey: "AIzaSyAYM7iUyZwUngrL89GoJxGzl306E_4grAQ",
    authDomain: "rockpaperscissors-193da.firebaseapp.com",
    databaseURL: "https://rockpaperscissors-193da.firebaseio.com",
    projectId: "rockpaperscissors-193da",
    storageBucket: "rockpaperscissors-193da.appspot.com",
    messagingSenderId: "72589420438"
};
firebase.initializeApp(config);

var auth = firebase.auth();
//   Vars that decide which player you are
var justSigned = false;
var displayName;

var thisPlayer;
var thisButtonArea;
var thisRpsClass;
var thisLoginBtn;
var thisNamePlace;
var thisLeaveName;
var thisOtherLogArea;


var player1;
var player2;

var play1Pick;
var play2Pick;

var p1Wins = 0;
var p1Losses = 0;
var p2Wins = 0;
var p2Losses = 0;

//   Btns that control showing the correct login pages and their functions
$(".loginGame").on("click", function () {
    $(".login").fadeIn();
    console.log($(this).attr("data-player"));
    console.log($(this).attr("data-rpsClass"));
    console.log($(this).attr("data-butArea"));
    thisButtonArea = $(this).attr("data-butArea");
    thisRpsClass = $(this).attr("data-rpsClass");
    thisLoginBtn = $(this).attr("id");
    thisNamePlace = $(this).attr("data-namePlace");
    thisLeaveName = $(this).attr("data-leaveName");
    thisOtherLogArea = $(this).attr("data-otherLogArea");
    thisPlayer = $(this).attr("data-player");
});

$(".backBtn").on("click", function () {
    $(".login").fadeOut();
});

$(".signUpBackBtn").on("click", function () {
    $(".signUp").hide();
    $(".login").show();
});

$(".toSignUpBtn").on("click", function () {
    $(".login").hide();
    $(".signUp").show();
})
// ------------------------------------------------------------------------

// Authentication stuff

$(".signUpBtn").on("click", function () {
    var email = $("#signUpEmail").val().trim();
    var password = $("#signUpPassword").val().trim();
    displayName = $("#signUpDisplayName").val().trim();

    if (email === "" || displayName === "" || password === "") {
        alert("Must Enter Information In All Fields");
    } else {
        var promise = auth.createUserWithEmailAndPassword(email, password);
        promise.catch(function (event) {
            console.log(event.message);
        });
        justSigned = true;
        $(".signUp").fadeOut();

    }
})

$(".loginBtn").on("click", function () {
    console.log("loginBtn clicked");
    var email = $("#loginEmail").val().trim();
    var password = $("#loginPassword").val().trim();

    if (email === "" || password === "") {
        alert("Must Enter Information In All Fields");
    } else {
        var promise = auth.signInWithEmailAndPassword(email, password);
        promise.catch(function (event) {
            console.log(event.message);
        });

        $(".login").fadeOut();
    }

});

// Logout Btns
$(".logoutBtn").on("click", function () {
    firebase.auth().signOut();
    turnOffGame();
})


firebase.auth().onAuthStateChanged(function (user) {
    if (user && justSigned) {
        justSigned = false;
        user.updateProfile({
            displayName: displayName,
        });
        console.log(user);
        turnOnGame();

    } else if (user && !justSigned) {
        displayName = user.displayName;
        console.log("logged in again");
        console.log(user);
        turnOnGame();

    } else {
        console.log("not logged in");
    }
});
// ---------------------------------Turn on Game function-------------------------

function turnOnGame() {
    $("#" + thisButtonArea).slideDown();
    changeName(thisPlayer, displayName);
    $("#" + thisOtherLogArea).hide();
    $("." + thisRpsClass).on("click", setPicks)
    gameArray = [];
    $(".chatSubBtn").on("click", makeMessage);
}

function turnOffGame() {
    $("#" + thisButtonArea).slideUp();
    removeName(thisPlayer);
    $("#" + thisOtherLogArea).show();
    $("#chatSubBtn").off("click", makeMessage);
    firebase.database().ref("/gamePlay").remove();
    // May want to clear chat as well?
    console.log("should have run remove on /gamePlay");
    p1Losses = 0;
    p1Wins = 0;
    p2Losses = 0;
    p2Wins = 0;
    updateScores();
}

// Set perisistance to none
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
    .then(function () {
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // ...
        // New sign-in will be persisted with session persistence.
        return firebase.auth().signInWithEmailAndPassword(email, password);
    })
    .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
    });

var gameState = firebase.database().ref("/gameState");

gameState.on("value", function (snapshot) {
    if (snapshot.val() === null) {
        setGameState();
    } else {
        console.log(snapshot.val());
        player1 = snapshot.val().player1;
        player2 = snapshot.val().player2;
        $(".player1Name").text(snapshot.val().player1);
        $(".player2Name").text(snapshot.val().player2);

        if (player1 === "Player 1") {
            $("#loginGame1").show();
            $("#logout1").hide()
        } else {
            $("#loginGame1").hide();
            $("#logout1").show();
        };

        if (player2 === "Player 2") {
            $("#loginGame2").show();
            $("#logout2").hide()
        } else {
            $("#loginGame2").hide();
            $("#logout2").show();
        };
    }

})

function setGameState() {
    gameState.set({
        player1: "Player 1",
        player2: "Player 2"
    });

    gameArray = [];

    firebase.database().ref("/gamePlay").remove();
    firebase.database().ref("/chat").remove();
}



function changeName(thisPlayer, displayName) {
    firebase.database().ref("/gameState/" + thisPlayer).set(displayName);
}

function removeName(thisPlayer) {
    firebase.database().ref("/gameState/" + thisPlayer).set(thisLeaveName);
}

//   --------------------On Disconnect -----------------------------

// I do not know how to implement this really

firebase.database().ref("/chat").onDisconnect().remove();
firebase.database().ref("/gamePlay").onDisconnect().remove();

// Always works on player2 whether is player 1 of player 2. not good.
// Tried switching players, never catched first if statement, always goes else
// Probably stupid, but pretty sure that if statement is set up right, might use switch
if (thisPlayer === "player1") {
    firebase.database().ref("/gameState").onDisconnect().update({
        player1: "Player 1"
    });
} else {
    firebase.database().ref("/gameState").onDisconnect().update({
        player2: "Player 2"
    })
};

$(".gameArea").on("click", function () {
    console.log(thisPlayer + " " + typeof thisPlayer);
})


//   -------------------Game Play-------------------------------------

function setPicks() {
    var whichPick = $(this).text();
    console.log(whichPick);
    $("." + thisRpsClass).off("click", setPicks);
    var movePick = firebase.database().ref("/gamePlay").push();

    $("#" + thisButtonArea).slideUp();

    movePick.set({
        player: thisPlayer,
        pick: whichPick
    })
}

var gameArray = [];

firebase.database().ref("/gamePlay").on("child_added", function (snapshot) {
    var pick = snapshot.val().pick;
    var player = snapshot.val().player;
    gameArray.push(player);

    if (player === "player1") {
        play1Pick = pick;
        $(".playerBox1").css({ "background-color": "deepskyblue" });
    } else {
        play2Pick = pick;
        $(".playerBox2").css({ "background-color": "deepskyblue" });

    }

    if (gameArray.length >= 2) {
        round();
        gameArray = [];
        firebase.database().ref("/gamePlay").remove();
    }
})

function round() {
    $(".play1Pick").text(play1Pick);
    $(".play2Pick").text(play2Pick);
    console.log("player1 picked " + play1Pick);
    console.log("player2 picked " + play2Pick);
    if (play1Pick === play2Pick) {
        console.log("Tie");
        $(".win").hide();
        $(".tie").show();
        showResult();
    } else if (play1Pick === "Rock" && play2Pick === "Scissors" || play1Pick === "Scissors" && play2Pick === "Paper" || play1Pick === "Paper" && play2Pick === "Rock") {
        console.log("Player 1 Won");
        $(".winnerName").text(player1);
        p1Wins++;
        p2Losses++;
        showResult();

    } else {
        console.log("Player 2 Won");
        $(".winnerName").text(player2);
        p2Wins++;
        p1Losses++;
        showResult();
    }
}

function reset() {
    $(".playerBox").css({ "background-color": "#111" });
    $("#" + thisButtonArea).slideDown();
    $("." + thisRpsClass).on("click", setPicks);
    $(".win").show();
    $(".tie").hide();
}

function showResult() {
    updateScores();
    $(".roller").slideDown();
    setTimeout(function () {
        $(".roller").slideUp()
        reset();
    }, 2000);
}

function updateScores() {
    $(".winsP1").text(p1Wins);
    $(".lossesP1").text(p1Losses);
    $(".winsP2").text(p2Wins);
    $(".lossesP2").text(p2Losses);
}

// ---------------------------------End of Game--------------------------------

// ---------------------------------In Game Chat-------------------------------

var chatData = firebase.database().ref("/chat");

chatData.on("child_added", function (snapshot) {
    var user = snapshot.val().user;
    var message = snapshot.val().message;
    var block = $("<h4>").text(user + ": " + message);
    $(".chatBox").prepend(block);
});

function makeMessage() {
    var message = $("#chatInput").val().trim();
    var user = displayName;

    var chat = chatData.push();
    chat.set({
        user: user,
        message: message
    })

    $("#chatInput").val("");
}
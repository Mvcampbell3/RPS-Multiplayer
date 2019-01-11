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

var thisButtonArea;
var thisRpsClass;
var thisLoginBtn;
var thisNamePlace;
var thisLeaveName;
//   Btns that control showing the correct login pages and their functions
$(".loginGame").on("click", function () {
    $(".login").fadeIn();
    console.log($(this).attr("data-player"));
    console.log($(this).attr("data-rpsClass"));
    console.log($(this).attr("data-butArea"));
    $("body").css({ "background-color": "#333" });
    thisButtonArea = $(this).attr("data-butArea");
    thisRpsClass = $(this).attr("data-rpsClass");
    thisLoginBtn = $(this).attr("id");
    thisNamePlace = $(this).attr("data-namePlace");
    thisLeaveName = $(this).attr("data-leaveName");
});

$(".backBtn").on("click", function () {
    $("body").css({ "background-color": "#fff" });
    $(".login").fadeOut();
});

$(".signUpBackBtn").on("click", function () {
    $(".signUp").fadeOut();
    $(".login").fadeIn();
});

$(".toSignUpBtn").on("click", function () {
    $(".login").fadeOut();
    $(".signUp").fadeIn();
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
        $("body").css({ "background-color": "#fff" });

    }
})

$(".loginBtn").on("click", function () {
    console.log("loginBtn clicked");
    var email = $("#loginEmail").val().trim();
    var password = $("#loginPassword").val().trim();

    var promise = auth.signInWithEmailAndPassword(email, password);
    promise.catch(function (event) {
        console.log(event.message);
    });

    $(".login").fadeOut();
    $("body").css({ "background-color": "#fff" });
});

// Logout Btns
$(".logoutBtn").on("click", function(){
    firebase.auth().signOut();
    turnOffGame();
})

firebase.auth().onAuthStateChanged(function(user){
    if (user && justSigned) {
        justSigned = false;
        user.updateProfile({
            displayName: displayName,
        });
        console.log(user);
        turnOnGame()
    } else if (user && !justSigned) {
        displayName = user.displayName;
        console.log("logged in again");
        console.log(user);
        turnOnGame();
    } else {
        console.log("not logged in");
    }
});

function turnOnGame() {
    $("#"+thisButtonArea).css({"display":"flex"});
    $("#"+thisLoginBtn).hide();
    $("."+thisNamePlace).text(displayName);
}

function turnOffGame(){
    $("#"+thisButtonArea).css({"display":"none"});
    $("#"+thisLoginBtn).show();
    $("."+thisNamePlace).text(thisLeaveName);
}

// Set perisistance to none
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
  .then(function() {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    return firebase.auth().signInWithEmailAndPassword(email, password);
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  });
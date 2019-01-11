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

//   Btns that control showing the correct login pages and their functions
$(".loginGame").on("click", function () {
    $(".login").fadeIn();
    console.log($(this).attr("data-player"));
    console.log($(this).attr("data-rpsClass"));
    console.log($(this).attr("data-butArea"));
    $("body").css({ "background-color": "#333" });
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
})

firebase.auth().onAuthStateChanged(function(user){
    if (user && justSigned) {
        justSigned = false;
        user.updateProfile({
            displayName: displayName,
        });
        console.log(user);
    } else if (user && !justSigned) {
        console.log("logged in again");
        console.log(user);
    } else {
        console.log("not logged in");
    }
})
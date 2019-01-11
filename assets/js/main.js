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

//   Btns that control showing the correct login pages and their functions
$(".loginGame").on("click", function(){
    $(".login").fadeIn();
    console.log($(this).attr("data-player"));
    console.log($(this).attr("data-rpsClass"));
    console.log($(this).attr("data-butArea"));
    $("body").css({"background-color":"#333"});
});

$(".backBtn").on("click", function(){
    $("body").css({"background-color": "#fff"});
    $(".login").fadeOut();
});

$(".signUpBackBtn").on("click", function(){
    $(".signUp").fadeOut();
    $(".login").fadeIn();
});

$(".toSignUpBtn").on("click", function(){
    $(".login").fadeOut();
    $(".signUp").fadeIn();
})
// ------------------------------------------------------------------------

// Authentication stuff

$(".signUpBtn").on("click", function(){
    var email = $(".signUpEmail").val().trim();
    var displayName = $(".signUpDisplayName").val().trim();
    var password = $(".signUpPassword").val().trim();

    if (email === "" || displayName === "" || password === ""){
        alert("Must Enter Information In All Fields");
    }
})
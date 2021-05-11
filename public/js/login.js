const btn_register = document.querySelector("#btn-register");
const btn_login = document.querySelector("#btn-login");
const btn_logout = document.querySelector('#btn-logout');
const btn_secret = document.querySelector('#btn-secret');
const err1 = document.querySelector("#err1");
const err2 = document.querySelector("#err2");
const err3 = document.querySelector("#err3");
const err4 = document.querySelector("#err4");

$(document).ready(function () {

    // This hides the different error messages when clicked
    $("[id^=err]").click(function () {
        // Gets the ID of the button that was clicked
        var id = $(event.target)[0].id;

        $("#" + id).hide("slow");
    });

    // When document loads if the user is logged in then the popup will show the logged in version
    loginAttempt();

    $(btn_login).click(function () {
        var valid = validateLogin();

        if (valid) {
            login();
        }
    });

    $(btn_register).click(function () {
        var valid = validateRegistration();

        if (valid) {
            register();
        }
    });

    $(btn_logout).click(function () {
        logout();
    });
});

/**
 * Checks to see if the pass and username are in the database
 * 
 * return valid true: validation successful false: validation failed
 */
function validateLogin() {
    var username = $("#username").val();
    var pass = $("#password").val();

    // **** Could be Taken from the DB in the future  ****
    var usernameDB = $("#username").val();
    var passDB = $("#password").val();

    // In order username, pass
    var validated = [false, false];

    // Username
    if (!username.trim()) {
        $(err1).show("slow");
        $("#err1").text("Username is Empty!");
    } else if (!(username === usernameDB)) {
        $(err1).show("slow");
        $("#err1").text("Username is invalid!");
    } else {
        $(err1).hide("slow");
        validated[0] = true;
    }

    // Password
    if (!pass.trim()) {
        $(err2).show("slow");
        $("#err2").text("Password is Empty!");
    } else if (!(pass === passDB)) {
        // This should be err1 and the message something like Username or Pass invalid!
        // Not changed for easier testing
        $(err2).show("slow");
        $("#err2").text("Password is invalid!");
    } else {
        $(err2).hide("slow");
        validated[1] = true;
    }

    var valid = true;

    var i;
    for (i = 0; i < validated.length; i++) {
        if (!validated[i]) {
            valid = false;
        }
    }

    return valid;
}

/**
 * Checks if the register information is in the desired formats.
 * 
 * return valid true: validation successful false: validation failed
 */
function validateRegistration() {
    var username = $("#username").val();
    var pass = $("#password").val();
    var confirm = $("#confirm").val();
    var email = $("#email").val();

    // In order username, pass, confirm, email
    var validated = [
        false, false, false, false
    ]

    // Username
    if (!username.trim()) {
        $(err1).show("slow");
        $("#err1").text("Username is Empty!");
    } else {
        $(err1).hide("slow");
        validated[0] = true;
    }

    // Password
    if (!pass.trim()) {
        $(err2).show("slow");
        $("#err2").text("Password is Empty!");
    } else {
        $(err2).hide("slow");
        validated[1] = true;
    }

    // Password Confirm
    if (!confirm.trim()) {
        $(err3).show("slow");
        $("#err3").text("Confirm Password is Empty!");
    } else if (!(confirm.trim() === pass.trim())) {
        $(err3).show("slow");
        $("#err3").text("Passwords must match!");
    } else {
        $(err3).hide("slow");
        validated[2] = true;
    }

    // Email Section
    if (!email.trim()) {
        $(err4).show("slow");
        $("#err4").text("Email is Empty!");
    } else if (!email.includes("@") || !email.includes(".")) {
        $(err4).show("slow");
        $("#err4").text("Must contain: '@' AND '.'");
    } else {
        $(err4).hide("slow");
        validated[3] = true;
    }


    var valid = true;

    var i;
    for (i = 0; i < validated.length; i++) {

        if (!validated[i]) {
            valid = false;
        }
    }

    return valid;
}

/**
 * Logs in the user and adds a cookie used for checking if the user is logged in
 */
function login() {
    var username = $("#username").val();
    var pass = $("#password").val();

    /** TODO: the URL needs to be modified when server is hosted on cloud */
    $.ajax({
        url:  url + "/verify",
        type: "GET",
        data: { username: username, password: pass },
        success: function (response, status, http) {
            if (response === "FAILED") {
                $(err1).show("slow");
                $("#err1").text("Incorrect username or password!");
            }
            else {
                console.log("Creating Login Cookie");
                // Creates a cookie stored in local memory (Client side) is deleted when browser is closed
                document.cookie = "username=" + response.username + "; path=/";

                if (response.admin === 0)
                    document.cookie = "admin=false; path=/";
                else {
                    document.cookie = "admin=true; path=/";
                }

                loginAttempt();
            }
        }
    })
}

/**
 * Registers the user and calls the login() function
 */
function register() {
    var username = $("#username").val();  // The currently typed username
    var pass = $("#password").val();

    // TODO: Change URL when hosting on Heroku

    $.ajax({
        url: "http://localhost:5000/register",
        type: "POST",
        data: { username: username, password: pass },
        success: function (response, status, http) {
            if (response === "FAILED") {
                $(err1).show("slow");
                $("#err1").text("Username already in use!");
            }
            else {
                login();  // If made successfully, login using username and password
            }
        }
    })
}

/**
 *
 * @param {returns the cookie with the name of cname} cname
 */
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

/**
 * This function is called whenever there is a login attempt and at the loading of the webpage
 * 
 * It is responsible for hiding or showing the logged in version of the popup 
 */
function loginAttempt() {
    var usernameCookie = getCookie("username");
    var adminCookie = getCookie("admin");

    // Toggles the header body and logged in section
    // If cookie exists it will not be empty
    if (usernameCookie != "") {
        // The popup section
        $("#modal-header").hide();
        $("#modal-form").hide();

        $("#container-logged").children().show("slow");
        $("#welcome").text("Welcome " + usernameCookie + "!");

        $('.item-buttons').show("slow");

        // The initial screen showing prompt to login in
        $('#section-initial').hide("slow");

        // Arrow Pointing to Login
        $('.info-login').hide();

        // The main screen 
        $('#section-main').show("slow");

        // Global offline variable to determine if playing offline
        offline = false;

        // If user is admin then secret button is shown
        if (adminCookie == "true") {

        }
    } else if (offline) {
        // The initial screen showing prompt to login in
        $('#section-initial').hide("slow");

        // Arrow Pointing to Login
        $('.info-login').hide();

        // The main screen 
        $('#section-main').show();
    } else {
        // The popup section
        $("#container-logged").children().hide();
        $("#btn-secret").hide();

        $('.item-buttons').hide("slow");

        $("#modal-header").show("slow");
        $("#modal-form").show("slow");

        // The initial screen showing prompt to login in
        $('#section-initial').show("slow");

        // Arrow Pointing to Login
        $('.info-login').show("slow");

        // The main screen 
        $('#section-main').hide();
    }
}

/**
 * Deletes the username cookie and then calls loginAttempt()
 */
function logout() {

    // Deletes the cookie by setting the expiry date to the past
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "admin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    loginAttempt();
}
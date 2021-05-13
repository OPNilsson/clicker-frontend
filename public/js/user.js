const user_img = document.querySelector("#user-avatar");
const btn_stats = document.querySelector("#btn-stats");

// Cloud: https://hkr-clicker-cloud.herokuapp.com/stats
// Local: http://localhost:5000/stats/
const STATS_API_URL = "http://localhost:5000/stats/"

// Cloud: https://hkr-clicker-frontend.herokuapp.com/
// Local: http://localhost:3000/
const CLICKER_URL = "http://localhost:3000/"

$(document).ready(function () {

    // Set the picture when the document loads
    setPicture();

    $(user_img).click(function () {
        randomizePicture();
    });
});

/**
 * Randomizes the picture that is used to identify the user
 * 
 * TODO: Save picture in the DB as either an image or path
 * 
 *  ** COULD CHANGE THIS TO PICK A PIC FROM THE DATABASE ** 
 */
function randomizePicture() {

    // Bounded to 9 because there are 9 pics with the same name in public\assets\vectors\user_avatars
    var random = Math.floor(Math.random() * 9 + 1);

    var path = "/resources/vectors/user_avatars/00" + random + "-man.svg"; // This could be how it's saved in the DB if images can't be saved.

    $(user_img).attr("src", path)

}

/**
 * Sets the picture that is saved in the DB
 * 
 *  TODO load the picture from the database
 */
function setPicture(){
    randomizePicture();
}


/**
 *  TODO: interact with stats API from Cloud to show stats
 */
function getStats(){
    var usernameCookie = getCookie("username");
    var adminCookie = getCookie("admin");

    // Shows the stats popup panel
    $("#container-stats").children().show("slow");

    // Hides everything else
    $("#container-logged").children().hide();

    $.ajax({
        url: STATS_API_URL + "/verify",
        type: "GET",
        data: { username: usernameCookie, admin: adminCookie},
        success: function (response, status, http) {
            if (response === "FAILED") {
                $(err1).show("slow");
                $("#err1").text("Stats is down notify developers!");
            }
            else {
                
            }
        }
    })
}


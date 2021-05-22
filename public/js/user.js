const user_img = document.querySelector("#user-avatar");
const btn_stats = document.querySelector("#btn-stats");

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


}


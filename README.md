# Clicker-Project
A clicker game developed for [Cloud Development](https://www.hkr.se/en/course/DA376D/course-syllabus) course at HKR.

The project is divided into two parts:
[The Cloud Backend](https://hkr-clicker-cloud.herokuapp.com/) & [The Frontend Website](https://hkr-clicker-frontend.herokuapp.com/)

both these parts are hosted on Heroku but in different applications.
They are both using github actions to have automatic deployement to the cloud and as such have been placed in seperate github repositories. 

This README file contains the descriptions relevant to the frontend portion of the project for more please reffer to the Cloud Repository

## The Frontend Website
The frontend is made up by a website GUI that interacts with the backend using Ajax Calls. The purpose of the project is to be a clicker game which in the user can buy upgrades in order to get a high amount of energy gathered.

![Website](https://user-images.githubusercontent.com/45008469/119263101-fb1bc600-bbdd-11eb-8181-9aee671138ea.png)

## Saving Statistics
The game is executed entirely on a combination of timers; a timer which handles the calulation and the UI, and a timer which handles saving and loading from the cloud.

```javascript
 // Executes until clearInterval(timer) is called
    timer = setInterval(() => {
        addEnergy(entropy);

        updateVariableValues();

        // Having 0 pop is a bit weird.
        if(entropy > 0){
            popNumber(null, "top", entropy);
        }
        
    }, GAME_TIME);

    // Executes until clearInterval(saveInterval) is called
    saveInterval = setInterval(() => {
        saveProgress();
        loadProgress();
    }, SAVE_TIME);
```

Saving to the cloud is done by exposing an API (for more information see cloud readme) and sending the data over an AJAX call. In order to add extra secuirty when saving and loading from the cloud, the front end needs to establish a verified connection. This is done by embedding an AJAX call inside of another one which can only execute if the user verifies their credentials with the API. In code it looks like the following:

```javascript
function saveProgress() {
    console.log("Saving Progress")

    if (offline) {
        // Locally caches the current variables
        document.cookie = "energy=" + energy + "; path=/";
        document.cookie = "entropy=" + entropy + "; path=/";
        document.cookie = "totalEnergy=" + totalEnergy + "; path=/";

        document.cookie = "clickCount=" + clickCount + "; path=/";
        document.cookie = "clickValue=" + clickValue + "; path=/";
        document.cookie = "clickUpgradeLevel=" + clickUpgradeLevel + "; path=/";

        document.cookie = "upgradeCost=" + upgradeCost + "; path=/";
        document.cookie = "upgradeMulti=" + upgradeMulti + "; path=/";

    } else {

        var usernameCookie = getCookie("username");
        var adminCookie = getCookie("admin");

        $.ajax({
            url: STATS_API_URL + "/verify",
            type: "GET",
            data: { username: usernameCookie, admin: adminCookie },
            success: function (response, status, http) {
                if (response === "FAILED") {
                    $('.offline-error').show();
                    offline = true;

                    // After 2 save cycles it will try again
                    setTimeout(function () { offline = false; $('.offline-error').hide();}, SAVE_TIME * 2);
                }
                else {

                    $.ajax({
                        url: STATS_API_URL + "/save",
                        type: "GET",
                        data: {energy: energy, entropy: entropy, totalEnergy: totalEnergy, clickCount: clickCount, clickValue: clickValue, clickUpgrade: clickUpgradeLevel, upgradeCost: upgradeCost, upgradeMulti: upgradeMulti},
                        success: function (response, status, http) {
                            if (response === "FAILED") {
                                $('.offline-error').show();
                                offline = true;

                                // After 2 save cycles it will try again
                                setTimeout(function () { offline = false; $('.offline-error').hide(); }, SAVE_TIME * 2);
                            }
                            else {
                                console.log("Progress Saved Online!");
                            }
                        }
                    })
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown){
                $('.offline-error').show();
                offline = true;

                // After 2 save cycles it will try again
                setTimeout(function () { offline = false; $('.offline-error').hide(); }, SAVE_TIME * 2);
            }
            
        })

    }
}
 ```

## Offline
Although the game is meant to be played while logged in and connected to the backend, the user can opt to play offline otherwise. While playing offline the frontend saves the information locally through the use of browser cookies. The user is notified of this through a small error message as seen in the following image. 

![Offline](https://user-images.githubusercontent.com/45008469/119264320-f3aaeb80-bbe2-11eb-8d19-9c02e4311428.png)


### Lost Connection
If while playing the game the frontend for whatever reason breaks connection with the backend the game will revert to playing in offline mode untill the connection can be esablished again. Which the frontend will save all data back on the backend at that point. This is done code wise simply by ading a error condition to every AJAX call as shown in the following:

```javascript
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $('.offline-error').show();
                offline = true;

                // After 2 save cycles it will try again
                setTimeout(function () { offline = false; $('.offline-error').hide(); }, SAVE_TIME * 2);
            }
```

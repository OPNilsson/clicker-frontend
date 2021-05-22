// URL for stats API
// Cloud: https://hkr-clicker-cloud.herokuapp.com/stats
// Local: http://localhost:5000/stats/
const STATS_API_URL = "http://localhost:5000/stats/"

// Values for game usage
var entropy = 0;
var energy = 0;
var clickValue = 1;
var upgradeMulti = 2;
var upgradeLevel = 0;

var offline;
var upgradeCost;
var clickUpgradeCost;

// States to track
var clickCount = 0;
var totalEnergy = 0;
var clickUpgradeLevel = 0;

// Timers
var timer;
var saveInterval;

const GAME_TIME = 1000;
const SAVE_TIME = 30000;

// stats security
var verified = false;

$(document).ready(function () {

    // Executes until clearInterval(timer) is called
    timer = setInterval(() => {
        addEnergy(entropy);
        checkUpgrade();
        checkClickUpgrade();

        // Having 0 pop is a bit weird.
        if(entropy > 0){
            popNumber(null, "top", entropy);
        }
        
    }, GAME_TIME);

    // Executes until clearInterval(saveInterval) is called
    saveInterval = setInterval(() => {
        saveProgress();
    }, SAVE_TIME);

    // The button in the initial page
    $('#btn-offline').click(function () {
        offline = true;
        loginAttempt();
    });

    // Makes numbers float out when image is clicked
    $('.game-img').click(function () {
        clickCount++;;
        addEnergy(clickValue);
        popNumber(this, "top", (clickValue))
        
        $('#game-clickCount').text(clickCount.toString());
    });

    // Upgrade Button
    $('.btn-upgrade').click(function () {
        popNumber(this, "bottom", upgradeCost);
        upgrade();
        checkUpgrade();
    });

    // Click Upgrade Button
    $('.btn-clickUpgrade').click(function () {
        popNumber(this, "bottom", clickUpgradeCost);
        clickUpgrade();
        checkClickUpgrade();
    });

});

function addEnergy(create) {
    energy = energy + create;
    totalEnergy += create;

    $('#game-energy').text(energy.toString());
    $('#game-totalEnergy').text(totalEnergy.toString());
}

function upgrade() {
    entropy = entropy + 1;

    energy = energy - upgradeCost;
    upgradeMulti++;

    $('#game-entropy').text(entropy + " /s");
    $('#game-energy').text(energy.toString());
}

function clickUpgrade() {
    clickValue = clickValue + 1;

    energy = energy - clickUpgradeCost;
    clickUpgradeLevel++;

    $('#game-energy').text(energy.toString());
}

function checkUpgrade() {
    upgradeCost = (entropy + 5) * upgradeMulti;

    var text = "+1 Entropy Cost: " + upgradeCost;
    $('#upgrade-txt-1').text(text);

    if (energy >= upgradeCost) {
        $('.btn-upgrade').prop("disabled", false);
        $('.btn-upgrade').animate({ 'opacity': '100%' }, 100)
        
    }
    else {
        $('.btn-upgrade').prop("disabled", true);
        $('.btn-upgrade').animate({ 'opacity': '40%' }, 100)
    }
}

function checkClickUpgrade() {
    clickUpgradeCost = 100 * (clickUpgradeLevel + 1);

    var text = "+1 Click Value Cost: " + clickUpgradeCost;
    $('#clickUpgrade-txt-1').text(text);

    if (energy >= clickUpgradeCost) {
        $('.btn-clickUpgrade').prop("disabled", false);
        $('.btn-clickUpgrade').animate({ 'opacity': '100%' }, 100)
    }
    else {
        $('.btn-clickUpgrade').prop("disabled", true);
        $('.btn-clickUpgrade').animate({ 'opacity': '40%' }, 100)
    }
}

/**
 * Takes the object that was clicked to call this method 
 * and the id string of the last part of the id.
 *              i.e.    container-number-BOTTOM
 * 
 * The number param is the number being popped
 *              i.e clickValue
 * 
 * @param {html DOM element} element 
 * @param {string top | bottom} side 
 * @param {int}number
 */
function popNumber(element, side, number) {
    var random = Math.floor(Math.random() * 100) + 50; // returns a random integer from 50 to 100 
    var randomScale = Math.floor(Math.random() * 50) + 1; // returns a random integer from 1 to 50

    switch (side) {
        case "top": {
            var numberHTML = '<span class="game-number green">' + '+' + number + '</span>';
            $("#container-number-top").append(numberHTML);
            break;
        }

        case "bottom": {
            var numberHTML = '<span class="game-number red">' + '-' + number + '</span>';
            $("#container-number-bottom").append(numberHTML);
            break;
        }
    }

    if(element != null){

        $(element)
            .animate({ 'width': '-=' + randomScale + 'px' }, 100)
            .animate({ 'width': '+=' + randomScale + 'px' }, 100);
    }

    $(".game-number")
        .animate({ 'bottom': '+=5px' }, 150)
        .animate({ 'left': '+=' + random + 'px' }, 150)
        .animate({ 'top': '+=50px' }, 2000, "linear", function () {
            $(this).remove();
        });
}


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
            }
        })

    }
}

function loadProgress() {
    if (offline) {

        // Doesn't load empty values
        if (getCookie("energy") != "") {
            energy = parseInt(getCookie("energy"));
            entropy = parseInt(getCookie("entropy"));
            totalEnergy = parseInt(getCookie("totalEnergy"));

            clickCount = parseInt(getCookie("clickCount"));
            clickValue = parseInt(getCookie("clickValue"));
            clickUpgradeLevel = parseInt(getCookie("clickUpgradeLevel"));

            upgradeCost = parseInt(getCookie("upgradeCost"));
            upgradeMulti = parseInt(getCookie("upgradeMulti"));
        }

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
                    setTimeout(function () { offline = false; $('.offline-error').hide(); }, SAVE_TIME * 2);
                }
                else {

                    $.ajax({
                        url: STATS_API_URL + "/load",
                        type: "GET",
                        success: function (response, status, http) {
                            if (response === "FAILED") {
                                $('.offline-error').show();
                                offline = true;

                                // After 2 save cycles it will try again
                                setTimeout(function () { offline = false; $('.offline-error').hide(); }, SAVE_TIME * 2);
                            }
                            else {
                                console.log("Progress Loaded!");

                                energy = response.energy;
                                entropy = response.entropy;
                                totalEnergy = response.totalenergy;
                                clickCount = response.clickcount;
                                clickValue = response.clickvalue;
                                clickUpgradeLevel = response.clickupgradelevel;
                                upgradeCost = response.upgradecost;
                                upgradeMulti = response.upgrademulti;
                            }
                        }
                    })
                }
            }
        })

    }

    // Set labels to loaded values
    $('#game-energy').text(energy.toString());
    $('#game-entropy').text(entropy + " /s");
    $('#game-clickCount').text(clickCount.toString());
    $('#game-totalEnergy').text(totalEnergy.toString());
    checkUpgrade();
    checkClickUpgrade();
}


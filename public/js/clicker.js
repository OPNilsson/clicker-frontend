var entropy = 0;
var energy = 0;
var clickValue = 1;
var upgradeMulti = 2;
var upgradeLevel = 0;

var offline;
var upgradeCost;

// Timers
var timer;
var saveInterval;

$(document).ready(function () {

    // Get User Values from Database
    getEntropy();
    getEnergy();

    // Executes until clearInterval(timer) is called
    timer = setInterval(() => {
        addEnergy(entropy);
        checkUpgrade();

        // Having 0 pop is a bit weird.
        if(entropy > 0){
            popNumber(null, "top", entropy);
        }
        
    }, 1000);

    // Executes until clearInterval(saveInterval) is called
    saveInterval = setInterval(() => {
        saveProgress();
    }, 60000);

    // The button in the initial page
    $('#btn-offline').click(function () {
        offline = true;
        loadProgress();
        loginAttempt();
    });

    // Makes numbers float out when image is clicked
    $('.game-img').click(function () {
        addEnergy(clickValue);
        popNumber(this, "top", clickValue)
    });

    // Upgrade Button
    $('.btn-upgrade').click(function () {
        popNumber(this, "bottom", upgradeCost);
        upgrade();
        checkUpgrade();
    });

});

function getEnergy() {

    // TODO: get from database
    energy = 0;

    $('#game-energy').text("Current Energy = " + energy);
}

function getEntropy() {
    // TODO: get from database
    entropy = 0;

    $('#game-entropy').text("Energy Entropy = " + entropy + " /s");
}

function addEnergy(create) {
    energy = energy + create;

    $('#game-energy').text("Current Energy = " + energy);
}

function upgrade() {
    entropy = entropy + 1;

    energy = energy - upgradeCost;
    upgradeMulti++;

    $('#game-entropy').text("Entropy Rate = " + entropy + " /s");
    $('#game-energy').text("Current Energy = " + energy);
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
    if (offline) {
        // Locally caches the current variables
        document.cookie = "energy=" + energy + "; path=/";
        document.cookie = "entropy=" + entropy + "; path=/";

        document.cookie = "clickValue=" + clickValue + "; path=/";

        document.cookie = "upgradeCost=" + upgradeCost + "; path=/";
        document.cookie = "upgradeMulti=" + upgradeMulti + "; path=/";

    } else {
        // TODO: Save on the cloud
    }
}

function loadProgress() {
    if (offline) {

        // Doesn't load empty values
        if (getCookie("energy") != "") {
            energy = parseInt(getCookie("energy"));
            entropy = parseInt(getCookie("entropy"));

            clickValue = parseInt(getCookie("clickValue"));

            upgradeCost = parseInt(getCookie("upgradeCost"));
            upgradeMulti = parseInt(getCookie("upgradeMulti"));
        }

    } else {

        // TODO: load from the cloud
    }
}


const menu = document.querySelector('.menu span');
const nav = document.querySelector('.nav');
const linkContainer = document.querySelector('.nav-items');
const user = document.querySelector('.user');


$(document).ready(function () {

    highlightCurrentLink();
    scrollHide();

    $(".menu span").click(function () {

        nav.classList.toggle("expand");

        // show hide nav links on menu click with animation
        $(linkContainer).toggle("slow", function () {

        });

        // show hide user icon on menu click with animation
        $(user).toggle("slow", function () {

        });
    });

    // Makes sure that the NavItems are hidden if viewport is small to being with
    if ($(window).width() < 883) {
        hideNavItems();
    }


    $("li").each(function (index) {
        // If the page loads with the window already scrolled past any of the sections
        if (window.scrollY > ($(this).offsetHeight + $(this).offsetTop)) {

        }
    });
});

function hideNavItems() {
    $(linkContainer).hide();
    $(user).hide();
}

function showNavItems() {
    $(linkContainer).show();
    $(user).show();
}

// This function is called very often it might be needed to throtle it somehow if it slowsdown the website
$(window).resize(function () {
    if ($(window).width() < 883) {
        hideNavItems();
        nav.classList.remove("expand");
    } else {
        showNavItems();
    }
});

// This function is called very often it might be needed to throtle it somehow if it slowsdown the website
$(window).scroll(function () {
    scrollHide();
});

// Highlights the navbar link that the user is currently on
function highlightCurrentLink() {
    var url = window.location.href; // Returns full URL (https://example.com/path/example.html)
    const links = document.querySelectorAll(".nav-link");

    links.forEach(function (linkItem) {
        if (url.includes("about")) {
            if (linkItem.id.includes("about")) {
                $(linkItem).addClass("currentLocation");

            }
        } else if (url.includes("post")) {
            if (linkItem.id.includes("editing")) {
                $(linkItem).addClass("currentLocation");

            }
        } else {
            if (linkItem.id.includes("home")) {
                $(linkItem).addClass("currentLocation");
            }
        }
    });
}

// Changes the navbar to fixed property when the window is scrolled to the top
function scrollHide() {

    if ($(window).scrollTop() >= 250) {
        $(nav).addClass("fixNav");
    } else {
        $(nav).removeClass("fixNav");
    }
}
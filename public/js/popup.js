const openModalButtons = document.querySelectorAll('[data-modal-target]');
const closeModalButtons = document.querySelectorAll('[data-modal-close]');
const overlay = document.getElementById('overlay');

overlay.addEventListener('click', () => {
    const modals = document.querySelectorAll('.modal.active');
    modals.forEach(modal => {
        closeModal(modal);
    })
})

openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = document.querySelector(button.dataset.modalTarget)
        openModal(modal)
    }) 
})

closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        closeModal(modal);
    }) 
})

function openModal (modal) {
    if (modal == null) return;
    
    modal.classList.add('active');
    overlay.classList.add('active');

    disableScroll();
}

function closeModal (modal) {
    if (modal == null) return;
    
    modal.classList.remove('active');
    overlay.classList.remove('active');

    enableScroll();
}


// ----------- Login | Registration Page ---------- 

const loginTitle = document.getElementById('title-login');
const confirm = document.getElementById("form-confirm");
const email = document.getElementById('form-email');
const registerBtn = document.getElementById('btn-register');

const registerTitle = document.getElementById('title-register');
const loginBtn = document.getElementById('btn-login');

// This is an onclick as above but in jquery
$(loginTitle).click(function() {
  $(loginBtn).show("slow");

  // Hides the error messages if any are showing
  $(err1).hide("slow");
  $(err2).hide("slow");
  $(err3).hide("slow");
  $(err4).hide("slow");

  // Makes sure that the current tab is highlighted
  $(loginTitle).addClass("highlighted");
  $(registerTitle).removeClass("highlighted");

  $(confirm).hide("slow");
  $(email).hide("slow");
  $(registerBtn).hide("slow");
});

$(registerTitle).click(function() {
  // Hides the error messages if any are showing
  $(err1).hide("slow");
  $(err2).hide("slow");
  $(err3).hide("slow");
  $(err4).hide("slow");

  // Makes sure that the current tab is highlighted
  $(registerTitle).addClass("highlighted");
  $(loginTitle).removeClass("highlighted");

  $(confirm).show("slow");
  $(email).show("slow");
  $(registerBtn).show("slow");

  $(loginBtn).hide("slow");
});

// Makes the login highlighted on load
function highlightLogin() {
  $(loginTitle).addClass("highlighted");
}

// The following is code relating to disabling and enabling scrolling

// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
  window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
    get: function () { supportsPassive = true; } 
  }));
} catch(e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

// call this to Disable
function disableScroll() {
  $("html").css("overflow-y", "hidden");

  window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
  window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

// call this to Enable
function enableScroll() {
  $("html").css("overflow-y", "scroll");

  window.removeEventListener('DOMMouseScroll', preventDefault, false);
  window.removeEventListener(wheelEvent, preventDefault, wheelOpt); 
  window.removeEventListener('touchmove', preventDefault, wheelOpt);
  window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}
let headerButton;
let nav;
let navItems;

function toggleMenu() {
    if (headerButton.className.match(/nav__button--active/)) {
        nav.className = nav.className.replace(/ ?nav__items--active/, '');
        headerButton.className = headerButton.className.replace(/ ?nav__button--active/, '');
    } else {
        headerButton.className += ' nav__button--active';
        nav.className += ' nav__items--active';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    headerButton = document.getElementsByClassName('js-nav-button')[0];
    nav = document.getElementsByClassName('js-nav')[0];
    headerButton.addEventListener('click', function(e) {
        e.preventDefault();
        toggleMenu();
    });

    // Close menu when link clicked
    navItems = document.getElementsByClassName('js-nav-item');
    for (let i = 0; i < navItems.length; i++) {
        navItems[i].addEventListener('click', toggleMenu, false);
    }
});

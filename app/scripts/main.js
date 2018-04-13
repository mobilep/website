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

function initMobileMenu() {
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
}

function openModal()
{
  let modal = document.getElementsByClassName('js-modal')[0];
  let iframe = document.getElementsByClassName('js-modal-iframe')[0];
  iframe.src = iframe.dataset.src;
  modal.style.display = 'block';
}

function closeModal()
{
  let modal = document.getElementsByClassName('js-modal')[0];
  let iframe = document.getElementsByClassName('js-modal-iframe')[0];
  modal.style.display = 'none';
  iframe.src = '';
}

function initModal() {

  let openItems = document.getElementsByClassName('js-modal-trigger');
  for (let i = 0; i < openItems.length; i++) {
    openItems[i].addEventListener('click', function(e) {
      e.preventDefault();
      openModal();
    }, false);
  }

  let closeItems = document.getElementsByClassName('js-modal-close');
  for (let i = 0; i < closeItems.length; i++) {
    closeItems[i].addEventListener('click', function (e) {
      e.preventDefault();
      closeModal();
    }, false);
  }

}

document.addEventListener('DOMContentLoaded', function() {
  initMobileMenu();
  initModal();
});

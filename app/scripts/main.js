let headerButton;

function toggleMenu() {
  if(headerButton.className.match(/header__btn_active/)) {
    document.body.className = document.body.className.replace(/ ?header__btn_active/, '');
    headerButton.className = headerButton.className.replace(/ ?header__btn_active/, '');
  } else {
    headerButton.className += ' header__btn_active';
    document.body.className += ' header__btn_active';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  headerButton = document.getElementsByClassName('js-header-button')[0];
  headerButton.addEventListener('click', function(e) {
    e.preventDefault();
    toggleMenu();
  });
});

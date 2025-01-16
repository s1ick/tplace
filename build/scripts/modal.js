document.addEventListener('DOMContentLoaded', () => {
  const modal = document.querySelector('.js-modal');
  const header = document.querySelector('.header');
  const burgerIcon = document.querySelector('.header__burger-icon');
  const closeButton = document.querySelector('.closebtn');
  
  const toggleClass = (element, className, action) => {
    element.classList[action](className);
  };

  document.addEventListener('click', (e) => {
    if (e.target.matches('.js-open-modal')) toggleClass(modal, 'active', 'add');
    if (e.target.matches('.js-close-modal') || e.target === modal) toggleClass(modal, 'active', 'remove');
    
    if (e.target.matches('.header__burger-icon')) {
      toggleClass(header, 'active-mobile', 'add');
      burgerIcon.style.display = 'none';  // Прячем бургер-иконку
      closeButton.style.display = 'block';  // Показываем кнопку закрытия
    }

    if (e.target.matches('.closebtn')) {
      toggleClass(header, 'active-mobile', 'remove');
      burgerIcon.style.display = 'block';  // Показываем бургер-иконку
      closeButton.style.display = 'none';  // Прячем кнопку закрытия
    }
  });
});

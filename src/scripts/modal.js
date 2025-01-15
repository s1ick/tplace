
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.querySelector('.js-modal'); // Модальное окно
    const openModalButton = document.querySelector('.js-open-modal'); // Кнопка открытия
    const closeModalButton = document.querySelector('.js-close-modal'); // Кнопка закрытия
  
    // Открытие модального окна при клике на кнопку
    openModalButton.addEventListener('click', function() {
      modal.classList.add('active'); // Добавляем класс 'active', чтобы показать окно
    });
  
    // Закрытие модального окна при клике на кнопку закрытия
    closeModalButton.addEventListener('click', function() {
      modal.classList.remove('active'); // Убираем класс 'active', чтобы скрыть окно
    });
  
    // Закрытие модального окна при клике на область вне окна
    window.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.classList.remove('active'); // Закрываем окно, если кликнули за пределы
      }
    });
  });
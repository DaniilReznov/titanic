document.addEventListener('DOMContentLoaded', function() {
  const passengersTableBody = document.getElementById('passengersTableBody');
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const resetButton = document.getElementById('resetButton');
  const loadingElement = document.getElementById('loading');
  
  let allPassengers = [];
  let displayedPassengers = [];
  let currentIndex = 0;
  const batchSize = 50;
  let isLoading = false;
  let currentSearchTerm = '';
  
  // Загрузка данных
  fetch('passengers.json')
    .then(response => response.json())
      .then(data => {
          allPassengers = data;
          displayedPassengers = [...allPassengers];
          loadMorePassengers();
      })
      .catch(error => {
          console.error('Ошибка загрузки данных:', error);
          loadingElement.textContent = 'Ошибка загрузки данных. Пожалуйста, обновите страницу.';
      });
  
  function loadMorePassengers() {
    if (isLoading || currentIndex >= displayedPassengers.length) return;
    
    isLoading = true;
    loadingElement.textContent = 'Загрузка данных...';
    
    setTimeout(() => {
        const endIndex = Math.min(currentIndex + batchSize, displayedPassengers.length);
        const passengersToAdd = displayedPassengers.slice(currentIndex, endIndex);
        
        passengersToAdd.forEach(passenger => {
            const row = document.createElement('tr');
            
            // Ячкйка для имени
            const nameCell = document.createElement('td');
            nameCell.textContent = passenger.name || 'Неизвестно';
            row.appendChild(nameCell);
            
            // Ячкйка для пола
            const genderCell = document.createElement('td');
            genderCell.textContent = passenger.gender === 'male' ? 'Мужской' : 'Женский';
            row.appendChild(genderCell);
            
            // Ячкйка для возраста
            const ageCell = document.createElement('td');
            ageCell.textContent = passenger.age !== undefined ? passenger.age : 'Неизвестно';
            row.appendChild(ageCell);

            // Ячкйка для билета
            const ticketCell = document.createElement('td');
            ticketCell.textContent = passenger.ticket !== undefined ? passenger.ticket : 'Неизвестно';
            row.appendChild(ticketCell);

            // Ячкйка для кают
            const cabinCell = document.createElement('td');
            cabinCell.textContent = passenger.cabin !== undefined || null ? passenger.cabin : 'Неизвестно';
            row.appendChild(cabinCell);
            
            // Ячкйка для статуса выживания
            const survivedCell = document.createElement('td');
            survivedCell.textContent = passenger.survived ? 'Да' : 'Нет';
            survivedCell.classList.add(passenger.survived ? 'survived' : 'not-survived');
            row.appendChild(survivedCell);
            
            passengersTableBody.appendChild(row);
        });
        
        currentIndex = endIndex;
        isLoading = false;
        
        if (currentIndex >= displayedPassengers.length) {
            loadingElement.textContent = 'Все данные загружены';
        } else {
            loadingElement.textContent = '';
        }
    }, 300);
}
  
  // Функция для поиска пассажиров
  function searchPassengers() {
      currentSearchTerm = searchInput.value.toLowerCase();
      
      displayedPassengers = allPassengers.filter(passenger => {
          const nameMatch = passenger.name?.toLowerCase().includes(currentSearchTerm) || false;
          const genderMatch = (passenger.gender === 'male' ? 'мужской' : 'женский').includes(currentSearchTerm);
          const ageMatch = passenger.age?.toString().includes(currentSearchTerm) || false;
          const ticketMatch = passenger.ticket?.toString().includes(currentSearchTerm) || false;
          const cabinMatch = passenger.cabin ? passenger.cabin.toString().toLowerCase().includes(currentSearchTerm.toLowerCase()) : false;
          const survivedMatch = (passenger.survived ? 'да' : 'нет').includes(currentSearchTerm);
          
          return nameMatch || genderMatch || ageMatch || ticketMatch || cabinMatch || survivedMatch;
      });
      
      // Сброс таблицы
      passengersTableBody.textContent = '';
      currentIndex = 0;
      
      if (displayedPassengers.length === 0) {
          loadingElement.textContent = 'Ничего не найдено';
      } else {
          loadMorePassengers();
      }
  }
  
  // Обработчик прокрутки для lazy loading
  window.addEventListener('scroll', function() {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      
      if (scrollTop + clientHeight >= scrollHeight - 200) {
          loadMorePassengers();
      }
  });
  
  // Обработчики кнопок
  searchButton.addEventListener('click', searchPassengers);
  
  searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
          searchPassengers();
      }
  });
  
  resetButton.addEventListener('click', function() {
      searchInput.value = '';
      currentSearchTerm = '';
      displayedPassengers = [...allPassengers];
      passengersTableBody.textContent = '';
      currentIndex = 0;
      loadMorePassengers();
  });
});
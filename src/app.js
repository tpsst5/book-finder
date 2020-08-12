import {
  http
} from './http';

import {
  ui
} from './ui';

// Event Listeners & Variables
document.querySelector('.btn-search').addEventListener('click', searchBooks);
document.addEventListener('DOMContentLoaded', getBooks);
const modalBody = document.querySelector('.modal-body');

// Get books on DOM load
function getBooks() {
  http.get('http://localhost:3000/books')
    .then(data => ui.showBooks(data))
    .catch(err => console.log(err));
}

// Search for books
function searchBooks() {
  const searchInput = document.querySelector('#search-input');

  if (!searchInput.value) {
    ui.showError();
  } else {
    http.get(`https://www.googleapis.com/books/v1/volumes?q=${searchInput.value}`)
      .then(modalBody.innerHTML = `
      <div class="text-center">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      `)
      .then(data => {
        ui.searchBooks(data.items);
        ui.addBook(data.items);
        searchInput.value = '';
      })
      .catch(err => console.log(err));
  }
}
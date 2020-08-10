import {
  http
} from './http';

import {
  ui
} from './ui';

// Event Listeners & Variables
document.querySelector('.btn-search').addEventListener('click', searchBooks);
const modalBody = document.querySelector('.modal-body');


// Search for books
function searchBooks() {
  const searchInput = document.querySelector('#search-input').value;

  if (!searchInput) {
    ui.showError();
  } else {
    http.get(`https://www.googleapis.com/books/v1/volumes?q=${searchInput}`)
      .then(modalBody.innerHTML = `
      <div class="text-center">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      `)
      .then(data => {
        ui.showBooks(data.items);
        ui.addBook(data.items);
      })
      // .then(ui.addBook())
      .catch(err => console.log(err));
  }
}
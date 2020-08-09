import {
  http
} from './http';

import {
  ui
} from './ui';

// Event Listeners
document.querySelector('.btn-search').addEventListener('click', searchBooks);

// Search for books
function searchBooks() {
  const searchInput = document.querySelector('#search-input').value;

  if (!searchInput) {
    ui.showError();
  } else {
    http.get(`https://www.googleapis.com/books/v1/volumes?q=${searchInput}`)
      .then(data => ui.showBooks(data.items))
      .catch(err => console.log(err));
  }
}
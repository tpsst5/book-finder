import {
  http
} from './http';

import {
  ui
} from './ui';

// Event Listeners & Variables
document.querySelector('.btn-search').addEventListener('click', searchBooks);
document.addEventListener('DOMContentLoaded', getBooks);
document.querySelector('#library-body').addEventListener('click', editBook);
document.querySelector('#library-body').addEventListener('click', deleteBook);
document.querySelector('#library-link').addEventListener('click', ui.smoothScroll);

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
        searchInput.value = '';
      })
      .catch(err => console.log(err));
  }
}

// Edit a book
function editBook(e) {
  if (e.target.parentElement.classList.contains('edit-book')) {
    // Get row of book
    const parentRow = e.target.parentElement.parentElement.parentElement;
    // Make book row items editable
    parentRow.contentEditable = 'true';
    // Highlight Row
    parentRow.className = 'table-warning';
    // Get body element for event listener
    const body = document.getElementsByTagName('BODY')[0];
    // Edit selected book and update library database
    setTimeout(function () {
      // Listen for click outside row
      body.addEventListener('click', function () {
        // Check if edit state is active
        if (parentRow.contentEditable !== 'false') {
          parentRow.contentEditable = 'false';
          // Book Data
          const id = parentRow.id;
          const title = parentRow.firstElementChild.textContent;
          const author = parentRow.firstElementChild.nextElementSibling.textContent;
          const genre = parentRow.lastElementChild.previousElementSibling.textContent;
          const book = {
            id,
            title,
            author,
            genre
          }
          // Update library database
          http.put(`http://localhost:3000/books/${id}`, book)
            .then(data => {
              console.log('Library edited');
              ui.alertUpdateDelete('edit');
              parentRow.className = '';
              getBooks();
            })
            .catch(err => console.log(err));
        }
      }, false);
      // Listen for click on/in row
      parentRow.addEventListener('click', function (e) {
        e.stopPropagation();
      }, false);

    }, 250);
  }

  e.preventDefault();
}

// Delete book from library 
function deleteBook(e) {
  if (e.target.parentElement.classList.contains('delete-book')) {
    // Get row of book
    const parentRow = e.target.parentElement.parentElement.parentElement;
    const id = parentRow.id;
    parentRow.remove();
    http.delete(`http://localhost:3000/books/${id}`)
      .then(data => {
        console.log('Book removed');
        ui.alertUpdateDelete('delete');
        getBooks();
      })
      .catch(err => console.log(err));
  }

  e.preventDefault();
}
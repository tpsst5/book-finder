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

// Edit a book
function editBook(e) {
  if (e.target.parentElement.classList.contains('edit-book')) {
    // Get row of book
    const parentRow = e.target.parentElement.parentElement.parentElement;
    // Make book row items editable
    parentRow.contentEditable = 'true';
    // Get body element for event listener
    const body = document.getElementsByTagName('BODY')[0];

    setTimeout(function () {
      // Listen for click outside row
      body.addEventListener('click', function () {
        parentRow.contentEditable = 'false';
        // call ui function to update data structure here
      }, false);
      // Listen for click on/in row
      parentRow.addEventListener('click', function (e) {
        // console.log('still editing');
        e.stopPropagation();
      }, false);
    }, 250);

    // const id = parentRow.id;
    // const title = parentRow.firstElementChild.textContent;
    // const author = parentRow.firstElementChild.nextElementSibling.textContent;
    // const genre = parentRow.lastElementChild.previousElementSibling.textContent;

    // const book = {
    //   id,
    //   title,
    //   author,
    //   genre
    // }

    // Make selection editable
    // ui.editSelectedBook(book);
  }

  e.preventDefault();
}

function deleteBook(e) {
  // console.log(e.target);

  e.preventDefault();
}
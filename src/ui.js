import {
  http
} from './http';

class UI {
  constructor() {
    this.modalLabel = document.querySelector('#modalLabel');
    this.modalBody = document.querySelector('.modal-body');
    this.libraryBody = document.querySelector('#library-body');
  }


  // Display saved books on DOM load
  showBooks(data) {
    let output = '';
    data.forEach(book => {
      output += `
        <tr id="${book.id}">
          <td class="title">${book.title}</td>
          <td class="author">${book.author}</td>
          <td class="genre">${book.genre}</td>
          <td class="action-icons">
            <a href="#" id="edit-${book.id}" class="text-warning edit-book card-link">
              <i class="fa fa-pencil"></i>
            </a>
            <a href="#" id="delete-${book.id}" class="text-danger delete-book card-link">
              <i class="fa fa-remove"></i>
            </a>
          </td>
        </tr>
      `;
    });

    this.libraryBody.innerHTML = output;
  }

  // Show searched books
  searchBooks(books) {
    this.modalLabel.textContent = 'Search results';
    let bookList = [];
    let output = '';

    // Book constructor
    function Book(index, title, author, description, category, link, image) {
      this.index = index;
      this.title = title;
      this.author = author;
      this.description = description;
      this.category = category;
      this.link = link;
      this.image = image;
    }

    // Add each book from API to bookList array
    books.forEach((book, index) => {
      let img = null;
      // Check if image available
      if (!book.volumeInfo.imageLinks) {
        img = 'No image';
      } else {
        img = book.volumeInfo.imageLinks.smallThumbnail;
      }

      bookList.push(new Book(
        index, // PRETTY SURE I DONT NEED THIS. NEED AN INDEX FOR LIBRARY
        book.volumeInfo.title,
        book.volumeInfo.authors,
        book.volumeInfo.description,
        book.volumeInfo.categories,
        book.volumeInfo.infoLink,
        img
      ));
    });

    // Display the search results in the modal
    bookList.forEach(book => {
      output += `
        <div class="card my-4 p-3 bg-dark">
          <div class="row">
            <div class="col-3">
              <a target="_blank" href="${book.link}">
                <img src="${book.image}" alt="book image" class="img-fluid">
              </a>
            </div>
            <div class="col-9 p-4">
              <p class="text-white" id="title-${book.index}"><strong>Title: </strong>${book.title}</p>
              <p class="text-white" id="author-${book.index}"><strong>Author: </strong>${book.author}</p>
              <hr class="bg-light">
              <p class="text-white text-wrap">${book.description || `<i>No description available</i>`}</p>
              <button type="button" data-id="${book.index}" id="${book.index}" class="btn btn-block btn-outline-light add-book">Add Book</button>
            </div>
          </div>
        </div>
      `;
    });

    this.modalBody.innerHTML = output;
  }


  // Display error when input is blank
  showError() {
    this.modalLabel.textContent = 'Error';

    this.modalBody.innerHTML = `
      <div class="alert alert-danger text-center">
        Please enter a book title or author in search field
      </div>
    `
  }


  // Add a book from list to library
  addBook(books) {

    // GETTING ERROR THAT PROGRESSES IN STAGES. STARTS ONCE YOU CLOSE MODULE AND TRY TO ADD ANOTHER BOOK. THEN AFTER YOU CLOSE THE MODULE AGAIN AND TRY TO ADD ANOTHER BOOK YOU GET BOTH THE SUCCESS AND FAIL ALERTS...

    // Listen for click event inside modal display
    this.modalBody.addEventListener('click', bookSelected);

    // Select a book
    function bookSelected(event) {
      if (event.target.classList.contains('add-book')) {
        addSelectedBook(event.target);
      }
    }

    function addSelectedBook(book) {
      // Variables
      const selectedId = book.getAttribute('data-id');
      const lastBookId = Number(document.querySelector('#library-body').lastElementChild.id);
      const id = lastBookId + 1;
      const title = book.parentElement.firstElementChild.innerText.slice(7);
      const author = book.parentElement.firstElementChild.nextElementSibling.innerText.slice(8);

      let genre = '';
      // Check if genre is available for selected book
      if (!books[selectedId].volumeInfo.categories) {
        genre = 'Not available';
      } else {
        genre = books[selectedId].volumeInfo.categories[0];
      }
      // Book to be added to library
      const newBook = {
        id,
        title,
        author,
        genre
      }
      // Get current book database to check if selected book is in library
      http.get('http://localhost:3000/books/')
        .then(data => checkLibrary(data))
        .catch(err => console.log(err))

      function checkLibrary(data) {
        let inLibrary = null;
        data.forEach(book => {
          if (book.title === newBook.title && book.author === newBook.author) {
            inLibrary = true;
          }
        });
        // If book is already in library display error. If not continue
        if (inLibrary === true) {
          // Show error since book is already in library
          document.querySelector('.alert-warning').className = "alert alert-warning alert-dismissible fade show";
          // Hide after 3 seconds
          setTimeout(function () {
            document.querySelector('.alert-warning').className = "alert alert-warning alert-dismissible fade hide";
          }, 3000);
        } else {
          // POST book to library
          http.post('http://localhost:3000/books', newBook)
            .then(data => refreshLibrary())
            .catch(err => console.log(err));

          // GET data and refresh library UI
          function refreshLibrary() {
            http.get('http://localhost:3000/books/')
              .then(data => ui.showBooks(data))
              .then(successAlert())
              .catch(err => console.log(err))
          }
          // Show success alert
          function successAlert() {
            document.querySelector('.alert-success').className = "alert alert-success alert-dismissible fade show";
            // Hide alert after 3 seconds
            setTimeout(function () {
              document.querySelector('.alert-success').className = "alert alert-success alert-dismissible fade hide";
            }, 3000);
          }
        }
      }
    }
  }
}

export const ui = new UI();
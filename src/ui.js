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
    const modalBody = document.querySelector('.modal-content');
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
    // Display modal html
    this.modalBody.innerHTML = output;

    // Listen for click on each book button
    const bookBtns = document.querySelectorAll('.add-book');
    bookBtns.forEach(book => book.addEventListener('click', bookSelected));

    // Select a book
    function bookSelected(event) {
      // Pass in selected book data to ui.addBook()
      ui.addBook(books[event.target.id].volumeInfo);

      event.preventDefault();
    }
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


  // Called from searchBooks(). Add a book from list to library
  addBook(book) {
    let lastBookId = 0;

    // Check if there are books in library then last book ID equals last item
    if (document.querySelector('#library-body').lastElementChild) {
      lastBookId = Number(document.querySelector('#library-body').lastElementChild.id);
    }

    let id = lastBookId + 1;

    const title = book.title;

    // Check for authors
    let author = null;
    (book.authors) ? author = book.authors[0]: author = 'Not available';

    // Check for genre
    let genre = null;
    (book.categories) ? genre = book.categories[0]: genre = 'Not avalaible';

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


  // Show alert when book edited or deleted
  alertUpdateDelete(type) {
    if (type === 'edit') {
      // Change alert text for edit and show alert
      document.querySelector('#edit-del-alert').innerText = "Edit complete";
      document.querySelector('#edit-del-alert').className = "alert alert-primary text-center fade show";

      // Hide alert after 3 seconds
      setTimeout(function () {
        document.querySelector('#edit-del-alert').className = "alert alert-primary text-center fade hide";
      }, 3000);
    } else if (type === 'delete') {
      // Change alert text for delete and show alert
      document.querySelector('#edit-del-alert').innerText = "Book deleted";
      document.querySelector('#edit-del-alert').className = "alert alert-danger text-center fade show";

      // Hide alert after 3 seconds
      setTimeout(function () {
        document.querySelector('#edit-del-alert').className = "alert alert-danger text-center fade hide";
      }, 3000);
    }
  }


  // Smooth scroll to library section
  smoothScroll() {
    const library = document.querySelector('#library');
    const libraryPosition = library.getBoundingClientRect().top;
    const startPosition = window.pageYOffset;
    const distance = libraryPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, startPosition, distance, 1000);
      window.scrollTo(0, run);
      if (timeElapsed < 1000) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
  }
}

export const ui = new UI();
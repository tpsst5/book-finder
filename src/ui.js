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
        <tr id="book-${book.id}">
          <td class="title">${book.title}</td>
          <td class="author">${book.author}</td>
          <td class="genre">${book.genre}</td>
          <td class="action-icons">
            <a href="#" class="text-warning edit card-link" data-id="tbd">
              <i class="fa fa-pencil"></i>
            </a>
            <a href="#" class="text-danger delete card-link" data-id="tbd">
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
              <button type="button" data-id="${book.index}" id="book-${book.index}" class="btn btn-block btn-outline-light add-book">Add Book</button>
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
    // Variables and Event Listeners
    const libraryBody = document.querySelector('#library-body');
    const index = document.querySelector('#library-body').childElementCount + 1;
    let selectedTitle = null;
    let selectedAuthor = null;
    let selectedGenre = null;
    let selectedId = null;
    this.modalBody.addEventListener('click', bookSelected);

    // Select a book
    function bookSelected(event) {
      if (event.target.classList.contains('add-book')) {
        addSelectedBook(event.target);
      }
    }

    // Check to see if book is in library then add book
    function addSelectedBook(book) {
      selectedTitle = book.parentElement.firstElementChild.innerText
        .slice(7);
      selectedAuthor = book.parentElement.firstElementChild.nextElementSibling.innerText
        .slice(8);
      selectedId = book.getAttribute('data-id');

      // Check if genre is available for selected book
      if (!books[selectedId].volumeInfo.categories) {
        selectedGenre = 'Not available';
      } else {
        selectedGenre = books[selectedId].volumeInfo.categories[0];
      }

      const currentBooks = Array.from(libraryBody.children);
      let inLibrary = false;

      // Check each book title and author in current library
      currentBooks.forEach(book => {
        let libraryTitle = book.firstElementChild.innerText
          .toUpperCase();
        let libraryAuthor = book.firstElementChild.nextElementSibling.innerText
          .toUpperCase();

        // Check if exact book selected is in library
        if (selectedTitle.toUpperCase() === libraryTitle && selectedAuthor.toUpperCase() === libraryAuthor) {
          inLibrary = true;
        }
      });

      // Add to library
      if (inLibrary === false) {
        let newBookElement = `  <tr id="book-${index}">
          <td class="title">${selectedTitle}</td>
          <td class="author">${selectedAuthor}</td>
          <td class="genre">${selectedGenre}</td>
          <td class="action-icons">
          <a href="#" class="text-warning edit card-link" data-id="tbd">
            <i class="fa fa-pencil"></i>
          </a>
          <a href="#" class="text-danger delete card-link" data-id="tbd">
            <i class="fa fa-remove"></i>
          </a>
        </td>
        </tr>
        `;
        let updatedLibrary = libraryBody.innerHTML + newBookElement;
        // Update library html
        libraryBody.innerHTML = updatedLibrary;
        // Show success alert
        document.querySelector('.alert-success').className = "alert alert-success alert-dismissible fade show";
        // Hide alert after 3 seconds
        setTimeout(function () {
          document.querySelector('.alert-success').className = "alert alert-success alert-dismissible fade hide";
        }, 3000);
      } else {
        // Book already in library. Show alert
        document.querySelector('.alert-warning').className = "alert alert-warning alert-dismissible fade show";
        // Hide after 3 seconds
        setTimeout(function () {
          document.querySelector('.alert-warning').className = "alert alert-warning alert-dismissible fade hide";
        }, 3000);
      }
    }
  }
}

export const ui = new UI();
class UI {
  constructor() {
    this.modalLabel = document.querySelector('#modalLabel');
    this.modalBody = document.querySelector('.modal-body');
  }

  // Show searched books
  showBooks(books) {
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
      bookList.push(new Book(
        index,
        book.volumeInfo.title,
        book.volumeInfo.authors,
        book.volumeInfo.description,
        book.volumeInfo.categories,
        book.volumeInfo.infoLink,
        book.volumeInfo.imageLinks.smallThumbnail
      ));
    });
    console.log(bookList);

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
              <p class="text-white"><strong>Title: </strong>${book.title}</p>
              <p class="text-white"><strong>Author: </strong>${book.author}</p>
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
  addBook() {
    // Variables and Event Listeners
    const libraryBody = document.querySelector('#library-body');
    this.modalBody.addEventListener('click', bookSelected);

    // Select a book
    function bookSelected(event) {
      // console.log(event.target);

      if (event.target.classList.contains('add-book')) {
        // console.log(event.target.id);
        addSelectedBook(event.target.id);
      }
    }

    // Check to see if book is in library then add book
    function addSelectedBook(book) {
      console.log(book);
      console.log(libraryBody.children);
    }
  }
}

export const ui = new UI();
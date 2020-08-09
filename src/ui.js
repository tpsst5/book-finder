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
              <button type="button" id="index-${book.index} class="btn btn-block btn-outline-light add-book">Add Book</button>
            </div>
          </div>
        </div>
      `;
    });

    this.modalBody.innerHTML = output;


    // Add a book from list to library
    document.querySelector('.add-book').addEventListener('click', addBook);

    function addBook() {
      console.log('book added...');
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
}

export const ui = new UI();
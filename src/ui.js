class UI {
  constructor() {
    this.modalBody = document.querySelector('.modal-body');
  }

  // Show searched books
  showBooks(books) {
    console.log(books);
    let bookList = [];
    let output = '';

    // Book constructor
    function Book(index, title, subtitle, author, description, category, link, image) {
      this.index = index;
      this.title = title;
      this.subtitle = subtitle;
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
        book.volumeInfo.subtitle,
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
      console.log(book.title);
      output += `
        <div class="card mb-3">
          <div class="row">
            <div class="col">
              <img src="${book.image}" alt="book image" class="img-fluid">
            </div>
            <div class="col p-2">
              <p>Title: ${book.title}</p>
              <p>Author: ${book.author}</p>
            </div>
          </div>
        </div>
      `;
    });
    // output += `
    //   <div class="card">
    //     <div class="card-body">
    //       <div class="row"
    //         <div class="col-6>
    //         <img src="${book.image}" alt="book image" class="img-fluid">
    //         </div>
    //         <div class="col-6>
    //           <p>Title: ${book.title}</p>
    //           <br>
    //           <p>${book.subtitle}</p>
    //           <br>
    //           <p>Author: ${book.author}</p>
    //           <br>
    //           <p>${book.description}</p>
    //           <br>
    //           <a target="_blank" href="${book.link}">More info</a>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // `;

    this.modalBody.innerHTML = output;
  }
}

export const ui = new UI();
class UI {
  constructor() {
    // this.book =
  }

  // Show searched books
  showBooks(books) {
    console.log(books);
    let bookList = [];

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

    });
  }
}

export const ui = new UI();
class UI {
  constructor() {
    // this.book =
  }

  // Show searched books
  showBooks(books) {
    window.location = 'books.html';
    console.log(books);
  }
}

export const ui = new UI();
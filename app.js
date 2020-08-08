// Event Listeners
document.querySelector('.btn-search').addEventListener('click', searchBooks);

// Load http.js
const http = new HTTP;

function searchBooks() {
  let BookData;
  const searchInput = document.querySelector('#search-input').value;

  if (!searchInput) alert('Enter search item');

  http.get(`https://www.googleapis.com/books/v1/volumes?q=${searchInput}`)
    .then(data => bookData = data.items)
    .catch(err => console.log(err));

}
// Event Listeners
document.querySelector('.btn-search').addEventListener('click', searchBooks);

// Load http.js
const http = new HTTP;

function searchBooks() {
  console.log(document.querySelector('#search-input').value);
  if (!document.querySelector('#search-input').value) alert('Enter search item');
}
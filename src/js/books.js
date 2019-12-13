window.addEventListener('load', onload);
function onload() {
  fetchBookList(displayBookData, displayError);
}
async function fetchBookList(success, fail) {

  try {
    const response = await fetch("https://elibraryrestapi.herokuapp.com/elibrary/api/book/list");
    const books = await response.json();
    success(books);
  } catch (e) {
    console.error(e);
    fail();
  }
}
async function deleteBook(id,success,fail) {
  let done = false;
  try {
    const response = await fetch(`https://elibraryrestapi.herokuapp.com/elibrary/api/book/delete/${id}`,
    {method: "DELETE"});
    // const books = await response.json();
    done = true;
  } catch (e) {
    console.error(e);
    fail();
  }
  if (done) success();
}
function reload(){
  // location.reload();
  fetchBookList(displayBookData,displayError);
}
function displayBookData(books) {
  const booksTable = document.getElementById("books");
 
  // remove any existing rows
  while (booksTable.rows.length>1)
  {
    booksTable.deleteRow(1);
  }

  // add new row for each book
  let rowCount = 1;
  books.forEach(element => {
    // create new row
    const row = booksTable.insertRow(rowCount++);
    row.className = rowCount%2==0? "table-active" : "table-default";

    // fill each cell
    let cellCount = 0;
    const idCell = row.insertCell(cellCount++);
    idCell.scope = "row";
    idCell.innerHTML = element.bookId + ".";

    const isbnCell = row.insertCell(cellCount++);
    isbnCell.innerHTML = element.isbn;

    const titleCell = row.insertCell(cellCount++);
    titleCell.innerHTML = element.title;

    const overdueFeeCell = row.insertCell(cellCount++);
    overdueFeeCell.style = "text-align:right";
    overdueFeeCell.innerHTML = `$${parseFloat(element.overdueFee + 0).toFixed(2)}`;

    const publisherCell = row.insertCell(cellCount++);
    publisherCell.innerHTML = element.publisher;
    
    const dateCell = row.insertCell(cellCount++);
    dateCell.innerHTML = element.datePublished;

    const editCell = row.insertCell(cellCount++);
    const editLink = document.createElement('a');
    editLink.href = `editbook.html?bookId=${element.bookId}`;
    editLink.innerHTML = "Edit";
    editLink.className = "btn btn-outline-primary";
    editCell.append(editLink);

    const deleteCell = row.insertCell(cellCount++);
    const deleteBtn = document.createElement('button');
    deleteBtn.addEventListener('click',_=>{deleteBook(element.bookId,reload,reload)});
    deleteBtn.innerHTML = "Delete";
    deleteBtn.className = "btn btn-outline-danger";
    deleteCell.append(deleteBtn);
  });
}
function displayError() {
  const booksTable = document.getElementById("books");
  const row = booksTable.insertRow(1);
  const errorCell = row.insertCell(0);
  errorCell.colSpan = 6;
  errorCell.className = "btn-outline-danger";
  errorCell.innerHTML = "Error loading book titles. Please try again later.";
}
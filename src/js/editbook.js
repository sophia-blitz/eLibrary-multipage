window.addEventListener('load', onload);
let errorDiv = null;
let inputs = null;
let bookId = null;

/**
 * Connect DOM outlets to global variables
 *
 */
function onload() {
  const params = new URLSearchParams(window.location.search);
  bookId = params.get("bookId");
  fetchBook(bookId,displayBookData,displayErrorMessage);
  document.getElementById("cancelBtn").addEventListener('click', onClickCancelBtn);
  document.getElementById("saveBtn").addEventListener('click', onClickSaveBtn);
  errorDiv = document.getElementById("errorMsg");
  inputs = document.getElementsByTagName("input");
}

/*********************
 * DOM Manipulations *
 *********************/
/**
 * Display book info on form
 * 
 * @param {object} book book object including properties 
 *   bookId, title, isbn, publisher, overdueFee, datePublished
 */
function displayBookData(book){
  // populate book form
  for (let input of inputs) {
    input.value = book[input.id];
  }
}

/**
 * Display and populate a formatted HTML error message on the form. 
 *
 * @param {string} errorMsg HTML message to be displayed on form. 
 * Strong elements will be formatted according to theme.
 */
function displayErrorMessage(errorDivContents) {
  // errorDiv.innerHTML = errorDivContents;
  errorDiv.innerHTML = "";
  errorDiv.append(errorDivContents);
  errorDiv.classList.remove("hidden");
}
/**
 * Hide error message from form
 *
 */
function hideErrorMessage() {
  errorDiv.innerHTML = "";
  errorDiv.classList.add("hidden");
}

/******************
 * Event Handlers *
 ******************/
/**
 * clear form of data and errors
 */
function onClickCancelBtn() {
  window.location.href = "books.html" 
}

/**
 * Validate and respond to form contents. 
 *  with valid data: send POST HTTP request
 *    on success: navigate to books.html
 *    on failure: display error
 *  with NONvalid data: display error message on form
 */
function onClickSaveBtn() {
  //validate form
  let validation = isDataValid(inputs);
  if (validation.isValid) {
    hideErrorMessage();
    validation.book.bookId = bookId;
    postEditBook(validation.book, _ => { window.location.href = "books.html" }, displayErrorMessage);
  } else {
    displayErrorMessage(validation.errorMessage);
  }
}
/*******************
 * Async Functions *
 *******************/

/**
 * Send new book details to server.
 * -- On successful post call `success()`
 * -- On error call `fail()` with HTML formatted error message.
 *
 * @param {Object} book New book to add to server list including properties 
 *  bookId, title, isbn, publisher, overdueFee, datePublished
 * @param {function} success zero-parameter callback function to call upon successful post
 * @param {function} fail single parameter callback function accepting HTML formatted error message
 */
async function postEditBook(book, success, fail) {
  let done = true;
  try {
    const response = await fetch(`https://elibraryrestapi.herokuapp.com/elibrary/api/book/update/${book.bookId}`, { 
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book)
    });
    const confirmBook = await response.json();
    for (let key in book) {
      // console.log(`${key}: reply: ${confirmBook[key]} sent: ${book[key]}`); // DEBUG
      if (confirmBook[key] != book[key]) {
        done = false;
      }
    }
  } catch (e) {
    console.error(e);
    fail("ERROR-- " + e.message + ". Try again later.");
  }
  if (done) {
    success();
  }
}

async function fetchBook(id,success, fail) {

  try {
    const response = await fetch(`https://elibraryrestapi.herokuapp.com/elibrary/api/book/get/${id}`);
    const book = await response.json();
    console.log(book);
    success(book);
  } catch (e) {
    console.error(e);
    fail();
  }
}
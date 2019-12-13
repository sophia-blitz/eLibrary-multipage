let errorDiv = null;
let inputs = null;
window.addEventListener('load', onload);

/**
 * Connect DOM outlets to global variables
 *
 */
function onload() {
  document.getElementById("resetBtn").addEventListener('click', onClickResetBtn);
  document.getElementById("submitBtn").addEventListener('click', onClickSubmitBtn);
  errorDiv = document.getElementById("errorMsg");
  inputs = document.getElementsByTagName("input");
}

/******************
 * Event Handlers *
 ******************/
/**
 * clear form of data and errors
 */
function onClickResetBtn() {
  // clear form
  hideErrorMessage();
  resetFormFields();
}

/**
 * Validate and respond to form contents. 
 *  with valid data: send POST HTTP request
 *    on success: navigate to books.html
 *    on failure: display error
 *  with NONvalid data: display error message on form
 */
function onClickSubmitBtn() {
  //validate form
  let validation = isDataValid(inputs);
  if (validation.isValid) {
    hideErrorMessage();
    postNewBook(validation.book, _ =>{ window.location.href = "books.html"} ,displayErrorMessage);
  } else {
    displayErrorMessage(validation.errorMessage);
  }
}

/*********************
 * DOM Manipulations *
 *********************/

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
 * Clear user-entered values from form
 */
function resetFormFields() {
  for (const input of inputs) {
    input.value = "";
  }
}

/**
 * Hide error message from form
 *
 */
function hideErrorMessage() {
  errorDiv.innerHTML = "";
  errorDiv.classList.add("hidden");
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
async function postNewBook(book, success, fail) {
  let done = true;
  try {
    const response = await fetch(`https://elibraryrestapi.herokuapp.com/elibrary/api/book/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book)
    });
    const confirmBook = await response.json();
    for (let key in book){
      // console.log(`${key}: reply: ${confirmBook[key]} sent: ${book[key]}`); // DEBUG
      if (key != "bookId" && confirmBook[key] != book[key]){
        done = false;
      }
    }
  } catch (e) {
    console.error(e);
    fail("ERROR-- " + e.message + ". Try again later.");
  }
  if(done){
    success();
  }
}
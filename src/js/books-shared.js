/********************
 * Helper Functions *
 ********************/
function isDataValid(inputs) {
  // create validation result object
  let results = {
    isValid: false,
    errorMessage: "",
    book: {
      bookId: null,
      isbn: null,
      title: null,
      publisher: null,
      datePublished: null,
      overdueFee: null
    }
  };

  // populate book object
  for (let input of inputs) {
    results.book[input.id] = (input.value + "").trim();
  }
  // create error list to show in error div
  const errorList = document.createElement('ul');

  // validate title
  if (results.book.title.length == 0) {
    const errorItem = document.createElement('li');
    errorItem.innerHTML = "Title is a required field.";
    errorList.append(errorItem);
  }
  // validate isbn
  if (results.book.isbn.length == 0) {
    const errorItem = document.createElement('li');
    errorItem.innerHTML = "ISBN is a required field.";
    errorList.append(errorItem);
  }
  // validate overdue fee
  results.book.overdueFee = parseFloat(results.book.overdueFee);
  if (isNaN(results.book.overdueFee)) {
    const errorItem = document.createElement('li');
    errorItem.innerHTML = "Overdue Fee is a required field.";
    errorList.append(errorItem);
  } else if (results.book.overdueFee < 0) {
    const errorItem = document.createElement('li');
    errorItem.innerHTML = "Overdue Fee cannot be less than $0.00.";
    errorList.append(errorItem);
  }
  // validate publisher
  if (results.book.publisher.length == 0) {
    const errorItem = document.createElement('li');
    errorItem.innerHTML = "Publisher is a required field.";
    errorList.append(errorItem);
  }
  // validate date published
  if (results.book.datePublished.length == 0) {
    const errorItem = document.createElement('li');
    errorItem.innerHTML = "Date Published is a required field.";
    errorList.append(errorItem);
  }

  // set valid if no errors
  if (errorList.childElementCount == 0) {
    results.isValid = true;
  } else {
    results.errorMessage = errorList;
  }

  return results;
}
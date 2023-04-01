const bookGrid = document.querySelector(".book-grid");
const bookForm = document.querySelector("#add-new-book");

const showAddBookArea = document.querySelector(".overlay");
const newBookClose = document.querySelector("#overlay-exit");

const titleInput = document.querySelector("#title");

let myLibrary = [];

function Book(title, author, pages, read, id) {
  this.title = title;
  this.author = author;
  this.page = pages;
  this.read = read;
  this.id = id;
}

const makeBookHTML = function createHTMLBook(bookObject) {
  // Create the div holding the whole book together
  const book = document.createElement("div");
  book.setAttribute("class", "book");
  book.setAttribute('id', bookObject.id);

  // Add the relevant book properties and add to the book
  const bookTitle = document.createElement("h3");
  bookTitle.setAttribute("class", "book-title");
  bookTitle.setAttribute('id', convertTitleToId(bookObject.title));
  bookTitle.textContent = bookObject.title;
  book.appendChild(bookTitle);

  const bookAuthor = document.createElement("h4");
  bookAuthor.setAttribute("class", "book-author");
  bookAuthor.textContent = bookObject.author;
  book.appendChild(bookAuthor);

  const bookPages = document.createElement("p");
  bookPages.setAttribute("class", "book-page");
  bookPages.textContent = bookObject.page;
  book.appendChild(bookPages);

  const bookButtons = document.createElement("div");
  bookButtons.setAttribute("class", "book-buttons");

  const bookRead = document.createElement("div");
  bookRead.setAttribute("class", "book-read");

  const readLabel = document.createElement("label");
  readLabel.setAttribute("for", "book-read");
  readLabel.textContent = "Read?";
  bookRead.appendChild(readLabel);

  const readCheckbox = document.createElement("input");
  readCheckbox.setAttribute("type", "checkbox");
  readCheckbox.setAttribute("class", "book-read");
  readCheckbox.setAttribute("id", "book-read");
  readCheckbox.setAttribute('data-id', bookObject.id);
  setRead(readCheckbox);
  bookObject.read === true
    ? (readCheckbox.checked = true)
    : (readCheckbox.checked = false);
  
  bookRead.appendChild(readCheckbox);

  bookButtons.append(bookRead);

  const bookEdit = document.createElement("div");
  bookEdit.setAttribute("class", "book-edit");

  const editButton = document.createElement("button");
  editButton.setAttribute("id", "edit");
  editButton.setAttribute('data-id', bookObject.id);
  editButton.textContent = "Edit";

  bookEdit.appendChild(editButton);

  const deleteButton = document.createElement("button");
  deleteButton.setAttribute("id", "delete");
  deleteButton.setAttribute('data-id', bookObject.id);
  deleteButton.textContent = "Delete";
  setDeleteButton(deleteButton);
  bookEdit.appendChild(deleteButton);

  bookButtons.appendChild(bookEdit);

  book.appendChild(bookButtons);

  bookGrid.appendChild(book);

  
};

function displayBooks() {
  myLibrary.map((bookObject) => {
    makeBookHTML(bookObject);
  });
}

displayBooks();

function addBookToLibrary(bookFormData) {
  const newBook = new Book(
    bookFormData.get("title"),
    bookFormData.get("author"),
    bookFormData.get("pages"),
    bookFormData.get("book-read") === "null" ? false : true ,
    convertTitleToId(bookFormData.get('title'))
  );
  makeBookHTML(newBook);
  myLibrary = [...myLibrary, newBook];
  myLibrary.map((book) => console.log(book.read));
  closeOverlay();
}

// Changing overlay when adding a new book
const bookButton = document.querySelector(".add-book");
bookButton.addEventListener("click", () => {
  showAddBookArea.setAttribute("class", "overlay on");
});

newBookClose.addEventListener("click", () => {
  closeOverlay();
});

const closeOverlay = function closeNewBookOverlay() {
  showAddBookArea.setAttribute("class", "overlay");
  bookForm.reset();
};


titleInput.onchange = () => {
    checkDuplicateTitle();
  };

bookForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(bookForm);
  addBookToLibrary(formData);
});



//checks for duplicate titles in the library
function checkDuplicateTitle() {
  const formData = new FormData(bookForm);
  for (const bookObject of myLibrary) {
    console.log(bookObject.title, formData.get('title'), 'loop test');
    if (convertTitleToId(formData.get('title')) === bookObject.id) {
      console.log("dupe");
      titleInput.setCustomValidity("This book already exists");
      titleInput.reportValidity();
      return true;
    }
  }
  titleInput.setCustomValidity("");
  console.log("not dupe");
}

function convertTitleToId(title) {
    return title.toLowerCase().replaceAll(' ', '-');
}

console.log(convertTitleToId('wewqeqw ewq ewq ewq WQ QWE QW EWQE WQEwqewqewq w qEQWEWQE'));



// Change if book is read or not

function setRead(readBox) {
    readBox.addEventListener('change', (e) => {
        const readId = e.target.getAttribute('data-id');
        console.log(readId, myLibrary[myLibrary.map((book) => book.id).indexOf(readId)].read);
        myLibrary[myLibrary.map((book) => book.id).indexOf(readId)].read === false 
        ?  myLibrary[myLibrary.map((book) => book.id).indexOf(readId)].read = true
        :  myLibrary[myLibrary.map((book) => book.id).indexOf(readId)].read = false; 
    })
}

function changeBookRead(bookObject) {

}

// Book Deletion

function deleteById(bookObject) {
    console.log(bookObject,'test1');
    const confirmText = `Are you sure you want to delete ${bookObject.title}?`;
    if (confirm(confirmText) === true) {
        const bookId = bookObject.id;
        console.log('bookid', bookId);
        myLibrary.splice(
            myLibrary.map(book => book.id).indexOf(bookId),
            1
        )
        bookGrid.removeChild(document.getElementById(bookId));
    }
}

function setDeleteButtons() {
    const deleteButtons = document.querySelectorAll('#delete');
    deleteButtons.forEach((button) => {
        setDeleteButton(button);
    })
}

function setDeleteButton(button) {
    button.addEventListener('click', (e) => {
        const buttonId = e.target.getAttribute('data-id');
        console.log(myLibrary.filter((book) => book.id === buttonId)[0], 'books', myLibrary);
        deleteById(myLibrary.filter((book) => book.id === buttonId)[0]);
    })
}


// Features:
// Book validation by id/name - don't allow duplicate names
// make book id by replacing spaces with dashes and setting it to ID
//
//
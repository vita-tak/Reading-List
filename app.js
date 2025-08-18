import { addToLocalStorage, removeFromLocalStorage, getFromLocalStorage, clearFromLocalStorage } from './localstorage.js';

let form, input, bookList, clearBtn, filterInput, addButton, isInEditMode;

export const initApp = () => {
    form = document.querySelector('#item-form');
    input = document.querySelector('#item-input');
    bookList = document.querySelector('#item-list');
    clearBtn = document.querySelector('#clear');
    filterInput = document.querySelector('#filter');
    addButton = document.querySelector('#addButton'); // <-- Här hämtar vi knappen

    form.addEventListener('submit', addBookHandler);
    clearBtn.addEventListener('click', clearListHandler);
    bookList.addEventListener('click', handleClickBook);
    filterInput.addEventListener('input', filterBooksHandler);

    const books = getFromLocalStorage();
    books.forEach(book => addBookToDOM(book));

    updateUI();
};

const addBookHandler = (event) => {
    event.preventDefault();

    const book = input.value;

    if (book.trim().length === 0) {
        const errorMessage = createErrorMessage('Please add a book');
        document.querySelector('.message-section').appendChild(errorMessage);

        setTimeout(()=>{
            document.querySelector('#error-message').remove();
        }, 2000);

        input.value = '';
        return;
    }

    if(isInEditMode) {
        const updateBook = bookList.querySelector('.edit-mode');
        removeFromLocalStorage(updateBook.textContent);
        updateBook.classList.remove('edit-mode');
        updateBook.remove();
        isInEditMode = false;
    } else {
        if(isBookInList(book)) {
            const errorMessage = createErrorMessage(`'${book}' already in list`);
            document.querySelector('.message-section').appendChild(errorMessage);
    
            setTimeout(()=>{
                document.querySelector('#error-message').remove();
            }, 2000);
        }
    }
    addBookToDOM(book);
    addToLocalStorage(book);
    updateUI();
};

const addBookToDOM = (book) => {
    const item = document.createElement('li');
      item.appendChild(document.createTextNode(book));

      const button = createIconButton('btn-link text-red', 'fa-regular fa-trash-can');
      item.appendChild(button);
      bookList.appendChild(item);

    const starBtn = document.createElement('button');
    starBtn.classList.add('star-btn');

    const starIcon = document.createElement('i');
    starIcon.classList.add('fa-regular', 'fa-star'); 
    starIcon.style.color = '#FFD43B';
    starBtn.appendChild(starIcon);

starBtn.addEventListener('click', () => {
    if (starIcon.classList.contains('fa-regular')) {
        starIcon.classList.remove('fa-regular');
        starIcon.classList.add('fa-solid');
    } else {
        starIcon.classList.remove('fa-solid');
        starIcon.classList.add('fa-regular');
    }
});

    starBtn.appendChild(starIcon);

    starBtn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        item.classList.toggle('favorite');
        if(item.classList.contains('favorite')) {
            bookList.prepend(item);
        } else {
            bookList.appendChild(item);
        }
    });
    item.appendChild(starBtn);

    bookList.appendChild(item);
};

const createIconButton = (buttonClassList, iconClassList) => {
    const button = document.createElement('button');
    const classes = buttonClassList.split(' ');

    classes.forEach((className) => button.classList.add(className));

    const icon = createIcon(iconClassList); 
    button.appendChild(icon); 

    return button;
};

const createIcon = (classList) => {
    const icon = document.createElement('i');

    const classes = classList.split(' ');
    classes.forEach((className) => icon.classList.add(className));

    return icon;
};
const clearListHandler = () => {
    while (bookList.firstChild)
        bookList.removeChild(bookList.firstChild);
    clearFromLocalStorage();
    updateUI();
};
const filterBooksHandler = (e) => {
    const books = document.querySelectorAll('li');
    const value = e.target.value.toLowerCase();
    books.forEach((item) => {
        const itemName = item.firstChild.textContent.toLowerCase();
        if(itemName.indexOf(value) != -1) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
};
const isBookInList = (book) => {
    const books = document.querySelectorAll('li');

    let found = false;

for (let item of books) {
    const bookContent = item.firstChild.textContent;
    if(bookContent === book) {
        found = true;
        break;
    }
  }
  return found;
};
const handleClickBook = (event) => {
    if (event.target.parentElement.classList.contains('btn-link')) {
        removeBookHandler(event.target.parentElement.parentElement);
    } else {
        updateInput(event.target);
    }
};

const updateInput = (book) => {

    isInEditMode = true;

    bookList
    .querySelectorAll('li')
    .forEach((item) => item.classList.remove('edit-mode'));

    addButton.classList.add('btn-edit'); 
    addButton.innerHTML = `<i class="fa-light fa-pen"></i> Update Book`; 

    book.classList.add('edit-mode'); 
    input.value = book.textContent; 
};

export const removeBookHandler = (item) => {
    item.remove();
    removeFromLocalStorage(item.textContent);
};
export const createErrorMessage = (message) => {
    const div = document.createElement('div');
    div.setAttribute('id', 'error-message');
    div.appendChild(document.createTextNode(message));
    div.classList.add('error-message');
    return div;
};

const updateUI = () => {
    input.value = '';
    const books = document.querySelectorAll('li');
    if (books.length === 0) {
        clearBtn.style.display = 'none';
        filterInput.style.display = 'none';
    } else {
        clearBtn.style.display = 'block';
        filterInput.style.display = 'block';
    }
    addButton.classList.remove('btn-edit');
    addButton.innerHTML = `<i class="fa-solid fa-plus"></i> Add book`;
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initApp);
}



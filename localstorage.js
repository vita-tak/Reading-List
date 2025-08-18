const addToLocalStorage = (book) => {

    const items = getFromLocalStorage();

items.push(book);
localStorage.setItem('books', JSON.stringify(items));
};
const getFromLocalStorage = () => {
    let items;

if(localStorage.getItem('books') === null) {
    items = [];
} else {
    items = JSON.parse(localStorage.getItem('books'));
}
return items;
};
const removeFromLocalStorage = (book) => {
    const items = getFromLocalStorage();
    const filteredItems = items.filter(item => item !== book);
    localStorage.setItem('books', JSON.stringify(filteredItems));
    localStorage.setItem('books', JSON.stringify(filteredItems));
};
const clearFromLocalStorage = () => {
    localStorage.removeItem('books');
};

export { addToLocalStorage, removeFromLocalStorage, getFromLocalStorage, clearFromLocalStorage };

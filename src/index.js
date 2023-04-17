
const inputForm = document.getElementById('search-form');
const searchBtn = document.querySelector('button');

inputForm.addEventListener('submit', onSearchBtn);

function onSearchBtn(e) {
    e.preventDefault();
    console.log(e.currentTarget.elements.searchQuery.value)
}

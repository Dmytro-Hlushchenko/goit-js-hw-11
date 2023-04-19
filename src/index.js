//Початкове значення параметра page повинно бути 1.
//З кожним наступним запитом, його необхідно збільшити на 1.
//У разі пошуку за новим ключовим словом, значення page потрібно повернути до початкового,
//оскільки буде пагінація по новій колекції зображень.
//HTML документ вже містить розмітку кнопки, по кліку на яку,
//необхідно виконувати запит за наступною групою зображень і додавати розмітку до
// вже існуючих елементів галереї.

//В початковому стані кнопка повинна бути прихована.
//Після першого запиту кнопка з'являється в інтерфейсі під галереєю.
//При повторному сабміті форми кнопка спочатку ховається, а після запиту знову відображається.
//У відповіді бекенд повертає властивість totalHits - загальна кількість зображень,
//які відповідають критерію пошуку(для безкоштовного акаунту. 
//Якщо користувач дійшов до кінця колекції, ховай кнопку і виводь повідомлення з текстом 
//"We're sorry, but you've reached the end of search results.".

import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import LoadMoreBtn from "./scripts/components/LoadMoreBtn"; 

const KEY_PIXABAY = "32473548-3011831d563d5a9dc36fe58a5";
const IMG_TYPE = "image_type=photo";
const ORIENT = "orientation=horizontal"
const SAFESEARCH = "safesearch=true";

const gallery = document.querySelector(".gallery_list");
const inputForm = document.getElementById('search-form');

const loadMoreBtn = new LoadMoreBtn({
    selector: ".load-more",
    isHidden: true
});

loadMoreBtn.button.addEventListener('click', onLoadMoreBtn)
inputForm.addEventListener('submit', onSearchBtn);


function onSearchBtn(e) { 
    e.preventDefault();
    const query = (e.currentTarget.elements.searchQuery.value).trim();
    if (!query) {
        Notiflix.Notify.failure('Please, enter search words');
        return;
    }
    axios(`https://pixabay.com/api/?key=${KEY_PIXABAY}&q=${query}&${IMG_TYPE}&${ORIENT}&${SAFESEARCH}&per_page=40`)
        .then(({ data }) => createGallery(data.hits))
        .catch(onErrore);
    
    function createGallery(resultArray) {
        console.log(resultArray)
            if (resultArray.length === 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
            return
        }
        
        const list = resultArray.reduce((markup, item) => markup + createCard(item), "");
        gallery.innerHTML = list;

        loadMoreBtn.showBtn();
        
        let lightbox = new SimpleLightbox('.gallery a', { /* options */ });
        // lightbox.refres h();

    
    }
    
    function createCard(item) {
        return `<li class = "gallery_item">
         <a href = "${item.largeImageURL}">
        <img width = "480" height = "320" src = "${item.webformatURL}" alt = "${item.tags}"></img>
        </a>
        <div class = "img_comments">
        <p class = "image_comment">likes <b class = img_comments_vale>${item.likes}</b></p>
        <p class = "image_comment">views <b class = img_comments_vale>${item.views}</b></p>
        <p class = "image_comment">comments <b class = img_comments_vale>${item.comments}</b></p>
        <p class = "image_comment">downloads <b class = img_comments_vale>${item.downloads}</b></p>
        </div>
        </li>`
    }

    function onErrore(err) {
        alert(`Oops${err}`);
    }
}

function onLoadMoreBtn() {
    console.log('click')
}
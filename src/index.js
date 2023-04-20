//Початкове значення параметра page повинно бути 1.
//З кожним наступним запитом, його необхідно збільшити на 1.
//У разі пошуку за новим ключовим словом, значення page потрібно повернути до початкового,
//оскільки буде пагінація по новій колекції зображень.

//При повторному сабміті форми кнопка спочатку ховається, а після запиту знову відображається.
//У відповіді бекенд повертає властивість totalHits - загальна кількість зображень,
//які відповідають критерію пошуку(для безкоштовного акаунту. 
//Якщо користувач дійшов до кінця колекції, ховай кнопку і виводь повідомлення з текстом 
//"We're sorry, but you've reached the end of search results.".

import GetPicsApi from './scripts/components/apiPics';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import LoadMoreBtn from "./scripts/components/LoadMoreBtn"; 

const gallery = document.querySelector(".gallery_list");
const inputForm = document.getElementById('search-form');
 let lightbox = new SimpleLightbox('.gallery a', { /* options */ });

const getPicsApi = new GetPicsApi;
const loadMoreBtn = new LoadMoreBtn({
    selector: ".load-more",
    isHidden: true
});

console.log(getPicsApi)

loadMoreBtn.button.addEventListener('click', onLoadMoreBtn)
inputForm.addEventListener('submit', onSearchBtn);


function onSearchBtn(e) { 
    e.preventDefault();
    const query = (e.currentTarget.elements.searchQuery.value).trim();
    if (!query) {
        Notiflix.Notify.failure('Please, enter search words');
        return;
    }
    getPicsApi.query = query;
        
    getPicsApi.getPics()
      .then(({ data }) => createGallery(data.hits))
      .catch(onErrore);
}

function createGallery(resultArray) {
        console.log(resultArray)
            if (resultArray.length === 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
            return
        }
        
        const list = resultArray.reduce((markup, item) => markup + createCard(item), "");
        gallery.innerHTML = list;

        loadMoreBtn.showBtn();
    lightbox.refresh();
        
}
    
function onErrore(err) {
        alert(`Oops${err}`);
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

function onLoadMoreBtn() {
    getPicsApi.updatePage();
    getLoadMorePics();
}

function getLoadMorePics() { 
    getPicsApi.getPics()
      .then(({ data }) => createMoreGallery(data.hits))
          
    function createMoreGallery(resultArray) {
        const list = resultArray.reduce((markup, item) => markup + createCard(item), "");
        gallery.insertAdjacentHTML('beforeend', list);
        lightbox.refresh();
    }
    
}
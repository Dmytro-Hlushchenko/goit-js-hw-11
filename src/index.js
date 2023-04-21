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
let list = '';

const getPicsApi = new GetPicsApi;
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
    getPicsApi.query = query;
    getPicsApi.resetPage();        
    getPicsApi.getPics()
      .then(({ data }) => createGallery(data.hits))
      .catch(onErrore);
}

function createGallery(resultArray) {
            if (resultArray.length === 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
            return
        }
        
    createListHtml(resultArray);
        gallery.innerHTML = list;

        loadMoreBtn.showBtn();
        lightbox.refresh();
}
    
function onErrore(err) {
        alert(`Oops${err}`);
}

function createListHtml(resultArray) { 
    return list = resultArray.reduce((markup, item) => markup + createCard(item), "");
}

function createCard(item) {
        return `<li class = "gallery_item">
         <a href = "${item.largeImageURL}">
        <img width = "480" height = "320" src = "${item.webformatURL}" alt = "${item.tags}"></img>
        </a>
        <div class = "img_comments">
        <p class = "image_comment">likes <b>${item.likes}</b></p>
        <p class = "image_comment">views <b>${item.views}</b></p>
        <p class = "image_comment">comments <b>${item.comments}</b></p>
        <p class = "image_comment">downloads <b>${item.downloads}</b></p>
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
        .catch(onErrore)
    
    function createMoreGallery(resultArray) {
        createListHtml(resultArray);
        gallery.insertAdjacentHTML('beforeend', list);
        lightbox.refresh();
    }
    
}
import GetPicsApi from "./scripts/components/apiPics";
import LoadMoreBtn from "./scripts/components/LoadMoreBtn"; 
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const gallery = document.querySelector(".gallery_list");
const inputForm = document.getElementById('search-form');
let lightbox = new SimpleLightbox('.gallery a', { /* options */ });
let list = '';

const getPicsApi = new GetPicsApi;
const loadMoreBtn = new LoadMoreBtn({
    selector: ".load-more",
    isHidden: true
});

loadMoreBtn.button.addEventListener('click', onLoadMoreBtn);
inputForm.addEventListener('submit', onSearchBtn);

async function onSearchBtn(e) {
    e.preventDefault();
    const query = (e.currentTarget.elements.searchQuery.value).trim();
    if (!query) {
        Notiflix.Notify.failure('Please, enter search words');
        return;
    }
    getPicsApi.query = query;
    getPicsApi.resetPage();
    loadMoreBtn.hideBtn();
    
    const getAxiosResult = await getPicsApi.getPics();
    try {
        createGallery(getAxiosResult.data.hits);
        totalHitsAlert(getAxiosResult.data.totalHits);
    } catch (errore) {
        onErrore(errore);
    }
}

function totalHitsAlert(totalHits) {
    if (totalHits === 0) {
        return
    }
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
}

function createGallery(resultArray) {
    if (resultArray.length === 0) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
        return
    }
     createListHtml(resultArray);
    gallery.innerHTML = list;
    lightbox.refresh();
    if (resultArray.length >= 40) {
        loadMoreBtn.showBtn();
        return
    }
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

async function getLoadMorePics() { 
    const getAxiosMoreResult = await getPicsApi.getPics();
    try {
        createMoreGallery(getAxiosMoreResult.data.hits);
    
    function createMoreGallery(resultArray) {
        createListHtml(resultArray);
        gallery.insertAdjacentHTML('beforeend', list);
        lightbox.refresh();
        if (resultArray.length < 40) { 
            loadMoreBtn.hideBtn();
            Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.")
        }
    }
        } catch (errore) { 
        onErrore(errore);
    }
}
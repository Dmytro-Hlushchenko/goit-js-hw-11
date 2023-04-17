import axios from "axios";
import Notiflix from 'notiflix';

const KEY_PIXABAY = "32473548-3011831d563d5a9dc36fe58a5";
const IMG_TYPE = "image_type=photo";
const ORIENT = "orientation=horizontal"
const SAFESEARCH = "safesearch=true";

const gallery = document.querySelector(".gallery_list")
const inputForm = document.getElementById('search-form');
const searchBtn = document.querySelector('button');

inputForm.addEventListener('submit', onSearchBtn);

function onSearchBtn(e) {
    e.preventDefault();
    const query = (e.currentTarget.elements.searchQuery.value).trim();
    if (!query) {
        Notiflix.Notify.failure('Please, enter search words');
        return;
    }
    axios(`https://pixabay.com/api/?key=${KEY_PIXABAY}&q=${query}&${IMG_TYPE}&${ORIENT}&${SAFESEARCH}`)
        .then(({ data }) => createGallery(data.hits))
        .catch(onErrore);
       
        
    
    function createGallery(resultArray) {
        if (resultArray.length === 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
            return
            }
        console.log(resultArray);
        const list = resultArray.reduce((markup, item) => markup + createCard(item), "");
        gallery.innerHTML = list;
    
    }
    
    function createCard(item) { 
        return `<li>
         <a href = "${item.largeImageURL}">
        <img width = "480" height = "320" src = "${item.webformatURL}" alt = "${item.tags}"></img></a>
        <div class = "img_comments">
        <p class = "image_comment">likes <span class = img_comments_vale>${item.likes}</span></p>
        <p class = "image_comment">views <span class = img_comments_vale>${item.views}</span></p>
        <p class = "image_comment">comments <span class = img_comments_vale>${item.comments}</span></p>
        <p class = "image_comment">downloads <span class = img_comments_vale>${item.downloads}</span></p>
        </div>
        </li>`
    }
        
    
    function onErrore(err) {
            alert(`Oops${err}`);
    };
}



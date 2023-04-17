import axios from "axios";

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
        alert("no DATA");
        return;
    }
    axios(`https://pixabay.com/api/?key=${KEY_PIXABAY}&q=${query}&${IMG_TYPE}&${ORIENT}&${SAFESEARCH}`)
        .then(({data}) => createGallery(data.hits))
        .catch(onErrore);
    
    function createGallery(resultArray) {
        console.log(resultArray);
        const list = resultArray.reduce((markup, item) => markup + createCard(item), "");
        gallery.innerHTML = list;
    
    }
    
    function createCard(item) { 
         return `<li>
        <img src = "${item.webformatURL}" alt = "${item.tags}"></img>
        <p>likes: ${item.likes}</p>
        <p>views: ${item.views}</p>
        <p>comments: ${item.comments}</p>
        <p>downloads: ${item.downloads}</p>
        </li>`
    }
        
    
    function onErrore(err) {
            alert(`Oops${err}`);
    };
}



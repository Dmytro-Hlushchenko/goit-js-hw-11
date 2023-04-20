
import axios from "axios";
const KEY_PIXABAY = "32473548-3011831d563d5a9dc36fe58a5";
const IMG_TYPE = "image_type=photo";
const ORIENT = "orientation=horizontal"
const SAFESEARCH = "safesearch=true";
const PER_PAGE = '40';

export default class GetPicsApi{
    constructor() {
        this.query = '';
        this.page = 1;
    }
    
    getPics() {
        return axios(`https://pixabay.com/api/?key=${KEY_PIXABAY}&q=${this.query}&${IMG_TYPE}&${ORIENT}&${SAFESEARCH}&per_page=${PER_PAGE}&page=${this.page}`);
    } 

    updatePage() {
        this.page += 1;
     }

    resetPage() { 
        this.page = 1;
    }
}   

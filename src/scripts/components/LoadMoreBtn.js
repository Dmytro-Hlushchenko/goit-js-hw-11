
export default class LoadMoreBtn {
    constructor({ selector, isHidden = false }) {
        this.button = this.getButton(selector);
        if (isHidden) this.hideBtn();
    }

    getButton(selector) { 
        return document.querySelector(selector);
    }
    
    hideBtn() { 
        this.button.classList.add("hidden");
    }

    showBtn() { 
        this.button.classList.remove("hidden");
    }

}

 
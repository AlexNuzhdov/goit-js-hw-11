import css from './css/styles.css';
import simpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { fetchImages} from "./search/fetchImages";
import simpleLightbox from "simplelightbox";
import renderMarkup from './templates/photo-card.hbs';
import {onFailureAlert, onSucsessAlert, onEndOfGalerey, onSameUserQuery, onEmptyQuery} from './search/alerts';




 const refs = {
    searchForm: document.querySelector('#search-form'),
    button: document.querySelector('.btnSearch'),
    guard: document.querySelector('.guard-js'),
    gallery: document.querySelector('.gallery'),
};

let page = 1;
let perPage  = 40;
let searchQuery = null;
const options = {
    root: null,
    rootMargin: '500px',
    threshold: 1,
};

let lightbox = new SimpleLightbox('.gallery a', {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
});

let observer = new IntersectionObserver(onLoadMore, options);
refs.searchForm.addEventListener('submit', onSearch);

function onSearch(event){
    event.preventDefault();
    if(searchQuery === event.currentTarget.searchQuery.value){
        onSameUserQuery();
        return;
    };

    searchQuery = event.currentTarget.searchQuery.value.trim();

    if(searchQuery === ''){
        onEmptyQuery();
        return;
    };

    observer.unobserve(event.target);
    refs.gallery.innerHTML = '';
    page = 1;
  
    fetchImages(searchQuery, page, perPage)
    .then(({data}) => {

        if(data.totalHits === 0){
            onFailureAlert();
            return;
        };

        renderCard(data.hits);
        lightbox.refresh();
        onSucsessAlert(data);
        observer.observe(refs.guard);
    })
    .finally(event.target.reset());
};


function onLoadMore(entries){
    entries.forEach(entry=> {    
        if(entry.isIntersecting){
            const { height: cardHeight } = document.querySelector(".gallery")
                .firstElementChild.getBoundingClientRect();

                window.scrollBy({
                top: cardHeight * 3,
                behavior: "smooth",
            });
            fetchImages(searchQuery, page+=1, perPage).then(({data})=> {
                
                const endOfSearch = Math.ceil(data.totalHits / perPage);
                if(page > endOfSearch){
                    onEndOfGalerey();
                    observer.unobserve(entry.target);
                    return;
                };

                renderCard(data.hits);
                
                
                lightbox.refresh();
            });
        };
    });
};
function renderCard(array) {
    const markup = array.map(item => renderMarkup(item)).join('');
    refs.gallery.insertAdjacentHTML('beforeend', markup);
};
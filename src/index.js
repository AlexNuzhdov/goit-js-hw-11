import css from './css/styles.css';
import fetchImages from '../search/fetch';
import photoCard from '../templates/photo-card.hbs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

refs = {
    searchForm:document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
    endCollectionText: document.querySelector('.end-collection-text')
};

function renderCard(array) {
  const markup = array.map(item => photoCard(item)).join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
};
  let currentPage = 1;                   
  let currentHits = 0;
  let searchQuery = '';

  refs.loadMoreBtn.style.opacity = 0;
  refs.endCollectionText.style.opacity = 0;

  refs.searchForm.addEventListener('submit', onSearch);
  refs.loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(event) {
  event.preventDefault();             
  searchQuery = event.currentTarget.searchQuery.value; 
  clearPage();
  refs.loadMoreBtn.style.opacity = 0;
  refs.endCollectionText.style.opacity = 0;

  if (searchQuery === '') {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
  }
    const response = await fetchImages(searchQuery, currentPage);
    currentHits = response.hits.length;
  
  try {
      if (response.totalHits > 0) {
         Notify.success(`Hooray! We found ${response.totalHits} images.`);
         refs.gallery.innerHTML = '';
         renderCard(response.hits);
         lightbox.refresh();
         refs.loadMoreBtn.style.opacity = 1;
         refs.endCollectionText.style.opacity = 1;
        
        const { height: cardHeight } = document
          .querySelector('.gallery')
          .firstElementChild.getBoundingClientRect();

        window.scrollBy({
          top: cardHeight * 2,
          behavior: 'smooth',
        });
      }
      if (response.totalHits === 0) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        return;
      };
    } catch (error) {
      console.log(error);
    }
};

async function  onLoadMore() {
  currentPage += 1;
  const response = await fetchImages(searchQuery, currentPage);
  renderCard(response.hits);
  lightbox.refresh();
  currentHits += response.hits.length;
};

function clearPage() {
  refs.gallery.innerHTML = '';
  page = 1;

};
let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
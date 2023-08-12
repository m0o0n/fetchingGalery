import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './api/pixabay-api.js';
import SimpleLightbox from 'simplelightbox';
import Notiflix from 'notiflix';

const elements = {
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
  searchForm: document.querySelector('.search-form'),
};

const generateGaleryCard = ({
  likes,
  downloads,
  comments,
  views,
  webformatURL,
  largeImageURL,
  tags,
}) => {
  return `
  <div class="photo-card">
    <a 
        href="${largeImageURL}"
        class="gallery-link"
    >
        <img src="${webformatURL}" data-src="${largeImageURL}" alt="${tags}" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        <span>${likes}</span>
      </p>
      <p class="info-item">
        <b>Views</b>
        <span>${views}</span>
      </p>
      <p class="info-item">
        <b>Comments</b>
        <span>${comments}</span>
      </p>
      <p class="info-item">
        <b>Downloads</b>
        <span>${downloads}</span>
      </p>
    </div>
  </div>
    `;
};

const render = (page, query, isSearch) => {
  if (!query.trim()) {
    Notiflix.Notify.failure('Search query shouldn`t be an empty string')
  } else {
    fetchImages(page, query).then(data => {
      let galleryElems = elements.gallery.innerHTML;
      const galleryHTML = data.hits.reduce((acc, cur) => {
        acc = acc.concat(generateGaleryCard(cur));
        return acc;
      }, '');

      elements.gallery.innerHTML = isSearch
        ? galleryHTML
        : galleryElems.concat(galleryHTML);
      const maxPage = Math.ceil(data.totalHits / data.params.per_page)

      if (data.totalHits > data.params.per_page) {
        elements.loadMore.style.display = 'flex'
      }
      if (page === maxPage) {
        elements.loadMore.style.display = 'none'
        Notiflix.Notify.failure(
          `We're sorry, but you've reached the end of search results.`
        );
      }
      if (!data.totalHits) {
        elements.loadMore.style.display = 'none'
        Notiflix.Notify.failure(
          `Sorry, there are no images matching your search query. Please try again.`
        );
      }
      if (isSearch && data.totalHits) {
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`)
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
      if (!isSearch && data.totalHits) {
        const { height: cardHeight } = document
          .querySelector('.gallery')
          .firstElementChild.getBoundingClientRect();
        window.scrollBy({
          top: cardHeight * 2,
          behavior: 'smooth',
        });
      }
      new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionDelay: 250,
      });
    });
  }

};

let page = 1;
let query = '';
elements.loadMore.addEventListener('click', () => {
  page++;
  render(page, query, false);
});

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  query = e.currentTarget.elements.searchQuery.value;
  page = 1;
  render(page, query, true);
});
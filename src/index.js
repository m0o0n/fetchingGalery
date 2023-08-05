import "simplelightbox/dist/simple-lightbox.min.css";
import { fetchImages } from "./api/index";
import SimpleLightbox from "simplelightbox";
import Notiflix from 'notiflix';

const gallery = document.querySelector('.gallery')
const loadMore = document.querySelector('.load-more')
const searchForm = document.querySelector('.search-form')


const generateGaleryCard = ({likes, downloads, comments, views, webformatURL, largeImageURL, tags }) => {
    return `
    <div class="photo-card">
    <a 
        href="${largeImageURL}"
        class="gallery__link"
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
        <span>${downloads}</span>
      </p>
      <p class="info-item">
        <b>Comments</b>
        <span>${comments}</span>
      </p>
      <p class="info-item">
        <b>Downloads</b>
        <span>${views}</span>
      </p>
    </div>
  </div>
    `
}

const render = (counter, query, isSearch) => {
    fetchImages(counter, query).then(data => {
        let galleryElems = gallery.innerHTML
        const galleryHTML = data.reduce((acc, cur)=>{
            acc = acc.concat(generateGaleryCard(cur))
            return acc
        }, '')
        gallery.innerHTML = isSearch ? galleryHTML : galleryElems.concat(galleryHTML)
       
        new SimpleLightbox('.gallery a', {
            captionsData: 'alt',
            captionDelay: 250,
        })
        
        if(!data.length && isSearch) {
            Notiflix.Notify.failure(`No results for your response: ${query}`)
            loadMore.style.display = 'none'
        } else {
            loadMore.style.display = 'flex'
        }
        
        if(isSearch){
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        } else {
            const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();
            window.scrollBy({
                top: cardHeight * 2,
                behavior: "smooth",
            });  
        }
    })
}

let counter = 1
let query = ''
loadMore.addEventListener('click', ()=>{
    counter++
    render(counter, query, false)
})

searchForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    query = e.currentTarget.elements.searchQuery.value
    render(counter, query, true)
})

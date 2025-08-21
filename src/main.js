
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import { getImagesByQuery } from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton
} from './js/render-functions';


let query = '';
let page = 1;
const perPage = 15;

const searchForm = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more-btn');


searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  query = event.target.elements.query.value.trim();
  
  if (!query) {
    iziToast.warning({
      title: 'Warning',
      message: 'The search field cannot be empty!',
      position: 'topRight',
    });
    return;
  }

 
  page = 1;
  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);

    if (data.hits.length === 0) {
      iziToast.error({
        title: 'Error',
        message: 'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    createGallery(data.hits);

    const maxPage = Math.ceil(data.totalHits / perPage);
    if (page < maxPage) {
      showLoadMoreButton();
    } else {
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }

  } catch (error) {
    console.error("Error fetching images:", error);
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
    searchForm.reset();
  }
});


loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);
    createGallery(data.hits);

    const cardHeight = document.querySelector('.gallery-item').getBoundingClientRect().height;
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    const maxPage = Math.ceil(data.totalHits / perPage);
    if (page < maxPage) {
      showLoadMoreButton();
    } else {
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }
  } catch (error) {
    console.error("Error fetching images:", error);
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});
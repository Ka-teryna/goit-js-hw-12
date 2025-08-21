
import axios from 'axios';

export async function getImagesByQuery(query, page) { 
  const API_KEY = '51879561-dd43d0ef22fd8f83e88d07dfd';
  const BASE_URL = 'https://pixabay.com/api/';

  const params = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,     
    per_page: 15,  
  });

  const response = await axios.get(`${BASE_URL}?${params}`);
  return response.data;
}


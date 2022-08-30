import axios from 'axios';

export default async function fetchImages(value, page) {
    const url = 'https://pixabay.com/api/';
    const key = '29509763-c1d5e919ecc6f4e5ff4ac08bb';
    const filter = `?key=${key}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
  
    return await axios.get(`${url}${filter}`).then(response => response.data);
  };
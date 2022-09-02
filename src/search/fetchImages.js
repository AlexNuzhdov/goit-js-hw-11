// import axios from 'axios';
// import Notiflix from 'notiflix';
// export{fetchImages};

// async function fetchImages(query, page, perPage) {
//   const BASE_URL = 'https://pixabay.com/api/';
//   try {
//     const response = await axios.get('${BASE_URL}/',{
//       params: {
//         image_type: 'photo',
//         orientation: 'horizontal',
//         safesearch: true,
//         q: query,
//         page: page,
//         per_page: perPage,
//         key: '29509763-c1d5e919ecc6f4e5ff4ac08bb'
//       }
//     });
//     return response;
    
//   } catch (error) {
//     Notiflix.error(error.message);
//   };
// };

// import axios from 'axios';

// export default async function fetchImages(value, page) {
//     const url = 'https://pixabay.com/api/';
//     const key = '29509763-c1d5e919ecc6f4e5ff4ac08bb';
//     const filter = `?key=${key}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
  
//     return await axios.get(`${url}${filter}`).then(response => response.data);
// };




import axios from "axios";
import Notiflix from "notiflix";
import {onEndOfGalerey} from './alerts.js';
export {fetchImages};
const BASE_URL = axios.defaults.baseURL = 'https://pixabay.com/api/';

async function fetchImages(query,page,perPage) {
  try {
    const response = await axios.get(`${BASE_URL}/`,{
      params: {
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        q: query,
        page: page,
        per_page: perPage,
        key: '29495659-8f5845388f8e68d2893953910'
      }
    });
    return response;
  } catch (error) {
    if(error.response.status === 400){
      onEndOfGalerey();
      return;
    };
  };
};
import axios from 'axios';

const movieAPI = {};

movieAPI.fetchMovie = async() => {
  const response = await axios.get('https://swapi.dev/api/films');
  return response.data;
}

movieAPI.fetchCharacter = async({ url }) => {
  const response = await axios.get(url);
  return response.data;
}

export default movieAPI;

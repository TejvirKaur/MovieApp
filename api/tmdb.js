// api/tmdb.js
import axios from 'axios';
import { TMDB_API_KEY, TMDB_BASE_URL } from '../config';

const client = axios.create({
  baseURL: TMDB_BASE_URL,
  params: { api_key: TMDB_API_KEY, language: 'en-US' },
});

export async function fetchMovieList(type = 'popular', page = 1) {
  // type: now_playing | popular | top_rated | upcoming
  const url = `/movie/${type}`;
  const res = await client.get(url, { params: { page } });
  return res.data;
}

export async function fetchTvList(type = 'popular', page = 1) {
  // type: airing_today | on_the_air | popular | top_rated
  const url = `/tv/${type}`;
  const res = await client.get(url, { params: { page } });
  return res.data;
}

export async function fetchSearch(query, type = 'movie', page = 1) {
  // type: movie | multi | tv
  const path = type === 'multi' ? '/search/multi' : `/search/${type}`;
  const res = await client.get(path, { params: { query, page, include_adult: false } });
  return res.data;
}

export async function fetchMovieDetails(movieId) {
  const res = await client.get(`/movie/${movieId}`);
  return res.data;
}

export async function fetchTvDetails(tvId) {
  const res = await client.get(`/tv/${tvId}`);
  return res.data;
}


const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export async function getNowPlayingMovies() {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=ko-KR&page=1`
  );
  const data = await res.json();
  return data.results || [];
}

export async function searchMovies(query) {
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=ko-KR&query=${encodeURIComponent(query)}`
  );
  const data = await res.json();
  return data.results || [];
}


// 영화 목록 가져오기 (현재 상영작 기준)
export async function fetchMovies() {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=ko-KR&page=1`
  );
  const data = await res.json();
  return data.results;
}


// src/api/tmdb.js
export async function fetchMovieById(movieId) {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=ko-KR`
  );
  if (!response.ok) throw new Error("영화 정보를 가져오지 못했습니다");
  return await response.json();
}

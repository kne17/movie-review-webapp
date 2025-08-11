// ✅ src/pages/Home.jsx
import { useEffect, useState } from "react";
import { getNowPlayingMovies, searchMovies } from "../api/tmdb";
import { getAllRatings } from "../api/firebase";
import MovieList from "../components/MovieList";
import MovieSearch from "../components/MovieSearch";

function Home() {
  const [movies, setMovies] = useState([]);
  const [ratingsMap, setRatingsMap] = useState({});

  useEffect(() => {
    loadInitialMovies();
  }, []);

  const loadInitialMovies = async () => {
    const moviesData = await getNowPlayingMovies();
    setMovies(moviesData);
    calculateRatings(moviesData);
  };

  const handleSearch = async (query) => {
    const moviesData = query.trim()
      ? await searchMovies(query)
      : await getNowPlayingMovies();

    setMovies(moviesData);
    calculateRatings(moviesData);
  };

  const calculateRatings = async (moviesData) => {
    const ratingsData = await getAllRatings();
    const grouped = {};
    ratingsData.forEach((r) => {
      const id = r.movieId;
      if (!grouped[id]) grouped[id] = [];
      grouped[id].push(r.value);
    });

    const avgMap = {};
    Object.entries(grouped).forEach(([id, arr]) => {
      const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
      avgMap[id] = Math.round(avg * 10) / 10;
    });

    setRatingsMap(avgMap);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <MovieSearch onSearch={handleSearch} />
      <MovieList movies={movies} ratingsMap={ratingsMap} />
    </div>
  );
}

export default Home;

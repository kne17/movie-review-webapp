import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { fetchMovies } from "../api/tmdb";
import { getAllRatings } from "../api/firebase";
import { useUser } from "../hooks/useUser";

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [ratingsMap, setRatingsMap] = useState({});
  const [userRatedMap, setUserRatedMap] = useState({});
  const { user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      const [moviesData, ratingsData] = await Promise.all([
        fetchMovies(),
        getAllRatings(),
      ]);

      setMovies(moviesData);

      const grouped = {};
      const userMap = {};
      ratingsData.forEach((r) => {
        const id = r.movieId;
        if (!grouped[id]) grouped[id] = [];
        grouped[id].push(r.rating);

        if (user && r.userId === user.uid) {
          userMap[id] = true;
        }
      });

      const avgMap = {};
      Object.entries(grouped).forEach(([id, arr]) => {
        const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
        avgMap[id] = Math.round(avg * 10) / 10;
      });

      setRatingsMap(avgMap);
      setUserRatedMap(userMap);
    };

    fetchData();
  }, [user]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          averageRating={ratingsMap[movie.id]}
          isMyRated={userRatedMap[movie.id]}
        />
      ))}
    </div>
  );
}

export default MovieList;

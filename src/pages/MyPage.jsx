import { useEffect, useState } from "react";
import { getMyReviews } from "../api/firebase";
import { useUser } from "../hooks/useUser";
import MovieCard from "../components/MovieCard";
import { fetchMovieById } from "../api/tmdb";

function MyPage() {
  const { user } = useUser();
  const [reviews, setReviews] = useState([]);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const reviewList = await getMyReviews(user.uid);
      setReviews(reviewList);

      const moviePromises = reviewList.map((r) => fetchMovieById(r.movieId));
      const movieList = await Promise.all(moviePromises);
      setMovies(movieList);
    };

    fetchData();
  }, [user]);

  if (!user) return <div>로그인이 필요합니다.</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">내가 평가한 영화들</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} isMyRated={true} />
        ))}
      </div>
    </div>
  );
}

export default MyPage;

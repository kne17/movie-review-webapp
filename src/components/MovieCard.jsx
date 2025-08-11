import { Link } from "react-router-dom";

function MovieCard({ movie, averageRating, isMyRated }) {
  return (
    <Link to={`/movie/${movie.id}`} className="block relative">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-auto rounded shadow"
      />
      {/* 내가 평점 남긴 영화에 노란별 표시 */}
      {isMyRated && (
        <div className="absolute top-2 right-2 text-yellow-400 text-xl">★</div>
      )}
      <div className="mt-2 px-1">
        <h2 className="font-bold text-sm truncate">
          {movie.title || movie.original_title}
        </h2>
        <p className="text-sm text-gray-600">
          {averageRating ? `⭐ ${averageRating}점` : "평점 없음"}
        </p>
      </div>
    </Link>
  );
}

export default MovieCard;

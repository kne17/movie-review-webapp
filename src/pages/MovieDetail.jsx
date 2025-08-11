// src/pages/MovieDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchMovieById } from "../api/tmdb";
import { getMyRatingForMovie } from "../api/firebase";
import { getAllReviews } from "../api/firebase";
import { useUser } from "../hooks/useUser"; 
import {
  getMyReview,
  deleteReview,
  getRatingsByMovie,
} from "../api/firebase";
import ReviewForm from "../components/ReviewForm";

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [myReview, setMyReview] = useState(null);
  const [allReviews, setAllReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [myRating, setMyRating] = useState(null); // 👤 내 평점
  const { user } = useUser(); // 🔑 현재 로그인한 사용자

  const load = async () => {
    const movieData = await fetchMovieById(id);
    setMovie(movieData);

    const my = await getMyReview(id);
    setMyReview(my);

    const all = await getRatingsByMovie(id);
    setAllReviews(all);
  };

  useEffect(() => {
    const fetchDetails = async () => {
      const data = await fetchMovieById(id);
      setMovie(data);
    };
     const fetchAll = async () => {
    const all = await getAllReviews(id);  // id는 movieId
    setAllReviews(all);
  };
  fetchAll();

    const fetchRatings = async () => {
      const ratings = await getRatingsByMovie(id);
      if (ratings.length > 0) {
        const avg =
          ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
        setAverageRating(Math.round(avg * 10) / 10); // 소수점 1자리
        setReviewCount(ratings.length);
      }
    };
    const fetchMyRating = async () => {
      if (user) {
        const rating = await getMyRatingForMovie(id, user.uid);
        setMyRating(rating);
      }
    };

    fetchDetails();
    fetchRatings();
    fetchMyRating(); // 👤 내 평점까지 함께
  }, [id]);

  const handleDelete = async () => {
    if (confirm("리뷰를 삭제하시겠습니까?")) {
      await deleteReview(id);
      setMyReview(null);
      load(); // 삭제 후 리뷰 새로고침
    }
  };

  if (!movie) return <div>로딩 중...</div>;

  return (
    <div className="max-w-xl mx-auto mt-6 px-4">
      <h2 className="text-xl font-bold">{movie.title}</h2>
      <p className="text-sm text-gray-600 mb-2">
        ⭐ 평균 평점:{" "}
        {averageRating ? `${averageRating}점 (${reviewCount}명)` : "평점 없음"}
      </p>


      <img
        src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
        alt={movie.title}
        className="w-full rounded mb-4"
      />
      <p className="mb-6">{movie.overview || "줄거리 정보 없음"}</p>
      <div className="bg-white p-4 rounded shadow mb-6">
        {myReview ? (
          <div>
            <p className="text-green-700 mb-2">
              작성한 리뷰: {myReview.review}
            </p>
            
            


            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              삭제
            </button>
          </div>
        ) : (
          <ReviewForm movieId={id} onSubmitted={load} />
        )}
      </div>

      <div className="border-t pt-4">
        <h2 className="text-lg font-bold mb-2">다른 유저 리뷰</h2>
        {allReviews
          .filter((r) => r.userId !== myReview?.userId)
          .map((r, i) => (
            <div key={i} className="mb-4">
              <p className="text-yellow-600">{r.userName} ⭐ {r.rating}</p>
              <p>{r.review}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default MovieDetail;

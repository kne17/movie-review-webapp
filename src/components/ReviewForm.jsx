import { useEffect, useState } from "react";
import {
  getMyReview,
  saveReviewWithRating,
  deleteReview,
} from "../api/firebase";
import { useUser } from "../hooks/useUser";

function ReviewForm({ movieId, onSubmitted }) {
  const { user } = useUser();
  const [myReview, setMyReview] = useState(null);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      getMyReview(user.uid, movieId).then((r) => {
        setMyReview(r);
        if (r) {
          setReview(r.review || "");
          setRating(r.rating || 0);
        }
      });
    }
  }, [user, movieId]);

  const handleSubmit = async () => {
    try {
      if (myReview) {
        setError("이미 리뷰를 작성하셨습니다.");
        return;
      }

      await saveReviewWithRating({ movieId, review, rating });
      if (onSubmitted) onSubmitted();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (myReview) {
      await deleteReview(myReview.id);
      setMyReview(null);
      setReview("");
      setRating(0);
      if (onSubmitted) onSubmitted();
    }
  };

  return (
    <div className="mt-4">
      {myReview ? (
        <div className="mb-2 text-600">
            <p className="">
              내가 준 평점:&nbsp;
              <span className="text-lg font-sans text-yellow-400" style={{ fontFamily: 'Arial, sans-serif' }}>
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i}>
                    {i < myReview.rating ? "★" : "☆"}
                  </span>
                ))}
              </span>
            </p>
            작성한 리뷰<br></br> {myReview.review}
        </div>
        
      ) : (
        <>
          <textarea
            className="w-full border p-2 rounded"
            placeholder="리뷰를 작성하세요"
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
          <div className="mt-2">
            평점:{" "}
            {[1, 2, 3, 4, 5].map((v) => (
              <button
                key={v}
                onClick={() => setRating(v)}
                className={`text-2xl ${
                  rating >= v ? "text-yellow-400" : "text-gray-400"
                }`}
              >
                ★
              </button>
            ))}
          </div>
          {error && <div className="text-red-500 mt-1">{error}</div>}
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-1 mt-2 rounded"
          >
            리뷰 작성
          </button>
        </>
      )}

      {myReview && (
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-3 py-1 mt-2 ml-2 rounded"
        >
          삭제
        </button>
      )}
    </div>
  );
}

export default ReviewForm;

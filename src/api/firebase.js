import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  where,
  doc,
  limit,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);

// ✅ 전체 평점 가져오기 (평점이 있는 리뷰 기준)
export async function getAllRatings() {
  const ref = collection(db, "reviews");
  const snapshot = await getDocs(ref);
  return snapshot.docs
    .map((doc) => doc.data())
    .filter((r) => typeof r.rating === "number" && r.movieId);
}

// ✅ 특정 유저가 특정 영화에 남긴 리뷰
export async function getMyReview(userId, movieId) {
  const q = query(
    collection(db, "reviews"),
    where("userId", "==", userId),
    where("movieId", "==", movieId),
    limit(1)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() };
}

// ✅ 내 모든 리뷰 불러오기
export async function getMyReviews(userId) {
  const q = query(collection(db, "reviews"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// ✅ 리뷰 + 평점 저장 (중복 허용 안 함)
export async function saveReviewWithRating({ movieId, review, rating }) {
  const user = auth.currentUser;
  if (!user) throw new Error("로그인 필요");
  const userId = user.uid;
  const userName = user.displayName;

  const existing = await getMyReview(userId, movieId);
  if (existing) throw new Error("이미 리뷰를 작성했습니다.");

  await addDoc(collection(db, "reviews"), {
    userId,
    userName,
    movieId,
    review,
    rating,
    createdAt: Date.now(),
  });
}

// ✅ 리뷰 삭제
export async function deleteReview(reviewId) {
  await deleteDoc(doc(db, "reviews", reviewId));
}

export async function getRatingsByMovie(movieId) {
  const ref = collection(db, "reviews");
  const snapshot = await getDocs(ref);
  return snapshot.docs
    .map((doc) => doc.data())
    .filter((r) => r.movieId === movieId && typeof r.rating === "number");
}
// 🔍 특정 영화에 대해 내가 남긴 평점만 가져오기
export async function getMyRatingForMovie(movieId, userId) {
  const ref = collection(db, "reviews");
  const snapshot = await getDocs(ref);
  const myReview = snapshot.docs
    .map((doc) => doc.data())
    .find((r) => r.movieId === movieId && r.userId === userId);
  return myReview?.rating ?? null;
}
// 전체 리뷰 불러오기
export const getAllReviews = async (movieId) => {
  const q = query(collection(db, "reviews"), where("movieId", "==", movieId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
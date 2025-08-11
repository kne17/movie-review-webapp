import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <header className="bg-blue-600 text-white px-4 py-3 flex items-center">
      <Link to="/" className="text-lg font-bold">
        🎬 영화 리뷰 앱
      </Link>

      <div className="ml-auto">
        {user ? (
            <div className="flex items-center space-x-4">
                {user && (
                <Link to="/mypage" className="ml-4 hover:underline">
                    {user.displayName || user.email}
                </Link>
                )}

                <button
                    onClick={handleLogout}
                    className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100"
                >
                    로그아웃
                </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100"
          >
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;

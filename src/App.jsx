import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MovieDetail from './pages/MovieDetail'
import Layout from './components/Layout'
import Login from './pages/Login'
import RequireAuth from './components/RequireAuth'
import ReviewForm from './components/ReviewForm'
import MyPage from "./pages/MyPage";

<Route path="/login" element={<Login />} />


function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route
          path="movie/:id"
          element={
            <RequireAuth>
              <MovieDetail />
            </RequireAuth>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/review/:id" element={<ReviewForm />} />
      </Route>
    </Routes>
  )
}

export default App
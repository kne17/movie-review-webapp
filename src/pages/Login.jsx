import { useState } from 'react'
import { auth, provider } from '../firebase'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, pw)
      alert('로그인 성공!')
      navigate('/')
    } catch (err) {
      alert('로그인 실패: ' + err.message)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider)
      alert('구글 로그인 성공!')
      navigate('/')
    } catch (err) {
      alert('구글 로그인 실패: ' + err.message)
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">로그인</h2>
      <form onSubmit={handleLogin} className="space-y-3 mb-4">
        <input
          className="border px-3 py-2 w-full"
          type="email"
          placeholder="이메일"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="border px-3 py-2 w-full"
          type="password"
          placeholder="비밀번호"
          value={pw}
          onChange={e => setPw(e.target.value)}
          required
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">로그인</button>
      </form>

      <button
        onClick={handleGoogleLogin}
        className="bg-red-500 text-white px-4 py-2 rounded w-full"
      >
        구글로 로그인
      </button>
    </div>
  )
}

export default Login

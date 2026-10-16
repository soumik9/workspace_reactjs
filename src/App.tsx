import { useSelector } from 'react-redux'
import { useAuthCheck } from './libs/hooks/useAuthCheck'
import type { RootState } from './libs/redux/store/store.redux'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'
import { MainPanel } from './components/main_panel/MainPanel'
import { Login } from './components/auth/Login'
import { Register } from './components/auth/Register'
import { NotifyContainer } from './libs/helper/notify.helper'

function App() {
  const { authChecked, profileError, retryProfile } = useAuthCheck();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  if (!authChecked) {
    return <div role="status" className="flex h-screen items-center justify-center text-purple-600">Loading your workspace...</div>
  }
  if (isAuthenticated && profileError) {
    return (
      <div role="alert" className="flex h-screen flex-col items-center justify-center space-y-4">
        <p>Unable to load your profile. Please try again.</p>
        <button onClick={() => retryProfile()} className="rounded-lg bg-purple-600 px-4 py-2 text-white">Try again</button>
      </div>
    )
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
        />

        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
        />

        <Route
          path="/"
          element={isAuthenticated ? (
            <MainLayout>
              <MainPanel />
            </MainLayout>
          ) : <Navigate
            to="/login"
            replace />}
        />
      </Routes>

      <NotifyContainer />
    </BrowserRouter>
  )
}

export default App

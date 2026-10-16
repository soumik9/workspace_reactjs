import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'
import { MainPanel } from './components/main_panel/MainPanel'
import { Login } from './components/auth/Login'
import { Register } from './components/auth/Register'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <MainLayout>
            <MainPanel />
          </MainLayout>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App

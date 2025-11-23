import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import CreateProduct from './pages/CreateProduct'
import CreateCategory from './pages/CreateCategory'
import './App.css'

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/criar-produto" element={<CreateProduct />} />
        <Route path="/criar-categoria" element={<CreateCategory />} />
      </Routes>
    </div>
  )
}

export default App

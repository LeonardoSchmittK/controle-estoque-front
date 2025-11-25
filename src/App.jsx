import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import CreateProduct from './pages/CreateProduct'
import CreateCategory from './pages/CreateCategory'
import EditProduct from './pages/EditProduct'
import EditCategory from './pages/EditCategory'
import Categories from './pages/Categories'
import Movements from './pages/Movements'
import './App.css'

// 🔥 IMPORT AQUI
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <div className="App">
      {/* 🔥 TOASTER AQUI */}
      <Toaster position="top-center" />

      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/criar-produto" element={<CreateProduct />} />
        <Route path="/editar-produto/:id" element={<EditProduct />} />
        <Route path="/criar-categoria" element={<CreateCategory />} />
        <Route path="/editar-categoria/:id" element={<EditCategory />} />
        <Route path="/categorias" element={<Categories />} />
        <Route path="/movimentacoes" element={<Movements />} />
      </Routes>
    </div>
  )
}

export default App

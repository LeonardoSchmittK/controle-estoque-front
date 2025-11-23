import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="bg-slate-900/80 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">Controle de Estoque</span>
          </Link>

          <div className="flex items-center space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/')
                  ? 'bg-purple-500 text-white'
                  : 'text-purple-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              to="/criar-produto"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/criar-produto')
                  ? 'bg-purple-500 text-white'
                  : 'text-purple-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              Criar Produto
            </Link>
            <Link
              to="/criar-categoria"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/criar-categoria')
                  ? 'bg-purple-500 text-white'
                  : 'text-purple-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              Criar Categoria
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

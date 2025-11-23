import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-4 animate-fade-in">
            Controle de Estoque
          </h1>
          <p className="text-xl text-purple-200">
            Sistema de gerenciamento de produtos e categorias
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home

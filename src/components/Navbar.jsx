import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const linkBaseClasses =
    "relative px-4 py-2 rounded-lg font-medium transition-all text-sm"

  const linkHoverClasses =
    "hover:bg-gray-500 hover:text-white"

  return (
    <nav className="bg-gray-500 border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="group">
            <span className="text-xl font-bold text-gray-300">Controle de Estoque</span>
          </Link>

          <div className="flex items-center space-x-1">

            {[
              { path: "/", label: "Home" },
              { path: "/criar-produto", label: "Criar Produto" },
              { path: "/categorias", label: "Categorias" },
              { path: "/movimentacoes", label: "Movimentações" },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${linkBaseClasses} ${
                 `text-gray-300 ${linkHoverClasses}`
                }`}
              >
                {item.label}

                {/* underline animado */}
                <span
                  className={`
                    absolute left-1/2 -bottom-1 h-[2px] w-0 bg-sky-500 
                    transition-all duration-300
                    ${isActive(item.path)
                      ? "w-3/4 -translate-x-1/2"
                      : "group-hover:w-3/4 group-hover:-translate-x-1/2"}
                  `}
                ></span>
              </Link>
            ))}

          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

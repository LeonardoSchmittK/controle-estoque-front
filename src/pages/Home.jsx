import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Home() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortColumn, setSortColumn] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACK_END_API}/api/products`),
          fetch(`${import.meta.env.VITE_BACK_END_API}/api/categories`)
        ])

        if (!productsRes.ok || !categoriesRes.ok) {
          throw new Error('Erro ao buscar dados')
        }

        const productsData = await productsRes.json()
        const categoriesData = await categoriesRes.json()

        setProducts(productsData)
        setCategories(categoriesData)
      } catch (error) {
        console.error("Erro ao buscar dados:", error)
        alert("Erro ao carregar dados. Verifique se o backend está rodando.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? `${category.name} (${category.size})` : 'N/A'
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === '' || product.categoryId === parseInt(selectedCategory)
    return matchesSearch && matchesCategory
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue, bValue

    switch (sortColumn) {
      case 'name':
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case 'price':
        aValue = a.unitPrice
        bValue = b.unitPrice
        break
      case 'quantity':
        aValue = a.quantityInStock
        bValue = b.quantityInStock
        break
      default:
        return 0
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const isLowStock = (product) => {
    return product.quantityInStock < product.minQuantity
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">
            Controle de Estoque
          </h1>
          <p className="text-xl text-purple-200">
            Gerenciamento de produtos e categorias
          </p>
        </div>

        {loading ? (
          <div className="text-center text-purple-200 py-16">
            <p className="text-2xl">Carregando produtos...</p>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Search */}
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-purple-200 mb-2">
                    🔍 Pesquisar Produto
                  </label>
                  <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Digite o nome do produto..."
                    className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-purple-200 mb-2">
                    📦 Filtrar por Categoria
                  </label>
                  <select
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Todas as Categorias</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name} ({category.size} - {category.packaging})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 text-purple-200 text-sm">
                Mostrando {sortedProducts.length} de {products.length} produtos
              </div>
            </div>

            {sortedProducts.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 shadow-2xl text-center">
                <p className="text-2xl text-purple-200 mb-4">
                  {products.length === 0 ? '📦 Nenhum produto cadastrado' : '🔍 Nenhum produto encontrado'}
                </p>
                {products.length === 0 && (
                  <Link
                    to="/create-product"
                    className="inline-block mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
                  >
                    Criar Primeiro Produto
                  </Link>
                )}
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5">
                      <tr>
                        <th 
                          onClick={() => handleSort('name')}
                          className="px-6 py-4 text-left text-sm font-semibold text-purple-200 cursor-pointer hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            Nome
                            {sortColumn === 'name' && (
                              <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </div>
                        </th>
                        <th 
                          onClick={() => handleSort('price')}
                          className="px-6 py-4 text-left text-sm font-semibold text-purple-200 cursor-pointer hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            Preço
                            {sortColumn === 'price' && (
                              <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">
                          Unidade
                        </th>
                        <th 
                          onClick={() => handleSort('quantity')}
                          className="px-6 py-4 text-left text-sm font-semibold text-purple-200 cursor-pointer hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            Qtd. Estoque
                            {sortColumn === 'quantity' && (
                              <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">
                          Qtd. Mín
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">
                          Qtd. Máx
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">
                          Categoria
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {sortedProducts.map(product => (
                        <tr 
                          key={product.id} 
                          className={`hover:bg-white/5 transition-colors ${isLowStock(product) ? 'bg-red-500/10' : ''}`}
                        >
                          <td className="px-6 py-4 text-white font-medium">
                            {product.name}
                            {isLowStock(product) && (
                              <span className="ml-2 text-red-400 text-xs">⚠️ Estoque Baixo</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-purple-200">
                            R$ {product.unitPrice.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-purple-200">
                            {product.unit}
                          </td>
                          <td className={`px-6 py-4 font-semibold ${isLowStock(product) ? 'text-red-400' : 'text-purple-200'}`}>
                            {product.quantityInStock}
                          </td>
                          <td className="px-6 py-4 text-purple-200">
                            {product.minQuantity}
                          </td>
                          <td className="px-6 py-4 text-purple-200">
                            {product.maxQuantity}
                          </td>
                          <td className="px-6 py-4 text-purple-200">
                            {getCategoryName(product.categoryId)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Home

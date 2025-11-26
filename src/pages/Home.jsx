import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ConfirmModal from '../components/ConfirmModal'
import { FiBarChart2 } from "react-icons/fi";
import { FiSearch } from "react-icons/fi";
import { FiBox } from "react-icons/fi"
import { FiPackage } from "react-icons/fi";
import { FiAlertTriangle, FiTrendingUp } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";
import { FiEdit2 } from "react-icons/fi";
import { FaMedal } from "react-icons/fa";
import { FiTrendingDown } from "react-icons/fi";
import { FiCheckCircle } from "react-icons/fi";


function Home() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [movements, setMovements] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortColumn, setSortColumn] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')
  const [reportType, setReportType] = useState('list') 
  
  
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: '', 
    id: null,
    name: '',
    relatedProducts: 0
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes, movementsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACK_END_API}/api/products`),
          fetch(`${import.meta.env.VITE_BACK_END_API}/api/categories`),
          fetch(`${import.meta.env.VITE_BACK_END_API}/api/movements`)
        ])

        if (!productsRes.ok || !categoriesRes.ok || !movementsRes.ok) {
          throw new Error('Erro ao buscar dados')
        }

        const productsData = await productsRes.json()
        const categoriesData = await categoriesRes.json()
        const movementsData = await movementsRes.json()

        setProducts(productsData)
        setCategories(categoriesData)
        setMovements(movementsData)
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
    if (searchTerm === '') return true
    
    const searchLower = searchTerm.toLowerCase()
    const categoryName = getCategoryName(product.categoryId).toLowerCase()
    
    return (
      product.name.toLowerCase().includes(searchLower) ||
      categoryName.includes(searchLower) ||
      product.unit.toLowerCase().includes(searchLower) ||
      product.unitPrice.toString().includes(searchLower) ||
      product.quantityInStock.toString().includes(searchLower) ||
      product.minQuantity.toString().includes(searchLower) ||
      product.maxQuantity.toString().includes(searchLower)
    )
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
      case 'unit':
        aValue = a.unit.toLowerCase()
        bValue = b.unit.toLowerCase()
        break
      case 'quantity':
        aValue = a.quantityInStock
        bValue = b.quantityInStock
        break
      case 'minQuantity':
        aValue = a.minQuantity
        bValue = b.minQuantity
        break
      case 'maxQuantity':
        aValue = a.maxQuantity
        bValue = b.maxQuantity
        break
      case 'category':
        aValue = getCategoryName(a.categoryId).toLowerCase()
        bValue = getCategoryName(b.categoryId).toLowerCase()
        break
      case 'totalValue':
        aValue = a.unitPrice * a.quantityInStock
        bValue = b.unitPrice * b.quantityInStock
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

  const isHighStock = (product) => {
    return product.quantityInStock > product.maxQuantity
  }

  const handleDeleteProduct = (product) => {
    setDeleteModal({
      isOpen: true,
      type: 'product',
      id: product.id,
      name: product.name,
      relatedProducts: 0
    })
  }

  const handleDeleteCategory = (category) => {
    const relatedProducts = products.filter(p => p.categoryId === category.id).length
    setDeleteModal({
      isOpen: true,
      type: 'category',
      id: category.id,
      name: category.name,
      relatedProducts
    })
  }

  const confirmDelete = async () => {
    try {
      const endpoint = deleteModal.type === 'product' ? 'products' : 'categories'
      const response = await fetch(`${import.meta.env.VITE_BACK_END_API}/api/${endpoint}/${deleteModal.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error(`Erro ao excluir ${deleteModal.type === 'product' ? 'produto' : 'categoria'}`)
      }

      
      const [productsRes, categoriesRes, movementsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_BACK_END_API}/api/products`),
        fetch(`${import.meta.env.VITE_BACK_END_API}/api/categories`),
        fetch(`${import.meta.env.VITE_BACK_END_API}/api/movements`)
      ])

      const productsData = await productsRes.json()
      const categoriesData = await categoriesRes.json()
      const movementsData = await movementsRes.json()

      setProducts(productsData)
      setCategories(categoriesData)
      setMovements(movementsData)
      
      setDeleteModal({ isOpen: false, type: '', id: null, name: '', relatedProducts: 0 })
    } catch (error) {
      console.error("Erro ao excluir:", error)
      alert(`Erro ao excluir ${deleteModal.type === 'product' ? 'produto' : 'categoria'}. Tente novamente.`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 bg-gray-50 to-slate-900 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        
        
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">
            Controle de Estoque
          </h1>
          <p className="text-xl text-purple-200">
            Gerenciamento de produtos e categorias
          </p>
        </div>

       
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl mb-6">
          <label htmlFor="reportType" className="block text-sm font-medium text-purple-200 mb-2">
           <FiBarChart2 /> Selecione o Tipo de Relatório

          </label>
          <select
            id="reportType"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="list">Lista de Produtos</option>
            <option value="balance">Balanço Físico/Financeiro</option>
            <option value="lowStock">Produtos Abaixo da Quantidade Mínima</option>
            <option value="byCategory">Quantidade de Produtos por Categoria</option>
            <option value="ranking">Ranking de Entradas e Saídas</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center text-purple-200 py-16">
            <p className="text-2xl">Carregando produtos...</p>
          </div>
        ) : (
          <>
            {reportType === 'list' ? (
              <>
               
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                    <div>
                      <label htmlFor="search" className="block text-sm font-medium text-purple-200 mb-2">
                        <FiSearch /> Pesquisar

                      </label>
                      <input
                        type="text"
                        id="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Pesquisar por nome, categoria, preço, quantidade..."
                        className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-purple-200 mb-2">
                        <FiBox /> Filtrar por Categoria

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
                      {products.length === 0 ? (
                        <>
                           Nenhum produto cadastrado
                        </>
                      ) : (
                        <>
                           Nenhum produto encontrado
                        </>
                      )}

                    </p>
                    {products.length === 0 && (
                      <Link
                        to="/criar-produto"
                        className="inline-block mt-4 bg-gradient-to-r from-sky-500 to-sky-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-sky-600 hover:to-sky-600 transition-all"
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
                            <th 
                              onClick={() => handleSort('unit')}
                              className="px-6 py-4 text-left text-sm font-semibold text-purple-200 cursor-pointer hover:bg-white/10 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                Unidade
                                {sortColumn === 'unit' && (
                                  <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                )}
                              </div>
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
                            <th 
                              onClick={() => handleSort('minQuantity')}
                              className="px-6 py-4 text-left text-sm font-semibold text-purple-200 cursor-pointer hover:bg-white/10 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                Qtd. Mín
                                {sortColumn === 'minQuantity' && (
                                  <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                )}
                              </div>
                            </th>
                            <th 
                              onClick={() => handleSort('maxQuantity')}
                              className="px-6 py-4 text-left text-sm font-semibold text-purple-200 cursor-pointer hover:bg-white/10 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                Qtd. Máx
                                {sortColumn === 'maxQuantity' && (
                                  <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                )}
                              </div>
                            </th>
                            <th 
                              onClick={() => handleSort('category')}
                              className="px-6 py-4 text-left text-sm font-semibold text-purple-200 cursor-pointer hover:bg-white/10 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                Categoria
                                {sortColumn === 'category' && (
                                  <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                )}
                              </div>
                            </th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-purple-200">
                              Ações
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                          {sortedProducts.map(product => (
                            <tr 
                              key={product.id} 
                              className={`hover:bg-white/5 transition-colors ${
                                isLowStock(product) ? 'bg-red-500/10' : 
                                isHighStock(product) ? 'bg-orange-500/10' : ''
                              }`}
                            >
                              <td className="px-6 py-4 text-white font-medium">
                                {product.name}
                                {isLowStock(product) && (
                                <span className="ml-2 text-red-400 text-xs flex items-center gap-1">
                                  <FiAlertTriangle /> Estoque Baixo
                                </span>
                              )}
                              {isHighStock(product) && (
                                <span className="ml-2 text-orange-400 text-xs flex items-center gap-1">
                                  <FiTrendingUp /> Estoque Alto
                                </span>
                              )}

                              </td>
                              <td className="px-6 py-4 text-purple-200">
                                R$ {product.unitPrice.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 text-purple-200">
                                {product.unit}
                              </td>
                              <td className={`px-6 py-4 font-semibold ${
                                isLowStock(product) ? 'text-red-400' : 
                                isHighStock(product) ? 'text-orange-400' : 'text-purple-200'
                              }`}>
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
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => navigate(`/editar-produto/${product.id}`)}
                                   className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-all text-sm font-medium flex items-center gap-2"
                                    title="Editar produto"
                                  >
                                    <FiEdit2 /> Editar

                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(product)}
                                    className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all text-sm font-medium flex items-center gap-2"

                                   title="Excluir produto"
                                  >
                                    <FiTrash2 /> Excluir

                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            ) : reportType === 'balance' ? (
              <>
               
                {products.length === 0 ? (
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 shadow-2xl text-center">
                    <p className="text-2xl text-purple-200 mb-4">
                     Nenhum produto cadastrado

                    </p>
                    <Link
                      to="/criar-produto"
                      className="inline-block mt-4 bg-gradient-to-r from-sky-500 to-sky-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-sky-600 hover:to-sky-600 transition-all"
                    >
                      Criar Primeiro Produto
                    </Link>
                  </div>
                ) : (
                  <>
                   
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl mb-6">
                      <label htmlFor="balanceSearch" className="block text-sm font-medium text-purple-200 mb-2">
                        <FiSearch /> Pesquisar
                      </label>
                      <input
                        type="text"
                        id="balanceSearch"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Pesquisar por produto, categoria, quantidade, valor..."
                        className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <div className="mt-4 text-purple-200 text-sm">
                        Mostrando {sortedProducts.length} de {products.length} produtos
                      </div>
                    </div>

                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="bg-gradient-to-br from-blue-200/20 to-pink-blue/20  backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
                        <div className="text-purple-200 text-sm mb-2">Total de Produtos</div>
                        <div className="text-white text-3xl font-bold">{products.length}</div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-200/20 to-pink-blue/20  backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
                        <div className="text-purple-200 text-sm mb-2">Itens em Estoque</div>
                        <div className="text-white text-3xl font-bold">
                          {products.reduce((sum, p) => sum + p.quantityInStock, 0)}
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-200/20 to-pink-blue/20  backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
                        <div className="text-purple-200 text-sm mb-2">Valor Total do Estoque</div>
                        <div className="text-white text-3xl font-bold">
                          R$ {products.reduce((sum, p) => sum + (p.unitPrice * p.quantityInStock), 0).toFixed(2)}
                        </div>
                      </div>
                    </div>

                   
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
                                  Produto
                                  {sortColumn === 'name' && (
                                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                  )}
                                </div>
                              </th>
                              <th 
                                onClick={() => handleSort('category')}
                                className="px-6 py-4 text-left text-sm font-semibold text-purple-200 cursor-pointer hover:bg-white/10 transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  Categoria
                                  {sortColumn === 'category' && (
                                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                  )}
                                </div>
                              </th>
                              <th 
                                onClick={() => handleSort('quantity')}
                                className="px-6 py-4 text-right text-sm font-semibold text-purple-200 cursor-pointer hover:bg-white/10 transition-colors"
                              >
                                <div className="flex items-center justify-end gap-2">
                                  Qtd. Disponível
                                  {sortColumn === 'quantity' && (
                                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                  )}
                                </div>
                              </th>
                              <th 
                                onClick={() => handleSort('price')}
                                className="px-6 py-4 text-right text-sm font-semibold text-purple-200 cursor-pointer hover:bg-white/10 transition-colors"
                              >
                                <div className="flex items-center justify-end gap-2">
                                  Valor Unitário
                                  {sortColumn === 'price' && (
                                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                  )}
                                </div>
                              </th>
                              <th 
                                onClick={() => handleSort('totalValue')}
                                className="px-6 py-4 text-right text-sm font-semibold text-purple-200 cursor-pointer hover:bg-white/10 transition-colors"
                              >
                                <div className="flex items-center justify-end gap-2">
                                  Valor Total
                                  {sortColumn === 'totalValue' && (
                                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                  )}
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/10">
                            {sortedProducts.map(product => {
                              const totalValue = product.unitPrice * product.quantityInStock
                              return (
                                <tr key={product.id} className="hover:bg-white/5 transition-colors">
                                  <td className="px-6 py-4 text-white font-medium">
                                    {product.name}
                                  </td>
                                  <td className="px-6 py-4 text-purple-200">
                                    {getCategoryName(product.categoryId)}
                                  </td>
                                  <td className="px-6 py-4 text-purple-200 text-right">
                                    {product.quantityInStock} {product.unit}
                                  </td>
                                  <td className="px-6 py-4 text-purple-200 text-right">
                                    R$ {product.unitPrice.toFixed(2)}
                                  </td>
                                  <td className="px-6 py-4 text-white font-semibold text-right">
                                    R$ {totalValue.toFixed(2)}
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                          <tfoot className="bg-white/5">
                            <tr>
                              <td colSpan="4" className="px-6 py-4 text-white font-bold text-right">
                                VALOR TOTAL DO ESTOQUE:
                              </td>
                              <td className="px-6 py-4 text-white font-bold text-right text-xl">
                                R$ {products.reduce((sum, p) => sum + (p.unitPrice * p.quantityInStock), 0).toFixed(2)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : reportType === 'lowStock' ? (
              <>
                
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl mb-6">
                  <label htmlFor="lowStockSearch" className="block text-sm font-medium text-purple-200 mb-2">
                    <FiSearch /> Pesquisar
                  </label>
                  <input
                    type="text"
                    id="lowStockSearch"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Pesquisar por produto, quantidade..."
                    className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="mt-4 text-purple-200 text-sm">
                    Mostrando {sortedProducts.filter(p => isLowStock(p)).length} produtos abaixo da quantidade mínima
                  </div>
                </div>

                {sortedProducts.filter(p => isLowStock(p)).length === 0 ? (
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 shadow-2xl text-center">
                    <p className="text-2xl text-purple-200 mb-4">
                      {products.length === 0 ? 'Nenhum produto cadastrado' : 'Nenhum produto abaixo da quantidade mínima'}
                    </p>
                    {products.length === 0 && (
                      <Link
                        to="/criar-produto"
                        className="inline-block mt-4 bg-gradient-to-r from-sky-500 to-sky-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-sky-600 hover:to-sky-600 transition-all"
                      >
                        Criar Primeiro Produto
                      </Link>
                    )}
                  </div>
                ) : (
                  <>
                    
                    <div className="bg-gradient-to-r from-red-500/20 to-red-500/20 backdrop-blur-lg rounded-2xl p-4 border-red-400/30 shadow-2xl mb-6">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl"><FiAlertTriangle size={24} color="yellow" /></span>
                        <div>
                          <h3 className="text-white text-xl font-bold">Atenção: Estoque Baixo</h3>
                          <p className="text-red-200">
                            {sortedProducts.filter(p => isLowStock(p)).length} produto(s) abaixo da quantidade mínima necessitam reposição
                          </p>
                        </div>
                      </div>
                    </div>

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
                                  Produto
                                  {sortColumn === 'name' && (
                                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                  )}
                                </div>
                              </th>
                              <th 
                                onClick={() => handleSort('category')}
                                className="px-6 py-4 text-left text-sm font-semibold text-purple-200 cursor-pointer hover:bg-white/10 transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  Categoria
                                  {sortColumn === 'category' && (
                                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                  )}
                                </div>
                              </th>
                              <th 
                                onClick={() => handleSort('minQuantity')}
                                className="px-6 py-4 text-right text-sm font-semibold text-purple-200 cursor-pointer hover:bg-white/10 transition-colors"
                              >
                                <div className="flex items-center justify-end gap-2">
                                  Qtd. Mínima
                                  {sortColumn === 'minQuantity' && (
                                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                  )}
                                </div>
                              </th>
                              <th 
                                onClick={() => handleSort('quantity')}
                                className="px-6 py-4 text-right text-sm font-semibold text-purple-200 cursor-pointer hover:bg-white/10 transition-colors"
                              >
                                <div className="flex items-center justify-end gap-2">
                                  Qtd. em Estoque
                                  {sortColumn === 'quantity' && (
                                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                  )}
                                </div>
                              </th>
                              <th className="px-6 py-4 text-right text-sm font-semibold text-purple-200">
                                Diferença
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/10">
                            {sortedProducts.filter(p => isLowStock(p)).map(product => {
                              const difference = product.quantityInStock - product.minQuantity
                              return (
                                <tr key={product.id} className="hover:bg-white/5 transition-colors bg-red-500/10">
                                  <td className="px-6 py-4 text-white font-medium">
                                    <div className="flex items-center gap-2">
                                      {product.name}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-purple-200">
                                    {getCategoryName(product.categoryId)}
                                  </td>
                                  <td className="px-6 py-4 text-purple-200 text-right">
                                    {product.minQuantity} {product.unit}
                                  </td>
                                  <td className="px-6 py-4 text-red-400 font-semibold text-right">
                                    {product.quantityInStock} {product.unit}
                                  </td>
                                  <td className="px-6 py-4 text-red-400 font-bold text-right">
                                    {difference} {product.unit}
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : reportType === 'byCategory' ? (
              <>
                
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl mb-6">
                  <label htmlFor="categorySearch" className="block text-sm font-medium text-purple-200 mb-2">
                    <FiSearch /> Pesquisar
                  </label>
                  <input
                    type="text"
                    id="categorySearch"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Pesquisar por categoria..."
                    className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {categories.length === 0 ? (
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 shadow-2xl text-center">
                    <p className="text-2xl text-purple-200 mb-4">
                      Nenhuma categoria cadastrada
                    </p>
                    <Link
                      to="/criar-categoria"
                      className="inline-block mt-4 bg-gradient-to-r from-sky-500 to-sky-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-sky-600 hover:to-sky-600 transition-all"
                    >
                      Criar Primeira Categoria
                    </Link>
                  </div>
                ) : (
                  <>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="bg-gradient-to-br from-blue-200/20 to-pink-blue/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
                        <div className="text-purple-200 text-sm mb-2">Total de Categorias</div>
                        <div className="text-white text-3xl font-bold">{categories.length}</div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-200/20 to-pink-blue/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
                        <div className="text-purple-200 text-sm mb-2">Total de Produtos</div>
                        <div className="text-white text-3xl font-bold">{products.length}</div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-200/20 to-pink-blue/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
                        <div className="text-purple-200 text-sm mb-2">Média por Categoria</div>
                        <div className="text-white text-3xl font-bold">
                          {categories.length > 0 ? (products.length / categories.length).toFixed(1) : 0}
                        </div>
                      </div>
                    </div>

                    
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-white/5">
                            <tr>
                              <th 
                                onClick={() => handleSort('category')}
                                className="px-6 py-4 text-left text-sm font-semibold text-purple-200 cursor-pointer hover:bg-white/10 transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  Categoria
                                  {sortColumn === 'category' && (
                                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                  )}
                                </div>
                              </th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">
                                Tamanho
                              </th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">
                                Embalagem
                              </th>
                              <th 
                                onClick={() => handleSort('quantity')}
                                className="px-6 py-4 text-right text-sm font-semibold text-purple-200 cursor-pointer hover:bg-white/10 transition-colors"
                              >
                                <div className="flex items-center justify-end gap-2">
                                  Qtd. Produtos Distintos
                                  {sortColumn === 'quantity' && (
                                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                  )}
                                </div>
                              </th>
                              <th className="px-6 py-4 text-right text-sm font-semibold text-purple-200">
                                Total de Itens
                              </th>
                              <th className="px-6 py-4 text-right text-sm font-semibold text-purple-200">
                                Valor Total
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/10">
                            {categories
                              .filter(category => {
                                if (searchTerm === '') return true
                                const searchLower = searchTerm.toLowerCase()
                                return (
                                  category.name.toLowerCase().includes(searchLower) ||
                                  category.size.toLowerCase().includes(searchLower) ||
                                  category.packaging.toLowerCase().includes(searchLower)
                                )
                              })
                              .sort((a, b) => {
                                const aProducts = products.filter(p => p.categoryId === a.id)
                                const bProducts = products.filter(p => p.categoryId === b.id)
                                
                                let aValue, bValue
                                
                                if (sortColumn === 'category') {
                                  aValue = a.name.toLowerCase()
                                  bValue = b.name.toLowerCase()
                                } else if (sortColumn === 'quantity') {
                                  aValue = aProducts.length
                                  bValue = bProducts.length
                                } else {
                                  return 0
                                }
                                
                                if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
                                if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
                                return 0
                              })
                              .map(category => {
                                const categoryProducts = products.filter(p => p.categoryId === category.id)
                                const totalItems = categoryProducts.reduce((sum, p) => sum + p.quantityInStock, 0)
                                const totalValue = categoryProducts.reduce((sum, p) => sum + (p.unitPrice * p.quantityInStock), 0)
                                
                                return (
                                  <tr key={category.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 text-white font-medium">
                                      {category.name}
                                    </td>
                                    <td className="px-6 py-4 text-purple-200">
                                      {category.size}
                                    </td>
                                    <td className="px-6 py-4 text-purple-200">
                                      {category.packaging}
                                    </td>
                                    <td className="px-6 py-4 text-white font-semibold text-right">
                                      {categoryProducts.length}
                                    </td>
                                    <td className="px-6 py-4 text-purple-200 text-right">
                                      {totalItems}
                                    </td>
                                    <td className="px-6 py-4 text-purple-200 text-right">
                                      R$ {totalValue.toFixed(2)}
                                    </td>
                                  </tr>
                                )
                              })}
                          </tbody>
                          <tfoot className=" bg-white/5">
                            <tr>
                              <td colSpan="3" className="px-6 py-4 text-white font-bold text-right">
                                Totais:
                              </td>
                              <td className="px-6 py-4 text-white font-bold text-right">
                                {products.length}
                              </td>
                              <td className="px-6 py-4 text-white font-bold text-right">
                                {products.reduce((sum, p) => sum + p.quantityInStock, 0)}
                              </td>
                              <td className="px-6 py-4 text-white font-bold text-right text-xl">
                                R$ {products.reduce((sum, p) => sum + (p.unitPrice * p.quantityInStock), 0).toFixed(2)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="rankingSearch" className="block text-sm font-medium text-purple-200 mb-2">
                        <FiSearch /> Pesquisar
                      </label>
                      <input
                        type="text"
                        id="rankingSearch"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Pesquisar por produto..."
                        className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="rankingCategory" className="block text-sm font-medium text-purple-200 mb-2">
                        <FiBox />  Filtrar por Categoria
                      </label>
                      <select
                        id="rankingCategory"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Ranking Geral</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name} ({category.size} - {category.packaging})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {movements.length === 0 ? (
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 shadow-2xl text-center">
                    <p className="text-2xl text-purple-200 mb-4">
                      Nenhuma movimentação registrada
                    </p>
                  </div>
                ) : (
                  <>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl">
                        <div className="text-purple-200 text-sm mb-2">Total de Entradas</div>
                        <div className="text-white text-3xl font-bold">
                          {movements.filter(m => m.movementType === 'ENTRY').reduce((sum, m) => sum + m.quantityMoved, 0)}
                        </div>
                      </div>
                      <div className="bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl">
                        <div className="text-purple-200 text-sm mb-2">Total de Saídas</div>
                        <div className="text-white text-3xl font-bold">
                          {movements.filter(m => m.movementType === 'EXIT').reduce((sum, m) => sum + m.quantityMoved, 0)}
                        </div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
                        <div className="text-purple-200 text-sm mb-2">Total de Movimentações</div>
                        <div className="text-white text-3xl font-bold">{movements.length}</div>
                      </div>
                    </div>

                   
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      
                      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 px-6 py-4 border-b border-white/20">
                          <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <FiTrendingUp /> Ranking de Entradas
                            {selectedCategory && <span className="text-sm text-purple-200">({categories.find(c => c.id === parseInt(selectedCategory))?.name})</span>}
                          </h3>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-white/5">
                              <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-purple-200">#</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-purple-200">Produto</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold text-purple-200">Qtd. Total</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                              {(() => {
                                const entryMovements = movements.filter(m => m.movementType === 'ENTRY')
                                const productEntries = {}
                                
                                entryMovements.forEach(m => {
                                  const product = products.find(p => p.id === m.productId)
                                  if (product) {
                                    if (selectedCategory === '' || product.categoryId === parseInt(selectedCategory)) {
                                      if (!productEntries[product.id]) {
                                        productEntries[product.id] = { product, total: 0 }
                                      }
                                      productEntries[product.id].total += m.quantityMoved
                                    }
                                  }
                                })
                                
                                return Object.values(productEntries)
                                  .filter(entry => {
                                    if (searchTerm === '') return true
                                    return entry.product.name.toLowerCase().includes(searchTerm.toLowerCase())
                                  })
                                  .sort((a, b) => b.total - a.total)
                                  .slice(0, 10)
                                  .map((entry, index) => (
                                    <tr key={entry.product.id} className="hover:bg-white/5 transition-colors">
                                      <td className="px-6 py-3 text-white font-bold">
                                        {index === 0 ? (
                                            <FaMedal className="text-yellow-400" />
                                          ) : index === 1 ? (
                                            <FaMedal className="text-gray-300" />
                                          ) : index === 2 ? (
                                            <FaMedal className="text-amber-700" />
                                          ) : (
                                            `${index + 1}º`
                                          )}

                                      </td>
                                      <td className="px-6 py-3 text-white font-medium">{entry.product.name}</td>
                                      <td className="px-6 py-3 text-green-400 font-bold text-right">
                                        +{entry.total}
                                      </td>
                                    </tr>
                                  ))
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      
                      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 px-6 py-4 border-b border-white/20">
                          <h3 className="text-xl font-bold text-white flex items-center gap-2">
                           <FiTrendingDown /> Ranking de Saídas
                            {selectedCategory && <span className="text-sm text-purple-200">({categories.find(c => c.id === parseInt(selectedCategory))?.name})</span>}
                          </h3>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-white/5">
                              <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-purple-200">#</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-purple-200">Produto</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold text-purple-200">Qtd. Total</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                              {(() => {
                                const exitMovements = movements.filter(m => m.movementType === 'EXIT')
                                const productExits = {}
                                
                                exitMovements.forEach(m => {
                                  const product = products.find(p => p.id === m.productId)
                                  if (product) {
                                    if (selectedCategory === '' || product.categoryId === parseInt(selectedCategory)) {
                                      if (!productExits[product.id]) {
                                        productExits[product.id] = { product, total: 0 }
                                      }
                                      productExits[product.id].total += m.quantityMoved
                                    }
                                  }
                                })
                                
                                return Object.values(productExits)
                                  .filter(exit => {
                                    if (searchTerm === '') return true
                                    return exit.product.name.toLowerCase().includes(searchTerm.toLowerCase())
                                  })
                                  .sort((a, b) => b.total - a.total)
                                  .slice(0, 10)
                                  .map((exit, index) => (
                                    <tr key={exit.product.id} className="hover:bg-white/5 transition-colors">
                                      <td className="px-6 py-3 text-white font-bold">
                                        {index === 0 ? (
                                          <FaMedal className="text-yellow-400" />
                                        ) : index === 1 ? (
                                          <FaMedal className="text-gray-300" />
                                        ) : index === 2 ? (
                                          <FaMedal className="text-amber-700" />
                                        ) : (
                                          `${index + 1}º`
                                        )}

                                      </td>
                                      <td className="px-6 py-3 text-white font-medium">{exit.product.name}</td>
                                      <td className="px-6 py-3 text-red-400 font-bold text-right">
                                        -{exit.total}
                                      </td>
                                    </tr>
                                  ))
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>

      
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, type: '', id: null, name: '', relatedProducts: 0 })}
        onConfirm={confirmDelete}
        title={`Excluir ${deleteModal.type === 'product' ? 'Produto' : 'Categoria'}?`}
        message={
          deleteModal.type === 'category' && deleteModal.relatedProducts > 0
            ? `Tem certeza que deseja excluir a categoria "${deleteModal.name}"?\n\nATENÇÃO: Esta ação irá excluir:\n• ${deleteModal.relatedProducts} produto(s) relacionado(s)\n• Todas as movimentações desses produtos\n\nEsta ação não pode ser desfeita!`
            : `Tem certeza que deseja excluir "${deleteModal.name}"?\n\nEsta ação não pode ser desfeita!`
        }
        type="danger"
        confirmText="Sim, Excluir"
        cancelText="Cancelar"
      />
    </div>
  )
}

export default Home

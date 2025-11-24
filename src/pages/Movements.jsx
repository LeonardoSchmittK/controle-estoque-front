import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Movements() {
  const [movements, setMovements] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortDirection, setSortDirection] = useState('desc')
  
  // Form state
  const [formData, setFormData] = useState({
    productId: '',
    quantityMoved: '',
    movementType: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [movementsRes, productsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_BACK_END_API}/api/movements`),
        fetch(`${import.meta.env.VITE_BACK_END_API}/api/products`)
      ])

      if (!movementsRes.ok || !productsRes.ok) {
        throw new Error('Erro ao buscar dados')
      }

      const movementsData = await movementsRes.json()
      const productsData = await productsRes.json()

      setMovements(movementsData)
      setProducts(productsData)
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
      setMessage({ type: 'error', text: 'Erro ao carregar dados. Verifique se o backend está rodando.' })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_END_API}/api/movements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: parseInt(formData.productId),
          quantityMoved: parseInt(formData.quantityMoved),
          movementType: formData.movementType
        })
      })

      if (!response.ok) {
        throw new Error('Erro ao criar movimentação')
      }

      setMessage({ 
        type: 'success', 
        text: `Movimentação de ${formData.movementType === 'ENTRY' ? 'entrada' : 'saída'} registrada com sucesso!` 
      })
      
      // Reset form
      setFormData({
        productId: '',
        quantityMoved: '',
        movementType: ''
      })

      // Refresh data
      fetchData()
    } catch (error) {
      console.error("Erro ao criar movimentação:", error)
      setMessage({ type: 'error', text: 'Erro ao criar movimentação. Tente novamente.' })
    } finally {
      setSubmitting(false)
    }
  }

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId)
    return product ? product.name : 'Produto não encontrado'
  }

  const filteredMovements = movements.filter(movement => {
    if (searchTerm === '') return true
    const productName = getProductName(movement.productId)
    return productName.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const sortedMovements = [...filteredMovements].sort((a, b) => {
    const dateA = new Date(a.movementDate)
    const dateB = new Date(b.movementDate)
    return sortDirection === 'desc' ? dateB - dateA : dateA - dateB
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">
            Movimentações de Estoque
          </h1>
          <p className="text-xl text-purple-200">
            Registre entradas e saídas de produtos
          </p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl ${
            message.type === 'success' 
              ? 'bg-green-500/20 border border-green-400/30 text-green-200' 
              : 'bg-red-500/20 border border-red-400/30 text-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Create Movement Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Nova Movimentação</h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Product Select */}
            <div>
              <label htmlFor="productId" className="block text-sm font-medium text-purple-200 mb-2">
                Produto *
              </label>
              <select
                id="productId"
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                required
                className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Selecione um produto</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Movement Type */}
            <div>
              <label htmlFor="movementType" className="block text-sm font-medium text-purple-200 mb-2">
                Tipo *
              </label>
              <select
                id="movementType"
                value={formData.movementType}
                onChange={(e) => setFormData({ ...formData, movementType: e.target.value })}
                required
                className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Selecione o tipo</option>
                <option value="ENTRY">📈 Entrada</option>
                <option value="EXIT">📉 Saída</option>
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label htmlFor="quantityMoved" className="block text-sm font-medium text-purple-200 mb-2">
                Quantidade *
              </label>
              <input
                type="number"
                id="quantityMoved"
                value={formData.quantityMoved}
                onChange={(e) => setFormData({ ...formData, quantityMoved: e.target.value })}
                required
                min="1"
                placeholder="Ex: 10"
                className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-end">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Registrando...' : 'Registrar'}
              </button>
            </div>
          </form>
        </div>

        {/* Search Bar */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl mb-6">
          <label htmlFor="search" className="block text-sm font-medium text-purple-200 mb-2">
            🔍 Pesquisar Movimentação
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por produto..."
            className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <div className="mt-4 text-purple-200 text-sm">
            Mostrando {sortedMovements.length} de {movements.length} movimentações
          </div>
        </div>

        {/* Movements History */}
        {loading ? (
          <div className="text-center text-purple-200 py-16">
            <p className="text-2xl">Carregando movimentações...</p>
          </div>
        ) : sortedMovements.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 shadow-2xl text-center">
            <p className="text-2xl text-purple-200 mb-4">
              {movements.length === 0 ? '📊 Nenhuma movimentação registrada' : '🔍 Nenhuma movimentação encontrada'}
            </p>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th 
                      onClick={() => setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')}
                      className="px-6 py-4 text-left text-sm font-semibold text-purple-200 cursor-pointer hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        Data/Hora
                        <span>{sortDirection === 'desc' ? '↓' : '↑'}</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">
                      Produto
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-purple-200">
                      Tipo
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-purple-200">
                      Quantidade
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {sortedMovements.map(movement => (
                    <tr key={movement.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-purple-200">
                        {formatDate(movement.movementDate)}
                      </td>
                      <td className="px-6 py-4 text-white font-medium">
                        {getProductName(movement.productId)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {movement.movementType === 'ENTRY' ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-semibold">
                            📈 Entrada
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm font-semibold">
                            📉 Saída
                          </span>
                        )}
                      </td>
                      <td className={`px-6 py-4 text-right font-bold ${
                        movement.movementType === 'ENTRY' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {movement.movementType === 'ENTRY' ? '+' : '-'}{movement.quantityMoved}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Movements

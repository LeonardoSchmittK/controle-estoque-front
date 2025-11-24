import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function EditProduct() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  
  const [formData, setFormData] = useState({
    name: '',
    unitPrice: '',
    unit: '',
    quantityInStock: '',
    minQuantity: '',
    maxQuantity: '',
    categoryId: ''
  })

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      const [productRes, categoriesRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_BACK_END_API}/api/products/${id}`),
        fetch(`${import.meta.env.VITE_BACK_END_API}/api/categories`)
      ])

      if (!productRes.ok || !categoriesRes.ok) {
        throw new Error('Erro ao buscar dados')
      }

      const productData = await productRes.json()
      const categoriesData = await categoriesRes.json()

      setFormData({
        name: productData.name,
        unitPrice: productData.unitPrice,
        unit: productData.unit,
        quantityInStock: productData.quantityInStock,
        minQuantity: productData.minQuantity,
        maxQuantity: productData.maxQuantity,
        categoryId: productData.categoryId
      })
      setCategories(categoriesData)
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
      setMessage({ type: 'error', text: 'Erro ao carregar produto. Verifique se o backend está rodando.' })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_END_API}/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          unitPrice: parseFloat(formData.unitPrice),
          quantityInStock: parseInt(formData.quantityInStock),
          minQuantity: parseInt(formData.minQuantity),
          maxQuantity: parseInt(formData.maxQuantity),
          categoryId: parseInt(formData.categoryId)
        })
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar produto')
      }

      setMessage({ type: 'success', text: 'Produto atualizado com sucesso!' })
      setTimeout(() => navigate('/'), 1500)
    } catch (error) {
      console.error("Erro ao atualizar produto:", error)
      setMessage({ type: 'error', text: 'Erro ao atualizar produto. Tente novamente.' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <p className="text-2xl text-purple-200">Carregando produto...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">Editar Produto</h1>
          <p className="text-xl text-purple-200">Atualize as informações do produto</p>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-xl ${
            message.type === 'success' 
              ? 'bg-green-500/20 border border-green-400/30 text-green-200' 
              : 'bg-red-500/20 border border-red-400/30 text-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
          <div className="space-y-6">
            {/* Nome */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-purple-200 mb-2">
                Nome do Produto *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Categoria */}
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-purple-200 mb-2">
                Categoria *
              </label>
              <select
                id="categoryId"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                required
                className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Preço e Unidade */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="unitPrice" className="block text-sm font-medium text-purple-200 mb-2">
                  Preço (R$) *
                </label>
                <input
                  type="number"
                  id="unitPrice"
                  step="0.01"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label htmlFor="unit" className="block text-sm font-medium text-purple-200 mb-2">
                  Unidade *
                </label>
                <input
                  type="text"
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  required
                  placeholder="Ex: kg, un, L"
                  className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Quantidades */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="quantityInStock" className="block text-sm font-medium text-purple-200 mb-2">
                  Qtd. Disponível *
                </label>
                <input
                  type="number"
                  id="quantityInStock"
                  value={formData.quantityInStock}
                  onChange={(e) => setFormData({ ...formData, quantityInStock: e.target.value })}
                  required
                  min="0"
                  className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label htmlFor="minQuantity" className="block text-sm font-medium text-purple-200 mb-2">
                  Qtd. Mínima *
                </label>
                <input
                  type="number"
                  id="minQuantity"
                  value={formData.minQuantity}
                  onChange={(e) => setFormData({ ...formData, minQuantity: e.target.value })}
                  required
                  min="0"
                  className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label htmlFor="maxQuantity" className="block text-sm font-medium text-purple-200 mb-2">
                  Qtd. Máxima *
                </label>
                <input
                  type="number"
                  id="maxQuantity"
                  value={formData.maxQuantity}
                  onChange={(e) => setFormData({ ...formData, maxQuantity: e.target.value })}
                  required
                  min="0"
                  className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProduct

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function EditCategory() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  
  const [formData, setFormData] = useState({
    name: '',
    size: '',
    packaging: ''
  })

  useEffect(() => {
    fetchCategory()
  }, [id])

  const fetchCategory = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_END_API}/api/categories/${id}`)

      if (!response.ok) {
        throw new Error('Erro ao buscar categoria')
      }

      const data = await response.json()
      setFormData({
        name: data.name,
        size: data.size,
        packaging: data.packaging
      })
    } catch (error) {
      console.error("Erro ao buscar categoria:", error)
      setMessage({ type: 'error', text: 'Erro ao carregar categoria. Verifique se o backend está rodando.' })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_END_API}/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar categoria')
      }

      setMessage({ type: 'success', text: 'Categoria atualizada com sucesso!' })
      setTimeout(() => navigate('/'), 1500)
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error)
      setMessage({ type: 'error', text: 'Erro ao atualizar categoria. Tente novamente.' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <p className="text-2xl text-purple-200">Carregando categoria...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">Editar Categoria</h1>
          <p className="text-xl text-purple-200">Atualize as informações da categoria</p>
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
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-purple-200 mb-2">
                Nome da Categoria *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Ex: Bebidas"
                className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            
            <div>
              <label htmlFor="size" className="block text-sm font-medium text-purple-200 mb-2">
                Tamanho *
              </label>
              <input
                type="text"
                id="size"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                required
                placeholder="Ex: 500ml, 1L, 2kg"
                className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            
            <div>
              <label htmlFor="packaging" className="block text-sm font-medium text-purple-200 mb-2">
                Embalagem *
              </label>
              <input
                type="text"
                id="packaging"
                value={formData.packaging}
                onChange={(e) => setFormData({ ...formData, packaging: e.target.value })}
                required
                placeholder="Ex: Garrafa, Lata, Caixa"
                className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            
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

export default EditCategory

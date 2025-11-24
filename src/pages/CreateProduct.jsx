import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { z } from "zod"

const ProductSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(80, "Nome deve ter no máximo 80 caracteres"),
  preco: z.string().min(1, "Campo obrigatório"),
  unidade: z.string().min(1, "Campo obrigatório"),
  quantidadeEstoque: z.string().min(1, "Campo obrigatório"),
  quantidadeMinima: z.string().min(1, "Campo obrigatório"),
  quantidadeMaxima: z.string().min(1, "Campo obrigatório"),
  categoriaId: z.string().min(1, "Selecione uma categoria")
})

function CreateProduct() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    nome: '',
    preco: '',
    unidade: 'UN',
    quantidadeEstoque: '',
    quantidadeMinima: '',
    quantidadeMaxima: '',
    categoriaId: ''
  })

  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [errors, setErrors] = useState({})

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACK_END_API}/api/categories`)
        if (!response.ok) {
          throw new Error('Erro ao buscar categorias')
        }
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error("Erro ao buscar categorias:", error)
        alert("Erro ao carregar categorias. Verifique se o backend está rodando.")
      } finally {
        setLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const result = ProductSchema.safeParse(formData)

    if (!result.success) {
      const formatted = {}
      result.error?.errors?.forEach(err => {
        formatted[err.path[0]] = err.message
      })
      setErrors(formatted)
      return
    }

    try {
      // Map form fields to backend DTO
      const productData = {
        name: result.data.nome,
        unitPrice: parseFloat(result.data.preco),
        unit: result.data.unidade,
        quantityInStock: parseInt(result.data.quantidadeEstoque),
        minQuantity: parseInt(result.data.quantidadeMinima),
        maxQuantity: parseInt(result.data.quantidadeMaxima),
        categoryId: parseInt(result.data.categoriaId)
      }

      const response = await fetch(`${import.meta.env.VITE_BACK_END_API}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      })

      if (!response.ok) {
        throw new Error('Erro ao criar produto')
      }

      const data = await response.json()
      console.log("Produto criado:", data)
      alert("Produto criado com sucesso!")
      navigate("/")
    } catch (error) {
      console.error("Erro ao criar produto:", error)
      alert("Erro ao criar produto. Tente novamente.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Criar Produto</h1>
          <p className="text-purple-200">Adicione um novo produto ao estoque</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
          {loadingCategories ? (
            <div className="text-center text-purple-200 py-8">
              <p>Carregando categorias...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center text-purple-200 py-8">
              <p className="mb-4">⚠️ Nenhuma categoria encontrada!</p>
              <p className="text-sm">Você precisa criar pelo menos uma categoria antes de adicionar produtos.</p>
              <button
                onClick={() => navigate('/criar-categoria')}
                className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Criar Categoria
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-purple-200 mb-2">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-slate-800 border rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.nome ? 'border-red-500' : 'border-white/20'}`}
                  placeholder="Ex: Notebook Dell"
                />
                {errors.nome && <p className="text-red-400 text-sm mt-1">{errors.nome}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="preco" className="block text-sm font-medium text-purple-200 mb-2">
                    Preço Unitário (R$) *
                  </label>
                  <input
                    type="number"
                    id="preco"
                    name="preco"
                    step="0.01"
                    min="0"
                    value={formData.preco}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-slate-800 border rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.preco ? 'border-red-500' : 'border-white/20'}`}
                    placeholder="0.00"
                  />
                  {errors.preco && <p className="text-red-400 text-sm mt-1">{errors.preco}</p>}
                </div>

                <div>
                  <label htmlFor="unidade" className="block text-sm font-medium text-purple-200 mb-2">
                    Unidade *
                  </label>
                  <select
                    id="unidade"
                    name="unidade"
                    value={formData.unidade}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-slate-800 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.unidade ? 'border-red-500' : 'border-white/20'}`}
                  >
                    <option value="UN">Unidade (UN)</option>
                    <option value="KG">Quilograma (KG)</option>
                    <option value="CX">Caixa (CX)</option>
                    <option value="LT">Litro (LT)</option>
                    <option value="MT">Metro (MT)</option>
                  </select>
                  {errors.unidade && <p className="text-red-400 text-sm mt-1">{errors.unidade}</p>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="quantidadeEstoque" className="block text-sm font-medium text-purple-200 mb-2">
                    Qtd. em Estoque *
                  </label>
                  <input
                    type="number"
                    id="quantidadeEstoque"
                    name="quantidadeEstoque"
                    min="0"
                    value={formData.quantidadeEstoque}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-slate-800 border rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.quantidadeEstoque ? 'border-red-500' : 'border-white/20'}`}
                    placeholder="0"
                  />
                  {errors.quantidadeEstoque && <p className="text-red-400 text-sm mt-1">{errors.quantidadeEstoque}</p>}
                </div>

                <div>
                  <label htmlFor="quantidadeMinima" className="block text-sm font-medium text-purple-200 mb-2">
                    Qtd. Mínima *
                  </label>
                  <input
                    type="number"
                    id="quantidadeMinima"
                    name="quantidadeMinima"
                    min="0"
                    value={formData.quantidadeMinima}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-slate-800 border rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.quantidadeMinima ? 'border-red-500' : 'border-white/20'}`}
                    placeholder="0"
                  />
                  {errors.quantidadeMinima && <p className="text-red-400 text-sm mt-1">{errors.quantidadeMinima}</p>}
                </div>

                <div>
                  <label htmlFor="quantidadeMaxima" className="block text-sm font-medium text-purple-200 mb-2">
                    Qtd. Máxima *
                  </label>
                  <input
                    type="number"
                    id="quantidadeMaxima"
                    name="quantidadeMaxima"
                    min="1"
                    value={formData.quantidadeMaxima}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-slate-800 border rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.quantidadeMaxima ? 'border-red-500' : 'border-white/20'}`}
                    placeholder="0"
                  />
                  {errors.quantidadeMaxima && <p className="text-red-400 text-sm mt-1">{errors.quantidadeMaxima}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="categoriaId" className="block text-sm font-medium text-purple-200 mb-2">
                  Categoria *
                </label>
                <select
                  id="categoriaId"
                  name="categoriaId"
                  value={formData.categoriaId}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-slate-800 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.categoriaId ? 'border-red-500' : 'border-white/20'}`}
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name} ({category.size} - {category.packaging})
                    </option>
                  ))}
                </select>
                {errors.categoriaId && <p className="text-red-400 text-sm mt-1">{errors.categoriaId}</p>}
              </div>

              <div className="pt-4 text-center">
                <button
                  type="submit"
                  className="w-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all transform hover:scale-105"
                >
                  Criar Produto
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreateProduct

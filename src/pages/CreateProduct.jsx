import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CreateProduct() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    quantidade: '',
    categoria: '',
    tamanho: '',
    embalagem: ''
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Limpar erro do campo quando o usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validação simples
    const newErrors = {}
    if (!formData.nome) newErrors.nome = 'Campo obrigatório'
    if (!formData.preco) newErrors.preco = 'Campo obrigatório'
    if (!formData.quantidade) newErrors.quantidade = 'Campo obrigatório'
    if (!formData.categoria) newErrors.categoria = 'Campo obrigatório'
    if (!formData.tamanho) newErrors.tamanho = 'Campo obrigatório'
    if (!formData.embalagem) newErrors.embalagem = 'Campo obrigatório'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    console.log("Produto criado:", formData)
    alert("Produto criado com sucesso!")
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Criar Produto</h1>
          <p className="text-purple-200">Adicione um novo produto ao estoque</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
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

            <div>
              <label htmlFor="descricao" className="block text-sm font-medium text-purple-200 mb-2">
                Descrição
              </label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Descreva o produto..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="preco" className="block text-sm font-medium text-purple-200 mb-2">
                  Preço (R$) *
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
                <label htmlFor="quantidade" className="block text-sm font-medium text-purple-200 mb-2">
                  Quantidade *
                </label>
                <input
                  type="number"
                  id="quantidade"
                  name="quantidade"
                  min="0"
                  value={formData.quantidade}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-slate-800 border rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.quantidade ? 'border-red-500' : 'border-white/20'}`}
                  placeholder="0"
                />
                {errors.quantidade && <p className="text-red-400 text-sm mt-1">{errors.quantidade}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="categoria" className="block text-sm font-medium text-purple-200 mb-2">
                Categoria *
              </label>
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-slate-800 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.categoria ? 'border-red-500' : 'border-white/20'}`}
              >
                <option value="">Selecione uma categoria</option>
                <option value="eletronicos">Eletrônicos</option>
                <option value="moveis">Móveis</option>
                <option value="alimentos">Alimentos</option>
                <option value="vestuario">Vestuário</option>
              </select>
              {errors.categoria && <p className="text-red-400 text-sm mt-1">{errors.categoria}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="tamanho" className="block text-sm font-medium text-purple-200 mb-2">
                  Tamanho *
                </label>
                <select
                  id="tamanho"
                  name="tamanho"
                  value={formData.tamanho}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-slate-800 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.tamanho ? 'border-red-500' : 'border-white/20'}`}
                >
                  <option value="">Selecione o tamanho</option>
                  <option value="pequeno">Pequeno</option>
                  <option value="medio">Médio</option>
                  <option value="grande">Grande</option>
                </select>
                {errors.tamanho && <p className="text-red-400 text-sm mt-1">{errors.tamanho}</p>}
              </div>

              <div>
                <label htmlFor="embalagem" className="block text-sm font-medium text-purple-200 mb-2">
                  Embalagem *
                </label>
                <select
                  id="embalagem"
                  name="embalagem"
                  value={formData.embalagem}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-slate-800 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.embalagem ? 'border-red-500' : 'border-white/20'}`}
                >
                  <option value="">Selecione a embalagem</option>
                  <option value="lata">Lata</option>
                  <option value="vidro">Vidro</option>
                  <option value="plastico">Plástico</option>
                </select>
                {errors.embalagem && <p className="text-red-400 text-sm mt-1">{errors.embalagem}</p>}
              </div>
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
        </div>
      </div>
    </div>
  )
}

export default CreateProduct

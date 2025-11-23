import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'

const productSchema = z.object({
  nome: z.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  descricao: z.string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .optional(),
  preco: z.string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Preço deve ser um número maior que zero'
    }),
  quantidade: z.string()
    .refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
      message: 'Quantidade deve ser um número inteiro não negativo'
    }),
  categoria: z.string()
    .min(1, 'Selecione uma categoria')
})

function CreateProduct() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    quantidade: '',
    categoria: ''
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const handleSubmit = (e) => {
  e.preventDefault()

  const result = productSchema.safeParse(formData)

  if (!result.success) {
    const formattedErrors = {}

    result.error.issues.forEach((err) => {
      formattedErrors[err.path[0]] = err.message
    })

    setErrors(formattedErrors)
    return
  }

  console.log("Produto criado:", result.data)
  alert("Produto criado com sucesso!")
  navigate("/")
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-purple-300 hover:text-purple-200 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar para Home
          </Link>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Criar Produto</h1>
              <p className="text-purple-200">Adicione um novo produto ao estoque</p>
            </div>
          </div>

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
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 transition-all ${
                  errors.nome 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-white/20 focus:ring-purple-500 focus:border-transparent'
                }`}
                placeholder="Ex: Notebook Dell"
              />
              {errors.nome && (
                <p className="mt-2 text-sm text-red-400 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.nome}
                </p>
              )}
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
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 transition-all resize-none ${
                  errors.descricao 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-white/20 focus:ring-purple-500 focus:border-transparent'
                }`}
                placeholder="Descreva o produto..."
              />
              {errors.descricao && (
                <p className="mt-2 text-sm text-red-400 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.descricao}
                </p>
              )}
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
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 transition-all ${
                    errors.preco 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-white/20 focus:ring-purple-500 focus:border-transparent'
                  }`}
                  placeholder="0.00"
                />
                {errors.preco && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.preco}
                  </p>
                )}
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
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 transition-all ${
                    errors.quantidade 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-white/20 focus:ring-purple-500 focus:border-transparent'
                  }`}
                  placeholder="0"
                />
                {errors.quantidade && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.quantidade}
                  </p>
                )}
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
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white focus:outline-none focus:ring-2 transition-all ${
                  errors.categoria 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-white/20 focus:ring-purple-500 focus:border-transparent'
                }`}
              >
                <option value="" className="bg-slate-800">Selecione uma categoria</option>
                <option value="eletronicos" className="bg-slate-800">Eletrônicos</option>
                <option value="moveis" className="bg-slate-800">Móveis</option>
                <option value="alimentos" className="bg-slate-800">Alimentos</option>
                <option value="vestuario" className="bg-slate-800">Vestuário</option>
              </select>
              {errors.categoria && (
                <p className="mt-2 text-sm text-red-400 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.categoria}
                </p>
              )}
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-300 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-200">
                  <p className="font-medium mb-1">Validação com Zod</p>
                  <p>Este formulário usa Zod para validação. Tente enviar sem preencher os campos para ver os erros!</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all transform hover:scale-105"
              >
                Criar Produto
              </button>
              <Link
                to="/"
                className="flex-1 bg-white/10 text-white font-semibold py-3 px-6 rounded-xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all text-center"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateProduct

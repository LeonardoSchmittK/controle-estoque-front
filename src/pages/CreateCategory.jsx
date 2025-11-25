import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { z } from "zod"
import toast from "react-hot-toast";

const CategorySchema = z.object({
  nome: z.string().min(1, "Campo obrigatório"),
  tamanho: z.enum(["pequeno", "medio", "grande"], {
    errorMap: () => ({ message: "Campo obrigatório" })
  }),
  embalagem: z.enum(["lata", "vidro", "plastico"], {
    errorMap: () => ({ message: "Campo obrigatório" })
  })
})

function CreateCategory() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    nome: '',
    tamanho: '',
    embalagem: ''
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const result = CategorySchema.safeParse(formData)

    if (!result.success) {
      const formattedErrors = {}
      result.error.errors.forEach(err => {
        formattedErrors[err.path[0]] = err.message
      })
      setErrors(formattedErrors)
      return
    }

    try {
      
      const categoryData = {
        id: Math.floor(Math.random() * 1000000), 
        name: result.data.nome,
        size: result.data.tamanho,
        packaging: result.data.embalagem
      }

      const response = await fetch(`${import.meta.env.VITE_BACK_END_API}/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Erro ao criar categoria')
      }

      const data = await response.json()
      console.log("Categoria criada:", data)
      toast.success("Categoria criada com sucesso!")
      navigate("/")
    } catch (error) {
      console.error("Erro ao criar categoria:", error)
      toast.error("Erro ao criar categoria. Tente novamente.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Criar Categoria</h1>
          <p className="text-purple-200">Adicione uma nova categoria ao sistema</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-purple-200 mb-2">
                Nome da Categoria *
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-slate-800 border rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.nome ? 'border-red-500' : 'border-white/20'}`}
                placeholder="Ex: Eletrônicos"
              />
              {errors.nome && <p className="text-red-400 text-sm mt-1">{errors.nome}</p>}
            </div>

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
                <option value="">Selecione um tamanho</option>
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
                <option value="">Selecione uma embalagem</option>
                <option value="lata">Lata</option>
                <option value="vidro">Vidro</option>
                <option value="plastico">Plástico</option>
              </select>
              {errors.embalagem && <p className="text-red-400 text-sm mt-1">{errors.embalagem}</p>}
            </div>

            <div className="pt-4 text-center">
              <button
                type="submit"
                className="w-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all transform hover:scale-105"
              >
                Criar Categoria
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateCategory

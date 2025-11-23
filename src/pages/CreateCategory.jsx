import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function CreateCategory() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nome: '',
    descricao: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Integrar com API backend
    console.log('Categoria criada:', formData)
    alert('Categoria criada com sucesso!')
    navigate('/')
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
        <h2 className="text-2xl font-bold text-white mb-4">Adicionar formulário de categoria</h2>

       </div>
    </div>
  )
}

export default CreateCategory

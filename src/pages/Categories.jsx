import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ConfirmModal from '../components/ConfirmModal'
import { FiTrash } from 'react-icons/fi';
import { FiEdit } from 'react-icons/fi';
import { FiSearch } from 'react-icons/fi';
import { FiPlus } from 'react-icons/fi';

function Categories() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
    name: '',
    relatedProducts: 0
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [categoriesRes, productsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_BACK_END_API}/api/categories`),
        fetch(`${import.meta.env.VITE_BACK_END_API}/api/products`)
      ])

      if (!categoriesRes.ok || !productsRes.ok) {
        throw new Error('Erro ao buscar dados')
      }

      const categoriesData = await categoriesRes.json()
      const productsData = await productsRes.json()

      setCategories(categoriesData)
      setProducts(productsData)
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (category) => {
    const relatedProducts = products.filter(p => p.categoryId === category.id).length
    setDeleteModal({
      isOpen: true,
      id: category.id,
      name: category.name,
      relatedProducts
    })
  }

  const confirmDelete = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_END_API}/api/categories/${deleteModal.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir categoria')
      }

      
      fetchData()
      setDeleteModal({ isOpen: false, id: null, name: '', relatedProducts: 0 })
    } catch (error) {
      console.error("Erro ao excluir categoria:", error)
      alert('Erro ao excluir categoria. Tente novamente.')
    }
  }

  const getProductCount = (categoryId) => {
    return products.filter(p => p.categoryId === categoryId).length
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.packaging.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">
            Gerenciar Categorias
          </h1>
          <p className="text-xl text-purple-200 mb-6">
            Edite ou exclua categorias existentes
          </p>
          <button
            onClick={() => navigate('/criar-categoria')}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 px-8 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-green-500/25 flex items-center gap-2 mx-auto"
          >
            <FiPlus /> Nova Categoria
          </button>
        </div>

        
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl mb-6">
          <label htmlFor="search" className="block text-sm font-medium text-purple-200 mb-2">
            <FiSearch /> Pesquisar Categoria
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por nome, tamanho ou embalagem..."
            className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <div className="mt-4 text-purple-200 text-sm">
            Mostrando {filteredCategories.length} de {categories.length} categorias
          </div>
        </div>

        
        {loading ? (
          <div className="text-center text-purple-200 py-16">
            <p className="text-2xl">Carregando categorias...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 shadow-2xl text-center">
            <p className="text-2xl text-purple-200 mb-4">
              {categories.length === 0 ? '📦 Nenhuma categoria cadastrada' : '🔍 Nenhuma categoria encontrada'}
            </p>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">
                      Nome
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">
                      Tamanho
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">
                      Embalagem
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-purple-200">
                      Produtos
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-purple-200">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredCategories.map(category => (
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
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-semibold">
                          {getProductCount(category.id)} produto(s)
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => navigate(`/editar-categoria/${category.id}`)}
                            className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-all text-sm font-medium"
                            title="Editar categoria"
                          >
                            <FiEdit /> Editar
                          </button>
                          <button
                            onClick={() => handleDelete(category)}
                            className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all text-sm font-medium"
                            title="Excluir categoria"
                          >
                            <FiTrash /> Excluir
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
      </div>

      
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null, name: '', relatedProducts: 0 })}
        onConfirm={confirmDelete}
        title="Excluir Categoria?"
        message={
          deleteModal.relatedProducts > 0
            ? `Tem certeza que deseja excluir a categoria "${deleteModal.name}"?\n\n⚠️ ATENÇÃO: Esta ação irá excluir:\n• ${deleteModal.relatedProducts} produto(s) relacionado(s)\n• Todas as movimentações desses produtos\n\nEsta ação não pode ser desfeita!`
            : `Tem certeza que deseja excluir a categoria "${deleteModal.name}"?\n\nEsta ação não pode ser desfeita!`
        }
        type="danger"
        confirmText="Sim, Excluir"
        cancelText="Cancelar"
      />
    </div>
  )
}

export default Categories

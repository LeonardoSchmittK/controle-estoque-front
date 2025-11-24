function ConfirmModal({ isOpen, onClose, onConfirm, title, message, type = 'danger', confirmText = 'Confirmar', cancelText = 'Cancelar' }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl border border-white/20 shadow-2xl max-w-md w-full p-6 animate-fadeIn">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
            type === 'danger' ? 'bg-red-500/20' : 'bg-yellow-500/20'
          }`}>
            <span className="text-2xl">
              {type === 'danger' ? '⚠️' : '❗'}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-purple-200 whitespace-pre-line">{message}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-3 font-semibold rounded-xl transition-all ${
              type === 'danger'
                ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
                : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
            } text-white`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal

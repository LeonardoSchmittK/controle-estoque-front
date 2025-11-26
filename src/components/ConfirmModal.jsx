import { FiAlertTriangle } from "react-icons/fi";

function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "danger",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-500 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200 animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center">
            <span className="text-2xl"><FiAlertTriangle color="yellow"/></span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-white whitespace-pre-line leading-relaxed">{message}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8">
          
          {/* Cancelar */}
          <button
            onClick={onClose}
            className="flex-1 px-5 py-3 text-white font-semibold rounded-xl transition-all duration-200"
          >
            {cancelText}
          </button>

          {/* Confirmar - CINZA elegante */}
          <button
            onClick={onConfirm}
            className="flex-1 px-5 py-3 bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded-xl transition-all duration-200 shadow-md"
          >
            {confirmText}
          </button>

        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;

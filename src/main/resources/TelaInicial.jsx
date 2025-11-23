import React from "react";

const Telainicial = () => {
  return (
    <div className="flex flex-col gap-5 min-h-screen p-6 bg-gradient-to-b from-[#1a1f35] to-[#2d3561]">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-1">
        <h1 className="text-white font-bold text-3xl">Controle de Estoque</h1>
        <p className="text-[#B8C5D6] text-sm">
          Gerencie seus produtos de forma eficiente
        </p>
      </div>

      {/* Barra de Ferramentas */}
      <div className="flex items-center gap-4 bg-white/8 rounded-lg p-4">
        <label className="text-white text-sm">Relatório:</label>
        <select className="bg-[#3d4a6b] text-white rounded px-2 py-1 w-36">
          <option>Todos os produtos</option>
        </select>
        <p className="text-[#4A90E2] font-bold text-sm">Todos os produtos</p>

        {/* Spacer */}
        <div className="flex-1"></div>

        <input
          type="text"
          placeholder="Pesquisar produtos..."
          className="bg-[#3d4a6b] text-white placeholder-gray-400 rounded px-2 py-1 w-52 text-sm"
        />
        <button className="bg-gradient-to-b from-[#5a9fd4] to-[#4A90E2] text-white font-bold px-3 py-1 rounded shadow">
          Buscar
        </button>
      </div>

      {/* Tabela de Produtos + Painel de Ações */}
      <div className="flex gap-4 flex-1">
        {/* Tabela */}
        <table className="min-w-full bg-white/8 rounded-lg border border-white/10 text-white text-sm flex-1">
          <thead className="bg-[#3d4a6b] font-bold">
            <tr>
              <th className="px-4 py-2">Nome</th>
              <th className="px-4 py-2">Preço Unitário</th>
              <th className="px-4 py-2">Embalagem</th>
              <th className="px-4 py-2">Qtd. Estoque</th>
              <th className="px-4 py-2">Min. Estoque</th>
              <th className="px-4 py-2">Max. Estoque</th>
              <th className="px-4 py-2">Tamanho</th>
            </tr>
          </thead>
          <tbody>
            {/* Aqui você colocaria as linhas de produtos dinamicamente */}
          </tbody>
        </table>

        {/* Painel de Ações */}
        <div className="flex flex-col items-center gap-4 bg-white/8 rounded-lg p-5 w-40">
          <h2 className="text-white font-bold text-lg">Ações</h2>
          <button className="bg-gradient-to-b from-[#5fd68a] to-[#50C878] text-white font-bold rounded px-3 py-2 w-full shadow">
            ➕ Adicionar
          </button>
          <button className="bg-gradient-to-b from-[#ff6b6b] to-[#E74C3C] text-white font-bold rounded px-3 py-2 w-full shadow">
            🗑️ Remover
          </button>
          <button className="bg-gradient-to-b from-[#ffa94d] to-[#FF8C42] text-white font-bold rounded px-3 py-2 w-full shadow">
            ✏️ Editar
          </button>

          <div className="flex-1"></div>

          <p className="text-[#B8C5D6] text-xs">Total de Produtos:</p>
          <p className="text-[#4A90E2] font-bold text-2xl">0</p>
        </div>
      </div>
    </div>
  );
};

export default Telainicial;
# Controle de Estoque - Frontend

Projeto React com Vite e Zustand para gerenciamento de estoque.

## 🚀 Tecnologias

- **React 18.3** - Biblioteca para construção de interfaces
- **Vite 6.0** - Build tool e dev server ultra-rápido
- **Zustand 5.0** - Gerenciamento de estado simples e eficiente

## 📦 Instalação

```bash
npm install
```

## 🏃 Executar o Projeto

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

## 🏗️ Build para Produção

```bash
npm run build
```

## 📁 Estrutura do Projeto

```
controle-estoque-front/
├── src/
│   ├── store/           # Stores do Zustand
│   │   └── counterStore.js
│   ├── App.jsx          # Componente principal
│   ├── App.css          # Estilos do App
│   ├── index.css        # Estilos globais
│   └── main.jsx         # Entry point
├── index.html           # HTML base
├── vite.config.js       # Configuração do Vite
└── package.json         # Dependências
```

## 🐻 Usando Zustand

O projeto inclui um exemplo de store com Zustand em `src/store/counterStore.js`:

```javascript
import { create } from 'zustand'

export const useCounterStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}))
```

Para usar em componentes:

```javascript
import { useCounterStore } from './store/counterStore'

function MyComponent() {
  const { count, increment } = useCounterStore()
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
    </div>
  )
}
```

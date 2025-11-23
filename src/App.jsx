import { useState } from 'react'
import { useCounterStore } from './store/counterStore'
import './App.css'

function App() {
  const { count, increment, decrement, reset } = useCounterStore()

  return (
    <div className="App">
      <div className="card">
        <h1 className="bg-red-500 text-white p-2 font-bold">Hello, World!</h1>
      </div>
    </div>
  )
}

export default App

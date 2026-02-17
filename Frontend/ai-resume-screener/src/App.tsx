import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center">
      <h1 className='flex flex-col text-black p-2 text-5xl'>AI-Based Resume Screener</h1>
      <p className='flex flex-col text-white p-2'>Count: {count}</p>
      <button className=" text-white px-5 py-2 bg-blue-600 
          hover:bg-blue-700 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50
          transition-all duration-105 rounded-md"
          onClick={() => setCount(count + 1)}>
        Increment
      </button>

    </div>
  )
}

export default App

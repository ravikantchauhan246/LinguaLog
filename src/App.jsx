import { useState } from 'react'
import reactLogo from './assets/react.svg'
import HomePage from './component/HomePage/HomePage'
import Header from './component/Header'



function App() {
  const [count, setCount] = useState(0)

  return (
   <div className='flex flex-col max-w-[1000px] mx-auto w-full '>
    <section className='min-h-screen flex flex-col'>
      <Header/>
      <HomePage/>
    </section>
    <footer>

    </footer>
   </div>
  )
}

export default App

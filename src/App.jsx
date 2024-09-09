import { useState } from 'react'
import reactLogo from './assets/react.svg'
import HomePage from './component/HomePage/HomePage'
import Header from './component/Header'
import FileDisplay from './component/FileDisplay'



function App() {
  const [file,setFile] = useState(null)
  const [audioStream,setAudioStream] = useState(null)


  const isAudioAvailable = file || audioStream

  function handleAudioReset(){
    setFile(null)
    setAudioStream(null)
  }

  return (
   <div className='flex flex-col max-w-[1000px] mx-auto w-full '>
    <section className='min-h-screen flex flex-col'>
      <Header/>
      {isAudioAvailable ? (
        <FileDisplay handleAudioReset={handleAudioReset}  file = {file}  audioStream = {audioStream}/>
      ):(<HomePage setFile={setFile} setAudioStream={setAudioStream}/>)}
    </section>
    <footer>

    </footer>
   </div>
  )
}

export default App

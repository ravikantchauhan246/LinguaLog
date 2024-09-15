import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import HomePage from './component/HomePage/HomePage'
import Header from './component/Header'
import FileDisplay from './component/FileDisplay'
import Infomation from './component/Infomation'
import Transcribing from './component/Transcribing'



function App() {
  const [file,setFile] = useState(null)
  const [audioStream,setAudioStream] = useState(null)
  const [output,setOutput] = useState(true)
  const [loading,setLoading] = useState(true)


  const isAudioAvailable = file || audioStream

  function handleAudioReset(){
    setFile(null)
    setAudioStream(null)
  }
  useEffect(()=>{
    console.log(audioStream)

  })

  return (
   <div className='flex flex-col max-w-[1000px] mx-auto w-full '>
    <section className='min-h-screen flex flex-col'>
      <Header/>
      {output ?(
        <Infomation/>
      ): loading ?(
        <Transcribing/>
      ):isAudioAvailable?(
        <FileDisplay handleAudioReset={handleAudioReset}  file = {file}  audioStream = {audioStream}/>
      ):(
        (<HomePage setFile={setFile} setAudioStream={setAudioStream}/>)
      )}
    </section>
    <footer>

    </footer>
   </div>
  )
}

export default App

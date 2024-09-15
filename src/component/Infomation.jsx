import React, { useState } from 'react'

const Infomation = () => {
    const [tab,setTab] = useState('transcription')
    
  return (
    <main className="flex-1 p-4 flex flex-col gap-3 sm:gap-3 md:gap-5  justify-center text-center pb-20 max-w-prose w-full mx-auto">
    <h1 className="font-semibold text-3xl sm:text-4xl md:text-5xl  ">
      Your <span className="text-blue-400 bold font-semibold">Transcription</span>
    </h1>
    <div className='flex mx-auto bg-white border-2 border-solid  border-blue-300 shadow rounded-full overflow-hidden items-center gap-2'>
        <button className='px-4 py-1 font-medium'>Transcription</button>
        <button className='px-4 py-1 font-medium'>Translation</button>
    </div>
    </main>
  )
}

export default Infomation
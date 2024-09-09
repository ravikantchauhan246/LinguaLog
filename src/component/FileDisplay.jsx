import React from "react";

const FileDisplay = ({ handleAudioReset, file, audioStream }) => {
  return (
    <main className="flex-1 p-4 flex gap-3 sm:gap-3 md:gap-5 flex-col justify-center text-center w-fit max-w-full mx-auto">
      <h1 className="font-semibold text-5xl sm:text-6xl md:text-7xl">
        Your <span className="text-blue-400 bold font-semibold">File</span>
      </h1>
      <div className="mx-auto flex flex-col text-left ">
        <h3 className="font-semibold">Name:</h3>
        <p>{file.name}</p>
      </div>
      <div className="flex items-center justify-between gap-4">
        <button onClick={handleAudioReset} className="text-slate-400 hover:text-blue-400 duration:200">
          Reset
        </button>
        <button className="specialBtn px-4 py-2 rounded-lg text-blue-400 flex items-center gap-2">
        
          <p>Transcribe</p>
          <i className="fa-solid fa-pen"></i>
        </button>
      </div>
    </main>
  );
};

export default FileDisplay;

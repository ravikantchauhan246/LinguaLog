import React from "react";
import "./HomePage.css";

const HomePage = ({ setFile, setAudioStream }) => {
  const text = "Your Voice, Transcribed and Translated Effortlessly";

  return (
    <main className="flex-1 p-4 flex gap-3 sm:gap-3 md:gap-5 flex-col justify-center text-center">
      <h1 className="font-semibold text-5xl sm:text-6xl md:text-7xl">
        Lingua<span className="text-blue-400 bold font-semibold">Log</span>
      </h1>
      <h3 className="font-medium md:text-lg">
        Log <span className="text-blue-400 arrow-animation">&rarr;</span>{" "}
        Transcribe <span className="text-blue-400 arrow-animation">&rarr;</span>{" "}
        Translate
      </h3>
      <button className="flex items-center text-base justify-between gap-4 mx-auto w-72 max-w-full my-4 specialBtn px-4 py-2 rounded-xl">
        <p className="text-blue-400">Record</p>
        <i className="fa-solid fa-microphone"></i>
      </button>
      <p className="text-base">
        Or{" "}
        <label className="text-blue-400 cursor-pointer hover:text-blue-600 duration-2000 p-1">
          upload <input onChange={(e)=>{
            const tempFile = e.target.files[0]
            setFile(tempFile)
          }}type="file" className="hidden" accept=".mp3,.wave" />
        </label>{" "}
        a mp3 file
      </p>
      <p className="glow-text text-sm break-words">
        {text.split("").map((char, index) => (
          <span key={index}>{char}</span>
        ))}
      </p>
    </main>
  );
};

export default HomePage;

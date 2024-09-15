import React, { useState } from "react";
import Transcription from "./Transcription";
import Translation from "./Translation";

const Infomation = () => {
  const [tab, setTab] = useState("transcription");

  return (
    <main className="flex-1 p-4 flex flex-col gap-3 sm:gap-3 md:gap-5  justify-center text-center pb-20 max-w-prose w-full mx-auto">
      <h1 className="font-semibold text-3xl sm:text-4xl md:text-5xl  ">
        Your{" "}
        <span className="text-blue-400 bold font-semibold">Transcription</span>
      </h1>
      <div className="grid grid-cols-2 mx-auto bg-white shadow rounded-full overflow-hidden items-center ">
        <button
          onClick={() => {
            setTab("transcription");
          }}
          className={
            "px-4 py-1 font-medium duration-100 " +
            (tab === "transcription"
              ? "bg-blue-400 text-white"
              : "text-blue-400 hover:text-blue-500")
          }
        >
          Transcription
        </button>
        <button
          onClick={() => {
            setTab("translation");
          }}
          className={
            "px-4 py-1 font-medium duration-100 " +
            (tab === "translation"
              ? "bg-blue-400 text-white"
              : "text-blue-400 hover:text-blue-500")
          }
        >
          Translation
        </button>
      </div>
      {tab === "transcription" ? (
        <Transcription/>
      ):(<Translation/>)}
    </main>
  );
};

export default Infomation;

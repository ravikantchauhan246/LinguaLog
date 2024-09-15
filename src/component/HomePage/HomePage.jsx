import React, { useEffect, useRef, useState } from "react";
import "./HomePage.css";



const HomePage = ({ setFile, setAudioStream }) => {
    const [recordingStatus, setRecordingStatus] = useState('inactive')
    const [audioChunks, setAudioChunks] = useState([])
    const [duration, setDuration] = useState(0)

    const mediaRecorder = useRef(null)

    const mimeType = 'audio/webm'

    async function startRecording() {
        let tempStream;
        console.log('Start recording');

        try {
            const streamData = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                },
                video: false
            });
            tempStream = streamData;
        } catch (err) {
            console.error('Error accessing microphone:', err.message);
            return;
        }

        setRecordingStatus('recording');

        // Create new MediaRecorder instance using the stream
        const media = new MediaRecorder(tempStream, { mimeType });
        mediaRecorder.current = media;

        mediaRecorder.current.start();
        let localAudioChunks = [];
        mediaRecorder.current.ondataavailable = (event) => {
            if (typeof event.data === 'undefined') { return; }
            if (event.data.size === 0) { return; }
            localAudioChunks.push(event.data);
        };
        setAudioChunks(localAudioChunks);
    }

    async function stopRecording() {
        setRecordingStatus('inactive')
        console.log('Stop recording')

        mediaRecorder.current.stop()
        mediaRecorder.current.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: mimeType })
            setAudioStream(audioBlob)
            setAudioChunks([])
            setDuration(0)
        }
    }

    useEffect(() => {
        if (recordingStatus === 'inactive') { return }

        const interval = setInterval(() => {
            setDuration(curr => curr + 1)
        }, 1000)

        return () => clearInterval(interval)
    })

  const text = "Your Voice, Transcribed and Translated Effortlessly";


  return (
    <main className="flex-1 p-4 flex gap-3 sm:gap-3  flex-col justify-center text-center">
      <h1 className="font-semibold text-5xl sm:text-6xl md:text-7xl">
        Lingua<span className="text-blue-400 bold font-semibold">Log</span>
      </h1>
      <h3 className="font-medium md:text-lg">
        Log <span className="text-blue-400 arrow-animation">&rarr;</span>{" "}
        Transcribe <span className="text-blue-400 arrow-animation">&rarr;</span>{" "}
        Translate
      </h3>
      <button
        onClick={recordingStatus === 'inactive' ? startRecording : stopRecording}
        className="flex items-center text-base justify-between gap-4 mx-auto w-72 max-w-full my-4 specialBtn px-4 py-2 rounded-xl"
      >
        <p className="text-blue-400">
          {recordingStatus === 'inactive' ? 'Record' : 'Stop recording'}
        </p>
        <div className="flex items-center gap-2">
          {duration !== 0 && <p className="text-sm">{duration}s</p>}
        </div>
        <i
          className={
            "fa-solid duration-200 fa-microphone" +
            (recordingStatus === 'recording' ? ' text-rose-400' : '')
          }
        ></i>
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

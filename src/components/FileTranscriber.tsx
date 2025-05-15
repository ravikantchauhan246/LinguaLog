import { useState } from 'react';
import axios from 'axios';

interface FileTranscriberProps {
  apiKey: string;
}

const FileTranscriber = ({ apiKey }: FileTranscriberProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setTranscript('');
      setError(null);
    }
  };

  const transcribeFile = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setIsTranscribing(true);
    setError(null);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await axios.post('https://api.assemblyai.com/v2/upload', file, {
        headers: {
          'authorization': apiKey,
          'content-type': 'audio/*'
        }
      });

      const audioUrl = uploadResponse.data.upload_url;
      setProgress(30);

      const transcriptResponse = await axios.post(
        'https://api.assemblyai.com/v2/transcript',
        {
          audio_url: audioUrl,
          speech_model: 'universal'
        },
        {
          headers: {
            'authorization': apiKey,
            'content-type': 'application/json'
          }
        }
      );

      const transcriptId = transcriptResponse.data.id;
      setProgress(60);

      while (true) {
        const pollingResponse = await axios.get(
          `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
          {
            headers: {
              'authorization': apiKey
            }
          }
        );

        const transcriptionResult = pollingResponse.data;

        if (transcriptionResult.status === 'completed') {
          setTranscript(transcriptionResult.text);
          setProgress(100);
          break;
        } else if (transcriptionResult.status === 'error') {
          throw new Error(`Transcription failed: ${transcriptionResult.error}`);
        }

        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during transcription');
    } finally {
      setIsTranscribing(false);
    }
  };

  const downloadTranscript = () => {
    const element = document.createElement('a');
    const file = new Blob([transcript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'file_transcript.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="file-transcriber">
      <h2 className="section-title">File Transcription</h2>
      
      <div className="file-upload-section">
        <label className="file-upload-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{marginRight: 8}}>
            <path d="M12 15V3m0 0L8 7m4-4l4 4M22 15v1c0 3-2 5-5 5H7c-3 0-5-2-5-5v-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Select Audio File
          <input
            type="file"
            accept="audio/*,video/*"
            onChange={handleFileChange}
            disabled={isTranscribing}
            className="file-input"
          />
        </label>
        
        {file && (
          <div className="file-info">
            <div className="file-name" title={file.name}>
              {file.name.length > 25 ? file.name.substring(0, 22) + '...' : file.name}
            </div>
          </div>
        )}
      </div>

      {file && !isTranscribing && !transcript && (
        <button
          onClick={transcribeFile}
          disabled={isTranscribing}
          className="transcribe-button"
        >
          Transcribe
        </button>
      )}

      {isTranscribing && (
        <div className="progress-section">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="progress-text">{progress}%</span>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
      
      {transcript && (
        <div className="transcript-section">
          <h3 className="transcript-title">Transcript</h3>
          <div className="transcript-content">
            <p>{transcript}</p>
          </div>
          <button className="download-button" onClick={downloadTranscript}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{marginRight: 8}}>
              <path d="M12 15V3m0 12l-4-4m4 4l4-4M22 15v1c0 3-2 5-5 5H7c-3 0-5-2-5-5v-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Download Transcript
          </button>
        </div>
      )}

      <style>{`
        .file-transcriber {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          padding: 1rem;
        }

        .section-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 2rem;
          text-align: center;
          font-family: 'Montserrat', sans-serif;
        }

        .file-upload-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .file-upload-button {
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #6d5dfc 0%, #46caff 100%);
          color: white;
          border: none;
          border-radius: 50px;
          padding: 1rem 2rem;
          font-size: 1.1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 15px rgba(109, 93, 252, 0.2);
          width: 100%;
          max-width: 300px;
          min-width: 200px;
          white-space: nowrap;
        }

        .file-upload-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(109, 93, 252, 0.3);
        }

        .file-upload-button:active {
          transform: translateY(0);
          box-shadow: 0 2px 10px rgba(109, 93, 252, 0.2);
        }

        .file-input {
          display: none;
        }

        .file-info {
          background: #f8f9fa;
          border-radius: 10px;
          padding: 1rem 1.5rem;
          width: 100%;
          max-width: 300px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(109, 93, 252, 0.1);
        }

        .file-name {
          font-size: 1rem;
          font-weight: 500;
          color: #46caff;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .transcribe-button {
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #6d5dfc 0%, #46caff 100%);
          color: white;
          border: none;
          border-radius: 50px;
          padding: 1rem 2rem;
          font-size: 1.1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 15px rgba(109, 93, 252, 0.2);
          width: 100%;
          max-width: 300px;
          min-width: 200px;
          margin: 0 auto;
          white-space: nowrap;
        }

        .transcribe-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(109, 93, 252, 0.3);
        }

        .transcribe-button:active {
          transform: translateY(0);
          box-shadow: 0 2px 10px rgba(109, 93, 252, 0.2);
        }

        .transcribe-button:disabled {
          background: #e1e1e1;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
          opacity: 0.7;
        }

        .progress-section {
          width: 100%;
          max-width: 300px;
          margin: 2rem auto;
        }

        .progress-bar {
          width: 100%;
          height: 10px;
          background: #f0f0f0;
          border-radius: 5px;
          overflow: hidden;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #6d5dfc, #46caff);
          border-radius: 5px;
          transition: width 0.3s ease;
        }

        .progress-text {
          display: block;
          font-size: 0.9rem;
          font-weight: 500;
          color: #6d5dfc;
          text-align: right;
          margin-top: 0.5rem;
        }

        .error-message {
          background: rgba(220, 53, 69, 0.1);
          color: #dc3545;
          padding: 1rem;
          border-radius: 10px;
          font-size: 0.95rem;
          text-align: center;
          margin: 1rem auto;
          max-width: 300px;
        }

        .transcript-section {
          background: white;
          border-radius: 15px;
          padding: 2rem;
          margin-top: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .transcript-title {
          font-size: 1.4rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 1.5rem;
          text-align: center;
          font-family: 'Montserrat', sans-serif;
        }

        .transcript-content {
          background: #f8f9fa;
          border-radius: 10px;
          padding: 1.5rem;
          max-height: 400px;
          overflow-y: auto;
          font-size: 1.1rem;
          line-height: 1.6;
          color: #000;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(109, 93, 252, 0.1);
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .transcript-content::-webkit-scrollbar {
          width: 8px;
        }

        .transcript-content::-webkit-scrollbar-track {
          background: #f0f0f0;
          border-radius: 4px;
        }

        .transcript-content::-webkit-scrollbar-thumb {
          background: #6d5dfc;
          border-radius: 4px;
        }

        .download-button {
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #6d5dfc 0%, #46caff 100%);
          color: white;
          border: none;
          border-radius: 50px;
          padding: 1rem 2rem;
          font-size: 1.1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 15px rgba(109, 93, 252, 0.2);
          width: 100%;
          max-width: 300px;
          min-width: 200px;
          margin: 0 auto;
          white-space: nowrap;
        }

        .download-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(109, 93, 252, 0.3);
        }

        .download-button:active {
          transform: translateY(0);
          box-shadow: 0 2px 10px rgba(109, 93, 252, 0.2);
        }

        @media (max-width: 768px) {
          .file-transcriber {
            padding: 0.5rem;
          }

          .section-title {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
          }

          .transcript-section {
            padding: 1.5rem;
          }

          .transcript-content {
            max-height: 300px;
            font-size: 1rem;
          }

          .file-upload-button,
          .transcribe-button,
          .download-button {
            padding: 0.9rem 1.8rem;
            font-size: 1rem;
            min-width: 180px;
          }
        }

        @media (max-width: 480px) {
          .file-transcriber {
            padding: 0.5rem;
          }

          .section-title {
            font-size: 1.3rem;
            margin-bottom: 1rem;
          }

          .file-upload-button,
          .transcribe-button,
          .download-button {
            padding: 0.8rem 1.5rem;
            font-size: 0.95rem;
            min-width: 160px;
            max-width: 250px;
          }

          .transcript-section {
            padding: 1rem;
          }

          .transcript-content {
            padding: 1rem;
            max-height: 250px;
          }
        }
      `}</style>
    </div>
  );
};

export default FileTranscriber;
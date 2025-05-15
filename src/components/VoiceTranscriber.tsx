import { useState, useEffect } from 'react';

interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
  resultIndex: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: Event) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface VoiceTranscriberProps {
  apiKey: string;
}

const languages = [
  { code: 'en-US', name: 'English (US)' },
  { code: 'en-GB', name: 'English (UK)' },
  { code: 'es-ES', name: 'Spanish' },
  { code: 'fr-FR', name: 'French' },
  { code: 'de-DE', name: 'German' },
  { code: 'it-IT', name: 'Italian' },
  { code: 'pt-BR', name: 'Portuguese' },
  { code: 'hi-IN', name: 'Hindi' },
  { code: 'ja-JP', name: 'Japanese' },
  { code: 'ko-KR', name: 'Korean' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
];

const VoiceTranscriber = ({ apiKey: _ }: VoiceTranscriberProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in your browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = selectedLanguage;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      setTranscript(transcript);
    };

    recognition.onerror = (event: Event) => {
      setError('Error occurred in recognition: ' + (event as any).error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    if (isListening) {
      recognition.start();
    }

    return () => {
      recognition.stop();
    };
  }, [isListening, selectedLanguage]);

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(event.target.value);
    if (isListening) {
      setIsListening(false);
    }
  };

  const downloadTranscript = () => {
    const element = document.createElement('a');
    const file = new Blob([transcript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'voice_transcript.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  return (
    <div className="voice-transcriber">
      <h2 className="section-title">Voice Transcription</h2>
      
      <div className="language-selector">
        <label htmlFor="language">Select Language:</label>
        <select
          id="language"
          value={selectedLanguage}
          onChange={handleLanguageChange}
          disabled={isListening}
          className="language-dropdown"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="controls">
        <button 
          onClick={toggleListening}
          className={`listen-button ${isListening ? 'listening' : ''}`}
        >
          {isListening ? 'Stop Listening' : 'Start Listening'}
        </button>
      </div>
      
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
        .voice-transcriber {
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

        .language-selector {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 2rem;
        }

        .language-selector label {
          font-size: 1.1rem;
          font-weight: 500;
          color: #555;
          margin-bottom: 0.8rem;
        }

        .language-dropdown {
          padding: 1rem 1.5rem;
          border-radius: 10px;
          border: 2px solid rgba(109, 93, 252, 0.2);
          font-size: 1.1rem;
          background: white;
          color: #333;
          font-family: 'Roboto', Arial, sans-serif;
          outline: none;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          width: 100%;
          max-width: 300px;
          cursor: pointer;
        }

        .language-dropdown:focus {
          border-color: #6d5dfc;
          box-shadow: 0 2px 12px rgba(109, 93, 252, 0.2);
        }

        .controls {
          display: flex;
          justify-content: center;
          margin: 2rem 0;
        }

        .listen-button {
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

        .listen-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(109, 93, 252, 0.3);
        }

        .listen-button:active {
          transform: translateY(0);
          box-shadow: 0 2px 10px rgba(109, 93, 252, 0.2);
        }

        .listen-button.listening {
          background: linear-gradient(90deg, #fc5d5d 0%, #ff4646 100%);
          animation: pulse 1.5s infinite;
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

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        @media (max-width: 768px) {
          .voice-transcriber {
            padding: 0.5rem;
          }

          .section-title {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
          }

          .language-dropdown {
            font-size: 1rem;
            padding: 0.8rem 1.2rem;
          }

          .transcript-section {
            padding: 1.5rem;
          }

          .transcript-content {
            max-height: 300px;
            font-size: 1rem;
          }

          .listen-button,
          .download-button {
            padding: 0.9rem 1.8rem;
            font-size: 1rem;
            min-width: 180px;
          }
        }

        @media (max-width: 480px) {
          .voice-transcriber {
            padding: 0.5rem;
          }

          .section-title {
            font-size: 1.3rem;
            margin-bottom: 1rem;
          }

          .language-selector label {
            font-size: 1rem;
          }

          .language-dropdown {
            padding: 0.7rem 1rem;
            font-size: 0.95rem;
          }

          .listen-button,
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

export default VoiceTranscriber;
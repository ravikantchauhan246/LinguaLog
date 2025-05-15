import VoiceTranscriber from './components/VoiceTranscriber'
import FileTranscriber from './components/FileTranscriber'
import './App.css'

function App() {
  const apiKey = import.meta.env.VITE_ASSEMBLYAI_API_KEY

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>LinguaLog</h1>
        <p className="subtitle">Voice & File Transcription Made Easy</p>
      </header>

      <main className="main-content">
        <div className="transcription-container">
          <VoiceTranscriber apiKey={apiKey} />
          <div className="divider"></div>
          <FileTranscriber apiKey={apiKey} />
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&family=Roboto:wght@400;500&display=swap');

        .app-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #6d5dfc 0%, #46caff 100%);
          font-family: 'Roboto', Arial, sans-serif;
          padding: 2rem;
          box-sizing: border-box;
        }

        .app-header {
          text-align: center;
          margin-bottom: 2rem;
          color: white;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 1rem;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        }

        .app-header h1 {
          margin: 0;
          font-family: 'Montserrat', sans-serif;
          font-size: 3rem;
          font-weight: 900;
          letter-spacing: 2px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .subtitle {
          margin-top: 0.5rem;
          font-size: 1.2rem;
          font-weight: 500;
          opacity: 0.9;
        }

        .main-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .transcription-container {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, 
            rgba(109, 93, 252, 0.1) 0%, 
            rgba(109, 93, 252, 0.4) 50%, 
            rgba(109, 93, 252, 0.1) 100%
          );
          margin: 2rem 0;
        }

        @media (max-width: 768px) {
          .app-container {
            padding: 1rem;
          }

          .app-header {
            padding: 1.5rem;
            margin-bottom: 1.5rem;
          }

          .app-header h1 {
            font-size: 2.5rem;
          }

          .transcription-container {
            padding: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .app-container {
            padding: 0.8rem;
          }

          .app-header {
            padding: 1rem;
            margin-bottom: 1rem;
          }

          .app-header h1 {
            font-size: 2rem;
          }

          .subtitle {
            font-size: 1rem;
          }

          .transcription-container {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  )
}

export default App

import { useState, useEffect } from 'react';
import { FaMicrophone, FaStop } from 'react-icons/fa';

const VoiceRecorder = ({ onTranscript, expectedText }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recognition, setRecognition] = useState(null);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognitionInstance = new SpeechRecognition();

            recognitionInstance.continuous = false;
            recognitionInstance.interimResults = false;
            recognitionInstance.lang = 'en-US';

            recognitionInstance.onresult = (event) => {
                const spokenText = event.results[0][0].transcript;
                setTranscript(spokenText);
                onTranscript(spokenText);
            };

            recognitionInstance.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setError('Error recognizing speech. Please try again.');
                setIsRecording(false);
            };

            recognitionInstance.onend = () => {
                setIsRecording(false);
            };

            setRecognition(recognitionInstance);
        } else {
            setError('Speech recognition is not supported in your browser.');
        }
    }, [onTranscript]);

    const startRecording = () => {
        if (recognition) {
            setError('');
            setTranscript('');
            recognition.start();
            setIsRecording(true);
        }
    };

    const stopRecording = () => {
        if (recognition) {
            recognition.stop();
            setIsRecording(false);
        }
    };

    return (
        <div className="voice-recorder">
            <div className="recording-area">
                {expectedText && (
                    <div className="expected-text">
                        <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                            Say this:
                        </p>
                        <h3 style={{ color: 'var(--accent-primary)', marginBottom: '1.5rem' }}>
                            {expectedText}
                        </h3>
                    </div>
                )}

                <button
                    className={`record-btn ${isRecording ? 'recording' : ''}`}
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={!recognition}
                >
                    {isRecording ? <FaStop size={32} /> : <FaMicrophone size={32} />}
                </button>

                <p className="recording-status">
                    {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
                </p>

                {transcript && (
                    <div className="transcript-box">
                        <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                            You said:
                        </p>
                        <p style={{ fontSize: '1.125rem', color: 'var(--text-primary)' }}>
                            "{transcript}"
                        </p>
                    </div>
                )}

                {error && (
                    <div className="error-message" style={{ textAlign: 'center', marginTop: '1rem' }}>
                        {error}
                    </div>
                )}
            </div>

            <style>{`
        .voice-recorder {
          width: 100%;
        }

        .recording-area {
          text-align: center;
          padding: 2rem;
        }

        .expected-text {
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: var(--bg-tertiary);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
        }

        .record-btn {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: none;
          background: var(--accent-gradient);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          transition: all var(--transition-base);
          box-shadow: var(--shadow-md);
        }

        .record-btn:hover {
          transform: scale(1.05);
          box-shadow: var(--shadow-lg), var(--shadow-glow);
        }

        .record-btn:active {
          transform: scale(0.95);
        }

        .record-btn.recording {
          background: var(--error);
          animation: pulse 1.5s ease-in-out infinite;
        }

        .record-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
        }

        .recording-status {
          margin-top: 1rem;
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .transcript-box {
          margin-top: 2rem;
          padding: 1.5rem;
          background: var(--bg-tertiary);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
        }
      `}</style>
        </div>
    );
};

export default VoiceRecorder;

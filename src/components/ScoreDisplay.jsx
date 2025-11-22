import { FaCheckCircle, FaStar, FaTrophy, FaVolumeUp } from 'react-icons/fa';

const ScoreDisplay = ({ score, feedback, expectedText, spokenText, analysis }) => {
    const getScoreColor = (score) => {
        if (score >= 90) return 'var(--success)';
        if (score >= 75) return 'var(--accent-primary)';
        if (score >= 60) return 'var(--warning)';
        return 'var(--error)';
    };

    const getScoreIcon = (score) => {
        if (score >= 90) return <FaTrophy size={40} />;
        if (score >= 75) return <FaStar size={40} />;
        return <FaCheckCircle size={40} />;
    };

    const playAudio = (text) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            // Try to select a good voice
            const voices = window.speechSynthesis.getVoices();
            // Prefer Google US English or similar if available, otherwise default
            const preferredVoice = voices.find(voice => voice.name.includes('Google US English')) || voices[0];
            if (preferredVoice) utterance.voice = preferredVoice;

            window.speechSynthesis.cancel(); // Cancel any currently playing audio
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <div className="score-display fade-in">
            <div className="score-circle" style={{ borderColor: getScoreColor(score) }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ color: getScoreColor(score), marginBottom: '0.5rem' }}>
                        {getScoreIcon(score)}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-4xl)', color: getScoreColor(score) }}>
                        {score}%
                    </div>
                </div>
            </div>

            <div className="feedback-box">
                <h3 style={{ marginBottom: '1.5rem', textAlign: 'center', color: 'var(--accent-primary)' }}>{feedback}</h3>

                {/* AI Analysis Section */}
                {analysis && (
                    <div className="analysis-section" style={{ marginBottom: '2rem' }}>
                        <div className="analysis-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <h4>Corrected Sentence</h4>
                                <button
                                    onClick={() => playAudio(analysis.correctedSentence)}
                                    className="icon-btn"
                                    title="Listen to pronunciation"
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--accent-primary)',
                                        cursor: 'pointer',
                                        padding: '4px',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    <FaVolumeUp size={18} />
                                </button>
                            </div>
                            <p className="highlight-text">{analysis.correctedSentence}</p>
                        </div>

                        <div className="grid grid-2" style={{ gap: '1rem', marginTop: '1rem' }}>
                            <div className="analysis-card">
                                <h4>Grammar Check</h4>
                                <ul>
                                    {analysis.grammar.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="analysis-card">
                                <h4>Sentence Formation</h4>
                                <ul>
                                    {analysis.sentenceFormation.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                <div className="comparison">
                    <div className="comparison-item">
                        <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                            You said:
                        </p>
                        <p style={{ color: 'var(--text-primary)', fontSize: '1.125rem' }}>
                            {spokenText}
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
        .score-display {
          text-align: center;
          padding: 2rem;
        }

        .feedback-box {
          margin-top: 2rem;
          padding: 2rem;
          background: var(--bg-tertiary);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
        }

        .analysis-card {
            background: var(--bg-secondary);
            padding: 1rem;
            border-radius: var(--radius-md);
            text-align: left;
            border-left: 4px solid var(--accent-primary);
        }

        .analysis-card h4 {
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 0.5rem;
            color: var(--text-secondary);
        }

        .highlight-text {
            font-size: 1.2rem;
            color: var(--success);
            font-weight: 500;
        }

        .analysis-card ul {
            list-style-type: none;
            padding: 0;
            margin: 0;
        }

        .analysis-card li {
            margin-bottom: 0.25rem;
            font-size: 0.95rem;
        }

        .comparison {
          display: grid;
          gap: 1.5rem;
          margin-top: 1.5rem;
        }

        .comparison-item {
          padding: 1rem;
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
          text-align: left;
        }
      `}</style>
        </div>
    );
};

export default ScoreDisplay;

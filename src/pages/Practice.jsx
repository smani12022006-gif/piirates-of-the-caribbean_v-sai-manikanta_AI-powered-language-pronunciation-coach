import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { practiceAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import VoiceRecorder from '../components/VoiceRecorder';
import ScoreDisplay from '../components/ScoreDisplay';
import { FaArrowLeft, FaHistory } from 'react-icons/fa';

const Practice = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [content, setContent] = useState(null);
    const [spokenText, setSpokenText] = useState('');
    const [result, setResult] = useState(null);
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadNewQuestion();
        loadHistory();
    }, []);

    const loadNewQuestion = async () => {
        setLoading(true);
        try {
            const response = await practiceAPI.getContent(user.selectedLanguage);
            setContent(response.data.content);
            setResult(null);
            setSpokenText('');
        } catch (error) {
            console.error('Failed to fetch content:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadHistory = async () => {
        try {
            const response = await practiceAPI.getHistory();
            setHistory(response.data.history);
        } catch (error) {
            console.error('Failed to fetch history:', error);
        }
    };

    const handleTranscript = async (transcript) => {
        setSpokenText(transcript);

        if (transcript && content) {
            setLoading(true);
            try {
                const response = await practiceAPI.submitScore({
                    expectedText: content.word,
                    spokenText: transcript
                });
                setResult(response.data);
                loadHistory(); // Refresh history
            } catch (error) {
                console.error('Failed to submit score:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const getAverageScore = () => {
        if (history.length === 0) return 0;
        const sum = history.reduce((acc, item) => acc + item.score, 0);
        return Math.round(sum / history.length);
    };

    return (
        <div className="page">
            <div className="container" style={{ maxWidth: '700px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <button
                        onClick={() => navigate('/mode-selection')}
                        className="btn btn-secondary"
                    >
                        <FaArrowLeft /> Back
                    </button>

                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className="btn btn-secondary"
                    >
                        <FaHistory /> {showHistory ? 'Hide' : 'Show'} History
                    </button>
                </div>

                {showHistory ? (
                    <div className="card fade-in">
                        <h2>Practice History</h2>
                        <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
                            Average Score: <span style={{ color: 'var(--accent-primary)', fontSize: '1.25rem', fontWeight: '700' }}>
                                {getAverageScore()}%
                            </span>
                        </p>

                        {history.length === 0 ? (
                            <p className="text-center text-muted">No practice history yet. Start practicing!</p>
                        ) : (
                            <div className="history-list">
                                {history.slice().reverse().slice(0, 10).map((item, index) => (
                                    <div key={index} className="history-item">
                                        <div>
                                            <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{item.word}</div>
                                            <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                                                {new Date(item.date).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div
                                            className="history-score"
                                            style={{
                                                color: item.score >= 75 ? 'var(--success)' : item.score >= 50 ? 'var(--warning)' : 'var(--error)'
                                            }}
                                        >
                                            {item.score}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="card fade-in">
                        <h2 className="text-center" style={{ marginBottom: '2rem' }}>Practice Mode</h2>

                        {!result && content && (
                            <div>
                                <VoiceRecorder
                                    expectedText={content.word}
                                    onTranscript={handleTranscript}
                                />

                                {content.pronunciation && (
                                    <div className="pronunciation-hint">
                                        <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                            Pronunciation guide:
                                        </p>
                                        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                                            {content.pronunciation}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {result && (
                            <div>
                                <ScoreDisplay
                                    score={result.score}
                                    feedback={result.feedback}
                                    expectedText={result.expectedText}
                                    spokenText={result.spokenText}
                                />

                                <button
                                    onClick={loadNewQuestion}
                                    className="btn btn-primary"
                                    style={{ width: '100%', marginTop: '2rem' }}
                                >
                                    Next Question
                                </button>
                            </div>
                        )}

                        {loading && (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <div className="spinner" style={{ margin: '0 auto' }}></div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style>{`
        .pronunciation-hint {
          margin-top: 2rem;
          padding: 1.5rem;
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .history-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: var(--bg-tertiary);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
        }

        .history-score {
          font-size: 1.5rem;
          font-weight: 700;
        }
      `}</style>
        </div>
    );
};

export default Practice;

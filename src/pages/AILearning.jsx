import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { practiceAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import VoiceRecorder from '../components/VoiceRecorder';
import ScoreDisplay from '../components/ScoreDisplay';
import { FaArrowLeft, FaRedo } from 'react-icons/fa';

const AILearning = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [step, setStep] = useState('practice'); // practice, result
    const [spokenText, setSpokenText] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleTranscript = async (transcript) => {
        setSpokenText(transcript);

        if (transcript) {
            setLoading(true);
            try {
                // Submit only spokenText, backend will handle expectedText generation
                const response = await practiceAPI.submitScore({
                    spokenText: transcript
                });
                setResult(response.data);
                setStep('result');
            } catch (error) {
                console.error('Failed to submit score:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleTryAgain = () => {
        setStep('practice');
        setSpokenText('');
        setResult(null);
    };

    return (
        <div className="page">
            <div className="container" style={{ maxWidth: '700px' }}>
                <button
                    onClick={() => navigate('/mode-selection')}
                    className="btn btn-secondary"
                    style={{ marginBottom: '2rem' }}
                >
                    <FaArrowLeft /> Back
                </button>

                <div className="card fade-in">
                    {step === 'practice' && (
                        <div className="practice-section">
                            <h2 className="text-center" style={{ marginBottom: '0.5rem' }}>
                                Learn from AI
                            </h2>
                            <p className="text-center text-muted" style={{ marginBottom: '2rem' }}>
                                Speak any sentence and AI will analyze your pronunciation
                            </p>

                            <div className="target-text-box" style={{
                                padding: '1.5rem',
                                background: 'var(--bg-secondary)',
                                borderRadius: 'var(--radius-md)',
                                margin: '2rem 0',
                                textAlign: 'center',
                                minHeight: '100px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                    Tap the microphone and start speaking...
                                </p>
                            </div>

                            <VoiceRecorder
                                onTranscript={handleTranscript}
                            />
                        </div>
                    )}

                    {step === 'result' && result && (
                        <div className="result-section">
                            <ScoreDisplay
                                score={result.score}
                                feedback={result.feedback}
                                expectedText={result.expectedText}
                                spokenText={result.spokenText}
                                analysis={result.analysis}
                            />

                            <div className="grid grid-2" style={{ marginTop: '2rem' }}>
                                <button onClick={handleTryAgain} className="btn btn-primary" style={{ gridColumn: '1 / -1' }}>
                                    <FaRedo /> Practice Another Sentence
                                </button>
                            </div>
                        </div>
                    )}

                    {loading && (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <div className="spinner" style={{ margin: '0 auto' }}></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AILearning;

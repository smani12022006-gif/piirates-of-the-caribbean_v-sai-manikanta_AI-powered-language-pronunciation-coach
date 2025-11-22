import { useNavigate } from 'react-router-dom';
import { FaRobot, FaDumbbell, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const ModeSelection = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="page">
            <div className="container" style={{ maxWidth: '800px' }}>
                <div className="text-center fade-in" style={{ marginBottom: '3rem' }}>
                    <h1>Welcome, {user?.firstName}!</h1>
                    <p className="text-muted">Choose your learning mode</p>
                    <button
                        onClick={handleLogout}
                        className="btn btn-secondary"
                        style={{ marginTop: '1rem' }}
                    >
                        <FaSignOutAlt /> Logout
                    </button>
                </div>

                <div className="grid grid-2">
                    <div
                        className="mode-card fade-in"
                        onClick={() => navigate('/ai-learning')}
                        style={{ animationDelay: '0.1s' }}
                    >
                        <div className="mode-icon">
                            <FaRobot size={64} />
                        </div>
                        <h2>Learn from AI</h2>
                        <p className="text-muted">
                            Enter any sentence and get real-time pronunciation feedback
                        </p>
                        <div className="mode-features">
                            <div className="feature-item">✓ Custom sentence input</div>
                            <div className="feature-item">✓ Instant feedback</div>
                            <div className="feature-item">✓ Accuracy scoring</div>
                        </div>
                    </div>

                    <div
                        className="mode-card fade-in"
                        onClick={() => navigate('/practice')}
                        style={{ animationDelay: '0.2s' }}
                    >
                        <div className="mode-icon">
                            <FaDumbbell size={64} />
                        </div>
                        <h2>Practice Mode</h2>
                        <p className="text-muted">
                            Practice with curated words and phrases at your own pace
                        </p>
                        <div className="mode-features">
                            <div className="feature-item">✓ Guided practice</div>
                            <div className="feature-item">✓ Progress tracking</div>
                            <div className="feature-item">✓ Multiple difficulty levels</div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .mode-card {
          background: var(--bg-card);
          backdrop-filter: blur(20px);
          border: 2px solid var(--border-color);
          border-radius: var(--radius-xl);
          padding: 3rem 2rem;
          cursor: pointer;
          transition: all var(--transition-base);
          text-align: center;
        }

        .mode-card:hover {
          border-color: var(--accent-primary);
          transform: translateY(-8px);
          box-shadow: var(--shadow-lg), var(--shadow-glow);
        }

        .mode-icon {
          color: var(--accent-primary);
          margin-bottom: 1.5rem;
          display: flex;
          justify-content: center;
        }

        .mode-card h2 {
          margin-bottom: 1rem;
          font-size: var(--font-size-2xl);
        }

        .mode-card p {
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .mode-features {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          text-align: left;
        }

        .feature-item {
          padding: 0.5rem 1rem;
          background: var(--bg-tertiary);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
        }
      `}</style>
        </div>
    );
};

export default ModeSelection;

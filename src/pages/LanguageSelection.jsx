import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { languageAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LanguageSelection = () => {
    const navigate = useNavigate();
    const { user, updateUser } = useAuth();
    const [languages, setLanguages] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchLanguages();
    }, []);

    const fetchLanguages = async () => {
        try {
            const response = await languageAPI.getList();
            setLanguages(response.data.languages);
        } catch (error) {
            console.error('Failed to fetch languages:', error);
        }
    };

    const handleSelect = async (languageCode) => {
        setSelectedLanguage(languageCode);
        setLoading(true);

        try {
            await languageAPI.select(languageCode);
            updateUser({ ...user, selectedLanguage: languageCode });
            navigate('/mode-selection');
        } catch (error) {
            console.error('Failed to select language:', error);
            setSelectedLanguage(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <div className="container" style={{ maxWidth: '900px' }}>
                <div className="text-center fade-in" style={{ marginBottom: '3rem' }}>
                    <h1>Choose Your Language</h1>
                    <p className="text-muted">Select the language you want to practice</p>
                </div>

                <div className="grid grid-3">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            className={`language-card ${selectedLanguage === lang.code ? 'selected' : ''}`}
                            onClick={() => handleSelect(lang.code)}
                            disabled={loading}
                        >
                            <div className="language-flag">{lang.flag}</div>
                            <div className="language-name">{lang.name}</div>
                        </button>
                    ))}
                </div>
            </div>

            <style>{`
        .language-card {
          background: var(--bg-card);
          backdrop-filter: blur(20px);
          border: 2px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 2rem;
          cursor: pointer;
          transition: all var(--transition-base);
          text-align: center;
        }

        .language-card:hover {
          border-color: var(--accent-primary);
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg), var(--shadow-glow);
        }

        .language-card.selected {
          border-color: var(--accent-primary);
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
        }

        .language-card:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }

        .language-flag {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .language-name {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--text-primary);
        }
      `}</style>
        </div>
    );
};

export default LanguageSelection;

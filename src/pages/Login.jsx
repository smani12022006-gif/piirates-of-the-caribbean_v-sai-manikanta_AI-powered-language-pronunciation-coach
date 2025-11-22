import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock } from 'react-icons/fa';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ''
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            const response = await authAPI.login(formData);
            login(response.data.token, response.data.user);

            // Navigate based on user state
            if (!response.data.user.selectedLanguage) {
                navigate('/language-selection');
            } else {
                navigate('/mode-selection');
            }
        } catch (error) {
            setErrors({
                submit: error.response?.data?.message || 'Login failed. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <div className="card fade-in" style={{ maxWidth: '450px', width: '100%' }}>
                <h1 className="text-center" style={{ marginBottom: '0.5rem' }}>Welcome Back</h1>
                <p className="text-center text-muted" style={{ marginBottom: '2rem' }}>
                    Continue your learning journey
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">
                            <FaEnvelope style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            className={`input ${errors.email ? 'input-error' : ''}`}
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && <div className="error-message">{errors.email}</div>}
                    </div>

                    <div className="input-group">
                        <label className="input-label">
                            <FaLock style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            className={`input ${errors.password ? 'input-error' : ''}`}
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {errors.password && <div className="error-message">{errors.password}</div>}
                    </div>

                    {errors.submit && (
                        <div className="error-message" style={{ textAlign: 'center', marginBottom: '1rem' }}>
                            {errors.submit}
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="text-center text-muted" style={{ marginTop: '1.5rem' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;

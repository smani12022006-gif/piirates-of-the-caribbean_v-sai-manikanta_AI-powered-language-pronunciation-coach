import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaIdCard } from 'react-icons/fa';

const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        userId: '',
        phone: '',
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
        // Clear error for this field
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ''
            });
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.userId.trim()) newErrors.userId = 'User ID is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        try {
            const response = await authAPI.register(formData);
            login(response.data.token, response.data.user);
            navigate('/language-selection');
        } catch (error) {
            setErrors({
                submit: error.response?.data?.message || 'Registration failed. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <div className="card fade-in" style={{ maxWidth: '600px', width: '100%' }}>
                <h1 className="text-center" style={{ marginBottom: '0.5rem' }}>Create Account</h1>
                <p className="text-center text-muted" style={{ marginBottom: '2rem' }}>
                    Start your pronunciation learning journey
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-2">
                        <div className="input-group">
                            <label className="input-label">
                                <FaUser style={{ display: 'inline', marginRight: '0.5rem' }} />
                                First Name
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                className={`input ${errors.firstName ? 'input-error' : ''}`}
                                placeholder="John"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                            {errors.firstName && <div className="error-message">{errors.firstName}</div>}
                        </div>

                        <div className="input-group">
                            <label className="input-label">
                                <FaUser style={{ display: 'inline', marginRight: '0.5rem' }} />
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                className={`input ${errors.lastName ? 'input-error' : ''}`}
                                placeholder="Doe"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                            {errors.lastName && <div className="error-message">{errors.lastName}</div>}
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">
                            <FaIdCard style={{ display: 'inline', marginRight: '0.5rem' }} />
                            User ID
                        </label>
                        <input
                            type="text"
                            name="userId"
                            className={`input ${errors.userId ? 'input-error' : ''}`}
                            placeholder="johndoe123"
                            value={formData.userId}
                            onChange={handleChange}
                        />
                        {errors.userId && <div className="error-message">{errors.userId}</div>}
                    </div>

                    <div className="input-group">
                        <label className="input-label">
                            <FaPhone style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            className={`input ${errors.phone ? 'input-error' : ''}`}
                            placeholder="+1 234 567 8900"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                        {errors.phone && <div className="error-message">{errors.phone}</div>}
                    </div>

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
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-muted" style={{ marginTop: '1.5rem' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;

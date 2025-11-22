import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';
import Login from './pages/Login';
import LanguageSelection from './pages/LanguageSelection';
import ModeSelection from './pages/ModeSelection';
import AILearning from './pages/AILearning';
import Practice from './pages/Practice';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/register" replace />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/language-selection"
                        element={
                            <ProtectedRoute>
                                <LanguageSelection />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/mode-selection"
                        element={
                            <ProtectedRoute>
                                <ModeSelection />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/ai-learning"
                        element={
                            <ProtectedRoute>
                                <AILearning />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/practice"
                        element={
                            <ProtectedRoute>
                                <Practice />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;

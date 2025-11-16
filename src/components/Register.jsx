import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleUserTypeSelect = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    try {
      // Simulation d'inscription réussie
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        token: 'mock-jwt-token-register-' + Date.now(),
        user: {
          id: '2',
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role
        }
      };
      
      localStorage.setItem('token', mockUser.token);
      localStorage.setItem('user', JSON.stringify(mockUser.user));
      navigate('/dashboard');
      
    } catch (error) {
      setError('Erreur lors de la création du compte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1>ReservaEquip</h1>
          <p>Créez votre compte pour commencer à réserver</p>
        </div>

        <div className="register-content">
          <div className="register-form-container">
            <h2>Inscription</h2>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="user-type-selection">
              <h3>Type d'Utilisateur</h3>
              <div className="user-type-options">
                <div 
                  className={`user-type-card ${formData.role === 'user' ? 'selected' : ''}`}
                  onClick={() => handleUserTypeSelect('user')}
                >
                  <div className="card-content">
                    <span className="icon">👤</span>
                    <span className="label">Utilisateur Standard</span>
                    <p>Réserver des équipements et gérer vos réservations</p>
                  </div>
                </div>

                <div 
                  className={`user-type-card ${formData.role === 'supervisor' ? 'selected' : ''}`}
                  onClick={() => handleUserTypeSelect('supervisor')}
                >
                  <div className="card-content">
                    <span className="icon">👨‍💼</span>
                    <span className="label">Superviseur</span>
                    <p>Gérer les réservations et valider les demandes</p>
                  </div>
                </div>
              </div>
              <p style={{ color: '#8B4513', fontSize: '0.9rem', textAlign: 'center', marginTop: '1rem' }}>
                ⓘ Le rôle administrateur est attribué manuellement
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="firstName">Prénom *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Nom *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Mot de Passe *</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                  />
                  <small style={{ color: '#8B4513', fontSize: '0.8rem' }}>
                    Minimum 6 caractères
                  </small>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmer le Mot de Passe *</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="register-btn"
                disabled={loading}
              >
                {loading ? 'Création du compte...' : 'Créer mon compte'}
              </button>

              <div className="login-link">
                <p>
                  Déjà un compte ? 
                  <Link to="/login">
                    <span> Se connecter</span>
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
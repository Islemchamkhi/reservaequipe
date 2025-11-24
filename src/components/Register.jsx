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
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');

    // Validation en temps réel du mot de passe
    if (name === 'password') {
      validatePassword(value);
    }
  };

  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
    setPasswordRequirements(requirements);
  };

  const handleUserTypeSelect = (role) => {
    setFormData({ ...formData, role });
  };

  const isPasswordValid = () => {
    return Object.values(passwordRequirements).every(req => req === true);
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

    if (!isPasswordValid()) {
      setError('Le mot de passe ne respecte pas toutes les exigences de sécurité');
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

  const RequirementItem = ({ met, text }) => (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      marginBottom: '0.3rem',
      fontSize: '0.8rem'
    }}>
      <span style={{ 
        marginRight: '0.5rem',
        color: met ? '#27ae60' : '#e74c3c',
        fontWeight: 'bold'
      }}>
        {met ? '✓' : '✗'}
      </span>
      <span style={{ color: met ? '#27ae60' : '#666' }}>
        {text}
      </span>
    </div>
  );

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
              <p style={{ color: '#1565c0', fontSize: '0.9rem', textAlign: 'center', marginTop: '1rem' }}>
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
                  />
                  
                  {/* Indicateur de force du mot de passe */}
                  {formData.password && (
                    <div style={{ 
                      marginTop: '0.5rem',
                      padding: '0.8rem',
                      background: '#f8f9fa',
                      borderRadius: '8px',
                      border: '1px solid #e9ecef'
                    }}>
                      <div style={{ 
                        marginBottom: '0.5rem',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        color: '#4169E1'
                      }}>
                        Exigences de sécurité :
                      </div>
                      <RequirementItem 
                        met={passwordRequirements.length} 
                        text="Au moins 8 caractères" 
                      />
                      <RequirementItem 
                        met={passwordRequirements.uppercase} 
                        text="Au moins une majuscule (A-Z)" 
                      />
                      <RequirementItem 
                        met={passwordRequirements.lowercase} 
                        text="Au moins une minuscule (a-z)" 
                      />
                      <RequirementItem 
                        met={passwordRequirements.number} 
                        text="Au moins un chiffre (0-9)" 
                      />
                      <RequirementItem 
                        met={passwordRequirements.special} 
                        text="Au moins un caractère spécial (!@#$%^&*...)" 
                      />
                      
                      {/* Barre de progression */}
                      <div style={{ 
                        marginTop: '0.5rem',
                        height: '4px',
                        background: '#e9ecef',
                        borderRadius: '2px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          height: '100%',
                          background: isPasswordValid() ? '#27ae60' : 
                                    Object.values(passwordRequirements).filter(Boolean).length >= 3 ? '#f39c12' : '#e74c3c',
                          width: `${(Object.values(passwordRequirements).filter(Boolean).length / 5) * 100}%`,
                          transition: 'all 0.3s ease'
                        }} />
                      </div>
                      
                      <div style={{ 
                        marginTop: '0.3rem',
                        fontSize: '0.7rem',
                        textAlign: 'center',
                        color: isPasswordValid() ? '#27ae60' : '#666',
                        fontWeight: '600'
                      }}>
                        {isPasswordValid() ? 'Mot de passe sécurisé ✓' : 
                         `Force: ${Object.values(passwordRequirements).filter(Boolean).length}/5`}
                      </div>
                    </div>
                  )}
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
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <small style={{ color: '#e74c3c', fontSize: '0.8rem' }}>
                      ✗ Les mots de passe ne correspondent pas
                    </small>
                  )}
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <small style={{ color: '#27ae60', fontSize: '0.8rem' }}>
                      ✓ Les mots de passe correspondent
                    </small>
                  )}
                </div>
              </div>

              <button 
                type="submit" 
                className="register-btn"
                disabled={loading || !isPasswordValid() || formData.password !== formData.confirmPassword}
                style={{
                  opacity: (loading || !isPasswordValid() || formData.password !== formData.confirmPassword) ? 0.6 : 1,
                  cursor: (loading || !isPasswordValid() || formData.password !== formData.confirmPassword) ? 'not-allowed' : 'pointer'
                }}
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
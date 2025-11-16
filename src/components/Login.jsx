import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 🔄 REMPLACER LA SIMULATION PAR L'APPEL API RÉEL
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur de connexion');
      }

      if (data.success) {
        // Sauvegarder le token et les données utilisateur
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        navigate('/dashboard');
      } else {
        throw new Error(data.message || 'Erreur de connexion');
      }
      
    } catch (error) {
      setError(error.message || 'Erreur de connexion. Vérifiez vos identifiants.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>ReservaEquip</h1>
          <p>Connectez-vous à votre espace de réservation</p>
        </div>

        <div className="login-content">
          <div className="login-left">
            <h2>Bienvenue</h2>
            <div className="app-introduction-login">
              <p>
                <strong>ReservaEquip</strong> est votre plateforme de gestion centralisée 
                pour la réservation d'équipements partagés.
              </p>
              <p>
                Réservez facilement vos équipements, consultez les disponibilités 
                en temps réel et gérez vos accès en toute simplicité.
              </p>
            </div>

            <div className="app-features-login">
              <div className="feature-item-login">
                <div className="feature-icon-login">📅</div>
                <div className="feature-text-login">
                  <strong>Réservation Simplifiée</strong>
                  <span>Planifiez l'accès aux équipements en temps réel</span>
                </div>
              </div>

              <div className="feature-item-login">
                <div className="feature-icon-login">⚡</div>
                <div className="feature-text-login">
                  <strong>Gestion Centralisée</strong>
                  <span>Suivez toutes vos réservations au même endroit</span>
                </div>
              </div>

              <div className="feature-item-login">
                <div className="feature-icon-login">🔒</div>
                <div className="feature-text-login">
                  <strong>Accès Sécurisé</strong>
                  <span>Authentification multi-niveaux et données protégées</span>
                </div>
              </div>

              <div className="feature-item-login">
                <div className="feature-icon-login">📊</div>
                <div className="feature-text-login">
                  <strong>Suivi en Temps Réel</strong>
                  <span>Visualisez l'occupation et les statistiques d'usage</span>
                </div>
              </div>
            </div>

            <div className="qr-section">
              <div className="qr-placeholder">
                <span className="qr-code">📱</span>
                <p>Application Mobile</p>
                <p>Disponible Prochainement</p>
              </div>
            </div>
          </div>

          <div className="login-right">
            <div className="login-form-container">
              <h3>Connexion</h3>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Mot de Passe</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Votre mot de passe"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-options">
                  <label className="checkbox">
                    <input type="checkbox" />
                    Se souvenir de moi
                  </label>
                  <button type="button" className="forgot-password">
                    Mot de passe oublié ?
                  </button>
                </div>

                <button 
                  type="submit" 
                  className="login-btn"
                  disabled={loading}
                >
                  {loading ? 'Connexion...' : 'Se Connecter'}
                </button>

                <div className="divider">
                  <span>Ou continuer avec</span>
                </div>

                <div className="social-login">
                  <button type="button" className="social-btn">
                    <span>🔵</span>
                    Microsoft
                  </button>
                  <button type="button" className="social-btn">
                    <span>🔷</span>
                    LDAP
                  </button>
                </div>

                <div className="register-link">
                  <p>
                    Nouveau utilisateur ? 
                    <Link to="/register">
                      <span> Créer un compte</span>
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
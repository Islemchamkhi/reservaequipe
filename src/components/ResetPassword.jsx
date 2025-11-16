import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    return requirements;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    const passwordRequirements = validatePassword(formData.newPassword);
    const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

    if (!isPasswordValid) {
      setError('Le mot de passe ne respecte pas les exigences de sécurité');
      setLoading(false);
      return;
    }

    if (!token) {
      setError('Lien de réinitialisation invalide');
      setLoading(false);
      return;
    }

    try {
      // Simulation réinitialisation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess('Votre mot de passe a été réinitialisé avec succès !');
      
      // Redirection après succès
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error) {
      setError('Erreur lors de la réinitialisation du mot de passe');
    } finally {
      setLoading(false);
    }
  };

  const passwordRequirements = validatePassword(formData.newPassword);

  return (
    <div className="login-page">
      <div className="login-container" style={{ maxWidth: '500px' }}>
        <div className="login-header">
          <h1>ReservaEquip</h1>
          <p>Réinitialisation du mot de passe</p>
        </div>

        <div className="login-right" style={{ padding: '3rem' }}>
          <div className="login-form-container">
            <h3>Nouveau mot de passe</h3>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {success && (
              <div className="success-message" style={{
                background: '#F0F9FF',
                color: '#0369A1',
                padding: '1rem',
                borderRadius: '12px',
                marginBottom: '1.5rem',
                textAlign: 'center',
                borderLeft: '4px solid #0369A1'
              }}>
                {success}
              </div>
            )}

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="newPassword">Nouveau mot de passe *</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  minLength="8"
                />
                
                {/* Indicateur de force du mot de passe */}
                {formData.newPassword && (
                  <div style={{ marginTop: '1rem' }}>
                    <div style={{ 
                      fontSize: '0.8rem', 
                      color: '#8B4513',
                      marginBottom: '0.5rem',
                      fontWeight: '600'
                    }}>
                      Exigences de sécurité :
                    </div>
                    <div style={{ fontSize: '0.75rem' }}>
                      <div style={{ color: passwordRequirements.length ? '#27AE60' : '#C0392B' }}>
                        {passwordRequirements.length ? '✅' : '❌'} Au moins 8 caractères
                      </div>
                      <div style={{ color: passwordRequirements.uppercase ? '#27AE60' : '#C0392B' }}>
                        {passwordRequirements.uppercase ? '✅' : '❌'} Une majuscule (A-Z)
                      </div>
                      <div style={{ color: passwordRequirements.lowercase ? '#27AE60' : '#C0392B' }}>
                        {passwordRequirements.lowercase ? '✅' : '❌'} Une minuscule (a-z)
                      </div>
                      <div style={{ color: passwordRequirements.numbers ? '#27AE60' : '#C0392B' }}>
                        {passwordRequirements.numbers ? '✅' : '❌'} Un chiffre (0-9)
                      </div>
                      <div style={{ color: passwordRequirements.specialChar ? '#27AE60' : '#C0392B' }}>
                        {passwordRequirements.specialChar ? '✅' : '❌'} Un caractère spécial (!@#$%^&*)
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                  <div style={{ color: '#C0392B', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    ❌ Les mots de passe ne correspondent pas
                  </div>
                )}
                {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
                  <div style={{ color: '#27AE60', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    ✅ Les mots de passe correspondent
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                className="login-btn"
                disabled={loading}
                style={{ marginTop: '2rem' }}
              >
                {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button 
                type="button" 
                className="forgot-password"
                onClick={() => navigate('/login')}
              >
                ← Retour à la connexion
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [resetData, setResetData] = useState({
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [resetStep, setResetStep] = useState(1);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  // Configuration EmailJS - REMPLACEZ AVEC VOS VRAIES CLÉS
  const EMAILJS_CONFIG = {
    serviceId: 'service_8lfcqwt', // À remplacer
    templateId: 'template_8lfcqwt', // À remplacer
    publicKey: '8lfcqwt', // À remplacer
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleResetChange = (e) => {
    setResetData({ ...resetData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: '1',
          email: formData.email,
          firstName: 'Utilisateur',
          lastName: 'Test',
          role: 'user'
        }
      };
      
      localStorage.setItem('token', mockUser.token);
      localStorage.setItem('user', JSON.stringify(mockUser.user));
      navigate('/dashboard');
      
    } catch (error) {
      setError('Erreur de connexion. Vérifiez vos identifiants.');
    } finally {
      setLoading(false);
    }
  };

  const generateSecureCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const startCountdown = () => {
    setCountdown(60);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const sendRealEmail = async (userEmail, code) => {
    try {
      const templateParams = {
        to_email: userEmail,
        verification_code: code,
        to_name: userEmail.split('@')[0],
        from_name: 'ReservaEquip',
        reply_to: 'isslemchamkhii@gmail.com',
        app_name: 'ReservaEquip'
      };

      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams,
        EMAILJS_CONFIG.publicKey
      );

      return response.status === 200;
    } catch (error) {
      console.error('Erreur EmailJS:', error);
      return false;
    }
  };

  const handleForgotPassword = async () => {
    if (!resetData.email) {
      setError('Veuillez entrer votre adresse email');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetData.email)) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }

    setLoading(true);
    try {
      const verificationCode = generateSecureCode();
      
      // Stocker le code pour vérification
      localStorage.setItem('resetCode', verificationCode);
      localStorage.setItem('resetEmail', resetData.email);
      localStorage.setItem('codeExpires', Date.now() + 10 * 60 * 1000);

      // ENVOI RÉEL D'EMAIL
      const emailSent = await sendRealEmail(resetData.email, verificationCode);
      
      if (emailSent) {
        setResetStep(2);
        setError('');
        startCountdown();
        setError(`✅ Code de vérification envoyé à ${resetData.email}`);
      } else {
        // Fallback si EmailJS échoue
        setResetStep(2);
        setError('');
        startCountdown();
        setError(`📧 Code: ${verificationCode} (Service email en configuration)`);
        console.log(`🔐 CODE POUR ${resetData.email}: ${verificationCode}`);
      }
      
    } catch (error) {
      setError('Erreur lors de l\'envoi du code de vérification');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!resetData.code || resetData.code.length !== 6) {
      setError('Veuillez entrer le code de sécurité à 6 chiffres');
      return;
    }

    const storedCode = localStorage.getItem('resetCode');
    const expires = localStorage.getItem('codeExpires');
    const storedEmail = localStorage.getItem('resetEmail');
    
    if (!storedCode || !expires || !storedEmail) {
      setError('Session expirée. Veuillez recommencer la procédure.');
      return;
    }

    if (Date.now() > parseInt(expires)) {
      setError('Le code a expiré. Veuillez demander un nouveau code.');
      localStorage.removeItem('resetCode');
      localStorage.removeItem('codeExpires');
      localStorage.removeItem('resetEmail');
      return;
    }

    if (resetData.email !== storedEmail) {
      setError('L\'email ne correspond pas à celui qui a reçu le code.');
      return;
    }

    if (resetData.code === storedCode) {
      setResetStep(3);
      setError('');
    } else {
      setError('Code de vérification incorrect');
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
    return requirements;
  };

  const handleResetPassword = async () => {
    if (!resetData.newPassword || !resetData.confirmPassword) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (resetData.newPassword !== resetData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    const passwordRequirements = validatePassword(resetData.newPassword);
    if (!Object.values(passwordRequirements).every(req => req)) {
      setError('Le mot de passe ne respecte pas les exigences de sécurité');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userEmail = localStorage.getItem('resetEmail');
      console.log(`🔄 Mot de passe mis à jour pour: ${userEmail}`);
      
      // Nettoyage sécurisé
      localStorage.removeItem('resetCode');
      localStorage.removeItem('resetEmail');
      localStorage.removeItem('codeExpires');
      
      setError('');
      
      alert('✅ Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.');
      
      setForgotPasswordMode(false);
      setResetStep(1);
      setResetData({ email: '', code: '', newPassword: '', confirmPassword: '' });
      setCountdown(0);
      
    } catch (error) {
      setError('Erreur lors de la réinitialisation du mot de passe');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setForgotPasswordMode(false);
    setResetStep(1);
    setResetData({ email: '', code: '', newPassword: '', confirmPassword: '' });
    setError('');
    setCountdown(0);
  };

  const PasswordRequirement = ({ met, text }) => (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      marginBottom: '0.3rem',
      fontSize: '0.75rem'
    }}>
      <span style={{ 
        marginRight: '0.5rem',
        color: met ? '#27ae60' : '#e74c3c',
        fontWeight: 'bold',
        fontSize: '0.7rem'
      }}>
        {met ? '✓' : '✗'}
      </span>
      <span style={{ color: met ? '#27ae60' : '#666' }}>
        {text}
      </span>
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '1000px',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          minHeight: '600px'
        }}>
          {/* Left Side - Welcome */}
          <div style={{
            background: 'linear-gradient(135deg, #4169E1 0%, #1E90FF 100%)',
            color: 'white',
            padding: '3rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '2.5rem', margin: '0 0 1rem 0', fontWeight: 'bold' }}>
                ReservaEquip
              </h1>
              <p style={{ fontSize: '1.1rem', opacity: 0.9, margin: 0 }}>
                Votre plateforme de gestion d'équipements
              </p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '2rem', marginRight: '1rem' }}>📅</div>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>Réservation Simplifiée</h4>
                  <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>Planifiez l'accès aux équipements en temps réel</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '2rem', marginRight: '1rem' }}>⚡</div>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>Gestion Centralisée</h4>
                  <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>Suivez toutes vos réservations au même endroit</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '2rem', marginRight: '1rem' }}>🔒</div>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>Accès Sécurisé</h4>
                  <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>Authentification multi-niveaux et données protégées</p>
                </div>
              </div>
            </div>

            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '1.5rem', 
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📱</div>
              <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>Application Mobile</p>
              <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>Disponible Prochainement</p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div style={{
            padding: '3rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            {!forgotPasswordMode ? (
              <>
                <h2 style={{ 
                  color: '#4169E1', 
                  marginBottom: '0.5rem',
                  fontSize: '2rem',
                  fontWeight: 'bold'
                }}>
                  Connexion
                </h2>
                <p style={{ color: '#666', marginBottom: '2rem' }}>
                  Accédez à votre espace personnel
                </p>

                {error && (
                  <div style={{
                    background: '#fee',
                    border: '1px solid #e74c3c',
                    color: '#c0392b',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    marginBottom: '1.5rem',
                    fontSize: '0.9rem'
                  }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ 
                      display: 'block', 
                      color: '#00308F', 
                      fontWeight: '600', 
                      marginBottom: '0.5rem',
                      fontSize: '0.9rem'
                    }}>
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="votre@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid rgba(65, 105, 225, 0.3)',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        background: 'rgba(65, 105, 225, 0.05)',
                        color: '#00308F',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ 
                      display: 'block', 
                      color: '#00308F', 
                      fontWeight: '600', 
                      marginBottom: '0.5rem',
                      fontSize: '0.9rem'
                    }}>
                      Mot de Passe
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Votre mot de passe"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid rgba(65, 105, 225, 0.3)',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        background: 'rgba(65, 105, 225, 0.05)',
                        color: '#00308F',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '1.5rem'
                  }}>
                    <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem', color: '#00308F' }}>
                      <input 
                        type="checkbox" 
                        style={{ marginRight: '0.5rem' }}
                      />
                      Se souvenir de moi
                    </label>
                    <button 
                      type="button" 
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#4169E1',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                      }}
                      onClick={() => setForgotPasswordMode(true)}
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>

                  <button 
                    type="submit" 
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: '#4169E1',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      marginBottom: '1.5rem',
                      transition: 'all 0.3s ease'
                    }}
                    disabled={loading}
                    onMouseOver={(e) => {
                      if (!loading) {
                        e.target.style.background = '#00308F';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!loading) {
                        e.target.style.background = '#4169E1';
                      }
                    }}
                  >
                    {loading ? 'Connexion...' : 'Se Connecter'}
                  </button>

                  <div style={{ 
                    textAlign: 'center', 
                    margin: '2rem 0',
                    color: '#666',
                    fontSize: '0.9rem',
                    position: 'relative'
                  }}>
                    <div style={{ 
                      position: 'absolute', 
                      top: '50%', 
                      left: 0, 
                      right: 0, 
                      height: '1px', 
                      background: '#eee' 
                    }}></div>
                    <span style={{ 
                      background: 'white', 
                      padding: '0 1rem',
                      position: 'relative'
                    }}>
                      Ou continuer avec
                    </span>
                  </div>

                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '0.75rem',
                    marginBottom: '2rem'
                  }}>
                    <button type="button" style={{
                      padding: '0.75rem',
                      border: '2px solid rgba(65, 105, 225, 0.3)',
                      background: 'white',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      fontWeight: '600',
                      color: '#4169E1',
                      transition: 'all 0.3s ease'
                    }}>
                      <span>🔵</span>
                      Microsoft
                    </button>
                    <button type="button" style={{
                      padding: '0.75rem',
                      border: '2px solid rgba(65, 105, 225, 0.3)',
                      background: 'white',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      fontWeight: '600',
                      color: '#4169E1',
                      transition: 'all 0.3s ease'
                    }}>
                      <span>🔷</span>
                      LDAP
                    </button>
                  </div>

                  <div style={{ 
                    textAlign: 'center', 
                    borderTop: '1px solid #eee',
                    paddingTop: '1.5rem'
                  }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                      Nouveau utilisateur ? 
                      <Link to="/register" style={{ 
                        color: '#4169E1', 
                        textDecoration: 'none',
                        fontWeight: '600',
                        marginLeft: '0.25rem'
                      }}>
                        Créer un compte
                      </Link>
                    </p>
                  </div>
                </form>
              </>
            ) : (
              <div>
                <button 
                  type="button"
                  onClick={handleBackToLogin}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#4169E1',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: 0,
                    fontWeight: '600'
                  }}
                >
                  ← Retour à la connexion
                </button>

                <h2 style={{ 
                  color: '#4169E1', 
                  marginBottom: '0.5rem',
                  fontSize: '1.8rem',
                  fontWeight: 'bold'
                }}>
                  Réinitialiser le mot de passe
                </h2>
                <p style={{ color: '#666', marginBottom: '2rem', fontSize: '0.95rem' }}>
                  {resetStep === 1 && 'Entrez votre email pour recevoir un code de vérification'}
                  {resetStep === 2 && `Code envoyé à ${resetData.email}`}
                  {resetStep === 3 && 'Créez votre nouveau mot de passe sécurisé'}
                </p>

                {error && (
                  <div style={{
                    background: error.includes('✅') ? '#e8f5e8' : '#fee',
                    border: `1px solid ${error.includes('✅') ? '#27ae60' : '#e74c3c'}`,
                    color: error.includes('✅') ? '#27ae60' : '#c0392b',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    marginBottom: '1.5rem',
                    fontSize: '0.9rem'
                  }}>
                    {error}
                  </div>
                )}

                {resetStep === 1 && (
                  <div>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ 
                        display: 'block', 
                        color: '#00308F', 
                        fontWeight: '600', 
                        marginBottom: '0.5rem',
                        fontSize: '0.9rem'
                      }}>
                        Votre adresse email
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="entrez.votre@email.com"
                        value={resetData.email}
                        onChange={handleResetChange}
                        required
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid rgba(65, 105, 225, 0.3)',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          background: 'rgba(65, 105, 225, 0.05)',
                          color: '#00308F'
                        }}
                      />
                    </div>
                    <button 
                      type="button" 
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: '#4169E1',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={handleForgotPassword}
                      disabled={loading}
                      onMouseOver={(e) => {
                        if (!loading) {
                          e.target.style.background = '#00308F';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!loading) {
                          e.target.style.background = '#4169E1';
                        }
                      }}
                    >
                      {loading ? '📧 Envoi en cours...' : '📧 Recevoir le code par email'}
                    </button>
                  </div>
                )}

                {resetStep === 2 && (
                  <div>
                    <div style={{ 
                      background: '#e8f5e8', 
                      padding: '0.75rem', 
                      borderRadius: '8px', 
                      marginBottom: '1.5rem',
                      border: '1px solid #c8e6c9'
                    }}>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#2e7d32' }}>
                        ✅ Code envoyé à <strong>{resetData.email}</strong>
                      </p>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#2e7d32' }}>
                        Vérifiez votre boîte mail pour le code de vérification
                      </p>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ 
                        display: 'block', 
                        color: '#00308F', 
                        fontWeight: '600', 
                        marginBottom: '0.5rem',
                        fontSize: '0.9rem'
                      }}>
                        Code de vérification à 6 chiffres
                      </label>
                      <input
                        type="text"
                        name="code"
                        placeholder="000000"
                        value={resetData.code}
                        onChange={handleResetChange}
                        maxLength="6"
                        required
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid rgba(65, 105, 225, 0.3)',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          background: 'rgba(65, 105, 225, 0.05)',
                          color: '#00308F',
                          textAlign: 'center',
                          letterSpacing: '0.5rem',
                          fontWeight: 'bold'
                        }}
                      />
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '1.5rem'
                    }}>
                      <span style={{ fontSize: '0.8rem', color: '#666' }}>
                        {countdown > 0 ? `Renvoyer dans ${countdown}s` : 'Code non reçu ?'}
                      </span>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        disabled={countdown > 0 || loading}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: countdown > 0 ? '#999' : '#4169E1',
                          cursor: countdown > 0 ? 'not-allowed' : 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: '600'
                        }}
                      >
                        Renvoyer le code
                      </button>
                    </div>
                    <button 
                      type="button" 
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: '#4169E1',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={handleVerifyCode}
                      disabled={loading}
                      onMouseOver={(e) => {
                        if (!loading) {
                          e.target.style.background = '#00308F';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!loading) {
                          e.target.style.background = '#4169E1';
                        }
                      }}
                    >
                      {loading ? 'Vérification...' : 'Vérifier le code'}
                    </button>
                  </div>
                )}

                {resetStep === 3 && (
                  <div>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ 
                        display: 'block', 
                        color: '#00308F', 
                        fontWeight: '600', 
                        marginBottom: '0.5rem',
                        fontSize: '0.9rem'
                      }}>
                        Nouveau mot de passe
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        placeholder="Nouveau mot de passe sécurisé"
                        value={resetData.newPassword}
                        onChange={handleResetChange}
                        required
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid rgba(65, 105, 225, 0.3)',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          background: 'rgba(65, 105, 225, 0.05)',
                          color: '#00308F'
                        }}
                      />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ 
                        display: 'block', 
                        color: '#00308F', 
                        fontWeight: '600', 
                        marginBottom: '0.5rem',
                        fontSize: '0.9rem'
                      }}>
                        Confirmer le mot de passe
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirmer le mot de passe"
                        value={resetData.confirmPassword}
                        onChange={handleResetChange}
                        required
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid rgba(65, 105, 225, 0.3)',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          background: 'rgba(65, 105, 225, 0.05)',
                          color: '#00308F'
                        }}
                      />
                    </div>
                    
                    {resetData.newPassword && (
                      <div style={{ 
                        margin: '1.5rem 0',
                        padding: '1rem',
                        background: 'rgba(65, 105, 225, 0.05)',
                        borderRadius: '8px',
                        border: '1px solid rgba(65, 105, 225, 0.2)'
                      }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem', color: '#4169E1' }}>
                          Exigences de sécurité :
                        </div>
                        {Object.entries(validatePassword(resetData.newPassword)).map(([key, met]) => (
                          <PasswordRequirement
                            key={key}
                            met={met}
                            text={{
                              length: '8 caractères minimum',
                              uppercase: 'Une majuscule',
                              lowercase: 'Une minuscule', 
                              number: 'Un chiffre',
                              special: 'Un caractère spécial'
                            }[key]}
                          />
                        ))}
                      </div>
                    )}
                    
                    <button 
                      type="button" 
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: '#27ae60',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={handleResetPassword}
                      disabled={loading || !Object.values(validatePassword(resetData.newPassword)).every(req => req)}
                      onMouseOver={(e) => {
                        if (!loading && !e.target.disabled) {
                          e.target.style.background = '#219a52';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!loading && !e.target.disabled) {
                          e.target.style.background = '#27ae60';
                        }
                      }}
                    >
                      {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
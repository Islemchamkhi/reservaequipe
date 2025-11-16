import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-section" onClick={() => navigate('/')}>
          <h1>ReservaEquip</h1>
          <span>Gestion de Réservation d'Équipements</span>
        </div>

        <nav className="nav-section">
          {isLoggedIn ? (
            <div className="user-nav">
              <span className="welcome">Bienvenue, {user.firstName || user.email}!</span>
              <button className="nav-btn home-btn" onClick={() => navigate('/dashboard')}>
                Tableau de Bord
              </button>
              <button className="nav-btn logout-btn" onClick={handleLogout}>
                Déconnexion
              </button>
            </div>
          ) : (
            <div className="main-nav">
              <button className="nav-btn features-btn" onClick={() => navigate('/#features')}>
                Fonctionnalités
              </button>
              <button className="nav-btn about-btn" onClick={() => navigate('/#about')}>
                À Propos
              </button>
              <button className="nav-btn login-btn" onClick={() => navigate('/login')}>
                Connexion
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
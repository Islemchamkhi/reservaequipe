import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [equipment, setEquipment] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Charger les équipements
      const equipmentResponse = await fetch('http://localhost:5000/api/equipment', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (equipmentResponse.ok) {
        const equipmentData = await equipmentResponse.json();
        if (equipmentData.success) {
          setEquipment(equipmentData.data);
        }
      }

      // Charger les réservations
      const reservationsResponse = await fetch('http://localhost:5000/api/reservations', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (reservationsResponse.ok) {
        const reservationsData = await reservationsResponse.json();
        if (reservationsData.success) {
          setReservations(reservationsData.data);
        }
      }
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleReserveEquipment = async (equipmentId) => {
    try {
      const token = localStorage.getItem('token');
      
      // Créer une réservation de démonstration
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // +2 heures
      
      const response = await fetch('http://localhost:5000/api/reservations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          equipmentId: equipmentId,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          purpose: 'Test de réservation'
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Réservation créée avec succès!');
        loadData(); // Recharger les données
        setActiveTab('reservations');
      } else {
        alert(data.message || 'Erreur lors de la réservation');
      }
    } catch (error) {
      alert('Erreur lors de la réservation');
    }
  };

  const handleCancelReservation = async (reservationId) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/reservations/${reservationId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Réservation annulée avec succès!');
        loadData(); // Recharger les données
      } else {
        alert(data.message || 'Erreur lors de l\'annulation');
      }
    } catch (error) {
      alert('Erreur lors de l\'annulation');
    }
  };

  const getRoleDisplay = (role) => {
    const roles = {
      'user': 'Utilisateur Standard',
      'supervisor': 'Superviseur',
      'admin': 'Administrateur'
    };
    return roles[role] || role;
  };

  const getStatusDisplay = (status) => {
    const statuses = {
      'pending': 'En attente',
      'approved': 'Approuvée',
      'rejected': 'Rejetée',
      'cancelled': 'Annulée',
      'completed': 'Terminée'
    };
    return statuses[status] || status;
  };

  if (!user || loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        color: '#8B4513',
        fontSize: '1.2rem'
      }}>
        <div className="loading-spinner">Chargement...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <div className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1>Tableau de Bord</h1>
            
            <div className="hero-description">
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.8)', 
                padding: '2rem', 
                borderRadius: '15px',
                marginBottom: '2rem'
              }}>
                <p>Bienvenue, <strong>{user.firstName} {user.lastName}</strong> !</p>
                <p>Rôle: <strong>{getRoleDisplay(user.role)}</strong></p>
                <p>Email: <strong>{user.email}</strong></p>
                <button 
                  onClick={handleLogout}
                  className="nav-btn logout-btn"
                  style={{ marginTop: '1rem' }}
                >
                  Déconnexion
                </button>
              </div>
            </div>

            {/* Navigation par onglets */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '1rem', 
              marginBottom: '2rem',
              flexWrap: 'wrap'
            }}>
              <button 
                className={`nav-btn ${activeTab === 'overview' ? 'login-btn' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                📊 Aperçu
              </button>
              <button 
                className={`nav-btn ${activeTab === 'reservations' ? 'login-btn' : ''}`}
                onClick={() => setActiveTab('reservations')}
              >
                📅 Mes Réservations ({reservations.length})
              </button>
              <button 
                className={`nav-btn ${activeTab === 'equipment' ? 'login-btn' : ''}`}
                onClick={() => setActiveTab('equipment')}
              >
                🔧 Équipements ({equipment.length})
              </button>
            </div>

            {/* Contenu des onglets */}
            {activeTab === 'overview' && (
              <div>
                <div className="hero-features">
                  <div className="feature">
                    <div className="feature-icon">📅</div>
                    <div className="feature-text">
                      <strong>Mes Réservations</strong>
                      <span>{reservations.length} réservation(s) au total</span>
                      <span>{reservations.filter(r => r.status === 'pending').length} en attente</span>
                    </div>
                  </div>

                  <div className="feature">
                    <div className="feature-icon">🔍</div>
                    <div className="feature-text">
                      <strong>Équipements Disponibles</strong>
                      <span>{equipment.length} équipement(s) disponibles</span>
                    </div>
                  </div>

                  <div className="feature">
                    <div className="feature-icon">📈</div>
                    <div className="feature-text">
                      <strong>Statistiques</strong>
                      <span>Utilisation des équipements en temps réel</span>
                    </div>
                  </div>

                  {(user.role === 'supervisor' || user.role === 'admin') && (
                    <div className="feature">
                      <div className="feature-icon">👨‍💼</div>
                      <div className="feature-text">
                        <strong>Gestion des Réservations</strong>
                        <span>Validez les demandes de réservation</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Équipements récents */}
                <div style={{ marginTop: '2rem', background: 'rgba(255, 255, 255, 0.8)', padding: '1.5rem', borderRadius: '15px' }}>
                  <h3 style={{ color: '#8B4513', marginBottom: '1rem' }}>Équipements Disponibles</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                    {equipment.slice(0, 3).map((item) => (
                      <div key={item._id} style={{ 
                        border: '1px solid #ddd', 
                        borderRadius: '10px', 
                        padding: '1rem',
                        background: 'white'
                      }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#8B4513' }}>{item.name}</h4>
                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>{item.description}</p>
                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: '#666' }}>
                          <strong>Localisation:</strong> {item.location}
                        </p>
                        <button 
                          onClick={() => handleReserveEquipment(item._id)}
                          style={{
                            background: '#8B4513',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}
                        >
                          Réserver
                        </button>
                      </div>
                    ))}
                  </div>
                  {equipment.length > 3 && (
                    <button 
                      onClick={() => setActiveTab('equipment')}
                      style={{
                        marginTop: '1rem',
                        background: 'transparent',
                        border: '1px solid #8B4513',
                        color: '#8B4513',
                        padding: '0.5rem 1rem',
                        borderRadius: '5px',
                        cursor: 'pointer'
                      }}
                    >
                      Voir tous les équipements ({equipment.length})
                    </button>
                  )}
                </div>

                <div className="hero-actions">
                  <button 
                    className="btn-primary" 
                    onClick={() => setActiveTab('equipment')}
                  >
                    Voir tous les Équipements
                  </button>
                  <button 
                    className="btn-secondary" 
                    onClick={() => setActiveTab('reservations')}
                  >
                    Mes Réservations
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'reservations' && (
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.8)', 
                padding: '2rem', 
                borderRadius: '15px'
              }}>
                <h3 style={{ color: '#8B4513', marginBottom: '1rem' }}>Mes Réservations</h3>
                
                {reservations.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#666' }}>
                    Aucune réservation pour le moment.
                  </p>
                ) : (
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {reservations.map((reservation) => (
                      <div key={reservation._id} style={{ 
                        border: '1px solid #ddd', 
                        borderRadius: '10px', 
                        padding: '1rem',
                        background: 'white'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                          <h4 style={{ margin: 0, color: '#8B4513' }}>
                            {reservation.equipment?.name || 'Équipement inconnu'}
                          </h4>
                          <span style={{ 
                            padding: '0.25rem 0.5rem', 
                            borderRadius: '15px', 
                            fontSize: '0.8rem',
                            background: reservation.status === 'approved' ? '#d4edda' : 
                                       reservation.status === 'pending' ? '#fff3cd' : 
                                       reservation.status === 'rejected' ? '#f8d7da' : '#e2e3e5',
                            color: reservation.status === 'approved' ? '#155724' : 
                                  reservation.status === 'pending' ? '#856404' : 
                                  reservation.status === 'rejected' ? '#721c24' : '#383d41'
                          }}>
                            {getStatusDisplay(reservation.status)}
                          </span>
                        </div>
                        <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                          <strong>Date:</strong> {new Date(reservation.startTime).toLocaleString()} - {new Date(reservation.endTime).toLocaleString()}
                        </p>
                        <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                          <strong>Motif:</strong> {reservation.purpose}
                        </p>
                        {reservation.status === 'pending' && (
                          <button 
                            onClick={() => handleCancelReservation(reservation._id)}
                            style={{
                              background: 'transparent',
                              border: '1px solid #dc3545',
                              color: '#dc3545',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              fontSize: '0.8rem'
                            }}
                          >
                            Annuler
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'equipment' && (
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.8)', 
                padding: '2rem', 
                borderRadius: '15px'
              }}>
                <h3 style={{ color: '#8B4513', marginBottom: '1rem' }}>Équipements Disponibles</h3>
                
                {equipment.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#666' }}>
                    Aucun équipement disponible pour le moment.
                  </p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                    {equipment.map((item) => (
                      <div key={item._id} style={{ 
                        border: '1px solid #ddd', 
                        borderRadius: '10px', 
                        padding: '1.5rem',
                        background: 'white'
                      }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#8B4513' }}>{item.name}</h4>
                        <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem' }}>{item.description}</p>
                        
                        <div style={{ marginBottom: '1rem' }}>
                          <p style={{ margin: '0.25rem 0', fontSize: '0.8rem', color: '#666' }}>
                            <strong>📍 Localisation:</strong> {item.location}
                          </p>
                          <p style={{ margin: '0.25rem 0', fontSize: '0.8rem', color: '#666' }}>
                            <strong>⏰ Horaires:</strong> {item.availableHours?.start} - {item.availableHours?.end}
                          </p>
                          <p style={{ margin: '0.25rem 0', fontSize: '0.8rem', color: '#666' }}>
                            <strong>📋 Conditions:</strong> {item.accessConditions}
                          </p>
                          <p style={{ margin: '0.25rem 0', fontSize: '0.8rem', color: '#666' }}>
                            <strong>✅ Validation:</strong> {item.requiresApproval ? 'Manuelle' : 'Automatique'}
                          </p>
                        </div>
                        
                        <button 
                          onClick={() => handleReserveEquipment(item._id)}
                          style={{
                            background: '#8B4513',
                            color: 'white',
                            border: 'none',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            width: '100%'
                          }}
                        >
                          Réserver cet équipement
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pied de page */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <h3>ReservaEquip</h3>
                <p>Votre partenaire de gestion d'équipements</p>
              </div>
              <p className="footer-description">
                Plateforme de réservation d'équipements partagés - 
                Simplifiez la gestion de vos ressources.
              </p>
            </div>
            
            <div className="footer-section">
              <h4>Navigation</h4>
              <ul className="footer-links">
                <li><button onClick={() => navigate('/dashboard')}>Tableau de Bord</button></li>
                <li><button onClick={() => setActiveTab('reservations')}>Mes Réservations</button></li>
                <li><button onClick={() => setActiveTab('equipment')}>Équipements</button></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Support</h4>
              <ul className="footer-links">
                <li><span>Aide & Support</span></li>
                <li><span>Contact</span></li>
                <li><span>FAQ</span></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Légal</h4>
              <ul className="footer-links">
                <li><span>Mentions Légales</span></li>
                <li><span>Confidentialité</span></li>
                <li><span>CGU</span></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p>&copy; 2024 ReservaEquip. Tous droits réservés.</p>
              <div className="footer-social">
                <span>Suivez-nous :</span>
                <button className="social-icon">📘</button>
                <button className="social-icon">🐦</button>
                <button className="social-icon">📸</button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EquipmentManagement from './EquipmentManagement';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalEquipments: 0,
    availableEquipments: 0,
    maintenanceEquipments: 0,
    totalReservations: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
    loadStats();
  }, [navigate]);

  const loadStats = () => {
    // Simulation des statistiques
    const equipments = JSON.parse(localStorage.getItem('equipments')) || [];
    const available = equipments.filter(eq => eq.status === 'available').length;
    const maintenance = equipments.filter(eq => eq.status === 'maintenance').length;
    
    setStats({
      totalEquipments: equipments.length,
      availableEquipments: available,
      maintenanceEquipments: maintenance,
      totalReservations: Math.floor(Math.random() * 50) + 10 // Simulation
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        color: '#4169E1',
        fontSize: '1.2rem'
      }}>
        <div className="loading-spinner">Chargement...</div>
      </div>
    );
  }

  const getRoleDisplay = (role) => {
    const roles = {
      'user': 'Utilisateur Standard',
      'supervisor': 'Superviseur',
      'admin': 'Administrateur'
    };
    return roles[role] || role;
  };

  const StatCard = ({ icon, title, value, color }) => (
    <div style={{
      background: 'white',
      padding: '1.5rem',
      borderRadius: '15px',
      boxShadow: '0 5px 15px rgba(65, 105, 225, 0.1)',
      textAlign: 'center',
      border: `2px solid ${color}20`,
      transition: 'transform 0.3s ease'
    }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{icon}</div>
      <h3 style={{ color: '#4169E1', margin: '0.5rem 0', fontSize: '1.1rem' }}>{title}</h3>
      <div style={{ 
        fontSize: '2rem', 
        fontWeight: 'bold', 
        color: color,
        margin: '0.5rem 0'
      }}>
        {value}
      </div>
    </div>
  );

  const QuickAction = ({ icon, title, description, onClick, color = '#4169E1' }) => (
    <button
      onClick={onClick}
      style={{
        background: 'white',
        border: `2px solid ${color}30`,
        borderRadius: '12px',
        padding: '1.5rem',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        width: '100%',
        color: '#00308F'
      }}
      onMouseOver={(e) => {
        e.target.style.transform = 'translateY(-5px)';
        e.target.style.boxShadow = '0 10px 25px rgba(65, 105, 225, 0.2)';
      }}
      onMouseOut={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = 'none';
      }}
    >
      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{icon}</div>
      <h4 style={{ color, margin: '0 0 0.5rem 0' }}>{title}</h4>
      <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.4' }}>{description}</p>
    </button>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Header du Dashboard */}
      <div style={{
        background: 'linear-gradient(135deg, #4169E1 0%, #1E90FF 100%)',
        color: 'white',
        padding: '2rem 0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '2rem'
          }}>
            <div>
              <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2.5rem' }}>
                Tableau de Bord
              </h1>
              <div style={{ 
                background: 'rgba(255,255,255,0.2)', 
                padding: '1rem 1.5rem', 
                borderRadius: '10px',
                display: 'inline-block'
              }}>
                <p style={{ margin: '0.2rem 0', fontSize: '1.1rem' }}>
                  👋 Bienvenue, <strong>{user.firstName} {user.lastName}</strong>
                </p>
                <p style={{ margin: '0.2rem 0', fontSize: '0.9rem', opacity: 0.9 }}>
                  Rôle: {getRoleDisplay(user.role)} • Email: {user.email}
                </p>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              style={{
                padding: '0.75rem 1.5rem',
                border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.2)';
              }}
            >
               Déconnexion
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Navigation par onglets */}
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          marginBottom: '3rem',
          flexWrap: 'wrap',
          background: 'white',
          padding: '1rem',
          borderRadius: '15px',
          boxShadow: '0 5px 15px rgba(65, 105, 225, 0.1)',
          border: '2px solid #4169E1'
        }}>
          <button 
            onClick={() => setActiveTab('overview')}
            style={{ 
              flex: '1', 
              minWidth: '120px',
              padding: '1rem 1.5rem',
              border: `2px solid ${activeTab === 'overview' ? '#4169E1' : 'rgba(65, 105, 225, 0.3)'}`,
              borderRadius: '8px',
              background: activeTab === 'overview' ? '#4169E1' : 'rgba(65, 105, 225, 0.1)',
              color: activeTab === 'overview' ? 'white' : '#4169E1',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            📊 Aperçu
          </button>
          <button 
            onClick={() => setActiveTab('equipment')}
            style={{ 
              flex: '1', 
              minWidth: '120px',
              padding: '1rem 1.5rem',
              border: `2px solid ${activeTab === 'equipment' ? '#4169E1' : 'rgba(65, 105, 225, 0.3)'}`,
              borderRadius: '8px',
              background: activeTab === 'equipment' ? '#4169E1' : 'rgba(65, 105, 225, 0.1)',
              color: activeTab === 'equipment' ? 'white' : '#4169E1',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            🔧 Équipements
          </button>
          <button 
            onClick={() => setActiveTab('reservations')}
            style={{ 
              flex: '1', 
              minWidth: '120px',
              padding: '1rem 1.5rem',
              border: `2px solid ${activeTab === 'reservations' ? '#4169E1' : 'rgba(65, 105, 225, 0.3)'}`,
              borderRadius: '8px',
              background: activeTab === 'reservations' ? '#4169E1' : 'rgba(65, 105, 225, 0.1)',
              color: activeTab === 'reservations' ? 'white' : '#4169E1',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            📅 Réservations
          </button>
          {(user.role === 'supervisor' || user.role === 'admin') && (
            <button 
              onClick={() => setActiveTab('admin')}
              style={{ 
                flex: '1', 
                minWidth: '120px',
                padding: '1rem 1.5rem',
                border: `2px solid ${activeTab === 'admin' ? '#4169E1' : 'rgba(65, 105, 225, 0.3)'}`,
                borderRadius: '8px',
                background: activeTab === 'admin' ? '#4169E1' : 'rgba(65, 105, 225, 0.1)',
                color: activeTab === 'admin' ? 'white' : '#4169E1',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              ⚙️ Administration
            </button>
          )}
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'overview' && (
          <div>
            {/* Cartes de statistiques */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem',
              marginBottom: '3rem'
            }}>
              <StatCard 
                icon="🔧"
                title="Équipements Totaux"
                value={stats.totalEquipments}
                color="#4169E1"
              />
              <StatCard 
                icon="✅"
                title="Équipements Disponibles"
                value={stats.availableEquipments}
                color="#27ae60"
              />
              <StatCard 
                icon="🛠️"
                title="En Maintenance"
                value={stats.maintenanceEquipments}
                color="#f39c12"
              />
              <StatCard 
                icon="📅"
                title="Réservations"
                value={stats.totalReservations}
                color="#3498db"
              />
            </div>

            {/* Actions rapides */}
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '15px',
              boxShadow: '0 5px 15px rgba(65, 105, 225, 0.1)',
              marginBottom: '2rem',
              border: '2px solid #4169E1'
            }}>
              <h2 style={{ color: '#4169E1', marginBottom: '1.5rem' }}>Actions Rapides</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem'
              }}>
                <QuickAction
                  icon="🔍"
                  title="Voir les Équipements"
                  description="Parcourir tous les équipements disponibles"
                  onClick={() => setActiveTab('equipment')}
                  color="#4169E1"
                />
                <QuickAction
                  icon="📅"
                  title="Mes Réservations"
                  description="Consulter et gérer mes réservations"
                  onClick={() => setActiveTab('reservations')}
                  color="#3498db"
                />
                {(user.role === 'supervisor' || user.role === 'admin') && (
                  <QuickAction
                    icon="➕"
                    title="Ajouter un Équipement"
                    description="Ajouter un nouvel équipement au catalogue"
                    onClick={() => {
                      setActiveTab('equipment');
                      setTimeout(() => {
                        const addButton = document.querySelector('[class*="btn-primary"]');
                        if (addButton) addButton.click();
                      }, 100);
                    }}
                    color="#27ae60"
                  />
                )}
                <QuickAction
                  icon="📊"
                  title="Rapports d'Usage"
                  description="Consulter les statistiques d'utilisation"
                  onClick={() => alert('Fonctionnalité à venir! 📈')}
                  color="#9b59b6"
                />
              </div>
            </div>

            {/* Équipements récents */}
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '15px',
              boxShadow: '0 5px 15px rgba(65, 105, 225, 0.1)',
              border: '2px solid #4169E1'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <h2 style={{ color: '#4169E1', margin: 0 }}>Équipements Récents</h2>
                <button 
                  onClick={() => setActiveTab('equipment')}
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: '2px solid rgba(65, 105, 225, 0.3)',
                    borderRadius: '8px',
                    background: 'rgba(65, 105, 225, 0.1)',
                    color: '#4169E1',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'rgba(65, 105, 225, 0.2)';
                    e.target.style.borderColor = 'rgba(65, 105, 225, 0.5)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'rgba(65, 105, 225, 0.1)';
                    e.target.style.borderColor = 'rgba(65, 105, 225, 0.3)';
                  }}
                >
                  Voir tous les équipements →
                </button>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem'
              }}>
                {(() => {
                  const equipments = JSON.parse(localStorage.getItem('equipments')) || [];
                  const recentEquipments = equipments.slice(0, 2);
                  
                  if (recentEquipments.length === 0) {
                    return (
                      <div style={{
                        textAlign: 'center',
                        padding: '2rem',
                        gridColumn: '1 / -1',
                        color: '#00308F'
                      }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔧</div>
                        <p>Aucun équipement n'a été ajouté pour le moment.</p>
                        {(user.role === 'supervisor' || user.role === 'admin') && (
                          <button 
                            onClick={() => setActiveTab('equipment')}
                            style={{
                              padding: '0.75rem 1.5rem',
                              border: '2px solid #4169E1',
                              borderRadius: '8px',
                              background: '#4169E1',
                              color: 'white',
                              fontSize: '1rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              marginTop: '1rem'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.background = '#00308F';
                              e.target.style.borderColor = '#00308F';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.background = '#4169E1';
                              e.target.style.borderColor = '#4169E1';
                            }}
                          >
                            Ajouter le premier équipement
                          </button>
                        )}
                      </div>
                    );
                  }

                  return recentEquipments.map(equipment => (
                    <div key={equipment.id} style={{
                      background: 'rgba(65, 105, 225, 0.05)',
                      padding: '1.5rem',
                      borderRadius: '12px',
                      border: '2px solid rgba(65, 105, 225, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      transition: 'transform 0.3s ease'
                    }}>
                      <div style={{ fontSize: '2.5rem' }}>{equipment.image}</div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ color: '#4169E1', margin: '0 0 0.5rem 0' }}>
                          {equipment.name}
                        </h4>
                        <p style={{ 
                          color: '#00308F', 
                          margin: '0 0 0.5rem 0',
                          fontSize: '0.9rem'
                        }}>
                          {equipment.location}
                        </p>
                        <div style={{
                          display: 'inline-block',
                          background: equipment.status === 'available' ? '#27ae60' : 
                                    equipment.status === 'maintenance' ? '#f39c12' : '#e74c3c',
                          color: 'white',
                          padding: '0.2rem 0.8rem',
                          borderRadius: '15px',
                          fontSize: '0.8rem',
                          fontWeight: '600'
                        }}>
                          {equipment.status === 'available' ? 'Disponible' : 
                           equipment.status === 'maintenance' ? 'En Maintenance' : 'Hors Service'}
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'equipment' && (
          <EquipmentManagement userRole={user.role} />
        )}

        {activeTab === 'reservations' && (
          <div style={{
            background: 'white',
            padding: '3rem',
            borderRadius: '15px',
            boxShadow: '0 5px 15px rgba(65, 105, 225, 0.1)',
            textAlign: 'center',
            border: '2px solid #4169E1'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📅</div>
            <h2 style={{ color: '#4169E1', marginBottom: '1rem' }}>Gestion des Réservations</h2>
            <p style={{ color: '#00308F', marginBottom: '2rem', fontSize: '1.1rem' }}>
              Le système de réservation sera disponible dans le prochain sprint.
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <div style={{
                background: 'rgba(65, 105, 225, 0.05)',
                padding: '1.5rem',
                borderRadius: '10px',
                border: '2px dashed #4169E1'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
                <h4 style={{ color: '#4169E1', margin: '0 0 0.5rem 0' }}>Recherche</h4>
                <p style={{ color: '#00308F', margin: 0, fontSize: '0.9rem' }}>
                  Trouvez des créneaux disponibles
                </p>
              </div>
              <div style={{
                background: 'rgba(65, 105, 225, 0.05)',
                padding: '1.5rem',
                borderRadius: '10px',
                border: '2px dashed #4169E1'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
                <h4 style={{ color: '#4169E1', margin: '0 0 0.5rem 0' }}>Planning</h4>
                <p style={{ color: '#00308F', margin: 0, fontSize: '0.9rem' }}>
                  Visualisez le calendrier des réservations
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'admin' && (user.role === 'supervisor' || user.role === 'admin') && (
          <div style={{
            background: 'white',
            padding: '3rem',
            borderRadius: '15px',
            boxShadow: '0 5px 15px rgba(65, 105, 225, 0.1)',
            textAlign: 'center',
            border: '2px solid #4169E1'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚙️</div>
            <h2 style={{ color: '#4169E1', marginBottom: '1rem' }}>Espace Administration</h2>
            <p style={{ color: '#00308F', marginBottom: '2rem' }}>
              Interface d'administration complète - Disponible prochainement
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              <button style={{
                padding: '1rem',
                border: '2px solid rgba(65, 105, 225, 0.3)',
                borderRadius: '8px',
                background: 'rgba(65, 105, 225, 0.1)',
                color: '#4169E1',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}>
                👥 Gestion Utilisateurs
              </button>
              <button style={{
                padding: '1rem',
                border: '2px solid rgba(65, 105, 225, 0.3)',
                borderRadius: '8px',
                background: 'rgba(65, 105, 225, 0.1)',
                color: '#4169E1',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}>
                📊 Statistiques Avancées
              </button>
              <button style={{
                padding: '1rem',
                border: '2px solid rgba(65, 105, 225, 0.3)',
                borderRadius: '8px',
                background: 'rgba(65, 105, 225, 0.1)',
                color: '#4169E1',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}>
                ⚠️ Gestion des Incidents
              </button>
              <button style={{
                padding: '1rem',
                border: '2px solid rgba(65, 105, 225, 0.3)',
                borderRadius: '8px',
                background: 'rgba(65, 105, 225, 0.1)',
                color: '#4169E1',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}>
                🔧 Paramètres Système
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pied de page */}
      <footer style={{
        background: 'linear-gradient(135deg, #4169E1 0%, #1E90FF 100%)',
        color: 'white',
        marginTop: '4rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            padding: '3rem 0 2rem 0'
          }}>
            <div>
              <h3 style={{ margin: '0 0 1rem 0' }}>ReservaEquip</h3>
              <p style={{ margin: '0 0 1rem 0', opacity: 0.9 }}>
                Votre partenaire de gestion d'équipements
              </p>
              <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>
                Plateforme de réservation d'équipements partagés - 
                Simplifiez la gestion de vos ressources.
              </p>
            </div>
            
            <div>
              <h4 style={{ margin: '0 0 1rem 0' }}>Navigation</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  <button 
                    onClick={() => setActiveTab('overview')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      opacity: 0.8,
                      fontSize: '0.9rem'
                    }}
                  >
                    Tableau de Bord
                  </button>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <button 
                    onClick={() => setActiveTab('equipment')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      opacity: 0.8,
                      fontSize: '0.9rem'
                    }}
                  >
                    Équipements
                  </button>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <button 
                    onClick={() => setActiveTab('reservations')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      opacity: 0.8,
                      fontSize: '0.9rem'
                    }}
                  >
                    Réservations
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 style={{ margin: '0 0 1rem 0' }}>Support</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.5rem', opacity: 0.8, fontSize: '0.9rem' }}>Aide & Support</li>
                <li style={{ marginBottom: '0.5rem', opacity: 0.8, fontSize: '0.9rem' }}>Contact</li>
                <li style={{ marginBottom: '0.5rem', opacity: 0.8, fontSize: '0.9rem' }}>FAQ</li>
              </ul>
            </div>
            
            <div>
              <h4 style={{ margin: '0 0 1rem 0' }}>Légal</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.5rem', opacity: 0.8, fontSize: '0.9rem' }}>Mentions Légales</li>
                <li style={{ marginBottom: '0.5rem', opacity: 0.8, fontSize: '0.9rem' }}>Confidentialité</li>
                <li style={{ marginBottom: '0.5rem', opacity: 0.8, fontSize: '0.9rem' }}>CGU</li>
              </ul>
            </div>
          </div>
          
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.2)',
            padding: '1.5rem 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <p style={{ margin: 0, opacity: 0.8 }}>
              &copy; 2024 ReservaEquip. Tous droits réservés.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ opacity: 0.8, fontSize: '0.9rem' }}>Suivez-nous :</span>
              <button style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1.2rem',
                opacity: 0.8
              }}>📘</button>
              <button style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1.2rem',
                opacity: 0.8
              }}>🐦</button>
              <button style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1.2rem',
                opacity: 0.8
              }}>📸</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
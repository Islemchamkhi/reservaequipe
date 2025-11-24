import React from 'react';

const EquipmentDetails = ({ equipment, onClose, onEdit, userRole }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return '#27ae60';
      case 'maintenance': return '#f39c12';
      case 'out_of_service': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'maintenance': return 'En Maintenance';
      case 'out_of_service': return 'Hors Service';
      default: return 'Inconnu';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canEdit = userRole === 'admin' || userRole === 'supervisor';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '2rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '2rem',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        border: '3px solid #4169E1'
      }}>
        {/* En-tête */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '3rem' }}>{equipment.image}</div>
            <div>
              <h2 style={{ color: '#4169E1', margin: 0 }}>{equipment.name}</h2>
              <div style={{
                background: getStatusColor(equipment.status),
                color: 'white',
                padding: '0.3rem 1rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '600',
                display: 'inline-block',
                marginTop: '0.5rem'
              }}>
                {getStatusText(equipment.status)}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#4169E1'
            }}
          >
            ✕
          </button>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ color: '#4169E1', marginBottom: '0.5rem' }}>Description</h4>
          <p style={{ color: '#00308F', lineHeight: '1.6' }}>{equipment.description}</p>
        </div>

        {/* Localisation */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ color: '#4169E1', marginBottom: '0.5rem' }}>Localisation</h4>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            background: 'rgba(65, 105, 225, 0.1)',
            padding: '1rem',
            borderRadius: '10px'
          }}>
            <span style={{ fontSize: '1.2rem' }}>📍</span>
            <span style={{ color: '#4169E1', fontWeight: '500' }}>{equipment.location}</span>
          </div>
        </div>

        {/* Spécifications techniques */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ color: '#4169E1', marginBottom: '1rem' }}>Spécifications techniques</h4>
          <div style={{
            background: 'rgba(65, 105, 225, 0.1)',
            padding: '1.5rem',
            borderRadius: '12px'
          }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <div>
                <strong style={{ color: '#00308F', display: 'block', fontSize: '0.9rem' }}>Marque</strong>
                <span style={{ color: '#4169E1' }}>{equipment.specifications.marque}</span>
              </div>
              <div>
                <strong style={{ color: '#00308F', display: 'block', fontSize: '0.9rem' }}>Modèle</strong>
                <span style={{ color: '#4169E1' }}>{equipment.specifications.modele}</span>
              </div>
            </div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '1rem' 
            }}>
              <div>
                <strong style={{ color: '#00308F', display: 'block', fontSize: '0.9rem' }}>Année</strong>
                <span style={{ color: '#4169E1' }}>{equipment.specifications.annee}</span>
              </div>
              <div>
                <strong style={{ color: '#00308F', display: 'block', fontSize: '0.9rem' }}>Capacité</strong>
                <span style={{ color: '#4169E1' }}>{equipment.specifications.capacite}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Métadonnées */}
        <div style={{ 
          borderTop: '2px dashed rgba(65, 105, 225, 0.3)',
          paddingTop: '1.5rem'
        }}>
          <h4 style={{ color: '#4169E1', marginBottom: '1rem' }}>Informations système</h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '1rem',
            fontSize: '0.8rem',
            color: '#4169E1'
          }}>
            <div>
              <strong style={{ color: '#00308F' }}>Créé le:</strong><br />
              {formatDate(equipment.createdAt)}
            </div>
            <div>
              <strong style={{ color: '#00308F' }}>Modifié le:</strong><br />
              {formatDate(equipment.updatedAt)}
            </div>
          </div>
        </div>

        {/* Actions */}
        {canEdit && (
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '2rem',
            borderTop: '2px dashed rgba(65, 105, 225, 0.3)',
            paddingTop: '1.5rem'
          }}>
            <button
              onClick={() => onEdit(equipment)}
              style={{ 
                flex: 1,
                background: 'rgba(65, 105, 225, 0.1)',
                border: '2px solid rgba(65, 105, 225, 0.3)',
                color: '#4169E1',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                margin: 0
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
              ✏️ Modifier l'équipement
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentDetails;
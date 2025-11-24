import React from 'react';

const EquipmentCard = ({ equipment, onEdit, onDelete, onViewDetails, userRole }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return '#27ae60';
      case 'maintenance':
        return '#f39c12';
      case 'out_of_service':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'maintenance':
        return 'En Maintenance';
      case 'out_of_service':
        return 'Hors Service';
      default:
        return 'Inconnu';
    }
  };

  const canEdit = userRole === 'admin' || userRole === 'supervisor';

  return (
    <div className="equipment-card" style={{
      background: 'white',
      borderRadius: '15px',
      padding: '1.5rem',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      border: '2px solid #0099ffff',
      position: 'relative'
    }}>
      {/* Badge de statut */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        background: getStatusColor(equipment.status),
        color: 'white',
        padding: '0.3rem 0.8rem',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: '600'
      }}>
        {getStatusText(equipment.status)}
      </div>

      {/* Image/Icone */}
      <div style={{
        fontSize: '3rem',
        textAlign: 'center',
        marginBottom: '1rem'
      }}>
        {equipment.image}
      </div>

      {/* Informations */}
      <h3 style={{
        color: '#1a2bc1bf',
        marginBottom: '0.5rem',
        fontSize: '1.3rem'
      }}>
        {equipment.name}
      </h3>

      <p style={{
        color: '',
        marginBottom: '1rem',
        fontSize: '0.9rem',
        lineHeight: '1.4'
      }}>
        {equipment.description}
      </p>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1rem',
        color: '#757e99ff'
      }}>
        <span>📍</span>
        <span style={{ fontSize: '0.9rem' }}>{equipment.location}</span>
      </div>

      {/* Spécifications */}
      <div style={{
        background: 'rgba(65, 105, 225, 0.1)',
        padding: '0.8rem',
        borderRadius: '8px',
        marginBottom: '1.5rem'
      }}>
        <div style={{ fontSize: '0.8rem', color: '#00308F', fontWeight: '600', marginBottom: '0.3rem' }}>
          Spécifications:
        </div>
        <div style={{ fontSize: '0.75rem', color: '#4169E1' }}>
          {equipment.specifications.marque} {equipment.specifications.modele} • {equipment.specifications.annee}
        </div>
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        justifyContent: 'space-between'
      }}>
        <button
          onClick={() => onViewDetails(equipment)}
          className="nav-btn"
          style={{ flex: 1 }}
        >
          Détails
        </button>
        
        {canEdit && (
          <>
            <button
              onClick={() => onEdit(equipment)}
              className="nav-btn"
              style={{ 
                flex: 1,
                background: 'rgba(65, 105, 225, 0.1)',
                borderColor: 'rgba(65, 105, 225, 0.3)',
                color: '#4169E1'
              }}
            >
               Modifier
            </button>
            <button
              onClick={() => onDelete(equipment.id)}
              className="nav-btn"
              style={{ 
                flex: 1,
                background: '#4169E1',
                borderColor: '#4169E1',
                color: 'white'
              }}
            >
               Supprimer
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EquipmentCard;
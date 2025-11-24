import React, { useState, useEffect } from 'react';
import EquipmentService from '../services/equipmentService';
import EquipmentCard from './EquipmentCard';
import EquipmentForm from './EquipmentForm';
import EquipmentDetails from './EquipmentDetails';

const EquipmentManagement = ({ userRole }) => {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState(null);

  const canEdit = userRole === 'admin' || userRole === 'supervisor';

  useEffect(() => {
    loadEquipments();
  }, []);

  const loadEquipments = async () => {
    try {
      setLoading(true);
      const data = await EquipmentService.getAllEquipments();
      setEquipments(data);
    } catch (err) {
      setError('Erreur lors du chargement des équipements');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEquipment = async (equipmentData) => {
    try {
      await EquipmentService.createEquipment(equipmentData);
      await loadEquipments();
      setShowForm(false);
      setError('');
    } catch (err) {
      setError('Erreur lors de la création de l\'équipement');
    }
  };

  const handleUpdateEquipment = async (equipmentData) => {
    try {
      await EquipmentService.updateEquipment(editingEquipment.id, equipmentData);
      await loadEquipments();
      setEditingEquipment(null);
      setShowForm(false);
      setError('');
    } catch (err) {
      setError('Erreur lors de la modification de l\'équipement');
    }
  };

  const handleDeleteClick = (equipmentId) => {
    setEquipmentToDelete(equipmentId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await EquipmentService.deleteEquipment(equipmentToDelete);
      await loadEquipments();
      setError('');
    } catch (err) {
      setError('Erreur lors de la suppression de l\'équipement');
    } finally {
      setShowDeleteConfirm(false);
      setEquipmentToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setEquipmentToDelete(null);
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const results = await EquipmentService.searchEquipments(searchTerm);
      setEquipments(results);
    } catch (err) {
      setError('Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    loadEquipments();
  };

  const filteredEquipments = equipments.filter(equipment => {
    const matchesSearch = equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || equipment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const inputStyle = {
    width: '100%',
    padding: '1rem 1.2rem',
    border: '2px solid rgba(65, 105, 225, 0.3)',
    borderRadius: '12px',
    fontSize: '1rem',
    background: 'rgba(65, 105, 225, 0.05)',
    color: '#00308F',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease'
  };

  const inputFocusStyle = {
    outline: 'none',
    borderColor: '#4169E1',
    boxShadow: '0 0 0 3px rgba(65, 105, 225, 0.1)',
    background: 'white'
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        color: '#4169E1'
      }}>
        <div className="loading-spinner">Chargement des équipements...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* En-tête */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ color: '#4169E1', margin: 0 }}>Gestion des Équipements</h1>
          <p style={{ color: '#00308F', margin: '0.5rem 0 0 0' }}>
            {filteredEquipments.length} équipement(s) trouvé(s)
          </p>
        </div>
        
        {canEdit && (
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '0.75rem 1.5rem',
              border: '2px solid #4169E1',
              borderRadius: '8px',
              background: '#4169E1',
              color: 'white',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
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
            ➕ Nouvel équipement
          </button>
        )}
      </div>

      {/* Filtres et recherche */}
      <div style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '15px',
        boxShadow: '0 5px 15px rgba(65, 105, 225, 0.1)',
        marginBottom: '2rem',
        border: '2px solid #4169E1'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ color: '#00308F', fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>
              Rechercher
            </label>
            <input
              type="text"
              placeholder="Nom, description, localisation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ color: '#00308F', fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>
              Statut
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={inputStyle}
            >
              <option value="all">Tous les statuts</option>
              <option value="available">Disponible</option>
              <option value="maintenance">En maintenance</option>
              <option value="out_of_service">Hors service</option>
            </select>
          </div>

          <button
            onClick={handleSearch}
            style={{
              padding: '1rem 1.5rem',
              border: '2px solid #4169E1',
              borderRadius: '8px',
              background: '#4169E1',
              color: 'white',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              margin: 0,
              height: 'fit-content'
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
            🔍 Rechercher
          </button>

          <button
            onClick={handleResetFilters}
            style={{
              padding: '1rem 1.5rem',
              border: '2px solid rgba(149, 165, 166, 0.3)',
              borderRadius: '8px',
              background: 'rgba(149, 165, 166, 0.1)',
              color: '#5D6D7E',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              height: 'fit-content'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(149, 165, 166, 0.2)';
              e.target.style.borderColor = 'rgba(149, 165, 166, 0.5)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(149, 165, 166, 0.1)';
              e.target.style.borderColor = 'rgba(149, 165, 166, 0.3)';
            }}
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div style={{
          background: '#fee',
          border: '2px solid #e74c3c',
          color: '#c0392b',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          fontWeight: '500'
        }}>
          {error}
        </div>
      )}

      {/* Grille des équipements */}
      {filteredEquipments.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'white',
          borderRadius: '15px',
          border: '2px dashed #4169E1'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
          <h3 style={{ color: '#4169E1', marginBottom: '1rem' }}>Aucun équipement trouvé</h3>
          <p style={{ color: '#00308F' }}>
            {searchTerm || statusFilter !== 'all' 
              ? 'Aucun équipement ne correspond à vos critères de recherche.'
              : 'Aucun équipement n\'est enregistré pour le moment.'}
          </p>
          {canEdit && !showForm && (
            <button
              onClick={() => setShowForm(true)}
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
              ➕ Ajouter le premier équipement
            </button>
          )}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '2rem'
        }}>
          {filteredEquipments.map(equipment => (
            <EquipmentCard
              key={equipment.id}
              equipment={equipment}
              onEdit={(eq) => {
                setEditingEquipment(eq);
                setShowForm(true);
              }}
              onDelete={handleDeleteClick}
              onViewDetails={setSelectedEquipment}
              userRole={userRole}
            />
          ))}
        </div>
      )}

      {/* Formulaire de création/modification */}
      {showForm && (
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
          <EquipmentForm
            equipment={editingEquipment}
            onSubmit={editingEquipment ? handleUpdateEquipment : handleCreateEquipment}
            onCancel={() => {
              setShowForm(false);
              setEditingEquipment(null);
            }}
          />
        </div>
      )}

      {/* Détails de l'équipement */}
      {selectedEquipment && (
        <EquipmentDetails
          equipment={selectedEquipment}
          onClose={() => setSelectedEquipment(null)}
          onEdit={(eq) => {
            setSelectedEquipment(null);
            setEditingEquipment(eq);
            setShowForm(true);
          }}
          userRole={userRole}
        />
      )}

      {/* Modale de confirmation de suppression */}
      {showDeleteConfirm && (
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
          zIndex: 1001
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '15px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            border: '2px solid #4169E1',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#4169E1', marginBottom: '1rem' }}>Confirmation</h3>
            <p style={{ color: '#00308F', marginBottom: '2rem' }}>
              Êtes-vous sûr de vouloir supprimer cet équipement ?
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={handleCancelDelete}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '2px solid rgba(149, 165, 166, 0.3)',
                  borderRadius: '8px',
                  background: 'rgba(149, 165, 166, 0.1)',
                  color: '#5D6D7E',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(149, 165, 166, 0.2)';
                  e.target.style.borderColor = 'rgba(149, 165, 166, 0.5)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(149, 165, 166, 0.1)';
                  e.target.style.borderColor = 'rgba(149, 165, 166, 0.3)';
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDelete}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '2px solid #e74c3c',
                  borderRadius: '8px',
                  background: '#e74c3c',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#c0392b';
                  e.target.style.borderColor = '#c0392b';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = '#e74c3c';
                  e.target.style.borderColor = '#e74c3c';
                }}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentManagement;
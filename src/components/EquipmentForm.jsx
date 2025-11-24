import React, { useState, useEffect } from 'react';

const EquipmentForm = ({ equipment, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    status: 'available',
    image: '🔧',
    specifications: {
      marque: '',
      modele: '',
      annee: new Date().getFullYear(),
      capacite: ''
    }
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (equipment) {
      setFormData(equipment);
    }
  }, [equipment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('specifications.')) {
      const specField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est obligatoire';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est obligatoire';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'La localisation est obligatoire';
    }

    if (!formData.specifications.marque.trim()) {
      newErrors['specifications.marque'] = 'La marque est obligatoire';
    }

    if (!formData.specifications.modele.trim()) {
      newErrors['specifications.modele'] = 'Le modèle est obligatoire';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const imageOptions = [
    { value: '🔬', label: 'Microscope' },
    { value: '🖨️', label: 'Imprimante' },
    { value: '💻', label: 'Ordinateur' },
    { value: '🔧', label: 'Outil' },
    { value: '⚗️', label: 'Matériel Labo' },
    { value: '📡', label: 'Équipement Tech' },
    { value: '🔌', label: 'Électronique' },
    { value: '🛠️', label: 'Matériel Atelier' }
  ];

  const inputStyle = {
    width: '100%',
    padding: '1rem 1.2rem',
    border: '2px solid rgba(65, 105, 225, 0.3)',
    borderRadius: '12px',
    fontSize: '1rem',
    transition: 'all 0.3s',
    background: 'rgba(65, 105, 225, 0.05)',
    color: '#00308F',
    fontFamily: 'inherit'
  };

  const inputFocusStyle = {
    outline: 'none',
    borderColor: '#4169E1',
    boxShadow: '0 0 0 3px rgba(65, 105, 225, 0.1)',
    background: 'white'
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '2rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '15px',
        padding: '2rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        border: '2px solid #4169E1',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative'
      }}>
        {/* Bouton de fermeture */}
        <button
          onClick={onCancel}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(65, 105, 225, 0.1)',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#4169E1',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            fontWeight: 'bold'
          }}
          onMouseOver={(e) => {
            e.target.style.background = '#4169E1';
            e.target.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(65, 105, 225, 0.1)';
            e.target.style.color = '#4169E1';
          }}
          title="Fermer"
        >
          ✕
        </button>

        <h2 style={{ 
          color: '#4169E1', 
          marginBottom: '2rem',
          textAlign: 'center',
          paddingRight: '3rem'
        }}>
          {equipment ? 'Modifier l\'équipement' : 'Nouvel équipement'}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Informations de base */}
          <div className="form-group">
            <label htmlFor="name" style={{ color: '#00308F', fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>
              Nom de l'équipement *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Microscope Électronique"
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            />
            {errors.name && <span style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.5rem', display: 'block' }}>{errors.name}</span>}
          </div>

          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label htmlFor="description" style={{ color: '#00308F', fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description détaillée de l'équipement..."
              rows="3"
              style={{
                ...inputStyle,
                resize: 'vertical',
                minHeight: '80px'
              }}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, { ...inputStyle, resize: 'vertical', minHeight: '80px' })}
            />
            {errors.description && <span style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.5rem', display: 'block' }}>{errors.description}</span>}
          </div>

          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label htmlFor="location" style={{ color: '#00308F', fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>
              Localisation *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Ex: Laboratoire A - Salle B12"
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            />
            {errors.location && <span style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.5rem', display: 'block' }}>{errors.location}</span>}
          </div>

          {/* Statut et Image */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
            <div className="form-group">
              <label htmlFor="status" style={{ color: '#00308F', fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>
                Statut
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="available">Disponible</option>
                <option value="maintenance">En Maintenance</option>
                <option value="out_of_service">Hors Service</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="image" style={{ color: '#00308F', fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>
                Icône
              </label>
              <select
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                style={inputStyle}
              >
                {imageOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.value} {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Spécifications */}
          <div style={{ 
            background: 'rgba(65, 105, 225, 0.1)', 
            padding: '1.5rem', 
            borderRadius: '12px',
            margin: '1.5rem 0',
            border: '1px solid rgba(65, 105, 225, 0.2)'
          }}>
            <h4 style={{ color: '#4169E1', marginBottom: '1rem' }}>Spécifications techniques</h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="specifications.marque" style={{ color: '#00308F', fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>
                  Marque *
                </label>
                <input
                  type="text"
                  id="specifications.marque"
                  name="specifications.marque"
                  value={formData.specifications.marque}
                  onChange={handleChange}
                  placeholder="Ex: Zeiss"
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                />
                {errors['specifications.marque'] && (
                  <span style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.5rem', display: 'block' }}>
                    {errors['specifications.marque']}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="specifications.modele" style={{ color: '#00308F', fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>
                  Modèle *
                </label>
                <input
                  type="text"
                  id="specifications.modele"
                  name="specifications.modele"
                  value={formData.specifications.modele}
                  onChange={handleChange}
                  placeholder="Ex: EVO LS15"
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                />
                {errors['specifications.modele'] && (
                  <span style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.5rem', display: 'block' }}>
                    {errors['specifications.modele']}
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div className="form-group">
                <label htmlFor="specifications.annee" style={{ color: '#00308F', fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>
                  Année
                </label>
                <input
                  type="number"
                  id="specifications.annee"
                  name="specifications.annee"
                  value={formData.specifications.annee}
                  onChange={handleChange}
                  min="2000"
                  max={new Date().getFullYear()}
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="specifications.capacite" style={{ color: '#00308F', fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>
                  Capacité/Spécificité
                </label>
                <input
                  type="text"
                  id="specifications.capacite"
                  name="specifications.capacite"
                  value={formData.specifications.capacite}
                  onChange={handleChange}
                  placeholder="Ex: 500 000x magnification"
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <button
              type="button"
              onClick={onCancel}
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
              type="submit"
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
                margin: 0
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
              {equipment ? 'Modifier' : 'Créer'} l'équipement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquipmentForm;
// Service de simulation pour la gestion des équipements
class EquipmentService {
  constructor() {
    this.equipments = JSON.parse(localStorage.getItem('equipments')) || this.getInitialData();
    this.saveToLocalStorage();
  }

  getInitialData() {
    return [
      {
        id: '1',
        name: 'Microscope Électronique',
        description: 'Microscope électronique à balayage haute précision pour analyses scientifiques',
        location: 'Laboratoire de Biologie - Aile B',
        status: 'available',
        image: '🔬',
        specifications: {
          marque: 'Zeiss',
          modele: 'EVO LS15',
          annee: 2022,
          capacite: 'Analyse jusqu\'à 500 000x'
        },
        createdBy: '1',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        name: 'Imprimante 3D Professionnelle',
        description: 'Imprimante 3D haute résolution pour prototypes et pièces techniques',
        location: 'Atelier FabLab - Rez-de-chaussée',
        status: 'maintenance',
        image: '🖨️',
        specifications: {
          marque: 'Ultimaker',
          modele: 'S5',
          annee: 2023,
          capacite: 'Volume 330 x 240 x 300 mm'
        },
        createdBy: '1',
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-03-10')
      }
    ];
  }

  saveToLocalStorage() {
    localStorage.setItem('equipments', JSON.stringify(this.equipments));
  }

  // CREATE - Ajouter un nouvel équipement
  async createEquipment(equipmentData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newEquipment = {
          id: Date.now().toString(),
          ...equipmentData,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        this.equipments.push(newEquipment);
        this.saveToLocalStorage();
        resolve(newEquipment);
      }, 500);
    });
  }

  // READ - Récupérer tous les équipements
  async getAllEquipments() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.equipments]);
      }, 300);
    });
  }

  // READ - Récupérer un équipement par ID
  async getEquipmentById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const equipment = this.equipments.find(eq => eq.id === id);
        if (equipment) {
          resolve(equipment);
        } else {
          reject(new Error('Équipement non trouvé'));
        }
      }, 200);
    });
  }

  // UPDATE - Modifier un équipement
  async updateEquipment(id, equipmentData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.equipments.findIndex(eq => eq.id === id);
        if (index !== -1) {
          this.equipments[index] = {
            ...this.equipments[index],
            ...equipmentData,
            updatedAt: new Date()
          };
          this.saveToLocalStorage();
          resolve(this.equipments[index]);
        } else {
          reject(new Error('Équipement non trouvé'));
        }
      }, 500);
    });
  }

  // DELETE - Supprimer un équipement
  async deleteEquipment(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.equipments.findIndex(eq => eq.id === id);
        if (index !== -1) {
          this.equipments.splice(index, 1);
          this.saveToLocalStorage();
          resolve(true);
        } else {
          reject(new Error('Équipement non trouvé'));
        }
      }, 400);
    });
  }

  // Changer le statut d'un équipement
  async changeEquipmentStatus(id, status) {
    return this.updateEquipment(id, { status });
  }

  // Rechercher des équipements
  async searchEquipments(query) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.equipments.filter(equipment =>
          equipment.name.toLowerCase().includes(query.toLowerCase()) ||
          equipment.description.toLowerCase().includes(query.toLowerCase()) ||
          equipment.location.toLowerCase().includes(query.toLowerCase())
        );
        resolve(filtered);
      }, 300);
    });
  }
}

export default new EquipmentService();
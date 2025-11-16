const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  // Méthode générique pour les requêtes API
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Ajouter le token d'authentification si disponible
    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur API');
      }

      return data;
    } catch (error) {
      console.error('Erreur API:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Equipment endpoints
  async getEquipment() {
    return this.request('/equipment');
  }

  async getEquipmentById(id) {
    return this.request(`/equipment/${id}`);
  }

  // Reservation endpoints
  async getReservations() {
    return this.request('/reservations');
  }

  async createReservation(reservationData) {
    return this.request('/reservations', {
      method: 'POST',
      body: JSON.stringify(reservationData),
    });
  }

  async cancelReservation(id) {
    return this.request(`/reservations/${id}/cancel`, {
      method: 'PUT',
    });
  }

  // Mettre à jour le token
  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // Supprimer le token
  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

export default new ApiService();
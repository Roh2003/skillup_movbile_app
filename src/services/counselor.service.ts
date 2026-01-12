import api from './api';

const counselorService = {
  // Get all counselors
  async getAllCounselors() {
    const response = await api.get('/admin/counselor');
    return response.data;
  },

  // Get only active counselors
  async getActiveCounselors() {
    const response = await api.get('/admin/counselor', {
      params: { isActive: true },
    });
    return response.data;
  },

  // Get counselor by ID
  async getCounselorById(id: string) {
    const response = await api.get(`/admin/counselor/${id}`);
    return response.data;
  },

  // Update counselor active status (for counselor themselves)
  async updateActiveStatus(isActive: boolean) {
    const response = await api.patch('/admin/counselor/me/status', {
      isActive,
    });
    return response.data;
  },
};

export default counselorService;

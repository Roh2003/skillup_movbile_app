import api from './api';

const resourceService = {
    // Get all resources with optional filters
    async getAllResources(params = {}) {
        const response = await api.get('/resource', { params });
        return response.data;
    },

    // Get resource statistics
    async getResourceStats() {
        const response = await api.get('/resource/stats');
        return response.data;
    },

    // Get a single resource by ID
    async getResourceById(id: number) {
        const response = await api.get(`/resource/${id}`);
        return response.data;
    },

    // Increment download count
    async incrementDownload(id: number) {
        const response = await api.post(`/resource/${id}/download`);
        return response.data;
    },
};

export default resourceService;

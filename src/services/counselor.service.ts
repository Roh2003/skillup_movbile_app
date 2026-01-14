import api from './api';

interface ConsultationRequest {
  counselorId: string;
  requestType: 'INSTANT' | 'SCHEDULED';
  scheduledAt?: string;
  message?: string;
}

const counselorService = {
  /**
   * Get all active (online) counselors
   */
  async getActiveCounselors() {
    const response = await api.get('/admin/counselor/active');
    return response.data;
  },

  /**
   * Get all counselors (admin/user)
   */
  async getAllCounselors() {
    const response = await api.get('/admin/counselor');
    return response.data;
  },

  /**
   * Create consultation request (instant or scheduled)
   */
  async createConsultationRequest(data: ConsultationRequest) {
    const response = await api.post('/admin/counselor/request', data);
    return response.data;
  },

  /**
   * Get my meetings (for users)
   */
  async getMyMeetings(status?: string) {
    const params: any = { userType: 'user' };
    if (status) params.status = status;

    const response = await api.get('/admin/counselor/meetings', { params });
    return response.data;
  },

  /**
   * Get single meeting details
   */
  async getMeetingById(meetingId: string) {
    const response = await api.get(`/admin/counselor/meetings/${meetingId}`);
    return response.data;
  },

  /**
   * Join meeting (validates time, gets token)
   */
  async joinMeeting(meetingId: string) {
    const response = await api.post(`/admin/counselor/meetings/${meetingId}/join`, {
      userType: 'user'
    });
    return response.data;
  },

  /**
   * End meeting
   */
  async endMeeting(meetingId: string) {
    const response = await api.post('/admin/counselor/meetings/end', {
      meetingId
    });
    return response.data;
  },
};

export default counselorService;

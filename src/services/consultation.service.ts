import api from './api';

interface MeetingRequest {
  counselorId: string;
  requestType: 'INSTANT' | 'SCHEDULED';
  scheduledAt?: string;
  message?: string;
}

const consultationService = {
  // Request instant meeting
  async requestInstantMeeting(counselorId: string, message?: string) {
    const response = await api.post('/admin/counselor/request', {
      counselorId,
      requestType: 'INSTANT',
      message,
    });
    return response.data;
  },

  // Request scheduled meeting
  async requestScheduledMeeting(
    counselorId: string,
    scheduledAt: string,
    message?: string
  ) {
    const response = await api.post('/admin/counselor/request', {
      counselorId,
      requestType: 'SCHEDULED',
      scheduledAt,
      message,
    });
    return response.data;
  },

  // Get user's consultation requests
  async getMyRequests() {
    const response = await api.get('/admin/counselor/my-requests');
    return response.data;
  },

  // Get counselor's incoming requests
  async getCounselorRequests() {
    const response = await api.get('/admin/counselor/requests');
    return response.data;
  },

  // Accept request (counselor)
  async acceptRequest(requestId: number) {
    const response = await api.post(`/admin/counselor/requests/${requestId}/accept`);
    return response.data;
  },

  // Reject request (counselor)
  async rejectRequest(requestId: number) {
    const response = await api.post(`/admin/counselor/requests/${requestId}/reject`);
    return response.data;
  },

  // Get meeting details with Agora token
  async getMeetingDetails(meetingId: string) {
    const response = await api.get(`/admin/counselor/meetings/${meetingId}`);
    return response.data;
  },

  // Get counselor's scheduled meetings
  async getScheduledMeetings() {
    const response = await api.get('/admin/counselor/meetings?status=SCHEDULED');
    return response.data;
  },

  // Get completed meetings
  async getCompletedMeetings() {
    const response = await api.get('/admin/counselor/meetings?status=COMPLETED');
    return response.data;
  },

  // Get all counselor meetings
  async getCounselorMeetings() {
    const response = await api.get('/admin/counselor/meetings');
    return response.data;
  },

  // Set counselor availability (Online/Offline toggle)
  async toggleAvailability(isActive: boolean) {
    const response = await api.put('/admin/counselor/availability', { isActive });
    return response.data;
  },

  // Get counselor profile
  async getCounselorProfile() {
    const response = await api.get('/admin/counselor/profile');
    return response.data;
  },

  // Update counselor profile
  async updateCounselorProfile(data: {
    name?: string;
    bio?: string;
    profileImage?: string;
    specialization?: string;
  }) {
    const response = await api.patch('/admin/counselor/profile', data);
    return response.data;
  },

  // Get counselor revenue/earnings
  async getCounselorRevenue() {
    const response = await api.get('/admin/counselor/revenue');
    return response.data;
  },

  // Join meeting
  async joinMeeting(meetingId: string, userType: 'user' | 'counselor') {
    const response = await api.post(`/admin/counselor/meetings/${meetingId}/join`, {
      userType,
    });
    return response.data;
  },

  //End meeting
  async endMeeting(meetingId: string) {
    const response = await api.post('/admin/counselor/meetings/end', { meetingId });
    return response.data;
  },
};

export default consultationService;

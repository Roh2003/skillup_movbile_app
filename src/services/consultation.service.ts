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
    const response = await api.post('/meeting/request', {
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
    const response = await api.post('/meeting/request', {
      counselorId,
      requestType: 'SCHEDULED',
      scheduledAt,
      message,
    });
    return response.data;
  },

  // Get user's consultation requests
  async getMyRequests() {
    const response = await api.get('/meeting/my-requests');
    return response.data;
  },

  // Get counselor's incoming requests
  async getCounselorRequests() {
    const response = await api.get('/meeting/counselor/requests');
    return response.data;
  },

  // Accept request (counselor)
  async acceptRequest(requestId: number) {
    const response = await api.post(`/meeting/request/${requestId}/accept`);
    return response.data;
  },

  // Reject request (counselor)
  async rejectRequest(requestId: number) {
    const response = await api.post(`/meeting/request/${requestId}/reject`);
    return response.data;
  },

  // Get meeting details with Agora token
  async getMeetingDetails(meetingId: string) {
    const response = await api.get(`/meeting/${meetingId}`);
    return response.data;
  },

  // Get counselor's scheduled meetings
  async getScheduledMeetings() {
    const response = await api.get('/meeting/scheduled');
    return response.data;
  },

  // Get completed meetings
  async getCompletedMeetings() {
    const response = await api.get('/meeting/completed');
    return response.data;
  },

  // Mark meeting as completed
  async completeMeeting(meetingId: string) {
    const response = await api.post(`/meeting/${meetingId}/complete`);
    return response.data;
  },
};

export default consultationService;

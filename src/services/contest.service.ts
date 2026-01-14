import api from './api';

interface ContestAnswer {
  questionId: number;
  selectedOption: string;
}

const contestService = {
  // ========================================
  // Get all published contests (for mobile learners)
  // ========================================
  async getAllContests() {
    const response = await api.get('/admin/contest/published');
    return response.data;
  },

  // ========================================
  // Get contest details with questions
  // ========================================
  async getContestById(contestId: number) {
    const response = await api.get(`/admin/contest/${contestId}/details`);
    return response.data;
  },

  // ========================================
  // Start a contest attempt
  // ========================================
  async startContest(contestId: number) {
    const response = await api.post(`/admin/contest/${contestId}/start`);
    return response.data;
  },

  // ========================================
  // Submit contest answers
  // ========================================
  async submitContest(contestId: number, answers: ContestAnswer[], timeTaken: number) {
    const response = await api.post(`/admin/contest/${contestId}/submit`, {
      answers,
      timeTaken
    });
    return response.data;
  },

  // ========================================
  // Get leaderboard for a contest
  // ========================================
  async getLeaderboard(contestId: number) {
    const response = await api.get(`/admin/contest/${contestId}/leaderboard`);
    return response.data;
  },

  // ========================================
  // Get user's contest attempts (if backend supports it)
  // Note: This endpoint may not exist yet in the backend
  // ========================================
  async getMyAttempts() {
    const response = await api.get('/admin/contest/my-attempts');
    return response.data;
  },
};

export default contestService;

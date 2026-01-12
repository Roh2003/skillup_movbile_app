import api from './api';

const courseService = {
  // Get all published courses
  async getAllCourses(params = {}) {
    const response = await api.get('/admin/courses/courses', { params });
    return response.data;
  },

  // Get course by ID with lessons
  async getCourseById(courseId: number) {
    const response = await api.get(`/admin/courses/courses/${courseId}`);
    return response.data;
  },

  // Get all lessons for a course
  async getLessons(courseId: number) {
    const response = await api.get(`/admin/courses/${courseId}/lessons`);
    return response.data;
  },

  // Get lesson video details
  async getLessonVideo(lessonId: number) {
    const response = await api.get(`/admin/courses/lessons/${lessonId}`);
    return response.data;
  },

  // Enroll in a course (if you have this endpoint)
  async enrollCourse(courseId: number) {
    const response = await api.post(`/admin/courses/${courseId}/enroll`);
    return response.data;
  },

  // Get enrolled courses (if you have this endpoint)
  async getEnrolledCourses() {
    const response = await api.get('/admin/courses/enrolled');
    return response.data;
  },
};

export default courseService;

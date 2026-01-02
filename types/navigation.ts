export type RootStackParamList = {
  Splash: undefined
  RoleSelection: undefined
  LearnerLogin: undefined
  LearnerRegister: undefined
  CounsellorLogin: undefined
  LearnerMain: undefined
  CounsellorMain: undefined
  CourseDetail: { courseId: string }
  ConsultationRequest: { counsellorId: string }
}

export type LearnerTabParamList = {
  Home: undefined
  MyLearning: undefined
  Courses: undefined
  Challenges: undefined
  FreeResources: undefined
  Consultation: undefined
}

export type CounsellorTabParamList = {
  Requests: undefined
  Schedule: undefined
  Completed: undefined
  Earnings: undefined
}

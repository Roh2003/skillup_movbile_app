export type RootStackParamList = {
  Splash: undefined
  Onboarding: undefined
  Welcome: undefined
  RoleSelection: undefined
  LearnerLogin: undefined
  LearnerRegister: undefined
  ResetPassword: undefined
  CounsellorLogin: undefined
  Profile: undefined
  Notifications: undefined
  Options: undefined
  Bookmarks: undefined
  Chat: undefined
  Settings: undefined
  EditProfile: undefined
  VideoPlayer: { lessonId?: string; courseId?: string }
  CourseDetail: { courseId: string }
  ChallengeDetail: { challengeId: string }
  Leaderboard: undefined
  MeetingRequest: { counsellorId: string }
  MeetingRoom: { meetingId: string }
  CounsellorMeetingRoom: { meetingId: string }
  LearnerMain: undefined
  CounsellorMain: undefined
  CounsellorDashboard: undefined
  ConsultationRequest: { counsellorId: string }
  CounselorProfile: { counselorId: string }
  ScheduleMeeting: { counselorId: string }
  MyConsultations: undefined
  WaitingRoom: { meetingId: string }
  VideoCall: { meetingId: string; channelName: string; token: string }
  UnifiedVideoCall: { meetingId: string; token: string; appId: string; channelName: string; userType: 'user' | 'counselor'; participantName?: string }
  MeetingSummary: { meetingId: string }
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

export interface Course {
  id: string
  title: string
  instructor: string
  duration: string
  rating: number
  enrolled: boolean
  thumbnail?: string
  progress?: number
  category?: string
  level?: string
}

export interface Counsellor {
  id: string
  name: string
  specialization: string
  isActive: boolean
  rating?: number
}

export interface Challenge {
  id: string
  type: string
  title: string
  description: string
  points: number
  completed: boolean
  questions: any[]
  difficulty: string
  category?: string
}

export const mockCourses: Course[] = [
  {
    id: "1",
    title: "Introduction to React Native",
    instructor: "John Doe",
    duration: "4 weeks",
    rating: 4.5,
    enrolled: true,
    progress: 65,
    category: "Development",
    level: "Beginner",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
  },
  {
    id: "2",
    title: "Advanced JavaScript",
    instructor: "Jane Smith",
    duration: "6 weeks",
    rating: 4.8,
    enrolled: false,
    category: "Programming",
    level: "Advanced",
    thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400",
  },
  {
    id: "3",
    title: "UI/UX Design Fundamentals",
    instructor: "Alice Johnson",
    duration: "5 weeks",
    rating: 4.7,
    enrolled: true,
    progress: 30,
    category: "Design",
    level: "Intermediate",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400",
  },
  {
    id: "4",
    title: "Mobile App Development",
    instructor: "Bob Williams",
    duration: "8 weeks",
    rating: 4.9,
    enrolled: false,
    category: "Development",
    level: "Intermediate",
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400",
  },
]

export const mockCounsellors: Counsellor[] = [
  {
    id: "1",
    name: "Dr. Sarah Chen",
    specialization: "Career Guidance",
    isActive: true,
    rating: 4.9,
  },
  {
    id: "2",
    name: "Prof. Michael Brown",
    specialization: "Academic Planning",
    isActive: true,
    rating: 4.8,
  },
  {
    id: "3",
    name: "Dr. Emily Davis",
    specialization: "Skill Development",
    isActive: false,
    rating: 4.7,
  },
  {
    id: "4",
    name: "Mr. James Wilson",
    specialization: "Career Transition",
    isActive: true,
    rating: 4.6,
  },
]

export const mockChallenges: Challenge[] = [
  {
    id: "1",
    type: "daily",
    title: "Intro to Creative Thinking",
    description: "Answer daily creative thinking questions.",
    difficulty: "Easy",
    questions: [
      {
        id: "1",
        question: "What is brainstorming?",
        options: [
          "Coming up with new ideas as a group",
          "Solving math problems",
          "Making art in class",
          "Reading a book quietly"
        ],
        correctAnswer: 0
      },
      {
        id: "2",
        question: "Which tool can help generate creative ideas?",
        options: [
          "Calculator",
          "Mind map",
          "Ruler",
          "Dictionary"
        ],
        correctAnswer: 1
      }
    ],
    points: 0,
    completed: false
  },
  {
    id: "2",
    type: "daily",
    title: "Critical Thinking Basics",
    description: "Practice evaluating information and arguments.",
    difficulty: "Medium",
    questions: [
      {
        id: "1",
        question: "What does 'critical thinking' mean?",
        options: [
          "Thinking about something critically",
          "Questioning if information is reliable",
          "Only listening to friends",
          "Reading without understanding"
        ],
        correctAnswer: 1
      },
      {
        id: "2",
        question: "Which is an example of evaluating an argument?",
        options: [
          "Jumping to a conclusion",
          "Checking facts and sources",
          "Ignoring the other side",
          "Agreeing without thinking"
        ],
        correctAnswer: 1
      }
    ],
    points: 0,
    completed: false
  },
  {
    id: "3",
    type: "coding",
    title: "First Coding Challenge",
    description: "Beginner-level programming tasks to test your knowledge.",
    difficulty: "Easy",
    questions: [
      {
        id: "1",
        question: "What does HTML stand for?",
        options: [
          "HighText Machine Language",
          "HyperText Markup Language",
          "Hyperlinks and Text Markup Language",
          "Home Tool Markup Language"
        ],
        correctAnswer: 1
      },
      {
        id: "2",
        question: "Which language is used for styling web pages?",
        options: [
          "HTML",
          "JQuery",
          "CSS",
          "XML"
        ],
        correctAnswer: 2
      },
      {
        id: "3",
        question: "What symbol is used for single-line comments in JavaScript?",
        options: [
          "//",
          "/*",
          "#",
          "<!--"
        ],
        correctAnswer: 0
      }
    ],
    points: 0,
    completed: false
  },
  {
    id: "4",
    type: "coding",
    title: "Advanced Coding Quiz",
    description: "Tougher problems for code lovers.",
    difficulty: "Hard",
    questions: [
      {
        id: "1",
        question: "What function returns the number of elements in a Python list 'myList'?",
        options: [
          "length(myList)",
          "count(myList)",
          "len(myList)",
          "size(myList)"
        ],
        correctAnswer: 2
      },
      {
        id: "2",
        question: "Which of these describes a closure in JavaScript?",
        options: [
          "A function that returns itself",
          "A function having access to parent scope, even after parent function has closed",
          "A variable inside a loop",
          "A way to close a popup"
        ],
        correctAnswer: 1
      }
    ],
    points: 0,
    completed: false
  }
];

export const mockCompletedMeetings = [
  {
    id: "m1",
    learnerName: "Alice Francis",
    scheduledTime: "2024-05-03 15:00",
    topic: "Resume Review",
    duration: 30,
    earnings: 15,
    status: "completed",
  },
  {
    id: "m2",
    learnerName: "Bob Green",
    scheduledTime: "2024-05-06 11:30",
    topic: "Interview Prep",
    duration: 45,
    earnings: 22,
    status: "completed",
  },
  {
    id: "m3",
    learnerName: "Charlie Chan",
    scheduledTime: "2024-05-07 09:00",
    topic: "Career Planning",
    duration: 60,
    earnings: 30,
    status: "completed",
  },
  {
    id: "m4",
    learnerName: "Diana Rose",
    scheduledTime: "2024-05-11 17:45",
    topic: "Learning Strategies",
    duration: 40,
    earnings: 18,
    status: "completed",
  },
  {
    id: "m5",
    learnerName: "Eric Adams",
    scheduledTime: "2024-05-13 13:15",
    topic: "Portfolio Guidance",
    duration: 30,
    earnings: 15,
    status: "completed",
  },
];

export const mockMeetingRequests = [
  {
    id: "req1",
    learnerName: "Samantha Tran",
    requestedAt: "2024-05-12",
    preferredTime: "2024-05-14 10:00 AM",
    message: "Hi, I'd like some help polishing my resume for internships.",
    topic: "Resume Review",
  },
  {
    id: "req2",
    learnerName: "Jorge Medina",
    requestedAt: "2024-05-13",
    preferredTime: "2024-05-16 3:30 PM",
    message: "Can we discuss career paths in product management?",
    topic: "Career Guidance",
  },
  {
    id: "req3",
    learnerName: "Leila Hassan",
    requestedAt: "2024-05-13",
    preferredTime: "2024-05-17 9:00 AM",
    message: "I'd like help preparing for my interview next week.",
    topic: "Interview Prep",
  },
  {
    id: "req4",
    learnerName: "Daniel Osei",
    requestedAt: "2024-05-14",
    preferredTime: "2024-05-18 2:00 PM",
    message: "Looking for strategies to improve learning retention.",
    topic: "Learning Strategies",
  },
];

export const mockScheduledMeetings = [
  {
    id: "sched1",
    learnerName: "Anna Liu",
    scheduledTime: "2024-05-15 10:00",
    topic: "Resume Review",
    duration: 30,
  },
  {
    id: "sched2",
    learnerName: "Carlos Gomez",
    scheduledTime: "2024-05-15 12:30",
    topic: "Interview Prep",
    duration: 45,
  },
  {
    id: "sched3",
    learnerName: "Maya Patel",
    scheduledTime: "2024-05-15 15:00",
    topic: "Career Paths Discussion",
    duration: 60,
  },
];

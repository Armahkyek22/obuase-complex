import { 
  LoginCredentials, 
  AuthResponse, 
  Child, 
  AttendanceData, 
  GradeData, 
  Notification, 
  User,
  ProfileData,
  NotificationSettings,
  PaymentMethod,
  Transaction,
  ResultPeriod,
  PaymentRequest
} from '../types';

// Mock data for development
const MOCK_USER: User = {
  id: '1',
  name: 'Kwame Asante',
  email: 'kwame.asante@gmail.com',
  phone: '+233241234567',
  role: 'parent',
};

const MOCK_CHILDREN: Child[] = [
  {
    id: 'child_001',
    name: 'Ama Asante',
    grade: 'Grade 5',
    class: '5A',
    school: 'Accra International School',
    avatar: 'A',
    email: 'ama.asante@school.edu.gh',
  },
  {
    id: 'child_002',
    name: 'Kofi Asante',
    grade: 'Grade 3',
    class: '3B',
    school: 'Accra International School',
    avatar: 'K',
    email: 'kofi.asante@school.edu.gh',
  },
];

const MOCK_NOTIFICATIONS: Notification[] = [
  // General school notifications
  {
    id: 'notif_001',
    title: 'PTA Meeting Tomorrow',
    message: 'PTA Meeting tomorrow at 3 PM in the school auditorium. Your presence is highly appreciated.',
    date: new Date().toISOString(),
    type: 'announcement',
    isRead: false,
    priority: 'high',
  },
  {
    id: 'notif_002',
    title: 'School Cultural Day',
    message: 'Join us for the annual cultural day celebration next Friday. All students are expected to participate.',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'event',
    isRead: true,
    priority: 'low',
  },
  // Child-specific notifications
  {
    id: 'notif_003',
    title: 'Ama\'s Math Test Results',
    message: 'Ama scored 85% in the Mathematics test. Excellent work! Keep it up.',
    date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    type: 'grade',
    isRead: false,
    priority: 'medium',
    childId: 'child_001',
  },
  {
    id: 'notif_004',
    title: 'Kofi\'s Attendance Alert',
    message: 'Kofi was marked absent today. Please contact the school if this is incorrect.',
    date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    type: 'attendance',
    isRead: false,
    priority: 'high',
    childId: 'child_002',
  },
  {
    id: 'notif_005',
    title: 'Ama\'s Science Project Due',
    message: 'Reminder: Ama\'s science project is due next Monday. Please ensure she completes it on time.',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    type: 'announcement',
    isRead: true,
    priority: 'medium',
    childId: 'child_001',
  },
];

// Child-specific attendance data
const MOCK_ATTENDANCE_DATA: { [childId: string]: AttendanceData } = {
  'child_001': {
    childId: 'child_001',
    month: new Date().toISOString().slice(0, 7),
    year: new Date().getFullYear(),
    records: [
      { 
        id: 'att_001_001', 
        studentId: 'child_001', 
        studentName: 'Ama Asante', 
        className: '5A',
        date: '2024-10-01', 
        status: 'present',
        markedBy: 'teacher_001',
        markedAt: '2024-10-01T08:10:00Z'
      },
      { 
        id: 'att_001_002', 
        studentId: 'child_001', 
        studentName: 'Ama Asante', 
        className: '5A',
        date: '2024-10-02', 
        status: 'present',
        markedBy: 'teacher_001',
        markedAt: '2024-10-02T08:05:00Z'
      },
      { 
        id: 'att_001_003', 
        studentId: 'child_001', 
        studentName: 'Ama Asante', 
        className: '5A',
        date: '2024-10-03', 
        status: 'present',
        markedBy: 'teacher_001',
        markedAt: '2024-10-03T08:15:00Z'
      },
      { 
        id: 'att_001_004', 
        studentId: 'child_001', 
        studentName: 'Ama Asante', 
        className: '5A',
        date: '2024-10-04', 
        status: 'present',
        markedBy: 'teacher_001',
        markedAt: '2024-10-04T08:10:00Z'
      },
      { 
        id: 'att_001_007', 
        studentId: 'child_001', 
        studentName: 'Ama Asante', 
        className: '5A',
        date: '2024-10-07', 
        status: 'present',
        markedBy: 'teacher_001',
        markedAt: '2024-10-07T08:05:00Z'
      },
      { 
        id: 'att_001_008', 
        studentId: 'child_001', 
        studentName: 'Ama Asante', 
        className: '5A',
        date: '2024-10-08', 
        status: 'late', 
        reason: 'Traffic jam', 
        notes: 'Arrived 15 minutes late',
        markedBy: 'teacher_001',
        markedAt: '2024-10-08T08:20:00Z'
      },
      { 
        id: 'att_001_009', 
        studentId: 'child_001', 
        studentName: 'Ama Asante', 
        className: '5A',
        date: '2024-10-09', 
        status: 'present',
        markedBy: 'teacher_001',
        markedAt: '2024-10-09T08:10:00Z'
      },
      { 
        id: 'att_001_010', 
        studentId: 'child_001', 
        studentName: 'Ama Asante', 
        className: '5A',
        date: '2024-10-10', 
        status: 'present',
        markedBy: 'teacher_001',
        markedAt: '2024-10-10T08:05:00Z'
      },
      { 
        id: 'att_001_011', 
        studentId: 'child_001', 
        studentName: 'Ama Asante', 
        className: '5A',
        date: '2024-10-11', 
        status: 'absent', 
        reason: 'Sick', 
        notes: 'Had fever, doctor\'s note provided',
        markedBy: 'teacher_001',
        markedAt: '2024-10-11T08:00:00Z'
      },
      { 
        id: 'att_001_014', 
        studentId: 'child_001', 
        studentName: 'Ama Asante', 
        className: '5A',
        date: '2024-10-14', 
        status: 'present',
        markedBy: 'teacher_001',
        markedAt: '2024-10-14T08:10:00Z'
      },
      { 
        id: 'att_001_015', 
        studentId: 'child_001', 
        studentName: 'Ama Asante', 
        className: '5A',
        date: '2024-10-15', 
        status: 'present',
        markedBy: 'teacher_001',
        markedAt: '2024-10-15T08:05:00Z'
      },
      { 
        id: 'att_001_016', 
        studentId: 'child_001', 
        studentName: 'Ama Asante', 
        className: '5A',
        date: '2024-10-16', 
        status: 'present',
        markedBy: 'teacher_001',
        markedAt: '2024-10-16T08:10:00Z'
      },
      { 
        id: 'att_001_017', 
        studentId: 'child_001', 
        studentName: 'Ama Asante', 
        className: '5A',
        date: '2024-10-17', 
        status: 'present',
        markedBy: 'teacher_001',
        markedAt: '2024-10-17T08:05:00Z'
      },
      { 
        id: 'att_001_018', 
        studentId: 'child_001', 
        studentName: 'Ama Asante', 
        className: '5A',
        date: '2024-10-18', 
        status: 'present',
        markedBy: 'teacher_001',
        markedAt: '2024-10-18T08:10:00Z'
      },
      { 
        id: 'att_001_021', 
        studentId: 'child_001', 
        studentName: 'Ama Asante', 
        className: '5A',
        date: '2024-10-21', 
        status: 'present',
        markedBy: 'teacher_001',
        markedAt: '2024-10-21T08:05:00Z'
      },
    ],
    summary: {
      totalDays: 15,
      presentDays: 13,
      absentDays: 1,
      lateDays: 1,
      attendancePercentage: 93.3,
    },
  },
  'child_002': {
    childId: 'child_002',
    month: new Date().toISOString().slice(0, 7),
    year: new Date().getFullYear(),
    records: [
      { 
        id: 'att_002_001', 
        studentId: 'child_002', 
        studentName: 'Kofi Asante', 
        className: '3B',
        date: '2024-10-01', 
        status: 'present',
        markedBy: 'teacher_001',
        markedAt: '2024-10-01T08:10:00Z'
      },
      { 
        id: 'att_002_002', 
        studentId: 'child_002', 
        studentName: 'Kofi Asante', 
        className: '3B',
        date: '2024-10-02', 
        status: 'absent', 
        reason: 'Family emergency', 
        notes: 'Excused absence',
        markedBy: 'teacher_001',
        markedAt: '2024-10-02T08:00:00Z'
      },
      { 
        id: 'att_002_003', 
        studentId: 'child_002', 
        studentName: 'Kofi Asante', 
        className: '3B',
        date: '2024-10-03', 
        status: 'present',
        markedBy: 'teacher_001',
        markedAt: '2024-10-03T08:15:00Z'
      },
      { 
        id: 'att_002_004', 
        studentId: 'child_002', 
        studentName: 'Kofi Asante', 
        className: '3B',
        date: '2024-10-04', 
        status: 'present',
        markedBy: 'teacher_001',
        markedAt: '2024-10-04T08:10:00Z'
      },
      { 
        id: 'att_002_007', 
        studentId: 'child_002', 
        studentName: 'Kofi Asante', 
        className: '3B',
        date: '2024-10-07', 
        status: 'late', 
        reason: 'Overslept', 
        notes: 'Arrived 20 minutes late',
        markedBy: 'teacher_001',
        markedAt: '2024-10-07T08:25:00Z'
      },
      { 
        id: 'att_002_008', 
        studentId: 'child_002', 
        studentName: 'Kofi Asante', 
        className: '3B',
        date: '2024-10-08', 
        status: 'present',
        markedBy: 'teacher_001',
        markedAt: '2024-10-08T08:05:00Z'
      },
      { 
        id: 'att_002_009', 
        studentId: 'child_002', 
        studentName: 'Kofi Asante', 
        className: '3B',
        date: '2024-10-09', 
        status: 'present',
        markedBy: 'teacher_001',
        markedAt: '2024-10-09T08:10:00Z'
      },
      { 
        id: 'att_002_010', 
        studentId: 'child_002', 
        studentName: 'Kofi Asante', 
        className: '3B',
        date: '2024-10-10', 
        status: 'absent', 
        reason: 'Sick', 
        notes: 'Stomach flu',
        markedBy: 'teacher_001',
        markedAt: '2024-10-10T08:00:00Z'
      },
      { 
        id: 'att_002_011', 
        studentId: 'child_002', 
        studentName: 'Kofi Asante', 
        className: '3B',
        date: '2024-10-11', 
        status: 'present',
        markedBy: 'teacher_001',
        markedAt: '2024-10-11T08:10:00Z'
      },
      { 
        id: 'att_002_014', 
        studentId: 'child_002', 
        studentName: 'Kofi Asante', 
        className: '3B',
        date: '2024-10-14', 
        status: 'present',
        markedBy: 'teacher_001',
        markedAt: '2024-10-14T08:05:00Z'
      },
      { 
        id: 'att_002_015', 
        studentId: 'child_002', 
        studentName: 'Kofi Asante', 
        className: '3B',
        date: '2024-10-15', 
        status: 'present',
        markedBy: 'teacher_001',
        markedAt: '2024-10-15T08:10:00Z'
      },
      { 
        id: 'att_002_016', 
        studentId: 'child_002', 
        studentName: 'Kofi Asante', 
        className: '3B',
        date: '2024-10-16', 
        status: 'late', 
        reason: 'Doctor appointment', 
        notes: 'Medical appointment ran late',
        markedBy: 'teacher_001',
        markedAt: '2024-10-16T08:25:00Z'
      },
      { 
        id: 'att_002_017', 
        studentId: 'child_002', 
        studentName: 'Kofi Asante', 
        className: '3B',
        date: '2024-10-17', 
        status: 'present',
        markedBy: 'teacher_001',
        markedAt: '2024-10-17T08:10:00Z'
      },
      { 
        id: 'att_002_018', 
        studentId: 'child_002', 
        studentName: 'Kofi Asante', 
        className: '3B',
        date: '2024-10-18', 
        status: 'present',
        markedBy: 'teacher_001',
        markedAt: '2024-10-18T08:05:00Z'
      },
      { 
        id: 'att_002_021', 
        studentId: 'child_002', 
        studentName: 'Kofi Asante', 
        className: '3B',
        date: '2024-10-21', 
        status: 'absent', 
        reason: 'Sick', 
        notes: 'Cold symptoms',
        markedBy: 'teacher_001',
        markedAt: '2024-10-21T08:00:00Z'
      },
    ],
    summary: {
      totalDays: 15,
      presentDays: 10,
      absentDays: 3,
      lateDays: 2,
      attendancePercentage: 80.0,
    },
  },
};

// Child-specific grades data
const MOCK_GRADES_DATA: { [childId: string]: GradeData[] } = {
  'child_001': [
    {
      childId: 'child_001',
      subject: 'Mathematics',
      currentGrade: 'A-',
      records: [
        {
          id: 'grade_001',
          subject: 'Mathematics',
          grade: 'A-',
          score: 85,
          maxScore: 100,
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'exam',
          teacher: 'Mr. Mensah',
          comments: 'Excellent understanding of algebraic concepts. Keep up the good work!',
        },
        {
          id: 'grade_002',
          subject: 'Mathematics',
          grade: 'B+',
          score: 82,
          maxScore: 100,
          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'assignment',
          teacher: 'Mr. Mensah',
          comments: 'Good work on geometry problems.',
        },
      ],
      trend: 'improving',
    },
    {
      childId: 'child_001',
      subject: 'English Language',
      currentGrade: 'B+',
      records: [
        {
          id: 'grade_003',
          subject: 'English Language',
          grade: 'B+',
          score: 78,
          maxScore: 100,
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'exam',
          teacher: 'Mrs. Adjei',
          comments: 'Good essay writing skills. Work on grammar.',
        },
      ],
      trend: 'stable',
    },
    {
      childId: 'child_001',
      subject: 'Science',
      currentGrade: 'A',
      records: [
        {
          id: 'grade_004',
          subject: 'Science',
          grade: 'A',
          score: 92,
          maxScore: 100,
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'project',
          teacher: 'Dr. Osei',
          comments: 'Outstanding science project on renewable energy!',
        },
      ],
      trend: 'improving',
    },
    {
      childId: 'child_001',
      subject: 'Social Studies',
      currentGrade: 'B',
      records: [
        {
          id: 'grade_005',
          subject: 'Social Studies',
          grade: 'B',
          score: 75,
          maxScore: 100,
          date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'exam',
          teacher: 'Mr. Boateng',
          comments: 'Good knowledge of Ghanaian history.',
        },
      ],
      trend: 'stable',
    },
  ],
  'child_002': [
    {
      childId: 'child_002',
      subject: 'Mathematics',
      currentGrade: 'B',
      records: [
        {
          id: 'grade_006',
          subject: 'Mathematics',
          grade: 'B',
          score: 72,
          maxScore: 100,
          date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'exam',
          teacher: 'Mrs. Asante',
          comments: 'Good progress in basic arithmetic. Practice multiplication tables.',
        },
      ],
      trend: 'improving',
    },
    {
      childId: 'child_002',
      subject: 'English Language',
      currentGrade: 'A-',
      records: [
        {
          id: 'grade_007',
          subject: 'English Language',
          grade: 'A-',
          score: 88,
          maxScore: 100,
          date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'assignment',
          teacher: 'Miss Owusu',
          comments: 'Excellent reading comprehension and creative writing!',
        },
      ],
      trend: 'improving',
    },
    {
      childId: 'child_002',
      subject: 'Art & Craft',
      currentGrade: 'A+',
      records: [
        {
          id: 'grade_008',
          subject: 'Art & Craft',
          grade: 'A+',
          score: 95,
          maxScore: 100,
          date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'project',
          teacher: 'Mr. Tetteh',
          comments: 'Amazing creativity and artistic skills! Beautiful painting.',
        },
      ],
      trend: 'stable',
    },
    {
      childId: 'child_002',
      subject: 'Physical Education',
      currentGrade: 'A',
      records: [
        {
          id: 'grade_009',
          subject: 'Physical Education',
          grade: 'A',
          score: 90,
          maxScore: 100,
          date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'exam',
          teacher: 'Coach Amponsah',
          comments: 'Great athletic ability and team spirit!',
        },
      ],
      trend: 'stable',
    },
  ],
};

// Payment methods mock data
const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'momo_mtn',
    type: 'mobile_money',
    name: 'MTN Mobile Money',
    details: '*170#',
    isDefault: true,
  },
  {
    id: 'momo_vodafone',
    type: 'mobile_money',
    name: 'Vodafone Cash',
    details: '*110#',
    isDefault: false,
  },
  {
    id: 'momo_airteltigo',
    type: 'mobile_money',
    name: 'AirtelTigo Money',
    details: '*185#',
    isDefault: false,
  },
  {
    id: 'card_visa',
    type: 'card',
    name: 'Visa/Mastercard',
    details: 'Credit/Debit Card',
    isDefault: false,
  },
];

// Transaction history mock data
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn_001',
    amount: 50.00,
    currency: 'GHS',
    description: 'Terminal Results - Year 2, First Semester',
    status: 'completed',
    paymentMethod: 'MTN Mobile Money',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    reference: 'REF20241014001',
    resultPeriodId: 'period_001',
  },
  {
    id: 'txn_002',
    amount: 30.00,
    currency: 'GHS',
    description: 'Mock Results - Year 2, First Semester',
    status: 'completed',
    paymentMethod: 'Vodafone Cash',
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    reference: 'REF20241007001',
    resultPeriodId: 'period_002',
  },
  {
    id: 'txn_003',
    amount: 50.00,
    currency: 'GHS',
    description: 'Terminal Results - Year 1, Second Semester',
    status: 'failed',
    paymentMethod: 'MTN Mobile Money',
    date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    reference: 'REF20240930001',
    resultPeriodId: 'period_003',
  },
];

// Result periods mock data
const MOCK_RESULT_PERIODS: ResultPeriod[] = [
  // Ama's result periods
  {
    id: 'period_001',
    childId: 'child_001',
    title: 'Year 2, Second Semester',
    academicYear: '2024/2025',
    semester: 'Second Semester',
    type: 'terminal',
    price: 50.00,
    currency: 'GHS',
    isPaid: true,
    isAvailable: true,
    publishedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'period_002',
    childId: 'child_001',
    title: 'Year 2, First Semester',
    academicYear: '2024/2025',
    semester: 'First Semester',
    type: 'terminal',
    price: 50.00,
    currency: 'GHS',
    isPaid: false,
    isAvailable: true,
    publishedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'period_003',
    childId: 'child_001',
    title: 'Year 2, First Semester',
    academicYear: '2024/2025',
    semester: 'First Semester',
    type: 'mock',
    price: 30.00,
    currency: 'GHS',
    isPaid: true,
    isAvailable: true,
    publishedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'period_004',
    childId: 'child_001',
    title: 'Year 1, Second Semester',
    academicYear: '2023/2024',
    semester: 'Second Semester',
    type: 'terminal',
    price: 50.00,
    currency: 'GHS',
    isPaid: true,
    isAvailable: true,
    publishedDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'period_005',
    childId: 'child_001',
    title: 'Year 1, First Semester',
    academicYear: '2023/2024',
    semester: 'First Semester',
    type: 'terminal',
    price: 50.00,
    currency: 'GHS',
    isPaid: true,
    isAvailable: true,
    publishedDate: new Date(Date.now() - 240 * 24 * 60 * 60 * 1000).toISOString(),
  },
  // Kofi's result periods
  {
    id: 'period_006',
    childId: 'child_002',
    title: 'Year 1, Second Semester',
    academicYear: '2024/2025',
    semester: 'Second Semester',
    type: 'terminal',
    price: 50.00,
    currency: 'GHS',
    isPaid: false,
    isAvailable: true,
    publishedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'period_007',
    childId: 'child_002',
    title: 'Year 1, First Semester',
    academicYear: '2024/2025',
    semester: 'First Semester',
    type: 'terminal',
    price: 50.00,
    currency: 'GHS',
    isPaid: true,
    isAvailable: true,
    publishedDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'period_008',
    childId: 'child_002',
    title: 'Year 1, First Semester',
    academicYear: '2024/2025',
    semester: 'First Semester',
    type: 'mock',
    price: 30.00,
    currency: 'GHS',
    isPaid: true,
    isAvailable: true,
    publishedDate: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

class MockApiService {
  private isOnline = true;
  private delay = 1000; // Simulate network delay
  private onSessionExpired?: () => Promise<void>;

  setSessionExpiredHandler(handler: () => Promise<void>) {
    this.onSessionExpired = handler;
  }

  // Simulate network delay
  private async simulateDelay(): Promise<void> {
    if (this.delay > 0) {
      await new Promise(resolve => setTimeout(resolve, this.delay));
    }
  }

  // Clear authentication tokens
  async clearTokens(): Promise<void> {
    // In a real app, this would clear tokens from secure storage
    await this.simulateDelay();
    // No tokens to clear in mock, but we simulate the delay
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await this.clearTokens();
      // In a real app, this would also invalidate the token on the server
      await this.simulateDelay();
    } catch (error) {
      console.warn('Error during logout:', error);
      throw error;
    }
  }

  // Simulate network errors occasionally
  private shouldSimulateError(): boolean {
    return Math.random() < 0.1; // 10% chance of error
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await this.simulateDelay();

    if (this.shouldSimulateError()) {
      throw new Error('Network error: Unable to connect to server');
    }

    // Simple validation for demo
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }

    // Mock successful login
    const authResponse: AuthResponse = {
      user: MOCK_USER,
      token: 'mock_jwt_token_' + Date.now(),
      refreshToken: 'mock_refresh_token_' + Date.now(),
      children: MOCK_CHILDREN,
    };

    return authResponse;
  }

  async refreshToken(): Promise<string> {
    await this.simulateDelay();
    
    if (this.shouldSimulateError()) {
      throw new Error('Token refresh failed');
    }

    return 'mock_refreshed_token_' + Date.now();
  }

  async logout(): Promise<void> {
    await this.simulateDelay();
    // Mock logout - always succeeds
  }

  async clearTokens(): Promise<void> {
    // Mock implementation
  }

  async getChildren(): Promise<Child[]> {
    await this.simulateDelay();
    
    if (this.shouldSimulateError()) {
      throw new Error('Failed to fetch children data');
    }

    return MOCK_CHILDREN;
  }

  async getAttendance(childId: string, month: string): Promise<AttendanceData> {
    await this.simulateDelay();
    
    if (this.shouldSimulateError()) {
      throw new Error('Failed to fetch attendance data');
    }

    const attendanceData = MOCK_ATTENDANCE_DATA[childId];
    if (!attendanceData) {
      throw new Error(`No attendance data found for child ${childId}`);
    }

    return {
      ...attendanceData,
      month,
    };
  }

  async getGrades(childId: string): Promise<GradeData[]> {
    await this.simulateDelay();
    
    if (this.shouldSimulateError()) {
      throw new Error('Failed to fetch grades data');
    }

    const gradesData = MOCK_GRADES_DATA[childId];
    if (!gradesData) {
      throw new Error(`No grades data found for child ${childId}`);
    }

    return gradesData;
  }

  async getNotifications(): Promise<Notification[]> {
    await this.simulateDelay();
    
    if (this.shouldSimulateError()) {
      throw new Error('Failed to fetch notifications');
    }

    // Return all notifications (general + child-specific)
    // In a real app, the backend would filter based on parent's children
    return MOCK_NOTIFICATIONS.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // Get notifications for a specific child
  async getChildNotifications(childId: string): Promise<Notification[]> {
    await this.simulateDelay();
    
    if (this.shouldSimulateError()) {
      throw new Error('Failed to fetch child notifications');
    }

    return MOCK_NOTIFICATIONS
      .filter(notification => !notification.childId || notification.childId === childId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getUserProfile(): Promise<User> {
    await this.simulateDelay();
    
    if (this.shouldSimulateError()) {
      throw new Error('Failed to fetch user profile');
    }

    return MOCK_USER;
  }

  async updateProfile(profile: ProfileData): Promise<void> {
    await this.simulateDelay();
    
    if (this.shouldSimulateError()) {
      throw new Error('Failed to update profile');
    }

    // Mock success
  }

  async updateNotificationSettings(settings: NotificationSettings): Promise<void> {
    await this.simulateDelay();
    
    if (this.shouldSimulateError()) {
      throw new Error('Failed to update notification settings');
    }

    // Mock success
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    await this.simulateDelay();
    
    if (this.shouldSimulateError()) {
      throw new Error('Failed to mark notification as read');
    }

    // Mock success
  }

  async checkAuthToken(): Promise<boolean> {
    // Mock implementation - always return true for demo
    return true;
  }

  async isAuthenticated(): Promise<boolean> {
    await this.simulateDelay();
    return true;
  }

  // Payment and Results methods
  async getResultPeriods(childId: string): Promise<ResultPeriod[]> {
    await this.simulateDelay();
    
    if (this.shouldSimulateError()) {
      throw new Error('Failed to fetch result periods');
    }

    return MOCK_RESULT_PERIODS.filter(period => period.childId === childId);
  }

  async getTransactionHistory(): Promise<Transaction[]> {
    await this.simulateDelay();
    
    if (this.shouldSimulateError()) {
      throw new Error('Failed to fetch transaction history');
    }

    return MOCK_TRANSACTIONS;
  }

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    await this.simulateDelay();
    
    if (this.shouldSimulateError()) {
      throw new Error('Failed to fetch payment methods');
    }

    return MOCK_PAYMENT_METHODS;
  }

  async initiatePayment(paymentRequest: PaymentRequest): Promise<{ transactionId: string; paymentUrl?: string }> {
    await this.simulateDelay();
    
    if (this.shouldSimulateError()) {
      throw new Error('Payment initiation failed');
    }

    // Simulate payment initiation
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // In a real app, this would return a payment URL for mobile money or card payments
    return {
      transactionId,
      paymentUrl: `https://payment.provider.com/pay/${transactionId}`,
    };
  }

  async verifyPayment(transactionId: string): Promise<Transaction> {
    await this.simulateDelay();
    
    if (this.shouldSimulateError()) {
      throw new Error('Payment verification failed');
    }

    // Simulate successful payment
    const transaction: Transaction = {
      id: transactionId,
      amount: 50.00,
      currency: 'GHS',
      description: 'Terminal Results Access',
      status: 'completed',
      paymentMethod: 'Mobile Money',
      date: new Date().toISOString(),
      reference: `REF${Date.now()}`,
    };

    return transaction;
  }

  async getResultsForPeriod(periodId: string): Promise<GradeData[]> {
    await this.simulateDelay();
    
    if (this.shouldSimulateError()) {
      throw new Error('Failed to fetch results for period');
    }

    // Check if period is paid for
    const period = MOCK_RESULT_PERIODS.find(p => p.id === periodId);
    if (!period?.isPaid) {
      throw new Error('Payment required to access results');
    }

    // Return child-specific grades for the period
    return MOCK_GRADES_DATA[period.childId] || [];
  }

  // Development utilities
  setNetworkDelay(ms: number): void {
    this.delay = ms;
  }

  setOnlineStatus(online: boolean): void {
    this.isOnline = online;
  }
}

export const mockApiService = new MockApiService();
export default mockApiService;
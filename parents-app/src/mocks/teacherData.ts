export const mockTeacherClasses = [
  {
    id: 'nursery',
    name: 'Nursery',
    subjects: ['Reading', 'Writing', 'Play Time'],
    time: '08:00 AM - 10:00 AM',
    room: 'Nursery Room'
  },
  {
    id: 'kg1',
    name: 'KG 1',
    subjects: ['English', 'Numeracy', 'R.M.E'],
    time: '10:15 AM - 12:15 PM',
    room: 'KG 1 Room'
  },
  {
    id: 'p1',
    name: 'Primary 1',
    subjects: ['English', 'Mathematics', 'Science'],
    time: '08:00 AM - 09:30 AM',
    room: 'Room 101'
  },
  {
    id: 'p2',
    name: 'Primary 2',
    subjects: ['English', 'Mathematics', 'Science', 'Computing'],
    time: '09:45 AM - 11:15 AM',
    room: 'Room 102'
  },
  {
    id: 'jhs1',
    name: 'JHS 1',
    subjects: ['English', 'Mathematics', 'Integrated Science', 'Computing', 'R.M.E', 'Social Studies'],
    time: '11:30 AM - 01:00 PM',
    room: 'JHS 1 Block'
  },
  {
    id: 'jhs2',
    name: 'JHS 2',
    subjects: ['English', 'Mathematics', 'Integrated Science', 'Computing', 'R.M.E', 'Social Studies'],
    time: '01:30 PM - 03:00 PM',
    room: 'JHS 2 Block'
  }
];

export const mockTeacherProfile = {
  id: 'teacher123',
  name: 'John Doe',
  email: 'john.doe@school.edu',
  phone: '+1234567890',
  subjects: ['Mathematics', 'Science', 'Computing'],
  classes: ['Primary 1', 'Primary 2', 'JHS 1'],
  joinDate: '2023-01-15'
};

export const mockUpcomingTasks = [
  {
    id: 'task1',
    title: 'Grade Math Quiz',
    due: 'Today',
    subject: 'Mathematics',
    class: 'Primary 1',
    priority: 'high'
  },
  {
    id: 'task2',
    title: 'Prepare Science Lesson',
    due: 'Tomorrow',
    subject: 'Science',
    class: 'JHS 1',
    priority: 'medium'
  },
  {
    id: 'task3',
    title: 'Submit Term Report',
    due: 'In 3 days',
    subject: 'All',
    class: 'All Classes',
    priority: 'high'
  }
];

export const mockAttendanceData = [
  {
    id: 'att1',
    date: '2023-11-18',
    class: 'Primary 1',
    present: 24,
    absent: 2,
    total: 26
  },
  {
    id: 'att2',
    date: '2023-11-17',
    class: 'JHS 1',
    present: 28,
    absent: 1,
    total: 29
  }
];

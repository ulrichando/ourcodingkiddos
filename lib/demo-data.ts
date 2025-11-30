// Demo data for development and fallback scenarios
// This data is used when the database is unavailable or for testing

export const demoUsersRaw = [
  {
    id: "demo-admin-1",
    name: "Admin Demo",
    email: "admin@ourcodingkiddos.com",
    role: "ADMIN",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "demo-parent-1",
    name: "Jane Parent",
    email: "jane.parent@ourcodingkiddos.com",
    role: "PARENT",
    createdAt: new Date("2024-02-15"),
  },
  {
    id: "demo-student-1",
    name: "Tommy Smith",
    email: "tommy.student@ourcodingkiddos.com",
    role: "STUDENT",
    createdAt: new Date("2024-02-16"),
  },
  {
    id: "demo-instructor-1",
    name: "Sarah Instructor",
    email: "sarah.instructor@ourcodingkiddos.com",
    role: "INSTRUCTOR",
    createdAt: new Date("2024-01-10"),
  },
];

export const demoStudentsRaw = [
  {
    id: "demo-student-profile-1",
    name: "Tommy Smith",
    age: 10,
    dob: new Date("2014-03-15"),
    totalXp: 1250,
    currentLevel: 5,
    parentEmail: "jane.parent@ourcodingkiddos.com",
    user: {
      email: "tommy.student@ourcodingkiddos.com",
      name: "Tommy Smith",
      createdAt: new Date("2024-02-16"),
    },
    guardian: {
      user: {
        email: "jane.parent@ourcodingkiddos.com",
      },
    },
  },
  {
    id: "demo-student-profile-2",
    name: "Emma Johnson",
    age: 12,
    dob: new Date("2012-07-22"),
    totalXp: 2100,
    currentLevel: 8,
    parentEmail: "parent2@ourcodingkiddos.com",
    user: {
      email: "emma.student@ourcodingkiddos.com",
      name: "Emma Johnson",
      createdAt: new Date("2024-03-01"),
    },
    guardian: {
      user: {
        email: "parent2@ourcodingkiddos.com",
      },
    },
  },
];

export const demoCoursesRaw = [
  {
    id: "demo-course-1",
    title: "Python for Beginners",
    language: "PYTHON",
    level: "BEGINNER",
    ageGroup: "AGES_7_10",
    isPublished: true,
  },
  {
    id: "demo-course-2",
    title: "JavaScript Fundamentals",
    language: "JAVASCRIPT",
    level: "INTERMEDIATE",
    ageGroup: "AGES_11_14",
    isPublished: true,
  },
  {
    id: "demo-course-3",
    title: "Web Development with HTML & CSS",
    language: "HTML",
    level: "BEGINNER",
    ageGroup: "AGES_7_10",
    isPublished: false,
  },
];

export const demoSubscriptionsRaw = [
  {
    id: "demo-sub-1",
    parentEmail: "jane.parent@ourcodingkiddos.com",
    planType: "MONTHLY",
    status: "ACTIVE",
    priceCents: 2900,
    currentPeriodStart: new Date("2024-01-01"),
    currentPeriodEnd: new Date("2024-12-31"),
    endDate: null,
    user: {
      email: "jane.parent@ourcodingkiddos.com",
    },
  },
  {
    id: "demo-sub-2",
    parentEmail: "parent2@ourcodingkiddos.com",
    planType: "ANNUAL",
    status: "ACTIVE",
    priceCents: 29900,
    currentPeriodStart: new Date("2024-01-01"),
    currentPeriodEnd: new Date("2025-01-01"),
    endDate: null,
    user: {
      email: "parent2@ourcodingkiddos.com",
    },
  },
];

export const demoParentsRaw = [
  {
    id: "demo-parent-profile-1",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Springfield, USA",
    user: {
      name: "Jane Parent",
      email: "jane.parent@ourcodingkiddos.com",
    },
    _count: {
      children: 1,
    },
  },
  {
    id: "demo-parent-profile-2",
    phone: "+1 (555) 987-6543",
    address: "456 Oak Ave, Riverside, USA",
    user: {
      name: "John Doe",
      email: "parent2@ourcodingkiddos.com",
    },
    _count: {
      children: 2,
    },
  },
];

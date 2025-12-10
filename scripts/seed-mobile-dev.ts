import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// Mobile Development content generator
function generateContent(title: string, description: string, level: string) {
  const levelEmoji = { BEGINNER: "📱", INTERMEDIATE: "🚀", ADVANCED: "⚡", EXPERT: "🔥", MASTER: "👑" }[level] || "📱";

  return {
    content: `<h2>${levelEmoji} ${title}</h2>
<p><strong>Welcome, future app developer!</strong> ${description}</p>

<h3>📚 What You'll Learn</h3>
<p>Mobile development lets you create apps that run on smartphones and tablets. Billions of people use mobile apps every day!</p>

<h3>🎯 Key Concepts</h3>
<ul>
<li><strong>Components:</strong> Building blocks of mobile apps - buttons, text, images, lists</li>
<li><strong>State:</strong> Data that changes and makes your app interactive</li>
<li><strong>Navigation:</strong> Moving between different screens in your app</li>
<li><strong>APIs:</strong> Connecting your app to the internet and services</li>
</ul>

<h3>💡 Fun Fact</h3>
<p>There are over 5 million apps in app stores! The average person uses 10 apps daily. Your app could be one of them!</p>

<h3>🚀 Let's Practice!</h3>
<p>Mobile apps are everywhere - games, social media, productivity tools. Let's build something amazing!</p>`,
    exampleCode: getExampleCode(title, level),
    exerciseInstructions: `🎯 Your Challenge:\n${getExercise(title, level)}`,
    exerciseStarterCode: getStarterCode(title, level),
  };
}

function getExampleCode(title: string, level: string): string {
  if (level === "BEGINNER") {
    return `// React Native - Your First Component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function HelloWorld() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello, Mobile World! 📱</Text>
      <Text style={styles.subtitle}>My first mobile app</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});

export default HelloWorld;`;
  } else if (level === "INTERMEDIATE") {
    return `// Interactive Counter App with State
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

function CounterApp() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.count}>{count}</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.decrementBtn]}
          onPress={() => setCount(count - 1)}
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.incrementBtn]}
          onPress={() => setCount(count + 1)}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.resetButton}
        onPress={() => setCount(0)}
      >
        <Text style={styles.resetText}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
}`;
  } else if (level === "ADVANCED") {
    return `// Fetching Data from an API
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://api.example.com/users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" />;
  if (error) return <Text>{error}</Text>;

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.userCard}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
        </View>
      )}
    />
  );
}`;
  } else if (level === "EXPERT") {
    return `// Navigation with React Navigation
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator for main screens
function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

// Root Navigator
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="Modal" component={ModalScreen}
          options={{ presentation: 'modal' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}`;
  } else {
    return `// Production App Architecture
// Context for Global State Management
import React, { createContext, useContext, useReducer } from 'react';

// Types
interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  notifications: Notification[];
}

type Action =
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'TOGGLE_THEME' }
  | { type: 'ADD_NOTIFICATION'; payload: Notification };

// Reducer
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

// Provider Component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}`;
  }
}

function getExercise(title: string, level: string): string {
  if (level === "BEGINNER") {
    return `1. Create a View with a welcome message
2. Add styling with colors and fonts
3. Add an image to your screen
4. Create multiple Text components`;
  } else if (level === "INTERMEDIATE") {
    return `1. Create a component with useState
2. Add buttons that change the state
3. Style your buttons with TouchableOpacity
4. Add a reset function`;
  } else if (level === "ADVANCED") {
    return `1. Fetch data from an API using useEffect
2. Display loading and error states
3. Render a list with FlatList
4. Handle refresh functionality`;
  } else if (level === "EXPERT") {
    return `1. Set up React Navigation
2. Create a Tab Navigator
3. Add a Stack Navigator for detail screens
4. Pass data between screens`;
  } else {
    return `1. Implement global state with Context
2. Create a reducer for state updates
3. Add TypeScript types
4. Build a custom hook for the context`;
  }
}

function getStarterCode(title: string, level: string): string {
  return `// Your code here
import React from 'react';
import { View, Text } from 'react-native';

function MyComponent() {
  return (
    <View>
      <Text>Start coding!</Text>
    </View>
  );
}

export default MyComponent;`;
}

// Quiz questions for each level
const quizQuestions = {
  BEGINNER: [
    { question: "What framework do we use for cross-platform mobile apps?", options: ["React Native", "Swift", "Kotlin", "Java"], answer: "0" },
    { question: "Which component displays text in React Native?", options: ["<p>", "<Text>", "<Label>", "<Span>"], answer: "1" },
  ],
  INTERMEDIATE: [
    { question: "Which hook manages state in functional components?", options: ["useEffect", "useState", "useContext", "useReducer"], answer: "1" },
    { question: "What makes a button touchable in React Native?", options: ["<Button>", "<TouchableOpacity>", "<Clickable>", "<Pressable>"], answer: "1" },
  ],
  ADVANCED: [
    { question: "Which hook runs side effects like API calls?", options: ["useState", "useEffect", "useMemo", "useCallback"], answer: "1" },
    { question: "What component efficiently renders long lists?", options: ["ScrollView", "ListView", "FlatList", "List"], answer: "2" },
  ],
  EXPERT: [
    { question: "Which library handles navigation in React Native?", options: ["React Router", "React Navigation", "Native Navigator", "Stack Navigator"], answer: "1" },
    { question: "What navigator shows tabs at the bottom?", options: ["StackNavigator", "DrawerNavigator", "TabNavigator", "BottomTabNavigator"], answer: "3" },
  ],
  MASTER: [
    { question: "What pattern manages complex global state?", options: ["Props drilling", "Context + Reducer", "Local state", "Callbacks"], answer: "1" },
    { question: "What ensures type safety in React Native?", options: ["JavaScript", "TypeScript", "Flow", "PropTypes"], answer: "1" },
  ],
};

// All 5 Mobile Development courses
const courses = [
  {
    title: "Mobile Development Foundations",
    level: "BEGINNER",
    ageGroup: "AGES_11_14",
    description: "Start your journey into mobile app development! Learn the basics of React Native and create your first mobile apps that run on both iOS and Android.",
    lessons: [
      { title: "Welcome to Mobile Development", description: "Discover the exciting world of mobile apps and what you'll learn in this course", xp: 50 },
      { title: "Setting Up Your Environment", description: "Install the tools you need: Node.js, Expo, and your code editor", xp: 60 },
      { title: "Your First React Native App", description: "Create and run your first mobile app using Expo", xp: 80 },
      { title: "Understanding Components", description: "Learn about View, Text, and Image - the building blocks of apps", xp: 80 },
      { title: "Styling Your App", description: "Make your app beautiful with StyleSheet and flexbox", xp: 90 },
      { title: "Working with Images", description: "Add and display images in your mobile app", xp: 70 },
      { title: "Creating Buttons", description: "Make your app interactive with touchable components", xp: 90 },
      { title: "Basic Layouts with Flexbox", description: "Arrange components on screen using flexbox", xp: 100 },
      { title: "ScrollView for Long Content", description: "Handle content that's longer than the screen", xp: 80 },
      { title: "TextInput: Getting User Input", description: "Create forms and capture what users type", xp: 90 },
      { title: "Handling User Events", description: "Respond to taps, presses, and other interactions", xp: 100 },
      { title: "Introduction to State", description: "Make your app dynamic with component state", xp: 110 },
      { title: "Project: Personal Profile App", description: "Build a complete profile app showcasing what you've learned!", xp: 200 },
    ],
  },
  {
    title: "Mobile Development: Interactive Apps",
    level: "INTERMEDIATE",
    ageGroup: "AGES_11_14",
    description: "Take your mobile skills further! Learn state management, lists, and create truly interactive applications with React Native.",
    lessons: [
      { title: "Review: React Native Basics", description: "Quick refresher on components and styling", xp: 50 },
      { title: "Deep Dive into useState", description: "Master state management in functional components", xp: 100 },
      { title: "Multiple State Variables", description: "Manage complex component state effectively", xp: 100 },
      { title: "Conditional Rendering", description: "Show different content based on state", xp: 90 },
      { title: "Working with Arrays in State", description: "Add, remove, and update items in lists", xp: 110 },
      { title: "FlatList for Efficient Lists", description: "Render long lists with optimal performance", xp: 120 },
      { title: "Pull to Refresh", description: "Add refresh functionality to your lists", xp: 90 },
      { title: "Forms and Validation", description: "Build forms and validate user input", xp: 110 },
      { title: "Modal Dialogs", description: "Create popup dialogs and overlays", xp: 100 },
      { title: "Custom Components", description: "Build reusable components for your apps", xp: 120 },
      { title: "Props and Component Communication", description: "Pass data between parent and child components", xp: 110 },
      { title: "Introduction to useEffect", description: "Handle side effects in your components", xp: 120 },
      { title: "Project: Todo List App", description: "Build a fully functional todo app with add, complete, and delete features!", xp: 250 },
    ],
  },
  {
    title: "Mobile Development: Data & APIs",
    level: "ADVANCED",
    ageGroup: "AGES_15_18",
    description: "Connect your apps to the world! Learn to fetch data from APIs, handle async operations, and build data-driven mobile applications.",
    lessons: [
      { title: "Review: State and Effects", description: "Refresher on useState and useEffect", xp: 60 },
      { title: "Introduction to APIs", description: "What are APIs and how do mobile apps use them?", xp: 80 },
      { title: "Fetch API Basics", description: "Make your first API request with fetch()", xp: 100 },
      { title: "Async/Await in React Native", description: "Write clean asynchronous code", xp: 110 },
      { title: "Loading States", description: "Show spinners and skeletons while data loads", xp: 90 },
      { title: "Error Handling", description: "Handle network errors gracefully", xp: 100 },
      { title: "Displaying API Data", description: "Render fetched data in your components", xp: 110 },
      { title: "Pagination and Infinite Scroll", description: "Load more data as users scroll", xp: 130 },
      { title: "AsyncStorage: Local Data", description: "Save data locally on the device", xp: 120 },
      { title: "Caching API Responses", description: "Improve performance with caching", xp: 110 },
      { title: "Image Caching", description: "Load and cache images efficiently", xp: 100 },
      { title: "Search and Filtering", description: "Add search functionality to your apps", xp: 120 },
      { title: "Environment Variables", description: "Securely manage API keys and configs", xp: 90 },
      { title: "Project: Weather App", description: "Build a weather app that fetches real-time data from a weather API!", xp: 300 },
    ],
  },
  {
    title: "Mobile Development: Full-Featured Apps",
    level: "EXPERT",
    ageGroup: "AGES_15_18",
    description: "Build professional-grade mobile apps! Master navigation, authentication, device features, and deploy your apps to app stores.",
    lessons: [
      { title: "Review: APIs and Data", description: "Recap of API integration patterns", xp: 60 },
      { title: "React Navigation Setup", description: "Install and configure React Navigation", xp: 100 },
      { title: "Stack Navigator", description: "Create screen stacks with back navigation", xp: 120 },
      { title: "Tab Navigator", description: "Build bottom tab navigation", xp: 120 },
      { title: "Drawer Navigator", description: "Create slide-out menu navigation", xp: 110 },
      { title: "Passing Data Between Screens", description: "Navigate with parameters", xp: 100 },
      { title: "Deep Linking", description: "Open specific screens from URLs", xp: 120 },
      { title: "Authentication Flows", description: "Build login and signup screens", xp: 150 },
      { title: "Secure Token Storage", description: "Safely store authentication tokens", xp: 130 },
      { title: "Protected Routes", description: "Restrict access to authenticated users", xp: 120 },
      { title: "Camera and Image Picker", description: "Access device camera and photos", xp: 140 },
      { title: "Location Services", description: "Get user location and show maps", xp: 140 },
      { title: "Push Notifications", description: "Send and receive push notifications", xp: 150 },
      { title: "App Icons and Splash Screens", description: "Polish your app's branding", xp: 100 },
      { title: "Building for Production", description: "Create release builds for iOS and Android", xp: 130 },
      { title: "Project: Social Media App", description: "Build a social app with auth, posts, profiles, and navigation!", xp: 400 },
    ],
  },
  {
    title: "Mobile Development: Professional Mastery",
    level: "MASTER",
    ageGroup: "AGES_15_18",
    description: "Master professional mobile development! Learn TypeScript, advanced state management, testing, performance optimization, and app store deployment.",
    lessons: [
      { title: "Review: Full-Featured Apps", description: "Recap navigation, auth, and device features", xp: 70 },
      { title: "TypeScript Fundamentals", description: "Add type safety to your React Native apps", xp: 150 },
      { title: "TypeScript with React Native", description: "Type your components, props, and state", xp: 160 },
      { title: "Context API Deep Dive", description: "Share state across your entire app", xp: 140 },
      { title: "useReducer for Complex State", description: "Manage complex state with reducers", xp: 150 },
      { title: "Custom Hooks", description: "Extract and reuse component logic", xp: 140 },
      { title: "Performance Optimization", description: "useMemo, useCallback, and React.memo", xp: 160 },
      { title: "Animation with Reanimated", description: "Create smooth, performant animations", xp: 180 },
      { title: "Gesture Handling", description: "Build swipe, drag, and pinch interactions", xp: 170 },
      { title: "Unit Testing Components", description: "Write tests with Jest and Testing Library", xp: 160 },
      { title: "Integration Testing", description: "Test user flows and API integration", xp: 150 },
      { title: "End-to-End Testing with Detox", description: "Automated testing on real devices", xp: 170 },
      { title: "CI/CD for Mobile", description: "Automate builds with GitHub Actions or Bitrise", xp: 160 },
      { title: "App Store Optimization", description: "Prepare metadata and screenshots", xp: 120 },
      { title: "Publishing to Google Play", description: "Deploy your app to the Play Store", xp: 150 },
      { title: "Publishing to App Store", description: "Deploy your app to Apple's App Store", xp: 160 },
      { title: "Analytics and Crash Reporting", description: "Monitor your app in production", xp: 130 },
      { title: "Monetization Strategies", description: "In-app purchases, ads, and subscriptions", xp: 140 },
      { title: "Accessibility in Mobile Apps", description: "Make your apps usable by everyone", xp: 140 },
      { title: "Final Project: Production App", description: "Build, test, and publish a complete production-ready mobile application!", xp: 500 },
    ],
  },
];

async function main() {
  console.log("🚀 Seeding Mobile Development courses...\n");

  for (const courseData of courses) {
    const slug = generateSlug(courseData.title);

    const course = await prisma.course.create({
      data: {
        title: courseData.title,
        slug,
        description: courseData.description,
        level: courseData.level as any,
        ageGroup: courseData.ageGroup as any,
        language: "MOBILE_DEVELOPMENT",
        lessons: {
          create: courseData.lessons.map((lesson, index) => {
            const content = generateContent(lesson.title, lesson.description, courseData.level);
            return {
              title: lesson.title,
              slug: generateSlug(lesson.title),
              description: lesson.description,
              orderIndex: index,
              xpReward: lesson.xp,
              content: content.content,
              exampleCode: content.exampleCode,
              exerciseInstructions: content.exerciseInstructions,
              exerciseStarterCode: content.exerciseStarterCode,
            };
          }),
        },
      },
      include: { lessons: true },
    });

    console.log(`✅ Created: ${courseData.title} (${course.lessons.length} lessons)`);

    // Create quizzes
    const questions = quizQuestions[courseData.level as keyof typeof quizQuestions];
    for (const lesson of course.lessons) {
      await prisma.quiz.create({
        data: {
          lessonId: lesson.id,
          questions: {
            create: questions.map((q, idx) => ({
              question: q.question,
              questionType: "MULTIPLE_CHOICE",
              options: q.options,
              correctAnswer: q.answer,
              orderIndex: idx,
              xpReward: 10,
            })),
          },
        },
      });
    }
  }

  const total = await prisma.course.count({ where: { language: "MOBILE_DEVELOPMENT" } });
  const lessons = await prisma.lesson.count({
    where: { course: { language: "MOBILE_DEVELOPMENT" } },
  });

  console.log("\n" + "=".repeat(50));
  console.log("🎉 MOBILE DEVELOPMENT PATH COMPLETE!");
  console.log("=".repeat(50));
  console.log(`📚 Courses: ${total}`);
  console.log(`📖 Lessons: ${lessons}`);
  console.log("=".repeat(50));
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

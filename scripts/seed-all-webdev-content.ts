import { PrismaClient, QuestionType } from "@prisma/client";

const prisma = new PrismaClient();

// Helper to generate content based on lesson title and description
function generateLessonContent(title: string, description: string, courseLevel: string): {
  content: string;
  exampleCode: string;
  exerciseInstructions: string;
  exerciseStarterCode: string;
  quiz: { question: string; options: string[]; correctAnswer: string; explanation: string }[];
} {
  // Determine topic from title
  const titleLower = title.toLowerCase();

  // HTML Topics
  if (titleLower.includes('html') || titleLower.includes('structure') || titleLower.includes('semantic')) {
    return generateHTMLContent(title, description);
  }

  // CSS Topics
  if (titleLower.includes('css') || titleLower.includes('style') || titleLower.includes('flexbox') ||
      titleLower.includes('grid') || titleLower.includes('responsive') || titleLower.includes('animation') ||
      titleLower.includes('layout') || titleLower.includes('media quer') || titleLower.includes('sass') ||
      titleLower.includes('transition')) {
    return generateCSSContent(title, description);
  }

  // JavaScript Topics
  if (titleLower.includes('javascript') || titleLower.includes('js') || titleLower.includes('dom') ||
      titleLower.includes('event') || titleLower.includes('variable') || titleLower.includes('function') ||
      titleLower.includes('array') || titleLower.includes('async') || titleLower.includes('promise') ||
      titleLower.includes('fetch') || titleLower.includes('json') || titleLower.includes('es6') ||
      titleLower.includes('class') || titleLower.includes('module') || titleLower.includes('callback') ||
      titleLower.includes('npm') || titleLower.includes('storage') || titleLower.includes('validation')) {
    return generateJSContent(title, description, courseLevel);
  }

  // React Topics
  if (titleLower.includes('react') || titleLower.includes('component') || titleLower.includes('jsx') ||
      titleLower.includes('props') || titleLower.includes('state') || titleLower.includes('hook') ||
      titleLower.includes('useeffect') || titleLower.includes('router') || titleLower.includes('redux') ||
      titleLower.includes('context')) {
    return generateReactContent(title, description);
  }

  // Node.js / Backend Topics
  if (titleLower.includes('node') || titleLower.includes('express') || titleLower.includes('api') ||
      titleLower.includes('backend') || titleLower.includes('server') || titleLower.includes('rest') ||
      titleLower.includes('database') || titleLower.includes('mongo') || titleLower.includes('sql') ||
      titleLower.includes('auth') || titleLower.includes('jwt') || titleLower.includes('deploy')) {
    return generateBackendContent(title, description);
  }

  // TypeScript Topics
  if (titleLower.includes('typescript') || titleLower.includes('type')) {
    return generateTypeScriptContent(title, description);
  }

  // Testing Topics
  if (titleLower.includes('test') || titleLower.includes('jest') || titleLower.includes('cypress')) {
    return generateTestingContent(title, description);
  }

  // DevOps Topics
  if (titleLower.includes('ci/cd') || titleLower.includes('docker') || titleLower.includes('deploy') ||
      titleLower.includes('performance') || titleLower.includes('security') || titleLower.includes('websocket') ||
      titleLower.includes('graphql') || titleLower.includes('system design')) {
    return generateDevOpsContent(title, description);
  }

  // Git / Version Control
  if (titleLower.includes('git') || titleLower.includes('version control')) {
    return generateGitContent(title, description);
  }

  // Project / General
  return generateProjectContent(title, description);
}

function generateHTMLContent(title: string, description: string) {
  return {
    content: `
<h2>🏗️ ${title}</h2>

<p>${description}</p>

<h3>What You'll Learn</h3>

<p>HTML (HyperText Markup Language) is the foundation of every website. It's like the skeleton of a webpage - it gives structure to everything you see!</p>

<h3>Key Concepts</h3>

<ul>
<li><strong>Tags</strong> - HTML uses tags like <code>&lt;div&gt;</code>, <code>&lt;p&gt;</code>, <code>&lt;h1&gt;</code> to create elements</li>
<li><strong>Attributes</strong> - Extra information added to tags like <code>class</code>, <code>id</code>, <code>href</code></li>
<li><strong>Nesting</strong> - Tags can contain other tags (like boxes inside boxes)</li>
</ul>

<h3>💡 Pro Tip</h3>
<p>Always close your tags! Every <code>&lt;div&gt;</code> needs a <code>&lt;/div&gt;</code>.</p>
`,
    exampleCode: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>${title} - Example</title>
  </head>
  <body>
    <header>
      <h1>Welcome!</h1>
      <nav>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>

    <main>
      <section id="about">
        <h2>About This Page</h2>
        <p>This is a well-structured HTML page!</p>
      </section>
    </main>

    <footer>
      <p>&copy; 2024 My Website</p>
    </footer>
  </body>
</html>`,
    exerciseInstructions: "Practice what you learned! Modify the HTML structure to add your own content.",
    exerciseStarterCode: `<!DOCTYPE html>
<html>
  <head>
    <title>My Practice Page</title>
  </head>
  <body>
    <!-- Add your HTML structure here -->
    <h1>Start coding!</h1>

  </body>
</html>`,
    quiz: [
      {
        question: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks Text Making Language", "High Tech Modern Language"],
        correctAnswer: "Hyper Text Markup Language",
        explanation: "HTML stands for Hyper Text Markup Language - it's the standard language for creating web pages!"
      },
      {
        question: "Which tag is used for the main heading?",
        options: ["<heading>", "<h1>", "<main>", "<title>"],
        correctAnswer: "<h1>",
        explanation: "<h1> is the main heading tag. Use it once per page for the most important title!"
      }
    ]
  };
}

function generateCSSContent(title: string, description: string) {
  return {
    content: `
<h2>🎨 ${title}</h2>

<p>${description}</p>

<h3>What You'll Learn</h3>

<p>CSS (Cascading Style Sheets) makes your websites beautiful! It controls colors, fonts, layouts, and even animations.</p>

<h3>Key Concepts</h3>

<ul>
<li><strong>Selectors</strong> - Target elements to style (<code>.class</code>, <code>#id</code>, <code>element</code>)</li>
<li><strong>Properties</strong> - What to change (<code>color</code>, <code>font-size</code>, <code>margin</code>)</li>
<li><strong>Values</strong> - How to change it (<code>red</code>, <code>20px</code>, <code>center</code>)</li>
</ul>

<h3>CSS Syntax</h3>

<pre><code>selector {
  property: value;
  property: value;
}</code></pre>

<h3>💡 Pro Tip</h3>
<p>Use classes for reusable styles, IDs for unique elements!</p>
`,
    exampleCode: `<!DOCTYPE html>
<html>
  <head>
    <title>CSS Styling Demo</title>
    <style>
      /* Global styles */
      body {
        font-family: 'Segoe UI', Arial, sans-serif;
        margin: 0;
        padding: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
      }

      /* Card component */
      .card {
        background: white;
        border-radius: 16px;
        padding: 24px;
        max-width: 400px;
        margin: 20px auto;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      }

      .card h2 {
        color: #333;
        margin-top: 0;
      }

      .card p {
        color: #666;
        line-height: 1.6;
      }

      .btn {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 16px;
        transition: transform 0.2s, box-shadow 0.2s;
      }

      .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h2>Beautiful CSS!</h2>
      <p>CSS transforms plain HTML into stunning websites with colors, gradients, shadows, and animations.</p>
      <button class="btn">Click Me!</button>
    </div>
  </body>
</html>`,
    exerciseInstructions: "Create your own styled card component! Try changing colors, adding shadows, and experimenting with hover effects.",
    exerciseStarterCode: `<!DOCTYPE html>
<html>
  <head>
    <title>CSS Practice</title>
    <style>
      /* Style the body */
      body {
        background-color: #f0f0f0;
        padding: 20px;
      }

      /* Create a styled card */
      .card {
        /* Add your styles here */
        background: white;

      }

      /* Style a button */
      .btn {
        /* Add your button styles */

      }
    </style>
  </head>
  <body>
    <div class="card">
      <h2>My Card</h2>
      <p>Style this card with CSS!</p>
      <button class="btn">Button</button>
    </div>
  </body>
</html>`,
    quiz: [
      {
        question: "What does CSS stand for?",
        options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System", "Colorful Style Sheets"],
        correctAnswer: "Cascading Style Sheets",
        explanation: "CSS stands for Cascading Style Sheets - 'cascading' means styles can inherit from parent elements!"
      },
      {
        question: "Which property changes text color?",
        options: ["text-color", "font-color", "color", "foreground"],
        correctAnswer: "color",
        explanation: "The 'color' property changes text color. Use 'background-color' for background!"
      }
    ]
  };
}

function generateJSContent(title: string, description: string, level: string) {
  const isAdvanced = level === 'ADVANCED' || level === 'EXPERT' || level === 'MASTER';

  return {
    content: `
<h2>⚡ ${title}</h2>

<p>${description}</p>

<h3>What You'll Learn</h3>

<p>JavaScript brings your websites to life! It handles user interactions, manipulates content, and communicates with servers.</p>

<h3>Key Concepts</h3>

<ul>
<li><strong>Variables</strong> - Store data using <code>let</code>, <code>const</code></li>
<li><strong>Functions</strong> - Reusable blocks of code</li>
<li><strong>Events</strong> - Respond to user actions (clicks, typing)</li>
<li><strong>DOM</strong> - Interact with HTML elements</li>
</ul>

${isAdvanced ? `
<h3>Advanced Topics</h3>

<ul>
<li><strong>Async/Await</strong> - Handle asynchronous operations</li>
<li><strong>APIs</strong> - Fetch data from servers</li>
<li><strong>ES6+</strong> - Modern JavaScript features</li>
</ul>
` : ''}

<h3>💡 Pro Tip</h3>
<p>Use <code>console.log()</code> to debug your code - press F12 to see the console!</p>
`,
    exampleCode: isAdvanced ? `// Modern JavaScript Example
const apiUrl = 'https://jsonplaceholder.typicode.com/users';

// Async function to fetch data
async function fetchUsers() {
  try {
    const response = await fetch(apiUrl);
    const users = await response.json();
    displayUsers(users);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

// Display users in the DOM
function displayUsers(users) {
  const container = document.getElementById('users');
  container.innerHTML = users.map(user => \`
    <div class="user-card">
      <h3>\${user.name}</h3>
      <p>📧 \${user.email}</p>
      <p>🏢 \${user.company.name}</p>
    </div>
  \`).join('');
}

// Array methods example
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);
const sum = numbers.reduce((acc, n) => acc + n, 0);

console.log('Doubled:', doubled);
console.log('Evens:', evens);
console.log('Sum:', sum);

// Call the function
fetchUsers();` : `// JavaScript Basics Example

// Variables
let playerName = "Hero";
const maxScore = 100;
let currentScore = 0;

// Function to update score
function addPoints(points) {
  currentScore += points;
  updateDisplay();

  if (currentScore >= maxScore) {
    alert("🎉 You win, " + playerName + "!");
  }
}

// Update the display
function updateDisplay() {
  document.getElementById("score").textContent = currentScore;
}

// Event listener for button click
document.getElementById("addBtn").addEventListener("click", function() {
  addPoints(10);
});

console.log("Game started! Player:", playerName);`,
    exerciseInstructions: isAdvanced
      ? "Practice async JavaScript! Create a function that fetches data and displays it on the page."
      : "Practice JavaScript basics! Create a simple counter that increases when you click a button.",
    exerciseStarterCode: isAdvanced ? `<!DOCTYPE html>
<html>
  <head>
    <title>Async JS Practice</title>
    <style>
      body { font-family: Arial; padding: 20px; }
      .card { background: #f0f0f0; padding: 15px; margin: 10px 0; border-radius: 8px; }
    </style>
  </head>
  <body>
    <h1>Data Fetching</h1>
    <button id="loadBtn">Load Data</button>
    <div id="content"></div>

    <script>
      // Create an async function to fetch data
      async function loadData() {
        // Use fetch() to get data from an API
        // Display the results in #content
      }

      document.getElementById("loadBtn").addEventListener("click", loadData);
    </script>
  </body>
</html>` : `<!DOCTYPE html>
<html>
  <head>
    <title>JS Practice</title>
  </head>
  <body>
    <h1>Click Counter</h1>
    <p>Count: <span id="count">0</span></p>
    <button id="clickBtn">Click Me!</button>

    <script>
      let count = 0;

      // Add click event listener to the button
      // Update the count and display

    </script>
  </body>
</html>`,
    quiz: [
      {
        question: "What keyword creates a constant variable in JavaScript?",
        options: ["var", "let", "const", "constant"],
        correctAnswer: "const",
        explanation: "'const' creates a variable that cannot be reassigned. Use it for values that won't change!"
      },
      {
        question: isAdvanced
          ? "What does async/await do?"
          : "What does console.log() do?",
        options: isAdvanced
          ? ["Makes code run faster", "Handles asynchronous operations", "Creates new variables", "Styles elements"]
          : ["Shows a popup", "Prints to the console", "Creates a variable", "Runs a function"],
        correctAnswer: isAdvanced ? "Handles asynchronous operations" : "Prints to the console",
        explanation: isAdvanced
          ? "async/await lets you write asynchronous code that looks synchronous, making it easier to handle API calls and other async operations!"
          : "console.log() outputs messages to the browser's developer console (press F12 to see it)!"
      }
    ]
  };
}

function generateReactContent(title: string, description: string) {
  return {
    content: `
<h2>⚛️ ${title}</h2>

<p>${description}</p>

<h3>What You'll Learn</h3>

<p>React is a powerful JavaScript library for building user interfaces. It lets you create reusable components!</p>

<h3>Key Concepts</h3>

<ul>
<li><strong>Components</strong> - Reusable pieces of UI</li>
<li><strong>JSX</strong> - HTML-like syntax in JavaScript</li>
<li><strong>Props</strong> - Pass data to components</li>
<li><strong>State</strong> - Data that changes over time</li>
<li><strong>Hooks</strong> - useState, useEffect, and more</li>
</ul>

<h3>Component Example</h3>

<pre><code>function Welcome({ name }) {
  return &lt;h1&gt;Hello, {name}!&lt;/h1&gt;;
}</code></pre>

<h3>💡 Pro Tip</h3>
<p>Keep components small and focused on one thing!</p>
`,
    exampleCode: `// React Component Example

import React, { useState, useEffect } from 'react';

// Functional component with hooks
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);

  return (
    <div className="counter">
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count - 1)}>-</button>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// Card component with props
function Card({ title, description, image }) {
  return (
    <div className="card">
      <img src={image} alt={title} />
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

// App component
function App() {
  const cards = [
    { id: 1, title: "React", description: "A JavaScript library", image: "/react.png" },
    { id: 2, title: "Components", description: "Reusable UI pieces", image: "/comp.png" },
  ];

  return (
    <div className="app">
      <Counter />
      <div className="cards">
        {cards.map(card => (
          <Card key={card.id} {...card} />
        ))}
      </div>
    </div>
  );
}

export default App;`,
    exerciseInstructions: "Create a React component! Try building a simple card or button component with props.",
    exerciseStarterCode: `// Create your React component

function MyComponent(props) {
  // Add your component logic here

  return (
    <div>
      {/* Add your JSX here */}
      <h1>My Component</h1>
    </div>
  );
}

// Example usage:
// <MyComponent title="Hello" />`,
    quiz: [
      {
        question: "What is JSX?",
        options: ["A new programming language", "HTML inside JavaScript", "A CSS framework", "A database"],
        correctAnswer: "HTML inside JavaScript",
        explanation: "JSX lets you write HTML-like syntax inside JavaScript. React transforms it into regular JavaScript!"
      },
      {
        question: "What does useState do?",
        options: ["Fetches data", "Creates state in a component", "Styles components", "Handles routing"],
        correctAnswer: "Creates state in a component",
        explanation: "useState is a React hook that lets you add state to functional components!"
      }
    ]
  };
}

function generateBackendContent(title: string, description: string) {
  return {
    content: `
<h2>🖥️ ${title}</h2>

<p>${description}</p>

<h3>What You'll Learn</h3>

<p>Backend development is about creating the server-side logic that powers your applications!</p>

<h3>Key Concepts</h3>

<ul>
<li><strong>Server</strong> - A computer that responds to requests</li>
<li><strong>API</strong> - Application Programming Interface (how apps communicate)</li>
<li><strong>Database</strong> - Where data is stored</li>
<li><strong>Authentication</strong> - Verifying user identity</li>
</ul>

<h3>REST API Basics</h3>

<ul>
<li><strong>GET</strong> - Retrieve data</li>
<li><strong>POST</strong> - Create new data</li>
<li><strong>PUT/PATCH</strong> - Update data</li>
<li><strong>DELETE</strong> - Remove data</li>
</ul>

<h3>💡 Pro Tip</h3>
<p>Always validate user input on the server side for security!</p>
`,
    exampleCode: `// Express.js API Example

const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// In-memory data store
let todos = [
  { id: 1, text: 'Learn Node.js', completed: false },
  { id: 2, text: 'Build an API', completed: false },
];

// GET all todos
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// GET single todo
app.get('/api/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  res.json(todo);
});

// POST new todo
app.post('/api/todos', (req, res) => {
  const todo = {
    id: todos.length + 1,
    text: req.body.text,
    completed: false
  };
  todos.push(todo);
  res.status(201).json(todo);
});

// PUT update todo
app.put('/api/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ error: 'Todo not found' });

  todo.text = req.body.text || todo.text;
  todo.completed = req.body.completed ?? todo.completed;
  res.json(todo);
});

// DELETE todo
app.delete('/api/todos/:id', (req, res) => {
  todos = todos.filter(t => t.id !== parseInt(req.params.id));
  res.status(204).send();
});

app.listen(3000, () => console.log('Server running on port 3000'));`,
    exerciseInstructions: "Create your own API endpoint! Think about what data your app needs and design the routes.",
    exerciseStarterCode: `// Create your Express API

const express = require('express');
const app = express();
app.use(express.json());

// Your data here
let items = [];

// GET all items
app.get('/api/items', (req, res) => {
  // Return all items
});

// POST new item
app.post('/api/items', (req, res) => {
  // Create new item
});

// Start server
app.listen(3000);`,
    quiz: [
      {
        question: "What HTTP method is used to create new data?",
        options: ["GET", "POST", "DELETE", "PATCH"],
        correctAnswer: "POST",
        explanation: "POST is used to create new resources on the server. GET retrieves, PUT/PATCH updates, DELETE removes!"
      },
      {
        question: "What does Express.js do?",
        options: ["Database management", "Web server framework", "CSS styling", "State management"],
        correctAnswer: "Web server framework",
        explanation: "Express.js is a minimal web framework for Node.js that makes building APIs easy!"
      }
    ]
  };
}

function generateTypeScriptContent(title: string, description: string) {
  return {
    content: `
<h2>📘 ${title}</h2>

<p>${description}</p>

<h3>What You'll Learn</h3>

<p>TypeScript adds types to JavaScript, catching errors before they happen!</p>

<h3>Key Concepts</h3>

<ul>
<li><strong>Types</strong> - Define what kind of data a variable holds</li>
<li><strong>Interfaces</strong> - Define the shape of objects</li>
<li><strong>Generics</strong> - Reusable type definitions</li>
<li><strong>Type Safety</strong> - Catch errors at compile time</li>
</ul>

<h3>💡 Pro Tip</h3>
<p>Let TypeScript infer types when possible - you don't always need to write them!</p>
`,
    exampleCode: `// TypeScript Examples

// Basic types
let name: string = "Alice";
let age: number = 25;
let isStudent: boolean = true;

// Arrays
let scores: number[] = [95, 87, 92];
let names: Array<string> = ["Alice", "Bob"];

// Interface
interface User {
  id: number;
  name: string;
  email: string;
  age?: number; // Optional
}

// Function with types
function greet(user: User): string {
  return \`Hello, \${user.name}!\`;
}

// Generic function
function firstItem<T>(arr: T[]): T | undefined {
  return arr[0];
}

// Usage
const user: User = { id: 1, name: "Alice", email: "alice@example.com" };
console.log(greet(user));

const first = firstItem([1, 2, 3]); // type: number
const firstStr = firstItem(["a", "b"]); // type: string`,
    exerciseInstructions: "Practice TypeScript! Define types for your data structures.",
    exerciseStarterCode: `// Define your types

interface Product {
  // Add properties here
}

function calculateTotal(products: Product[]): number {
  // Implement this function
  return 0;
}`,
    quiz: [
      {
        question: "What does TypeScript add to JavaScript?",
        options: ["Animations", "Type safety", "CSS styles", "Database support"],
        correctAnswer: "Type safety",
        explanation: "TypeScript adds static typing to JavaScript, helping catch errors during development!"
      },
      {
        question: "What is an interface in TypeScript?",
        options: ["A function", "A way to define object shapes", "A CSS class", "A loop"],
        correctAnswer: "A way to define object shapes",
        explanation: "Interfaces define the structure of objects - what properties and methods they should have!"
      }
    ]
  };
}

function generateTestingContent(title: string, description: string) {
  return {
    content: `
<h2>🧪 ${title}</h2>

<p>${description}</p>

<h3>What You'll Learn</h3>

<p>Testing ensures your code works correctly and prevents bugs!</p>

<h3>Types of Tests</h3>

<ul>
<li><strong>Unit Tests</strong> - Test individual functions</li>
<li><strong>Integration Tests</strong> - Test components together</li>
<li><strong>E2E Tests</strong> - Test the entire application</li>
</ul>

<h3>Testing Best Practices</h3>

<ul>
<li>Test behavior, not implementation</li>
<li>Keep tests simple and focused</li>
<li>Use meaningful test names</li>
</ul>

<h3>💡 Pro Tip</h3>
<p>Write tests before fixing bugs - this helps prevent regressions!</p>
`,
    exampleCode: `// Jest Testing Examples

// Function to test
function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

// Unit tests
describe('Math functions', () => {
  test('adds two numbers correctly', () => {
    expect(add(2, 3)).toBe(5);
    expect(add(-1, 1)).toBe(0);
  });

  test('multiplies two numbers', () => {
    expect(multiply(3, 4)).toBe(12);
    expect(multiply(0, 5)).toBe(0);
  });
});

// React Testing Library example
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from './Counter';

describe('Counter component', () => {
  test('renders initial count', () => {
    render(<Counter />);
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });

  test('increments on click', () => {
    render(<Counter />);
    fireEvent.click(screen.getByText('+'));
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });
});`,
    exerciseInstructions: "Write tests for your functions! Make sure to test edge cases.",
    exerciseStarterCode: `// Write your tests

function divide(a, b) {
  if (b === 0) throw new Error('Cannot divide by zero');
  return a / b;
}

// Test the divide function
describe('divide', () => {
  test('divides two numbers', () => {
    // Add your test here
  });

  test('throws error on divide by zero', () => {
    // Add your test here
  });
});`,
    quiz: [
      {
        question: "What is a unit test?",
        options: ["Tests the entire app", "Tests a single function or component", "Tests the database", "Tests CSS styles"],
        correctAnswer: "Tests a single function or component",
        explanation: "Unit tests test individual, isolated pieces of code to ensure they work correctly!"
      },
      {
        question: "What does expect().toBe() do?",
        options: ["Creates a variable", "Compares values", "Renders a component", "Makes an API call"],
        correctAnswer: "Compares values",
        explanation: "expect().toBe() asserts that a value equals what you expect it to be!"
      }
    ]
  };
}

function generateDevOpsContent(title: string, description: string) {
  return {
    content: `
<h2>🚀 ${title}</h2>

<p>${description}</p>

<h3>What You'll Learn</h3>

<p>DevOps practices help you deploy, monitor, and maintain applications professionally!</p>

<h3>Key Concepts</h3>

<ul>
<li><strong>CI/CD</strong> - Continuous Integration/Deployment</li>
<li><strong>Containers</strong> - Package apps with dependencies</li>
<li><strong>Monitoring</strong> - Track app health and performance</li>
<li><strong>Security</strong> - Protect your application</li>
</ul>

<h3>💡 Pro Tip</h3>
<p>Automate everything you do more than twice!</p>
`,
    exampleCode: `# GitHub Actions CI/CD Example
# .github/workflows/ci.yml

name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Run linter
        run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to production
        run: |
          echo "Deploying to production..."
          # Add deployment commands here

# Docker Example
# Dockerfile

FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]`,
    exerciseInstructions: "Set up a CI/CD pipeline for your project! Start with running tests automatically.",
    exerciseStarterCode: `# Create your GitHub Actions workflow
# .github/workflows/ci.yml

name: My CI Pipeline

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      # Add your steps here`,
    quiz: [
      {
        question: "What does CI/CD stand for?",
        options: ["Code Integration / Code Deployment", "Continuous Integration / Continuous Deployment", "Computer Interface / Computer Design", "Cloud Infrastructure / Cloud Data"],
        correctAnswer: "Continuous Integration / Continuous Deployment",
        explanation: "CI/CD automates testing (CI) and deployment (CD) of your code!"
      },
      {
        question: "What is Docker used for?",
        options: ["Writing CSS", "Containerizing applications", "Testing code", "Managing state"],
        correctAnswer: "Containerizing applications",
        explanation: "Docker packages your app with all its dependencies into containers that run anywhere!"
      }
    ]
  };
}

function generateGitContent(title: string, description: string) {
  return {
    content: `
<h2>📂 ${title}</h2>

<p>${description}</p>

<h3>What You'll Learn</h3>

<p>Git helps you track changes and collaborate with others!</p>

<h3>Essential Commands</h3>

<ul>
<li><code>git init</code> - Start a new repository</li>
<li><code>git add</code> - Stage changes</li>
<li><code>git commit</code> - Save changes</li>
<li><code>git push</code> - Upload to remote</li>
<li><code>git pull</code> - Download changes</li>
</ul>

<h3>💡 Pro Tip</h3>
<p>Write clear commit messages that explain WHY you made changes!</p>
`,
    exampleCode: `# Git Commands Cheat Sheet

# Initialize a new repository
git init

# Check status
git status

# Add files to staging
git add .                    # Add all files
git add filename.js          # Add specific file

# Commit changes
git commit -m "Add new feature"

# View commit history
git log --oneline

# Create and switch to new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main

# Merge branch
git merge feature/new-feature

# Push to remote
git push origin main

# Pull latest changes
git pull origin main

# Undo changes
git checkout -- filename.js  # Discard local changes
git reset HEAD~1             # Undo last commit (keep changes)`,
    exerciseInstructions: "Practice Git! Create a repository, make some commits, and create a branch.",
    exerciseStarterCode: `# Git Practice

# 1. Initialize repository
git init

# 2. Add your files
# git add .

# 3. Make your first commit
# git commit -m "Initial commit"

# 4. Create a new branch
# git checkout -b feature/practice`,
    quiz: [
      {
        question: "What does 'git commit' do?",
        options: ["Uploads files to GitHub", "Saves your staged changes", "Downloads changes", "Creates a branch"],
        correctAnswer: "Saves your staged changes",
        explanation: "git commit saves your staged changes to the local repository with a message!"
      },
      {
        question: "What is a branch in Git?",
        options: ["A folder", "A separate line of development", "A file", "A remote server"],
        correctAnswer: "A separate line of development",
        explanation: "Branches let you work on features separately without affecting the main code!"
      }
    ]
  };
}

function generateProjectContent(title: string, description: string) {
  return {
    content: `
<h2>🎯 ${title}</h2>

<p>${description}</p>

<h3>Project Guidelines</h3>

<p>This is a hands-on project where you'll apply everything you've learned!</p>

<h3>Requirements</h3>

<ul>
<li>Plan before you code</li>
<li>Break the project into smaller tasks</li>
<li>Test as you build</li>
<li>Make it your own!</li>
</ul>

<h3>Success Tips</h3>

<ol>
<li>Start simple, then add features</li>
<li>Don't be afraid to make mistakes</li>
<li>Ask for help when stuck</li>
<li>Have fun with it!</li>
</ol>

<h3>💡 Pro Tip</h3>
<p>Document your code so others (and future you!) can understand it.</p>
`,
    exampleCode: `<!-- Project Starter Template -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Project</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }

      body {
        font-family: 'Segoe UI', sans-serif;
        background: #f5f5f5;
        min-height: 100vh;
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }

      header {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 40px 20px;
        text-align: center;
      }

      main {
        padding: 40px 20px;
      }
    </style>
  </head>
  <body>
    <header>
      <div class="container">
        <h1>My Project</h1>
        <p>Built with HTML, CSS & JavaScript</p>
      </div>
    </header>

    <main class="container">
      <!-- Your project content goes here -->
    </main>

    <script>
      // Your JavaScript goes here
      console.log('Project loaded!');
    </script>
  </body>
</html>`,
    exerciseInstructions: "Build your project! Use the starter template and add your own features.",
    exerciseStarterCode: `<!-- Start Your Project -->
<!DOCTYPE html>
<html>
  <head>
    <title>My Project</title>
    <style>
      /* Add your styles */
    </style>
  </head>
  <body>
    <!-- Add your HTML -->

    <script>
      // Add your JavaScript
    </script>
  </body>
</html>`,
    quiz: [
      {
        question: "What's the best way to start a project?",
        options: ["Write all the code at once", "Plan and break it into smaller tasks", "Copy someone else's code", "Skip planning and just start"],
        correctAnswer: "Plan and break it into smaller tasks",
        explanation: "Breaking projects into smaller tasks makes them manageable and easier to complete!"
      },
      {
        question: "What should you do when stuck on a problem?",
        options: ["Give up", "Ask for help and try different approaches", "Delete everything", "Ignore it"],
        correctAnswer: "Ask for help and try different approaches",
        explanation: "Every developer gets stuck! Asking for help and trying new approaches is how we learn!"
      }
    ]
  };
}

async function main() {
  console.log("🌱 Adding comprehensive content to ALL Web Development lessons...\n");

  // Get all web development courses
  const courses = await prisma.course.findMany({
    where: { language: "WEB_DEVELOPMENT" },
    include: { lessons: { orderBy: { orderIndex: "asc" } } },
    orderBy: { totalXp: "asc" }
  });

  console.log(`📚 Found ${courses.length} Web Development courses\n`);

  let totalLessons = 0;
  let totalQuizzes = 0;

  for (const course of courses) {
    console.log(`\n📖 ${course.title} (${course.level})`);
    console.log(`   ${course.lessons.length} lessons to update`);

    for (const lesson of course.lessons) {
      // Generate content based on lesson title
      const content = generateLessonContent(lesson.title, lesson.description || "", course.level);

      // Update lesson
      await prisma.lesson.update({
        where: { id: lesson.id },
        data: {
          content: content.content,
          exampleCode: content.exampleCode,
          exerciseInstructions: content.exerciseInstructions,
          exerciseStarterCode: content.exerciseStarterCode,
        }
      });

      // Delete existing quiz
      const existingQuiz = await prisma.quiz.findUnique({
        where: { lessonId: lesson.id }
      });

      if (existingQuiz) {
        await prisma.question.deleteMany({ where: { quizId: existingQuiz.id } });
        await prisma.quiz.delete({ where: { id: existingQuiz.id } });
      }

      // Create new quiz
      if (content.quiz && content.quiz.length > 0) {
        await prisma.quiz.create({
          data: {
            lessonId: lesson.id,
            questions: {
              create: content.quiz.map((q, idx) => ({
                question: q.question,
                questionType: "MULTIPLE_CHOICE" as QuestionType,
                options: q.options,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation,
                xpReward: 10,
                orderIndex: idx
              }))
            }
          }
        });
        totalQuizzes++;
      }

      totalLessons++;
      process.stdout.write(`   ✓ ${lesson.title.substring(0, 40)}...\r`);
    }
    console.log(`   ✅ All ${course.lessons.length} lessons updated!`);
  }

  console.log("\n🎉 Content and quizzes added successfully!");
  console.log(`   📝 Total lessons updated: ${totalLessons}`);
  console.log(`   ❓ Total quizzes created: ${totalQuizzes}`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from "../generated/prisma-client";

const prisma = new PrismaClient();

// Helper to generate slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Content generators for different topics
const contentGenerators = {
  html: (title: string, description: string) => ({
    content: `<h2>🌐 ${title}</h2>
<p><strong>Welcome, young web builder!</strong> ${description}</p>

<h3>📚 What You'll Learn</h3>
<p>HTML (HyperText Markup Language) is the skeleton of every website. Just like your body has bones to give it structure, websites have HTML to organize content!</p>

<h3>🎯 Key Concepts</h3>
<ul>
<li><strong>Tags:</strong> HTML uses tags like <code>&lt;p&gt;</code> and <code>&lt;h1&gt;</code> to tell the browser what type of content you're adding</li>
<li><strong>Elements:</strong> Tags + content = elements. For example: <code>&lt;p&gt;Hello!&lt;/p&gt;</code></li>
<li><strong>Attributes:</strong> Extra information about elements, like <code>src</code> for images</li>
</ul>

<h3>💡 Fun Fact</h3>
<p>HTML was invented in 1991 by Tim Berners-Lee. That's over 30 years ago! Every website you've ever visited uses HTML.</p>

<h3>🚀 Let's Practice!</h3>
<p>Try the code editor below to experiment with HTML. Don't worry about making mistakes - that's how we learn!</p>`,
    exampleCode: `<!DOCTYPE html>
<html>
<head>
  <title>My Awesome Page</title>
</head>
<body>
  <h1>Welcome to My Website!</h1>
  <p>This is my first paragraph.</p>
  <img src="https://placekitten.com/200/200" alt="A cute kitten">
  <a href="https://example.com">Click me!</a>
</body>
</html>`,
    exerciseInstructions: `🎯 Your Challenge:
1. Create a heading with your name
2. Add a paragraph about yourself
3. Include an image (use any image URL)
4. Add a link to your favorite website

Remember: Every tag that opens must close! <tag>content</tag>`,
    exerciseStarterCode: `<!DOCTYPE html>
<html>
<head>
  <title>About Me</title>
</head>
<body>
  <!-- Add your heading here -->

  <!-- Add your paragraph here -->

  <!-- Add your image here -->

  <!-- Add your link here -->

</body>
</html>`,
  }),

  css: (title: string, description: string) => ({
    content: `<h2>🎨 ${title}</h2>
<p><strong>Time to make things beautiful!</strong> ${description}</p>

<h3>📚 What You'll Learn</h3>
<p>CSS (Cascading Style Sheets) is like the paint and decorations for your HTML house. It controls colors, sizes, layouts, and animations!</p>

<h3>🎯 Key Concepts</h3>
<ul>
<li><strong>Selectors:</strong> Tell CSS which HTML elements to style (like <code>h1</code> or <code>.classname</code>)</li>
<li><strong>Properties:</strong> What you want to change (like <code>color</code> or <code>font-size</code>)</li>
<li><strong>Values:</strong> How you want to change it (like <code>blue</code> or <code>20px</code>)</li>
</ul>

<h3>💡 Fun Fact</h3>
<p>CSS can create amazing animations without any JavaScript! Professional websites use CSS to make buttons glow, images fade, and text slide in.</p>

<h3>🚀 Let's Practice!</h3>
<p>Experiment with different colors and sizes. CSS is all about creativity!</p>`,
    exampleCode: `/* CSS makes HTML beautiful! */
body {
  background-color: #f0f0f0;
  font-family: Arial, sans-serif;
}

h1 {
  color: #3498db;
  text-align: center;
  font-size: 36px;
}

.cool-button {
  background-color: #e74c3c;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.cool-button:hover {
  background-color: #c0392b;
}`,
    exerciseInstructions: `🎯 Your Challenge:
1. Change the background color of the page
2. Make the heading a different color
3. Add padding to paragraphs
4. Create a hover effect for links

Tip: Use color names like 'red', 'blue', or hex codes like '#ff6b6b'`,
    exerciseStarterCode: `body {
  /* Add background color */
}

h1 {
  /* Style your heading */
}

p {
  /* Style paragraphs */
}

a:hover {
  /* What happens when mouse hovers? */
}`,
  }),

  javascript: (title: string, description: string) => ({
    content: `<h2>⚡ ${title}</h2>
<p><strong>Let's bring websites to life!</strong> ${description}</p>

<h3>📚 What You'll Learn</h3>
<p>JavaScript is the programming language of the web. It makes websites interactive - buttons that click, forms that validate, games that play!</p>

<h3>🎯 Key Concepts</h3>
<ul>
<li><strong>Variables:</strong> Containers that store data, like <code>let score = 0</code></li>
<li><strong>Functions:</strong> Reusable blocks of code that do specific tasks</li>
<li><strong>Events:</strong> Things that happen (clicks, key presses) that trigger code</li>
<li><strong>DOM:</strong> How JavaScript talks to and changes HTML elements</li>
</ul>

<h3>💡 Fun Fact</h3>
<p>JavaScript was created in just 10 days in 1995! Despite the name, it's completely different from Java. Today it's the most popular programming language in the world!</p>

<h3>🚀 Let's Practice!</h3>
<p>Try changing values and see what happens. Programming is like a superpower!</p>`,
    exampleCode: `// Variables store information
let playerName = "Alex";
let score = 0;

// Functions do things
function addPoints(points) {
  score = score + points;
  console.log(playerName + " now has " + score + " points!");
}

// Make things happen when buttons are clicked
document.getElementById("myButton").addEventListener("click", function() {
  addPoints(10);
  alert("You clicked the button! +10 points!");
});

// Change HTML content
document.getElementById("greeting").innerHTML = "Hello, " + playerName + "!";`,
    exerciseInstructions: `🎯 Your Challenge:
1. Create a variable for your name
2. Write a function that says hello
3. Make something happen when a button is clicked
4. Change text on the page using JavaScript

Remember: Use console.log() to see your results!`,
    exerciseStarterCode: `// Create your variables here
let myName = "Your Name";

// Create a function
function sayHello() {
  // What should this do?
}

// Add an event listener
// document.getElementById("btn").addEventListener("click", function() {
//   // What happens on click?
// });`,
  }),

  python: (title: string, description: string) => ({
    content: `<h2>🐍 ${title}</h2>
<p><strong>Welcome to Python!</strong> ${description}</p>

<h3>📚 What You'll Learn</h3>
<p>Python is one of the easiest and most powerful programming languages. It's used for games, websites, AI, robots, and so much more!</p>

<h3>🎯 Key Concepts</h3>
<ul>
<li><strong>Print:</strong> Show messages on screen with <code>print("Hello!")</code></li>
<li><strong>Variables:</strong> Store information like <code>name = "Alex"</code></li>
<li><strong>Input:</strong> Get information from users with <code>input()</code></li>
<li><strong>Loops:</strong> Repeat code with <code>for</code> and <code>while</code></li>
</ul>

<h3>💡 Fun Fact</h3>
<p>Python is named after Monty Python's Flying Circus, a British comedy show! The language was designed to be fun and easy to read.</p>

<h3>🚀 Let's Practice!</h3>
<p>Python code looks almost like English. Try reading the code out loud!</p>`,
    exampleCode: `# This is a comment - Python ignores it!
print("Hello, World!")

# Variables store information
name = "Alex"
age = 12
favorite_color = "blue"

# Print with variables
print("My name is " + name)
print("I am", age, "years old")

# Ask for input
# user_name = input("What's your name? ")
# print("Nice to meet you, " + user_name + "!")

# Loop 5 times
for i in range(5):
    print("Loop number:", i + 1)

# Make decisions
if age >= 10:
    print("You're ready to code!")
else:
    print("Keep learning!")`,
    exerciseInstructions: `🎯 Your Challenge:
1. Print your name using print()
2. Create variables for your age and favorite hobby
3. Use a for loop to count from 1 to 10
4. Write an if statement that checks if a number is big or small

Python tip: Indentation (spaces at the start) matters in Python!`,
    exerciseStarterCode: `# Print your name
print("Hello, my name is ...")

# Create variables
my_age = 0
my_hobby = ""

# Count from 1 to 10
for number in range(1, 11):
    print(number)

# Check if a number is big or small
mystery_number = 50
if mystery_number > 25:
    print("That's a big number!")
else:
    print("That's a small number!")`,
  }),

  roblox: (title: string, description: string) => ({
    content: `<h2>🎮 ${title}</h2>
<p><strong>Build your dream game!</strong> ${description}</p>

<h3>📚 What You'll Learn</h3>
<p>Roblox uses a language called Lua to make games come alive. You'll learn to create moving parts, collect coins, build obbies, and more!</p>

<h3>🎯 Key Concepts</h3>
<ul>
<li><strong>Scripts:</strong> Code that tells parts what to do</li>
<li><strong>Properties:</strong> Settings like Color, Size, and Position</li>
<li><strong>Events:</strong> Things that happen, like touching a part</li>
<li><strong>Functions:</strong> Reusable code blocks</li>
</ul>

<h3>💡 Fun Fact</h3>
<p>Roblox has over 40 million games created by players just like you! Some developers have made millions of dollars from their Roblox games.</p>

<h3>🚀 Let's Practice!</h3>
<p>Think of your favorite Roblox game - now imagine building your own!</p>`,
    exampleCode: `-- Roblox Lua Script Example
local part = script.Parent

-- Change the part's color
part.BrickColor = BrickColor.new("Bright red")

-- Make it spin!
while true do
    part.CFrame = part.CFrame * CFrame.Angles(0, math.rad(5), 0)
    wait(0.1)
end

-- Detect when someone touches the part
part.Touched:Connect(function(hit)
    local humanoid = hit.Parent:FindFirstChild("Humanoid")
    if humanoid then
        print("A player touched me!")
    end
end)`,
    exerciseInstructions: `🎯 Your Challenge:
1. Create a part that changes color when touched
2. Make a part that gives points to players
3. Build a simple obby checkpoint system
4. Add a spinning coin that disappears when collected

Open Roblox Studio to test your code!`,
    exerciseStarterCode: `-- Your Roblox script here
local part = script.Parent

-- What happens when touched?
part.Touched:Connect(function(hit)
    -- Your code here
    print("Something touched me!")
end)`,
  }),

  engineering: (title: string, description: string) => ({
    content: `<h2>🔧 ${title}</h2>
<p><strong>Think like an engineer!</strong> ${description}</p>

<h3>📚 What You'll Learn</h3>
<p>Engineering is about solving problems and building things that work. From bridges to robots to apps - engineers make our world better!</p>

<h3>🎯 Key Concepts</h3>
<ul>
<li><strong>Design Process:</strong> Plan → Build → Test → Improve</li>
<li><strong>Problem Solving:</strong> Break big problems into smaller ones</li>
<li><strong>Prototypes:</strong> Quick models to test your ideas</li>
<li><strong>Iteration:</strong> Making things better step by step</li>
</ul>

<h3>💡 Fun Fact</h3>
<p>The word "engineer" comes from the Latin word "ingenium" meaning cleverness! Engineers are creative problem solvers.</p>

<h3>🚀 Let's Practice!</h3>
<p>Every great invention started as an idea. What will you create?</p>`,
    exampleCode: `# Engineering Design Process - Pseudocode

STEP 1: IDENTIFY THE PROBLEM
- What needs to be solved?
- Who has this problem?
- Why does it matter?

STEP 2: BRAINSTORM SOLUTIONS
- List at least 5 different ideas
- Don't judge ideas yet - all ideas welcome!
- Think creative and wild

STEP 3: CHOOSE THE BEST SOLUTION
- Consider: Cost, Time, Materials, Skills needed
- Pick the solution that fits best

STEP 4: BUILD A PROTOTYPE
- Start simple
- Use materials you have
- It doesn't need to be perfect!

STEP 5: TEST AND IMPROVE
- Does it work?
- What could be better?
- Make changes and test again`,
    exerciseInstructions: `🎯 Your Challenge:
1. Think of a problem you see every day
2. Brainstorm 3 different solutions
3. Design a simple prototype (draw it!)
4. Explain how you would test if it works

Engineers ask: "How can I make this better?"`,
    exerciseStarterCode: `# My Engineering Project

## The Problem:
(What problem are you trying to solve?)

## My Ideas:
1. Idea one...
2. Idea two...
3. Idea three...

## My Best Solution:
(Which idea will you try first? Why?)

## How I'll Test It:
(How will you know if it works?)`,
  }),

  ai_ml: (title: string, description: string) => ({
    content: `<h2>🤖 ${title}</h2>
<p><strong>Welcome to the future!</strong> ${description}</p>

<h3>📚 What You'll Learn</h3>
<p>Artificial Intelligence (AI) is when computers learn to think and make decisions. Machine Learning is how we teach them - with data and examples!</p>

<h3>🎯 Key Concepts</h3>
<ul>
<li><strong>AI:</strong> Computers that can do tasks that usually need human intelligence</li>
<li><strong>Machine Learning:</strong> Teaching computers by showing them examples</li>
<li><strong>Training Data:</strong> The examples we use to teach AI</li>
<li><strong>Predictions:</strong> What the AI thinks will happen based on what it learned</li>
</ul>

<h3>💡 Fun Fact</h3>
<p>AI can now write stories, create art, play games, and even help doctors find diseases! The AI helping you learn right now is an example of AI too!</p>

<h3>🚀 Let's Practice!</h3>
<p>AI is like teaching a very fast student who never forgets!</p>`,
    exampleCode: `# Simple AI Concept - Teaching a computer to recognize

# Imagine teaching AI to recognize cats vs dogs:

training_examples = [
    {"has_whiskers": True, "barks": False, "meows": True, "animal": "cat"},
    {"has_whiskers": True, "barks": True, "meows": False, "animal": "dog"},
    {"has_whiskers": True, "barks": False, "meows": True, "animal": "cat"},
    {"has_whiskers": True, "barks": True, "meows": False, "animal": "dog"},
]

# The AI learns patterns:
# - If it meows → probably a cat
# - If it barks → probably a dog

def simple_predict(barks, meows):
    if meows and not barks:
        return "I think it's a cat! 🐱"
    elif barks and not meows:
        return "I think it's a dog! 🐕"
    else:
        return "I'm not sure! 🤔"

# Test our simple AI
print(simple_predict(barks=False, meows=True))  # Should say cat!
print(simple_predict(barks=True, meows=False))  # Should say dog!`,
    exerciseInstructions: `🎯 Your Challenge:
1. Think of something AI could learn to recognize
2. List 5 features that help identify it
3. Create some training examples
4. Test if your "AI rules" work correctly

AI learns from patterns - what patterns do you see?`,
    exerciseStarterCode: `# My Simple AI Project

# What am I teaching AI to recognize?
# Example: Fruits! (Apple vs Orange)

# Features to look for:
# 1. Color (red/orange)
# 2. Shape (round)
# 3. Size (small/medium)

def identify_fruit(color, texture):
    if color == "red" and texture == "smooth":
        return "Apple! 🍎"
    elif color == "orange" and texture == "bumpy":
        return "Orange! 🍊"
    else:
        return "Unknown fruit"

# Test it!
print(identify_fruit("red", "smooth"))`,
  }),

  robotics: (title: string, description: string) => ({
    content: `<h2>🤖 ${title}</h2>
<p><strong>Build machines that move and think!</strong> ${description}</p>

<h3>📚 What You'll Learn</h3>
<p>Robotics combines engineering, programming, and creativity. Robots can do amazing things - from vacuuming floors to exploring Mars!</p>

<h3>🎯 Key Concepts</h3>
<ul>
<li><strong>Sensors:</strong> How robots "see" and "feel" the world</li>
<li><strong>Actuators:</strong> Motors and parts that make robots move</li>
<li><strong>Controllers:</strong> The robot's "brain" that makes decisions</li>
<li><strong>Programs:</strong> Instructions that tell robots what to do</li>
</ul>

<h3>💡 Fun Fact</h3>
<p>The word "robot" comes from a Czech play from 1920! It comes from "robota" meaning forced labor. Today's robots are helpers, not slaves!</p>

<h3>🚀 Let's Practice!</h3>
<p>Think of robots as helpful friends waiting for your instructions!</p>`,
    exampleCode: `# Robot Movement - Pseudocode

# Basic Robot Commands
MOVE_FORWARD(distance)
TURN_LEFT(degrees)
TURN_RIGHT(degrees)
STOP()

# Sensors
distance_sensor = READ_DISTANCE()  # How far to obstacle
color_sensor = READ_COLOR()        # What color is below

# Example: Follow a line
while True:
    color = READ_COLOR()

    if color == "black":
        # On the line - go forward
        MOVE_FORWARD(1)
    elif color == "white":
        # Lost the line - turn to find it
        TURN_LEFT(10)

    # Safety check
    if READ_DISTANCE() < 10:
        STOP()
        print("Obstacle detected!")
        break`,
    exerciseInstructions: `🎯 Your Challenge:
1. Design a robot that can navigate a maze
2. List what sensors it would need
3. Write pseudocode for its behavior
4. Think about what happens if something goes wrong

Robots need plans for every situation!`,
    exerciseStarterCode: `# My Robot Program

# What does my robot do?
# Mission: Navigate around obstacles

# Sensors needed:
# 1. Distance sensor (front)
# 2. Distance sensor (left)
# 3. Distance sensor (right)

# Main program
while robot_is_on:
    front_distance = READ_FRONT_SENSOR()

    if front_distance > 30:
        # Path is clear
        MOVE_FORWARD(10)
    else:
        # Obstacle ahead!
        # What should the robot do?
        pass`,
  }),

  game_development: (title: string, description: string) => ({
    content: `<h2>🎮 ${title}</h2>
<p><strong>Create games people love to play!</strong> ${description}</p>

<h3>📚 What You'll Learn</h3>
<p>Game development is where art meets code. You'll learn to create characters, design levels, add physics, and make gameplay that's super fun!</p>

<h3>🎯 Key Concepts</h3>
<ul>
<li><strong>Game Loop:</strong> The cycle of Update → Draw → Repeat that runs your game</li>
<li><strong>Sprites:</strong> Images that represent characters and objects</li>
<li><strong>Collision:</strong> Detecting when game objects touch</li>
<li><strong>Physics:</strong> Making things move realistically (gravity, bouncing)</li>
</ul>

<h3>💡 Fun Fact</h3>
<p>Some of the most popular games ever made were created by small teams or even one person! Minecraft was created by one developer before becoming a global phenomenon.</p>

<h3>🚀 Let's Practice!</h3>
<p>Every game starts with a simple idea. What's yours?</p>`,
    exampleCode: `// Simple Game Concepts - JavaScript

// Game variables
let player = {
  x: 100,
  y: 300,
  width: 50,
  height: 50,
  speed: 5,
  jumping: false
};

let score = 0;

// Game loop (runs 60 times per second)
function gameLoop() {
  update();    // Move things
  draw();      // Show things
  requestAnimationFrame(gameLoop);
}

// Update game state
function update() {
  // Move player with arrow keys
  if (keyPressed("ArrowRight")) {
    player.x += player.speed;
  }
  if (keyPressed("ArrowLeft")) {
    player.x -= player.speed;
  }

  // Check collisions with coins
  coins.forEach(coin => {
    if (isColliding(player, coin)) {
      score += 10;
      coin.collected = true;
    }
  });
}

// Draw everything
function draw() {
  clearScreen();
  drawPlayer(player);
  drawCoins(coins);
  drawScore(score);
}`,
    exerciseInstructions: `🎯 Your Challenge:
1. Design a simple game character
2. List 3 things the player can do (actions)
3. Create a scoring system
4. Add one obstacle or enemy

Start simple - you can always add more later!`,
    exerciseStarterCode: `// My Game Design

// Player properties
let myPlayer = {
  name: "Hero",
  health: 100,
  x: 0,
  y: 0
};

// What can the player do?
function jump() {
  // Player jumps
}

function collectCoin() {
  // Add to score
}

// Game rules
// - Player loses health when touching enemies
// - Player gains points when collecting coins
// - Game ends when health reaches 0`,
  }),

  mobile_development: (title: string, description: string) => ({
    content: `<h2>📱 ${title}</h2>
<p><strong>Build apps for phones and tablets!</strong> ${description}</p>

<h3>📚 What You'll Learn</h3>
<p>Mobile apps are programs that run on smartphones and tablets. You'll learn to create apps with buttons, screens, and cool features!</p>

<h3>🎯 Key Concepts</h3>
<ul>
<li><strong>UI (User Interface):</strong> What users see and touch</li>
<li><strong>Screens:</strong> Different pages in your app</li>
<li><strong>Components:</strong> Building blocks like buttons, text, and images</li>
<li><strong>Navigation:</strong> Moving between screens</li>
</ul>

<h3>💡 Fun Fact</h3>
<p>There are over 5 million apps in app stores! But most people only use about 10 apps regularly. Make yours one of those favorites!</p>

<h3>🚀 Let's Practice!</h3>
<p>Think about your favorite app - what makes it great?</p>`,
    exampleCode: `// React Native - Mobile App Example

import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

function MyFirstApp() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Counter App</Text>

      <Text style={styles.count}>{count}</Text>

      <Button
        title="Add One!"
        onPress={() => setCount(count + 1)}
      />

      <Button
        title="Reset"
        onPress={() => setCount(0)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  count: {
    fontSize: 48,
    margin: 20,
  },
});`,
    exerciseInstructions: `🎯 Your Challenge:
1. Design an app that solves a problem
2. Sketch 3 screens your app needs
3. List the buttons and features on each screen
4. Think about what data your app needs to save

Great apps solve real problems for real people!`,
    exerciseStarterCode: `// My App Design

// App Name: _______________
// Purpose: _______________

// Screen 1: Home
// - Title text
// - Main button
// - Navigation to other screens

// Screen 2: Details
// - Show more information
// - Back button

// Screen 3: Settings
// - User preferences
// - About section`,
  }),

  career_prep: (title: string, description: string) => ({
    content: `<h2>💼 ${title}</h2>
<p><strong>Prepare for your tech career!</strong> ${description}</p>

<h3>📚 What You'll Learn</h3>
<p>The tech industry is full of opportunities! Whether you want to be a developer, designer, or entrepreneur, preparation is key to success.</p>

<h3>🎯 Key Concepts</h3>
<ul>
<li><strong>Portfolio:</strong> Showcase of your best work</li>
<li><strong>Resume:</strong> Summary of your skills and experience</li>
<li><strong>Networking:</strong> Connecting with other professionals</li>
<li><strong>Interviews:</strong> Showing companies what you can do</li>
</ul>

<h3>💡 Fun Fact</h3>
<p>Many successful tech leaders started coding as kids! Mark Zuckerberg, Bill Gates, and Elon Musk all learned to program when they were young.</p>

<h3>🚀 Let's Practice!</h3>
<p>Your career starts with the projects you build today!</p>`,
    exampleCode: `# Career Preparation Checklist

## 1. Build Your Portfolio
- [ ] Create a personal website
- [ ] Showcase 3-5 best projects
- [ ] Include code on GitHub
- [ ] Add project descriptions

## 2. Write Your Resume
- [ ] Contact information
- [ ] Skills section (languages, tools)
- [ ] Project experience
- [ ] Education

## 3. Online Presence
- [ ] GitHub profile
- [ ] LinkedIn account
- [ ] Portfolio website

## 4. Practice Interviewing
- [ ] Explain your projects clearly
- [ ] Practice coding challenges
- [ ] Prepare questions to ask

## 5. Network
- [ ] Join coding communities
- [ ] Attend local tech meetups
- [ ] Connect with other developers`,
    exerciseInstructions: `🎯 Your Challenge:
1. List your top 3 programming projects
2. Write a short description for each
3. Identify skills you've learned
4. Set 3 goals for the next month

Your future in tech starts today!`,
    exerciseStarterCode: `# My Career Plan

## My Top Projects:
1. Project name: ___________
   What it does: ___________
   Skills used: ___________

2. Project name: ___________
   What it does: ___________
   Skills used: ___________

3. Project name: ___________
   What it does: ___________
   Skills used: ___________

## Skills I Have:
-

## Skills I Want to Learn:
-

## My Goals:
1. This week: ___________
2. This month: ___________
3. This year: ___________`,
  }),
};

// Quiz generators for different topics
const quizGenerators = {
  html: (lessonTitle: string) => [
    {
      question: `What does HTML stand for?`,
      options: JSON.stringify([
        "HyperText Markup Language",
        "High Tech Modern Language",
        "Home Tool Markup Language",
        "HyperText Machine Language",
      ]),
      correctAnswer: 0,
    },
    {
      question: `Which tag is used to create a paragraph in HTML?`,
      options: JSON.stringify(["<paragraph>", "<p>", "<text>", "<para>"]),
      correctAnswer: 1,
    },
  ],
  css: (lessonTitle: string) => [
    {
      question: `What does CSS stand for?`,
      options: JSON.stringify([
        "Computer Style Sheets",
        "Creative Style System",
        "Cascading Style Sheets",
        "Colorful Style Sheets",
      ]),
      correctAnswer: 2,
    },
    {
      question: `Which property changes the text color in CSS?`,
      options: JSON.stringify([
        "text-color",
        "font-color",
        "color",
        "text-style",
      ]),
      correctAnswer: 2,
    },
  ],
  javascript: (lessonTitle: string) => [
    {
      question: `How do you create a variable in JavaScript?`,
      options: JSON.stringify([
        "variable x = 5",
        "let x = 5",
        "v x = 5",
        "create x = 5",
      ]),
      correctAnswer: 1,
    },
    {
      question: `What does console.log() do?`,
      options: JSON.stringify([
        "Creates a new log file",
        "Prints output to the console",
        "Logs into a website",
        "Creates a variable",
      ]),
      correctAnswer: 1,
    },
  ],
  python: (lessonTitle: string) => [
    {
      question: `How do you print "Hello" in Python?`,
      options: JSON.stringify([
        'console.log("Hello")',
        'echo "Hello"',
        'print("Hello")',
        'say("Hello")',
      ]),
      correctAnswer: 2,
    },
    {
      question: `What symbol starts a comment in Python?`,
      options: JSON.stringify(["//", "/*", "#", "--"]),
      correctAnswer: 2,
    },
  ],
  roblox: (lessonTitle: string) => [
    {
      question: `What programming language does Roblox use?`,
      options: JSON.stringify(["Python", "JavaScript", "Lua", "C++"]),
      correctAnswer: 2,
    },
    {
      question: `What do you use to create games in Roblox?`,
      options: JSON.stringify([
        "Roblox Studio",
        "Roblox Creator",
        "Roblox Builder",
        "Roblox Code",
      ]),
      correctAnswer: 0,
    },
  ],
  engineering: (lessonTitle: string) => [
    {
      question: `What is the first step in the engineering design process?`,
      options: JSON.stringify([
        "Build something",
        "Identify the problem",
        "Test your solution",
        "Buy materials",
      ]),
      correctAnswer: 1,
    },
    {
      question: `What is a prototype?`,
      options: JSON.stringify([
        "The final product",
        "A quick model to test your idea",
        "A type of robot",
        "A coding language",
      ]),
      correctAnswer: 1,
    },
  ],
  ai_ml: (lessonTitle: string) => [
    {
      question: `What does AI stand for?`,
      options: JSON.stringify([
        "Automatic Intelligence",
        "Artificial Intelligence",
        "Advanced Internet",
        "Automated Information",
      ]),
      correctAnswer: 1,
    },
    {
      question: `How do machines learn in Machine Learning?`,
      options: JSON.stringify([
        "By reading books",
        "By being shown many examples",
        "By watching videos",
        "By listening to music",
      ]),
      correctAnswer: 1,
    },
  ],
  robotics: (lessonTitle: string) => [
    {
      question: `What are sensors used for in robots?`,
      options: JSON.stringify([
        "To make the robot look cool",
        "To detect and understand the environment",
        "To charge the battery",
        "To connect to the internet",
      ]),
      correctAnswer: 1,
    },
    {
      question: `What makes a robot move?`,
      options: JSON.stringify([
        "Sensors",
        "Batteries only",
        "Motors and actuators",
        "Screens",
      ]),
      correctAnswer: 2,
    },
  ],
  game_development: (lessonTitle: string) => [
    {
      question: `What is a game loop?`,
      options: JSON.stringify([
        "A type of video game",
        "The cycle of update and draw that runs continuously",
        "A looping sound effect",
        "A game that never ends",
      ]),
      correctAnswer: 1,
    },
    {
      question: `What are sprites in game development?`,
      options: JSON.stringify([
        "A type of drink",
        "Images that represent characters and objects",
        "Sound effects",
        "The game's story",
      ]),
      correctAnswer: 1,
    },
  ],
  mobile_development: (lessonTitle: string) => [
    {
      question: `What does UI stand for?`,
      options: JSON.stringify([
        "Universal Internet",
        "User Interface",
        "Unified Information",
        "User Intelligence",
      ]),
      correctAnswer: 1,
    },
    {
      question: `What is navigation in a mobile app?`,
      options: JSON.stringify([
        "Using GPS",
        "Moving between different screens",
        "Finding bugs",
        "Writing code",
      ]),
      correctAnswer: 1,
    },
  ],
  career_prep: (lessonTitle: string) => [
    {
      question: `What is a portfolio?`,
      options: JSON.stringify([
        "A type of folder",
        "A showcase of your best work",
        "A job application",
        "A coding language",
      ]),
      correctAnswer: 1,
    },
    {
      question: `Why is networking important in tech?`,
      options: JSON.stringify([
        "To fix internet connections",
        "To connect with other professionals and find opportunities",
        "To play online games",
        "To build websites",
      ]),
      correctAnswer: 1,
    },
  ],
};

// All courses to seed (excluding web development which is already seeded)
const coursesToSeed = [
  // HTML Courses
  {
    id: "html-beginner",
    title: "HTML Beginner: My First Webpage",
    level: "BEGINNER" as const,
    ageGroup: "AGES_7_10" as const,
    language: "HTML" as const,
    description:
      "Start your web adventure! Learn to build your very first webpage using simple HTML tags. Perfect for young coders taking their first steps into the world of web development.",
    lessons: [
      {
        title: "Welcome to HTML!",
        description:
          "Discover what HTML is and how websites are made - it's like building with digital LEGO blocks!",
        xp: 50,
      },
      {
        title: "Your First HTML File",
        description:
          "Create your very first .html file and see it come to life in a browser",
        xp: 60,
      },
      {
        title: "The HTML Skeleton",
        description:
          "Learn the basic structure every webpage needs: <!DOCTYPE>, <html>, <head>, and <body>",
        xp: 70,
      },
      {
        title: "Headings: Big and Small Text",
        description:
          "Use h1 to h6 tags to create titles and subtitles - like chapter titles in a book!",
        xp: 60,
      },
      {
        title: "Paragraphs and Line Breaks",
        description: "Write text on your page using <p> and <br> tags",
        xp: 60,
      },
      {
        title: "Making Text Bold and Italic",
        description:
          "Style your text with <strong> and <em> tags to make words stand out",
        xp: 50,
      },
      {
        title: "Adding Cool Images",
        description: "Put pictures on your webpage using the <img> tag",
        xp: 80,
      },
      {
        title: "Creating Clickable Links",
        description:
          "Connect pages together with <a> tags - the magic of the internet!",
        xp: 80,
      },
      {
        title: "Fun with Lists",
        description:
          "Make ordered and unordered lists using <ol>, <ul>, and <li> tags",
        xp: 70,
      },
      {
        title: "My First Mini Project",
        description:
          "Build a complete 'About Me' webpage using everything you've learned!",
        xp: 120,
      },
    ],
  },
  {
    id: "html-intermediate",
    title: "HTML Intermediate: Building Better Pages",
    level: "INTERMEDIATE" as const,
    ageGroup: "AGES_11_14" as const,
    language: "HTML" as const,
    description:
      "Level up your HTML skills! Learn about forms, tables, semantic elements, and how to organize your code like a pro.",
    lessons: [
      {
        title: "Quick Review: HTML Foundations",
        description: "Refresh your memory on HTML basics before diving deeper",
        xp: 40,
      },
      {
        title: "The Power of Divs and Spans",
        description:
          "Learn to group and organize your content with <div> and <span> containers",
        xp: 80,
      },
      {
        title: "Semantic HTML: Code That Makes Sense",
        description:
          "Use <header>, <nav>, <main>, <section>, <article>, and <footer> to structure pages properly",
        xp: 100,
      },
      {
        title: "Building Tables",
        description:
          "Create data tables with <table>, <tr>, <th>, and <td> - perfect for schedules and scores!",
        xp: 90,
      },
      {
        title: "Forms Part 1: Text Inputs",
        description:
          "Create forms with text inputs, labels, and the basics of collecting user data",
        xp: 100,
      },
      {
        title: "Forms Part 2: Buttons and Choices",
        description:
          "Add checkboxes, radio buttons, dropdowns, and submit buttons to your forms",
        xp: 100,
      },
      {
        title: "Embedding Videos and Audio",
        description:
          "Add multimedia to your pages with <video> and <audio> tags",
        xp: 80,
      },
      {
        title: "HTML Attributes Deep Dive",
        description:
          "Master id, class, title, and other attributes that make HTML powerful",
        xp: 90,
      },
      {
        title: "Commenting Your Code",
        description:
          "Learn to write helpful comments so others (and future you!) can understand your code",
        xp: 60,
      },
      {
        title: "Project: Interactive Quiz Page",
        description:
          "Build a fun quiz webpage with forms, images, and proper structure",
        xp: 150,
      },
    ],
  },
  {
    id: "html-advanced",
    title: "HTML Advanced: Deep Dive",
    level: "ADVANCED" as const,
    ageGroup: "AGES_11_14" as const,
    language: "HTML" as const,
    description:
      "Take your HTML knowledge to the next level! Explore advanced layout techniques, multimedia embedding, and prepare for complex web projects.",
    lessons: [
      {
        title: "Review: Intermediate Concepts",
        description: "Quick recap of semantic HTML, forms, and tables",
        xp: 50,
      },
      {
        title: "Advanced Form Techniques",
        description:
          "Form validation, fieldsets, and accessible form design",
        xp: 120,
      },
      {
        title: "HTML5 Input Types",
        description:
          "Discover date pickers, color pickers, range sliders, and more",
        xp: 100,
      },
      {
        title: "Figure and Figcaption",
        description: "Properly captioning images and diagrams",
        xp: 80,
      },
      {
        title: "Details and Summary",
        description: "Create expandable/collapsible content sections",
        xp: 80,
      },
      {
        title: "Dialog Element",
        description: "Build modal popups with native HTML",
        xp: 100,
      },
      {
        title: "Progress and Meter",
        description: "Show progress bars and measurement indicators",
        xp: 80,
      },
      {
        title: "Time and Address Elements",
        description: "Mark up dates, times, and contact info semantically",
        xp: 70,
      },
      {
        title: "Advanced Table Features",
        description: "Colgroups, headers, and accessible data tables",
        xp: 100,
      },
      {
        title: "Project: Dashboard Page",
        description:
          "Build an interactive dashboard with forms, tables, and progress indicators",
        xp: 180,
      },
    ],
  },
  {
    id: "html-expert",
    title: "HTML Expert: Pro Techniques",
    level: "EXPERT" as const,
    ageGroup: "AGES_15_18" as const,
    language: "HTML" as const,
    description:
      "Become an HTML expert! Master advanced features like iframes, meta tags, accessibility, and HTML5 APIs.",
    lessons: [
      {
        title: "HTML5: The Modern Standard",
        description: "Explore the newest HTML5 features and why they matter",
        xp: 80,
      },
      {
        title: "Meta Tags for Better Websites",
        description:
          "Use meta tags for SEO, social sharing, and mobile optimization",
        xp: 120,
      },
      {
        title: "Accessibility (A11y) Matters",
        description:
          "Make your websites usable by everyone with ARIA labels and accessibility best practices",
        xp: 150,
      },
      {
        title: "IFrames: Websites Inside Websites",
        description:
          "Embed external content like maps and videos using <iframe>",
        xp: 100,
      },
      {
        title: "HTML5 Canvas Basics",
        description:
          "Draw graphics and create simple animations with the <canvas> element",
        xp: 140,
      },
      {
        title: "Data Attributes",
        description: "Store custom data in your HTML with data-* attributes",
        xp: 100,
      },
      {
        title: "Picture Element and Responsive Images",
        description: "Serve different images for different screen sizes",
        xp: 120,
      },
      {
        title: "HTML Validation and Debugging",
        description: "Find and fix errors in your HTML code like a pro",
        xp: 100,
      },
      {
        title: "SEO-Friendly HTML Structure",
        description:
          "Structure your pages so search engines can find them easily",
        xp: 130,
      },
      {
        title: "Project: Portfolio Website",
        description:
          "Build a professional portfolio site showcasing your work",
        xp: 200,
      },
    ],
  },
  {
    id: "html-master",
    title: "HTML Master: Industry Ready",
    level: "MASTER" as const,
    ageGroup: "AGES_15_18" as const,
    language: "HTML" as const,
    description:
      "Master HTML development! Learn about web components, templating, performance optimization, and industry best practices.",
    lessons: [
      {
        title: "HTML in the Real World",
        description:
          "How professional developers use HTML in modern web applications",
        xp: 100,
      },
      {
        title: "Template Element and Slots",
        description:
          "Create reusable HTML templates with <template> and <slot>",
        xp: 180,
      },
      {
        title: "Introduction to Web Components",
        description: "Build custom HTML elements that work anywhere",
        xp: 200,
      },
      {
        title: "Progressive Enhancement",
        description:
          "Build websites that work for everyone, then enhance for modern browsers",
        xp: 150,
      },
      {
        title: "HTML Performance Optimization",
        description:
          "Load your pages faster with lazy loading, preloading, and prefetching",
        xp: 180,
      },
      {
        title: "Microdata and Schema.org",
        description:
          "Add structured data to help search engines understand your content",
        xp: 160,
      },
      {
        title: "HTML Email Development",
        description:
          "Create HTML emails that look great in every email client",
        xp: 200,
      },
      {
        title: "SVG in HTML",
        description: "Use scalable vector graphics for icons and illustrations",
        xp: 150,
      },
      {
        title: "HTML APIs: Geolocation & Storage",
        description:
          "Use browser APIs for location, local storage, and more",
        xp: 180,
      },
      {
        title: "Final Project: Full Website",
        description:
          "Build a complete, professional, multi-page website from scratch",
        xp: 300,
      },
    ],
  },
  // CSS Course
  {
    id: "css-magic",
    title: "CSS Magic: Style Your Pages",
    level: "BEGINNER" as const,
    ageGroup: "AGES_7_10" as const,
    language: "CSS" as const,
    description:
      "Make your websites beautiful with colors, fonts, and layouts. Learn how to make things look amazing.",
    lessons: [
      {
        title: "Introduction to CSS",
        description: "What is CSS and why do we need it?",
        xp: 50,
      },
      {
        title: "Color & Typography",
        description: "Set colors, fonts, and sizing",
        xp: 60,
      },
      {
        title: "Backgrounds and Borders",
        description: "Add beautiful backgrounds and borders to elements",
        xp: 70,
      },
      {
        title: "The Box Model",
        description: "Understanding margin, padding, and borders",
        xp: 80,
      },
      {
        title: "Layouts & Spacing",
        description: "Arrange elements with margin, padding, and flexbox",
        xp: 60,
      },
      {
        title: "Flexbox Basics",
        description: "Learn the power of flexible layouts",
        xp: 90,
      },
      {
        title: "Buttons & Cards",
        description: "Design fun UI elements kids love",
        xp: 80,
      },
      {
        title: "Hover Effects",
        description: "Make things change when you hover over them",
        xp: 70,
      },
      {
        title: "Simple Animations",
        description: "Add movement and life to your pages",
        xp: 80,
      },
      {
        title: "Project: Styled Profile Card",
        description: "Create a beautiful profile card with all you've learned",
        xp: 120,
      },
    ],
  },
  // JavaScript Course
  {
    id: "js-adventures",
    title: "JavaScript Adventures",
    level: "BEGINNER" as const,
    ageGroup: "AGES_11_14" as const,
    language: "JAVASCRIPT" as const,
    description:
      "Add interactivity to your websites! Make buttons click, create animations, and build mini-games.",
    lessons: [
      {
        title: "What is JavaScript?",
        description: "Introduction to the language of the web",
        xp: 50,
      },
      {
        title: "Variables & Strings",
        description: "Store and show information",
        xp: 80,
      },
      {
        title: "Numbers and Math",
        description: "Do calculations with JavaScript",
        xp: 70,
      },
      {
        title: "Making Decisions with If/Else",
        description: "Teach your code to make choices",
        xp: 80,
      },
      {
        title: "Loops: Repeat After Me",
        description: "Make code repeat itself",
        xp: 90,
      },
      {
        title: "Functions & Events",
        description: "React to clicks and keypresses",
        xp: 90,
      },
      {
        title: "Arrays: Lists of Things",
        description: "Store multiple items together",
        xp: 80,
      },
      {
        title: "DOM: Changing the Page",
        description: "Make your webpage respond to actions",
        xp: 100,
      },
      {
        title: "Building Interactive Elements",
        description: "Create buttons that actually do things",
        xp: 90,
      },
      {
        title: "Mini Game",
        description: "Build a simple clicker game",
        xp: 120,
      },
    ],
  },
  // Python Course
  {
    id: "python-young",
    title: "Python for Young Coders",
    level: "BEGINNER" as const,
    ageGroup: "AGES_11_14" as const,
    language: "PYTHON" as const,
    description:
      "Start your programming journey with Python! Create games, solve puzzles, and automate fun tasks.",
    lessons: [
      {
        title: "Welcome to Python",
        description: "Meet the friendly programming language",
        xp: 50,
      },
      {
        title: "Print & Variables",
        description: "Say hello to Python and store values",
        xp: 70,
      },
      {
        title: "Getting User Input",
        description: "Make your programs interactive",
        xp: 70,
      },
      {
        title: "Numbers and Calculations",
        description: "Python as your calculator",
        xp: 80,
      },
      {
        title: "Making Decisions",
        description: "If statements and conditions",
        xp: 90,
      },
      {
        title: "Loops & Logic",
        description: "Make code repeat and decide paths",
        xp: 90,
      },
      {
        title: "Lists and Collections",
        description: "Store multiple items together",
        xp: 80,
      },
      {
        title: "Functions",
        description: "Create reusable code blocks",
        xp: 90,
      },
      {
        title: "Working with Files",
        description: "Save and load data",
        xp: 80,
      },
      {
        title: "Text Adventure",
        description: "Build a choose-your-own-adventure game",
        xp: 140,
      },
    ],
  },
  // Roblox Course
  {
    id: "roblox-creator",
    title: "Roblox Game Creator",
    level: "BEGINNER" as const,
    ageGroup: "AGES_11_14" as const,
    language: "ROBLOX" as const,
    description:
      "Build your own Roblox games! Use Lua scripting to create obstacles, power-ups, and mini-games.",
    lessons: [
      {
        title: "Welcome to Roblox Studio",
        description: "Get started with the game creation tool",
        xp: 50,
      },
      {
        title: "Studio Setup",
        description: "Get comfortable in Roblox Studio",
        xp: 60,
      },
      {
        title: "Parts and Properties",
        description: "Understanding the building blocks",
        xp: 70,
      },
      {
        title: "Introduction to Lua",
        description: "Your first Roblox script",
        xp: 80,
      },
      {
        title: "Scripting Basics",
        description: "Make parts move and react",
        xp: 120,
      },
      {
        title: "Events and Connections",
        description: "Respond to player actions",
        xp: 100,
      },
      {
        title: "Player Interaction",
        description: "Detect when players touch things",
        xp: 90,
      },
      {
        title: "Creating Collectibles",
        description: "Make coins and power-ups",
        xp: 100,
      },
      {
        title: "Building an Obby",
        description: "Create obstacle course challenges",
        xp: 120,
      },
      {
        title: "Publish & Share",
        description: "Ship your first playable obby",
        xp: 200,
      },
    ],
  },
  // Advanced Web Dev Course
  {
    id: "web-advanced",
    title: "Advanced Web Development",
    level: "INTERMEDIATE" as const,
    ageGroup: "AGES_15_18" as const,
    language: "JAVASCRIPT" as const,
    description:
      "Take your web skills to the next level. Build responsive layouts, components, and deploy real projects.",
    lessons: [
      {
        title: "Review: Web Fundamentals",
        description: "Quick recap of HTML, CSS, and JavaScript",
        xp: 60,
      },
      {
        title: "Advanced CSS Techniques",
        description: "CSS Grid, animations, and transitions",
        xp: 100,
      },
      {
        title: "Responsive Design",
        description: "Make your sites work on any screen",
        xp: 110,
      },
      {
        title: "Components & State",
        description: "Think in reusable UI blocks",
        xp: 120,
      },
      {
        title: "JavaScript ES6+",
        description: "Modern JavaScript features",
        xp: 120,
      },
      {
        title: "Working with APIs",
        description: "Fetch data from the internet",
        xp: 130,
      },
      {
        title: "APIs & Data",
        description: "Fetch and render live data",
        xp: 160,
      },
      {
        title: "Local Storage",
        description: "Save data in the browser",
        xp: 100,
      },
      {
        title: "Project Setup with npm",
        description: "Using modern development tools",
        xp: 110,
      },
      {
        title: "Deploy & Share",
        description: "Publish your project to the web",
        xp: 200,
      },
    ],
  },
  // Engineering Courses
  {
    id: "engineering-basics",
    title: "Engineering for Kids",
    level: "BEGINNER" as const,
    ageGroup: "AGES_7_10" as const,
    language: "ENGINEERING" as const,
    description:
      "Discover the world of engineering! Learn about structures, simple machines, and how things work through fun hands-on projects.",
    lessons: [
      {
        title: "What is Engineering?",
        description: "Explore different types of engineering",
        xp: 50,
      },
      {
        title: "The Engineering Design Process",
        description: "Learn how engineers solve problems",
        xp: 60,
      },
      {
        title: "Building Bridges",
        description: "Learn about structures and stability",
        xp: 80,
      },
      {
        title: "Strong Shapes",
        description: "Why triangles are super strong",
        xp: 70,
      },
      {
        title: "Simple Machines: Levers",
        description: "Discover the power of levers",
        xp: 80,
      },
      {
        title: "Simple Machines: Wheels and Pulleys",
        description: "How wheels and pulleys help us",
        xp: 100,
      },
      {
        title: "Testing and Improving",
        description: "How engineers make things better",
        xp: 70,
      },
      {
        title: "Engineering in Everyday Life",
        description: "Spot engineering all around you",
        xp: 60,
      },
      {
        title: "Project: Design Challenge",
        description: "Solve a real engineering problem",
        xp: 120,
      },
    ],
  },
  {
    id: "engineering-intermediate",
    title: "Engineering Design Process",
    level: "INTERMEDIATE" as const,
    ageGroup: "AGES_11_14" as const,
    language: "ENGINEERING" as const,
    description:
      "Master the engineering design process! Learn to identify problems, brainstorm solutions, prototype, and iterate.",
    lessons: [
      {
        title: "Design Thinking Overview",
        description: "The full engineering design cycle",
        xp: 80,
      },
      {
        title: "Identifying Problems",
        description: "Finding problems worth solving",
        xp: 90,
      },
      {
        title: "Research and Planning",
        description: "Gathering information for your design",
        xp: 90,
      },
      {
        title: "Brainstorming Solutions",
        description: "Creative idea generation techniques",
        xp: 100,
      },
      {
        title: "Design Thinking",
        description: "Learn the engineering design cycle",
        xp: 100,
      },
      {
        title: "Selecting the Best Solution",
        description: "How to choose between ideas",
        xp: 90,
      },
      {
        title: "Prototyping",
        description: "Build and test your ideas",
        xp: 120,
      },
      {
        title: "Testing and Evaluation",
        description: "Does your solution work?",
        xp: 100,
      },
      {
        title: "Iteration and Improvement",
        description: "Making your design better",
        xp: 100,
      },
      {
        title: "Engineering Project",
        description: "Complete a real engineering challenge",
        xp: 180,
      },
    ],
  },
  // AI/ML Courses
  {
    id: "ai-intro",
    title: "Introduction to AI",
    level: "BEGINNER" as const,
    ageGroup: "AGES_11_14" as const,
    language: "AI_ML" as const,
    description:
      "Discover artificial intelligence! Learn how computers can learn, recognize patterns, and make decisions.",
    lessons: [
      {
        title: "What is Artificial Intelligence?",
        description: "Understanding AI basics",
        xp: 60,
      },
      {
        title: "What is AI?",
        description: "Understanding artificial intelligence basics",
        xp: 70,
      },
      {
        title: "AI in Everyday Life",
        description: "Spotting AI all around you",
        xp: 70,
      },
      {
        title: "How Computers Learn",
        description: "Introduction to machine learning concepts",
        xp: 80,
      },
      {
        title: "Pattern Recognition",
        description: "How machines learn to see patterns",
        xp: 100,
      },
      {
        title: "Training with Examples",
        description: "How we teach AI with data",
        xp: 90,
      },
      {
        title: "AI and Images",
        description: "How AI sees and recognizes pictures",
        xp: 100,
      },
      {
        title: "AI and Language",
        description: "How AI understands text",
        xp: 90,
      },
      {
        title: "Build a Chatbot",
        description: "Create your own simple AI chatbot",
        xp: 150,
      },
    ],
  },
  {
    id: "machine-learning-basics",
    title: "Machine Learning Fundamentals",
    level: "INTERMEDIATE" as const,
    ageGroup: "AGES_15_18" as const,
    language: "AI_ML" as const,
    description:
      "Dive into machine learning! Train models, work with data, and build intelligent applications using Python.",
    lessons: [
      {
        title: "What is Machine Learning?",
        description: "Understanding ML vs traditional programming",
        xp: 80,
      },
      {
        title: "Types of Machine Learning",
        description: "Supervised, unsupervised, and reinforcement",
        xp: 100,
      },
      {
        title: "Data & Features",
        description: "Prepare data for machine learning",
        xp: 120,
      },
      {
        title: "Data Preparation",
        description: "Cleaning and organizing data",
        xp: 100,
      },
      {
        title: "Training Models",
        description: "Build and train your first ML model",
        xp: 150,
      },
      {
        title: "Testing and Accuracy",
        description: "How well does your model work?",
        xp: 120,
      },
      {
        title: "Classification Problems",
        description: "Teaching AI to categorize things",
        xp: 130,
      },
      {
        title: "Image Recognition",
        description: "Create an image classifier",
        xp: 200,
      },
      {
        title: "Ethics in AI",
        description: "Responsible AI development",
        xp: 100,
      },
    ],
  },
  // Robotics Courses
  {
    id: "robotics-intro",
    title: "Robotics for Beginners",
    level: "BEGINNER" as const,
    ageGroup: "AGES_7_10" as const,
    language: "ROBOTICS" as const,
    description:
      "Enter the world of robots! Learn basic programming concepts while controlling virtual robots and solving puzzles.",
    lessons: [
      {
        title: "What are Robots?",
        description: "Introduction to the world of robots",
        xp: 50,
      },
      {
        title: "Meet the Robots",
        description: "Introduction to robotics concepts",
        xp: 60,
      },
      {
        title: "Parts of a Robot",
        description: "Understanding robot components",
        xp: 60,
      },
      {
        title: "Giving Robots Instructions",
        description: "How we tell robots what to do",
        xp: 70,
      },
      {
        title: "Move & Turn",
        description: "Program basic robot movements",
        xp: 80,
      },
      {
        title: "Sensors: Robot Senses",
        description: "How robots see and feel",
        xp: 80,
      },
      {
        title: "Making Decisions",
        description: "Robots that think and choose",
        xp: 90,
      },
      {
        title: "Loops: Repeat Actions",
        description: "Making robots do things over and over",
        xp: 80,
      },
      {
        title: "Robot Maze",
        description: "Navigate robots through challenges",
        xp: 120,
      },
    ],
  },
  {
    id: "robotics-programming",
    title: "Robot Programming",
    level: "INTERMEDIATE" as const,
    ageGroup: "AGES_11_14" as const,
    language: "ROBOTICS" as const,
    description:
      "Program real robots! Learn sensors, motors, and control systems while building autonomous machines.",
    lessons: [
      {
        title: "Review: Robotics Basics",
        description: "Quick recap of robot fundamentals",
        xp: 60,
      },
      {
        title: "Sensors & Input",
        description: "Use sensors to detect the environment",
        xp: 100,
      },
      {
        title: "Distance Sensors",
        description: "Measuring how far things are",
        xp: 90,
      },
      {
        title: "Color and Light Sensors",
        description: "Robots that see colors",
        xp: 90,
      },
      {
        title: "Motors & Movement",
        description: "Control motors with precision",
        xp: 120,
      },
      {
        title: "Speed Control",
        description: "Making robots go fast or slow",
        xp: 100,
      },
      {
        title: "Line Following",
        description: "Robots that follow paths",
        xp: 120,
      },
      {
        title: "Obstacle Avoidance",
        description: "Robots that don't bump into things",
        xp: 130,
      },
      {
        title: "Autonomous Robot",
        description: "Build a robot that thinks for itself",
        xp: 200,
      },
    ],
  },
  // Game Development Courses
  {
    id: "game-dev-intro",
    title: "Introduction to Game Development",
    level: "BEGINNER" as const,
    ageGroup: "AGES_7_10" as const,
    language: "GAME_DEVELOPMENT" as const,
    description:
      "Start making games! Learn the basics of game design, characters, levels, and how to bring your game ideas to life.",
    lessons: [
      {
        title: "What Makes a Great Game?",
        description: "Explore the elements that make games fun and engaging",
        xp: 50,
      },
      {
        title: "Game Genres",
        description: "Different types of games you can make",
        xp: 60,
      },
      {
        title: "Characters & Stories",
        description: "Create memorable game characters and storylines",
        xp: 70,
      },
      {
        title: "Game Rules",
        description: "How rules make games fun",
        xp: 70,
      },
      {
        title: "Level Design Basics",
        description: "Design exciting levels and environments",
        xp: 80,
      },
      {
        title: "Game Controls",
        description: "Make characters move and respond to player input",
        xp: 90,
      },
      {
        title: "Feedback and Rewards",
        description: "Making players feel good",
        xp: 70,
      },
      {
        title: "Testing Your Game",
        description: "Finding and fixing problems",
        xp: 70,
      },
      {
        title: "Your First Game",
        description: "Build a complete simple game from scratch!",
        xp: 120,
      },
    ],
  },
  {
    id: "game-dev-intermediate",
    title: "2D Game Development",
    level: "INTERMEDIATE" as const,
    ageGroup: "AGES_11_14" as const,
    language: "GAME_DEVELOPMENT" as const,
    description:
      "Build awesome 2D games! Learn sprites, animations, physics, and game mechanics to create platformers and arcade games.",
    lessons: [
      {
        title: "2D Game Fundamentals",
        description: "Understanding 2D game concepts",
        xp: 70,
      },
      {
        title: "Sprites & Animation",
        description: "Create and animate game graphics",
        xp: 100,
      },
      {
        title: "The Game Loop",
        description: "How games run continuously",
        xp: 90,
      },
      {
        title: "Game Physics",
        description: "Add gravity, collisions, and movement",
        xp: 120,
      },
      {
        title: "Collision Detection",
        description: "When objects touch in games",
        xp: 110,
      },
      {
        title: "Enemies & AI",
        description: "Create computer-controlled opponents",
        xp: 130,
      },
      {
        title: "Power-ups & Scoring",
        description: "Add collectibles and keep track of points",
        xp: 100,
      },
      {
        title: "Sound Effects & Music",
        description: "Make your game come alive with audio",
        xp: 80,
      },
      {
        title: "User Interface",
        description: "Menus, health bars, and score displays",
        xp: 90,
      },
      {
        title: "Complete Game Project",
        description: "Build a full 2D platformer game",
        xp: 180,
      },
    ],
  },
  {
    id: "game-dev-advanced",
    title: "Advanced Game Programming",
    level: "ADVANCED" as const,
    ageGroup: "AGES_15_18" as const,
    language: "GAME_DEVELOPMENT" as const,
    description:
      "Master game programming! Learn advanced game mechanics, multiplayer systems, and professional game development techniques.",
    lessons: [
      {
        title: "Game Architecture",
        description: "Structure your game code like a pro",
        xp: 150,
      },
      {
        title: "Advanced Physics",
        description: "Realistic movement and collision systems",
        xp: 180,
      },
      {
        title: "State Machines",
        description: "Managing complex game states",
        xp: 150,
      },
      {
        title: "AI & Pathfinding",
        description: "Smart enemies that navigate and strategize",
        xp: 200,
      },
      {
        title: "Particle Systems",
        description: "Creating special effects",
        xp: 140,
      },
      {
        title: "Multiplayer Basics",
        description: "Add online multiplayer to your games",
        xp: 220,
      },
      {
        title: "Save Systems",
        description: "Saving and loading game progress",
        xp: 130,
      },
      {
        title: "Game Optimization",
        description: "Make your games run smooth and fast",
        xp: 150,
      },
      {
        title: "Debugging Games",
        description: "Finding and fixing tricky bugs",
        xp: 120,
      },
      {
        title: "Publishing Your Game",
        description: "Release your game for others to play",
        xp: 200,
      },
    ],
  },
  // Mobile Development Courses
  {
    id: "mobile-dev-intro",
    title: "Introduction to Mobile Apps",
    level: "BEGINNER" as const,
    ageGroup: "AGES_11_14" as const,
    language: "MOBILE_DEVELOPMENT" as const,
    description:
      "Start building mobile apps! Learn the fundamentals of mobile development and create your first app for phones and tablets.",
    lessons: [
      {
        title: "What are Mobile Apps?",
        description: "Understand how apps work on phones and tablets",
        xp: 60,
      },
      {
        title: "iOS vs Android",
        description: "Different platforms for mobile apps",
        xp: 60,
      },
      {
        title: "App Design Basics",
        description: "Learn to design user-friendly mobile interfaces",
        xp: 80,
      },
      {
        title: "Mobile UI Elements",
        description: "Buttons, text, and images on mobile",
        xp: 80,
      },
      {
        title: "Your First App",
        description: "Build a simple mobile app from scratch",
        xp: 100,
      },
      {
        title: "Buttons & Navigation",
        description: "Add interactive elements and screens",
        xp: 100,
      },
      {
        title: "Screen Layouts",
        description: "Arranging elements on mobile screens",
        xp: 90,
      },
      {
        title: "User Input",
        description: "Getting information from users",
        xp: 80,
      },
      {
        title: "Publishing Your App",
        description: "Learn how apps get to the app store",
        xp: 80,
      },
    ],
  },
  {
    id: "mobile-dev-intermediate",
    title: "Mobile App Development",
    level: "INTERMEDIATE" as const,
    ageGroup: "AGES_15_18" as const,
    language: "MOBILE_DEVELOPMENT" as const,
    description:
      "Take your mobile skills further! Build interactive apps with data storage, animations, and real functionality.",
    lessons: [
      {
        title: "Review: Mobile Basics",
        description: "Quick recap of mobile fundamentals",
        xp: 60,
      },
      {
        title: "Advanced UI Components",
        description: "Create lists, cards, and complex layouts",
        xp: 120,
      },
      {
        title: "State Management",
        description: "Managing data in your app",
        xp: 130,
      },
      {
        title: "Working with Data",
        description: "Store and retrieve app data locally",
        xp: 140,
      },
      {
        title: "APIs & Internet",
        description: "Connect your app to online services",
        xp: 150,
      },
      {
        title: "Animations & Effects",
        description: "Make your app feel smooth and responsive",
        xp: 120,
      },
      {
        title: "Push Notifications",
        description: "Sending alerts to users",
        xp: 110,
      },
      {
        title: "Device Features",
        description: "Using camera, location, and more",
        xp: 130,
      },
      {
        title: "Complete App Project",
        description: "Build a fully functional mobile app",
        xp: 200,
      },
    ],
  },
  // Career Prep Courses
  {
    id: "portfolio-basics",
    title: "Build Your Developer Portfolio",
    level: "INTERMEDIATE" as const,
    ageGroup: "AGES_15_18" as const,
    language: "CAREER_PREP" as const,
    description:
      "Create an impressive portfolio website to showcase your coding projects! Learn how professional developers present their work.",
    lessons: [
      {
        title: "What is a Portfolio?",
        description: "Understand why every developer needs a portfolio",
        xp: 60,
      },
      {
        title: "Choosing Your Best Projects",
        description: "Learn to select and present your strongest work",
        xp: 80,
      },
      {
        title: "Portfolio Website Design",
        description: "Design a professional and attractive portfolio layout",
        xp: 100,
      },
      {
        title: "Writing Project Descriptions",
        description: "Describe your projects in a way that impresses",
        xp: 80,
      },
      {
        title: "Adding Screenshots & Demos",
        description: "Showcase your projects with visuals and live demos",
        xp: 100,
      },
      {
        title: "Personal Branding",
        description: "Create a unique developer identity that stands out",
        xp: 80,
      },
      {
        title: "Deploying Your Portfolio",
        description: "Put your portfolio live on the internet",
        xp: 120,
      },
      {
        title: "Portfolio Review & Polish",
        description: "Get your portfolio ready to impress employers",
        xp: 100,
      },
    ],
  },
  {
    id: "tech-resume",
    title: "Writing Your Tech Resume",
    level: "INTERMEDIATE" as const,
    ageGroup: "AGES_15_18" as const,
    language: "CAREER_PREP" as const,
    description:
      "Learn how to write a professional tech resume that gets noticed! Discover what recruiters look for and how to highlight your coding skills.",
    lessons: [
      {
        title: "Resume Basics for Tech",
        description: "Understand what makes a great tech resume different",
        xp: 60,
      },
      {
        title: "Formatting Your Resume",
        description: "Learn the best layout and structure for tech resumes",
        xp: 80,
      },
      {
        title: "Skills Section Mastery",
        description: "List your programming skills the right way",
        xp: 100,
      },
      {
        title: "Project Experience",
        description: "Turn your coding projects into impressive resume content",
        xp: 100,
      },
      {
        title: "Education & Certifications",
        description: "Highlight your learning achievements",
        xp: 70,
      },
      {
        title: "Action Words & Impact",
        description: "Write descriptions that show your accomplishments",
        xp: 90,
      },
      {
        title: "ATS-Friendly Resumes",
        description: "Make sure your resume passes automated screening",
        xp: 80,
      },
      {
        title: "Resume Review Workshop",
        description: "Polish your resume to perfection",
        xp: 120,
      },
    ],
  },
  {
    id: "career-launch",
    title: "Launching Your Tech Career",
    level: "ADVANCED" as const,
    ageGroup: "AGES_15_18" as const,
    language: "CAREER_PREP" as const,
    description:
      "Get ready for your first tech job or internship! Learn interview skills, GitHub profile optimization, LinkedIn setup, and how to network.",
    lessons: [
      {
        title: "The Tech Job Market",
        description: "Understand different career paths in technology",
        xp: 80,
      },
      {
        title: "GitHub Profile Setup",
        description: "Make your GitHub showcase your best work",
        xp: 120,
      },
      {
        title: "LinkedIn for Students",
        description: "Create a professional LinkedIn presence",
        xp: 100,
      },
      {
        title: "Networking Basics",
        description: "Learn to connect with other developers",
        xp: 100,
      },
      {
        title: "Technical Interview Prep",
        description: "Practice common coding interview questions",
        xp: 150,
      },
      {
        title: "Behavioral Interviews",
        description: "Answer soft-skill questions confidently",
        xp: 120,
      },
      {
        title: "Finding Opportunities",
        description: "Where to look for internships and junior roles",
        xp: 100,
      },
      {
        title: "Application Strategy",
        description: "Apply smart and track your job search",
        xp: 100,
      },
      {
        title: "Mock Interview Practice",
        description: "Practice with real interview scenarios",
        xp: 150,
      },
      {
        title: "Your Career Action Plan",
        description: "Create a roadmap for your tech career",
        xp: 180,
      },
    ],
  },
];

// Map language string to content generator
function getContentGenerator(language: string) {
  const langMap: Record<string, keyof typeof contentGenerators> = {
    HTML: "html",
    CSS: "css",
    JAVASCRIPT: "javascript",
    PYTHON: "python",
    ROBLOX: "roblox",
    ENGINEERING: "engineering",
    AI_ML: "ai_ml",
    ROBOTICS: "robotics",
    GAME_DEVELOPMENT: "game_development",
    MOBILE_DEVELOPMENT: "mobile_development",
    CAREER_PREP: "career_prep",
  };
  return contentGenerators[langMap[language] || "html"];
}

function getQuizGenerator(language: string) {
  const langMap: Record<string, keyof typeof quizGenerators> = {
    HTML: "html",
    CSS: "css",
    JAVASCRIPT: "javascript",
    PYTHON: "python",
    ROBLOX: "roblox",
    ENGINEERING: "engineering",
    AI_ML: "ai_ml",
    ROBOTICS: "robotics",
    GAME_DEVELOPMENT: "game_development",
    MOBILE_DEVELOPMENT: "mobile_development",
    CAREER_PREP: "career_prep",
  };
  return quizGenerators[langMap[language] || "html"];
}

async function main() {
  console.log("🚀 Starting comprehensive course seeding...\n");

  for (const courseData of coursesToSeed) {
    console.log(`\n📚 Processing: ${courseData.title}`);

    const slug = generateSlug(courseData.title);

    // Check if course already exists
    const existingCourse = await prisma.course.findUnique({
      where: { slug },
    });

    if (existingCourse) {
      console.log(`   ⚠️ Course already exists, updating lessons...`);

      // Update existing lessons with content
      const lessons = await prisma.lesson.findMany({
        where: { courseId: existingCourse.id },
        orderBy: { orderIndex: "asc" },
      });

      const contentGenerator = getContentGenerator(courseData.language);
      const quizGenerator = getQuizGenerator(courseData.language);

      for (const lesson of lessons) {
        const content = contentGenerator(lesson.title, lesson.description || "");

        await prisma.lesson.update({
          where: { id: lesson.id },
          data: {
            content: content.content,
            exampleCode: content.exampleCode,
            exerciseInstructions: content.exerciseInstructions,
            exerciseStarterCode: content.exerciseStarterCode,
          },
        });

        // Delete existing quizzes for this lesson
        await prisma.quiz.deleteMany({
          where: { lessonId: lesson.id },
        });

        // Create new quizzes
        const quizzes = quizGenerator(lesson.title);
        for (const quiz of quizzes) {
          await prisma.quiz.create({
            data: {
              lessonId: lesson.id,
              question: quiz.question,
              options: quiz.options,
              correctAnswer: quiz.correctAnswer,
            },
          });
        }

        console.log(`   ✅ Updated: ${lesson.title}`);
      }
    } else {
      // Create new course with lessons
      const contentGenerator = getContentGenerator(courseData.language);
      const quizGenerator = getQuizGenerator(courseData.language);

      const course = await prisma.course.create({
        data: {
          title: courseData.title,
          slug,
          description: courseData.description,
          level: courseData.level,
          ageGroup: courseData.ageGroup,
          language: courseData.language,
          lessons: {
            create: courseData.lessons.map((lesson, index) => {
              const content = contentGenerator(lesson.title, lesson.description);
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

      console.log(`   ✅ Created course with ${course.lessons.length} lessons`);

      // Add quizzes to each lesson
      for (const lesson of course.lessons) {
        const quizzes = quizGenerator(lesson.title);
        for (const quiz of quizzes) {
          await prisma.quiz.create({
            data: {
              lessonId: lesson.id,
              question: quiz.question,
              options: quiz.options,
              correctAnswer: quiz.correctAnswer,
            },
          });
        }
      }
      console.log(`   ✅ Added quizzes to all lessons`);
    }
  }

  // Summary
  const totalCourses = await prisma.course.count();
  const totalLessons = await prisma.lesson.count();
  const totalQuizzes = await prisma.quiz.count();

  console.log("\n" + "=".repeat(50));
  console.log("🎉 SEEDING COMPLETE!");
  console.log("=".repeat(50));
  console.log(`📚 Total Courses: ${totalCourses}`);
  console.log(`📖 Total Lessons: ${totalLessons}`);
  console.log(`❓ Total Quizzes: ${totalQuizzes}`);
  console.log("=".repeat(50));
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

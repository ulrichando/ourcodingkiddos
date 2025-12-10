import { PrismaClient, QuestionType } from "@prisma/client";

const prisma = new PrismaClient();

// Gaming Development Courses - Beginner to Master
const gamingCourses = [
  {
    title: "Game Development Foundations",
    slug: "game-development-foundations",
    description: "Start your game development journey! Learn the basics of game design, simple animations, and create your first interactive games using block-based coding and JavaScript.",
    language: "GAME_DEVELOPMENT",
    level: "BEGINNER",
    ageGroup: "AGES_7_10",
    totalXp: 1500,
    estimatedHours: 12,
    lessons: [
      { title: "What is Game Development?", description: "Discover the exciting world of game creation", xp: 100 },
      { title: "Your First Game Concept", description: "Learn to design a simple game idea", xp: 100 },
      { title: "Understanding Game Loops", description: "How games run continuously", xp: 120 },
      { title: "Drawing Shapes & Characters", description: "Create visual elements for your game", xp: 120 },
      { title: "Moving Objects on Screen", description: "Make things move with code", xp: 130 },
      { title: "Keyboard Controls", description: "Let players control your game", xp: 130 },
      { title: "Collision Detection Basics", description: "When game objects touch", xp: 140 },
      { title: "Adding Sound Effects", description: "Make your game come alive with audio", xp: 140 },
      { title: "Keeping Score", description: "Track player progress", xp: 150 },
      { title: "Game Over & Restart", description: "Handle winning and losing", xp: 150 },
      { title: "Project: Catch the Falling Stars", description: "Build a complete catching game", xp: 170 }
    ]
  },
  {
    title: "2D Game Development with JavaScript",
    slug: "2d-game-development-javascript",
    description: "Level up your skills with 2D game development! Master sprite animations, physics, tile maps, and create polished platformers and arcade games.",
    language: "GAME_DEVELOPMENT",
    level: "INTERMEDIATE",
    ageGroup: "AGES_11_14",
    totalXp: 2500,
    estimatedHours: 20,
    lessons: [
      { title: "Setting Up Your Game Engine", description: "Configure a professional game development environment", xp: 150 },
      { title: "The HTML5 Canvas Deep Dive", description: "Master the canvas API for 2D graphics", xp: 150 },
      { title: "Sprite Sheets & Animation", description: "Create smooth character animations", xp: 170 },
      { title: "Physics: Gravity & Velocity", description: "Make realistic movement", xp: 170 },
      { title: "Platformer Mechanics", description: "Jumping, running, and climbing", xp: 180 },
      { title: "Tile-Based Maps", description: "Create game levels with tiles", xp: 180 },
      { title: "Camera Systems", description: "Follow the player through levels", xp: 190 },
      { title: "Enemy AI Basics", description: "Create intelligent opponents", xp: 190 },
      { title: "Power-ups & Collectibles", description: "Add items that affect gameplay", xp: 200 },
      { title: "Particle Effects", description: "Explosions, sparkles, and more", xp: 200 },
      { title: "Level Design Principles", description: "Design fun and challenging levels", xp: 210 },
      { title: "Game State Management", description: "Menus, pausing, and saving", xp: 210 },
      { title: "Project: Super Platformer", description: "Build a complete platformer game", xp: 300 }
    ]
  },
  {
    title: "Advanced Game Development",
    slug: "advanced-game-development",
    description: "Take your games to the next level! Learn advanced physics, procedural generation, shaders, and modern game engine patterns.",
    language: "GAME_DEVELOPMENT",
    level: "ADVANCED",
    ageGroup: "AGES_15_18",
    totalXp: 3500,
    estimatedHours: 30,
    lessons: [
      { title: "Game Architecture Patterns", description: "Entity-Component-System and more", xp: 200 },
      { title: "Advanced Physics Simulation", description: "Rigid bodies, forces, and constraints", xp: 220 },
      { title: "Procedural Content Generation", description: "Generate infinite game content", xp: 220 },
      { title: "Introduction to Shaders", description: "GPU programming for visual effects", xp: 240 },
      { title: "Advanced Animation Systems", description: "State machines and blending", xp: 240 },
      { title: "Pathfinding Algorithms", description: "A* and navigation meshes", xp: 250 },
      { title: "Advanced AI: Behavior Trees", description: "Complex enemy decision making", xp: 250 },
      { title: "Audio Design & Implementation", description: "Dynamic soundscapes", xp: 220 },
      { title: "UI/UX for Games", description: "Create intuitive game interfaces", xp: 220 },
      { title: "Performance Optimization", description: "Make games run smoothly", xp: 260 },
      { title: "Mobile Game Development", description: "Touch controls and optimization", xp: 260 },
      { title: "Intro to 3D Concepts", description: "3D coordinates and transformations", xp: 280 },
      { title: "Project: Roguelike Adventure", description: "Build a procedural dungeon crawler", xp: 340 }
    ]
  },
  {
    title: "Game Engine Mastery",
    slug: "game-engine-mastery",
    description: "Master professional game engines! Deep dive into Unity or Godot, multiplayer networking, advanced graphics, and publish-ready game development.",
    language: "GAME_DEVELOPMENT",
    level: "EXPERT",
    ageGroup: "AGES_15_18",
    totalXp: 4500,
    estimatedHours: 40,
    lessons: [
      { title: "Choosing Your Game Engine", description: "Unity, Godot, Unreal - pros and cons", xp: 250 },
      { title: "Engine Architecture Deep Dive", description: "Understanding how engines work", xp: 280 },
      { title: "Advanced Scene Management", description: "Loading, transitions, and memory", xp: 280 },
      { title: "Custom Physics & Collision", description: "Beyond built-in physics", xp: 300 },
      { title: "Shader Programming", description: "Write custom visual effects", xp: 320 },
      { title: "Multiplayer Fundamentals", description: "Networking basics for games", xp: 300 },
      { title: "Client-Server Architecture", description: "Authoritative servers and prediction", xp: 320 },
      { title: "Real-time Multiplayer Sync", description: "Keep players in sync", xp: 320 },
      { title: "Save Systems & Data Persistence", description: "Cloud saves and player data", xp: 280 },
      { title: "Localization & Accessibility", description: "Games for everyone", xp: 260 },
      { title: "Analytics & Player Behavior", description: "Understand your players", xp: 280 },
      { title: "Monetization Strategies", description: "Ethical game business models", xp: 260 },
      { title: "Platform Publishing", description: "Steam, App Store, Play Store", xp: 280 },
      { title: "Project: Multiplayer Arena Game", description: "Build a real-time multiplayer game", xp: 470 }
    ]
  },
  {
    title: "Professional Game Development",
    slug: "professional-game-development",
    description: "Become a professional game developer! Master advanced 3D graphics, VR/AR development, game studio workflows, and build portfolio-worthy projects.",
    language: "GAME_DEVELOPMENT",
    level: "MASTER",
    ageGroup: "AGES_15_18",
    totalXp: 5500,
    estimatedHours: 50,
    lessons: [
      { title: "The Game Industry Landscape", description: "Careers, studios, and indie dev", xp: 280 },
      { title: "Game Design Documentation", description: "Professional GDD creation", xp: 300 },
      { title: "Advanced 3D Graphics", description: "PBR, lighting, and post-processing", xp: 350 },
      { title: "Character Animation Systems", description: "IK, ragdolls, and mocap", xp: 350 },
      { title: "VR Development Fundamentals", description: "Virtual reality game creation", xp: 380 },
      { title: "AR Game Development", description: "Augmented reality experiences", xp: 350 },
      { title: "Advanced Networking & Security", description: "Anti-cheat and server architecture", xp: 380 },
      { title: "CI/CD for Game Development", description: "Automated builds and testing", xp: 320 },
      { title: "Team Collaboration Tools", description: "Git, version control for games", xp: 300 },
      { title: "Quality Assurance & Testing", description: "Bug tracking and playtesting", xp: 300 },
      { title: "Marketing Your Game", description: "Trailers, demos, and community", xp: 280 },
      { title: "Legal & Business Basics", description: "Contracts, IP, and forming studios", xp: 280 },
      { title: "Post-Launch Support", description: "Updates, DLC, and live service", xp: 280 },
      { title: "Building Your Portfolio", description: "Showcase your best work", xp: 300 },
      { title: "Project: Capstone Game", description: "Create a polished, publishable game", xp: 550 }
    ]
  }
];

// Detailed lesson content for each level
const lessonContentByLevel: Record<string, any[]> = {
  "game-development-foundations": [
    {
      title: "What is Game Development?",
      content: `
<h2>🎮 Welcome to Game Development!</h2>

<p>Have you ever played a video game and wondered "How was this made?" That's what we're about to discover!</p>

<h3>What Makes a Game?</h3>

<p>Every game has these key ingredients:</p>

<ul>
<li><strong>Graphics</strong> - What you see (characters, backgrounds, buttons)</li>
<li><strong>Sound</strong> - Music and sound effects</li>
<li><strong>Input</strong> - How you control the game (keyboard, mouse, controller)</li>
<li><strong>Logic</strong> - The rules that make the game work</li>
</ul>

<h3>🎯 Types of Games You Can Make</h3>

<ul>
<li>Platformers (like Mario)</li>
<li>Puzzle games (like Tetris)</li>
<li>Adventure games (like Zelda)</li>
<li>Racing games</li>
<li>And so much more!</li>
</ul>

<h3>💡 Fun Fact</h3>
<p>The first video game ever was created in 1958 - "Tennis for Two"!</p>
`,
      exampleCode: `<!DOCTYPE html>
<html>
<head>
  <title>My First Game</title>
  <style>
    canvas { border: 2px solid black; }
  </style>
</head>
<body>
  <h1>My Game Canvas</h1>
  <canvas id="gameCanvas" width="400" height="300"></canvas>

  <script>
    // Get the canvas
    let canvas = document.getElementById("gameCanvas");
    let ctx = canvas.getContext("2d");

    // Draw a simple character (a smiley face!)
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(200, 150, 50, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(180, 135, 8, 0, Math.PI * 2);
    ctx.arc(220, 135, 8, 0, Math.PI * 2);
    ctx.fill();

    // Smile
    ctx.beginPath();
    ctx.arc(200, 155, 25, 0, Math.PI);
    ctx.stroke();

    console.log("Game canvas ready!");
  </script>
</body>
</html>`,
      exerciseInstructions: "Change the smiley face color from yellow to your favorite color! Try 'orange', 'pink', or 'lightblue'.",
      exerciseStarterCode: `<!DOCTYPE html>
<html>
<head>
  <title>My First Game</title>
  <style>
    canvas { border: 2px solid black; }
  </style>
</head>
<body>
  <canvas id="gameCanvas" width="400" height="300"></canvas>

  <script>
    let canvas = document.getElementById("gameCanvas");
    let ctx = canvas.getContext("2d");

    // Change the color below!
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(200, 150, 50, 0, Math.PI * 2);
    ctx.fill();
  </script>
</body>
</html>`,
      quiz: [
        { question: "What are the four main ingredients of a video game?", options: ["Graphics, Sound, Input, Logic", "Colors, Music, Keys, Math", "Pictures, Audio, Buttons, Code", "Art, Noise, Control, Rules"], correctAnswer: "Graphics, Sound, Input, Logic", explanation: "Every game needs graphics (visuals), sound (audio), input (controls), and logic (rules)!" },
        { question: "What is a canvas in game development?", options: ["A place to paint", "An area to draw game graphics", "A type of game", "A sound effect"], correctAnswer: "An area to draw game graphics", explanation: "The HTML canvas is a special area where we can draw graphics for our games!" }
      ]
    },
    {
      title: "Your First Game Concept",
      content: `
<h2>💡 Designing Your Game</h2>

<p>Before we code, we need to PLAN! Every great game starts with a great idea.</p>

<h3>The Game Design Document (GDD)</h3>

<p>Even a simple game needs these basics:</p>

<ol>
<li><strong>Goal</strong> - What is the player trying to do?</li>
<li><strong>Rules</strong> - What can and can't they do?</li>
<li><strong>Challenge</strong> - What makes it difficult?</li>
<li><strong>Reward</strong> - What happens when they succeed?</li>
</ol>

<h3>🎯 Example: Catching Game</h3>

<ul>
<li><strong>Goal:</strong> Catch falling objects</li>
<li><strong>Rules:</strong> Move left/right with arrow keys</li>
<li><strong>Challenge:</strong> Objects fall faster over time</li>
<li><strong>Reward:</strong> Points for each catch, high score!</li>
</ul>

<h3>🎨 Drawing Your Ideas</h3>

<p>Sketch your game on paper first! It doesn't have to be pretty - just clear enough to understand.</p>
`,
      exampleCode: `<!DOCTYPE html>
<html>
<head>
  <title>Game Concept Sketch</title>
  <style>
    canvas { border: 2px solid black; background: #87CEEB; }
  </style>
</head>
<body>
  <h1>My Game Concept</h1>
  <canvas id="gameCanvas" width="400" height="300"></canvas>

  <script>
    let canvas = document.getElementById("gameCanvas");
    let ctx = canvas.getContext("2d");

    // Draw ground
    ctx.fillStyle = "green";
    ctx.fillRect(0, 250, 400, 50);

    // Draw player (basket)
    ctx.fillStyle = "brown";
    ctx.fillRect(150, 220, 60, 30);

    // Draw falling objects (stars)
    ctx.fillStyle = "gold";
    ctx.font = "30px Arial";
    ctx.fillText("⭐", 100, 50);
    ctx.fillText("⭐", 200, 100);
    ctx.fillText("⭐", 280, 150);

    // Draw score
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: 0", 10, 25);

    // Label
    ctx.fillText("← Move with arrow keys →", 100, 290);
  </script>
</body>
</html>`,
      exerciseInstructions: "Design your own game concept! Change the player shape (try a rectangle or use emoji), and add different falling objects.",
      exerciseStarterCode: `<!DOCTYPE html>
<html>
<head>
  <title>My Game Concept</title>
  <style>
    canvas { border: 2px solid black; background: #87CEEB; }
  </style>
</head>
<body>
  <canvas id="gameCanvas" width="400" height="300"></canvas>

  <script>
    let canvas = document.getElementById("gameCanvas");
    let ctx = canvas.getContext("2d");

    // Draw your game world here!
    // Ground
    ctx.fillStyle = "green";
    ctx.fillRect(0, 250, 400, 50);

    // Your player (change this!)

    // Falling objects (add some!)

  </script>
</body>
</html>`,
      quiz: [
        { question: "What does a Game Design Document describe?", options: ["Only the graphics", "The goal, rules, challenge, and reward", "Just the code", "Only the sounds"], correctAnswer: "The goal, rules, challenge, and reward", explanation: "A GDD outlines everything about how your game works!" },
        { question: "Why should you sketch your game idea first?", options: ["To make it look pretty", "To plan before coding", "It's a waste of time", "Only professionals do that"], correctAnswer: "To plan before coding", explanation: "Planning helps you think through your game before writing code!" }
      ]
    },
    {
      title: "Understanding Game Loops",
      content: `
<h2>🔄 The Heartbeat of Every Game</h2>

<p>Games don't just run once - they run over and over, many times per second! This is called the <strong>game loop</strong>.</p>

<h3>What Happens Each Frame?</h3>

<ol>
<li><strong>Update</strong> - Move objects, check collisions, handle input</li>
<li><strong>Draw</strong> - Clear the screen and draw everything</li>
<li><strong>Repeat!</strong> - Do it all again, 60 times per second</li>
</ol>

<h3>🎬 Frames Per Second (FPS)</h3>

<p>Movies run at 24 FPS. Games typically run at 60 FPS - that's 60 updates every second!</p>

<h3>💻 requestAnimationFrame()</h3>

<p>This special function tells the browser: "Call my function again for the next frame!"</p>

<pre><code>function gameLoop() {
  update();  // Move things
  draw();    // Show things
  requestAnimationFrame(gameLoop);  // Do it again!
}</code></pre>
`,
      exampleCode: `<!DOCTYPE html>
<html>
<head>
  <title>Game Loop Demo</title>
  <style>
    canvas { border: 2px solid black; }
  </style>
</head>
<body>
  <h1>Watch the ball bounce!</h1>
  <canvas id="gameCanvas" width="400" height="300"></canvas>

  <script>
    let canvas = document.getElementById("gameCanvas");
    let ctx = canvas.getContext("2d");

    // Ball properties
    let x = 200;
    let y = 150;
    let speedX = 3;
    let speedY = 2;
    let radius = 20;

    function update() {
      // Move the ball
      x += speedX;
      y += speedY;

      // Bounce off walls
      if (x + radius > 400 || x - radius < 0) {
        speedX = -speedX;
      }
      if (y + radius > 300 || y - radius < 0) {
        speedY = -speedY;
      }
    }

    function draw() {
      // Clear the canvas
      ctx.clearRect(0, 0, 400, 300);

      // Draw the ball
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    function gameLoop() {
      update();
      draw();
      requestAnimationFrame(gameLoop);
    }

    // Start the game!
    gameLoop();
  </script>
</body>
</html>`,
      exerciseInstructions: "Change the ball's speed (speedX and speedY) and color. Try making it faster or slower!",
      exerciseStarterCode: `<!DOCTYPE html>
<html>
<head>
  <title>Game Loop Practice</title>
  <style>
    canvas { border: 2px solid black; }
  </style>
</head>
<body>
  <canvas id="gameCanvas" width="400" height="300"></canvas>

  <script>
    let canvas = document.getElementById("gameCanvas");
    let ctx = canvas.getContext("2d");

    let x = 200, y = 150;
    // Change these speeds!
    let speedX = 3;
    let speedY = 2;

    function update() {
      x += speedX;
      y += speedY;
      if (x > 380 || x < 20) speedX = -speedX;
      if (y > 280 || y < 20) speedY = -speedY;
    }

    function draw() {
      ctx.clearRect(0, 0, 400, 300);
      // Change the color!
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fill();
    }

    function gameLoop() {
      update();
      draw();
      requestAnimationFrame(gameLoop);
    }

    gameLoop();
  </script>
</body>
</html>`,
      quiz: [
        { question: "How many times per second does a typical game loop run?", options: ["10 times", "24 times", "60 times", "100 times"], correctAnswer: "60 times", explanation: "Most games target 60 FPS (frames per second) for smooth gameplay!" },
        { question: "What are the two main parts of a game loop?", options: ["Start and Stop", "Update and Draw", "Load and Save", "Click and Move"], correctAnswer: "Update and Draw", explanation: "Update moves things and handles logic, Draw shows everything on screen!" }
      ]
    },
    {
      title: "Drawing Shapes & Characters",
      content: `
<h2>🎨 Creating Game Graphics</h2>

<p>Let's learn to draw all the shapes you need for your games!</p>

<h3>Basic Shapes</h3>

<pre><code>// Rectangle
ctx.fillRect(x, y, width, height);

// Circle
ctx.beginPath();
ctx.arc(x, y, radius, 0, Math.PI * 2);
ctx.fill();

// Line
ctx.beginPath();
ctx.moveTo(x1, y1);
ctx.lineTo(x2, y2);
ctx.stroke();</code></pre>

<h3>🎨 Colors</h3>

<pre><code>ctx.fillStyle = "blue";      // Fill color
ctx.strokeStyle = "red";     // Outline color
ctx.lineWidth = 3;           // Line thickness</code></pre>

<h3>🎭 Building Characters</h3>

<p>Characters are just combinations of shapes! A person might be:</p>
<ul>
<li>Circle for head</li>
<li>Rectangle for body</li>
<li>Smaller rectangles for arms and legs</li>
</ul>
`,
      exampleCode: `<!DOCTYPE html>
<html>
<head>
  <title>Drawing Characters</title>
  <style>
    canvas { border: 2px solid black; background: #87CEEB; }
  </style>
</head>
<body>
  <h1>Game Characters</h1>
  <canvas id="gameCanvas" width="400" height="300"></canvas>

  <script>
    let canvas = document.getElementById("gameCanvas");
    let ctx = canvas.getContext("2d");

    // Draw a simple robot character
    function drawRobot(x, y) {
      // Body
      ctx.fillStyle = "gray";
      ctx.fillRect(x - 25, y, 50, 60);

      // Head
      ctx.fillStyle = "silver";
      ctx.fillRect(x - 20, y - 35, 40, 35);

      // Eyes
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(x - 8, y - 18, 6, 0, Math.PI * 2);
      ctx.arc(x + 8, y - 18, 6, 0, Math.PI * 2);
      ctx.fill();

      // Antenna
      ctx.strokeStyle = "black";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, y - 35);
      ctx.lineTo(x, y - 50);
      ctx.stroke();
      ctx.fillStyle = "yellow";
      ctx.beginPath();
      ctx.arc(x, y - 50, 5, 0, Math.PI * 2);
      ctx.fill();

      // Legs
      ctx.fillStyle = "darkgray";
      ctx.fillRect(x - 20, y + 60, 15, 25);
      ctx.fillRect(x + 5, y + 60, 15, 25);
    }

    // Draw ground
    ctx.fillStyle = "green";
    ctx.fillRect(0, 235, 400, 65);

    // Draw robots
    drawRobot(100, 150);
    drawRobot(250, 150);
  </script>
</body>
</html>`,
      exerciseInstructions: "Create your own character! Try making a different creature using circles and rectangles.",
      exerciseStarterCode: `<!DOCTYPE html>
<html>
<head>
  <title>My Character</title>
  <style>
    canvas { border: 2px solid black; }
  </style>
</head>
<body>
  <canvas id="gameCanvas" width="400" height="300"></canvas>

  <script>
    let canvas = document.getElementById("gameCanvas");
    let ctx = canvas.getContext("2d");

    // Create your character!
    // Use ctx.fillRect(x, y, width, height) for rectangles
    // Use ctx.arc(x, y, radius, 0, Math.PI * 2) for circles

    // Head (circle)
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(200, 100, 40, 0, Math.PI * 2);
    ctx.fill();

    // Add more parts!

  </script>
</body>
</html>`,
      quiz: [
        { question: "Which method draws a filled rectangle?", options: ["drawRect()", "fillRect()", "rectangle()", "makeRect()"], correctAnswer: "fillRect()", explanation: "ctx.fillRect(x, y, width, height) draws a filled rectangle!" },
        { question: "What does ctx.fillStyle change?", options: ["The shape size", "The fill color", "The position", "The speed"], correctAnswer: "The fill color", explanation: "fillStyle sets the color used to fill shapes!" }
      ]
    },
    {
      title: "Moving Objects on Screen",
      content: `
<h2>🏃 Animation Basics</h2>

<p>To make things move, we change their position a little bit each frame!</p>

<h3>Position Variables</h3>

<pre><code>let x = 100;  // Horizontal position
let y = 200;  // Vertical position

// In update():
x = x + 2;    // Move right
y = y - 1;    // Move up</code></pre>

<h3>🧭 Understanding Coordinates</h3>

<ul>
<li>X increases going RIGHT</li>
<li>Y increases going DOWN (opposite of math class!)</li>
<li>(0, 0) is the top-left corner</li>
</ul>

<h3>📐 Speed Variables</h3>

<pre><code>let speedX = 3;  // How fast to move horizontally
let speedY = 2;  // How fast to move vertically

// In update():
x += speedX;
y += speedY;</code></pre>
`,
      exampleCode: `<!DOCTYPE html>
<html>
<head>
  <title>Moving Objects</title>
  <style>
    canvas { border: 2px solid black; background: #222; }
  </style>
</head>
<body>
  <h1>Watch the spaceship fly!</h1>
  <canvas id="gameCanvas" width="400" height="300"></canvas>

  <script>
    let canvas = document.getElementById("gameCanvas");
    let ctx = canvas.getContext("2d");

    // Spaceship position and speed
    let shipX = 50;
    let shipY = 150;
    let speedX = 2;

    // Stars (background decoration)
    let stars = [];
    for (let i = 0; i < 50; i++) {
      stars.push({
        x: Math.random() * 400,
        y: Math.random() * 300
      });
    }

    function drawSpaceship(x, y) {
      ctx.fillStyle = "silver";
      ctx.beginPath();
      ctx.moveTo(x + 30, y);
      ctx.lineTo(x - 15, y - 15);
      ctx.lineTo(x - 15, y + 15);
      ctx.closePath();
      ctx.fill();

      // Flame
      ctx.fillStyle = "orange";
      ctx.beginPath();
      ctx.moveTo(x - 15, y - 8);
      ctx.lineTo(x - 30, y);
      ctx.lineTo(x - 15, y + 8);
      ctx.fill();
    }

    function update() {
      shipX += speedX;

      // Wrap around screen
      if (shipX > 430) {
        shipX = -30;
      }
    }

    function draw() {
      ctx.clearRect(0, 0, 400, 300);

      // Draw stars
      ctx.fillStyle = "white";
      stars.forEach(star => {
        ctx.fillRect(star.x, star.y, 2, 2);
      });

      drawSpaceship(shipX, shipY);
    }

    function gameLoop() {
      update();
      draw();
      requestAnimationFrame(gameLoop);
    }

    gameLoop();
  </script>
</body>
</html>`,
      exerciseInstructions: "Make the spaceship move up and down as well as side to side! Add a speedY variable.",
      exerciseStarterCode: `<!DOCTYPE html>
<html>
<head>
  <title>Moving Practice</title>
  <style>
    canvas { border: 2px solid black; background: #222; }
  </style>
</head>
<body>
  <canvas id="gameCanvas" width="400" height="300"></canvas>

  <script>
    let canvas = document.getElementById("gameCanvas");
    let ctx = canvas.getContext("2d");

    let shipX = 50;
    let shipY = 150;
    let speedX = 2;
    // Add speedY here!

    function update() {
      shipX += speedX;
      // Add y movement here!

      if (shipX > 430) shipX = -30;
    }

    function draw() {
      ctx.clearRect(0, 0, 400, 300);
      ctx.fillStyle = "lime";
      ctx.beginPath();
      ctx.arc(shipX, shipY, 20, 0, Math.PI * 2);
      ctx.fill();
    }

    function gameLoop() {
      update();
      draw();
      requestAnimationFrame(gameLoop);
    }

    gameLoop();
  </script>
</body>
</html>`,
      quiz: [
        { question: "In canvas coordinates, which direction does Y increase?", options: ["Up", "Down", "Left", "Right"], correctAnswer: "Down", explanation: "Y increases going DOWN, which is opposite of regular math!" },
        { question: "To move an object right, what do you do to X?", options: ["Subtract from it", "Add to it", "Multiply it", "Divide it"], correctAnswer: "Add to it", explanation: "Adding to X moves objects to the right!" }
      ]
    },
    {
      title: "Keyboard Controls",
      content: `
<h2>⌨️ Player Input</h2>

<p>Let's make the player control our game characters!</p>

<h3>Listening for Key Presses</h3>

<pre><code>let keys = {};

document.addEventListener("keydown", function(e) {
  keys[e.key] = true;
});

document.addEventListener("keyup", function(e) {
  keys[e.key] = false;
});</code></pre>

<h3>🎮 Common Keys</h3>

<ul>
<li><code>"ArrowUp"</code>, <code>"ArrowDown"</code></li>
<li><code>"ArrowLeft"</code>, <code>"ArrowRight"</code></li>
<li><code>" "</code> (spacebar)</li>
<li><code>"w"</code>, <code>"a"</code>, <code>"s"</code>, <code>"d"</code></li>
</ul>

<h3>📋 Using Key States</h3>

<pre><code>function update() {
  if (keys["ArrowLeft"]) {
    playerX -= 5;
  }
  if (keys["ArrowRight"]) {
    playerX += 5;
  }
}</code></pre>
`,
      exampleCode: `<!DOCTYPE html>
<html>
<head>
  <title>Keyboard Controls</title>
  <style>
    canvas { border: 2px solid black; background: #333; }
  </style>
</head>
<body>
  <h1>Use arrow keys to move!</h1>
  <canvas id="gameCanvas" width="400" height="300"></canvas>

  <script>
    let canvas = document.getElementById("gameCanvas");
    let ctx = canvas.getContext("2d");

    let playerX = 200;
    let playerY = 250;
    let playerSpeed = 5;

    let keys = {};

    document.addEventListener("keydown", function(e) {
      keys[e.key] = true;
      e.preventDefault();
    });

    document.addEventListener("keyup", function(e) {
      keys[e.key] = false;
    });

    function update() {
      if (keys["ArrowLeft"] && playerX > 25) {
        playerX -= playerSpeed;
      }
      if (keys["ArrowRight"] && playerX < 375) {
        playerX += playerSpeed;
      }
      if (keys["ArrowUp"] && playerY > 25) {
        playerY -= playerSpeed;
      }
      if (keys["ArrowDown"] && playerY < 275) {
        playerY -= playerSpeed;
      }
    }

    function draw() {
      ctx.clearRect(0, 0, 400, 300);

      // Draw player
      ctx.fillStyle = "lime";
      ctx.beginPath();
      ctx.arc(playerX, playerY, 25, 0, Math.PI * 2);
      ctx.fill();

      // Draw face
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(playerX - 8, playerY - 5, 4, 0, Math.PI * 2);
      ctx.arc(playerX + 8, playerY - 5, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(playerX, playerY + 5, 10, 0, Math.PI);
      ctx.stroke();
    }

    function gameLoop() {
      update();
      draw();
      requestAnimationFrame(gameLoop);
    }

    gameLoop();
  </script>
</body>
</html>`,
      exerciseInstructions: "Fix the bug! The down arrow isn't working correctly. Find and fix the mistake in the update function.",
      exerciseStarterCode: `<!DOCTYPE html>
<html>
<head>
  <title>Fix the Controls</title>
  <style>
    canvas { border: 2px solid black; }
  </style>
</head>
<body>
  <canvas id="gameCanvas" width="400" height="300"></canvas>

  <script>
    let canvas = document.getElementById("gameCanvas");
    let ctx = canvas.getContext("2d");

    let playerX = 200, playerY = 150;
    let keys = {};

    document.addEventListener("keydown", e => { keys[e.key] = true; e.preventDefault(); });
    document.addEventListener("keyup", e => { keys[e.key] = false; });

    function update() {
      if (keys["ArrowLeft"]) playerX -= 5;
      if (keys["ArrowRight"]) playerX += 5;
      if (keys["ArrowUp"]) playerY -= 5;
      // Fix this line - it should move DOWN!
      if (keys["ArrowDown"]) playerY -= 5;
    }

    function draw() {
      ctx.clearRect(0, 0, 400, 300);
      ctx.fillStyle = "blue";
      ctx.fillRect(playerX - 20, playerY - 20, 40, 40);
    }

    function gameLoop() {
      update();
      draw();
      requestAnimationFrame(gameLoop);
    }

    gameLoop();
  </script>
</body>
</html>`,
      quiz: [
        { question: "What event fires when a key is pressed?", options: ["keypress", "keydown", "keypush", "keystart"], correctAnswer: "keydown", explanation: "keydown fires when any key is pressed down!" },
        { question: "Why do we use a keys object instead of just checking keydown?", options: ["It's faster", "It remembers which keys are held down", "It looks cooler", "It uses less memory"], correctAnswer: "It remembers which keys are held down", explanation: "The keys object tracks which keys are currently being held, not just pressed once!" }
      ]
    },
    {
      title: "Collision Detection Basics",
      content: `
<h2>💥 When Objects Touch</h2>

<p>Collision detection tells us when two game objects overlap!</p>

<h3>Rectangle Collision (AABB)</h3>

<p>Two rectangles collide when ALL of these are true:</p>

<pre><code>function rectsCollide(r1, r2) {
  return r1.x < r2.x + r2.width &&
         r1.x + r1.width > r2.x &&
         r1.y < r2.y + r2.height &&
         r1.y + r1.height > r2.y;
}</code></pre>

<h3>⭕ Circle Collision</h3>

<p>Two circles collide when the distance between centers is less than the sum of radii:</p>

<pre><code>function circlesCollide(c1, c2) {
  let dx = c1.x - c2.x;
  let dy = c1.y - c2.y;
  let distance = Math.sqrt(dx * dx + dy * dy);
  return distance < c1.radius + c2.radius;
}</code></pre>
`,
      exampleCode: `<!DOCTYPE html>
<html>
<head>
  <title>Collision Detection</title>
  <style>
    canvas { border: 2px solid black; }
  </style>
</head>
<body>
  <h1>Move to collect the coins!</h1>
  <p>Score: <span id="score">0</span></p>
  <canvas id="gameCanvas" width="400" height="300"></canvas>

  <script>
    let canvas = document.getElementById("gameCanvas");
    let ctx = canvas.getContext("2d");

    let player = { x: 200, y: 150, radius: 20 };
    let coins = [
      { x: 50, y: 50, radius: 15 },
      { x: 350, y: 100, radius: 15 },
      { x: 100, y: 250, radius: 15 },
      { x: 300, y: 200, radius: 15 }
    ];
    let score = 0;
    let keys = {};

    document.addEventListener("keydown", e => { keys[e.key] = true; e.preventDefault(); });
    document.addEventListener("keyup", e => { keys[e.key] = false; });

    function circlesCollide(c1, c2) {
      let dx = c1.x - c2.x;
      let dy = c1.y - c2.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      return distance < c1.radius + c2.radius;
    }

    function update() {
      if (keys["ArrowLeft"]) player.x -= 5;
      if (keys["ArrowRight"]) player.x += 5;
      if (keys["ArrowUp"]) player.y -= 5;
      if (keys["ArrowDown"]) player.y += 5;

      // Check coin collisions
      coins = coins.filter(coin => {
        if (circlesCollide(player, coin)) {
          score++;
          document.getElementById("score").textContent = score;
          return false;
        }
        return true;
      });
    }

    function draw() {
      ctx.clearRect(0, 0, 400, 300);

      // Draw coins
      ctx.fillStyle = "gold";
      coins.forEach(coin => {
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw player
      ctx.fillStyle = "blue";
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    function gameLoop() {
      update();
      draw();
      requestAnimationFrame(gameLoop);
    }

    gameLoop();
  </script>
</body>
</html>`,
      exerciseInstructions: "Add more coins to the game! Create at least 3 more coin objects in the coins array.",
      exerciseStarterCode: `<!DOCTYPE html>
<html>
<head>
  <title>More Coins!</title>
  <style>
    canvas { border: 2px solid black; }
  </style>
</head>
<body>
  <p>Score: <span id="score">0</span></p>
  <canvas id="gameCanvas" width="400" height="300"></canvas>

  <script>
    let canvas = document.getElementById("gameCanvas");
    let ctx = canvas.getContext("2d");

    let player = { x: 200, y: 150, radius: 20 };
    // Add more coins here!
    let coins = [
      { x: 50, y: 50, radius: 15 }
    ];
    let score = 0;
    let keys = {};

    document.addEventListener("keydown", e => { keys[e.key] = true; e.preventDefault(); });
    document.addEventListener("keyup", e => { keys[e.key] = false; });

    function circlesCollide(c1, c2) {
      let dx = c1.x - c2.x;
      let dy = c1.y - c2.y;
      return Math.sqrt(dx*dx + dy*dy) < c1.radius + c2.radius;
    }

    function update() {
      if (keys["ArrowLeft"]) player.x -= 5;
      if (keys["ArrowRight"]) player.x += 5;
      if (keys["ArrowUp"]) player.y -= 5;
      if (keys["ArrowDown"]) player.y += 5;

      coins = coins.filter(coin => {
        if (circlesCollide(player, coin)) {
          score++;
          document.getElementById("score").textContent = score;
          return false;
        }
        return true;
      });
    }

    function draw() {
      ctx.clearRect(0, 0, 400, 300);
      ctx.fillStyle = "gold";
      coins.forEach(c => { ctx.beginPath(); ctx.arc(c.x, c.y, c.radius, 0, Math.PI*2); ctx.fill(); });
      ctx.fillStyle = "blue";
      ctx.beginPath(); ctx.arc(player.x, player.y, player.radius, 0, Math.PI*2); ctx.fill();
    }

    function gameLoop() { update(); draw(); requestAnimationFrame(gameLoop); }
    gameLoop();
  </script>
</body>
</html>`,
      quiz: [
        { question: "What is AABB collision detection?", options: ["Axis-Aligned Bounding Box", "All Around Bounce Back", "Automatic Action Bump Block", "Advanced Accurate Boundary Box"], correctAnswer: "Axis-Aligned Bounding Box", explanation: "AABB stands for Axis-Aligned Bounding Box - rectangle collision!" },
        { question: "What do you need to know to detect if two circles collide?", options: ["Their colors", "Their positions and radii", "Their speeds", "Their names"], correctAnswer: "Their positions and radii", explanation: "We compare the distance between centers to the sum of their radii!" }
      ]
    },
    {
      title: "Adding Sound Effects",
      content: `
<h2>🔊 Bringing Games to Life with Audio</h2>

<p>Sound makes games so much more fun! Let's add sound effects.</p>

<h3>Playing Sounds in JavaScript</h3>

<pre><code>// Create an audio object
let sound = new Audio("sound.mp3");

// Play it!
sound.play();

// Play it again
sound.currentTime = 0;
sound.play();</code></pre>

<h3>🎵 Web Audio for Generated Sounds</h3>

<pre><code>let audioContext = new AudioContext();

function playBeep() {
  let osc = audioContext.createOscillator();
  osc.connect(audioContext.destination);
  osc.frequency.value = 440; // Hz
  osc.start();
  osc.stop(audioContext.currentTime + 0.1);
}</code></pre>
`,
      exampleCode: `<!DOCTYPE html>
<html>
<head>
  <title>Sound Effects</title>
  <style>
    canvas { border: 2px solid black; }
    button { font-size: 18px; margin: 10px; padding: 10px 20px; }
  </style>
</head>
<body>
  <h1>Sound Demo - Collect the coins!</h1>
  <button id="startBtn">Click to Start (enables sound)</button>
  <p>Score: <span id="score">0</span></p>
  <canvas id="gameCanvas" width="400" height="300"></canvas>

  <script>
    let canvas = document.getElementById("gameCanvas");
    let ctx = canvas.getContext("2d");
    let audioContext;

    document.getElementById("startBtn").addEventListener("click", function() {
      audioContext = new AudioContext();
      this.style.display = "none";
    });

    function playCollectSound() {
      if (!audioContext) return;
      let osc = audioContext.createOscillator();
      let gain = audioContext.createGain();
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.3, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      osc.start();
      osc.stop(audioContext.currentTime + 0.2);
    }

    let player = { x: 200, y: 150, radius: 20 };
    let coins = [];
    let score = 0;
    let keys = {};

    function spawnCoin() {
      coins.push({
        x: Math.random() * 360 + 20,
        y: Math.random() * 260 + 20,
        radius: 15
      });
    }

    for (let i = 0; i < 5; i++) spawnCoin();

    document.addEventListener("keydown", e => { keys[e.key] = true; e.preventDefault(); });
    document.addEventListener("keyup", e => { keys[e.key] = false; });

    function update() {
      if (keys["ArrowLeft"]) player.x -= 5;
      if (keys["ArrowRight"]) player.x += 5;
      if (keys["ArrowUp"]) player.y -= 5;
      if (keys["ArrowDown"]) player.y += 5;

      coins = coins.filter(coin => {
        let dx = player.x - coin.x;
        let dy = player.y - coin.y;
        if (Math.sqrt(dx*dx + dy*dy) < player.radius + coin.radius) {
          score++;
          document.getElementById("score").textContent = score;
          playCollectSound();
          spawnCoin();
          return false;
        }
        return true;
      });
    }

    function draw() {
      ctx.clearRect(0, 0, 400, 300);
      ctx.fillStyle = "gold";
      coins.forEach(c => { ctx.beginPath(); ctx.arc(c.x, c.y, c.radius, 0, Math.PI*2); ctx.fill(); });
      ctx.fillStyle = "blue";
      ctx.beginPath(); ctx.arc(player.x, player.y, player.radius, 0, Math.PI*2); ctx.fill();
    }

    function gameLoop() { update(); draw(); requestAnimationFrame(gameLoop); }
    gameLoop();
  </script>
</body>
</html>`,
      exerciseInstructions: "Change the sound frequency from 880 to different values (try 440, 660, 1000) to create different tones!",
      exerciseStarterCode: `<!DOCTYPE html>
<html>
<head>
  <title>Sound Practice</title>
</head>
<body>
  <button id="playBtn">Play Sound</button>

  <script>
    let audioContext;

    document.getElementById("playBtn").addEventListener("click", function() {
      if (!audioContext) audioContext = new AudioContext();

      let osc = audioContext.createOscillator();
      osc.connect(audioContext.destination);
      // Change this frequency!
      osc.frequency.value = 880;
      osc.start();
      osc.stop(audioContext.currentTime + 0.3);
    });
  </script>
</body>
</html>`,
      quiz: [
        { question: "Why do we need user interaction before playing sounds?", options: ["It's a bug", "Browsers require it for autoplay policies", "Sounds don't work otherwise", "It makes code easier"], correctAnswer: "Browsers require it for autoplay policies", explanation: "Browsers block autoplay to prevent annoying websites - users must interact first!" },
        { question: "What unit is sound frequency measured in?", options: ["Pixels", "Hertz (Hz)", "Decibels", "Bytes"], correctAnswer: "Hertz (Hz)", explanation: "Frequency is measured in Hertz - higher Hz means higher pitch!" }
      ]
    },
    {
      title: "Keeping Score",
      content: `
<h2>🏆 Tracking Progress</h2>

<p>Every good game needs a way to track how well the player is doing!</p>

<h3>Score Variables</h3>

<pre><code>let score = 0;
let highScore = 0;
let lives = 3;</code></pre>

<h3>📊 Displaying on Screen</h3>

<pre><code>function drawHUD() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
  ctx.fillText("Lives: " + lives, 10, 60);
}</code></pre>

<h3>💾 Saving High Scores</h3>

<pre><code>// Save to localStorage
localStorage.setItem("highScore", highScore);

// Load from localStorage
let saved = localStorage.getItem("highScore");
if (saved) highScore = parseInt(saved);</code></pre>
`,
      exampleCode: `<!DOCTYPE html>
<html>
<head>
  <title>Score System</title>
  <style>
    canvas { border: 2px solid black; background: #1a1a2e; }
  </style>
</head>
<body>
  <h1>Collect Stars!</h1>
  <canvas id="gameCanvas" width="400" height="300"></canvas>

  <script>
    let canvas = document.getElementById("gameCanvas");
    let ctx = canvas.getContext("2d");

    let player = { x: 200, y: 280, radius: 15 };
    let stars = [];
    let score = 0;
    let highScore = parseInt(localStorage.getItem("starHighScore")) || 0;
    let keys = {};

    function spawnStar() {
      stars.push({
        x: Math.random() * 360 + 20,
        y: -20,
        speed: 2 + Math.random() * 2
      });
    }

    document.addEventListener("keydown", e => { keys[e.key] = true; e.preventDefault(); });
    document.addEventListener("keyup", e => { keys[e.key] = false; });

    function update() {
      if (keys["ArrowLeft"] && player.x > 20) player.x -= 6;
      if (keys["ArrowRight"] && player.x < 380) player.x += 6;

      // Spawn stars
      if (Math.random() < 0.03) spawnStar();

      // Move and check stars
      stars = stars.filter(star => {
        star.y += star.speed;

        let dx = player.x - star.x;
        let dy = player.y - star.y;
        if (Math.sqrt(dx*dx + dy*dy) < 25) {
          score += 10;
          if (score > highScore) {
            highScore = score;
            localStorage.setItem("starHighScore", highScore);
          }
          return false;
        }
        return star.y < 320;
      });
    }

    function draw() {
      ctx.clearRect(0, 0, 400, 300);

      // Draw HUD
      ctx.fillStyle = "white";
      ctx.font = "18px Arial";
      ctx.fillText("Score: " + score, 10, 25);
      ctx.fillText("High Score: " + highScore, 10, 50);

      // Draw stars
      ctx.fillStyle = "gold";
      ctx.font = "24px Arial";
      stars.forEach(s => ctx.fillText("⭐", s.x - 12, s.y));

      // Draw player
      ctx.fillStyle = "lime";
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    function gameLoop() { update(); draw(); requestAnimationFrame(gameLoop); }
    gameLoop();
  </script>
</body>
</html>`,
      exerciseInstructions: "Add a 'lives' system! Start with 3 lives and lose one when a star reaches the bottom.",
      exerciseStarterCode: `<!DOCTYPE html>
<html>
<head>
  <style>
    canvas { border: 2px solid black; background: #1a1a2e; }
  </style>
</head>
<body>
  <canvas id="gameCanvas" width="400" height="300"></canvas>

  <script>
    let canvas = document.getElementById("gameCanvas");
    let ctx = canvas.getContext("2d");

    let player = { x: 200, y: 280, radius: 15 };
    let stars = [];
    let score = 0;
    // Add lives variable here!
    let keys = {};

    function spawnStar() {
      stars.push({ x: Math.random() * 360 + 20, y: -20, speed: 2 });
    }

    document.addEventListener("keydown", e => { keys[e.key] = true; e.preventDefault(); });
    document.addEventListener("keyup", e => { keys[e.key] = false; });

    function update() {
      if (keys["ArrowLeft"]) player.x -= 6;
      if (keys["ArrowRight"]) player.x += 6;
      if (Math.random() < 0.02) spawnStar();

      stars = stars.filter(star => {
        star.y += star.speed;
        let dx = player.x - star.x, dy = player.y - star.y;
        if (Math.sqrt(dx*dx + dy*dy) < 25) { score += 10; return false; }
        // Check if star went past bottom - lose a life!
        if (star.y > 300) {
          // Subtract a life here!
          return false;
        }
        return true;
      });
    }

    function draw() {
      ctx.clearRect(0, 0, 400, 300);
      ctx.fillStyle = "white"; ctx.font = "18px Arial";
      ctx.fillText("Score: " + score, 10, 25);
      // Display lives here!
      ctx.fillStyle = "gold"; ctx.font = "24px Arial";
      stars.forEach(s => ctx.fillText("⭐", s.x - 12, s.y));
      ctx.fillStyle = "lime";
      ctx.beginPath(); ctx.arc(player.x, player.y, 15, 0, Math.PI*2); ctx.fill();
    }

    function gameLoop() { update(); draw(); requestAnimationFrame(gameLoop); }
    gameLoop();
  </script>
</body>
</html>`,
      quiz: [
        { question: "What is localStorage used for in games?", options: ["Drawing graphics", "Saving data between sessions", "Playing sounds", "Detecting collisions"], correctAnswer: "Saving data between sessions", explanation: "localStorage saves data in the browser so it persists even when you close the tab!" },
        { question: "What's a HUD in games?", options: ["A type of enemy", "Heads-Up Display - showing score/health", "A game engine", "A sound effect"], correctAnswer: "Heads-Up Display - showing score/health", explanation: "HUD stands for Heads-Up Display - the overlay showing game info like score and lives!" }
      ]
    },
    {
      title: "Game Over & Restart",
      content: `
<h2>🔁 Handling Win/Lose States</h2>

<p>Games need to know when to end and how to start over!</p>

<h3>Game States</h3>

<pre><code>let gameState = "playing"; // "playing", "gameover", "won"

function update() {
  if (gameState !== "playing") return;
  // ... game logic
}

function draw() {
  if (gameState === "gameover") {
    drawGameOver();
  } else {
    drawGame();
  }
}</code></pre>

<h3>🔄 Restart Function</h3>

<pre><code>function restartGame() {
  score = 0;
  lives = 3;
  player.x = 200;
  enemies = [];
  gameState = "playing";
}</code></pre>
`,
      exampleCode: `<!DOCTYPE html>
<html>
<head>
  <title>Game Over Demo</title>
  <style>
    canvas { border: 2px solid black; background: #1a1a2e; }
  </style>
</head>
<body>
  <h1>Dodge the Meteors!</h1>
  <canvas id="gameCanvas" width="400" height="300"></canvas>

  <script>
    let canvas = document.getElementById("gameCanvas");
    let ctx = canvas.getContext("2d");

    let player, meteors, score, lives, gameState;
    let keys = {};

    function init() {
      player = { x: 200, y: 260, radius: 15 };
      meteors = [];
      score = 0;
      lives = 3;
      gameState = "playing";
    }

    init();

    document.addEventListener("keydown", e => {
      keys[e.key] = true;
      if (e.key === " " && gameState === "gameover") init();
      e.preventDefault();
    });
    document.addEventListener("keyup", e => { keys[e.key] = false; });

    function update() {
      if (gameState !== "playing") return;

      if (keys["ArrowLeft"] && player.x > 20) player.x -= 5;
      if (keys["ArrowRight"] && player.x < 380) player.x += 5;

      if (Math.random() < 0.03) {
        meteors.push({ x: Math.random() * 360 + 20, y: -20, speed: 3 + score/100 });
      }

      score++;

      meteors = meteors.filter(m => {
        m.y += m.speed;
        let dx = player.x - m.x, dy = player.y - m.y;
        if (Math.sqrt(dx*dx + dy*dy) < player.radius + 15) {
          lives--;
          if (lives <= 0) gameState = "gameover";
          return false;
        }
        return m.y < 320;
      });
    }

    function draw() {
      ctx.clearRect(0, 0, 400, 300);

      if (gameState === "gameover") {
        ctx.fillStyle = "white";
        ctx.font = "36px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", 200, 120);
        ctx.font = "24px Arial";
        ctx.fillText("Score: " + score, 200, 160);
        ctx.font = "18px Arial";
        ctx.fillText("Press SPACE to restart", 200, 200);
        ctx.textAlign = "left";
        return;
      }

      // HUD
      ctx.fillStyle = "white";
      ctx.font = "18px Arial";
      ctx.fillText("Score: " + score, 10, 25);
      ctx.fillText("Lives: " + "❤️".repeat(lives), 10, 50);

      // Meteors
      ctx.font = "28px Arial";
      meteors.forEach(m => ctx.fillText("☄️", m.x - 14, m.y));

      // Player
      ctx.fillStyle = "lime";
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    function gameLoop() { update(); draw(); requestAnimationFrame(gameLoop); }
    gameLoop();
  </script>
</body>
</html>`,
      exerciseInstructions: "Add a 'You Win!' screen when the player reaches a score of 500!",
      exerciseStarterCode: `<!DOCTYPE html>
<html>
<head>
  <style>
    canvas { border: 2px solid black; background: #1a1a2e; }
  </style>
</head>
<body>
  <canvas id="gameCanvas" width="400" height="300"></canvas>

  <script>
    let canvas = document.getElementById("gameCanvas");
    let ctx = canvas.getContext("2d");

    let player, score, gameState;
    let keys = {};

    function init() {
      player = { x: 200, y: 260, radius: 15 };
      score = 0;
      gameState = "playing";
    }
    init();

    document.addEventListener("keydown", e => { keys[e.key] = true; e.preventDefault(); });
    document.addEventListener("keyup", e => { keys[e.key] = false; });

    function update() {
      if (gameState !== "playing") return;
      if (keys["ArrowLeft"]) player.x -= 5;
      if (keys["ArrowRight"]) player.x += 5;
      score++;

      // Add win condition here - when score >= 500

    }

    function draw() {
      ctx.clearRect(0, 0, 400, 300);

      // Add win screen here

      ctx.fillStyle = "white"; ctx.font = "18px Arial";
      ctx.fillText("Score: " + score, 10, 25);
      ctx.fillStyle = "lime";
      ctx.beginPath(); ctx.arc(player.x, player.y, 15, 0, Math.PI*2); ctx.fill();
    }

    function gameLoop() { update(); draw(); requestAnimationFrame(gameLoop); }
    gameLoop();
  </script>
</body>
</html>`,
      quiz: [
        { question: "What's a game state?", options: ["A US state with gaming laws", "A variable tracking if game is playing/over/won", "The graphics settings", "The player's location"], correctAnswer: "A variable tracking if game is playing/over/won", explanation: "Game state tracks what 'mode' the game is in - playing, paused, game over, etc." },
        { question: "Why do we need an init() function?", options: ["It's required by JavaScript", "To reset the game to starting values", "To draw graphics", "To play sounds"], correctAnswer: "To reset the game to starting values", explanation: "init() resets all game variables so we can start fresh!" }
      ]
    },
    {
      title: "Project: Catch the Falling Stars",
      content: `
<h2>🌟 Final Project: Complete Game!</h2>

<p>Time to put everything together and build a polished game!</p>

<h3>Game Features</h3>

<ul>
<li>✅ Player moves with arrow keys</li>
<li>✅ Stars fall from the sky</li>
<li>✅ Catch stars for points</li>
<li>✅ 3 lives - lose one if star hits ground</li>
<li>✅ Score and high score</li>
<li>✅ Sound effects</li>
<li>✅ Game over and restart</li>
<li>✅ Difficulty increases over time</li>
</ul>

<h3>🎮 Your Challenge</h3>

<p>Build the complete game, then add YOUR own features:</p>
<ul>
<li>Different colored stars worth more points</li>
<li>Power-ups (extra life, slow motion, magnet)</li>
<li>Background music</li>
<li>Particle effects</li>
</ul>
`,
      exampleCode: `<!DOCTYPE html>
<html>
<head>
  <title>Catch the Falling Stars!</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #0a0a1a; font-family: Arial; }
    .game-container { text-align: center; }
    h1 { color: gold; margin-bottom: 10px; }
    canvas { border: 3px solid gold; border-radius: 10px; }
    button { margin-top: 10px; padding: 10px 30px; font-size: 18px; background: gold; border: none; border-radius: 5px; cursor: pointer; }
  </style>
</head>
<body>
  <div class="game-container">
    <h1>⭐ Catch the Falling Stars! ⭐</h1>
    <canvas id="gameCanvas" width="500" height="400"></canvas>
    <br>
    <button id="startBtn">Start Game</button>
  </div>

  <script>
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    let audioCtx;

    let player, stars, particles, score, highScore, lives, gameState, difficulty;
    let keys = {};

    highScore = parseInt(localStorage.getItem("starCatcherHigh")) || 0;

    function init() {
      player = { x: 250, y: 360, width: 60, height: 20 };
      stars = [];
      particles = [];
      score = 0;
      lives = 3;
      difficulty = 1;
      gameState = "playing";
    }

    function playSound(freq, duration) {
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    }

    function spawnStar() {
      const colors = ["gold", "silver", "cyan"];
      const points = [10, 20, 50];
      const type = Math.random() < 0.7 ? 0 : (Math.random() < 0.7 ? 1 : 2);
      stars.push({
        x: Math.random() * 460 + 20,
        y: -20,
        speed: 2 + Math.random() * difficulty,
        color: colors[type],
        points: points[type]
      });
    }

    function createParticles(x, y, color) {
      for (let i = 0; i < 8; i++) {
        particles.push({
          x, y,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          life: 30,
          color
        });
      }
    }

    document.addEventListener("keydown", e => { keys[e.key] = true; e.preventDefault(); });
    document.addEventListener("keyup", e => { keys[e.key] = false; });

    document.getElementById("startBtn").addEventListener("click", function() {
      if (!audioCtx) audioCtx = new AudioContext();
      init();
      this.textContent = "Restart";
    });

    function update() {
      if (gameState !== "playing") return;

      // Player movement
      if (keys["ArrowLeft"] && player.x > 5) player.x -= 7;
      if (keys["ArrowRight"] && player.x < 435) player.x += 7;

      // Spawn stars
      if (Math.random() < 0.02 + difficulty * 0.005) spawnStar();

      // Increase difficulty
      difficulty += 0.001;

      // Update stars
      stars = stars.filter(star => {
        star.y += star.speed;

        // Check catch
        if (star.y > player.y - 10 && star.y < player.y + 10 &&
            star.x > player.x && star.x < player.x + player.width) {
          score += star.points;
          createParticles(star.x, star.y, star.color);
          playSound(880, 0.1);
          if (score > highScore) {
            highScore = score;
            localStorage.setItem("starCatcherHigh", highScore);
          }
          return false;
        }

        // Check miss
        if (star.y > 420) {
          lives--;
          playSound(220, 0.3);
          if (lives <= 0) gameState = "gameover";
          return false;
        }
        return true;
      });

      // Update particles
      particles = particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        return p.life > 0;
      });
    }

    function draw() {
      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, 0, 400);
      grad.addColorStop(0, "#0a0a2e");
      grad.addColorStop(1, "#1a1a4e");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 500, 400);

      // Stars background
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      for (let i = 0; i < 50; i++) {
        ctx.fillRect((i * 47) % 500, (i * 31) % 400, 1, 1);
      }

      if (gameState === "gameover") {
        ctx.fillStyle = "white";
        ctx.font = "bold 48px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", 250, 150);
        ctx.font = "24px Arial";
        ctx.fillText("Final Score: " + score, 250, 200);
        ctx.fillText("High Score: " + highScore, 250, 240);
        ctx.textAlign = "left";
        return;
      }

      // HUD
      ctx.fillStyle = "white";
      ctx.font = "20px Arial";
      ctx.fillText("Score: " + score, 10, 30);
      ctx.fillText("High: " + highScore, 10, 55);
      ctx.fillText("Lives: " + "❤️".repeat(lives), 380, 30);

      // Draw particles
      particles.forEach(p => {
        ctx.globalAlpha = p.life / 30;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - 3, p.y - 3, 6, 6);
      });
      ctx.globalAlpha = 1;

      // Draw falling stars
      ctx.font = "24px Arial";
      stars.forEach(s => {
        ctx.fillStyle = s.color;
        ctx.fillText("⭐", s.x - 12, s.y);
      });

      // Draw player (basket)
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(player.x, player.y, player.width, player.height);
      ctx.fillStyle = "#A0522D";
      ctx.fillRect(player.x + 5, player.y + 3, player.width - 10, player.height - 6);
    }

    function gameLoop() { update(); draw(); requestAnimationFrame(gameLoop); }
    gameLoop();
  </script>
</body>
</html>`,
      exerciseInstructions: "Make the game your own! Add at least one new feature: power-ups, different star types, background changes, or anything you imagine!",
      exerciseStarterCode: `<!-- Start with the example code above and customize it!
     Ideas:
     - Add a "golden star" that gives extra life
     - Make the basket change color when you catch silver stars
     - Add levels with different backgrounds
     - Create a combo system for catching multiple stars quickly
-->`,
      quiz: [
        { question: "What makes a game feel polished?", options: ["Just good graphics", "Sound, particles, smooth animations, and feedback", "Only having a high score", "Using lots of colors"], correctAnswer: "Sound, particles, smooth animations, and feedback", explanation: "Polish comes from many small details - sounds, visual effects, responsive controls, and clear feedback!" },
        { question: "What did you learn in this course?", options: ["Only drawing shapes", "Only keyboard controls", "Game loops, graphics, input, collision, sound, scoring, and game states", "Just making things move"], correctAnswer: "Game loops, graphics, input, collision, sound, scoring, and game states", explanation: "You learned all the fundamentals of game development! Now keep building and learning!" }
      ]
    }
  ],

  "2d-game-development-javascript": [
    {
      title: "Setting Up Your Game Engine",
      content: `
<h2>⚙️ Professional Game Development Setup</h2>

<p>Let's set up a proper game development environment that scales!</p>

<h3>Project Structure</h3>

<pre><code>my-game/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── game.js
│   ├── player.js
│   ├── enemy.js
│   └── utils.js
├── assets/
│   ├── images/
│   └── sounds/
└── README.md</code></pre>

<h3>🎮 Game Class Architecture</h3>

<pre><code>class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.entities = [];
    this.lastTime = 0;
  }

  update(deltaTime) {
    this.entities.forEach(e => e.update(deltaTime));
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.entities.forEach(e => e.render(this.ctx));
  }

  gameLoop(timestamp) {
    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;
    this.update(deltaTime);
    this.render();
    requestAnimationFrame(t => this.gameLoop(t));
  }
}</code></pre>
`,
      exampleCode: `<!DOCTYPE html>
<html>
<head>
  <title>Game Engine Setup</title>
  <style>
    canvas { border: 2px solid #333; background: #1a1a2e; display: block; margin: 20px auto; }
  </style>
</head>
<body>
  <canvas id="gameCanvas" width="800" height="600"></canvas>

  <script>
    // Base Entity class
    class Entity {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
      }

      update(dt) {}
      render(ctx) {}
    }

    // Player class
    class Player extends Entity {
      constructor(x, y) {
        super(x, y);
        this.speed = 0.3;
        this.velX = 0;
        this.velY = 0;
      }

      update(dt) {
        if (keys["ArrowLeft"]) this.velX = -this.speed;
        else if (keys["ArrowRight"]) this.velX = this.speed;
        else this.velX *= 0.9;

        if (keys["ArrowUp"]) this.velY = -this.speed;
        else if (keys["ArrowDown"]) this.velY = this.speed;
        else this.velY *= 0.9;

        this.x += this.velX * dt;
        this.y += this.velY * dt;

        // Bounds
        this.x = Math.max(0, Math.min(800 - this.width, this.x));
        this.y = Math.max(0, Math.min(600 - this.height, this.y));
      }

      render(ctx) {
        ctx.fillStyle = "#4CAF50";
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    }

    // Game class
    class Game {
      constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.entities = [];
        this.lastTime = 0;
        this.running = true;
      }

      addEntity(entity) {
        this.entities.push(entity);
      }

      update(dt) {
        this.entities.forEach(e => e.update(dt));
      }

      render() {
        this.ctx.fillStyle = "#1a1a2e";
        this.ctx.fillRect(0, 0, 800, 600);
        this.entities.forEach(e => e.render(this.ctx));

        // Debug info
        this.ctx.fillStyle = "white";
        this.ctx.font = "14px monospace";
        this.ctx.fillText("Entities: " + this.entities.length, 10, 20);
        this.ctx.fillText("Use arrow keys to move", 10, 40);
      }

      gameLoop(timestamp) {
        const dt = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(dt);
        this.render();

        if (this.running) {
          requestAnimationFrame(t => this.gameLoop(t));
        }
      }

      start() {
        requestAnimationFrame(t => this.gameLoop(t));
      }
    }

    // Input handling
    const keys = {};
    document.addEventListener("keydown", e => { keys[e.key] = true; e.preventDefault(); });
    document.addEventListener("keyup", e => { keys[e.key] = false; });

    // Initialize game
    const canvas = document.getElementById("gameCanvas");
    const game = new Game(canvas);
    game.addEntity(new Player(400, 300));
    game.start();
  </script>
</body>
</html>`,
      exerciseInstructions: "Add a new Enemy class that moves around randomly. Create multiple enemies and add them to the game.",
      exerciseStarterCode: `// Add this Enemy class to the game above

class Enemy extends Entity {
  constructor(x, y) {
    super(x, y);
    this.speed = 0.1;
    // Add random direction
    this.dirX = Math.random() > 0.5 ? 1 : -1;
    this.dirY = Math.random() > 0.5 ? 1 : -1;
  }

  update(dt) {
    // Move in current direction

    // Bounce off walls

  }

  render(ctx) {
    ctx.fillStyle = "#f44336";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

// Add enemies to game
for (let i = 0; i < 5; i++) {
  game.addEntity(new Enemy(Math.random() * 700, Math.random() * 500));
}`,
      quiz: [
        { question: "Why use deltaTime in game updates?", options: ["To make code shorter", "To ensure consistent speed regardless of frame rate", "It's just for decoration", "To slow down the game"], correctAnswer: "To ensure consistent speed regardless of frame rate", explanation: "DeltaTime makes movement frame-rate independent - the game runs the same on fast and slow computers!" },
        { question: "What is the Entity pattern?", options: ["A design bug", "A base class for all game objects", "A type of enemy", "A sound effect"], correctAnswer: "A base class for all game objects", explanation: "Entity is a base class that all game objects (players, enemies, items) inherit from!" }
      ]
    }
  ]
};

// Quiz questions bank
const quizQuestions: Record<string, any[]> = {
  GAME_DEVELOPMENT: [
    { question: "What is a game loop?", options: ["A circular game", "Code that runs repeatedly to update and render the game", "A type of level design", "Background music"], answer: "1", explanation: "The game loop continuously updates game logic and renders graphics!" },
    { question: "What does FPS stand for?", options: ["First Person Shooter", "Frames Per Second", "Fast Player Speed", "Full Picture Size"], answer: "1", explanation: "FPS means Frames Per Second - how many times the game updates per second!" },
    { question: "What is collision detection?", options: ["Finding bugs in code", "Checking when game objects touch", "A type of graphics", "Sound effects"], answer: "1", explanation: "Collision detection determines when game objects overlap or touch!" },
    { question: "What is sprite animation?", options: ["Making sprites dance", "Showing different images rapidly to create motion", "Sprite colors", "Sprite sounds"], answer: "1", explanation: "Sprite animation displays a sequence of images to create the illusion of movement!" },
    { question: "What is a hitbox?", options: ["A punching game", "The area used for collision detection", "A treasure chest", "A power-up box"], answer: "1", explanation: "A hitbox is the invisible shape used to detect collisions with an object!" }
  ]
};

async function seedGamingCourses() {
  console.log("🎮 Seeding Gaming Development Courses...\n");

  for (const courseData of gamingCourses) {
    console.log(`📚 Creating: ${courseData.title}`);

    // Check if course exists
    const existing = await prisma.course.findFirst({
      where: { slug: courseData.slug }
    });

    if (existing) {
      console.log(`   ⚠️ Course already exists, updating...`);
      await prisma.lesson.deleteMany({ where: { courseId: existing.id } });
      await prisma.course.delete({ where: { id: existing.id } });
    }

    // Get lesson content for this course
    const lessonContent = lessonContentByLevel[courseData.slug] || [];

    // Create course with lessons
    const course = await prisma.course.create({
      data: {
        title: courseData.title,
        slug: courseData.slug,
        description: courseData.description,
        language: courseData.language as any,
        level: courseData.level as any,
        ageGroup: courseData.ageGroup as any,
        totalXp: courseData.totalXp,
        estimatedHours: courseData.estimatedHours,
        isPublished: true,
        orderIndex: gamingCourses.indexOf(courseData),
        lessons: {
          create: courseData.lessons.map((lesson, idx) => {
            const content = lessonContent[idx] || {};
            return {
              title: lesson.title,
              slug: lesson.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
              description: lesson.description,
              content: content.content || `<h2>${lesson.title}</h2><p>${lesson.description}</p>`,
              exampleCode: content.exampleCode || "",
              exerciseInstructions: content.exerciseInstructions || "",
              exerciseStarterCode: content.exerciseStarterCode || "",
              xpReward: lesson.xp,
              orderIndex: idx,
              isPublished: true
            };
          })
        }
      },
      include: { lessons: true }
    });

    console.log(`   ✅ Created with ${course.lessons.length} lessons`);

    // Add quizzes to lessons with detailed content
    for (let i = 0; i < course.lessons.length; i++) {
      const lesson = course.lessons[i];
      const content = lessonContent[i];

      if (content?.quiz) {
        await prisma.quiz.create({
          data: {
            lessonId: lesson.id,
            questions: {
              create: content.quiz.map((q: any, qIdx: number) => ({
                question: q.question,
                questionType: "MULTIPLE_CHOICE" as QuestionType,
                options: q.options,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation,
                xpReward: 10,
                orderIndex: qIdx
              }))
            }
          }
        });
      } else {
        // Add default quiz from question bank
        const defaultQuestions = quizQuestions.GAME_DEVELOPMENT.slice(i % 5, (i % 5) + 2);
        if (defaultQuestions.length > 0) {
          await prisma.quiz.create({
            data: {
              lessonId: lesson.id,
              questions: {
                create: defaultQuestions.map((q, qIdx) => ({
                  question: q.question,
                  questionType: "MULTIPLE_CHOICE" as QuestionType,
                  options: q.options,
                  correctAnswer: q.options[parseInt(q.answer)],
                  explanation: q.explanation,
                  xpReward: 10,
                  orderIndex: qIdx
                }))
              }
            }
          });
        }
      }
    }

    console.log(`   📝 Added quizzes to lessons\n`);
  }

  console.log("🎉 Gaming Development courses seeded successfully!");
  console.log(`   Total courses: ${gamingCourses.length}`);
  console.log(`   Levels: Beginner → Intermediate → Advanced → Expert → Master`);
}

seedGamingCourses()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

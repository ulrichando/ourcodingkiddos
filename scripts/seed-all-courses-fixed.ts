import { PrismaClient } from "../generated/prisma-client";

const prisma = new PrismaClient();

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// Content generators - Theory content that covers quiz topics
const contentGenerators: Record<string, (title: string, desc: string) => any> = {
  HTML: (title, desc) => ({
    content: `<h2>🌐 ${title}</h2>
<p><strong>Welcome, young web builder!</strong> ${desc}</p>

<h3>📚 What is HTML?</h3>
<p><strong>HTML</strong> stands for <strong>HyperText Markup Language</strong>. It's the standard language for creating web pages. Every website you visit uses HTML!</p>

<h3>🏗️ How HTML Works</h3>
<p>HTML uses <strong>tags</strong> to tell the browser how to display content. Tags are written with angle brackets like <code>&lt;tagname&gt;</code>.</p>

<h3>📝 Essential HTML Tags</h3>
<ul>
<li><strong>&lt;p&gt;</strong> - Creates a <strong>paragraph</strong> of text</li>
<li><strong>&lt;h1&gt; to &lt;h6&gt;</strong> - Creates headings (h1 is biggest, h6 is smallest)</li>
<li><strong>&lt;a&gt;</strong> - Creates a link to another page</li>
<li><strong>&lt;img&gt;</strong> - Adds an image to your page</li>
<li><strong>&lt;div&gt;</strong> - Creates a container to group elements</li>
</ul>

<h3>🎯 Remember!</h3>
<p>Most HTML tags come in pairs: an opening tag <code>&lt;p&gt;</code> and a closing tag <code>&lt;/p&gt;</code> with your content in between.</p>`,
    exampleCode: `<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
</head>
<body>
  <h1>Hello World!</h1>
  <p>This is a paragraph of text.</p>
  <p>This is another paragraph!</p>
</body>
</html>`,
    exerciseInstructions: `Create a webpage with a heading using <h1> and two paragraphs using <p> tags!`,
    exerciseStarterCode: `<!DOCTYPE html>
<html>
<body>
  <!-- Add your heading and paragraphs here -->

</body>
</html>`,
  }),
  CSS: (title, desc) => ({
    content: `<h2>🎨 ${title}</h2>
<p><strong>Make it beautiful!</strong> ${desc}</p>

<h3>📚 What is CSS?</h3>
<p><strong>CSS</strong> stands for <strong>Cascading Style Sheets</strong>. It controls how HTML elements look - colors, fonts, spacing, and layout!</p>

<h3>🎨 How CSS Works</h3>
<p>CSS uses <strong>selectors</strong> to target HTML elements, then applies <strong>properties</strong> and <strong>values</strong>.</p>

<h3>🖌️ Important CSS Properties</h3>
<ul>
<li><strong>color</strong> - Changes the <strong>text color</strong> (not "text-color" or "font-color"!)</li>
<li><strong>background-color</strong> - Sets the background color</li>
<li><strong>font-size</strong> - Changes how big the text is</li>
<li><strong>font-family</strong> - Changes the font style</li>
<li><strong>margin</strong> - Space outside an element</li>
<li><strong>padding</strong> - Space inside an element</li>
</ul>

<h3>🎯 CSS Syntax</h3>
<pre>selector {
  property: value;
}</pre>`,
    exampleCode: `body {
  background-color: #f0f0f0;
}

h1 {
  color: blue;
  font-size: 24px;
}

p {
  color: green;
}`,
    exerciseInstructions: `Use the 'color' property to change the text color of a heading!`,
    exerciseStarterCode: `/* Add your styles */
h1 {

}`,
  }),
  JAVASCRIPT: (title, desc) => ({
    content: `<h2>⚡ ${title}</h2>
<p><strong>Bring it to life!</strong> ${desc}</p>

<h3>📚 What is JavaScript?</h3>
<p>JavaScript makes websites <strong>interactive</strong>! It can respond to clicks, change content, and so much more.</p>

<h3>📦 Creating Variables</h3>
<p>Variables store data. In JavaScript, you create a variable using <strong>let</strong>:</p>
<pre>let x = 5;
let name = "Alex";</pre>
<p><strong>Note:</strong> We use <code>let x = 5</code>, not "variable x = 5" or "v x = 5"!</p>

<h3>🖥️ Displaying Output</h3>
<p>The <strong>console.log()</strong> function <strong>prints messages to the console</strong>. It's great for testing and debugging!</p>
<pre>console.log("Hello World!");
console.log(5 + 3); // prints 8</pre>

<h3>🔧 Functions</h3>
<p>Functions are reusable blocks of code:</p>
<pre>function sayHello() {
  alert("Hello!");
}</pre>`,
    exampleCode: `// Creating variables with 'let'
let name = "Alex";
let age = 12;

// Using console.log() to print to console
console.log("Hello, " + name);
console.log("Age: " + age);

// A simple function
function greet() {
  console.log("Welcome!");
}

greet(); // Call the function`,
    exerciseInstructions: `Create a variable using 'let' and use console.log() to print it!`,
    exerciseStarterCode: `// Create a variable and print it
`,
  }),
  PYTHON: (title, desc) => ({
    content: `<h2>🐍 ${title}</h2>
<p><strong>Python Power!</strong> ${desc}</p>

<h3>📚 What is Python?</h3>
<p>Python is one of the most popular programming languages! It's known for being easy to read and learn.</p>

<h3>🖨️ Printing in Python</h3>
<p>To display text in Python, use the <strong>print()</strong> function:</p>
<pre>print("Hello, World!")</pre>
<p><strong>Note:</strong> In Python we use <code>print()</code>, not console.log() or echo!</p>

<h3>💬 Comments in Python</h3>
<p>Comments are notes in your code that Python ignores. In Python, comments start with <strong>#</strong>:</p>
<pre># This is a comment
print("Hello")  # This is also a comment</pre>
<p><strong>Remember:</strong> Python uses <code>#</code> for comments, not // or /* */!</p>

<h3>📦 Variables</h3>
<p>Store data in variables:</p>
<pre>name = "Alex"
age = 12
print(name)</pre>`,
    exampleCode: `# This is a Python comment
print("Hello, World!")

# Variables
name = "Alex"
age = 12

# Print variables
print("Name:", name)
print("Age:", age)

# Loop example
for i in range(5):
    print(i)`,
    exerciseInstructions: `Use print() to display a message and add a comment using #!`,
    exerciseStarterCode: `# Write your Python code here
`,
  }),
  ROBLOX: (title, desc) => ({
    content: `<h2>🎮 ${title}</h2>
<p><strong>Build amazing games!</strong> ${desc}</p>

<h3>📚 What is Roblox Development?</h3>
<p>Roblox lets you create and share games with millions of players!</p>

<h3>🛠️ Roblox Studio</h3>
<p>Games are created using <strong>Roblox Studio</strong> - the official tool for building Roblox games. It's free to download and use!</p>

<h3>💻 The Lua Programming Language</h3>
<p>Roblox uses a programming language called <strong>Lua</strong> to make games interactive. Lua is easy to learn and very powerful!</p>
<pre>-- This is a Lua comment
local part = script.Parent
part.BrickColor = BrickColor.new("Bright red")</pre>

<h3>🎯 Key Points</h3>
<ul>
<li><strong>Roblox Studio</strong> is the tool for creating games</li>
<li><strong>Lua</strong> is the programming language (not Python, JavaScript, or C++)</li>
<li>Scripts control how parts behave in your game</li>
</ul>`,
    exampleCode: `-- Roblox Lua Script
local part = script.Parent

-- Change the part's color
part.BrickColor = BrickColor.new("Bright red")

-- Make part do something when touched
part.Touched:Connect(function(hit)
    print("Someone touched the part!")
end)`,
    exerciseInstructions: `Write a Lua script to change a part's color!`,
    exerciseStarterCode: `-- Your Lua script
local part = script.Parent

`,
  }),
  ENGINEERING: (title, desc) => ({
    content: `<h2>🔧 ${title}</h2>
<p><strong>Think like an engineer!</strong> ${desc}</p>

<h3>📚 What is Engineering?</h3>
<p>Engineering is all about <strong>solving problems</strong> and creating solutions that help people!</p>

<h3>🔄 The Engineering Design Process</h3>
<p>Engineers follow a step-by-step process. The <strong>first step</strong> is always to <strong>identify the problem</strong>!</p>
<ol>
<li><strong>Identify the Problem</strong> - What needs to be solved?</li>
<li><strong>Research</strong> - Learn about the problem</li>
<li><strong>Brainstorm Solutions</strong> - Think of many ideas</li>
<li><strong>Build a Prototype</strong> - Create a test model</li>
<li><strong>Test and Improve</strong> - See what works and fix what doesn't</li>
</ol>

<h3>🏗️ What is a Prototype?</h3>
<p>A <strong>prototype</strong> is a <strong>test model</strong> - a quick version of your idea to see if it works. It's not the final product! Prototypes help engineers find problems early and make improvements.</p>

<h3>🎯 Remember!</h3>
<ul>
<li>First step = Identify the problem</li>
<li>Prototype = Test model (not the final product)</li>
</ul>`,
  }),
  AI_ML: (title, desc) => ({
    content: `<h2>🤖 ${title}</h2>
<p><strong>Welcome to the world of AI!</strong> ${desc}</p>

<h3>📚 What is AI?</h3>
<p><strong>AI</strong> stands for <strong>Artificial Intelligence</strong>. It's when computers can do tasks that normally need human thinking - like recognizing faces or understanding speech!</p>

<h3>🧠 How Do Machines Learn?</h3>
<p>Machines learn by looking at <strong>many examples</strong>! If you show a computer thousands of cat pictures labeled "cat", it learns to recognize cats. This is called <strong>training</strong>.</p>

<p>For example:</p>
<ul>
<li>Show the AI 10,000 pictures of cats → It learns what cats look like</li>
<li>Show it 10,000 pictures of dogs → It learns what dogs look like</li>
<li>Now it can tell the difference!</li>
</ul>

<h3>🔍 Pattern Recognition</h3>
<p>AI is really good at finding <strong>patterns</strong> in data - things that are similar or different.</p>

<h3>🎯 Key Points</h3>
<ul>
<li>AI = <strong>Artificial Intelligence</strong></li>
<li>Machines learn from <strong>many examples</strong> (not books or videos)</li>
<li>Training teaches AI to recognize patterns</li>
</ul>`,
  }),
  ROBOTICS: (title, desc) => ({
    content: `<h2>🤖 ${title}</h2>
<p><strong>Welcome to Robotics!</strong> ${desc}</p>

<h3>📚 What are Robots?</h3>
<p>Robots are machines that can sense their environment and take actions. They combine hardware (physical parts) with software (code)!</p>

<h3>👀 What are Sensors For?</h3>
<p><strong>Sensors</strong> help robots <strong>detect their environment</strong>. They're like the robot's eyes, ears, and touch!</p>
<ul>
<li>Light sensors detect brightness</li>
<li>Distance sensors detect how far objects are</li>
<li>Touch sensors detect when something is pressed</li>
</ul>

<h3>⚙️ What Makes Robots Move?</h3>
<p><strong>Motors</strong> are what make robots move! Motors convert electricity into motion. They can spin wheels, move arms, or open grippers.</p>

<h3>🧠 The Robot Brain</h3>
<p>A processor (computer chip) is the "brain" that runs the code and tells the robot what to do based on sensor input.</p>

<h3>🎯 Remember!</h3>
<ul>
<li>Sensors = Detect environment</li>
<li>Motors = Create movement</li>
</ul>`,
  }),
  GAME_DEVELOPMENT: (title, desc) => ({
    content: `<h2>🎮 ${title}</h2>
<p><strong>Create amazing games!</strong> ${desc}</p>

<h3>📚 What is Game Development?</h3>
<p>Game development combines programming, art, sound, and design to create interactive experiences!</p>

<h3>🔄 What is a Game Loop?</h3>
<p>A <strong>game loop</strong> is the <strong>update and draw cycle</strong> that runs continuously while the game is playing. Every frame:</p>
<ol>
<li><strong>Update</strong> - Move characters, check collisions, handle input</li>
<li><strong>Draw</strong> - Render everything to the screen</li>
</ol>
<p>This happens 30-60 times per second!</p>

<h3>🖼️ What are Sprites?</h3>
<p><strong>Sprites</strong> are <strong>game images</strong> - the 2D pictures that represent characters, enemies, items, and backgrounds in your game.</p>

<h3>🎮 Game Elements</h3>
<ul>
<li>Graphics (sprites) - What you see</li>
<li>Sound - What you hear</li>
<li>Input - Controls (keyboard, mouse, controller)</li>
<li>Logic - The rules of the game</li>
</ul>

<h3>🎯 Remember!</h3>
<ul>
<li>Game loop = Update/draw cycle</li>
<li>Sprites = Game images</li>
</ul>`,
    exampleCode: `// Simple Game Loop
let player = { x: 100, y: 100 };

function update() {
  // Update game state
  // Move player, check collisions
}

function draw() {
  // Draw sprites to screen
  // Show player at x, y position
}

// This runs 60 times per second
setInterval(() => {
  update();
  draw();
}, 16);`,
    exerciseInstructions: `Create a simple game loop with update and draw functions!`,
    exerciseStarterCode: `// Your game code
let player = { x: 0, y: 0 };

function update() {
  // Update game here
}

function draw() {
  // Draw game here
}`,
  }),
  MOBILE_DEVELOPMENT: (title, desc) => ({
    content: `<h2>📱 ${title}</h2>
<p><strong>Build amazing apps!</strong> ${desc}</p>

<h3>📚 What is Mobile Development?</h3>
<p>Mobile development is creating applications that run on smartphones and tablets!</p>

<h3>🎨 What is UI?</h3>
<p><strong>UI</strong> stands for <strong>User Interface</strong>. It's everything the user sees and interacts with - buttons, text, images, and layouts. Good UI makes apps easy and enjoyable to use!</p>

<h3>🧭 What is Navigation?</h3>
<p><strong>Navigation</strong> is <strong>moving between screens</strong> in your app. For example:</p>
<ul>
<li>Tapping a button to go to settings</li>
<li>Swiping to see the next photo</li>
<li>Using a menu to switch pages</li>
</ul>

<h3>📱 Mobile App Components</h3>
<ul>
<li>Screens/Views - Different pages of your app</li>
<li>Buttons - For user actions</li>
<li>Text inputs - For typing</li>
<li>Images - Visual content</li>
</ul>

<h3>🎯 Remember!</h3>
<ul>
<li>UI = User Interface (what users see and touch)</li>
<li>Navigation = Moving between screens</li>
</ul>`,
    exampleCode: `// React Native App Component
import React from 'react';
import { View, Text, Button } from 'react-native';

function MyApp() {
  return (
    <View>
      <Text>Hello, Mobile World!</Text>
      <Button
        title="Press Me"
        onPress={() => console.log('Button pressed!')}
      />
    </View>
  );
}`,
    exerciseInstructions: `Design an app screen with a title and button!`,
    exerciseStarterCode: `// Create your app UI
`,
  }),
  CAREER_PREP: (title, desc) => ({
    content: `<h2>💼 ${title}</h2>
<p><strong>Launch your tech career!</strong> ${desc}</p>

<h3>📚 Preparing for Your Future</h3>
<p>The tech industry has amazing opportunities! Let's learn how to prepare.</p>

<h3>🎨 What is a Portfolio?</h3>
<p>A <strong>portfolio</strong> is a <strong>work showcase</strong> - a collection of your best projects that shows what you can do! It's like a gallery of your accomplishments.</p>
<p>Your portfolio might include:</p>
<ul>
<li>Websites you've built</li>
<li>Apps you've created</li>
<li>Games you've made</li>
<li>Code projects you're proud of</li>
</ul>

<h3>🤝 Why Network?</h3>
<p><strong>Networking</strong> means to <strong>connect professionally</strong> with others in your field. It helps you:</p>
<ul>
<li>Learn from experienced people</li>
<li>Discover job opportunities</li>
<li>Get advice and mentorship</li>
<li>Build relationships in the industry</li>
</ul>

<h3>📄 Your Resume</h3>
<p>A resume is a document that highlights your skills, education, and experience.</p>

<h3>🎯 Remember!</h3>
<ul>
<li>Portfolio = Work showcase</li>
<li>Networking = Connecting professionally</li>
</ul>`,
  }),
  WEB_DEVELOPMENT: (title, desc) => ({
    content: `<h2>🌐 ${title}</h2>
<p><strong>Build the web!</strong> ${desc}</p>

<h3>📚 What is Web Development?</h3>
<p>Web development is creating websites and web applications using HTML, CSS, and JavaScript!</p>

<h3>🏗️ The Three Languages of the Web</h3>
<ul>
<li><strong>HTML</strong> - Structure (the skeleton)</li>
<li><strong>CSS</strong> - Styling (the clothes)</li>
<li><strong>JavaScript</strong> - Interactivity (the brain)</li>
</ul>

<h3>🖥️ Frontend vs Backend</h3>
<p><strong>Frontend</strong> is what users see and interact with. <strong>Backend</strong> handles data, servers, and behind-the-scenes logic.</p>

<h3>🛠️ Developer Tools</h3>
<ul>
<li>Code Editor (VS Code)</li>
<li>Browser DevTools (F12)</li>
<li>Version Control (Git)</li>
</ul>`,
    exampleCode: `<!DOCTYPE html>
<html>
<head>
  <title>My Web App</title>
  <style>
    body { font-family: Arial; }
    button { padding: 10px 20px; }
  </style>
</head>
<body>
  <h1>Welcome!</h1>
  <button onclick="sayHello()">Click Me</button>

  <script>
    function sayHello() {
      alert("Hello, Developer!");
    }
  </script>
</body>
</html>`,
    exerciseInstructions: `Create a webpage with HTML, CSS, and JavaScript!`,
    exerciseStarterCode: `<!DOCTYPE html>
<html>
<body>
  <!-- Build your web page here -->
</body>
</html>`,
  }),
};

// Quiz questions by language (20 questions each)
const quizQuestions: Record<string, { question: string; options: string[]; answer: string }[]> = {
  HTML: [
    { question: "What does HTML stand for?", options: ["HyperText Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "HyperText Machine Language"], answer: "0" },
    { question: "Which tag creates a paragraph?", options: ["<paragraph>", "<p>", "<text>", "<para>"], answer: "1" },
    { question: "Which tag creates the largest heading?", options: ["<h6>", "<heading>", "<h1>", "<head>"], answer: "2" },
    { question: "What tag is used to create a link?", options: ["<link>", "<a>", "<href>", "<url>"], answer: "1" },
    { question: "Which tag adds an image?", options: ["<picture>", "<image>", "<img>", "<photo>"], answer: "2" },
    { question: "What does the <br> tag do?", options: ["Makes text bold", "Creates a line break", "Creates a border", "Makes text bigger"], answer: "1" },
    { question: "Which tag makes text bold?", options: ["<bold>", "<b>", "<thick>", "<strong>"], answer: "1" },
    { question: "What tag creates a numbered list?", options: ["<ul>", "<nl>", "<ol>", "<list>"], answer: "2" },
    { question: "Which tag creates a bullet list?", options: ["<ul>", "<bl>", "<ol>", "<bullets>"], answer: "0" },
    { question: "What tag defines list items?", options: ["<item>", "<li>", "<list>", "<it>"], answer: "1" },
    { question: "Which tag creates a table?", options: ["<tab>", "<tbl>", "<table>", "<grid>"], answer: "2" },
    { question: "What tag creates a table row?", options: ["<row>", "<tr>", "<trow>", "<r>"], answer: "1" },
    { question: "Which tag is for table data cells?", options: ["<tc>", "<cell>", "<td>", "<data>"], answer: "2" },
    { question: "What tag creates a form?", options: ["<input>", "<form>", "<submit>", "<entry>"], answer: "1" },
    { question: "Which tag creates a text input?", options: ["<textbox>", "<text>", "<input>", "<field>"], answer: "2" },
    { question: "What tag creates a button?", options: ["<btn>", "<click>", "<button>", "<press>"], answer: "2" },
    { question: "Which tag is for the page title?", options: ["<heading>", "<name>", "<title>", "<top>"], answer: "2" },
    { question: "What goes in the <head> section?", options: ["Visible content", "Metadata and title", "Images", "Paragraphs"], answer: "1" },
    { question: "What goes in the <body> section?", options: ["Page title", "Links to CSS", "Visible content", "Meta tags"], answer: "2" },
    { question: "Which attribute adds a link URL?", options: ["link", "src", "href", "url"], answer: "2" },
  ],
  CSS: [
    { question: "What does CSS stand for?", options: ["Computer Style Sheets", "Creative Style System", "Cascading Style Sheets", "Colorful Style Sheets"], answer: "2" },
    { question: "Which property changes text color?", options: ["text-color", "font-color", "color", "text-style"], answer: "2" },
    { question: "Which property changes background color?", options: ["bg-color", "background-color", "back-color", "bgcolor"], answer: "1" },
    { question: "How do you select an element by ID?", options: [".myid", "#myid", "*myid", "@myid"], answer: "1" },
    { question: "How do you select elements by class?", options: ["#myclass", ".myclass", "*myclass", "@myclass"], answer: "1" },
    { question: "Which property changes font size?", options: ["text-size", "font-size", "size", "font-style"], answer: "1" },
    { question: "Which property adds space inside an element?", options: ["margin", "spacing", "padding", "border"], answer: "2" },
    { question: "Which property adds space outside an element?", options: ["margin", "spacing", "padding", "border"], answer: "0" },
    { question: "What property makes text bold?", options: ["font-bold", "text-weight", "font-weight", "bold"], answer: "2" },
    { question: "Which value centers text?", options: ["middle", "center", "centered", "align"], answer: "1" },
    { question: "What property changes the font?", options: ["font-type", "font-family", "font-name", "text-font"], answer: "1" },
    { question: "Which property adds a border?", options: ["outline", "border", "edge", "line"], answer: "1" },
    { question: "What does 'display: flex' do?", options: ["Hides element", "Creates flexbox layout", "Makes text flexible", "Adds animation"], answer: "1" },
    { question: "Which property rounds corners?", options: ["corner-radius", "border-radius", "round-corners", "radius"], answer: "1" },
    { question: "What property sets element width?", options: ["size", "width", "horizontal", "w"], answer: "1" },
    { question: "Which property sets element height?", options: ["size", "height", "vertical", "h"], answer: "1" },
    { question: "What does 'text-align: center' do?", options: ["Centers the element", "Centers the text", "Centers the page", "Centers images"], answer: "1" },
    { question: "Which property hides an element?", options: ["hidden: true", "display: none", "visible: false", "show: none"], answer: "1" },
    { question: "What unit is relative to font size?", options: ["px", "em", "cm", "pt"], answer: "1" },
    { question: "Which property adds shadow to text?", options: ["text-shadow", "font-shadow", "shadow", "text-effect"], answer: "0" },
  ],
  JAVASCRIPT: [
    { question: "How do you create a variable?", options: ["variable x = 5", "let x = 5", "v x = 5", "create x = 5"], answer: "1" },
    { question: "What does console.log() do?", options: ["Creates a log file", "Prints to console", "Logs into site", "Creates variable"], answer: "1" },
    { question: "How do you write a comment?", options: ["# comment", "// comment", "-- comment", "** comment"], answer: "1" },
    { question: "What is a function?", options: ["A variable", "Reusable code block", "A loop", "An error"], answer: "1" },
    { question: "How do you create a function?", options: ["make myFunc()", "function myFunc()", "func myFunc()", "def myFunc()"], answer: "1" },
    { question: "What does === check?", options: ["Assignment", "Value and type equality", "Greater than", "Less than"], answer: "1" },
    { question: "How do you create an array?", options: ["array()", "[]", "{}", "()"], answer: "1" },
    { question: "What is an if statement for?", options: ["Loops", "Making decisions", "Creating variables", "Printing"], answer: "1" },
    { question: "What does a for loop do?", options: ["Makes decisions", "Repeats code", "Creates functions", "Stores data"], answer: "1" },
    { question: "How do you get array length?", options: ["array.size", "array.length", "array.count", "len(array)"], answer: "1" },
    { question: "What does alert() do?", options: ["Logs to console", "Shows popup message", "Creates error", "Sends email"], answer: "1" },
    { question: "What is the DOM?", options: ["A database", "Document Object Model", "A programming language", "A browser"], answer: "1" },
    { question: "How do you select an element by ID?", options: ["getElement()", "getElementById()", "selectId()", "findId()"], answer: "1" },
    { question: "What is an event?", options: ["An error", "User action", "A variable", "A function"], answer: "1" },
    { question: "What event fires on a click?", options: ["onpress", "onclick", "ontouch", "onhit"], answer: "1" },
    { question: "What is a string?", options: ["A number", "Text in quotes", "A boolean", "An array"], answer: "1" },
    { question: "What is a boolean?", options: ["Text", "Number", "True or false", "Array"], answer: "2" },
    { question: "What does push() do to an array?", options: ["Removes item", "Adds item to end", "Sorts items", "Reverses items"], answer: "1" },
    { question: "What is NaN?", options: ["A number", "Not a Number", "Null value", "An error"], answer: "1" },
    { question: "How do you convert string to number?", options: ["toNumber()", "parseInt()", "number()", "convert()"], answer: "1" },
  ],
  PYTHON: [
    { question: "How do you print in Python?", options: ["console.log()", "echo", "print()", "say()"], answer: "2" },
    { question: "What starts a comment in Python?", options: ["//", "/*", "#", "--"], answer: "2" },
    { question: "How do you create a variable?", options: ["var x = 5", "let x = 5", "x = 5", "int x = 5"], answer: "2" },
    { question: "What is a list in Python?", options: ["A function", "Collection of items", "A loop", "A number"], answer: "1" },
    { question: "How do you create a list?", options: ["list()", "[]", "{}", "()"], answer: "1" },
    { question: "What does len() return?", options: ["First item", "Last item", "Length/count", "Sum"], answer: "2" },
    { question: "How do you define a function?", options: ["function myFunc:", "def myFunc():", "func myFunc():", "define myFunc:"], answer: "1" },
    { question: "What is indentation for in Python?", options: ["Looks nice", "Defines code blocks", "Comments", "Nothing"], answer: "1" },
    { question: "How do you get user input?", options: ["read()", "input()", "get()", "scan()"], answer: "1" },
    { question: "What does range(5) create?", options: ["Number 5", "Numbers 0-4", "Numbers 1-5", "5 zeros"], answer: "1" },
    { question: "How do you write an if statement?", options: ["if (x == 5)", "if x == 5:", "if x = 5 then", "if x equals 5"], answer: "1" },
    { question: "What is elif short for?", options: ["else if", "end if", "every if", "else in"], answer: "0" },
    { question: "How do you start a for loop?", options: ["for i in range(5):", "for (i=0; i<5; i++)", "loop i to 5:", "for i = 1 to 5"], answer: "0" },
    { question: "What does append() do?", options: ["Removes item", "Adds to list", "Sorts list", "Clears list"], answer: "1" },
    { question: "What is a dictionary?", options: ["A book", "Key-value pairs", "A list", "A function"], answer: "1" },
    { question: "How do you create a dictionary?", options: ["dict[]", "{key: value}", "[key: value]", "(key: value)"], answer: "1" },
    { question: "What does True represent?", options: ["Yes/on", "A number", "A string", "An error"], answer: "0" },
    { question: "What is a string?", options: ["A number", "Text in quotes", "A boolean", "A list"], answer: "1" },
    { question: "How do you import a module?", options: ["include module", "import module", "require module", "use module"], answer: "1" },
    { question: "What does int() do?", options: ["Creates integer", "Converts to integer", "Checks if integer", "Rounds number"], answer: "1" },
  ],
  ROBLOX: [
    { question: "What language does Roblox use?", options: ["Python", "JavaScript", "Lua", "C++"], answer: "2" },
    { question: "What tool creates Roblox games?", options: ["Roblox Studio", "Roblox Creator", "Roblox Builder", "Roblox Code"], answer: "0" },
    { question: "What are Parts in Roblox?", options: ["Code files", "3D building blocks", "Sound files", "Images"], answer: "1" },
    { question: "How do you add scripts?", options: ["Upload files", "Insert Script object", "Type in chat", "Use plugins"], answer: "1" },
    { question: "What is a ServerScript for?", options: ["Client code", "Server-side code", "UI only", "Sounds only"], answer: "1" },
    { question: "What is a LocalScript for?", options: ["Server code", "Client-side code", "Database", "Models"], answer: "1" },
    { question: "How do you create a local variable?", options: ["var x", "let x", "local x", "dim x"], answer: "2" },
    { question: "What does script.Parent refer to?", options: ["The game", "Parent object of script", "The player", "The server"], answer: "1" },
    { question: "How do you change a part's color?", options: ["part.Color", "part.BrickColor", "part.Paint", "part.Fill"], answer: "1" },
    { question: "What is Workspace?", options: ["Code editor", "Container for 3D objects", "Sound folder", "Script folder"], answer: "1" },
    { question: "How do you detect when a part is touched?", options: ["part.Click", "part.Touched", "part.Hit", "part.Contact"], answer: "1" },
    { question: "What is a function in Lua?", options: ["A part", "Reusable code block", "A model", "An event"], answer: "1" },
    { question: "How do you write a comment in Lua?", options: ["// comment", "# comment", "-- comment", "/* comment */"], answer: "2" },
    { question: "What does wait() do?", options: ["Stops forever", "Pauses for seconds", "Deletes script", "Speeds up code"], answer: "1" },
    { question: "What is a Model?", options: ["Code file", "Group of parts", "Single part", "Sound"], answer: "1" },
    { question: "How do you print in Lua?", options: ["console.log()", "print()", "echo()", "say()"], answer: "1" },
    { question: "What is ReplicatedStorage for?", options: ["Only server", "Shared between server and client", "Only client", "Sounds only"], answer: "1" },
    { question: "How do you make a part invisible?", options: ["part.Visible = false", "part.Transparency = 1", "part.Hidden = true", "part.Alpha = 0"], answer: "1" },
    { question: "What is Players service for?", options: ["Sound players", "Accessing player objects", "Part creation", "Lighting"], answer: "1" },
    { question: "How do you destroy an object?", options: ["object:Delete()", "object:Destroy()", "object:Remove()", "delete(object)"], answer: "1" },
  ],
  ENGINEERING: [
    { question: "What is the first step in engineering?", options: ["Build", "Identify the problem", "Test", "Buy materials"], answer: "1" },
    { question: "What is a prototype?", options: ["Final product", "Test model", "Robot type", "Coding language"], answer: "1" },
    { question: "Why do engineers test prototypes?", options: ["To finish faster", "To find problems early", "To save money only", "It's not important"], answer: "1" },
    { question: "What is brainstorming?", options: ["Thinking alone", "Generating many ideas", "Building things", "Testing products"], answer: "1" },
    { question: "What is iteration?", options: ["First try", "Repeating to improve", "Final product", "Giving up"], answer: "1" },
    { question: "What shape is strongest for bridges?", options: ["Square", "Circle", "Triangle", "Rectangle"], answer: "2" },
    { question: "What is a constraint?", options: ["A tool", "A limitation or rule", "A material", "A design"], answer: "1" },
    { question: "What is a simple machine?", options: ["Computer", "Device that makes work easier", "Robot", "Engine"], answer: "1" },
    { question: "What is a lever?", options: ["A wheel", "A bar that pivots", "A screw", "A pulley"], answer: "1" },
    { question: "What does a pulley do?", options: ["Cuts things", "Changes direction of force", "Measures weight", "Heats materials"], answer: "1" },
    { question: "What is the design process?", options: ["Random building", "Step-by-step problem solving", "Only testing", "Only drawing"], answer: "1" },
    { question: "Why is research important?", options: ["To waste time", "To learn about the problem", "To skip prototyping", "It's not important"], answer: "1" },
    { question: "What is a criteria?", options: ["A constraint", "A goal the design must meet", "A material", "A tool"], answer: "1" },
    { question: "What do structural engineers design?", options: ["Websites", "Buildings and bridges", "Software", "Clothing"], answer: "1" },
    { question: "What is mechanical engineering about?", options: ["Websites", "Moving parts and machines", "Chemicals", "Electricity"], answer: "1" },
    { question: "What is electrical engineering about?", options: ["Buildings", "Electronics and circuits", "Water systems", "Food"], answer: "1" },
    { question: "Why do engineers work in teams?", options: ["To argue", "To combine different skills", "It's required", "To be slower"], answer: "1" },
    { question: "What is failure analysis?", options: ["Giving up", "Learning from what went wrong", "Celebrating", "Ignoring problems"], answer: "1" },
    { question: "What is a trade-off?", options: ["Buying things", "Giving up one thing to get another", "A tool", "A measurement"], answer: "1" },
    { question: "Why document designs?", options: ["To waste paper", "To remember and share ideas", "It's not needed", "To look busy"], answer: "1" },
  ],
  AI_ML: [
    { question: "What does AI stand for?", options: ["Automatic Intelligence", "Artificial Intelligence", "Advanced Internet", "Automated Information"], answer: "1" },
    { question: "How do machines learn?", options: ["Reading books", "From many examples", "Watching videos", "Listening to music"], answer: "1" },
    { question: "What is training data?", options: ["Exercise routines", "Examples for AI to learn from", "Computer manuals", "Test scores"], answer: "1" },
    { question: "What is pattern recognition?", options: ["Art", "Finding similarities in data", "Music", "Games"], answer: "1" },
    { question: "What is machine learning?", options: ["Robots exercising", "Computers learning from data", "Programming manually", "Memory storage"], answer: "1" },
    { question: "What is a neural network inspired by?", options: ["Computers", "The human brain", "The internet", "Robots"], answer: "1" },
    { question: "What is image recognition?", options: ["Taking photos", "AI identifying what's in images", "Editing pictures", "Printing images"], answer: "1" },
    { question: "What is natural language processing?", options: ["Learning languages", "AI understanding human language", "Translation apps", "Writing books"], answer: "1" },
    { question: "What is a chatbot?", options: ["A robot", "AI that converses with humans", "A game", "A website"], answer: "1" },
    { question: "What is supervised learning?", options: ["Watched by teachers", "Learning from labeled data", "Learning alone", "Random learning"], answer: "1" },
    { question: "What is unsupervised learning?", options: ["No supervision needed", "Finding patterns without labels", "Not learning", "Supervised by AI"], answer: "1" },
    { question: "What is classification?", options: ["Organizing files", "Sorting data into categories", "Random sorting", "Deleting data"], answer: "1" },
    { question: "What is prediction in AI?", options: ["Fortune telling", "Using data to forecast outcomes", "Guessing randomly", "Remembering"], answer: "1" },
    { question: "What is AI bias?", options: ["AI preferences", "Unfair results from biased data", "AI opinions", "AI errors"], answer: "1" },
    { question: "Why is diverse training data important?", options: ["Looks better", "Reduces bias", "Uses more storage", "Not important"], answer: "1" },
    { question: "What is a recommendation system?", options: ["A shopping list", "AI suggesting content you might like", "A to-do app", "A calendar"], answer: "1" },
    { question: "What is speech recognition?", options: ["Listening to music", "AI converting speech to text", "Recording audio", "Playing sounds"], answer: "1" },
    { question: "What is computer vision?", options: ["Monitors", "AI understanding images/video", "Cameras", "Graphics cards"], answer: "1" },
    { question: "What does 'training' an AI mean?", options: ["Teaching it rules", "Feeding it data to learn patterns", "Programming code", "Testing it"], answer: "1" },
    { question: "What is AI ethics about?", options: ["AI feelings", "Responsible and fair AI development", "AI laws", "AI coding"], answer: "1" },
  ],
  ROBOTICS: [
    { question: "What are sensors for?", options: ["Looking cool", "Detecting the environment", "Charging battery", "Internet connection"], answer: "1" },
    { question: "What makes robots move?", options: ["Sensors", "Batteries only", "Motors", "Screens"], answer: "2" },
    { question: "What is a robot?", options: ["Any machine", "Machine that senses and acts", "Only humanoid machines", "Computers only"], answer: "1" },
    { question: "What does a distance sensor measure?", options: ["Temperature", "How far objects are", "Light", "Sound"], answer: "1" },
    { question: "What does a light sensor detect?", options: ["Distance", "Brightness", "Sound", "Touch"], answer: "1" },
    { question: "What is a touch sensor for?", options: ["Seeing", "Detecting physical contact", "Hearing", "Smelling"], answer: "1" },
    { question: "What is a servo motor?", options: ["Very fast motor", "Motor with precise position control", "Weak motor", "Sound motor"], answer: "1" },
    { question: "What is line following?", options: ["Drawing lines", "Robot following a line path", "Crossing lines", "Making lines"], answer: "1" },
    { question: "What is obstacle avoidance?", options: ["Hitting obstacles", "Robot detecting and going around objects", "Removing obstacles", "Ignoring obstacles"], answer: "1" },
    { question: "What is a microcontroller?", options: ["Tiny controller", "Small computer brain for robots", "Remote control", "Battery"], answer: "1" },
    { question: "What is Arduino?", options: ["A robot", "A microcontroller platform", "A sensor", "A motor"], answer: "1" },
    { question: "What is a program?", options: ["A show", "Instructions for the robot", "A part", "A sensor"], answer: "1" },
    { question: "What is autonomous?", options: ["Remote controlled", "Acting on its own", "Broken", "Charging"], answer: "1" },
    { question: "What is a robot arm used for?", options: ["Walking", "Grabbing and moving things", "Seeing", "Thinking"], answer: "1" },
    { question: "What is a gripper?", options: ["A wheel", "A tool for grabbing", "A sensor", "A motor"], answer: "1" },
    { question: "Why calibrate sensors?", options: ["Make them look nice", "Ensure accurate readings", "Make them louder", "It's not needed"], answer: "1" },
    { question: "What is a loop in robot programming?", options: ["A circle", "Code that repeats", "A sensor", "A motor type"], answer: "1" },
    { question: "What is a condition in programming?", options: ["Weather", "An if/then check", "A part", "A motor"], answer: "1" },
    { question: "What powers most hobby robots?", options: ["Gas", "Batteries", "Solar only", "Wind"], answer: "1" },
    { question: "What is debugging?", options: ["Adding bugs", "Finding and fixing errors", "Breaking code", "Writing code"], answer: "1" },
  ],
  GAME_DEVELOPMENT: [
    { question: "What is a game loop?", options: ["A game type", "Update and draw cycle", "A sound loop", "An endless game"], answer: "1" },
    { question: "What are sprites?", options: ["Drinks", "2D game images", "Sounds", "Stories"], answer: "1" },
    { question: "What is collision detection?", options: ["Car crashes", "Checking if objects touch", "Sound effects", "Game menus"], answer: "1" },
    { question: "What is a hitbox?", options: ["A power-up", "Invisible collision area", "A weapon", "A level"], answer: "1" },
    { question: "What is game physics?", options: ["School subject", "Simulating movement and forces", "Art style", "Sound design"], answer: "1" },
    { question: "What is a tilemap?", options: ["A world map", "Grid of image tiles for levels", "A treasure map", "A menu"], answer: "1" },
    { question: "What is a frame rate?", options: ["Picture frame", "Images shown per second", "Game score", "Player count"], answer: "1" },
    { question: "What is 60 FPS?", options: ["Fast car", "60 frames per second", "60 players", "60 levels"], answer: "1" },
    { question: "What is player input?", options: ["Player's name", "Controls from keyboard/mouse/controller", "Player's score", "Player's character"], answer: "1" },
    { question: "What is a game state?", options: ["Country", "Current condition of the game", "State laws", "Keyboard state"], answer: "1" },
    { question: "What is a main menu?", options: ["Food menu", "First screen with options", "Pause screen", "Credits"], answer: "1" },
    { question: "What is a power-up?", options: ["Electricity", "Item that gives abilities", "Charging", "Turning on"], answer: "1" },
    { question: "What is NPC?", options: ["New Player Character", "Non-Player Character", "No Playing Chance", "Next Player Coming"], answer: "1" },
    { question: "What is AI in games?", options: ["Always Interesting", "Artificial Intelligence for NPCs", "Art Images", "Audio Input"], answer: "1" },
    { question: "What is a level?", options: ["Flat surface", "Stage of a game", "Height", "Score"], answer: "1" },
    { question: "What is a spawn point?", options: ["A fish", "Where characters appear", "A score", "A weapon"], answer: "1" },
    { question: "What is a health bar?", options: ["A snack", "Visual showing player health", "A location", "A character"], answer: "1" },
    { question: "What is game balancing?", options: ["Physical balance", "Making game fair and fun", "Balancing objects", "Counting"], answer: "1" },
    { question: "What is playtesting?", options: ["Playing games", "Testing games to find issues", "Making tests", "Scoring players"], answer: "1" },
    { question: "What is a game engine?", options: ["Car engine", "Software for making games", "Game music", "Game story"], answer: "1" },
  ],
  MOBILE_DEVELOPMENT: [
    { question: "What does UI stand for?", options: ["Universal Internet", "User Interface", "Unified Info", "User Intelligence"], answer: "1" },
    { question: "What is navigation in apps?", options: ["GPS directions", "Moving between screens", "Finding bugs", "Writing code"], answer: "1" },
    { question: "What is UX?", options: ["Unknown X", "User Experience", "Ultra Extreme", "User Exit"], answer: "1" },
    { question: "What is a mobile app?", options: ["Moving software", "Software for phones/tablets", "Desktop program", "Website"], answer: "1" },
    { question: "What is iOS?", options: ["Internet Operating System", "Apple's mobile OS", "Input Output System", "Android version"], answer: "1" },
    { question: "What is Android?", options: ["A robot", "Google's mobile OS", "Apple's OS", "A game"], answer: "1" },
    { question: "What is a button in apps?", options: ["Clothing item", "Tappable element for actions", "A screen", "A sound"], answer: "1" },
    { question: "What is a text input field?", options: ["Reading area", "Area to type text", "Display only", "Image area"], answer: "1" },
    { question: "What is a list view?", options: ["Shopping list", "Scrollable list of items", "A single item", "A button"], answer: "1" },
    { question: "What is responsive design?", options: ["Fast response", "Adapting to different screen sizes", "Answering questions", "Quick loading"], answer: "1" },
    { question: "What is an app icon?", options: ["App code", "Small image representing the app", "App description", "App price"], answer: "1" },
    { question: "What is a splash screen?", options: ["Water screen", "Loading screen when app opens", "Main menu", "Settings"], answer: "1" },
    { question: "What is a notification?", options: ["App delete", "Alert from an app", "App install", "App update"], answer: "1" },
    { question: "What is local storage?", options: ["Nearby store", "Data saved on device", "Cloud storage", "USB drive"], answer: "1" },
    { question: "What is an API?", options: ["App Picture Image", "Way for apps to communicate", "App Price Index", "App Performance Info"], answer: "1" },
    { question: "What is React Native?", options: ["A reaction", "Framework for cross-platform apps", "Android only", "iOS only"], answer: "1" },
    { question: "What is Flutter?", options: ["A butterfly", "Google's UI framework", "Apple's framework", "A game"], answer: "1" },
    { question: "What is an emulator?", options: ["A game", "Software that simulates a device", "A phone", "A tablet"], answer: "1" },
    { question: "What is the App Store?", options: ["Physical store", "Apple's app marketplace", "Android's store", "Website"], answer: "1" },
    { question: "What is Google Play?", options: ["A game", "Android's app marketplace", "Apple's store", "A music app"], answer: "1" },
  ],
  CAREER_PREP: [
    { question: "What is a portfolio?", options: ["A folder", "A showcase of your work", "A job application", "A programming language"], answer: "1" },
    { question: "Why network professionally?", options: ["Fix internet", "Connect with professionals", "Play games", "Build websites"], answer: "1" },
    { question: "What is a resume?", options: ["A story", "Document listing skills and experience", "A portfolio", "A cover letter"], answer: "1" },
    { question: "What is a cover letter?", options: ["Book cover", "Letter introducing yourself for a job", "Resume summary", "Thank you note"], answer: "1" },
    { question: "What is GitHub?", options: ["A website", "Platform for sharing code", "A game", "A social media"], answer: "1" },
    { question: "What is LinkedIn?", options: ["A game", "Professional networking site", "A coding site", "A video site"], answer: "1" },
    { question: "What is a technical interview?", options: ["Interview about hobbies", "Interview testing coding skills", "Phone interview", "Group interview"], answer: "1" },
    { question: "What is a behavioral interview?", options: ["About behavior problems", "Questions about past experiences", "Technical questions", "Written test"], answer: "1" },
    { question: "Why do personal projects matter?", options: ["Just for fun", "Show skills and initiative", "Required by law", "They don't matter"], answer: "1" },
    { question: "What should be in your portfolio?", options: ["Personal photos", "Your best projects", "Random code", "Nothing"], answer: "1" },
    { question: "What are soft skills?", options: ["Easy skills", "Communication and teamwork skills", "Coding skills", "Design skills"], answer: "1" },
    { question: "What are hard skills?", options: ["Difficult skills", "Technical abilities like coding", "Physical skills", "Soft skills"], answer: "1" },
    { question: "What is an internship?", options: ["Full-time job", "Learning experience at a company", "Freelance work", "Volunteer work"], answer: "1" },
    { question: "Why contribute to open source?", options: ["It pays well", "Gain experience and visibility", "It's required", "Just for fun"], answer: "1" },
    { question: "What is remote work?", options: ["Working far away", "Working from home/anywhere", "Office work", "Part-time work"], answer: "1" },
    { question: "What is a startup?", options: ["Old company", "New, growing company", "Government job", "Non-profit"], answer: "1" },
    { question: "What is freelancing?", options: ["Working for free", "Working independently for clients", "Full-time employment", "Internship"], answer: "1" },
    { question: "Why keep learning in tech?", options: ["It's boring", "Technology constantly changes", "It's required", "To show off"], answer: "1" },
    { question: "What is mentorship?", options: ["A test", "Guidance from experienced person", "A job title", "A project"], answer: "1" },
    { question: "What is a job fair?", options: ["A carnival", "Event to meet employers", "A test", "A conference"], answer: "1" },
  ],
};

// All courses to seed
const courses = [
  // HTML Courses (5)
  { title: "HTML Beginner: My First Webpage", level: "BEGINNER", ageGroup: "AGES_7_10", language: "HTML", desc: "Start your web adventure!", lessons: ["Welcome to HTML!", "Your First HTML File", "The HTML Skeleton", "Headings: Big and Small", "Paragraphs and Breaks", "Bold and Italic", "Adding Images", "Creating Links", "Fun with Lists", "Mini Project: About Me"] },
  { title: "HTML Intermediate: Building Better Pages", level: "INTERMEDIATE", ageGroup: "AGES_11_14", language: "HTML", desc: "Level up your HTML skills!", lessons: ["HTML Foundations Review", "Divs and Spans", "Semantic HTML", "Building Tables", "Forms: Text Inputs", "Forms: Buttons & Choices", "Videos and Audio", "HTML Attributes", "Code Comments", "Project: Quiz Page"] },
  { title: "HTML Advanced: Deep Dive", level: "ADVANCED", ageGroup: "AGES_11_14", language: "HTML", desc: "Advanced HTML techniques!", lessons: ["Intermediate Review", "Advanced Forms", "HTML5 Input Types", "Figure and Figcaption", "Details and Summary", "Dialog Element", "Progress and Meter", "Time and Address", "Advanced Tables", "Project: Dashboard"] },
  { title: "HTML Expert: Pro Techniques", level: "EXPERT", ageGroup: "AGES_15_18", language: "HTML", desc: "Become an HTML expert!", lessons: ["HTML5 Standard", "Meta Tags", "Accessibility", "IFrames", "Canvas Basics", "Data Attributes", "Responsive Images", "Validation & Debugging", "SEO Structure", "Project: Portfolio"] },
  { title: "HTML Master: Industry Ready", level: "MASTER", ageGroup: "AGES_15_18", language: "HTML", desc: "Master HTML development!", lessons: ["HTML in Real World", "Templates and Slots", "Web Components", "Progressive Enhancement", "Performance", "Microdata", "HTML Emails", "SVG in HTML", "Browser APIs", "Final Project"] },
  // CSS
  { title: "CSS Magic: Style Your Pages", level: "BEGINNER", ageGroup: "AGES_7_10", language: "CSS", desc: "Make websites beautiful!", lessons: ["Intro to CSS", "Colors & Typography", "Backgrounds & Borders", "The Box Model", "Layouts & Spacing", "Flexbox Basics", "Buttons & Cards", "Hover Effects", "Simple Animations", "Project: Profile Card"] },
  // JavaScript
  { title: "JavaScript Adventures", level: "BEGINNER", ageGroup: "AGES_11_14", language: "JAVASCRIPT", desc: "Add interactivity!", lessons: ["What is JavaScript?", "Variables & Strings", "Numbers and Math", "If/Else Decisions", "Loops", "Functions & Events", "Arrays", "DOM Changes", "Interactive Elements", "Mini Game Project"] },
  // Python
  { title: "Python for Young Coders", level: "BEGINNER", ageGroup: "AGES_11_14", language: "PYTHON", desc: "Start with Python!", lessons: ["Welcome to Python", "Print & Variables", "User Input", "Numbers & Calculations", "Making Decisions", "Loops & Logic", "Lists", "Functions", "Working with Files", "Text Adventure Game"] },
  // Roblox
  { title: "Roblox Game Creator", level: "BEGINNER", ageGroup: "AGES_11_14", language: "ROBLOX", desc: "Build Roblox games!", lessons: ["Welcome to Studio", "Studio Setup", "Parts & Properties", "Intro to Lua", "Scripting Basics", "Events & Connections", "Player Interaction", "Creating Collectibles", "Building an Obby", "Publish & Share"] },
  // Engineering
  { title: "Engineering for Kids", level: "BEGINNER", ageGroup: "AGES_7_10", language: "ENGINEERING", desc: "Discover engineering!", lessons: ["What is Engineering?", "Design Process", "Building Bridges", "Strong Shapes", "Levers", "Wheels & Pulleys", "Testing & Improving", "Engineering Everywhere", "Design Challenge"] },
  { title: "Engineering Design Process", level: "INTERMEDIATE", ageGroup: "AGES_11_14", language: "ENGINEERING", desc: "Master the design process!", lessons: ["Design Thinking", "Identifying Problems", "Research & Planning", "Brainstorming", "Selecting Solutions", "Prototyping", "Testing", "Iteration", "Engineering Project"] },
  // AI/ML
  { title: "Introduction to AI", level: "BEGINNER", ageGroup: "AGES_11_14", language: "AI_ML", desc: "Discover AI!", lessons: ["What is AI?", "AI Basics", "AI Everyday", "How Computers Learn", "Pattern Recognition", "Training with Examples", "AI and Images", "AI and Language", "Build a Chatbot"] },
  { title: "Machine Learning Fundamentals", level: "INTERMEDIATE", ageGroup: "AGES_15_18", language: "AI_ML", desc: "Dive into ML!", lessons: ["What is ML?", "ML Types", "Data & Features", "Data Preparation", "Training Models", "Testing Accuracy", "Classification", "Image Recognition", "Ethics in AI"] },
  // Robotics
  { title: "Robotics for Beginners", level: "BEGINNER", ageGroup: "AGES_7_10", language: "ROBOTICS", desc: "Enter robotics!", lessons: ["What are Robots?", "Meet the Robots", "Parts of a Robot", "Robot Instructions", "Move & Turn", "Sensors", "Robot Decisions", "Loops", "Robot Maze"] },
  { title: "Robot Programming", level: "INTERMEDIATE", ageGroup: "AGES_11_14", language: "ROBOTICS", desc: "Program robots!", lessons: ["Robotics Basics", "Sensors & Input", "Distance Sensors", "Color Sensors", "Motors & Movement", "Speed Control", "Line Following", "Obstacle Avoidance", "Autonomous Robot"] },
  // Game Development
  { title: "Introduction to Game Development", level: "BEGINNER", ageGroup: "AGES_7_10", language: "GAME_DEVELOPMENT", desc: "Start making games!", lessons: ["What Makes a Great Game?", "Game Genres", "Characters & Stories", "Game Rules", "Level Design", "Game Controls", "Feedback & Rewards", "Testing Games", "Your First Game"] },
  { title: "2D Game Development", level: "INTERMEDIATE", ageGroup: "AGES_11_14", language: "GAME_DEVELOPMENT", desc: "Build 2D games!", lessons: ["2D Fundamentals", "Sprites & Animation", "Game Loop", "Game Physics", "Collisions", "Enemies & AI", "Power-ups & Scoring", "Sound & Music", "UI Design", "Platformer Project"] },
  { title: "Advanced Game Programming", level: "ADVANCED", ageGroup: "AGES_15_18", language: "GAME_DEVELOPMENT", desc: "Master game dev!", lessons: ["Game Architecture", "Advanced Physics", "State Machines", "AI & Pathfinding", "Particle Systems", "Multiplayer", "Save Systems", "Optimization", "Debugging", "Publishing"] },
  // Mobile
  { title: "Introduction to Mobile Apps", level: "BEGINNER", ageGroup: "AGES_11_14", language: "MOBILE_DEVELOPMENT", desc: "Build mobile apps!", lessons: ["What are Mobile Apps?", "iOS vs Android", "App Design Basics", "Mobile UI Elements", "Your First App", "Buttons & Navigation", "Screen Layouts", "User Input", "Publishing Apps"] },
  { title: "Mobile App Development", level: "INTERMEDIATE", ageGroup: "AGES_15_18", language: "MOBILE_DEVELOPMENT", desc: "Advanced mobile!", lessons: ["Mobile Basics Review", "Advanced UI", "State Management", "Working with Data", "APIs & Internet", "Animations", "Push Notifications", "Device Features", "Complete App Project"] },
  // Career
  { title: "Build Your Developer Portfolio", level: "INTERMEDIATE", ageGroup: "AGES_15_18", language: "CAREER_PREP", desc: "Create a portfolio!", lessons: ["What is a Portfolio?", "Choosing Projects", "Portfolio Design", "Project Descriptions", "Screenshots & Demos", "Personal Branding", "Deploying", "Review & Polish"] },
  { title: "Writing Your Tech Resume", level: "INTERMEDIATE", ageGroup: "AGES_15_18", language: "CAREER_PREP", desc: "Write a great resume!", lessons: ["Resume Basics", "Formatting", "Skills Section", "Project Experience", "Education", "Action Words", "ATS-Friendly", "Resume Workshop"] },
  { title: "Launching Your Tech Career", level: "ADVANCED", ageGroup: "AGES_15_18", language: "CAREER_PREP", desc: "Start your career!", lessons: ["Tech Job Market", "GitHub Profile", "LinkedIn Setup", "Networking", "Technical Interviews", "Behavioral Interviews", "Finding Opportunities", "Application Strategy", "Mock Interviews", "Career Action Plan"] },
  // Advanced Web Dev
  { title: "Advanced Web Development", level: "INTERMEDIATE", ageGroup: "AGES_15_18", language: "JAVASCRIPT", desc: "Level up web skills!", lessons: ["Web Fundamentals Review", "Advanced CSS", "Responsive Design", "Components & State", "JavaScript ES6+", "Working with APIs", "Fetching Data", "Local Storage", "npm Setup", "Deploy & Share"] },
];

async function main() {
  console.log("🚀 Starting course seeding (with updates)...\n");

  let createdCourses = 0;
  let updatedCourses = 0;
  let createdLessons = 0;
  let updatedLessons = 0;
  let createdQuizzes = 0;

  for (const courseData of courses) {
    const slug = generateSlug(courseData.title);
    const contentGen = contentGenerators[courseData.language] || contentGenerators.HTML;
    const questions = quizQuestions[courseData.language] || quizQuestions.HTML;

    // Check if exists
    const existing = await prisma.course.findUnique({
      where: { slug },
      include: { lessons: true }
    });

    if (existing) {
      // UPDATE existing lessons with new content and quizzes
      console.log(`📝 Updating: ${courseData.title}`);
      let quizzesUpdated = 0;

      for (let i = 0; i < existing.lessons.length; i++) {
        const lesson = existing.lessons[i];
        const content = contentGen(lesson.title, `Learn about ${lesson.title.toLowerCase()}`);

        // Update lesson content
        await prisma.lesson.update({
          where: { id: lesson.id },
          data: {
            content: content.content,
            exampleCode: content.exampleCode || null,
            exerciseInstructions: content.exerciseInstructions || null,
            exerciseStarterCode: content.exerciseStarterCode || null,
          },
        });
        updatedLessons++;

        // Delete existing quiz and questions for this lesson
        const existingQuiz = await prisma.quiz.findUnique({
          where: { lessonId: lesson.id },
          include: { questions: true }
        });

        if (existingQuiz) {
          await prisma.question.deleteMany({
            where: { quizId: existingQuiz.id }
          });
          await prisma.quiz.delete({
            where: { id: existingQuiz.id }
          });
        }

        // Create new quiz with more questions (pick 2 random questions per lesson)
        const lessonQuestions = questions.slice(i * 2 % questions.length, (i * 2 % questions.length) + 2);
        if (lessonQuestions.length < 2) {
          lessonQuestions.push(...questions.slice(0, 2 - lessonQuestions.length));
        }

        await prisma.quiz.create({
          data: {
            lessonId: lesson.id,
            questions: {
              create: lessonQuestions.map((q, idx) => ({
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
        quizzesUpdated++;
      }

      updatedCourses++;
      console.log(`   ✅ Updated ${existing.lessons.length} lessons, ${quizzesUpdated} quizzes`);
      continue;
    }

    // Create new course with lessons
    const course = await prisma.course.create({
      data: {
        title: courseData.title,
        slug,
        description: courseData.desc,
        level: courseData.level as any,
        ageGroup: courseData.ageGroup as any,
        language: courseData.language as any,
        lessons: {
          create: courseData.lessons.map((lessonTitle, index) => {
            const content = contentGen(lessonTitle, `Learn about ${lessonTitle.toLowerCase()}`);
            return {
              title: lessonTitle,
              slug: generateSlug(lessonTitle),
              description: `Learn about ${lessonTitle.toLowerCase()}`,
              orderIndex: index,
              xpReward: 50 + (index * 10),
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

    createdCourses++;
    createdLessons += course.lessons.length;
    console.log(`✅ Created: ${courseData.title} (${course.lessons.length} lessons)`);

    // Create quizzes for each lesson
    for (const lesson of course.lessons) {
      const quiz = await prisma.quiz.create({
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
      createdQuizzes++;
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log("🎉 SEEDING COMPLETE!");
  console.log("=".repeat(50));
  console.log(`📚 Courses created: ${createdCourses}`);
  console.log(`📚 Courses updated: ${updatedCourses}`);
  console.log(`📖 Lessons created: ${createdLessons}`);
  console.log(`📖 Lessons updated: ${updatedLessons}`);
  console.log(`❓ Quizzes created: ${createdQuizzes}`);

  // Show totals
  const totalCourses = await prisma.course.count();
  const totalLessons = await prisma.lesson.count();
  const totalQuizzes = await prisma.quiz.count();
  console.log("\n📊 Total in database:");
  console.log(`   Courses: ${totalCourses}`);
  console.log(`   Lessons: ${totalLessons}`);
  console.log(`   Quizzes: ${totalQuizzes}`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

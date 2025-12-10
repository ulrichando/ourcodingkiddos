import { PrismaClient, QuestionType } from "@prisma/client";

const prisma = new PrismaClient();

// Lesson content for Web Development Foundations (Beginner)
const beginnerLessonContent = [
  {
    title: "Welcome to Web Development",
    content: `
<h2>🌐 What is Web Development?</h2>

<p>Have you ever wondered how websites like YouTube, Google, or your favorite games are made? That's what <strong>web developers</strong> do!</p>

<p>Web development is like building with digital LEGO blocks. Instead of plastic pieces, we use <strong>code</strong> - special instructions that tell computers what to show on the screen.</p>

<h3>🏗️ The Three Languages of the Web</h3>

<p>Every website is built using three main languages:</p>

<ul>
<li><strong>HTML</strong> - The skeleton! It creates the structure (headings, paragraphs, buttons)</li>
<li><strong>CSS</strong> - The clothes! It makes things look pretty (colors, fonts, layouts)</li>
<li><strong>JavaScript</strong> - The brain! It makes things interactive (clicks, animations, games)</li>
</ul>

<h3>🎯 What You'll Build</h3>

<p>By the end of this course, you'll be able to create your own websites from scratch! How cool is that?</p>

<p><strong>Fun Fact:</strong> The first website ever was created in 1991 - that's older than most of your parents' phones!</p>
`,
    exampleCode: `<!DOCTYPE html>
<html>
  <head>
    <title>My First Website!</title>
  </head>
  <body>
    <h1>Hello, World!</h1>
    <p>I'm learning web development!</p>
    <p>This is so exciting! 🎉</p>
  </body>
</html>`,
    exerciseInstructions: "Change the text inside the <h1> tag to say your name! For example: <h1>Hi, I'm Alex!</h1>",
    exerciseStarterCode: `<!DOCTYPE html>
<html>
  <head>
    <title>My Website</title>
  </head>
  <body>
    <h1>Your name here!</h1>
    <p>Welcome to my website.</p>
  </body>
</html>`,
    quiz: [
      {
        question: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "How To Make Layouts"],
        correctAnswer: "Hyper Text Markup Language",
        explanation: "HTML stands for Hyper Text Markup Language. It's the standard language for creating web pages!"
      },
      {
        question: "Which language makes websites look pretty with colors and fonts?",
        options: ["HTML", "CSS", "JavaScript", "Python"],
        correctAnswer: "CSS",
        explanation: "CSS (Cascading Style Sheets) is used to style websites with colors, fonts, and layouts!"
      }
    ]
  },
  {
    title: "Setting Up Your Developer Environment",
    content: `
<h2>🛠️ Your Coding Toolbox</h2>

<p>Every builder needs the right tools. For web developers, we need:</p>

<h3>1. A Code Editor</h3>
<p><strong>VS Code</strong> is like Microsoft Word for coders! It helps us write code with:</p>
<ul>
<li>🎨 Colors that make code easier to read</li>
<li>✨ Auto-complete that guesses what you want to type</li>
<li>🔍 Error detection to catch mistakes</li>
</ul>

<h3>2. A Web Browser</h3>
<p>Chrome, Firefox, or Edge - these show your website to the world! Press <code>F12</code> to see the secret "Developer Tools".</p>

<h3>3. Your Files</h3>
<p>Web files have special endings:</p>
<ul>
<li><code>.html</code> - For HTML files (structure)</li>
<li><code>.css</code> - For CSS files (style)</li>
<li><code>.js</code> - For JavaScript files (interactivity)</li>
</ul>

<h3>💡 Pro Tip</h3>
<p>Always save your work with <code>Ctrl + S</code> (or <code>Cmd + S</code> on Mac) - it's the most important keyboard shortcut!</p>
`,
    exampleCode: `<!-- This is how we write comments in HTML -->
<!-- Comments help us remember what our code does -->

<!DOCTYPE html>
<html>
  <head>
    <title>My Setup Test</title>
  </head>
  <body>
    <!-- This is a heading -->
    <h1>Setup Complete!</h1>

    <!-- This is a paragraph -->
    <p>My developer environment is ready!</p>
  </body>
</html>`,
    exerciseInstructions: "Add a comment above the <p> tag explaining what it does. Use <!-- Your comment here -->",
    exerciseStarterCode: `<!DOCTYPE html>
<html>
  <head>
    <title>Practice File</title>
  </head>
  <body>
    <h1>Comments Practice</h1>

    <p>Add a comment above me!</p>
  </body>
</html>`,
    quiz: [
      {
        question: "What is VS Code?",
        options: ["A web browser", "A code editor", "A programming language", "A video game"],
        correctAnswer: "A code editor",
        explanation: "VS Code (Visual Studio Code) is a popular code editor used by millions of developers!"
      },
      {
        question: "What file extension do HTML files use?",
        options: [".txt", ".doc", ".html", ".web"],
        correctAnswer: ".html",
        explanation: "HTML files always end with .html - this tells the computer it's a webpage!"
      }
    ]
  },
  {
    title: "HTML Fundamentals: Structure",
    content: `
<h2>🏗️ Building Your First Webpage</h2>

<p>Every HTML page has the same basic structure - like a house has a foundation, walls, and roof!</p>

<h3>The HTML Skeleton</h3>

<p><code>&lt;!DOCTYPE html&gt;</code> - Tells the browser "This is HTML5!"</p>
<p><code>&lt;html&gt;</code> - The container for EVERYTHING</p>
<p><code>&lt;head&gt;</code> - The brain! (title, settings - users don't see this)</p>
<p><code>&lt;body&gt;</code> - The content users actually see!</p>

<h3>📝 Headings (h1 to h6)</h3>

<p>Headings are like titles in a book:</p>
<ul>
<li><code>&lt;h1&gt;</code> - The biggest, most important (use once per page)</li>
<li><code>&lt;h2&gt;</code> - Chapter titles</li>
<li><code>&lt;h3&gt;</code> to <code>&lt;h6&gt;</code> - Smaller subtitles</li>
</ul>

<h3>📄 Paragraphs</h3>

<p>Use <code>&lt;p&gt;</code> tags for regular text. Each paragraph gets its own <code>&lt;p&gt;</code> tag!</p>

<h3>🔑 Remember!</h3>
<p>Most HTML tags need to be <strong>closed</strong>: <code>&lt;p&gt;text&lt;/p&gt;</code></p>
`,
    exampleCode: `<!DOCTYPE html>
<html>
  <head>
    <title>My Structured Page</title>
  </head>
  <body>
    <h1>Welcome to My Website</h1>
    <h2>About Me</h2>
    <p>Hi! I'm learning to code.</p>

    <h2>My Hobbies</h2>
    <p>I love playing games and coding!</p>

    <h3>Favorite Games</h3>
    <p>Minecraft and Roblox are the best!</p>
  </body>
</html>`,
    exerciseInstructions: "Create a page about your favorite animal using h1, h2, and p tags!",
    exerciseStarterCode: `<!DOCTYPE html>
<html>
  <head>
    <title>My Favorite Animal</title>
  </head>
  <body>
    <!-- Add an h1 with the animal's name -->

    <!-- Add an h2 that says "Description" -->

    <!-- Add a paragraph describing the animal -->

    <!-- Add an h2 that says "Fun Facts" -->

    <!-- Add a paragraph with a fun fact -->

  </body>
</html>`,
    quiz: [
      {
        question: "Which tag is the biggest heading?",
        options: ["<h6>", "<h1>", "<p>", "<title>"],
        correctAnswer: "<h1>",
        explanation: "<h1> is the largest and most important heading. <h6> is the smallest!"
      },
      {
        question: "Where does the <title> tag go?",
        options: ["In the <body>", "In the <head>", "Outside <html>", "Anywhere you want"],
        correctAnswer: "In the <head>",
        explanation: "The <title> tag goes in the <head> section - it shows up in the browser tab!"
      }
    ]
  },
  {
    title: "HTML Fundamentals: Content",
    content: `
<h2>🖼️ Adding Images and Links</h2>

<p>Now let's make our pages more interesting with pictures and clickable links!</p>

<h3>📷 Images with &lt;img&gt;</h3>

<p>The image tag is special - it doesn't need a closing tag!</p>

<pre><code>&lt;img src="photo.jpg" alt="A cute cat"&gt;</code></pre>

<ul>
<li><code>src</code> - Where the image is (the source)</li>
<li><code>alt</code> - Description if image can't load (also helps blind users!)</li>
</ul>

<h3>🔗 Links with &lt;a&gt;</h3>

<p>Links let users jump to other pages:</p>

<pre><code>&lt;a href="https://google.com"&gt;Click me!&lt;/a&gt;</code></pre>

<ul>
<li><code>href</code> - Where the link goes (the address)</li>
<li>The text between tags is what users click</li>
</ul>

<h3>🎥 Adding Videos</h3>

<p>You can embed YouTube videos using <code>&lt;iframe&gt;</code> - but that's more advanced!</p>

<h3>💡 Pro Tip</h3>
<p>Use <code>target="_blank"</code> to open links in a new tab!</p>
`,
    exampleCode: `<!DOCTYPE html>
<html>
  <head>
    <title>Images and Links</title>
  </head>
  <body>
    <h1>My Photo Gallery</h1>

    <h2>A Cool Picture</h2>
    <img src="https://placekitten.com/300/200" alt="A cute kitten">

    <h2>Useful Links</h2>
    <p>
      <a href="https://scratch.mit.edu">Learn Scratch</a>
    </p>
    <p>
      <a href="https://code.org" target="_blank">
        Code.org (opens in new tab)
      </a>
    </p>
  </body>
</html>`,
    exerciseInstructions: "Add an image of your favorite animal and a link to learn more about it!",
    exerciseStarterCode: `<!DOCTYPE html>
<html>
  <head>
    <title>My Favorite Animal</title>
  </head>
  <body>
    <h1>Dogs Are Amazing!</h1>

    <!-- Add an image here (you can use a placeholder URL) -->

    <p>Dogs are loyal and fun pets!</p>

    <!-- Add a link to learn more about dogs -->

  </body>
</html>`,
    quiz: [
      {
        question: "What attribute in <img> tells where the image is?",
        options: ["alt", "src", "href", "link"],
        correctAnswer: "src",
        explanation: "src (source) tells the browser where to find the image file!"
      },
      {
        question: "What does the 'alt' attribute do?",
        options: ["Changes the image color", "Describes the image for accessibility", "Makes the image bigger", "Adds a border"],
        correctAnswer: "Describes the image for accessibility",
        explanation: "alt provides a text description if the image can't load and helps screen readers!"
      }
    ]
  },
  {
    title: "HTML Forms & Inputs",
    content: `
<h2>📝 Getting Information from Users</h2>

<p>Forms let users type things and send them to you - like a digital questionnaire!</p>

<h3>The Form Container</h3>

<pre><code>&lt;form&gt;
  ... your inputs go here ...
&lt;/form&gt;</code></pre>

<h3>🔤 Text Inputs</h3>

<pre><code>&lt;input type="text" placeholder="Type here..."&gt;</code></pre>

<h3>🏷️ Labels</h3>

<p>Always label your inputs so users know what to type!</p>

<pre><code>&lt;label&gt;Your Name:&lt;/label&gt;
&lt;input type="text"&gt;</code></pre>

<h3>📧 Different Input Types</h3>

<ul>
<li><code>type="text"</code> - Regular text</li>
<li><code>type="email"</code> - Email addresses</li>
<li><code>type="password"</code> - Hidden text (for passwords)</li>
<li><code>type="number"</code> - Only numbers</li>
</ul>

<h3>🔘 Buttons</h3>

<pre><code>&lt;button&gt;Click Me!&lt;/button&gt;</code></pre>
`,
    exampleCode: `<!DOCTYPE html>
<html>
  <head>
    <title>My Form</title>
  </head>
  <body>
    <h1>Sign Up Form</h1>

    <form>
      <label>Your Name:</label><br>
      <input type="text" placeholder="Enter your name"><br><br>

      <label>Your Email:</label><br>
      <input type="email" placeholder="you@email.com"><br><br>

      <label>Your Age:</label><br>
      <input type="number" placeholder="How old are you?"><br><br>

      <button>Sign Up!</button>
    </form>
  </body>
</html>`,
    exerciseInstructions: "Create a form asking for the user's favorite color and favorite food!",
    exerciseStarterCode: `<!DOCTYPE html>
<html>
  <head>
    <title>Favorites Form</title>
  </head>
  <body>
    <h1>Tell Me Your Favorites!</h1>

    <form>
      <!-- Add a label and text input for favorite color -->

      <!-- Add a label and text input for favorite food -->

      <!-- Add a submit button -->

    </form>
  </body>
</html>`,
    quiz: [
      {
        question: "What input type hides what you type?",
        options: ["text", "hidden", "password", "secret"],
        correctAnswer: "password",
        explanation: "type='password' shows dots or asterisks instead of the actual characters!"
      },
      {
        question: "What does the placeholder attribute do?",
        options: ["Submits the form", "Shows hint text inside the input", "Makes the input required", "Changes the input color"],
        correctAnswer: "Shows hint text inside the input",
        explanation: "placeholder shows gray hint text that disappears when you start typing!"
      }
    ]
  },
  {
    title: "CSS Basics: Styling Text",
    content: `
<h2>🎨 Making Text Beautiful</h2>

<p>CSS is like makeup for your website! Let's learn how to style text.</p>

<h3>Adding CSS</h3>

<p>You can add CSS inside a <code>&lt;style&gt;</code> tag in your HTML:</p>

<pre><code>&lt;style&gt;
  p {
    color: blue;
  }
&lt;/style&gt;</code></pre>

<h3>🎨 Color</h3>

<pre><code>color: red;      /* Text color */
color: #FF5733;  /* Hex color code */
color: rgb(255, 0, 0); /* RGB */</code></pre>

<h3>📝 Font Properties</h3>

<pre><code>font-size: 20px;        /* How big */
font-family: Arial;     /* Which font */
font-weight: bold;      /* How thick */
text-align: center;     /* Where on the line */</code></pre>

<h3>🌈 Fun Colors to Try</h3>
<ul>
<li>red, blue, green, purple, orange, pink</li>
<li>tomato, coral, gold, teal, navy</li>
</ul>
`,
    exampleCode: `<!DOCTYPE html>
<html>
  <head>
    <title>Colorful Page</title>
    <style>
      h1 {
        color: purple;
        font-size: 48px;
        text-align: center;
      }

      p {
        color: teal;
        font-size: 18px;
        font-family: Arial, sans-serif;
      }

      .highlight {
        color: orange;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <h1>Welcome to CSS!</h1>
    <p>This text is teal colored.</p>
    <p class="highlight">This text is orange and bold!</p>
  </body>
</html>`,
    exerciseInstructions: "Style the h1 to be your favorite color and make the paragraph text bigger!",
    exerciseStarterCode: `<!DOCTYPE html>
<html>
  <head>
    <title>Style Practice</title>
    <style>
      /* Style the h1 - change its color */
      h1 {

      }

      /* Style the p - make it bigger (try font-size: 24px) */
      p {

      }
    </style>
  </head>
  <body>
    <h1>Style Me!</h1>
    <p>Make this text bigger!</p>
  </body>
</html>`,
    quiz: [
      {
        question: "Which CSS property changes text color?",
        options: ["background-color", "font-color", "color", "text-color"],
        correctAnswer: "color",
        explanation: "The 'color' property changes the text color in CSS!"
      },
      {
        question: "What does font-size: 20px mean?",
        options: ["The text is 20 words long", "The text is 20 pixels tall", "There are 20 fonts", "The text has 20 colors"],
        correctAnswer: "The text is 20 pixels tall",
        explanation: "font-size sets how big the text is - px means pixels!"
      }
    ]
  },
  {
    title: "CSS Basics: Box Model",
    content: `
<h2>📦 Understanding the Box Model</h2>

<p>Every element in HTML is like a box! Understanding this helps you control spacing.</p>

<h3>The Four Layers</h3>

<p>From inside to outside:</p>
<ol>
<li><strong>Content</strong> - Your actual text or image</li>
<li><strong>Padding</strong> - Space INSIDE the box (like cushioning)</li>
<li><strong>Border</strong> - The edge of the box</li>
<li><strong>Margin</strong> - Space OUTSIDE the box (pushes other boxes away)</li>
</ol>

<h3>🎯 Padding vs Margin</h3>

<pre><code>padding: 20px;  /* Space inside - background color shows */
margin: 20px;   /* Space outside - pushes things away */</code></pre>

<h3>🔲 Borders</h3>

<pre><code>border: 2px solid black;  /* thickness style color */
border-radius: 10px;      /* rounded corners! */</code></pre>

<h3>💡 Shortcuts</h3>
<pre><code>padding: 10px;              /* all sides */
padding: 10px 20px;         /* top/bottom left/right */
padding: 5px 10px 15px 20px; /* top right bottom left */</code></pre>
`,
    exampleCode: `<!DOCTYPE html>
<html>
  <head>
    <title>Box Model Demo</title>
    <style>
      .box {
        background-color: lightblue;
        padding: 20px;
        margin: 15px;
        border: 3px solid darkblue;
        border-radius: 10px;
      }

      .fancy-box {
        background-color: pink;
        padding: 30px;
        margin: 20px;
        border: 5px dashed purple;
        border-radius: 20px;
      }
    </style>
  </head>
  <body>
    <div class="box">
      <h2>I'm in a box!</h2>
      <p>Notice the padding around me.</p>
    </div>

    <div class="fancy-box">
      <h2>Fancy Box!</h2>
      <p>I have rounded corners and a dashed border!</p>
    </div>
  </body>
</html>`,
    exerciseInstructions: "Create a card with padding, a border, and rounded corners!",
    exerciseStarterCode: `<!DOCTYPE html>
<html>
  <head>
    <title>Card Practice</title>
    <style>
      .card {
        /* Add a background color */

        /* Add padding (try 25px) */

        /* Add a border (try: 2px solid gray) */

        /* Add rounded corners (try: 15px) */

      }
    </style>
  </head>
  <body>
    <div class="card">
      <h2>My Card</h2>
      <p>This is a styled card!</p>
    </div>
  </body>
</html>`,
    quiz: [
      {
        question: "What is padding?",
        options: ["Space outside the box", "Space inside the box", "The border color", "The text size"],
        correctAnswer: "Space inside the box",
        explanation: "Padding is the space between your content and the border - it's INSIDE the box!"
      },
      {
        question: "What does border-radius do?",
        options: ["Makes borders thicker", "Creates rounded corners", "Adds shadows", "Changes border color"],
        correctAnswer: "Creates rounded corners",
        explanation: "border-radius rounds the corners of your box!"
      }
    ]
  },
  {
    title: "CSS Layouts with Flexbox",
    content: `
<h2>📐 Arranging Elements Like a Pro</h2>

<p>Flexbox is a superpower for arranging things on your page!</p>

<h3>Getting Started</h3>

<p>Add <code>display: flex;</code> to a container to activate flexbox:</p>

<pre><code>.container {
  display: flex;
}</code></pre>

<h3>🎯 Main Properties</h3>

<pre><code>/* Direction */
flex-direction: row;     /* left to right (default) */
flex-direction: column;  /* top to bottom */

/* Horizontal alignment */
justify-content: center;        /* center */
justify-content: space-between; /* spread out */

/* Vertical alignment */
align-items: center;  /* middle */</code></pre>

<h3>🌟 Common Patterns</h3>

<p><strong>Center everything:</strong></p>
<pre><code>.center-all {
  display: flex;
  justify-content: center;
  align-items: center;
}</code></pre>

<p><strong>Space items evenly:</strong></p>
<pre><code>.spread {
  display: flex;
  justify-content: space-around;
}</code></pre>
`,
    exampleCode: `<!DOCTYPE html>
<html>
  <head>
    <title>Flexbox Demo</title>
    <style>
      .row {
        display: flex;
        justify-content: space-around;
        background-color: #f0f0f0;
        padding: 20px;
        margin-bottom: 20px;
      }

      .box {
        width: 100px;
        height: 100px;
        background-color: purple;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
        font-weight: bold;
      }

      .column {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
      }
    </style>
  </head>
  <body>
    <h1>Flexbox Examples</h1>

    <h2>Row Layout</h2>
    <div class="row">
      <div class="box">1</div>
      <div class="box">2</div>
      <div class="box">3</div>
    </div>

    <h2>Column Layout</h2>
    <div class="column">
      <div class="box">A</div>
      <div class="box">B</div>
      <div class="box">C</div>
    </div>
  </body>
</html>`,
    exerciseInstructions: "Create a navigation bar with 3 links spread across using flexbox!",
    exerciseStarterCode: `<!DOCTYPE html>
<html>
  <head>
    <title>Nav Bar</title>
    <style>
      .navbar {
        background-color: navy;
        padding: 15px;
        /* Add display: flex */
        /* Add justify-content to spread items */
      }

      .navbar a {
        color: white;
        text-decoration: none;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="navbar">
      <a href="#">Home</a>
      <a href="#">About</a>
      <a href="#">Contact</a>
    </div>
  </body>
</html>`,
    quiz: [
      {
        question: "What does display: flex do?",
        options: ["Makes text bold", "Activates flexbox layout", "Hides the element", "Changes the color"],
        correctAnswer: "Activates flexbox layout",
        explanation: "display: flex turns on flexbox, giving you control over how child elements are arranged!"
      },
      {
        question: "What does justify-content: center do?",
        options: ["Centers items vertically", "Centers items horizontally", "Makes items bigger", "Adds a border"],
        correctAnswer: "Centers items horizontally",
        explanation: "justify-content controls horizontal alignment. Use align-items for vertical!"
      }
    ]
  },
  {
    title: "Introduction to JavaScript",
    content: `
<h2>🧠 Making Your Website Think!</h2>

<p>JavaScript (JS) is what makes websites interactive - clicks, animations, games, and more!</p>

<h3>Adding JavaScript</h3>

<pre><code>&lt;script&gt;
  // Your JavaScript code goes here
&lt;/script&gt;</code></pre>

<h3>📝 Variables - Storing Information</h3>

<p>Variables are like labeled boxes that store data:</p>

<pre><code>let name = "Alex";      // Text (string)
let age = 12;           // Number
let isStudent = true;   // True/False (boolean)</code></pre>

<h3>🖨️ console.log() - Printing Messages</h3>

<p>Use console.log() to see messages in the browser console (press F12):</p>

<pre><code>console.log("Hello, World!");
console.log(name);
console.log(2 + 2);</code></pre>

<h3>📊 Data Types</h3>

<ul>
<li><strong>String</strong> - Text in quotes: "Hello" or 'Hello'</li>
<li><strong>Number</strong> - Any number: 42, 3.14</li>
<li><strong>Boolean</strong> - true or false</li>
</ul>
`,
    exampleCode: `<!DOCTYPE html>
<html>
  <head>
    <title>JavaScript Intro</title>
  </head>
  <body>
    <h1>Open the Console (F12) to see messages!</h1>

    <script>
      // Creating variables
      let playerName = "CodeMaster";
      let playerScore = 100;
      let isPlaying = true;

      // Printing to console
      console.log("Welcome to JavaScript!");
      console.log("Player:", playerName);
      console.log("Score:", playerScore);
      console.log("Is playing?", isPlaying);

      // Math!
      let newScore = playerScore + 50;
      console.log("New score:", newScore);
    </script>
  </body>
</html>`,
    exerciseInstructions: "Create variables for your name, age, and favorite game, then log them!",
    exerciseStarterCode: `<!DOCTYPE html>
<html>
  <head>
    <title>Variables Practice</title>
  </head>
  <body>
    <h1>Check the Console!</h1>

    <script>
      // Create a variable for your name

      // Create a variable for your age

      // Create a variable for your favorite game

      // Log all three variables
      console.log("My name is:");
      console.log("I am this old:");
      console.log("My favorite game is:");
    </script>
  </body>
</html>`,
    quiz: [
      {
        question: "What is a variable?",
        options: ["A type of loop", "A container that stores data", "A CSS property", "An HTML tag"],
        correctAnswer: "A container that stores data",
        explanation: "Variables are like labeled boxes that hold data you can use in your code!"
      },
      {
        question: "What does console.log() do?",
        options: ["Creates a website", "Prints messages to the console", "Styles elements", "Creates a variable"],
        correctAnswer: "Prints messages to the console",
        explanation: "console.log() outputs messages to the browser's developer console (F12)!"
      }
    ]
  },
  {
    title: "JavaScript: Making Decisions",
    content: `
<h2>🤔 Teaching Your Code to Think</h2>

<p>Computers can make decisions using if/else statements!</p>

<h3>The If Statement</h3>

<pre><code>if (condition) {
  // Do this if true
}</code></pre>

<h3>If/Else</h3>

<pre><code>if (age >= 13) {
  console.log("You're a teenager!");
} else {
  console.log("You're still a kid!");
}</code></pre>

<h3>🔍 Comparison Operators</h3>

<ul>
<li><code>===</code> - Equals (exactly)</li>
<li><code>!==</code> - Not equals</li>
<li><code>&gt;</code> - Greater than</li>
<li><code>&lt;</code> - Less than</li>
<li><code>&gt;=</code> - Greater than or equal</li>
<li><code>&lt;=</code> - Less than or equal</li>
</ul>

<h3>🔗 Combining Conditions</h3>

<pre><code>&& - AND (both must be true)
|| - OR (at least one must be true)</code></pre>

<pre><code>if (age >= 8 && age <= 12) {
  console.log("You're in the kids group!");
}</code></pre>
`,
    exampleCode: `<!DOCTYPE html>
<html>
  <head>
    <title>If/Else Demo</title>
  </head>
  <body>
    <h1>Decision Making</h1>

    <script>
      let score = 85;

      // Simple if/else
      if (score >= 90) {
        console.log("Grade: A - Amazing!");
      } else if (score >= 80) {
        console.log("Grade: B - Great job!");
      } else if (score >= 70) {
        console.log("Grade: C - Good effort!");
      } else {
        console.log("Keep practicing!");
      }

      // Using AND (&&)
      let age = 10;
      let hasTicket = true;

      if (age >= 8 && hasTicket) {
        console.log("Welcome to the ride!");
      } else {
        console.log("Sorry, you can't ride.");
      }
    </script>
  </body>
</html>`,
    exerciseInstructions: "Create a weather checker: if temperature > 30, it's hot; if < 10, it's cold; otherwise it's nice!",
    exerciseStarterCode: `<!DOCTYPE html>
<html>
  <head>
    <title>Weather Checker</title>
  </head>
  <body>
    <h1>Weather Checker</h1>

    <script>
      let temperature = 25;

      // Check if it's hot (above 30)

      // Check if it's cold (below 10)

      // Otherwise, it's nice weather

    </script>
  </body>
</html>`,
    quiz: [
      {
        question: "What does === mean in JavaScript?",
        options: ["Assign a value", "Exactly equals", "Greater than", "Not equals"],
        correctAnswer: "Exactly equals",
        explanation: "=== checks if two values are exactly equal (same value AND same type)!"
      },
      {
        question: "What does && mean?",
        options: ["OR", "AND", "NOT", "EQUALS"],
        correctAnswer: "AND",
        explanation: "&& means AND - both conditions must be true for the whole thing to be true!"
      }
    ]
  },
  {
    title: "JavaScript: DOM Basics",
    content: `
<h2>🎮 Controlling Your Webpage with Code</h2>

<p>The DOM (Document Object Model) lets JavaScript talk to your HTML!</p>

<h3>Selecting Elements</h3>

<pre><code>// By ID (unique)
let element = document.getElementById("myId");

// By class name (multiple)
let elements = document.getElementsByClassName("myClass");

// Modern way (CSS selectors)
let element = document.querySelector("#myId");
let elements = document.querySelectorAll(".myClass");</code></pre>

<h3>✏️ Changing Content</h3>

<pre><code>// Change text
element.textContent = "New text!";

// Change HTML inside
element.innerHTML = "&lt;strong&gt;Bold text!&lt;/strong&gt;";</code></pre>

<h3>🎨 Changing Styles</h3>

<pre><code>element.style.color = "red";
element.style.backgroundColor = "yellow";
element.style.fontSize = "24px";</code></pre>

<h3>💡 Important!</h3>
<p>In CSS we use <code>background-color</code>, but in JavaScript we use <code>backgroundColor</code> (camelCase)!</p>
`,
    exampleCode: `<!DOCTYPE html>
<html>
  <head>
    <title>DOM Demo</title>
  </head>
  <body>
    <h1 id="title">Hello!</h1>
    <p id="message">This text will change.</p>
    <div id="box" style="width: 100px; height: 100px; background-color: blue;"></div>

    <script>
      // Get elements
      let title = document.getElementById("title");
      let message = document.getElementById("message");
      let box = document.getElementById("box");

      // Change the title text
      title.textContent = "DOM is Awesome!";

      // Change the message
      message.innerHTML = "I was changed by <strong>JavaScript</strong>!";

      // Change the box color
      box.style.backgroundColor = "purple";
      box.style.borderRadius = "20px";

      console.log("Changes applied!");
    </script>
  </body>
</html>`,
    exerciseInstructions: "Change the heading color to your favorite color and update the paragraph text!",
    exerciseStarterCode: `<!DOCTYPE html>
<html>
  <head>
    <title>DOM Practice</title>
  </head>
  <body>
    <h1 id="heading">Change My Color!</h1>
    <p id="text">Update this text with JavaScript!</p>

    <script>
      // Get the heading by its ID
      let heading = document.getElementById("heading");

      // Change the heading's color (use heading.style.color)

      // Get the paragraph by its ID
      let text = document.getElementById("text");

      // Change the paragraph's text (use text.textContent)

    </script>
  </body>
</html>`,
    quiz: [
      {
        question: "What does getElementById() do?",
        options: ["Creates a new element", "Finds an element by its ID", "Deletes an element", "Changes an element's color"],
        correctAnswer: "Finds an element by its ID",
        explanation: "getElementById() searches the page and returns the element with that specific ID!"
      },
      {
        question: "How do you change an element's text in JavaScript?",
        options: ["element.text = 'new'", "element.textContent = 'new'", "element.changeText('new')", "text(element, 'new')"],
        correctAnswer: "element.textContent = 'new'",
        explanation: "textContent lets you get or set the text inside an element!"
      }
    ]
  },
  {
    title: "JavaScript: Events",
    content: `
<h2>👆 Making Things Happen on Click!</h2>

<p>Events are things that happen - clicks, key presses, mouse movements!</p>

<h3>Click Events</h3>

<pre><code>// Method 1: onclick attribute
&lt;button onclick="myFunction()"&gt;Click me&lt;/button&gt;

// Method 2: addEventListener (better!)
button.addEventListener("click", function() {
  console.log("Clicked!");
});</code></pre>

<h3>🎯 Common Events</h3>

<ul>
<li><code>click</code> - When something is clicked</li>
<li><code>mouseover</code> - When mouse hovers over</li>
<li><code>mouseout</code> - When mouse leaves</li>
<li><code>keydown</code> - When a key is pressed</li>
<li><code>submit</code> - When a form is submitted</li>
</ul>

<h3>🎮 Creating Interactive Elements</h3>

<pre><code>let button = document.getElementById("btn");

button.addEventListener("click", function() {
  alert("You clicked the button!");
});</code></pre>
`,
    exampleCode: `<!DOCTYPE html>
<html>
  <head>
    <title>Events Demo</title>
    <style>
      .box {
        width: 150px;
        height: 150px;
        background-color: blue;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 18px;
        cursor: pointer;
        transition: all 0.3s;
        border-radius: 10px;
      }
    </style>
  </head>
  <body>
    <h1>Interactive Events!</h1>

    <button id="myButton">Click Me!</button>
    <p id="counter">Clicks: 0</p>

    <div id="colorBox" class="box">Hover over me!</div>

    <script>
      // Click counter
      let button = document.getElementById("myButton");
      let counter = document.getElementById("counter");
      let clicks = 0;

      button.addEventListener("click", function() {
        clicks++;
        counter.textContent = "Clicks: " + clicks;
      });

      // Hover effects
      let box = document.getElementById("colorBox");

      box.addEventListener("mouseover", function() {
        box.style.backgroundColor = "purple";
        box.textContent = "Hello!";
      });

      box.addEventListener("mouseout", function() {
        box.style.backgroundColor = "blue";
        box.textContent = "Hover over me!";
      });
    </script>
  </body>
</html>`,
    exerciseInstructions: "Create a button that changes the background color of the page when clicked!",
    exerciseStarterCode: `<!DOCTYPE html>
<html>
  <head>
    <title>Color Changer</title>
  </head>
  <body id="page">
    <h1>Click the button to change my color!</h1>
    <button id="colorBtn">Change Color</button>

    <script>
      let button = document.getElementById("colorBtn");
      let page = document.getElementById("page");

      // Add a click event listener to the button
      // When clicked, change page.style.backgroundColor

      button.addEventListener("click", function() {
        // Change the background color here

      });
    </script>
  </body>
</html>`,
    quiz: [
      {
        question: "What is an event in JavaScript?",
        options: ["A type of variable", "Something that happens (like a click)", "A CSS style", "An HTML tag"],
        correctAnswer: "Something that happens (like a click)",
        explanation: "Events are actions that occur - clicks, key presses, mouse movements, and more!"
      },
      {
        question: "Which method is best for adding events?",
        options: ["onclick attribute", "addEventListener()", "Both are equally good", "Neither"],
        correctAnswer: "addEventListener()",
        explanation: "addEventListener() is more flexible and lets you add multiple events to one element!"
      }
    ]
  },
  {
    title: "Project: Personal Portfolio Page",
    content: `
<h2>🎉 Your Final Project!</h2>

<p>It's time to put everything together and build your personal portfolio page!</p>

<h3>What to Include</h3>

<ol>
<li><strong>Header</strong> - Your name and a navigation menu</li>
<li><strong>About Section</strong> - Tell visitors about yourself</li>
<li><strong>Skills Section</strong> - List what you've learned</li>
<li><strong>Projects Section</strong> - Show off your work</li>
<li><strong>Contact Form</strong> - Let people reach you</li>
</ol>

<h3>Requirements</h3>

<ul>
<li>✅ Use proper HTML structure (h1, h2, p, etc.)</li>
<li>✅ Add at least one image</li>
<li>✅ Style with CSS (colors, fonts, box model)</li>
<li>✅ Use Flexbox for layout</li>
<li>✅ Add at least one interactive JavaScript feature</li>
</ul>

<h3>💡 Ideas for Interactivity</h3>

<ul>
<li>A dark mode toggle button</li>
<li>A click counter showing visitor interest</li>
<li>Color-changing elements on hover</li>
<li>A "show more" button that reveals hidden content</li>
</ul>

<h3>🏆 Challenge Yourself!</h3>

<p>Make it unique! Add your personality and have fun with it!</p>
`,
    exampleCode: `<!DOCTYPE html>
<html>
  <head>
    <title>My Portfolio</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: Arial, sans-serif; }

      .header {
        background: linear-gradient(to right, purple, pink);
        color: white;
        padding: 40px;
        text-align: center;
      }

      .nav {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-top: 20px;
      }
      .nav a { color: white; text-decoration: none; }

      .section {
        padding: 40px;
        max-width: 800px;
        margin: 0 auto;
      }

      .skills {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
      }
      .skill {
        background: #f0f0f0;
        padding: 10px 20px;
        border-radius: 20px;
      }

      #themeBtn {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 10px 20px;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <button id="themeBtn">🌙 Dark Mode</button>

    <header class="header">
      <h1>Hi, I'm Alex!</h1>
      <p>Future Web Developer</p>
      <nav class="nav">
        <a href="#about">About</a>
        <a href="#skills">Skills</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>

    <section id="about" class="section">
      <h2>About Me</h2>
      <p>I'm learning to code and loving every minute of it!</p>
    </section>

    <section id="skills" class="section">
      <h2>My Skills</h2>
      <div class="skills">
        <span class="skill">HTML</span>
        <span class="skill">CSS</span>
        <span class="skill">JavaScript</span>
        <span class="skill">Flexbox</span>
      </div>
    </section>

    <script>
      let darkMode = false;
      document.getElementById("themeBtn").addEventListener("click", function() {
        darkMode = !darkMode;
        if (darkMode) {
          document.body.style.backgroundColor = "#222";
          document.body.style.color = "#fff";
          this.textContent = "☀️ Light Mode";
        } else {
          document.body.style.backgroundColor = "#fff";
          document.body.style.color = "#000";
          this.textContent = "🌙 Dark Mode";
        }
      });
    </script>
  </body>
</html>`,
    exerciseInstructions: "Build your own portfolio! Include at least: a header with your name, an about section, a skills section, and one interactive JavaScript feature.",
    exerciseStarterCode: `<!DOCTYPE html>
<html>
  <head>
    <title>My Portfolio</title>
    <style>
      /* Add your styles here! */

    </style>
  </head>
  <body>
    <!-- Header with your name -->

    <!-- About section -->

    <!-- Skills section -->

    <!-- Add JavaScript for interactivity -->
    <script>

    </script>
  </body>
</html>`,
    quiz: [
      {
        question: "What's the most important thing in a portfolio?",
        options: ["Lots of colors", "Showing your personality and skills", "Having 100 pages", "Copying other portfolios"],
        correctAnswer: "Showing your personality and skills",
        explanation: "A portfolio should showcase YOUR unique skills and personality!"
      },
      {
        question: "Which technologies did you learn in this course?",
        options: ["Only HTML", "HTML and CSS", "HTML, CSS, and JavaScript", "Python"],
        correctAnswer: "HTML, CSS, and JavaScript",
        explanation: "You learned all three main web technologies: HTML for structure, CSS for style, and JavaScript for interactivity!"
      }
    ]
  }
];

async function main() {
  console.log("🌱 Adding content and quizzes to Web Development lessons...\n");

  // Get the beginner course
  const course = await prisma.course.findFirst({
    where: { slug: "web-development-foundations" },
    include: { lessons: { orderBy: { orderIndex: "asc" } } }
  });

  if (!course) {
    console.log("❌ Course not found!");
    return;
  }

  console.log(`📚 Found course: ${course.title}`);
  console.log(`   📝 ${course.lessons.length} lessons to update\n`);

  for (let i = 0; i < course.lessons.length && i < beginnerLessonContent.length; i++) {
    const lesson = course.lessons[i];
    const content = beginnerLessonContent[i];

    console.log(`   Updating lesson ${i + 1}: ${lesson.title}`);

    // Update lesson with content
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        content: content.content,
        exampleCode: content.exampleCode,
        exerciseInstructions: content.exerciseInstructions,
        exerciseStarterCode: content.exerciseStarterCode,
      }
    });

    // Delete existing quiz if any
    const existingQuiz = await prisma.quiz.findUnique({
      where: { lessonId: lesson.id }
    });

    if (existingQuiz) {
      await prisma.question.deleteMany({
        where: { quizId: existingQuiz.id }
      });
      await prisma.quiz.delete({
        where: { id: existingQuiz.id }
      });
    }

    // Create new quiz with questions
    if (content.quiz && content.quiz.length > 0) {
      const quiz = await prisma.quiz.create({
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
      console.log(`      ✅ Added quiz with ${content.quiz.length} questions`);
    }
  }

  console.log("\n🎉 Content and quizzes added successfully!");
  console.log(`   Total lessons updated: ${Math.min(course.lessons.length, beginnerLessonContent.length)}`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

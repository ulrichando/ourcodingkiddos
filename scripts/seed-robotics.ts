import { PrismaClient, QuestionType } from "@prisma/client";

const prisma = new PrismaClient();

// Robotics Courses - Beginner to Master
const roboticsCourses = [
  {
    title: "Robotics Foundations",
    slug: "robotics-foundations",
    description: "Start your robotics journey! Learn the basics of robots, sensors, motors, and programming concepts through fun virtual simulations and block-based coding.",
    language: "ROBOTICS",
    level: "BEGINNER",
    ageGroup: "AGES_7_10",
    totalXp: 1500,
    estimatedHours: 12,
    lessons: [
      { title: "What is a Robot?", description: "Discover the amazing world of robots and what makes them tick", xp: 100 },
      { title: "Parts of a Robot", description: "Learn about sensors, motors, controllers, and power systems", xp: 100 },
      { title: "Your First Robot Commands", description: "Give instructions to a virtual robot using blocks", xp: 120 },
      { title: "Moving Forward and Backward", description: "Make your robot move in straight lines", xp: 120 },
      { title: "Turning and Rotating", description: "Program precise turns and rotations", xp: 130 },
      { title: "Using Touch Sensors", description: "Make your robot feel obstacles", xp: 130 },
      { title: "Light and Color Sensors", description: "Help your robot see colors and light levels", xp: 140 },
      { title: "Simple Decisions", description: "If this, then do that - teaching robots to choose", xp: 140 },
      { title: "Loops: Repeat Actions", description: "Make your robot do things over and over", xp: 150 },
      { title: "Robot Sounds and Lights", description: "Add personality with beeps and LED displays", xp: 150 },
      { title: "Project: Maze Navigator", description: "Build a robot that escapes a virtual maze!", xp: 170 }
    ]
  },
  {
    title: "Robot Programming with Python",
    slug: "robot-programming-python",
    description: "Level up your robotics skills! Learn to program robots using Python, work with sensors and motors, and build autonomous machines that can think and act.",
    language: "ROBOTICS",
    level: "INTERMEDIATE",
    ageGroup: "AGES_11_14",
    totalXp: 2500,
    estimatedHours: 20,
    lessons: [
      { title: "Python for Robotics Setup", description: "Set up your Python robotics development environment", xp: 150 },
      { title: "Variables and Robot Data", description: "Store sensor readings and robot states", xp: 150 },
      { title: "Motor Control with Code", description: "Precise motor control using Python functions", xp: 170 },
      { title: "Reading Sensor Data", description: "Get real-time data from sensors into your code", xp: 170 },
      { title: "Conditional Logic", description: "Make smart decisions based on sensor input", xp: 180 },
      { title: "Loops and Patterns", description: "Create complex movement patterns", xp: 180 },
      { title: "Functions for Behaviors", description: "Organize robot actions into reusable functions", xp: 190 },
      { title: "Ultrasonic Distance Sensing", description: "Measure distances with sound waves", xp: 190 },
      { title: "Line Following Algorithm", description: "Make robots follow paths on the ground", xp: 200 },
      { title: "Obstacle Avoidance", description: "Navigate around objects autonomously", xp: 200 },
      { title: "PID Control Basics", description: "Introduction to smooth, precise control", xp: 210 },
      { title: "State Machines", description: "Organize complex robot behaviors", xp: 210 },
      { title: "Project: Autonomous Explorer", description: "Build a robot that explores and maps its environment", xp: 300 }
    ]
  },
  {
    title: "Advanced Robotics Systems",
    slug: "advanced-robotics-systems",
    description: "Master advanced robotics concepts! Learn computer vision, path planning, sensor fusion, and build robots that can perceive and interact with the real world.",
    language: "ROBOTICS",
    level: "ADVANCED",
    ageGroup: "AGES_15_18",
    totalXp: 3500,
    estimatedHours: 30,
    lessons: [
      { title: "Advanced Sensor Integration", description: "Combine multiple sensors for better perception", xp: 200 },
      { title: "Introduction to Computer Vision", description: "Teach robots to see with cameras", xp: 220 },
      { title: "Color Detection & Tracking", description: "Find and follow colored objects", xp: 220 },
      { title: "Shape and Pattern Recognition", description: "Identify objects by their shapes", xp: 240 },
      { title: "Face Detection Basics", description: "Help robots recognize human faces", xp: 240 },
      { title: "Coordinate Systems", description: "Understanding 2D and 3D space for robots", xp: 200 },
      { title: "Path Planning Algorithms", description: "A* and other navigation algorithms", xp: 250 },
      { title: "Kinematics: Robot Motion Math", description: "The mathematics of robot movement", xp: 250 },
      { title: "Sensor Fusion Techniques", description: "Combine data from multiple sources", xp: 260 },
      { title: "Wireless Communication", description: "Connect and control robots remotely", xp: 220 },
      { title: "Multi-Robot Coordination", description: "Make robots work together as a team", xp: 260 },
      { title: "Real-World Calibration", description: "Fine-tune sensors for accuracy", xp: 220 },
      { title: "Project: Vision-Guided Robot", description: "Build a robot that uses camera vision to complete tasks", xp: 340 }
    ]
  },
  {
    title: "Robot Operating System (ROS)",
    slug: "robot-operating-system",
    description: "Learn industry-standard robotics! Master ROS (Robot Operating System), build complex robot systems, simulation, and prepare for professional robotics development.",
    language: "ROBOTICS",
    level: "EXPERT",
    ageGroup: "AGES_15_18",
    totalXp: 4500,
    estimatedHours: 40,
    lessons: [
      { title: "Introduction to ROS", description: "Understanding the Robot Operating System ecosystem", xp: 250 },
      { title: "ROS Architecture", description: "Nodes, topics, services, and the ROS graph", xp: 280 },
      { title: "Creating ROS Packages", description: "Structure and build your first ROS package", xp: 280 },
      { title: "Publishers and Subscribers", description: "Message passing between robot components", xp: 300 },
      { title: "ROS Services and Actions", description: "Request-response and long-running tasks", xp: 300 },
      { title: "Robot Description (URDF)", description: "Define your robot's physical structure", xp: 320 },
      { title: "Gazebo Simulation", description: "Test robots in realistic virtual environments", xp: 320 },
      { title: "TF: Coordinate Transforms", description: "Track positions of robot parts in 3D", xp: 300 },
      { title: "Navigation Stack Basics", description: "Autonomous navigation in ROS", xp: 320 },
      { title: "SLAM Introduction", description: "Simultaneous Localization and Mapping", xp: 350 },
      { title: "MoveIt! Motion Planning", description: "Plan complex robot arm movements", xp: 350 },
      { title: "ROS with Computer Vision", description: "Integrate OpenCV with ROS", xp: 300 },
      { title: "Custom Message Types", description: "Create specialized data structures", xp: 280 },
      { title: "Project: ROS Mobile Robot", description: "Build a complete ROS-based autonomous robot", xp: 470 }
    ]
  },
  {
    title: "Professional Robotics Engineering",
    slug: "professional-robotics-engineering",
    description: "Become a robotics engineer! Master AI for robots, machine learning integration, advanced control systems, and build portfolio-worthy robotics projects.",
    language: "ROBOTICS",
    level: "MASTER",
    ageGroup: "AGES_15_18",
    totalXp: 5500,
    estimatedHours: 50,
    lessons: [
      { title: "Robotics Industry Overview", description: "Career paths, companies, and future trends", xp: 280 },
      { title: "Machine Learning for Robots", description: "Train robots to learn from experience", xp: 350 },
      { title: "Reinforcement Learning Basics", description: "Robots that learn by trial and error", xp: 350 },
      { title: "Deep Learning in Robotics", description: "Neural networks for perception and control", xp: 380 },
      { title: "Natural Language for Robots", description: "Voice commands and conversation", xp: 350 },
      { title: "Advanced Control Theory", description: "PID tuning, LQR, and model predictive control", xp: 380 },
      { title: "Robot Manipulation", description: "Grasping, picking, and precise object handling", xp: 380 },
      { title: "Swarm Robotics", description: "Emergent behaviors from simple rules", xp: 320 },
      { title: "Human-Robot Interaction", description: "Design robots that work safely with people", xp: 320 },
      { title: "Edge Computing for Robots", description: "Real-time processing on embedded systems", xp: 350 },
      { title: "Robot Security & Safety", description: "Safe programming practices and standards", xp: 300 },
      { title: "Testing & Quality Assurance", description: "Systematic testing of robot systems", xp: 300 },
      { title: "Documentation & Best Practices", description: "Professional documentation standards", xp: 280 },
      { title: "Building Your Portfolio", description: "Showcase your robotics projects", xp: 300 },
      { title: "Project: AI-Powered Robot", description: "Create an intelligent robot using ML and advanced control", xp: 550 }
    ]
  }
];

// Detailed lesson content for each level
const lessonContentByLevel: Record<string, any[]> = {
  "robotics-foundations": [
    {
      title: "What is a Robot?",
      content: `
<h2>Welcome to the World of Robots!</h2>

<p>Have you ever wondered what makes a robot a robot? Let's find out together!</p>

<h3>What Makes Something a Robot?</h3>

<p>A robot is a machine that can:</p>
<ul>
<li><strong>Sense</strong> - Detect things around it (like light, touch, or distance)</li>
<li><strong>Think</strong> - Process information and make decisions</li>
<li><strong>Act</strong> - Move or do something in the physical world</li>
</ul>

<h3>Robots Are Everywhere!</h3>

<ul>
<li><strong>At Home:</strong> Robot vacuums, smart assistants</li>
<li><strong>In Factories:</strong> Assembly robots, welding arms</li>
<li><strong>In Space:</strong> Mars rovers, satellite repair robots</li>
<li><strong>In Hospitals:</strong> Surgical robots, delivery bots</li>
</ul>

<h3>Fun Fact!</h3>
<p>The word "robot" comes from a Czech play from 1920! It means "forced labor" in Czech.</p>

<h3>The Sense-Think-Act Cycle</h3>
<p>Every robot follows this pattern over and over:</p>
<ol>
<li>SENSE - Read sensors to understand the world</li>
<li>THINK - Decide what to do based on the data</li>
<li>ACT - Move motors or make outputs</li>
</ol>
`,
      exampleCode: `// This is pseudocode showing how a robot thinks!
// Pseudocode is like a plan written in simple English

// SENSE: Read the sensor
distance = readDistanceSensor()

// THINK: Make a decision
if distance < 20 centimeters:
    decision = "turn around"
else:
    decision = "keep going forward"

// ACT: Do the action
if decision == "turn around":
    turnRight(90 degrees)
else:
    moveForward()

// Then repeat forever!`,
      exerciseInstructions: "Look around your home or school. Can you find 3 things that might be considered robots? Write them down and explain what they can sense, think about, and do!",
      exerciseStarterCode: `// My Robot Hunt!
// List 3 robots you found:

// Robot 1: _____________
// - Senses: _____________
// - Thinks about: _____________
// - Does: _____________

// Robot 2: _____________
// - Senses: _____________
// - Thinks about: _____________
// - Does: _____________

// Robot 3: _____________
// - Senses: _____________
// - Thinks about: _____________
// - Does: _____________`,
      quiz: [
        { question: "What are the three things a robot must be able to do?", options: ["Run, jump, fly", "Sense, think, act", "Eat, sleep, work", "Read, write, speak"], correctAnswer: "Sense, think, act", explanation: "All robots follow the Sense-Think-Act cycle to interact with the world!" },
        { question: "Where does the word 'robot' come from?", options: ["A Japanese anime", "A Czech play from 1920", "A NASA scientist", "An ancient Greek word"], correctAnswer: "A Czech play from 1920", explanation: "The word 'robot' was first used in a Czech play called R.U.R. in 1920!" }
      ]
    },
    {
      title: "Parts of a Robot",
      content: `
<h2>What's Inside a Robot?</h2>

<p>Just like your body has different parts for different jobs, robots have special components too!</p>

<h3>The Four Main Parts</h3>

<h4>1. Sensors (The Robot's Senses)</h4>
<ul>
<li><strong>Touch sensors</strong> - Feel when something bumps into them</li>
<li><strong>Light sensors</strong> - See how bright or dark it is</li>
<li><strong>Distance sensors</strong> - Measure how far things are</li>
<li><strong>Color sensors</strong> - Detect different colors</li>
<li><strong>Cameras</strong> - See like eyes!</li>
</ul>

<h4>2. Controllers (The Robot's Brain)</h4>
<p>The controller is like a tiny computer that:</p>
<ul>
<li>Reads information from sensors</li>
<li>Runs the program you write</li>
<li>Tells the motors what to do</li>
</ul>

<h4>3. Motors (The Robot's Muscles)</h4>
<ul>
<li><strong>DC Motors</strong> - Spin wheels and propellers</li>
<li><strong>Servo Motors</strong> - Move to exact positions (like robot arms)</li>
<li><strong>Stepper Motors</strong> - Move in precise tiny steps</li>
</ul>

<h4>4. Power Source (The Robot's Food)</h4>
<ul>
<li>Batteries (like AA, rechargeable packs)</li>
<li>Solar panels</li>
<li>Power cables</li>
</ul>
`,
      exampleCode: `// Let's see how parts work together!

// The CONTROLLER reads a SENSOR
touchSensorValue = touchSensor.read()

// The CONTROLLER makes a decision
if touchSensorValue == "pressed":
    // The CONTROLLER tells the MOTORS to stop
    leftMotor.stop()
    rightMotor.stop()

    // Then back up
    leftMotor.backward(speed=50)
    rightMotor.backward(speed=50)
    wait(1 second)

    // Turn to avoid obstacle
    leftMotor.forward(speed=50)
    rightMotor.backward(speed=50)
    wait(0.5 seconds)

// All of this needs POWER from the battery!`,
      exerciseInstructions: "Match each robot part to its job! Draw lines connecting them.",
      exerciseStarterCode: `// Match the Robot Parts!

// Parts:                    Jobs:
// 1. Touch Sensor      A. Spins wheels to move
// 2. Controller        B. Provides electricity
// 3. DC Motor          C. Feels when bumped
// 4. Battery           D. Runs the program

// Write your answers:
// 1 -> ?
// 2 -> ?
// 3 -> ?
// 4 -> ?`,
      quiz: [
        { question: "What is the 'brain' of a robot called?", options: ["Motor", "Sensor", "Controller", "Battery"], correctAnswer: "Controller", explanation: "The controller is like the robot's brain - it runs your program and makes decisions!" },
        { question: "Which sensor would you use to detect walls?", options: ["Color sensor", "Distance sensor", "Light sensor", "Temperature sensor"], correctAnswer: "Distance sensor", explanation: "Distance sensors (like ultrasonic) measure how far things are, perfect for detecting walls!" }
      ]
    },
    {
      title: "Your First Robot Commands",
      content: `
<h2>Talking to Robots with Code!</h2>

<p>Robots don't understand English - they understand commands! Let's learn how to give robots instructions.</p>

<h3>Programming is Like Giving Directions</h3>

<p>Imagine telling a friend how to walk through a room blindfolded. You'd need to be VERY specific:</p>
<ul>
<li>"Walk forward 5 steps"</li>
<li>"Turn left 90 degrees"</li>
<li>"Walk forward 3 steps"</li>
<li>"Stop!"</li>
</ul>

<p>That's exactly how we tell robots what to do!</p>

<h3>Basic Robot Commands</h3>

<pre><code>
// Movement commands
forward(distance)     // Move forward
backward(distance)    // Move backward
turnLeft(degrees)     // Turn left
turnRight(degrees)    // Turn right
stop()                // Stop all motors

// Speed control
setSpeed(percent)     // 0-100% speed

// Waiting
wait(seconds)         // Pause the program
</code></pre>

<h3>Important Rules</h3>
<ol>
<li>Commands run in ORDER, from top to bottom</li>
<li>Each command must FINISH before the next one starts</li>
<li>Spelling and punctuation must be EXACT</li>
</ol>
`,
      exampleCode: `// My First Robot Program!
// Let's make the robot draw a square

// Start at a corner of the square
setSpeed(50)  // Go at half speed

// Side 1: Go forward
forward(100)  // Move 100 units

// Corner 1: Turn right
turnRight(90)

// Side 2: Go forward
forward(100)

// Corner 2: Turn right
turnRight(90)

// Side 3: Go forward
forward(100)

// Corner 3: Turn right
turnRight(90)

// Side 4: Go forward
forward(100)

// We're back where we started!
stop()`,
      exerciseInstructions: "Write commands to make the robot drive in a triangle shape. Hint: The turns need to be 120 degrees!",
      exerciseStarterCode: `// Draw a Triangle!
// Each side should be 100 units long
// Each turn should be 120 degrees

setSpeed(50)

// Side 1


// Turn 1


// Side 2


// Turn 2


// Side 3


// Turn 3 (back to start)


stop()`,
      quiz: [
        { question: "In what order do robot commands run?", options: ["Random order", "All at once", "Top to bottom", "Bottom to top"], correctAnswer: "Top to bottom", explanation: "Commands run in sequence, from the first line to the last, just like reading a book!" },
        { question: "What command would you use to make a robot pause?", options: ["stop()", "wait(seconds)", "pause()", "sleep()"], correctAnswer: "wait(seconds)", explanation: "wait() pauses the program for a set time. stop() actually stops the motors completely!" }
      ]
    },
    {
      title: "Moving Forward and Backward",
      content: `
<h2>Making Robots Move!</h2>

<p>The most basic thing a robot can do is move! Let's learn how to control movement precisely.</p>

<h3>Distance vs Time Movement</h3>

<p>There are two ways to tell a robot how far to go:</p>

<h4>1. By Distance</h4>
<pre><code>forward(100)  // Move forward 100 units (cm or inches)</code></pre>

<h4>2. By Time</h4>
<pre><code>forward()
wait(2)       // Keep moving for 2 seconds
stop()</code></pre>

<h3>Speed Matters!</h3>

<p>Speed affects how fast AND how far your robot goes:</p>
<ul>
<li><strong>Speed 100</strong> = Full speed ahead!</li>
<li><strong>Speed 50</strong> = Half speed (more control)</li>
<li><strong>Speed 25</strong> = Slow and steady</li>
</ul>

<h3>Pro Tips</h3>
<ul>
<li>Start slow when testing new code</li>
<li>Different surfaces (carpet vs tile) affect movement</li>
<li>Battery level affects speed too!</li>
</ul>
`,
      exampleCode: `// Movement Practice!

// Method 1: Distance-based movement
setSpeed(75)
forward(50)    // Go forward 50 units
stop()
wait(1)

backward(50)   // Return to start
stop()
wait(1)

// Method 2: Time-based movement
setSpeed(40)   // Slower for safety
forward()      // Start moving (no distance = keep going)
wait(3)        // Move for 3 seconds
stop()

wait(1)

backward()     // Start going backward
wait(3)        // Move for 3 seconds
stop()

// Method 3: Variable speed
for speed in [25, 50, 75, 100]:
    setSpeed(speed)
    forward(20)
    // Notice how the same distance feels different!`,
      exerciseInstructions: "Program the robot to move forward 100 units, wait 2 seconds, then come back to the start by going backward 100 units.",
      exerciseStarterCode: `// Back and Forth Challenge

setSpeed(50)

// Step 1: Move forward 100 units


// Step 2: Wait 2 seconds


// Step 3: Move backward 100 units


// Step 4: Stop
stop()`,
      quiz: [
        { question: "What happens if you use forward() without a distance?", options: ["Error", "Nothing", "Robot moves forever until stopped", "Robot moves 1 unit"], correctAnswer: "Robot moves forever until stopped", explanation: "Without a distance, forward() starts the motors and they keep running until you call stop()!" },
        { question: "Which speed setting gives you the most control?", options: ["Speed 100", "Speed 75", "Speed 50", "Speed 25"], correctAnswer: "Speed 25", explanation: "Lower speeds give you more control and precision, while higher speeds are faster but harder to control!" }
      ]
    },
    {
      title: "Turning and Rotating",
      content: `
<h2>Making Turns Like a Pro!</h2>

<p>Moving forward is great, but to really navigate, your robot needs to turn!</p>

<h3>Degrees: Measuring Turns</h3>

<p>Turns are measured in degrees:</p>
<ul>
<li><strong>90 degrees</strong> = Quarter turn (right angle)</li>
<li><strong>180 degrees</strong> = Half turn (face backward)</li>
<li><strong>360 degrees</strong> = Full spin (back where you started)</li>
</ul>

<h3>Types of Turns</h3>

<h4>1. Point Turn (Spin in Place)</h4>
<p>One wheel goes forward, one goes backward. Robot spins without moving forward.</p>

<h4>2. Swing Turn (Pivot)</h4>
<p>One wheel stops, the other moves. Robot swings around the stopped wheel.</p>

<h4>3. Arc Turn (Curve)</h4>
<p>Both wheels move forward, but at different speeds. Robot curves gradually.</p>

<h3>Turn Commands</h3>
<pre><code>turnRight(90)    // Turn right 90 degrees
turnLeft(45)     // Turn left 45 degrees
spinRight(360)   // Spin completely around</code></pre>
`,
      exampleCode: `// Turning Demo!

setSpeed(50)

// Quarter turns (90 degrees)
turnRight(90)    // Now facing right
wait(0.5)
turnLeft(90)     // Back to start direction
wait(0.5)

// Half turn
turnRight(180)   // Now facing opposite direction
wait(0.5)
turnLeft(180)    // Back to start
wait(0.5)

// Fun spin!
spinRight(360)   // Full circle spin!
wait(0.5)

// Draw a star pattern
for i in range(5):
    forward(50)
    turnRight(144)  // 144 degrees = star angle

stop()`,
      exerciseInstructions: "Make the robot turn to face all four directions (North, East, South, West) by making three 90-degree turns to the right.",
      exerciseStarterCode: `// Four Directions Challenge
// Start facing North

setSpeed(40)

// You start facing NORTH
wait(1)

// Turn to face EAST (turn right 90)


wait(1)

// Turn to face SOUTH (turn right 90)


wait(1)

// Turn to face WEST (turn right 90)


wait(1)

// Back to NORTH (turn right 90)


stop()`,
      quiz: [
        { question: "How many degrees is a quarter turn?", options: ["45 degrees", "90 degrees", "180 degrees", "360 degrees"], correctAnswer: "90 degrees", explanation: "A quarter turn (like turning at a corner) is 90 degrees!" },
        { question: "What type of turn makes the robot spin without moving forward?", options: ["Arc turn", "Swing turn", "Point turn", "Curve turn"], correctAnswer: "Point turn", explanation: "In a point turn, one wheel goes forward and one goes backward, making the robot spin in place!" }
      ]
    },
    {
      title: "Using Touch Sensors",
      content: `
<h2>Giving Your Robot Touch!</h2>

<p>Touch sensors let your robot feel the world around it. When something presses the sensor, your robot knows!</p>

<h3>How Touch Sensors Work</h3>

<p>Touch sensors are like buttons:</p>
<ul>
<li><strong>Not pressed</strong> = Returns 0 (or FALSE)</li>
<li><strong>Pressed</strong> = Returns 1 (or TRUE)</li>
</ul>

<h3>Reading Touch Sensors</h3>

<pre><code>// Check if sensor is pressed
isPressed = touchSensor.read()

if isPressed:
    // Something is touching the sensor!
    stop()
else:
    // Nothing touching
    forward()
</code></pre>

<h3>Uses for Touch Sensors</h3>
<ul>
<li>Bump into walls and know to turn</li>
<li>Detect when something is grabbed</li>
<li>Create buttons for user input</li>
<li>Sense if robot is on the ground</li>
</ul>
`,
      exampleCode: `// Bump and Turn Robot!

setSpeed(50)

// Keep running forever
while True:
    // Check the front touch sensor
    if frontTouch.isPressed():
        // We hit something!

        // Step 1: Stop
        stop()

        // Step 2: Back up
        backward(30)

        // Step 3: Turn to avoid
        turnRight(90)

        // Step 4: Continue
        forward()

    else:
        // Nothing in the way, keep moving
        forward()

    // Small delay to prevent overloading
    wait(0.05)`,
      exerciseInstructions: "Program a robot that moves forward until the touch sensor is pressed, then backs up and turns left instead of right.",
      exerciseStarterCode: `// Bump and Turn Left!

setSpeed(50)

while True:
    if frontTouch.isPressed():
        // We hit something!
        // Stop the robot


        // Back up 30 units


        // Turn LEFT 90 degrees (not right!)


    else:
        // Keep moving forward


    wait(0.05)`,
      quiz: [
        { question: "What does a touch sensor return when pressed?", options: ["A number from 0-100", "TRUE or 1", "The word 'pressed'", "A color"], correctAnswer: "TRUE or 1", explanation: "Touch sensors are digital - they return 1 (or TRUE) when pressed, 0 (or FALSE) when not pressed!" },
        { question: "Why do we add a small wait() in the sensor loop?", options: ["To save battery", "To prevent the program from checking too fast", "To make the robot stop", "It's not needed"], correctAnswer: "To prevent the program from checking too fast", explanation: "A small delay prevents the program from overwhelming the controller by checking thousands of times per second!" }
      ]
    },
    {
      title: "Light and Color Sensors",
      content: `
<h2>Teaching Robots to See Light and Color!</h2>

<p>Light and color sensors help robots see the world without cameras!</p>

<h3>Light Sensors</h3>

<p>Light sensors measure brightness:</p>
<ul>
<li><strong>0</strong> = Complete darkness</li>
<li><strong>50</strong> = Medium brightness</li>
<li><strong>100</strong> = Very bright light</li>
</ul>

<h3>Color Sensors</h3>

<p>Color sensors can detect:</p>
<ul>
<li>Red, Green, Blue, Yellow, White, Black</li>
<li>Some can detect any RGB color value!</li>
</ul>

<h3>Common Uses</h3>
<ul>
<li><strong>Line following</strong> - Follow black lines on white surface</li>
<li><strong>Edge detection</strong> - Don't fall off tables!</li>
<li><strong>Sorting</strong> - Sort objects by color</li>
<li><strong>Day/Night sensing</strong> - React to light changes</li>
</ul>
`,
      exampleCode: `// Light-Following Robot!
// Moves toward the brightest light source

setSpeed(40)

while True:
    // Read light level (0-100)
    lightLevel = lightSensor.read()

    // Display the reading
    display.show(lightLevel)

    if lightLevel > 70:
        // Very bright! We found the light!
        stop()
        playSound("celebration")
        wait(2)

    elif lightLevel > 40:
        // Getting brighter, keep going
        forward()

    else:
        // Too dark, search by turning
        turnRight(30)

    wait(0.1)


// Color Detection Example
while True:
    color = colorSensor.detect()

    if color == "red":
        stop()
        display.show("STOP!")

    elif color == "green":
        forward()
        display.show("GO!")

    elif color == "yellow":
        setSpeed(25)
        forward()
        display.show("SLOW")

    wait(0.1)`,
      exerciseInstructions: "Create a program where the robot follows a black line. When on black, go straight. When on white, turn to find the line again.",
      exerciseStarterCode: `// Line Following Robot

setSpeed(35)

while True:
    // Read color (will be "black" or "white")
    color = colorSensor.detect()

    if color == "black":
        // On the line! Go forward


    elif color == "white":
        // Lost the line! Turn to find it


    wait(0.05)`,
      quiz: [
        { question: "What value does a light sensor return in complete darkness?", options: ["100", "50", "0", "-1"], correctAnswer: "0", explanation: "Light sensors typically return 0 for darkness and higher numbers for more light!" },
        { question: "What's a common use for color sensors in robotics?", options: ["Making phone calls", "Line following", "Playing music", "Telling time"], correctAnswer: "Line following", explanation: "Color sensors are perfect for line following - they can detect the difference between a black line and white surface!" }
      ]
    },
    {
      title: "Simple Decisions",
      content: `
<h2>Teaching Robots to Make Choices!</h2>

<p>The most powerful thing about robots is that they can make decisions! This is called <strong>conditional logic</strong>.</p>

<h3>The IF Statement</h3>

<p>IF statements let your robot choose what to do:</p>

<pre><code>if (condition is true):
    // Do this stuff
else:
    // Do this other stuff instead
</code></pre>

<h3>Conditions (Questions to Ask)</h3>

<ul>
<li><code>distance < 30</code> - Is distance less than 30?</li>
<li><code>touchSensor == pressed</code> - Is the sensor pressed?</li>
<li><code>lightLevel > 50</code> - Is it bright?</li>
<li><code>color == "red"</code> - Is the color red?</li>
</ul>

<h3>Combining Conditions</h3>

<pre><code>// AND - Both must be true
if distance < 30 AND touchPressed:
    // Close AND touching!

// OR - Either can be true
if color == "red" OR color == "orange":
    // It's a warm color!
</code></pre>
`,
      exampleCode: `// Smart Decision-Making Robot!

setSpeed(50)

while True:
    // Read all sensors
    distance = ultrasonicSensor.read()
    touchPressed = touchSensor.isPressed()
    lightLevel = lightSensor.read()

    // Make decisions based on sensor data

    // Emergency stop - too close AND touched
    if distance < 10 AND touchPressed:
        stop()
        backward(50)
        playSound("alert")

    // Object detected ahead
    elif distance < 30:
        // Slow down and prepare to turn
        setSpeed(25)
        turnRight(45)

    // Touched something
    elif touchPressed:
        stop()
        backward(20)
        turnLeft(90)

    // It's dark - be cautious
    elif lightLevel < 20:
        setSpeed(30)
        forward()

    // All clear!
    else:
        setSpeed(70)
        forward()

    wait(0.05)`,
      exerciseInstructions: "Create a robot that acts like a traffic light reader: stops on red, slows down on yellow, and goes fast on green.",
      exerciseStarterCode: `// Traffic Light Robot

setSpeed(50)

while True:
    // Read the color in front of us
    color = colorSensor.detect()

    // RED = STOP
    if color == "red":
        // Stop the robot completely


    // YELLOW = SLOW
    elif color == "yellow":
        // Go at slow speed (25)


    // GREEN = GO!
    elif color == "green":
        // Go at full speed (100)


    // Other color = normal speed
    else:
        setSpeed(50)
        forward()

    wait(0.1)`,
      quiz: [
        { question: "What does the 'else' part of an IF statement do?", options: ["Runs always", "Runs if the condition is false", "Runs if the condition is true", "Never runs"], correctAnswer: "Runs if the condition is false", explanation: "The 'else' block runs when the IF condition is NOT true - it's the 'otherwise' option!" },
        { question: "What does 'AND' mean in a condition?", options: ["Either one can be true", "Both must be true", "Neither can be true", "Only one can be true"], correctAnswer: "Both must be true", explanation: "AND means both conditions must be true for the whole thing to be true!" }
      ]
    },
    {
      title: "Loops: Repeat Actions",
      content: `
<h2>Making Robots Repeat!</h2>

<p>Loops let your robot do the same thing over and over. This is super powerful!</p>

<h3>Types of Loops</h3>

<h4>1. Forever Loop</h4>
<pre><code>while True:
    // This runs forever!
    forward()
    checkSensors()
</code></pre>

<h4>2. Count Loop</h4>
<pre><code>for i in range(4):
    // This runs exactly 4 times
    forward(100)
    turnRight(90)
</code></pre>

<h4>3. Conditional Loop</h4>
<pre><code>while distance > 20:
    // Keep going until we're close to something
    forward()
    distance = sensor.read()
</code></pre>

<h3>Why Loops Are Amazing</h3>
<ul>
<li>Draw shapes by repeating sides</li>
<li>Keep checking sensors constantly</li>
<li>Run patrol patterns forever</li>
<li>Repeat until a goal is reached</li>
</ul>
`,
      exampleCode: `// Loop Examples!

// Draw a square (4 sides)
for i in range(4):
    forward(100)
    turnRight(90)

wait(1)

// Draw a hexagon (6 sides)
for i in range(6):
    forward(80)
    turnRight(60)  // 360/6 = 60 degrees

wait(1)

// Spiral pattern
for size in range(10, 100, 10):  // 10, 20, 30... 90
    forward(size)
    turnRight(90)

wait(1)

// Patrol back and forth
while True:
    // Go to end
    forward(200)
    turnRight(180)

    // Go back
    forward(200)
    turnRight(180)

    // This repeats forever!`,
      exerciseInstructions: "Use a loop to make the robot draw a pentagon (5-sided shape). Hint: each turn needs to be 72 degrees (360 ÷ 5 = 72)!",
      exerciseStarterCode: `// Draw a Pentagon with a Loop!

setSpeed(50)

// A pentagon has 5 sides
// Each turn is 360/5 = 72 degrees

for i in range(___):  // How many sides?
    forward(80)
    turnRight(___)    // What angle?

stop()`,
      quiz: [
        { question: "How many times does 'for i in range(5)' run?", options: ["4 times", "5 times", "6 times", "Forever"], correctAnswer: "5 times", explanation: "range(5) gives you 0, 1, 2, 3, 4 - that's exactly 5 iterations!" },
        { question: "What loop runs until you manually stop it?", options: ["for loop", "count loop", "while True loop", "if loop"], correctAnswer: "while True loop", explanation: "while True runs forever because the condition (True) is always true!" }
      ]
    },
    {
      title: "Robot Sounds and Lights",
      content: `
<h2>Giving Your Robot Personality!</h2>

<p>Sounds and lights make robots fun and help them communicate with us!</p>

<h3>Making Sounds</h3>

<pre><code>// Play a beep
playTone(440, 0.5)  // 440 Hz for 0.5 seconds

// Play a melody
playNote("C4", 0.25)
playNote("E4", 0.25)
playNote("G4", 0.5)

// Play a sound file
playSound("celebrate.wav")
</code></pre>

<h3>Controlling LEDs</h3>

<pre><code>// Single LED
led.on()
led.off()
led.blink(rate=2)  // 2 times per second

// RGB LED (colored light)
rgbLed.setColor("red")
rgbLed.setColor(255, 128, 0)  // Orange using RGB
</code></pre>

<h3>Display Screen</h3>

<pre><code>// Show text
display.show("Hello!")

// Show numbers
display.show(distance)

// Show shapes
display.drawFace("happy")
</code></pre>
`,
      exampleCode: `// Expressive Robot!

// Happy startup sound
playNote("C4", 0.2)
playNote("E4", 0.2)
playNote("G4", 0.2)
playNote("C5", 0.4)
rgbLed.setColor("green")
display.drawFace("happy")
wait(1)

// Searching mode
while True:
    distance = ultrasonicSensor.read()

    if distance < 20:
        // Alert! Something close!
        rgbLed.setColor("red")
        playTone(800, 0.1)
        display.drawFace("surprised")
        stop()
        wait(0.5)

        // Back away
        rgbLed.setColor("yellow")
        backward(50)
        display.drawFace("thinking")

    elif distance < 50:
        // Getting close, be careful
        rgbLed.setColor("yellow")
        display.show(distance)
        setSpeed(30)
        forward()

    else:
        // All clear!
        rgbLed.setColor("green")
        display.drawFace("happy")
        setSpeed(60)
        forward()

    wait(0.1)

// Sad shutdown
playNote("G4", 0.3)
playNote("E4", 0.3)
playNote("C4", 0.5)
rgbLed.setColor("blue")
display.drawFace("sad")`,
      exerciseInstructions: "Create a robot that changes LED colors based on distance: green when far (safe), yellow when medium, red when close (danger)!",
      exerciseStarterCode: `// Traffic Light Distance Indicator

while True:
    distance = ultrasonicSensor.read()

    // Far away (more than 50) = GREEN
    if distance > 50:
        rgbLed.setColor("___")

    // Medium distance (20-50) = YELLOW
    elif distance > 20:
        rgbLed.setColor("___")

    // Close (less than 20) = RED
    else:
        rgbLed.setColor("___")

    // Show the actual distance
    display.show(distance)

    wait(0.1)`,
      quiz: [
        { question: "What does playTone(440, 0.5) do?", options: ["Plays a beep at 440Hz for 0.5 seconds", "Plays 440 beeps", "Sets volume to 440", "Plays for 440 seconds"], correctAnswer: "Plays a beep at 440Hz for 0.5 seconds", explanation: "playTone takes a frequency (Hz) and duration (seconds). 440Hz is the note A!" },
        { question: "Why would a robot need sounds and lights?", options: ["Just for fun", "To communicate its status to humans", "They're required by law", "To see in the dark"], correctAnswer: "To communicate its status to humans", explanation: "Sounds and lights help robots communicate what they're doing or feeling to the humans around them!" }
      ]
    },
    {
      title: "Project: Maze Navigator",
      content: `
<h2>Final Project: Escape the Maze!</h2>

<p>Time to put everything together! Build a robot that can navigate through a maze on its own!</p>

<h3>The Challenge</h3>

<p>Your robot must:</p>
<ul>
<li>Start at the maze entrance</li>
<li>Navigate through the maze without hitting walls</li>
<li>Find the exit (marked with a light or color)</li>
<li>Celebrate when it escapes!</li>
</ul>

<h3>Strategy: Right-Hand Rule</h3>

<p>A famous maze-solving trick:</p>
<ol>
<li>Keep your right hand touching the wall</li>
<li>Follow the wall until you find the exit</li>
<li>This works for most mazes!</li>
</ol>

<h3>Robot Algorithm</h3>

<ol>
<li>Check for wall on right - if no wall, turn right</li>
<li>Check for wall ahead - if wall, turn left</li>
<li>Move forward when possible</li>
<li>Repeat until you see the exit light!</li>
</ol>
`,
      exampleCode: `// Maze Navigator Robot!
// Uses the right-hand rule to solve mazes

setSpeed(40)
rgbLed.setColor("blue")
display.show("Starting!")

// Distance thresholds
WALL_CLOSE = 15
WALL_FAR = 40

def checkRight():
    turnRight(90)
    dist = ultrasonicSensor.read()
    turnLeft(90)
    return dist

def checkFront():
    return ultrasonicSensor.read()

def celebrate():
    stop()
    for i in range(3):
        rgbLed.setColor("green")
        playTone(880, 0.2)
        wait(0.2)
        rgbLed.setColor("yellow")
        playTone(1100, 0.2)
        wait(0.2)
    display.show("ESCAPED!")

// Main maze-solving loop
while True:
    // Check for exit (bright light)
    if lightSensor.read() > 80:
        celebrate()
        break  // Exit the loop!

    rightDist = checkRight()
    frontDist = checkFront()

    // Show current readings
    display.show("R:" + str(rightDist) + " F:" + str(frontDist))

    // Right-hand rule logic
    if rightDist > WALL_FAR:
        // No wall on right - turn right and go
        rgbLed.setColor("green")
        turnRight(90)
        forward(30)

    elif frontDist > WALL_CLOSE:
        // Can go forward
        rgbLed.setColor("blue")
        forward(20)

    else:
        // Wall ahead - turn left
        rgbLed.setColor("yellow")
        turnLeft(90)

    wait(0.1)

display.show("Done!")`,
      exerciseInstructions: "Customize the maze navigator! Add sounds when the robot turns, and make it say something different when it finds the exit.",
      exerciseStarterCode: `// Your Custom Maze Navigator!

setSpeed(40)

// Add a startup sound!


WALL_CLOSE = 15
WALL_FAR = 40

while True:
    // Check for exit
    if lightSensor.read() > 80:
        // Add your custom celebration!
        // - Play victory sounds
        // - Flash lights
        // - Show a message

        break

    frontDist = ultrasonicSensor.read()

    if frontDist > WALL_CLOSE:
        forward(20)
    else:
        // Add a sound when turning!

        turnRight(90)

    wait(0.1)`,
      quiz: [
        { question: "What is the 'right-hand rule' for mazes?", options: ["Always turn right", "Keep your right hand on the wall and follow it", "Only use your right hand to code", "Start from the right side"], correctAnswer: "Keep your right hand on the wall and follow it", explanation: "The right-hand rule says to always keep your right hand touching the wall - this guides you through most mazes!" },
        { question: "Why do we use multiple sensors in the maze project?", options: ["One sensor is boring", "Different sensors detect different things", "More sensors are always better", "It's required"], correctAnswer: "Different sensors detect different things", explanation: "We use distance sensors to detect walls and light sensors to find the exit - each sensor has its special purpose!" }
      ]
    }
  ],

  "robot-programming-python": [
    {
      title: "Python for Robotics Setup",
      content: `
<h2>Setting Up Python for Robot Programming!</h2>

<p>Python is one of the most popular languages for programming robots. Let's get set up!</p>

<h3>Why Python for Robots?</h3>

<ul>
<li><strong>Easy to read</strong> - Code looks almost like English</li>
<li><strong>Powerful libraries</strong> - Pre-built tools for robotics</li>
<li><strong>Industry standard</strong> - Used by real robotics companies</li>
<li><strong>Great for learning</strong> - Quick to see results</li>
</ul>

<h3>Common Robot Libraries</h3>

<pre><code># For simulation and learning
import robot_simulator

# For real robots (examples)
import RPi.GPIO as GPIO  # Raspberry Pi
import ev3dev2          # LEGO EV3
import sphero           # Sphero robots
</code></pre>

<h3>Your First Python Robot Program</h3>

<pre><code># Import the robot library
from robot import Robot

# Create a robot object
my_robot = Robot()

# Make it do something!
my_robot.forward(100)
my_robot.turn_right(90)
</code></pre>
`,
      exampleCode: `# Python Robot Setup and First Program!

# Import the robot simulation library
from robot_simulator import Robot, Sensor

# Create our robot
robot = Robot(name="PyBot")

# Add sensors to the robot
robot.add_sensor("front_distance", Sensor.ULTRASONIC, position="front")
robot.add_sensor("touch", Sensor.TOUCH, position="front")
robot.add_sensor("color", Sensor.COLOR, position="bottom")

# Configure motors
robot.set_motor_speed(50)  # 50% speed

# Simple movement test
print("Starting robot test...")

robot.forward(100)
print("Moved forward 100 units")

robot.turn_right(90)
print("Turned right 90 degrees")

robot.forward(50)
print("Moved forward 50 units")

robot.stop()
print("Test complete!")

# Read sensor values
distance = robot.sensors["front_distance"].read()
print(f"Front distance: {distance} cm")

color = robot.sensors["color"].detect()
print(f"Floor color: {color}")`,
      exerciseInstructions: "Create a Python robot that introduces itself! Make it move in a small square while printing messages about what it's doing.",
      exerciseStarterCode: `# My First Python Robot

from robot_simulator import Robot

# Create the robot
robot = Robot(name="___")  # Give it a name!

print("Hello! My name is", robot.name)

# Make a square pattern
for i in range(4):
    print(f"Moving side {i + 1} of 4...")
    robot.forward(___)  # How far?

    print("Turning...")
    robot.turn_right(___)  # What angle?

print("Square complete!")
robot.stop()`,
      quiz: [
        { question: "Why is Python popular for robotics?", options: ["It's the only language robots understand", "Easy to read and has powerful libraries", "It was invented for robots", "It's faster than other languages"], correctAnswer: "Easy to read and has powerful libraries", explanation: "Python's readable syntax and extensive robotics libraries make it perfect for robot programming!" },
        { question: "What does 'import' do in Python?", options: ["Buys something online", "Loads a library we can use", "Prints text", "Creates a robot"], correctAnswer: "Loads a library we can use", explanation: "import brings in external libraries that give us pre-built functions and tools!" }
      ]
    },
    {
      title: "Variables and Robot Data",
      content: `
<h2>Storing Robot Information in Variables!</h2>

<p>Variables are like labeled boxes that store information your robot needs to remember.</p>

<h3>Why Variables Matter</h3>

<ul>
<li>Store sensor readings</li>
<li>Remember positions and states</li>
<li>Keep track of scores or counts</li>
<li>Configure robot settings</li>
</ul>

<h3>Variable Types</h3>

<pre><code># Numbers (integers and decimals)
speed = 50
distance = 23.5
motor_power = 75

# Text (strings)
robot_name = "Explorer"
current_state = "searching"

# True/False (booleans)
is_moving = True
obstacle_detected = False

# Lists (collections)
sensor_readings = [45, 50, 48, 52, 47]
colors_found = ["red", "blue", "green"]
</code></pre>

<h3>Using Variables with Robots</h3>

<pre><code># Store a sensor reading
distance = sensor.read()

# Use it in a decision
if distance < 30:
    robot.stop()

# Update over time
total_distance = 0
total_distance = total_distance + distance
</code></pre>
`,
      exampleCode: `# Variables in Robot Programming!

from robot_simulator import Robot

robot = Robot()

# Configuration variables
MAX_SPEED = 80
SAFE_DISTANCE = 25
TURN_ANGLE = 45

# State tracking variables
is_exploring = True
obstacles_found = 0
total_distance_traveled = 0
directions_tried = []

# Main loop
while is_exploring:
    # Read and store sensor data
    front_distance = robot.sensors["front"].read()
    left_distance = robot.sensors["left"].read()
    right_distance = robot.sensors["right"].read()

    # Calculate average
    avg_distance = (front_distance + left_distance + right_distance) / 3

    print(f"Distances - Front: {front_distance}, Left: {left_distance}, Right: {right_distance}")
    print(f"Average: {avg_distance:.1f}")

    # Make decisions based on variables
    if front_distance < SAFE_DISTANCE:
        obstacles_found += 1  # Add 1 to counter
        print(f"Obstacle #{obstacles_found} found!")

        # Choose direction based on sensor readings
        if right_distance > left_distance:
            robot.turn_right(TURN_ANGLE)
            directions_tried.append("right")
        else:
            robot.turn_left(TURN_ANGLE)
            directions_tried.append("left")
    else:
        # Move forward and track distance
        move_amount = min(front_distance - SAFE_DISTANCE, 50)
        robot.forward(move_amount)
        total_distance_traveled += move_amount

    # Check if we should stop
    if obstacles_found >= 10:
        is_exploring = False
        print("Exploration complete!")

# Report results
print(f"Total distance: {total_distance_traveled}")
print(f"Obstacles found: {obstacles_found}")
print(f"Turn history: {directions_tried}")`,
      exerciseInstructions: "Create variables to track your robot's journey: count how many left and right turns it makes, and print a summary at the end.",
      exerciseStarterCode: `# Turn Counter Robot

from robot_simulator import Robot

robot = Robot()

# Create counter variables
left_turns = ___
right_turns = ___
forward_moves = ___

# Explore for a while
for i in range(20):
    distance = robot.sensors["front"].read()

    if distance < 20:
        # Need to turn - pick randomly
        import random
        if random.choice([True, False]):
            robot.turn_left(90)
            # Add to left turn counter

        else:
            robot.turn_right(90)
            # Add to right turn counter

    else:
        robot.forward(30)
        # Add to forward counter


# Print summary
print("Journey Complete!")
print(f"Left turns: {left_turns}")
print(f"Right turns: {right_turns}")
print(f"Forward moves: {forward_moves}")
print(f"Total moves: {left_turns + right_turns + forward_moves}")`,
      quiz: [
        { question: "What type of variable stores True/False values?", options: ["Integer", "String", "Boolean", "Float"], correctAnswer: "Boolean", explanation: "Booleans store True or False - perfect for robot states like is_moving or obstacle_detected!" },
        { question: "What does obstacles_found += 1 do?", options: ["Sets it to 1", "Adds 1 to the current value", "Multiplies by 1", "Nothing"], correctAnswer: "Adds 1 to the current value", explanation: "+= is a shortcut for 'add to itself'. obstacles_found += 1 is the same as obstacles_found = obstacles_found + 1" }
      ]
    }
  ]
};

// Quiz questions bank
const quizQuestions: Record<string, any[]> = {
  ROBOTICS: [
    { question: "What are the three main things a robot can do?", options: ["Run, jump, fly", "Sense, think, act", "Eat, sleep, work", "Read, write, speak"], answer: "1", explanation: "All robots follow the Sense-Think-Act cycle to interact with the world!" },
    { question: "What type of sensor measures distance?", options: ["Touch sensor", "Ultrasonic sensor", "Color sensor", "Light sensor"], answer: "1", explanation: "Ultrasonic sensors use sound waves to measure how far away objects are!" },
    { question: "What is a servo motor best for?", options: ["Spinning wheels fast", "Moving to exact positions", "Making sounds", "Detecting light"], answer: "1", explanation: "Servo motors can move to precise angles, perfect for robot arms and joints!" },
    { question: "What does PID stand for?", options: ["Power Input Device", "Proportional-Integral-Derivative", "Position Indicator Display", "Program Interface Design"], answer: "1", explanation: "PID is a control algorithm that helps robots move smoothly and accurately!" },
    { question: "What is ROS?", options: ["Robot Operating System", "Real-time Obstacle Sensing", "Robotic Output Signal", "Remote Operation Software"], answer: "0", explanation: "ROS (Robot Operating System) is an industry-standard framework for building robot applications!" }
  ]
};

async function seedRoboticsCourses() {
  console.log("🤖 Seeding Robotics Courses...\n");

  for (const courseData of roboticsCourses) {
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
        orderIndex: roboticsCourses.indexOf(courseData),
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
        const defaultQuestions = quizQuestions.ROBOTICS.slice(i % 5, (i % 5) + 2);
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

  console.log("🎉 Robotics courses seeded successfully!");
  console.log(`   Total courses: ${roboticsCourses.length}`);
  console.log(`   Levels: Beginner → Intermediate → Advanced → Expert → Master`);
}

seedRoboticsCourses()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

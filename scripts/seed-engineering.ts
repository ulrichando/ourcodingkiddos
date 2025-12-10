import { PrismaClient, QuestionType } from "@prisma/client";

const prisma = new PrismaClient();

// Engineering Courses - Beginner to Master
const engineeringCourses = [
  {
    title: "Engineering Explorers: Build & Create",
    slug: "engineering-explorers-build-create",
    description: "Discover the exciting world of engineering! Learn how things are built, solve problems like an engineer, and create your first simple machines and structures.",
    language: "ENGINEERING",
    level: "BEGINNER",
    ageGroup: "AGES_7_10",
    totalXp: 1200,
    estimatedHours: 10,
    lessons: [
      { title: "What is Engineering?", description: "Discover what engineers do and the amazing things they create!", xp: 80 },
      { title: "Types of Engineers", description: "Meet different kinds of engineers - from building bridges to designing rockets!", xp: 80 },
      { title: "The Engineering Design Process", description: "Learn the steps engineers use to solve problems and create solutions", xp: 100 },
      { title: "Simple Machines: Levers", description: "Discover how levers help us lift heavy things with less effort!", xp: 100 },
      { title: "Simple Machines: Wheels & Pulleys", description: "Learn how wheels and pulleys make moving things easier", xp: 110 },
      { title: "Building Strong Structures", description: "Explore what makes buildings and bridges stay standing", xp: 100 },
      { title: "Materials Matter", description: "Discover why engineers choose different materials for different jobs", xp: 110 },
      { title: "Testing & Improving", description: "Learn why engineers test their designs and make them better", xp: 120 },
      { title: "Engineering in Everyday Life", description: "Find engineering all around you - in toys, buildings, and vehicles!", xp: 90 },
      { title: "Project: Design a Bridge", description: "Design and test your own bridge that can hold weight!", xp: 150 }
    ]
  },
  {
    title: "Junior Engineers: Machines & Mechanisms",
    slug: "junior-engineers-machines-mechanisms",
    description: "Dive deeper into mechanical engineering! Learn about gears, motors, energy transfer, and build your own working mechanisms and machines.",
    language: "ENGINEERING",
    level: "INTERMEDIATE",
    ageGroup: "AGES_11_14",
    totalXp: 2000,
    estimatedHours: 18,
    lessons: [
      { title: "Review: Engineering Fundamentals", description: "Refresh your knowledge of the engineering design process", xp: 120 },
      { title: "Forces and Motion", description: "Understand how forces make things move, stop, and change direction", xp: 130 },
      { title: "Gears: Speed and Power", description: "Learn how gears transfer motion and change speed and force", xp: 130 },
      { title: "Energy Transfer", description: "Explore how energy moves from one form to another", xp: 140 },
      { title: "Electric Circuits Basics", description: "Build simple circuits and understand electricity flow", xp: 150 },
      { title: "Motors and Movement", description: "Learn how electric motors work and power machines", xp: 150 },
      { title: "Mechanical Advantage", description: "Calculate how machines multiply force to do work", xp: 140 },
      { title: "Structural Engineering", description: "Design structures that can withstand different forces", xp: 130 },
      { title: "Prototyping and Testing", description: "Build prototypes and test them systematically", xp: 140 },
      { title: "Introduction to CAD", description: "Start designing with computer-aided design tools", xp: 160 },
      { title: "3D Printing Basics", description: "Learn how 3D printers turn designs into real objects", xp: 180 },
      { title: "Project: Motorized Machine", description: "Build a working motorized machine from your own design!", xp: 220 }
    ]
  },
  {
    title: "Engineering Principles & Physics",
    slug: "engineering-principles-physics",
    description: "Master the physics behind engineering! Learn statics, dynamics, thermodynamics, and apply mathematical principles to solve complex engineering problems.",
    language: "ENGINEERING",
    level: "ADVANCED",
    ageGroup: "AGES_15_18",
    totalXp: 3000,
    estimatedHours: 28,
    lessons: [
      { title: "Mathematics for Engineers", description: "Essential math skills every engineer needs", xp: 150 },
      { title: "Statics: Forces in Balance", description: "Analyze structures and forces that don't move", xp: 170 },
      { title: "Dynamics: Forces and Motion", description: "Calculate motion and acceleration of moving objects", xp: 160 },
      { title: "Work, Energy, and Power", description: "Quantify energy transformations in engineering systems", xp: 180 },
      { title: "Thermodynamics Basics", description: "Understand heat, temperature, and energy efficiency", xp: 200 },
      { title: "Fluid Mechanics Introduction", description: "Learn how liquids and gases behave in engineering", xp: 180 },
      { title: "Materials Science", description: "Study material properties and how they affect design", xp: 220 },
      { title: "Stress and Strain", description: "Analyze how materials respond to forces", xp: 220 },
      { title: "Electrical Engineering Fundamentals", description: "Ohm's law, circuits, and electrical systems", xp: 250 },
      { title: "Control Systems Basics", description: "Learn how feedback systems maintain control", xp: 200 },
      { title: "Engineering Drawings & Specifications", description: "Create professional technical drawings", xp: 200 },
      { title: "Computer-Aided Engineering", description: "Use software for engineering analysis", xp: 180 },
      { title: "Sustainability in Engineering", description: "Design with environmental impact in mind", xp: 190 },
      { title: "Project: Engineering Analysis", description: "Complete a full engineering analysis project!", xp: 300 }
    ]
  },
  {
    title: "Applied Engineering: Real-World Projects",
    slug: "applied-engineering-real-world",
    description: "Apply engineering knowledge to real-world challenges! Work on complex projects involving multiple engineering disciplines, from concept to completion.",
    language: "ENGINEERING",
    level: "EXPERT",
    ageGroup: "AGES_15_18",
    totalXp: 4000,
    estimatedHours: 38,
    lessons: [
      { title: "Systems Engineering Approach", description: "Design complex systems with multiple components", xp: 220 },
      { title: "Mechanical Design Project", description: "Design and analyze a mechanical system", xp: 250 },
      { title: "Electronics Integration", description: "Add electronic control to mechanical systems", xp: 230 },
      { title: "Mechatronics: Combining Disciplines", description: "Integrate mechanical, electrical, and software engineering", xp: 280 },
      { title: "Sensor Integration", description: "Use sensors to gather data from the environment", xp: 220 },
      { title: "Actuators and Control", description: "Make systems move and respond automatically", xp: 280 },
      { title: "Embedded Systems Basics", description: "Program microcontrollers for engineering applications", xp: 260 },
      { title: "Data Acquisition", description: "Collect and analyze data from engineering systems", xp: 280 },
      { title: "Simulation and Modeling", description: "Use computer simulation to test designs", xp: 250 },
      { title: "Failure Analysis", description: "Investigate why things break and how to prevent it", xp: 280 },
      { title: "Manufacturing Processes", description: "Understand how products are made at scale", xp: 240 },
      { title: "Quality Control", description: "Ensure products meet specifications consistently", xp: 240 },
      { title: "Project Management for Engineers", description: "Lead engineering projects effectively", xp: 200 },
      { title: "Project: Integrated Engineering System", description: "Build a complete integrated engineering project!", xp: 370 }
    ]
  },
  {
    title: "Engineering Professional: Industry Ready",
    slug: "engineering-professional-industry-ready",
    description: "Become a professional engineer! Master advanced topics, industry standards, professional ethics, and build a portfolio of impressive engineering projects.",
    language: "ENGINEERING",
    level: "MASTER",
    ageGroup: "AGES_15_18",
    totalXp: 5500,
    estimatedHours: 50,
    lessons: [
      { title: "Engineering Career Paths", description: "Explore different engineering careers and specializations", xp: 250 },
      { title: "Professional Engineering Standards", description: "Learn industry standards and certifications", xp: 300 },
      { title: "Advanced CAD/CAM", description: "Master professional design and manufacturing software", xp: 280 },
      { title: "Finite Element Analysis", description: "Use FEA to analyze complex structures", xp: 280 },
      { title: "Computational Fluid Dynamics", description: "Simulate fluid flow in engineering systems", xp: 260 },
      { title: "Advanced Materials", description: "Composites, smart materials, and nanomaterials", xp: 300 },
      { title: "Robotics Engineering", description: "Design and build robotic systems", xp: 280 },
      { title: "Renewable Energy Systems", description: "Engineer sustainable energy solutions", xp: 300 },
      { title: "Biomedical Engineering Basics", description: "Apply engineering to medical challenges", xp: 300 },
      { title: "Aerospace Engineering Concepts", description: "Explore flight and space engineering", xp: 300 },
      { title: "Engineering Ethics", description: "Professional responsibility and ethical decision-making", xp: 320 },
      { title: "Technical Communication", description: "Write reports and present engineering work", xp: 260 },
      { title: "Patent and Intellectual Property", description: "Protect your engineering innovations", xp: 280 },
      { title: "Building Your Engineering Portfolio", description: "Showcase your projects professionally", xp: 280 },
      { title: "Industry Collaboration", description: "Work with teams and stakeholders", xp: 320 },
      { title: "Final Project: Capstone Engineering Design", description: "Complete a comprehensive engineering capstone project!", xp: 500 }
    ]
  }
];

// Detailed lesson content for each level
const lessonContentByLevel: Record<string, any[]> = {
  "engineering-explorers-build-create": [
    {
      title: "What is Engineering?",
      content: `
<h2>Welcome to the World of Engineering!</h2>

<p>Have you ever looked at a tall building, a fast car, or a smartphone and wondered "How was this made?" The answer is: Engineers!</p>

<h3>What Do Engineers Do?</h3>

<p>Engineers are problem solvers who design and build things that help people:</p>
<ul>
<li>🏗️ <strong>Build structures:</strong> Buildings, bridges, roads</li>
<li>🚗 <strong>Create vehicles:</strong> Cars, planes, rockets</li>
<li>💡 <strong>Invent gadgets:</strong> Phones, computers, games</li>
<li>🌊 <strong>Help the planet:</strong> Clean water, solar panels</li>
</ul>

<h3>The Engineer's Superpower</h3>

<p>Engineers turn ideas into reality! They use:</p>
<ul>
<li><strong>Science:</strong> Understanding how things work</li>
<li><strong>Math:</strong> Calculating and measuring</li>
<li><strong>Creativity:</strong> Imagining new solutions</li>
<li><strong>Building:</strong> Making things with their hands</li>
</ul>

<h3>Engineers vs. Scientists</h3>

<p>Scientists discover HOW things work. Engineers use that knowledge to BUILD things!</p>
<ul>
<li>Scientist: "I discovered how birds fly!"</li>
<li>Engineer: "I'll use that to build an airplane!"</li>
</ul>

<h3>Fun Fact!</h3>
<p>The word "engineer" comes from the Latin word meaning "clever" or "inventive"!</p>
`,
      exampleCode: `# The Engineering Mindset!

# Engineers follow a process:
engineering_steps = [
    "1. Find a problem to solve",
    "2. Brainstorm ideas",
    "3. Design a solution",
    "4. Build a prototype",
    "5. Test it out",
    "6. Improve and repeat!"
]

for step in engineering_steps:
    print(step)

# Example: Building a better paper airplane
problem = "Paper airplane doesn't fly far"

solutions = [
    "Change the wing shape",
    "Use heavier paper",
    "Add a paper clip for weight",
    "Fold wings differently"
]

print("\\nProblem:", problem)
print("Possible solutions:")
for solution in solutions:
    print(f"  - {solution}")

print("\\nThat's thinking like an engineer!")`,
      exerciseInstructions: "Think about 3 problems you have at home or school. How would an engineer solve them?",
      exerciseStarterCode: `# My Engineering Challenges!

# Problem 1: _______________
# My engineering solution: _______________

# Problem 2: _______________
# My engineering solution: _______________

# Problem 3: _______________
# My engineering solution: _______________

# What tools or materials would I need?
tools_needed = [
    "_______________",
    "_______________",
    "_______________",
]`,
      quiz: [
        { question: "What do engineers do?", options: ["Only build buildings", "Design and build solutions to problems", "Only use computers", "Only do math"], correctAnswer: "Design and build solutions to problems", explanation: "Engineers are problem solvers who design and build things that help people in all areas of life!" },
        { question: "What's the difference between scientists and engineers?", options: ["They're the same", "Scientists discover, engineers build", "Engineers discover, scientists build", "Neither builds anything"], correctAnswer: "Scientists discover, engineers build", explanation: "Scientists discover how things work, and engineers use that knowledge to build useful things!" }
      ]
    },
    {
      title: "Types of Engineers",
      content: `
<h2>Meet the Engineering Team!</h2>

<p>There are SO many types of engineers! Each one specializes in solving different problems.</p>

<h3>Civil Engineers</h3>
<p>They design and build:</p>
<ul>
<li>🌉 Bridges</li>
<li>🏢 Buildings</li>
<li>🛣️ Roads and highways</li>
<li>🚰 Water systems</li>
</ul>

<h3>Mechanical Engineers</h3>
<p>They create machines and moving parts:</p>
<ul>
<li>🚗 Cars and engines</li>
<li>❄️ Air conditioners</li>
<li>🤖 Robots</li>
<li>✈️ Airplane parts</li>
</ul>

<h3>Electrical Engineers</h3>
<p>They work with electricity and electronics:</p>
<ul>
<li>💡 Power systems</li>
<li>📱 Smartphones</li>
<li>🎮 Video game consoles</li>
<li>⚡ Electric vehicles</li>
</ul>

<h3>Software Engineers</h3>
<p>They create computer programs:</p>
<ul>
<li>📲 Apps</li>
<li>🎮 Video games</li>
<li>🌐 Websites</li>
<li>🤖 AI systems</li>
</ul>

<h3>And Many More!</h3>
<ul>
<li><strong>Aerospace:</strong> Rockets and spacecraft</li>
<li><strong>Biomedical:</strong> Medical devices</li>
<li><strong>Environmental:</strong> Protecting nature</li>
<li><strong>Chemical:</strong> Creating new materials</li>
</ul>
`,
      exampleCode: `# Types of Engineers and What They Build!

engineers = {
    "Civil Engineer": {
        "builds": ["bridges", "buildings", "roads", "dams"],
        "tools": ["blueprints", "concrete", "steel beams"]
    },
    "Mechanical Engineer": {
        "builds": ["engines", "robots", "machines", "HVAC systems"],
        "tools": ["CAD software", "3D printers", "wrenches"]
    },
    "Electrical Engineer": {
        "builds": ["circuits", "power grids", "electronics", "motors"],
        "tools": ["oscilloscopes", "soldering irons", "multimeters"]
    },
    "Software Engineer": {
        "builds": ["apps", "websites", "games", "AI"],
        "tools": ["code editors", "programming languages", "computers"]
    },
    "Aerospace Engineer": {
        "builds": ["airplanes", "rockets", "satellites", "drones"],
        "tools": ["wind tunnels", "simulators", "composites"]
    }
}

print("=== Engineering Specialties ===\\n")
for engineer_type, info in engineers.items():
    print(f"🔧 {engineer_type}")
    print(f"   Builds: {', '.join(info['builds'])}")
    print(f"   Uses: {', '.join(info['tools'])}")
    print()

# Which type interests YOU?
print("All engineers solve problems and make the world better!")`,
      exerciseInstructions: "Which type of engineer would you want to be? Design something they might build!",
      exerciseStarterCode: `# My Dream Engineering Project!

# I want to be a: _______________ Engineer

# I would design: _______________

# My design would help people by: _______________

# Materials I would need:
materials = [
    "_______________",
    "_______________",
    "_______________",
]

# Steps to build it:
steps = [
    "1. _______________",
    "2. _______________",
    "3. _______________",
    "4. _______________",
]

# Draw your design idea below (describe it):
design_description = """
_______________________________________________
_______________________________________________
_______________________________________________
"""`,
      quiz: [
        { question: "What do civil engineers build?", options: ["Only houses", "Bridges, buildings, and roads", "Only computers", "Only robots"], correctAnswer: "Bridges, buildings, and roads", explanation: "Civil engineers design and build infrastructure like bridges, buildings, roads, and water systems!" },
        { question: "Which engineer would design a smartphone?", options: ["Civil engineer", "Electrical engineer", "Only mechanical engineer", "Environmental engineer"], correctAnswer: "Electrical engineer", explanation: "Electrical engineers work with electronics and create devices like smartphones, though they often work with other engineers too!" }
      ]
    },
    {
      title: "The Engineering Design Process",
      content: `
<h2>How Engineers Solve Problems!</h2>

<p>Engineers don't just start building. They follow a special process to create the best solutions!</p>

<h3>The Engineering Design Process</h3>

<ol>
<li><strong>ASK:</strong> What is the problem? Who has it?</li>
<li><strong>IMAGINE:</strong> Brainstorm lots of ideas!</li>
<li><strong>PLAN:</strong> Choose the best idea and design it</li>
<li><strong>CREATE:</strong> Build a prototype (test version)</li>
<li><strong>TEST:</strong> Does it work? What could be better?</li>
<li><strong>IMPROVE:</strong> Make it better and try again!</li>
</ol>

<h3>It's a Cycle!</h3>

<p>Engineers often go through this process many times. Each time makes their design better!</p>

<h3>Example: Designing a Paper Airplane</h3>

<ul>
<li><strong>ASK:</strong> How can I make a paper airplane that flies far?</li>
<li><strong>IMAGINE:</strong> Wide wings? Pointed nose? Heavy? Light?</li>
<li><strong>PLAN:</strong> Draw my design with pointy nose and wide wings</li>
<li><strong>CREATE:</strong> Fold the paper airplane</li>
<li><strong>TEST:</strong> Throw it! It only went 10 feet...</li>
<li><strong>IMPROVE:</strong> Try smaller wings, add a paper clip. Now 20 feet!</li>
</ul>

<h3>Failure is Part of Success!</h3>

<p>The best engineers learn from mistakes. Every "failure" teaches something new!</p>
`,
      exampleCode: `# The Engineering Design Process in Action!

class EngineeringProject:
    def __init__(self, problem):
        self.problem = problem
        self.ideas = []
        self.chosen_design = None
        self.test_results = []
        self.version = 1

    def ask(self):
        print(f"🔍 ASK: What's the problem?")
        print(f"   Problem: {self.problem}")
        return self

    def imagine(self, ideas):
        print(f"💡 IMAGINE: Brainstorming ideas...")
        self.ideas = ideas
        for idea in ideas:
            print(f"   - {idea}")
        return self

    def plan(self, chosen):
        print(f"📝 PLAN: Choosing best idea...")
        self.chosen_design = chosen
        print(f"   Selected: {chosen}")
        return self

    def create(self):
        print(f"🔨 CREATE: Building version {self.version}...")
        print(f"   Building: {self.chosen_design}")
        return self

    def test(self, result):
        print(f"🧪 TEST: Testing the design...")
        self.test_results.append(result)
        print(f"   Result: {result}")
        return self

    def improve(self, improvement):
        print(f"🔄 IMPROVE: Making it better...")
        print(f"   Improvement: {improvement}")
        self.version += 1
        self.chosen_design = f"{self.chosen_design} + {improvement}"
        return self

# Let's use it!
project = EngineeringProject("Need a cup holder for my bike")

project.ask()
project.imagine([
    "Attach a basket",
    "Design a clip-on holder",
    "Modify existing holder"
])
project.plan("Design a clip-on holder")
project.create()
project.test("Cup fell out on bumps!")
project.improve("Add a grip ring to hold cup tight")
project.create()
project.test("Cup stays in place! Success!")

print("\\n✅ Engineering process complete!")`,
      exerciseInstructions: "Use the engineering design process to solve a problem you have!",
      exerciseStarterCode: `# My Engineering Design Process

# Step 1: ASK - What's my problem?
my_problem = "_______________________________________________"

# Step 2: IMAGINE - What are some possible solutions?
my_ideas = [
    "Idea 1: _______________",
    "Idea 2: _______________",
    "Idea 3: _______________",
]

# Step 3: PLAN - Which idea will I try first?
chosen_idea = "_______________"
why_i_chose_it = "_______________"

# Step 4: CREATE - What materials do I need?
materials = ["___", "___", "___"]

# Step 5: TEST - How will I know if it works?
success_looks_like = "_______________"

# Step 6: IMPROVE - What might I change?
possible_improvements = [
    "_______________",
    "_______________",
]`,
      quiz: [
        { question: "What's the first step in the engineering design process?", options: ["Build something", "Ask what the problem is", "Test it", "Improve it"], correctAnswer: "Ask what the problem is", explanation: "Engineers first need to understand the problem before they can start solving it!" },
        { question: "Why do engineers test and improve their designs?", options: ["For fun", "To make designs work better", "They're bored", "It's not important"], correctAnswer: "To make designs work better", explanation: "Testing shows what works and what doesn't, helping engineers improve their designs!" }
      ]
    },
    {
      title: "Simple Machines: Levers",
      content: `
<h2>Levers: The First Simple Machine!</h2>

<p>Levers are one of the oldest and most useful tools ever invented. They help us lift heavy things with less effort!</p>

<h3>What is a Lever?</h3>

<p>A lever has three parts:</p>
<ul>
<li>🪨 <strong>Load:</strong> The heavy thing you want to move</li>
<li>💪 <strong>Effort:</strong> The force you apply (your push or pull)</li>
<li>⚫ <strong>Fulcrum:</strong> The pivot point where the lever rotates</li>
</ul>

<h3>How Levers Help</h3>

<p>By moving the fulcrum closer to the load, you need LESS effort to lift HEAVY things!</p>

<h3>Types of Levers</h3>

<h4>First Class Lever</h4>
<p>Fulcrum in the middle - like a seesaw!</p>
<ul>
<li>Examples: Scissors, crowbar, balance scale</li>
</ul>

<h4>Second Class Lever</h4>
<p>Load in the middle - like a wheelbarrow!</p>
<ul>
<li>Examples: Wheelbarrow, nutcracker, door</li>
</ul>

<h4>Third Class Lever</h4>
<p>Effort in the middle - like your arm!</p>
<ul>
<li>Examples: Fishing rod, tweezers, baseball bat</li>
</ul>

<h3>Fun Fact!</h3>
<p>Archimedes said "Give me a lever long enough and I could move the world!"</p>
`,
      exampleCode: `# Understanding Levers!

# The three parts of a lever
lever_parts = {
    "fulcrum": "The pivot point - where the lever balances",
    "load": "The thing you want to lift or move",
    "effort": "The force you apply to the lever"
}

# Types of levers
lever_types = {
    "First Class": {
        "arrangement": "Fulcrum in the MIDDLE",
        "examples": ["seesaw", "scissors", "crowbar", "balance scale"],
        "visual": "EFFORT ←→ [FULCRUM] ←→ LOAD"
    },
    "Second Class": {
        "arrangement": "Load in the MIDDLE",
        "examples": ["wheelbarrow", "nutcracker", "door", "bottle opener"],
        "visual": "[FULCRUM] ←→ LOAD ←→ EFFORT"
    },
    "Third Class": {
        "arrangement": "Effort in the MIDDLE",
        "examples": ["fishing rod", "tweezers", "arm", "baseball bat"],
        "visual": "[FULCRUM] ←→ EFFORT ←→ LOAD"
    }
}

for lever_type, info in lever_types.items():
    print(f"\\n{lever_type} Lever:")
    print(f"  {info['arrangement']}")
    print(f"  {info['visual']}")
    print(f"  Examples: {', '.join(info['examples'])}")

# Mechanical Advantage calculation
def lever_advantage(effort_distance, load_distance):
    """The farther from fulcrum you push, the easier it is!"""
    advantage = effort_distance / load_distance
    return advantage

# Example: Using a 3-foot crowbar
effort_dist = 2.5  # feet from fulcrum
load_dist = 0.5    # feet from fulcrum
ma = lever_advantage(effort_dist, load_dist)
print(f"\\nMechanical Advantage: {ma}x")
print(f"You can lift {ma} times more weight!")`,
      exerciseInstructions: "Find examples of all three types of levers in your home or school!",
      exerciseStarterCode: `# Lever Scavenger Hunt!

# First Class Levers (fulcrum in middle):
first_class_examples = [
    "_______________",
    "_______________",
    "_______________",
]

# Second Class Levers (load in middle):
second_class_examples = [
    "_______________",
    "_______________",
    "_______________",
]

# Third Class Levers (effort in middle):
third_class_examples = [
    "_______________",
    "_______________",
    "_______________",
]

# Which lever type is most common in your house?
most_common = "_______________"

# Why do you think that type is so common?
reason = "_______________"`,
      quiz: [
        { question: "What are the three parts of a lever?", options: ["Top, middle, bottom", "Fulcrum, load, effort", "Push, pull, twist", "Wood, metal, plastic"], correctAnswer: "Fulcrum, load, effort", explanation: "Every lever has a fulcrum (pivot point), load (what you're moving), and effort (the force you apply)!" },
        { question: "What type of lever is a seesaw?", options: ["First class", "Second class", "Third class", "Fourth class"], correctAnswer: "First class", explanation: "A seesaw is a first class lever - the fulcrum is in the middle, with effort on one side and load on the other!" }
      ]
    },
    {
      title: "Simple Machines: Wheels & Pulleys",
      content: `
<h2>Wheels and Pulleys: Rolling and Lifting!</h2>

<p>Wheels and pulleys are simple machines that make moving things much easier!</p>

<h3>The Wheel and Axle</h3>

<p>A wheel attached to a rod (axle) that turns together:</p>
<ul>
<li>🚗 Car wheels</li>
<li>🚲 Bicycle wheels</li>
<li>🚪 Door knobs</li>
<li>🔩 Screwdrivers</li>
</ul>

<h3>How Wheels Help</h3>
<ul>
<li>Reduce friction (sliding → rolling)</li>
<li>Small turn on axle = big turn on wheel</li>
<li>Carry heavy loads more easily</li>
</ul>

<h3>Pulleys</h3>

<p>A wheel with a rope around it that helps lift things!</p>

<h4>Fixed Pulley</h4>
<p>Attached to one spot - changes direction of force</p>
<ul>
<li>Pull DOWN to lift UP</li>
<li>Examples: Flagpole, window blinds</li>
</ul>

<h4>Movable Pulley</h4>
<p>Moves with the load - reduces effort needed</p>
<ul>
<li>Uses less force to lift</li>
<li>Examples: Cranes, rock climbing gear</li>
</ul>

<h4>Combined (Block and Tackle)</h4>
<p>Multiple pulleys together - super strong!</p>
<ul>
<li>Each pulley reduces effort more</li>
<li>Examples: Sailboat rigging, heavy cranes</li>
</ul>
`,
      exampleCode: `# Wheels and Pulleys in Action!

# Wheel and Axle examples
wheel_axle = {
    "car_wheel": {
        "wheel_size": "large",
        "axle_size": "small",
        "purpose": "Move vehicle with less friction"
    },
    "doorknob": {
        "wheel_size": "small (the knob)",
        "axle_size": "tiny (the shaft)",
        "purpose": "Turn a small knob to move a bigger latch"
    },
    "steering_wheel": {
        "wheel_size": "large",
        "axle_size": "small",
        "purpose": "Big turn = precise control"
    }
}

# Types of pulleys
pulleys = {
    "fixed": {
        "description": "Attached in one place",
        "advantage": "Changes direction of force",
        "mechanical_advantage": 1,
        "example": "Flagpole - pull down, flag goes up!"
    },
    "movable": {
        "description": "Moves with the load",
        "advantage": "Reduces effort needed by half!",
        "mechanical_advantage": 2,
        "example": "Some window blinds"
    },
    "combined": {
        "description": "Multiple pulleys together",
        "advantage": "Each pulley multiplies advantage!",
        "mechanical_advantage": "2 or more",
        "example": "Heavy construction cranes"
    }
}

# Calculate pulley advantage
def pulley_system(num_pulleys, load_weight):
    """More pulleys = less effort needed!"""
    effort_needed = load_weight / num_pulleys
    print(f"Load: {load_weight} lbs")
    print(f"Pulleys: {num_pulleys}")
    print(f"Effort needed: {effort_needed} lbs")
    return effort_needed

print("Lifting a 100 lb weight:")
pulley_system(1, 100)  # Fixed pulley
print()
pulley_system(2, 100)  # With 2 pulleys
print()
pulley_system(4, 100)  # With 4 pulleys!`,
      exerciseInstructions: "Design a pulley system to lift something heavy! How many pulleys would you use?",
      exerciseStarterCode: `# My Pulley Design Challenge!

# What do you want to lift?
item_to_lift = "_______________"
estimated_weight = ___ # pounds

# How many pulleys will you use?
num_pulleys = ___

# Calculate the effort you'll need:
effort_needed = estimated_weight / num_pulleys
print(f"To lift {estimated_weight} lbs, I need {effort_needed} lbs of force!")

# Where would you attach your pulley system?
attachment_point = "_______________"

# Draw your pulley system (describe it):
pulley_design = """
_______________________________________________
_______________________________________________
_______________________________________________
"""

# Find 3 examples of wheels/pulleys in your daily life:
wheel_examples = [
    "_______________",
    "_______________",
    "_______________",
]`,
      quiz: [
        { question: "What does a wheel attached to an axle do?", options: ["Makes things heavier", "Reduces friction and makes moving easier", "Stops things from moving", "Nothing special"], correctAnswer: "Reduces friction and makes moving easier", explanation: "Rolling creates less friction than sliding, so wheels make it much easier to move heavy things!" },
        { question: "How does a fixed pulley help you?", options: ["Makes things lighter", "Changes the direction of force", "Disappears", "Spins forever"], correctAnswer: "Changes the direction of force", explanation: "A fixed pulley lets you pull DOWN to lift something UP - much easier than lifting directly!" }
      ]
    },
    {
      title: "Building Strong Structures",
      content: `
<h2>Why Do Some Buildings Stand Tall?</h2>

<p>Engineers know the secrets of making structures that don't fall down!</p>

<h3>Forces on Structures</h3>

<ul>
<li>⬇️ <strong>Compression:</strong> Pushing/squishing force</li>
<li>⬆️ <strong>Tension:</strong> Pulling/stretching force</li>
<li>↔️ <strong>Shear:</strong> Sliding force</li>
<li>🔄 <strong>Torsion:</strong> Twisting force</li>
</ul>

<h3>Strong Shapes</h3>

<h4>Triangles are the STRONGEST!</h4>
<p>Triangles can't be pushed out of shape without breaking. That's why bridges use them!</p>

<h4>Arches are Amazing!</h4>
<p>Arches turn pushing forces into compression along the curve. Ancient Romans built arches that still stand today!</p>

<h4>Domes Distribute Weight!</h4>
<p>Like a 3D arch, domes spread weight evenly in all directions.</p>

<h3>The Importance of a Strong Base</h3>

<p>Wide bases make things stable. That's why pyramids don't tip over!</p>

<h3>Real Engineering Examples</h3>
<ul>
<li>🗼 Eiffel Tower: Made of triangles!</li>
<li>🌁 Golden Gate Bridge: Suspension cables + towers</li>
<li>🏛️ Pantheon: Ancient dome still standing!</li>
</ul>
`,
      exampleCode: `# Building Strong Structures!

# The strongest shapes in engineering
strong_shapes = {
    "triangle": {
        "strength": "STRONGEST",
        "why": "Cannot be pushed out of shape without breaking",
        "used_in": ["bridges", "towers", "cranes", "roof trusses"],
        "famous_example": "Eiffel Tower - 18,038 iron pieces forming triangles!"
    },
    "arch": {
        "strength": "Very Strong",
        "why": "Transfers force along the curve to the supports",
        "used_in": ["bridges", "doorways", "tunnels", "domes"],
        "famous_example": "Roman aqueducts - still standing after 2000 years!"
    },
    "dome": {
        "strength": "Very Strong",
        "why": "Distributes weight evenly in all directions",
        "used_in": ["stadiums", "churches", "planetariums"],
        "famous_example": "Pantheon in Rome - concrete dome from 125 AD!"
    },
    "box/rectangle": {
        "strength": "Weak alone",
        "why": "Can be pushed into a parallelogram shape",
        "solution": "Add diagonal bracing (makes triangles!)",
        "used_in": ["buildings with cross-bracing"]
    }
}

# Stability depends on base width
def check_stability(height, base_width):
    ratio = height / base_width
    if ratio < 2:
        return "Very Stable! 🏔️"
    elif ratio < 4:
        return "Stable 👍"
    elif ratio < 6:
        return "Needs support 🤔"
    else:
        return "Danger! Will tip over! ⚠️"

# Test different structures
print("Pyramid (height 450ft, base 750ft):")
print(check_stability(450, 750))

print("\\nSkyscraper (height 1000ft, base 200ft):")
print(check_stability(1000, 200))

print("\\nEiffel Tower (height 1000ft, base 410ft):")
print(check_stability(1000, 410))`,
      exerciseInstructions: "Design a structure using triangles! Draw it and explain why it's strong.",
      exerciseStarterCode: `# My Strong Structure Design!

# What am I building?
structure_name = "_______________"
purpose = "_______________"

# Dimensions:
height = ___ # feet
base_width = ___ # feet

# Check stability:
stability_ratio = height / base_width
print(f"Stability ratio: {stability_ratio}")

# How many triangles are in my design?
num_triangles = ___

# What materials would I use?
materials = [
    "_______________",
    "_______________",
]

# Where are the triangles in my design?
triangle_locations = """
_______________________________________________
_______________________________________________
"""

# What forces does my structure need to resist?
forces = [
    "gravity (weight)",
    "_______________",
    "_______________",
]

# Draw your structure (describe it):
design_description = """
_______________________________________________
_______________________________________________
_______________________________________________
"""`,
      quiz: [
        { question: "What is the strongest shape in engineering?", options: ["Circle", "Square", "Triangle", "Rectangle"], correctAnswer: "Triangle", explanation: "Triangles can't be pushed into a different shape without breaking a side - that's why bridges use lots of triangles!" },
        { question: "Why are arches so strong?", options: ["They're made of special material", "They transfer force along the curve", "They're magic", "They're hollow"], correctAnswer: "They transfer force along the curve", explanation: "Arches turn pushing (compression) forces into forces that travel along the curve to the supports at each end!" }
      ]
    },
    {
      title: "Materials Matter",
      content: `
<h2>Choosing the Right Material!</h2>

<p>Engineers pick materials carefully based on what the project needs!</p>

<h3>Material Properties</h3>

<ul>
<li>💪 <strong>Strength:</strong> How much force it can handle</li>
<li>⚖️ <strong>Weight:</strong> How heavy it is</li>
<li>🔄 <strong>Flexibility:</strong> Can it bend without breaking?</li>
<li>🌡️ <strong>Heat resistance:</strong> Does it melt or burn?</li>
<li>💧 <strong>Water resistance:</strong> Does it rust or rot?</li>
<li>💰 <strong>Cost:</strong> Is it affordable?</li>
</ul>

<h3>Common Engineering Materials</h3>

<h4>🪨 Metals</h4>
<ul>
<li><strong>Steel:</strong> Very strong, used for buildings and cars</li>
<li><strong>Aluminum:</strong> Light and strong, used for planes</li>
<li><strong>Copper:</strong> Conducts electricity, used for wires</li>
</ul>

<h4>🧱 Concrete</h4>
<ul>
<li>Great for compression (squishing)</li>
<li>Add steel bars (rebar) for tension strength</li>
<li>Used in buildings, bridges, dams</li>
</ul>

<h4>🌲 Wood</h4>
<ul>
<li>Light, renewable, easy to work with</li>
<li>Used for houses and furniture</li>
</ul>

<h4>🧪 Plastics</h4>
<ul>
<li>Lightweight, moldable, waterproof</li>
<li>Used for toys, containers, car parts</li>
</ul>

<h4>🕸️ Composites</h4>
<ul>
<li>Combine materials for best properties</li>
<li>Carbon fiber: Light but super strong!</li>
</ul>
`,
      exampleCode: `# Materials and Their Properties!

materials = {
    "steel": {
        "strength": 10,
        "weight": 8,
        "cost": 5,
        "water_resistant": 3,
        "best_for": ["buildings", "bridges", "cars", "tools"],
        "weakness": "Can rust if not protected"
    },
    "aluminum": {
        "strength": 6,
        "weight": 3,
        "cost": 6,
        "water_resistant": 8,
        "best_for": ["airplanes", "bikes", "cans", "electronics"],
        "weakness": "Not as strong as steel"
    },
    "wood": {
        "strength": 4,
        "weight": 3,
        "cost": 3,
        "water_resistant": 2,
        "best_for": ["houses", "furniture", "small bridges"],
        "weakness": "Can rot, burns easily"
    },
    "concrete": {
        "strength": 9,
        "weight": 10,
        "cost": 2,
        "water_resistant": 7,
        "best_for": ["foundations", "dams", "roads"],
        "weakness": "Heavy, weak in tension"
    },
    "plastic": {
        "strength": 3,
        "weight": 1,
        "cost": 2,
        "water_resistant": 10,
        "best_for": ["containers", "toys", "phone cases"],
        "weakness": "Can melt, not very strong"
    },
    "carbon_fiber": {
        "strength": 10,
        "weight": 2,
        "cost": 10,
        "water_resistant": 9,
        "best_for": ["race cars", "aircraft", "sports equipment"],
        "weakness": "Very expensive!"
    }
}

def choose_material(needs_strength, needs_lightweight, budget):
    """Help choose the right material!"""
    if needs_lightweight and needs_strength and budget == "high":
        return "Carbon fiber - light and super strong!"
    elif needs_lightweight and needs_strength:
        return "Aluminum - good balance of strength and weight"
    elif needs_strength and budget == "low":
        return "Steel or Concrete - strong and affordable"
    elif needs_lightweight:
        return "Plastic or Wood - light and cheap"
    else:
        return "Steel - can't go wrong with strength!"

# Example: Choosing material for a bike frame
print(choose_material(
    needs_strength=True,
    needs_lightweight=True,
    budget="medium"
))`,
      exerciseInstructions: "You're designing a playground! What materials would you use for different parts?",
      exerciseStarterCode: `# Playground Material Selection!

# Slide surface:
slide_material = "_______________"
why_slide = "_______________"

# Support structure/frame:
frame_material = "_______________"
why_frame = "_______________"

# Swing chains:
chain_material = "_______________"
why_chains = "_______________"

# Swing seat:
seat_material = "_______________"
why_seat = "_______________"

# Ground covering:
ground_material = "_______________"
why_ground = "_______________"

# What properties matter most for playground safety?
safety_properties = [
    "_______________",
    "_______________",
    "_______________",
]`,
      quiz: [
        { question: "Why is aluminum used in airplanes instead of steel?", options: ["It's cheaper", "It's lighter but still strong", "It looks nicer", "It's easier to find"], correctAnswer: "It's lighter but still strong", explanation: "Aluminum is about 1/3 the weight of steel while still being strong. For airplanes, every pound matters!" },
        { question: "What is added to concrete to make it stronger?", options: ["Water", "Steel bars (rebar)", "Paint", "Wood"], correctAnswer: "Steel bars (rebar)", explanation: "Concrete is strong in compression but weak in tension. Adding steel rebar handles the tension forces!" }
      ]
    },
    {
      title: "Testing & Improving",
      content: `
<h2>Making Designs Better Through Testing!</h2>

<p>Real engineers test everything! Testing helps find problems before they become serious.</p>

<h3>Why Test?</h3>

<ul>
<li>✅ Find problems early (cheaper to fix)</li>
<li>✅ Make sure the design is safe</li>
<li>✅ Compare different solutions</li>
<li>✅ Learn what works and what doesn't</li>
</ul>

<h3>Types of Tests</h3>

<h4>🏋️ Stress Tests</h4>
<p>Push it to the limit! Add weight or force until something happens.</p>

<h4>🔁 Durability Tests</h4>
<p>Use it over and over. Does it still work after 1000 uses?</p>

<h4>🌡️ Environmental Tests</h4>
<p>Hot, cold, wet, dry - does it survive different conditions?</p>

<h4>👥 User Tests</h4>
<p>Have real people try it. Watch what they do!</p>

<h3>The Testing Cycle</h3>

<ol>
<li><strong>Build:</strong> Create a prototype</li>
<li><strong>Test:</strong> Try to break it!</li>
<li><strong>Analyze:</strong> What happened and why?</li>
<li><strong>Improve:</strong> Fix the problems</li>
<li><strong>Repeat!</strong></li>
</ol>

<h3>Famous Testing Lessons</h3>
<ul>
<li>🍎 Drop tests: That's why phones have cases!</li>
<li>🌉 Wind tests: Tacoma Narrows Bridge taught us about wind</li>
<li>🚀 Crash tests: Cars are safer because of testing</li>
</ul>
`,
      exampleCode: `# Testing Like an Engineer!

class EngineeringTest:
    def __init__(self, design_name):
        self.design = design_name
        self.version = 1
        self.tests = []

    def stress_test(self, max_force):
        """Push it to the limit!"""
        result = {
            "test_type": "Stress Test",
            "max_force_applied": max_force,
            "passed": max_force < 100,  # Example threshold
            "notes": ""
        }
        if not result["passed"]:
            result["notes"] = "Failed at high force - needs reinforcement"
        self.tests.append(result)
        return result

    def durability_test(self, num_cycles):
        """Use it over and over!"""
        result = {
            "test_type": "Durability Test",
            "cycles_completed": num_cycles,
            "passed": num_cycles >= 1000,
            "notes": ""
        }
        if not result["passed"]:
            result["notes"] = f"Failed after {num_cycles} cycles"
        self.tests.append(result)
        return result

    def analyze(self):
        """What did we learn?"""
        print(f"\\n=== Test Results for {self.design} v{self.version} ===")
        passed = 0
        failed = 0
        for test in self.tests:
            status = "✅ PASSED" if test["passed"] else "❌ FAILED"
            print(f"{test['test_type']}: {status}")
            if test["notes"]:
                print(f"   Notes: {test['notes']}")
            if test["passed"]:
                passed += 1
            else:
                failed += 1
        print(f"\\nTotal: {passed} passed, {failed} failed")
        return failed == 0

    def improve(self, improvement):
        """Make it better!"""
        print(f"\\n🔧 Improving design...")
        print(f"   Change: {improvement}")
        self.version += 1
        self.tests = []  # Reset for new tests
        print(f"   Now testing version {self.version}")

# Test a paper bridge
bridge = EngineeringTest("Paper Bridge")
bridge.stress_test(50)   # Holds 50 units
bridge.stress_test(150)  # Too much force!
bridge.durability_test(500)  # Only lasted 500 uses

bridge.analyze()

# Improve and test again!
bridge.improve("Add triangular supports for strength")
bridge.stress_test(200)  # Now holds more!
bridge.durability_test(2000)  # Lasts longer!
bridge.analyze()`,
      exerciseInstructions: "Design a test plan for a paper airplane! What will you test and how?",
      exerciseStarterCode: `# Paper Airplane Test Plan!

airplane_name = "_______________"

# TEST 1: Distance
test_1_name = "Flight Distance Test"
test_1_method = "_______________"
test_1_success_criteria = "Must fly at least ___ feet"

# TEST 2: Accuracy
test_2_name = "Accuracy Test"
test_2_method = "_______________"
test_2_success_criteria = "Must land within ___ of target"

# TEST 3: Durability
test_3_name = "Durability Test"
test_3_method = "_______________"
test_3_success_criteria = "Must survive ___ flights"

# TEST 4: Create your own!
test_4_name = "_______________"
test_4_method = "_______________"
test_4_success_criteria = "_______________"

# What might cause my airplane to fail?
potential_problems = [
    "_______________",
    "_______________",
    "_______________",
]

# How would I improve it based on test results?
possible_improvements = [
    "_______________",
    "_______________",
]`,
      quiz: [
        { question: "Why do engineers test their designs?", options: ["Just for fun", "To find and fix problems early", "They're required to", "To waste materials"], correctAnswer: "To find and fix problems early", explanation: "Testing finds problems when they're cheap to fix, before the product is used by real people!" },
        { question: "What should you do when a test fails?", options: ["Give up", "Analyze why it failed and improve", "Ignore it", "Blame someone else"], correctAnswer: "Analyze why it failed and improve", explanation: "Every failure teaches something! Analyze what went wrong and use that knowledge to make the design better." }
      ]
    },
    {
      title: "Engineering in Everyday Life",
      content: `
<h2>Engineering is Everywhere!</h2>

<p>Look around you - almost everything was designed by an engineer!</p>

<h3>In Your Home</h3>
<ul>
<li>🚿 Plumbing: Pipes, faucets, water heaters</li>
<li>💡 Electrical: Lights, outlets, wiring</li>
<li>🏠 Structure: Walls, roof, foundation</li>
<li>❄️ HVAC: Heating, cooling, air flow</li>
<li>📺 Electronics: TV, game console, phone</li>
</ul>

<h3>Getting Around</h3>
<ul>
<li>🚗 Cars: Engine, brakes, safety features</li>
<li>🚲 Bikes: Gears, brakes, frame</li>
<li>🛣️ Roads: Pavement, bridges, traffic lights</li>
<li>✈️ Planes: Wings, engines, navigation</li>
</ul>

<h3>At School</h3>
<ul>
<li>✏️ Pencils: Graphite + wood engineering</li>
<li>📚 Books: Paper making and printing</li>
<li>💻 Computers: Millions of engineering advances</li>
<li>🏫 Building: Structure, heating, lighting</li>
</ul>

<h3>Fun Stuff!</h3>
<ul>
<li>🎢 Roller coasters: Physics + safety engineering</li>
<li>🎮 Video games: Software + hardware engineering</li>
<li>⚽ Sports equipment: Materials + design</li>
<li>🎸 Musical instruments: Acoustics engineering</li>
</ul>

<h3>Hidden Engineering</h3>
<p>Things you might not think about:</p>
<ul>
<li>The zipper on your jacket</li>
<li>The spring in your pen</li>
<li>The non-slip tread on your shoes</li>
</ul>
`,
      exampleCode: `# Engineering All Around Us!

# Things in your home and the engineering behind them
home_engineering = {
    "light_bulb": {
        "type": "Electrical Engineering",
        "how_it_works": "Electricity flows through filament, creating light",
        "engineers_solved": "How to produce light efficiently and safely"
    },
    "refrigerator": {
        "type": "Mechanical + Electrical Engineering",
        "how_it_works": "Compressor circulates coolant to remove heat",
        "engineers_solved": "Keep food cold using thermodynamics"
    },
    "smartphone": {
        "type": "Electrical + Software + Materials Engineering",
        "how_it_works": "Millions of tiny transistors process information",
        "engineers_solved": "Fit a computer in your pocket"
    },
    "toilet": {
        "type": "Civil + Mechanical Engineering",
        "how_it_works": "Uses siphon effect to flush waste away",
        "engineers_solved": "Sanitation for healthy cities"
    },
    "velcro": {
        "type": "Materials Engineering",
        "how_it_works": "Tiny hooks grab onto tiny loops",
        "engineers_solved": "Invented by studying burrs stuck to dog fur!"
    }
}

# Engineering scavenger hunt
def find_engineering(room):
    examples = {
        "kitchen": ["stove", "microwave", "blender", "faucet"],
        "bathroom": ["shower", "toilet", "sink", "mirror"],
        "bedroom": ["light switch", "alarm clock", "door hinge"],
        "living_room": ["TV", "remote control", "sofa springs"],
        "garage": ["car", "garage door", "power tools"]
    }
    return examples.get(room, ["Look around - it's everywhere!"])

print("Kitchen Engineering:")
for item in find_engineering("kitchen"):
    print(f"  • {item}")

print("\\nEverything around you was designed by an engineer!")
print("What engineering can YOU find?")`,
      exerciseInstructions: "Go on an engineering scavenger hunt in your home! Find examples of different types of engineering.",
      exerciseStarterCode: `# My Engineering Scavenger Hunt!

# Find examples of engineering in each room:

# KITCHEN
kitchen_examples = [
    "_______________",
    "_______________",
    "_______________",
]

# BATHROOM
bathroom_examples = [
    "_______________",
    "_______________",
    "_______________",
]

# YOUR ROOM
my_room_examples = [
    "_______________",
    "_______________",
    "_______________",
]

# Something that surprised you (hidden engineering!):
surprise_engineering = "_______________"
why_surprised = "_______________"

# Pick one item and explain the engineering behind it:
chosen_item = "_______________"
engineering_explanation = """
_______________________________________________
_______________________________________________
_______________________________________________
"""

# What type of engineer do you think designed it?
engineer_type = "_______________"`,
      quiz: [
        { question: "What type of engineering is in your smartphone?", options: ["Only electrical", "Only software", "Multiple types combined", "No engineering"], correctAnswer: "Multiple types combined", explanation: "Smartphones combine electrical, software, materials, and mechanical engineering all in one device!" },
        { question: "What everyday item was inspired by burrs stuck to dog fur?", options: ["Zipper", "Velcro", "Button", "Snap"], correctAnswer: "Velcro", explanation: "Engineer George de Mestral studied burrs under a microscope and invented Velcro based on the tiny hooks he saw!" }
      ]
    },
    {
      title: "Project: Design a Bridge",
      content: `
<h2>Final Project: Build Your Own Bridge!</h2>

<p>Time to put everything together! You'll design and test a bridge using what you've learned.</p>

<h3>Your Challenge</h3>

<p>Design a bridge that:</p>
<ul>
<li>✅ Spans at least 12 inches (30 cm)</li>
<li>✅ Holds as much weight as possible</li>
<li>✅ Uses only allowed materials</li>
<li>✅ Demonstrates engineering principles</li>
</ul>

<h3>Suggested Materials</h3>
<ul>
<li>Paper or cardstock</li>
<li>Popsicle sticks</li>
<li>Tape or glue</li>
<li>Straws</li>
<li>String</li>
</ul>

<h3>Engineering Principles to Use</h3>
<ul>
<li>🔺 Triangles for strength</li>
<li>🌈 Arches to distribute weight</li>
<li>📐 Wide base for stability</li>
<li>⚖️ Balance forces evenly</li>
</ul>

<h3>Follow the Design Process</h3>
<ol>
<li><strong>ASK:</strong> What makes a bridge strong?</li>
<li><strong>IMAGINE:</strong> Sketch 3 different bridge designs</li>
<li><strong>PLAN:</strong> Choose your best design and list materials</li>
<li><strong>CREATE:</strong> Build your bridge</li>
<li><strong>TEST:</strong> How much weight can it hold?</li>
<li><strong>IMPROVE:</strong> What would you change next time?</li>
</ol>

<h3>Testing Your Bridge</h3>
<p>Place your bridge between two supports, then add weight to the middle until it breaks. How much did it hold?</p>
`,
      exampleCode: `# Bridge Design Project Plan!

class BridgeProject:
    def __init__(self, designer_name):
        self.designer = designer_name
        self.design = {}
        self.materials = []
        self.test_results = []
        self.version = 1

    def imagine(self):
        """Brainstorm bridge designs"""
        ideas = [
            {
                "name": "Beam Bridge",
                "description": "Simple flat bridge with supports",
                "strength_features": ["thick deck"],
                "difficulty": "Easy"
            },
            {
                "name": "Truss Bridge",
                "description": "Triangles along the sides",
                "strength_features": ["triangles", "distributed force"],
                "difficulty": "Medium"
            },
            {
                "name": "Arch Bridge",
                "description": "Curved design under the deck",
                "strength_features": ["arch transfers weight to ends"],
                "difficulty": "Medium"
            },
            {
                "name": "Suspension Bridge",
                "description": "Deck hangs from cables",
                "strength_features": ["cables in tension", "towers"],
                "difficulty": "Hard"
            }
        ]
        return ideas

    def plan(self, bridge_type, materials):
        """Plan the bridge design"""
        self.design = {
            "type": bridge_type,
            "span": "12 inches",
            "width": "3 inches",
            "uses_triangles": True,
            "materials": materials
        }
        self.materials = materials
        print(f"Planning a {bridge_type}...")
        print(f"Materials: {', '.join(materials)}")

    def build(self):
        """Build the bridge"""
        print(f"\\n🔨 Building {self.design['type']} v{self.version}...")
        print("Remember: Triangles are strongest!")
        print("Tip: Make sure connections are strong!")

    def test(self, weight_held):
        """Test the bridge"""
        result = {
            "version": self.version,
            "weight_held": weight_held,
            "notes": []
        }
        if weight_held < 50:
            result["notes"].append("Needs more triangular support")
        if weight_held < 100:
            result["notes"].append("Consider reinforcing joints")
        if weight_held >= 100:
            result["notes"].append("Great job! Very strong design!")

        self.test_results.append(result)
        print(f"\\n🧪 Test Results:")
        print(f"   Weight held: {weight_held} grams")
        for note in result["notes"]:
            print(f"   • {note}")
        return result

    def improve(self, changes):
        """Improve for next version"""
        print(f"\\n🔄 Improving design...")
        for change in changes:
            print(f"   • {change}")
        self.version += 1

# Example project
my_bridge = BridgeProject("Young Engineer")

# Step 1: Brainstorm
print("=== Bridge Ideas ===")
for idea in my_bridge.imagine():
    print(f"\\n{idea['name']} ({idea['difficulty']})")
    print(f"  {idea['description']}")

# Step 2: Plan
my_bridge.plan("Truss Bridge", ["popsicle sticks", "glue", "string"])

# Step 3: Build
my_bridge.build()

# Step 4: Test
my_bridge.test(75)

# Step 5: Improve
my_bridge.improve([
    "Add more triangles to sides",
    "Use stronger glue at joints",
    "Add support beam in center"
])`,
      exerciseInstructions: "Complete your bridge design plan! Then build and test it.",
      exerciseStarterCode: `# MY BRIDGE DESIGN PROJECT

designer_name = "_______________"

# === STEP 1: ASK ===
# What makes a bridge strong?
strength_factors = [
    "_______________",
    "_______________",
    "_______________",
]

# === STEP 2: IMAGINE ===
# Sketch 3 different bridge ideas:
idea_1 = {
    "name": "_______________",
    "description": "_______________",
}
idea_2 = {
    "name": "_______________",
    "description": "_______________",
}
idea_3 = {
    "name": "_______________",
    "description": "_______________",
}

# === STEP 3: PLAN ===
# Which design will you build?
chosen_design = "_______________"
why_chosen = "_______________"

# Materials list:
materials = [
    "_______________",
    "_______________",
    "_______________",
]

# How many triangles will you use?
num_triangles = ___

# === STEP 4: CREATE ===
# Building steps:
build_steps = [
    "1. _______________",
    "2. _______________",
    "3. _______________",
    "4. _______________",
]

# === STEP 5: TEST ===
# How will you test it?
test_method = "_______________"

# How much weight do you predict it will hold?
prediction = "___ grams"

# Actual result (fill in after testing):
actual_result = "___ grams"

# === STEP 6: IMPROVE ===
# What worked well?
worked_well = "_______________"

# What would you change next time?
improvements = [
    "_______________",
    "_______________",
]

# Draw your final bridge design (describe it):
final_design = """
_______________________________________________
_______________________________________________
_______________________________________________
"""`,
      quiz: [
        { question: "What shape should you use a lot of in your bridge?", options: ["Circles", "Squares", "Triangles", "Pentagons"], correctAnswer: "Triangles", explanation: "Triangles are the strongest shape because they can't change shape without breaking a side!" },
        { question: "What should you do if your first bridge design breaks easily?", options: ["Give up", "Build the same thing again", "Analyze why it failed and improve", "Blame the materials"], correctAnswer: "Analyze why it failed and improve", explanation: "That's the engineering process! Every failure teaches you something to make the next version better." }
      ]
    }
  ],

  "junior-engineers-machines-mechanisms": [
    {
      title: "Review: Engineering Fundamentals",
      content: `
<h2>Let's Review What We Know!</h2>

<p>Before diving into advanced topics, let's refresh our engineering knowledge!</p>

<h3>The Engineering Design Process</h3>
<ol>
<li><strong>ASK:</strong> Define the problem</li>
<li><strong>IMAGINE:</strong> Brainstorm solutions</li>
<li><strong>PLAN:</strong> Design your best idea</li>
<li><strong>CREATE:</strong> Build a prototype</li>
<li><strong>TEST:</strong> Does it work?</li>
<li><strong>IMPROVE:</strong> Make it better!</li>
</ol>

<h3>Simple Machines Review</h3>
<ul>
<li>⚖️ <strong>Lever:</strong> Fulcrum, load, effort</li>
<li>🛞 <strong>Wheel & Axle:</strong> Reduces friction</li>
<li>🏗️ <strong>Pulley:</strong> Changes force direction</li>
<li>📐 <strong>Inclined Plane:</strong> Trade distance for force</li>
<li>🔺 <strong>Wedge:</strong> Splits things apart</li>
<li>🔩 <strong>Screw:</strong> Spiral inclined plane</li>
</ul>

<h3>Key Engineering Principles</h3>
<ul>
<li>🔺 Triangles are the strongest shape</li>
<li>📏 Wide bases make things stable</li>
<li>⚡ Circuits need complete paths</li>
<li>🧱 Match materials to requirements</li>
<li>🔬 Always test and improve!</li>
</ul>

<h3>Ready for the Next Level!</h3>
<p>Now we'll apply these fundamentals to more complex machines and mechanisms!</p>
`,
      exampleCode: `# Engineering Fundamentals Review

# The six simple machines
simple_machines = {
    "lever": "A bar that pivots on a fulcrum to move loads",
    "wheel_and_axle": "A wheel attached to a rod that reduces friction",
    "pulley": "A wheel with rope that changes force direction",
    "inclined_plane": "A ramp that trades distance for less force",
    "wedge": "Two inclined planes that split things apart",
    "screw": "An inclined plane wrapped around a cylinder"
}

# Quick review quiz
def engineering_quiz():
    questions = [
        {
            "q": "What's the strongest shape?",
            "a": "Triangle",
            "why": "Can't be pushed into a different shape!"
        },
        {
            "q": "What are the three parts of a lever?",
            "a": "Fulcrum, Load, Effort",
            "why": "The pivot, what you move, and the force you apply"
        },
        {
            "q": "What's the first step in the design process?",
            "a": "ASK",
            "why": "Understand the problem first!"
        }
    ]

    for i, question in enumerate(questions, 1):
        print(f"\\nQ{i}: {question['q']}")
        print(f"A: {question['a']}")
        print(f"   ({question['why']})")

engineering_quiz()

# Engineering mindset check
mindset = {
    "failures": "Learning opportunities!",
    "problems": "Challenges to solve!",
    "testing": "How we improve!",
    "teamwork": "How big things get built!"
}

print("\\n=== The Engineering Mindset ===")
for concept, attitude in mindset.items():
    print(f"{concept.capitalize()}: {attitude}")`,
      exerciseInstructions: "Test your engineering knowledge by explaining these concepts in your own words!",
      exerciseStarterCode: `# Engineering Fundamentals Self-Check!

# Explain each concept in YOUR words:

# The Engineering Design Process:
my_explanation_design_process = """
_______________________________________________
_______________________________________________
"""

# Why triangles are strong:
my_explanation_triangles = """
_______________________________________________
_______________________________________________
"""

# How a lever works:
my_explanation_lever = """
_______________________________________________
_______________________________________________
"""

# Name all 6 simple machines:
simple_machines = [
    "1. _______________",
    "2. _______________",
    "3. _______________",
    "4. _______________",
    "5. _______________",
    "6. _______________",
]

# Why testing is important:
my_explanation_testing = """
_______________________________________________
_______________________________________________
"""

# What I'm most excited to learn next:
excited_about = "_______________"`,
      quiz: [
        { question: "How many simple machines are there?", options: ["4", "5", "6", "8"], correctAnswer: "6", explanation: "The six simple machines are: lever, wheel & axle, pulley, inclined plane, wedge, and screw!" },
        { question: "What should engineers do when their design fails?", options: ["Give up", "Learn from it and improve", "Ignore it", "Start completely over"], correctAnswer: "Learn from it and improve", explanation: "Every failure teaches something! Analyze what went wrong and make the design better." }
      ]
    },
    {
      title: "Forces and Motion",
      content: `
<h2>Understanding How Things Move!</h2>

<p>Forces are pushes and pulls that make things move, stop, or change direction!</p>

<h3>Types of Forces</h3>

<ul>
<li>⬇️ <strong>Gravity:</strong> Pulls everything toward Earth</li>
<li>🚶 <strong>Friction:</strong> Resists motion between surfaces</li>
<li>💨 <strong>Air Resistance:</strong> Air pushing against moving objects</li>
<li>💪 <strong>Applied Force:</strong> Force you directly apply</li>
<li>🧲 <strong>Magnetic Force:</strong> Attraction or repulsion from magnets</li>
</ul>

<h3>Newton's Laws of Motion</h3>

<h4>1st Law: Objects at Rest Stay at Rest</h4>
<p>Things don't move unless a force moves them. And moving things don't stop unless a force stops them!</p>

<h4>2nd Law: Force = Mass × Acceleration</h4>
<p>Heavier things need more force to move. F = m × a</p>

<h4>3rd Law: Every Action Has an Equal Reaction</h4>
<p>Push on something, it pushes back on you!</p>

<h3>Balanced vs. Unbalanced Forces</h3>

<ul>
<li><strong>Balanced:</strong> Forces are equal → Object stays still or moves at constant speed</li>
<li><strong>Unbalanced:</strong> One force is greater → Object speeds up, slows down, or changes direction</li>
</ul>
`,
      exampleCode: `# Forces and Motion in Action!

# Types of forces
forces = {
    "gravity": {
        "direction": "Down (toward Earth)",
        "strength": "9.8 m/s² acceleration",
        "examples": ["falling objects", "weight", "orbits"]
    },
    "friction": {
        "direction": "Opposite to motion",
        "depends_on": ["surface roughness", "weight", "materials"],
        "examples": ["brakes", "walking", "writing"]
    },
    "air_resistance": {
        "direction": "Opposite to motion through air",
        "depends_on": ["speed", "surface area", "shape"],
        "examples": ["parachutes", "car aerodynamics", "flying"]
    }
}

# Newton's 2nd Law: F = m × a
def calculate_force(mass, acceleration):
    """Force = mass × acceleration"""
    force = mass * acceleration
    return force

def calculate_acceleration(force, mass):
    """Acceleration = force / mass"""
    acceleration = force / mass
    return acceleration

# Examples
print("=== Force Calculations ===")

# Push a 10 kg box with 50 N of force
mass = 10  # kg
force = 50  # Newtons
accel = calculate_acceleration(force, mass)
print(f"\\nPushing a {mass}kg box with {force}N:")
print(f"Acceleration = {accel} m/s²")

# Same force on heavier box
mass = 20  # kg
accel = calculate_acceleration(force, mass)
print(f"\\nSame force on {mass}kg box:")
print(f"Acceleration = {accel} m/s²")
print("Heavier objects need more force to accelerate!")

# Newton's 3rd Law example
print("\\n=== Action and Reaction ===")
print("When you jump, you push DOWN on the ground")
print("The ground pushes UP on you!")
print("That's why you go up!")`,
      exerciseInstructions: "Calculate forces in different scenarios and explain what happens!",
      exerciseStarterCode: `# Forces and Motion Practice!

# Scenario 1: Pushing a shopping cart
cart_mass = 15  # kg
push_force = 30  # Newtons

# Calculate acceleration (a = F/m)
cart_acceleration = push_force / cart_mass
print(f"Cart acceleration: {cart_acceleration} m/s²")

# Scenario 2: What force to accelerate a bike at 2 m/s²?
bike_mass = 20  # kg (bike + rider)
desired_acceleration = 2  # m/s²

# Calculate required force (F = m × a)
required_force = ___ * ___
print(f"Force needed: {required_force} Newtons")

# Scenario 3: Friction challenge
# A box slides across the floor and stops.
# What force stopped it?
answer = "_______________"

# Explain Newton's 3 Laws in your own words:
law_1 = "_______________________________________________"
law_2 = "_______________________________________________"
law_3 = "_______________________________________________"

# Real-world example of each law:
example_1 = "_______________________________________________"
example_2 = "_______________________________________________"
example_3 = "_______________________________________________"`,
      quiz: [
        { question: "What does Newton's 2nd Law say?", options: ["Objects at rest stay at rest", "Force equals mass times acceleration", "Every action has a reaction", "Gravity is constant"], correctAnswer: "Force equals mass times acceleration", explanation: "F = m × a means heavier objects need more force to accelerate, and more force creates more acceleration!" },
        { question: "What happens when forces are balanced?", options: ["Object speeds up", "Object slows down", "Object stays still or moves at constant speed", "Object disappears"], correctAnswer: "Object stays still or moves at constant speed", explanation: "Balanced forces mean no net force, so there's no change in motion!" }
      ]
    }
  ]
};

// Quiz questions bank for Engineering
const quizQuestions: Record<string, any[]> = {
  ENGINEERING: [
    { question: "What is the first step in the engineering design process?", options: ["Build", "Ask/Define the problem", "Test", "Ship it"], answer: "1", explanation: "Engineers always start by understanding the problem they need to solve!" },
    { question: "What is a prototype?", options: ["The final product", "A test version of a design", "A type of engineer", "A math formula"], answer: "1", explanation: "A prototype is a test version that engineers build to see if their design works!" },
    { question: "What does CAD stand for?", options: ["Cars And Driving", "Computer-Aided Design", "Calculated Average Distance", "Creative Art Drawing"], answer: "1", explanation: "CAD (Computer-Aided Design) is software engineers use to create precise designs!" },
    { question: "Which engineer would design a bridge?", options: ["Software engineer", "Civil engineer", "Chemical engineer", "Audio engineer"], answer: "1", explanation: "Civil engineers design and build structures like bridges, buildings, and roads!" },
    { question: "Why is testing important in engineering?", options: ["It's not important", "To find problems and improve designs", "To waste time", "Engineers don't test"], answer: "1", explanation: "Testing helps engineers find problems and make their designs safer and better!" }
  ]
};

async function seedEngineeringCourses() {
  console.log("⚙️ Seeding Engineering Courses...\n");

  for (const courseData of engineeringCourses) {
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
        orderIndex: engineeringCourses.indexOf(courseData),
        lessons: {
          create: courseData.lessons.map((lesson, idx) => {
            const content = lessonContent[idx] || {};
            return {
              title: lesson.title,
              slug: lesson.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
              description: lesson.description,
              content: content.content || `<h2>${lesson.title}</h2><p>${lesson.description}</p><p>Lesson content coming soon! This lesson will teach you about ${lesson.title.toLowerCase()}.</p>`,
              exampleCode: content.exampleCode || `# ${lesson.title}\n# Example code coming soon!\n\nprint("Let's learn about ${lesson.title}!")`,
              exerciseInstructions: content.exerciseInstructions || `Practice what you learned about ${lesson.title}!`,
              exerciseStarterCode: content.exerciseStarterCode || `# Your turn!\n# Practice ${lesson.title}\n\n# Write your code here:\n`,
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

    // Add quizzes to lessons
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
        const defaultQuestions = quizQuestions.ENGINEERING.slice(i % 5, (i % 5) + 2);
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

  console.log("🎉 Engineering courses seeded successfully!");
  console.log(`   Total courses: ${engineeringCourses.length}`);
  console.log(`   Levels: Beginner → Intermediate → Advanced → Expert → Master`);
}

seedEngineeringCourses()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

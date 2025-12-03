import { PrismaClient, QuestionType } from "../generated/prisma-client";

const prisma = new PrismaClient();

// Career Prep Courses - Beginner to Master
const careerPrepCourses = [
  {
    title: "Tech Careers Explorer",
    slug: "tech-careers-explorer",
    description: "Discover the exciting world of tech careers! Learn about different jobs in technology, what they do, and which one might be perfect for you. From game developers to AI engineers, explore your future!",
    language: "CAREER_PREP",
    level: "BEGINNER",
    ageGroup: "AGES_7_10",
    totalXp: 1000,
    estimatedHours: 8,
    lessons: [
      { title: "Welcome to the World of Tech!", description: "Discover all the amazing things people create with technology and computers", xp: 60 },
      { title: "What Do Programmers Do?", description: "Learn about the people who write code and build apps, games, and websites", xp: 70 },
      { title: "Game Developers: Making Fun!", description: "Explore how game developers create your favorite video games", xp: 80 },
      { title: "Web Designers: Making Things Pretty", description: "See how designers make beautiful websites and apps", xp: 70 },
      { title: "Robot Builders & Engineers", description: "Meet the people who build robots and smart machines", xp: 80 },
      { title: "AI Scientists: Teaching Computers", description: "Discover how AI scientists help computers learn and think", xp: 80 },
      { title: "Cybersecurity Heroes", description: "Learn about the digital superheroes who keep us safe online", xp: 80 },
      { title: "Tech Entrepreneurs", description: "Meet people who started their own tech companies", xp: 80 },
      { title: "Skills for Tech Success", description: "Learn the skills that all tech jobs need: creativity, problem-solving, teamwork", xp: 100 },
      { title: "My Tech Career Dream Board", description: "Create your own vision board for your future tech career!", xp: 120 }
    ]
  },
  {
    title: "Building Your Tech Profile",
    slug: "building-your-tech-profile",
    description: "Start building your tech identity! Learn to create portfolios, communicate your ideas, work in teams, and present your projects. These skills will help you stand out as a future tech professional.",
    language: "CAREER_PREP",
    level: "INTERMEDIATE",
    ageGroup: "AGES_11_14",
    totalXp: 1800,
    estimatedHours: 16,
    lessons: [
      { title: "What Makes a Great Tech Professional?", description: "Explore the qualities and habits of successful people in tech", xp: 100 },
      { title: "Introduction to GitHub", description: "Set up your GitHub account and learn why it's your tech passport", xp: 120 },
      { title: "Your First Repository", description: "Create and organize your first code repository like a pro", xp: 130 },
      { title: "Writing Great README Files", description: "Learn to document your projects so others can understand them", xp: 110 },
      { title: "Building a Portfolio Website", description: "Create a simple website to showcase your projects", xp: 150 },
      { title: "Communication Skills for Tech", description: "Practice explaining technical concepts in simple terms", xp: 120 },
      { title: "Working in Teams", description: "Learn collaboration skills: giving feedback, dividing work, and resolving conflicts", xp: 130 },
      { title: "Presenting Your Projects", description: "Create and deliver engaging presentations about your work", xp: 140 },
      { title: "Networking for Young Coders", description: "Learn how to connect with other coders and join communities", xp: 120 },
      { title: "Setting Tech Goals", description: "Create a personal learning roadmap for your tech journey", xp: 130 },
      { title: "Finding Your Niche", description: "Discover what area of tech excites you most", xp: 120 },
      { title: "Project: Complete Portfolio Showcase", description: "Build a comprehensive portfolio with at least 3 projects!", xp: 200 }
    ]
  },
  {
    title: "Technical Interview Foundations",
    slug: "technical-interview-foundations",
    description: "Prepare for your first technical interviews! Learn problem-solving strategies, practice coding challenges, and understand what tech companies look for. Build confidence for internships and competitions.",
    language: "CAREER_PREP",
    level: "ADVANCED",
    ageGroup: "AGES_15_18",
    totalXp: 2800,
    estimatedHours: 26,
    lessons: [
      { title: "Understanding Technical Interviews", description: "Learn what to expect in coding interviews and how companies evaluate candidates", xp: 150 },
      { title: "Problem-Solving Strategies", description: "Master the PEDAC method: Problem, Examples, Data, Algorithm, Code", xp: 180 },
      { title: "Thinking Out Loud", description: "Practice explaining your thought process while solving problems", xp: 160 },
      { title: "Arrays & Strings Challenges", description: "Solve common interview problems with arrays and strings", xp: 200 },
      { title: "Logic & Pattern Problems", description: "Practice finding patterns and logical solutions to puzzles", xp: 180 },
      { title: "Data Structures Overview", description: "Understand when to use arrays, objects, sets, and maps", xp: 200 },
      { title: "Algorithm Basics", description: "Learn searching, sorting, and other fundamental algorithms", xp: 220 },
      { title: "Time & Space Complexity", description: "Understand Big O notation and why efficiency matters", xp: 200 },
      { title: "Debugging Under Pressure", description: "Practice finding and fixing bugs quickly and calmly", xp: 180 },
      { title: "Behavioral Interview Prep", description: "Prepare stories about your projects using the STAR method", xp: 160 },
      { title: "Mock Interview Practice", description: "Experience realistic interview scenarios and get feedback", xp: 220 },
      { title: "Handling Rejection & Growth", description: "Build resilience and learn from interview experiences", xp: 140 },
      { title: "Project: Coding Challenge Marathon", description: "Complete a series of timed coding challenges!", xp: 280 }
    ]
  },
  {
    title: "Professional Developer Skills",
    slug: "professional-developer-skills",
    description: "Master the professional skills used by developers at top tech companies! Learn advanced Git workflows, agile methodologies, code reviews, and how to work effectively in professional engineering teams.",
    language: "CAREER_PREP",
    level: "EXPERT",
    ageGroup: "AGES_15_18",
    totalXp: 3800,
    estimatedHours: 36,
    lessons: [
      { title: "The Modern Developer Workflow", description: "Understand how professional development teams operate day-to-day", xp: 200 },
      { title: "Advanced Git: Branching Strategies", description: "Master Git Flow, feature branches, and release management", xp: 250 },
      { title: "Pull Requests & Code Reviews", description: "Learn to create great PRs and review others' code constructively", xp: 250 },
      { title: "Merge Conflicts & Resolution", description: "Handle complex merge conflicts with confidence", xp: 220 },
      { title: "Introduction to Agile & Scrum", description: "Learn the agile methodology used by most tech teams", xp: 200 },
      { title: "User Stories & Task Breakdown", description: "Break down features into manageable, estimable tasks", xp: 220 },
      { title: "Sprint Planning & Standups", description: "Participate effectively in agile ceremonies", xp: 200 },
      { title: "Writing Clean Code", description: "Follow best practices for readable, maintainable code", xp: 240 },
      { title: "Documentation & Comments", description: "Write documentation that actually helps your team", xp: 200 },
      { title: "Testing Fundamentals", description: "Understand unit tests, integration tests, and TDD basics", xp: 250 },
      { title: "Continuous Integration/Deployment", description: "Learn about CI/CD pipelines and automated workflows", xp: 250 },
      { title: "Open Source Contribution", description: "Make your first contribution to a real open source project", xp: 280 },
      { title: "Building Your LinkedIn Profile", description: "Create a compelling professional presence online", xp: 180 },
      { title: "Project: Team Development Simulation", description: "Work in a simulated professional development environment!", xp: 350 }
    ]
  },
  {
    title: "Tech Career Launch Pad",
    slug: "tech-career-launch-pad",
    description: "Get ready to launch your tech career! Prepare for internships, build industry connections, master the job search process, and develop the professional habits that will make you successful from day one.",
    language: "CAREER_PREP",
    level: "MASTER",
    ageGroup: "AGES_15_18",
    totalXp: 5000,
    estimatedHours: 48,
    lessons: [
      { title: "Tech Industry Landscape 2024", description: "Understand current trends, top companies, and emerging opportunities", xp: 250 },
      { title: "Finding Internship Opportunities", description: "Discover where to find internships and programs for students", xp: 280 },
      { title: "Crafting Your Tech Resume", description: "Build a resume that passes ATS and impresses recruiters", xp: 300 },
      { title: "Cover Letters That Stand Out", description: "Write compelling cover letters for tech positions", xp: 250 },
      { title: "Navigating Application Systems", description: "Master online applications, portals, and follow-up strategies", xp: 250 },
      { title: "Technical Phone Screens", description: "Prepare for initial technical screening calls", xp: 300 },
      { title: "On-Site Interview Preparation", description: "What to expect and how to prepare for full interview loops", xp: 300 },
      { title: "System Design Basics", description: "Introduction to designing software systems at scale", xp: 350 },
      { title: "Negotiating Offers", description: "Understand compensation and how to negotiate professionally", xp: 280 },
      { title: "Your First 90 Days", description: "How to succeed and make an impact in your first tech role", xp: 300 },
      { title: "Building Your Professional Network", description: "Network authentically at events, online, and at work", xp: 280 },
      { title: "Mentorship & Career Growth", description: "Find mentors and plan your long-term career trajectory", xp: 280 },
      { title: "Side Projects & Personal Brand", description: "Build a reputation through projects and thought leadership", xp: 300 },
      { title: "Freelancing & Entrepreneurship", description: "Explore alternative career paths: freelance, consulting, startups", xp: 280 },
      { title: "Work-Life Balance in Tech", description: "Maintain wellbeing while building a successful tech career", xp: 250 },
      { title: "Final Project: Career Launch Plan", description: "Create a comprehensive 1-year career action plan!", xp: 450 }
    ]
  }
];

// Detailed lesson content for Career Prep courses
const lessonContentByLevel: Record<string, any[]> = {
  "tech-careers-explorer": [
    {
      title: "Welcome to the World of Tech!",
      content: `
<h2>Welcome, Future Tech Star!</h2>

<p>Technology is all around us - from the games you play to the apps your family uses. Today, we'll explore the amazing world of people who create technology!</p>

<h3>Tech Is Everywhere!</h3>

<ul>
<li><strong>Your Games:</strong> People called game developers create video games!</li>
<li><strong>Your Apps:</strong> App developers build the apps on phones and tablets</li>
<li><strong>Websites:</strong> Web developers create websites like YouTube and Google</li>
<li><strong>Smart Devices:</strong> Engineers build Alexa, robots, and smart toys</li>
</ul>

<h3>Why Learn About Tech Careers?</h3>

<p>Tech jobs are:</p>
<ul>
<li>Creative - you get to build new things!</li>
<li>Fun - you can make games, apps, and robots!</li>
<li>Important - you help people every day!</li>
<li>Well-paid - tech jobs pay really well!</li>
</ul>

<h3>Who Can Work in Tech?</h3>

<p>ANYONE can work in tech! It doesn't matter:</p>
<ul>
<li>Where you're from</li>
<li>If you're a boy or girl</li>
<li>What you look like</li>
<li>If you're shy or outgoing</li>
</ul>

<p>All that matters is that you're curious and love to learn!</p>
`,
      exampleCode: `# Welcome to Tech Careers!
# Let's see some jobs in tech

tech_jobs = [
    "Game Developer - Makes video games!",
    "Web Developer - Builds websites!",
    "App Developer - Creates phone apps!",
    "Robot Engineer - Builds robots!",
    "AI Scientist - Teaches computers to think!",
    "Cybersecurity Expert - Protects people online!",
]

print("Cool jobs in technology:")
print("-" * 40)

for job in tech_jobs:
    print(f"  {job}")

print()
print("Which one sounds interesting to YOU?")`,
      exerciseInstructions: "Think about technology you use every day. List 5 things and guess who might have built them!",
      exerciseStarterCode: `# My Technology Detective List!

# Example:
# Technology: Minecraft
# Who built it: Game Developers
# What I like about it: Building worlds and playing with friends

# Your turn! List 5 technologies you use:

tech_1 = {
    "technology": "_______________",
    "who_built_it": "_______________",
    "what_I_like": "_______________"
}

tech_2 = {
    "technology": "_______________",
    "who_built_it": "_______________",
    "what_I_like": "_______________"
}

tech_3 = {
    "technology": "_______________",
    "who_built_it": "_______________",
    "what_I_like": "_______________"
}

# Which tech job would you want to try?
my_dream_job = "_______________"
why = "_______________"`,
      quiz: [
        { question: "Who creates video games?", options: ["Game developers", "Teachers", "Doctors", "Chefs"], correctAnswer: "Game developers", explanation: "Game developers are the creative people who design, code, and build video games!" },
        { question: "Can anyone work in tech?", options: ["Only boys", "Only adults", "Only geniuses", "Anyone who's curious and loves to learn!"], correctAnswer: "Anyone who's curious and loves to learn!", explanation: "Tech is for everyone! All you need is curiosity and a willingness to learn new things." }
      ]
    },
    {
      title: "What Do Programmers Do?",
      content: `
<h2>Meet the Programmers!</h2>

<p>Programmers are like digital wizards - they write special instructions called "code" to tell computers what to do!</p>

<h3>What Is Programming?</h3>

<p>Programming is writing instructions for computers. It's like:</p>
<ul>
<li>Writing a recipe for a robot chef</li>
<li>Creating rules for a game</li>
<li>Giving directions to your friend (but very, very specific!)</li>
</ul>

<h3>A Day in a Programmer's Life</h3>

<ol>
<li><strong>Morning:</strong> Check emails and plan the day's tasks</li>
<li><strong>Mid-morning:</strong> Write code to build new features</li>
<li><strong>Lunch:</strong> Eat with teammates and talk about ideas</li>
<li><strong>Afternoon:</strong> Fix bugs (problems in code) and test things</li>
<li><strong>Late afternoon:</strong> Meet with team to share progress</li>
</ol>

<h3>What Programmers Create</h3>

<ul>
<li>Apps on your phone</li>
<li>Websites you visit</li>
<li>Games you play</li>
<li>Features in cars, refrigerators, and TVs!</li>
</ul>

<h3>Programming Languages</h3>

<p>Just like people speak different languages, programmers write code in different programming languages:</p>
<ul>
<li><strong>Python:</strong> Great for beginners and AI</li>
<li><strong>JavaScript:</strong> Makes websites interactive</li>
<li><strong>Scratch:</strong> Visual blocks for kids</li>
<li><strong>Lua:</strong> Used for Roblox games</li>
</ul>
`,
      exampleCode: `# What programmers do - they write code like this!

# This code is like a set of instructions:
print("Hello! I'm a simple program.")

# Programmers make computers do math:
cookies_per_person = 3
number_of_friends = 5
total_cookies = cookies_per_person * number_of_friends

print(f"We need {total_cookies} cookies for the party!")

# Programmers make computers make decisions:
weather = "sunny"

if weather == "sunny":
    print("Let's go to the park!")
else:
    print("Let's stay inside and code!")

# This is what programmers do all day:
# - Write instructions
# - Make computers smart
# - Solve problems
# - Build cool things!

print()
print("Now YOU know how to think like a programmer!")`,
      exerciseInstructions: "Write some simple 'code instructions' in plain English for an everyday task, like making a sandwich!",
      exerciseStarterCode: `# Programming is like writing very specific instructions!
# Let's practice by writing instructions for making a sandwich:

sandwich_steps = [
    "Step 1: Get two slices of bread",
    "Step 2: _______________",
    "Step 3: _______________",
    "Step 4: _______________",
    "Step 5: _______________",
    "Step 6: Put the slices together",
    "Step 7: Enjoy your sandwich!"
]

# Now let's think about programming:
# What if step 2 was "Add peanut butter if you like it"?
# That's called a CONDITION in programming!

# Write your own instructions with a condition:
my_morning_routine = [
    "Step 1: Wake up",
    "Step 2: IF it's a school day, THEN _______________",
    "Step 3: _______________",
]`,
      quiz: [
        { question: "What do programmers write?", options: ["Stories", "Code", "Songs", "Letters"], correctAnswer: "Code", explanation: "Programmers write code - special instructions that tell computers what to do!" },
        { question: "What is a 'bug' in programming?", options: ["An actual insect", "A problem in the code", "A new feature", "A type of computer"], correctAnswer: "A problem in the code", explanation: "A bug is when something in the code doesn't work right. Programmers spend time finding and fixing bugs!" }
      ]
    }
  ],

  "building-your-tech-profile": [
    {
      title: "What Makes a Great Tech Professional?",
      content: `
<h2>Becoming a Tech Pro!</h2>

<p>What separates good developers from great ones? It's not just about coding - it's about habits, mindset, and how you work with others!</p>

<h3>The Developer Mindset</h3>

<ul>
<li><strong>Curiosity:</strong> Always asking "Why?" and "How?"</li>
<li><strong>Persistence:</strong> Not giving up when things are hard</li>
<li><strong>Growth mindset:</strong> Believing you can always learn more</li>
<li><strong>Attention to detail:</strong> Small things matter in code!</li>
</ul>

<h3>Key Skills Beyond Coding</h3>

<ul>
<li><strong>Communication:</strong> Explaining ideas clearly to others</li>
<li><strong>Collaboration:</strong> Working well in teams</li>
<li><strong>Problem-solving:</strong> Breaking big problems into small steps</li>
<li><strong>Time management:</strong> Getting things done on schedule</li>
<li><strong>Continuous learning:</strong> Tech changes fast - keep learning!</li>
</ul>

<h3>Habits of Successful Developers</h3>

<ol>
<li>Code a little bit every day</li>
<li>Read other people's code</li>
<li>Share what you learn</li>
<li>Ask for help when stuck</li>
<li>Build projects, not just tutorials</li>
<li>Stay organized with your code</li>
</ol>

<h3>Your Tech Identity</h3>

<p>Start building your tech reputation by:</p>
<ul>
<li>Working on projects you're passionate about</li>
<li>Sharing your work online</li>
<li>Helping others learn</li>
<li>Being active in coding communities</li>
</ul>
`,
      exampleCode: `# Habits of a Great Developer

developer_habits = {
    "daily_coding": True,  # Code every day, even just 15 minutes!
    "reads_documentation": True,  # Always learning new things
    "asks_questions": True,  # Not afraid to ask for help
    "shares_knowledge": True,  # Helps others learn
    "builds_projects": True,  # Creates real things, not just tutorials
}

# Self-assessment: How many do you have?
my_habits = {
    "daily_coding": False,  # Change to True if you do this!
    "reads_documentation": False,
    "asks_questions": True,
    "shares_knowledge": False,
    "builds_projects": True,
}

good_habits = sum(my_habits.values())
print(f"You have {good_habits}/5 great developer habits!")

# Growth mindset examples:
fixed_mindset = "I'm not good at math."
growth_mindset = "I'm still learning math, but I'm getting better!"

print()
print("Remember: Skills are GROWN, not born!")
print("Every expert was once a beginner.")`,
      exerciseInstructions: "Do a self-assessment of your developer habits and create a plan to improve!",
      exerciseStarterCode: `# My Developer Habit Assessment

# Rate yourself 1-5 (1 = never, 5 = always)

my_skills = {
    "I practice coding regularly": ___,
    "I ask for help when stuck": ___,
    "I share what I learn with others": ___,
    "I finish the projects I start": ___,
    "I read and try to understand others' code": ___,
}

# What's your total? (out of 25)
total = sum(my_skills.values())

# Top 2 things I'm good at:
# 1. _______________
# 2. _______________

# Top 2 things I want to improve:
# 1. _______________
# 2. _______________

# My action plan for this week:
week_goals = [
    "_______________",
    "_______________",
    "_______________",
]`,
      quiz: [
        { question: "What mindset helps developers grow?", options: ["Fixed mindset", "Growth mindset", "No mindset", "Angry mindset"], correctAnswer: "Growth mindset", explanation: "A growth mindset means believing you can always learn and improve with practice!" },
        { question: "Besides coding, what skill is important for developers?", options: ["Running fast", "Communication", "Singing", "Drawing"], correctAnswer: "Communication", explanation: "Developers need to explain their ideas to teammates, write documentation, and collaborate effectively!" }
      ]
    },
    {
      title: "Introduction to GitHub",
      content: `
<h2>GitHub: Your Coding Passport!</h2>

<p>GitHub is like a social media platform for code! It's where developers store their projects, collaborate with others, and showcase their work.</p>

<h3>Why GitHub Matters</h3>

<ul>
<li><strong>Portfolio:</strong> Employers look at your GitHub!</li>
<li><strong>Backup:</strong> Your code is safe in the cloud</li>
<li><strong>Collaboration:</strong> Work with others on projects</li>
<li><strong>Learning:</strong> See how other developers code</li>
<li><strong>History:</strong> Track all changes to your code</li>
</ul>

<h3>Key Terms to Know</h3>

<ul>
<li><strong>Repository (Repo):</strong> A folder for your project</li>
<li><strong>Commit:</strong> Saving your changes with a message</li>
<li><strong>Push:</strong> Uploading your commits to GitHub</li>
<li><strong>Pull:</strong> Downloading changes from GitHub</li>
<li><strong>Clone:</strong> Copying a repo to your computer</li>
<li><strong>Fork:</strong> Making your own copy of someone's project</li>
</ul>

<h3>Setting Up Your Profile</h3>

<ol>
<li>Choose a professional username</li>
<li>Add a profile picture</li>
<li>Write a bio about yourself</li>
<li>Pin your best projects</li>
<li>Add your README profile</li>
</ol>

<h3>Green Squares = Activity</h3>

<p>GitHub shows a grid of green squares - each one represents a day you contributed code. This shows how active you are!</p>
`,
      exampleCode: `# GitHub Basics - Commands you'll use

# Setting up Git (one time)
# git config --global user.name "Your Name"
# git config --global user.email "your.email@example.com"

# Creating a new repository
# 1. Make a folder for your project
# mkdir my-awesome-project
# cd my-awesome-project

# 2. Initialize Git
# git init

# 3. Add your files
# git add .

# 4. Commit your changes
# git commit -m "Initial commit: Added basic project files"

# 5. Connect to GitHub
# git remote add origin https://github.com/yourusername/my-awesome-project.git

# 6. Push to GitHub
# git push -u origin main

# Good commit message examples:
good_commits = [
    "Add login functionality",
    "Fix navigation menu bug",
    "Update README with installation steps",
    "Improve button styling on mobile",
]

# Bad commit message examples:
bad_commits = [
    "stuff",
    "fix",
    "update",
    "asdfasdf",  # What does this even mean?!
]

print("Good commit messages explain WHAT you changed and WHY!")`,
      exerciseInstructions: "Plan your GitHub profile! What username will you choose and what projects will you showcase?",
      exerciseStarterCode: `# Planning My GitHub Profile

# Choose a username (professional but memorable!)
# Good: alex-codes, sarahdev, coder-maya
# Not great: xXgamer420Xx, a1b2c3d4

my_username = "_______________"

# Write your bio (keep it short!)
my_bio = """
_______________________________________________
_______________________________________________
"""

# List 3-4 projects you want to create and showcase:
my_projects = [
    {
        "name": "_______________",
        "description": "_______________",
        "language": "_______________",
    },
    {
        "name": "_______________",
        "description": "_______________",
        "language": "_______________",
    },
]

# What topics interest you?
my_interests = [
    "_______________",
    "_______________",
    "_______________",
]`,
      quiz: [
        { question: "What is a GitHub repository?", options: ["A social post", "A folder for your project", "A message to friends", "A video game"], correctAnswer: "A folder for your project", explanation: "A repository (repo) is like a folder that contains all the files and history for your project!" },
        { question: "Why do employers look at GitHub profiles?", options: ["To see selfies", "To check your coding activity and projects", "For entertainment", "To find memes"], correctAnswer: "To check your coding activity and projects", explanation: "GitHub shows employers your actual code, projects, and how often you practice coding!" }
      ]
    }
  ],

  "technical-interview-foundations": [
    {
      title: "Understanding Technical Interviews",
      content: `
<h2>Demystifying Tech Interviews</h2>

<p>Technical interviews might seem scary, but understanding what to expect makes them much less intimidating. Let's learn what companies are actually looking for!</p>

<h3>Types of Technical Interviews</h3>

<ul>
<li><strong>Phone Screen:</strong> Initial call with a recruiter or engineer</li>
<li><strong>Coding Challenge:</strong> Solve problems on a whiteboard or computer</li>
<li><strong>Take-home Project:</strong> Build something at home over a few days</li>
<li><strong>System Design:</strong> Design how a system would work</li>
<li><strong>Behavioral:</strong> Questions about your experience and personality</li>
</ul>

<h3>What Interviewers Look For</h3>

<ul>
<li><strong>Problem-solving:</strong> HOW you approach problems</li>
<li><strong>Communication:</strong> Can you explain your thinking?</li>
<li><strong>Technical knowledge:</strong> Do you understand the basics?</li>
<li><strong>Coding skills:</strong> Can you write clean, working code?</li>
<li><strong>Culture fit:</strong> Would you be good to work with?</li>
</ul>

<h3>The Secret: It's About the Process!</h3>

<p>Companies care MORE about how you think than whether you get the perfect answer. They want to see:</p>
<ul>
<li>You asking clarifying questions</li>
<li>You thinking out loud</li>
<li>You considering different approaches</li>
<li>You testing your solution</li>
<li>You handling feedback well</li>
</ul>

<h3>Interview Tips</h3>

<ol>
<li>Practice coding without an IDE (on paper or whiteboard)</li>
<li>Talk through your thought process</li>
<li>Start with a simple solution, then optimize</li>
<li>Ask questions if anything is unclear</li>
<li>Don't panic if you get stuck - that's normal!</li>
</ol>
`,
      exampleCode: `# Technical Interview Example

# Problem: Given a list of numbers, find the two numbers that add up to a target

def two_sum(numbers, target):
    """
    Find indices of two numbers that add up to target.

    This is a classic interview question!
    Let's solve it step by step.
    """

    # STEP 1: Think out loud about approaches
    # Approach 1: Check every pair (slow but works)
    # Approach 2: Use a dictionary for quick lookup (faster!)

    # STEP 2: Start with the simpler approach
    seen = {}  # Store numbers we've seen

    for i, num in enumerate(numbers):
        # What number do we need to find?
        complement = target - num

        # Have we seen this number before?
        if complement in seen:
            return [seen[complement], i]

        # Remember this number
        seen[num] = i

    return []  # No solution found

# Test it!
numbers = [2, 7, 11, 15]
target = 9
result = two_sum(numbers, target)
print(f"Numbers at indices {result} add up to {target}!")

# Interview process:
# 1. Understand the problem
# 2. Ask clarifying questions
# 3. Think of approaches
# 4. Start coding (talk while you code!)
# 5. Test with examples
# 6. Discuss time/space complexity`,
      exerciseInstructions: "Practice the interview process! Solve this problem while writing out your thought process.",
      exerciseStarterCode: `# Practice Interview Problem

# Problem: Given a list of numbers, find the largest one.
# (Start simple to practice the PROCESS)

# STEP 1: Make sure I understand the problem
# - Input: _______________
# - Output: _______________
# - Any edge cases? _______________

# STEP 2: Think of approaches
# Approach 1: _______________
# Approach 2: _______________

# STEP 3: Write the code
def find_largest(numbers):
    # Write your solution here
    pass

# STEP 4: Test with examples
test_1 = find_largest([3, 1, 4, 1, 5, 9])  # Should return 9
test_2 = find_largest([1])  # Should return 1
test_3 = find_largest([-5, -2, -8])  # Should return -2

# STEP 5: What's the time complexity?
# O(___) because _______________

# Reflection: What did I learn from this process?
# _______________________________________________`,
      quiz: [
        { question: "What matters MOST in a technical interview?", options: ["Getting the perfect answer", "Your thought process and problem-solving approach", "Typing speed", "Memorizing algorithms"], correctAnswer: "Your thought process and problem-solving approach", explanation: "Interviewers want to see HOW you think and approach problems, not just the final answer!" },
        { question: "What should you do if you get stuck in an interview?", options: ["Give up immediately", "Say you don't know and wait", "Talk through what you're thinking and ask for hints", "Guess randomly"], correctAnswer: "Talk through what you're thinking and ask for hints", explanation: "It's totally okay to get stuck! The key is to communicate what you're thinking and ask for guidance." }
      ]
    }
  ],

  "professional-developer-skills": [
    {
      title: "The Modern Developer Workflow",
      content: `
<h2>How Pro Dev Teams Work</h2>

<p>Professional software teams don't just write code - they follow structured processes to build quality software together. Let's learn how it works!</p>

<h3>A Day in the Life</h3>

<ol>
<li><strong>9:00 AM - Standup:</strong> Quick meeting to share progress and blockers</li>
<li><strong>9:30 AM - Deep Work:</strong> Focus time for coding</li>
<li><strong>12:00 PM - Lunch & Learn:</strong> Sometimes teams share knowledge</li>
<li><strong>1:00 PM - Code Review:</strong> Review teammates' code</li>
<li><strong>2:00 PM - Meetings:</strong> Planning, design discussions</li>
<li><strong>3:00 PM - More Coding:</strong> Implement and test features</li>
<li><strong>5:00 PM - Wrap up:</strong> Document progress, plan tomorrow</li>
</ol>

<h3>Key Development Practices</h3>

<ul>
<li><strong>Version Control:</strong> Using Git for all code changes</li>
<li><strong>Code Reviews:</strong> Having others check your code before merging</li>
<li><strong>Testing:</strong> Writing tests to catch bugs automatically</li>
<li><strong>CI/CD:</strong> Automating testing and deployment</li>
<li><strong>Documentation:</strong> Writing docs so others understand your code</li>
</ul>

<h3>The Development Cycle</h3>

<ol>
<li><strong>Plan:</strong> Understand what to build</li>
<li><strong>Design:</strong> Decide how to build it</li>
<li><strong>Develop:</strong> Write the code</li>
<li><strong>Review:</strong> Get feedback from teammates</li>
<li><strong>Test:</strong> Make sure it works</li>
<li><strong>Deploy:</strong> Release to users</li>
<li><strong>Monitor:</strong> Watch for problems</li>
<li><strong>Iterate:</strong> Improve based on feedback</li>
</ol>
`,
      exampleCode: `# Professional Developer Workflow Example

# 1. Start with a task/ticket
task = {
    "id": "PROJ-123",
    "title": "Add user profile page",
    "description": "Create a page where users can view their profile",
    "status": "In Progress",
    "assignee": "You!",
}

# 2. Create a branch for your work
# git checkout -b feature/user-profile-page

# 3. Write code in small, logical commits
commits = [
    "Set up profile page route and basic structure",
    "Add user data fetching from API",
    "Create profile info component",
    "Add profile picture upload functionality",
    "Write unit tests for profile components",
    "Update README with new feature documentation",
]

# 4. Create a pull request
pull_request = {
    "title": "Feature: Add user profile page",
    "description": '''
    ## What
    Added a new user profile page

    ## Why
    Users requested the ability to view and edit their profile

    ## How
    - Created /profile route
    - Added ProfilePage component
    - Integrated with user API

    ## Testing
    - Added unit tests
    - Tested manually on Chrome, Firefox, Safari

    ## Screenshots
    [Attach screenshots here]
    ''',
}

# 5. Address code review feedback
# 6. Merge and deploy!
# 7. Monitor for issues

print("This is how professional teams build software!")`,
      exerciseInstructions: "Plan out a feature using the professional workflow! Pick a simple feature and document the steps.",
      exerciseStarterCode: `# Professional Feature Development Exercise

# Pick a feature to "build" (example: add a dark mode toggle)

my_feature = {
    "title": "_______________",
    "description": "_______________",
}

# PLANNING
# What components/files will I need to create or modify?
files_to_change = [
    "_______________",
    "_______________",
    "_______________",
]

# COMMITS I'll make (small, logical steps):
my_commits = [
    "_______________",
    "_______________",
    "_______________",
    "_______________",
]

# PULL REQUEST description:
pr_description = """
## What
_______________

## Why
_______________

## How
- _______________
- _______________

## Testing
- _______________
"""

# Questions I might get in code review:
possible_questions = [
    "_______________",
    "_______________",
]`,
      quiz: [
        { question: "What is a 'standup' meeting?", options: ["Exercise at work", "A quick daily meeting to share progress", "A meeting where you stand on chairs", "An all-day meeting"], correctAnswer: "A quick daily meeting to share progress", explanation: "Standup is a brief daily meeting (often standing up to keep it short!) where team members share what they did, what they'll do, and any blockers." },
        { question: "Why do teams do code reviews?", options: ["To criticize each other", "To catch bugs and share knowledge", "Because they have to", "For fun"], correctAnswer: "To catch bugs and share knowledge", explanation: "Code reviews help catch bugs, ensure code quality, and spread knowledge across the team. They make everyone better!" }
      ]
    }
  ]
};

// Quiz questions bank for Career Prep
const quizQuestions: Record<string, any[]> = {
  CAREER_PREP: [
    { question: "What is GitHub used for?", options: ["Social media", "Storing and sharing code", "Playing games", "Watching videos"], answer: "1", explanation: "GitHub is a platform where developers store their code, collaborate with others, and showcase their projects!" },
    { question: "What is a portfolio?", options: ["A type of folder", "A collection of your best work", "A job application", "A coding language"], answer: "1", explanation: "A portfolio is a collection of your best projects that shows what you can do!" },
    { question: "What is a 'soft skill'?", options: ["Easy coding", "Skills like communication and teamwork", "Using soft keyboards", "Programming in Python"], answer: "1", explanation: "Soft skills are interpersonal skills like communication, teamwork, and problem-solving - they're just as important as coding!" },
    { question: "What does CI/CD stand for?", options: ["Code Integration/Code Deployment", "Continuous Integration/Continuous Deployment", "Computer Info/Computer Data", "Creating Ideas/Creating Designs"], answer: "1", explanation: "CI/CD means Continuous Integration and Continuous Deployment - it's the practice of automatically testing and deploying code!" },
    { question: "What is a code review?", options: ["Reading books about code", "Having others check your code before it's merged", "A test at school", "Reviewing your own code alone"], answer: "1", explanation: "Code review is when teammates look at your code to catch bugs, suggest improvements, and share knowledge!" }
  ]
};

async function seedCareerPrepCourses() {
  console.log("Seeding Career Prep Courses...\n");

  for (const courseData of careerPrepCourses) {
    console.log(`Creating: ${courseData.title}`);

    // Check if course exists
    const existing = await prisma.course.findFirst({
      where: { slug: courseData.slug }
    });

    if (existing) {
      console.log(`   Course already exists, updating...`);
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
        orderIndex: careerPrepCourses.indexOf(courseData),
        lessons: {
          create: courseData.lessons.map((lesson, idx) => {
            const content = lessonContent[idx] || {};
            return {
              title: lesson.title,
              slug: lesson.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, ""),
              description: lesson.description,
              content: content.content || `<h2>${lesson.title}</h2><p>${lesson.description}</p><p>Lesson content coming soon! This lesson will help you with ${lesson.title.toLowerCase()}.</p>`,
              exampleCode: content.exampleCode || `# ${lesson.title}\n# Content coming soon!\n\nprint("Let's learn about career preparation!")`,
              exerciseInstructions: content.exerciseInstructions || `Practice what you learned about ${lesson.title}!`,
              exerciseStarterCode: content.exerciseStarterCode || `# Your turn!\n# Practice ${lesson.title}\n\n# Write your notes here:\n`,
              xpReward: lesson.xp,
              orderIndex: idx,
              isPublished: true
            };
          })
        }
      },
      include: { lessons: true }
    });

    console.log(`   Created with ${course.lessons.length} lessons`);

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
        const defaultQuestions = quizQuestions.CAREER_PREP.slice(i % 5, (i % 5) + 2);
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

    console.log(`   Added quizzes to lessons\n`);
  }

  console.log("Career Prep courses seeded successfully!");
  console.log(`   Total courses: ${careerPrepCourses.length}`);
  console.log(`   Levels: Beginner -> Intermediate -> Advanced -> Expert -> Master`);
}

seedCareerPrepCourses()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

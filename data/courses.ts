export type Lesson = { title: string; description: string; xp: number };

export type Course = {
  id: string;
  title: string;
  level: "beginner" | "intermediate" | "advanced" | "expert" | "master";
  age: string;
  xp: number;
  hours: number;
  description: string;
  language: "html" | "css" | "javascript" | "python" | "roblox" | "engineering" | "ai_ml" | "robotics" | "web_development" | "mobile_development" | "game_development" | "career_prep";
  gradient: string;
  lessons: Lesson[];
};

export const courses: Course[] = [
  // ============================================
  // HTML TUTORIAL SERIES - Complete Learning Path
  // ============================================

  // LEVEL 1: HTML BEGINNER
  {
    id: "html-beginner",
    title: "HTML Beginner: My First Webpage",
    level: "beginner",
    age: "Ages 7-10",
    xp: 800,
    hours: 8,
    language: "html",
    gradient: "from-orange-400 to-amber-500",
    description:
      "Start your web adventure! Learn to build your very first webpage using simple HTML tags. Perfect for young coders taking their first steps into the world of web development.",
    lessons: [
      { title: "Welcome to HTML!", description: "Discover what HTML is and how websites are made - it's like building with digital LEGO blocks!", xp: 50 },
      { title: "Your First HTML File", description: "Create your very first .html file and see it come to life in a browser", xp: 60 },
      { title: "The HTML Skeleton", description: "Learn the basic structure every webpage needs: <!DOCTYPE>, <html>, <head>, and <body>", xp: 70 },
      { title: "Headings: Big and Small Text", description: "Use h1 to h6 tags to create titles and subtitles - like chapter titles in a book!", xp: 60 },
      { title: "Paragraphs and Line Breaks", description: "Write text on your page using <p> and <br> tags", xp: 60 },
      { title: "Making Text Bold and Italic", description: "Style your text with <strong> and <em> tags to make words stand out", xp: 50 },
      { title: "Adding Cool Images", description: "Put pictures on your webpage using the <img> tag", xp: 80 },
      { title: "Creating Clickable Links", description: "Connect pages together with <a> tags - the magic of the internet!", xp: 80 },
      { title: "Fun with Lists", description: "Make ordered and unordered lists using <ol>, <ul>, and <li> tags", xp: 70 },
      { title: "My First Mini Project", description: "Build a complete 'About Me' webpage using everything you've learned!", xp: 120 },
    ],
  },

  // LEVEL 2: HTML INTERMEDIATE
  {
    id: "html-intermediate",
    title: "HTML Intermediate: Building Better Pages",
    level: "intermediate",
    age: "Ages 10-14",
    xp: 1200,
    hours: 12,
    language: "html",
    gradient: "from-orange-500 to-rose-500",
    description:
      "Level up your HTML skills! Learn about forms, tables, semantic elements, and how to organize your code like a pro. Build more complex and interactive webpages.",
    lessons: [
      { title: "Quick Review: HTML Foundations", description: "Refresh your memory on HTML basics before diving deeper", xp: 40 },
      { title: "The Power of Divs and Spans", description: "Learn to group and organize your content with <div> and <span> containers", xp: 80 },
      { title: "Semantic HTML: Code That Makes Sense", description: "Use <header>, <nav>, <main>, <section>, <article>, and <footer> to structure pages properly", xp: 100 },
      { title: "Building Tables", description: "Create data tables with <table>, <tr>, <th>, and <td> - perfect for schedules and scores!", xp: 90 },
      { title: "Forms Part 1: Text Inputs", description: "Create forms with text inputs, labels, and the basics of collecting user data", xp: 100 },
      { title: "Forms Part 2: Buttons and Choices", description: "Add checkboxes, radio buttons, dropdowns, and submit buttons to your forms", xp: 100 },
      { title: "Embedding Videos and Audio", description: "Add multimedia to your pages with <video> and <audio> tags", xp: 80 },
      { title: "HTML Attributes Deep Dive", description: "Master id, class, title, and other attributes that make HTML powerful", xp: 90 },
      { title: "Commenting Your Code", description: "Learn to write helpful comments so others (and future you!) can understand your code", xp: 60 },
      { title: "Project: Interactive Quiz Page", description: "Build a fun quiz webpage with forms, images, and proper structure", xp: 150 },
    ],
  },

  // LEVEL 3: HTML ADVANCED
  {
    id: "html-advanced",
    title: "HTML Advanced: Deep Dive",
    level: "intermediate",
    age: "Ages 11-15",
    xp: 1500,
    hours: 14,
    language: "html",
    gradient: "from-rose-400 to-orange-500",
    description:
      "Take your HTML knowledge to the next level! Explore advanced layout techniques, multimedia embedding, and prepare for complex web projects.",
    lessons: [
      { title: "Review: Intermediate Concepts", description: "Quick recap of semantic HTML, forms, and tables", xp: 50 },
      { title: "Advanced Form Techniques", description: "Form validation, fieldsets, and accessible form design", xp: 120 },
      { title: "HTML5 Input Types", description: "Discover date pickers, color pickers, range sliders, and more", xp: 100 },
      { title: "Figure and Figcaption", description: "Properly captioning images and diagrams", xp: 80 },
      { title: "Details and Summary", description: "Create expandable/collapsible content sections", xp: 80 },
      { title: "Dialog Element", description: "Build modal popups with native HTML", xp: 100 },
      { title: "Progress and Meter", description: "Show progress bars and measurement indicators", xp: 80 },
      { title: "Time and Address Elements", description: "Mark up dates, times, and contact info semantically", xp: 70 },
      { title: "Advanced Table Features", description: "Colgroups, headers, and accessible data tables", xp: 100 },
      { title: "Project: Dashboard Page", description: "Build an interactive dashboard with forms, tables, and progress indicators", xp: 180 },
    ],
  },

  // LEVEL 4: HTML EXPERT
  {
    id: "html-expert",
    title: "HTML Expert: Pro Techniques",
    level: "expert",
    age: "Ages 12-16",
    xp: 1800,
    hours: 15,
    language: "html",
    gradient: "from-rose-500 to-red-600",
    description:
      "Become an HTML expert! Master advanced features like iframes, meta tags, accessibility, and HTML5 APIs. Learn professional techniques used by real web developers.",
    lessons: [
      { title: "HTML5: The Modern Standard", description: "Explore the newest HTML5 features and why they matter", xp: 80 },
      { title: "Meta Tags for Better Websites", description: "Use meta tags for SEO, social sharing, and mobile optimization", xp: 120 },
      { title: "Accessibility (A11y) Matters", description: "Make your websites usable by everyone with ARIA labels and accessibility best practices", xp: 150 },
      { title: "IFrames: Websites Inside Websites", description: "Embed external content like maps and videos using <iframe>", xp: 100 },
      { title: "HTML5 Canvas Basics", description: "Draw graphics and create simple animations with the <canvas> element", xp: 140 },
      { title: "Data Attributes", description: "Store custom data in your HTML with data-* attributes", xp: 100 },
      { title: "Picture Element and Responsive Images", description: "Serve different images for different screen sizes", xp: 120 },
      { title: "HTML Validation and Debugging", description: "Find and fix errors in your HTML code like a pro", xp: 100 },
      { title: "SEO-Friendly HTML Structure", description: "Structure your pages so search engines can find them easily", xp: 130 },
      { title: "Project: Portfolio Website", description: "Build a professional portfolio site showcasing your work", xp: 200 },
    ],
  },

  // LEVEL 5: HTML MASTER
  {
    id: "html-master",
    title: "HTML Master: Industry Ready",
    level: "master",
    age: "Ages 14-18",
    xp: 2500,
    hours: 20,
    language: "html",
    gradient: "from-red-600 to-purple-600",
    description:
      "Master HTML development! Learn about web components, templating, performance optimization, and industry best practices used by professional developers worldwide.",
    lessons: [
      { title: "HTML in the Real World", description: "How professional developers use HTML in modern web applications", xp: 100 },
      { title: "Template Element and Slots", description: "Create reusable HTML templates with <template> and <slot>", xp: 180 },
      { title: "Introduction to Web Components", description: "Build custom HTML elements that work anywhere", xp: 200 },
      { title: "Progressive Enhancement", description: "Build websites that work for everyone, then enhance for modern browsers", xp: 150 },
      { title: "HTML Performance Optimization", description: "Load your pages faster with lazy loading, preloading, and prefetching", xp: 180 },
      { title: "Microdata and Schema.org", description: "Add structured data to help search engines understand your content", xp: 160 },
      { title: "HTML Email Development", description: "Create HTML emails that look great in every email client", xp: 200 },
      { title: "SVG in HTML", description: "Use scalable vector graphics for icons and illustrations", xp: 150 },
      { title: "HTML APIs: Geolocation & Storage", description: "Use browser APIs for location, local storage, and more", xp: 180 },
      { title: "Final Project: Full Website", description: "Build a complete, professional, multi-page website from scratch", xp: 300 },
    ],
  },
  {
    id: "css-magic",
    title: "CSS Magic: Style Your Pages",
    level: "beginner",
    age: "Ages 7-10",
    xp: 500,
    hours: 5,
    language: "css",
    gradient: "from-blue-400 to-cyan-500",
    description:
      "Make your websites beautiful with colors, fonts, and layouts. Learn how to make things look amazing.",
    lessons: [
      { title: "Color & Typography", description: "Set colors, fonts, and sizing", xp: 60 },
      { title: "Layouts & Spacing", description: "Arrange elements with margin, padding, and flexbox", xp: 60 },
      { title: "Buttons & Cards", description: "Design fun UI elements kids love", xp: 80 },
    ],
  },
  {
    id: "js-adventures",
    title: "JavaScript Adventures",
    level: "beginner",
    age: "Ages 11-14",
    xp: 750,
    hours: 8,
    language: "javascript",
    gradient: "from-amber-400 to-orange-500",
    description:
      "Add interactivity to your websites! Make buttons click, create animations, and build mini-games.",
    lessons: [
      { title: "Variables & Strings", description: "Store and show information", xp: 80 },
      { title: "Functions & Events", description: "React to clicks and keypresses", xp: 90 },
      { title: "Mini Game", description: "Build a simple clicker game", xp: 120 },
    ],
  },
  {
    id: "python-young",
    title: "Python for Young Coders",
    level: "beginner",
    age: "Ages 11-14",
    xp: 750,
    hours: 10,
    language: "python",
    gradient: "from-green-400 to-emerald-500",
    description:
      "Start your programming journey with Python! Create games, solve puzzles, and automate fun tasks.",
    lessons: [
      { title: "Print & Variables", description: "Say hello to Python and store values", xp: 70 },
      { title: "Loops & Logic", description: "Make code repeat and decide paths", xp: 90 },
      { title: "Text Adventure", description: "Build a choose-your-own-adventure game", xp: 140 },
    ],
  },
  {
    id: "roblox-creator",
    title: "Roblox Game Creator",
    level: "beginner",
    age: "Ages 11-14",
    xp: 1000,
    hours: 12,
    language: "roblox",
    gradient: "from-rose-400 to-pink-500",
    description:
      "Build your own Roblox games! Use Lua scripting to create obstacles, power-ups, and mini-games.",
    lessons: [
      { title: "Studio Setup", description: "Get comfortable in Roblox Studio", xp: 60 },
      { title: "Scripting Basics", description: "Make parts move and react", xp: 120 },
      { title: "Publish & Share", description: "Ship your first playable obby", xp: 200 },
    ],
  },
  {
    id: "web-advanced",
    title: "Advanced Web Development",
    level: "intermediate",
    age: "Ages 15-18",
    xp: 1500,
    hours: 20,
    language: "javascript",
    gradient: "from-purple-400 to-indigo-500",
    description:
      "Take your web skills to the next level. Build responsive layouts, components, and deploy real projects.",
    lessons: [
      { title: "Components & State", description: "Think in reusable UI blocks", xp: 120 },
      { title: "APIs & Data", description: "Fetch and render live data", xp: 160 },
      { title: "Deploy & Share", description: "Publish your project to the web", xp: 200 },
    ],
  },
  // Engineering Courses

  // LEVEL 1: ENGINEERING BEGINNER
  {
    id: "engineering-beginner",
    title: "Engineering Explorers: Build & Create",
    level: "beginner",
    age: "Ages 7-10",
    xp: 1200,
    hours: 10,
    language: "engineering",
    gradient: "from-amber-400 to-orange-500",
    description:
      "Discover the exciting world of Engineering! Learn how engineers solve problems, design solutions, and build amazing things that help people every day.",
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
      { title: "Project: Design a Bridge", description: "Design and test your own bridge that can hold weight!", xp: 150 },
    ],
  },

  // LEVEL 2: ENGINEERING INTERMEDIATE
  {
    id: "engineering-intermediate",
    title: "Junior Engineers: Machines & Mechanisms",
    level: "intermediate",
    age: "Ages 11-14",
    xp: 2000,
    hours: 18,
    language: "engineering",
    gradient: "from-orange-500 to-red-500",
    description:
      "Dive deeper into mechanical engineering! Learn about gears, motors, energy transfer, and build your own working mechanisms and machines.",
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
      { title: "Project: Motorized Machine", description: "Build a working motorized machine from your own design!", xp: 220 },
    ],
  },

  // LEVEL 3: ENGINEERING ADVANCED
  {
    id: "engineering-advanced",
    title: "Engineering Principles & Physics",
    level: "advanced",
    age: "Ages 15-18",
    xp: 3000,
    hours: 28,
    language: "engineering",
    gradient: "from-red-500 to-pink-600",
    description:
      "Master the physics behind engineering! Learn statics, dynamics, thermodynamics, and apply mathematical principles to solve complex engineering problems.",
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
      { title: "Project: Engineering Analysis", description: "Complete a full engineering analysis project!", xp: 300 },
    ],
  },

  // LEVEL 4: ENGINEERING EXPERT
  {
    id: "engineering-expert",
    title: "Applied Engineering: Real-World Projects",
    level: "expert",
    age: "Ages 15-18",
    xp: 4000,
    hours: 38,
    language: "engineering",
    gradient: "from-pink-500 to-purple-600",
    description:
      "Apply engineering knowledge to real-world challenges! Work on complex projects involving multiple engineering disciplines, from concept to completion.",
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
      { title: "Project: Integrated Engineering System", description: "Build a complete integrated engineering project!", xp: 370 },
    ],
  },

  // LEVEL 5: ENGINEERING MASTER
  {
    id: "engineering-master",
    title: "Engineering Professional: Industry Ready",
    level: "master",
    age: "Ages 16-18+",
    xp: 5500,
    hours: 50,
    language: "engineering",
    gradient: "from-purple-500 to-indigo-600",
    description:
      "Become a professional engineer! Master advanced topics, industry standards, professional ethics, and build a portfolio of impressive engineering projects.",
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
      { title: "Final Project: Capstone Engineering Design", description: "Complete a comprehensive engineering capstone project!", xp: 500 },
    ],
  },

  // AI & Machine Learning Courses

  // LEVEL 1: AI/ML BEGINNER
  {
    id: "ai-ml-beginner",
    title: "AI Adventures: Meet the Machines",
    level: "beginner",
    age: "Ages 7-10",
    xp: 1200,
    hours: 10,
    language: "ai_ml",
    gradient: "from-violet-400 to-purple-500",
    description:
      "Discover the magical world of Artificial Intelligence! Learn what AI is, how it helps us every day, and start training your first simple AI models through fun, interactive activities.",
    lessons: [
      { title: "What is Artificial Intelligence?", description: "Discover what makes AI special and how it's different from regular computer programs!", xp: 80 },
      { title: "AI All Around Us", description: "Find AI in your daily life - from voice assistants to recommendation systems!", xp: 80 },
      { title: "How Computers Learn", description: "Understand the basics of how machines can learn from examples, just like you!", xp: 100 },
      { title: "Teaching by Examples", description: "Learn how to teach a computer by showing it lots of pictures and examples", xp: 100 },
      { title: "Pattern Detectives", description: "Help AI find patterns in data - like spotting cats vs dogs in photos!", xp: 110 },
      { title: "Smart Predictions", description: "Make predictions like the weather or what movie you might like", xp: 100 },
      { title: "Talking to AI", description: "Learn how chatbots and voice assistants understand what you say", xp: 110 },
      { title: "AI Art and Creativity", description: "Explore how AI can create art, music, and stories!", xp: 120 },
      { title: "AI Ethics: Being Responsible", description: "Learn why it's important to use AI fairly and responsibly", xp: 90 },
      { title: "Project: Train Your First AI", description: "Build a simple image classifier that can recognize your drawings!", xp: 150 },
    ],
  },

  // LEVEL 2: AI/ML INTERMEDIATE
  {
    id: "ai-ml-intermediate",
    title: "Machine Learning Explorers",
    level: "intermediate",
    age: "Ages 11-14",
    xp: 2000,
    hours: 18,
    language: "ai_ml",
    gradient: "from-purple-500 to-indigo-500",
    description:
      "Dive deeper into Machine Learning! Learn about different types of ML, work with real datasets, and build projects that can classify images, predict outcomes, and understand text.",
    lessons: [
      { title: "Types of Machine Learning", description: "Explore supervised, unsupervised, and reinforcement learning", xp: 120 },
      { title: "Data: The Fuel for AI", description: "Understand why data matters and how to prepare it for learning", xp: 130 },
      { title: "Features and Labels", description: "Learn to identify what computers need to learn from", xp: 130 },
      { title: "Training and Testing", description: "Split data properly to make sure your AI actually learned!", xp: 140 },
      { title: "Classification: Sorting Things", description: "Build models that put things into categories", xp: 150 },
      { title: "Regression: Predicting Numbers", description: "Create models that predict continuous values like prices", xp: 150 },
      { title: "Decision Trees", description: "Visualize how AI makes decisions step by step", xp: 140 },
      { title: "Measuring Success", description: "Learn accuracy, precision, and how to know if your AI is good", xp: 130 },
      { title: "Overfitting: When AI Memorizes", description: "Prevent your AI from just memorizing instead of learning", xp: 140 },
      { title: "Introduction to Python for ML", description: "Set up Python and essential ML libraries", xp: 160 },
      { title: "Your First Python ML Model", description: "Code a real machine learning model in Python!", xp: 180 },
      { title: "Project: Prediction Machine", description: "Build an AI that predicts outcomes from real-world data!", xp: 220 },
    ],
  },

  // LEVEL 3: AI/ML ADVANCED
  {
    id: "ai-ml-advanced",
    title: "Neural Networks & Deep Learning",
    level: "advanced",
    age: "Ages 14-17",
    xp: 3000,
    hours: 28,
    language: "ai_ml",
    gradient: "from-indigo-500 to-blue-600",
    description:
      "Enter the world of Deep Learning! Understand how neural networks work, build image recognition systems, and create AI that can process natural language.",
    lessons: [
      { title: "The Brain Connection", description: "How neural networks are inspired by the human brain", xp: 150 },
      { title: "Neurons and Layers", description: "Understand the building blocks of neural networks", xp: 170 },
      { title: "Activation Functions", description: "Learn how neurons decide to 'fire' or not", xp: 160 },
      { title: "Forward Propagation", description: "Follow data through a neural network step by step", xp: 180 },
      { title: "Backpropagation: Learning from Mistakes", description: "Discover how neural networks learn by adjusting weights", xp: 200 },
      { title: "Loss Functions and Optimization", description: "Measure errors and minimize them effectively", xp: 180 },
      { title: "Building Neural Networks with TensorFlow", description: "Create your first neural network with real code", xp: 220 },
      { title: "Convolutional Neural Networks (CNNs)", description: "Powerful networks designed for image processing", xp: 220 },
      { title: "Image Classification Project", description: "Build an AI that recognizes objects in photos", xp: 250 },
      { title: "Recurrent Neural Networks (RNNs)", description: "Networks that remember sequences, perfect for text", xp: 200 },
      { title: "Natural Language Processing Basics", description: "Teach AI to understand and generate human language", xp: 200 },
      { title: "Sentiment Analysis", description: "Build AI that understands emotions in text", xp: 180 },
      { title: "Transfer Learning", description: "Use pre-trained models to supercharge your AI", xp: 190 },
      { title: "Project: Smart Image Analyzer", description: "Create an advanced image classification system!", xp: 300 },
    ],
  },

  // LEVEL 4: AI/ML EXPERT
  {
    id: "ai-ml-expert",
    title: "Advanced AI Applications",
    level: "expert",
    age: "Ages 15-18",
    xp: 4000,
    hours: 38,
    language: "ai_ml",
    gradient: "from-blue-500 to-cyan-600",
    description:
      "Master advanced AI techniques! Build generative models, implement reinforcement learning, create chatbots, and deploy AI applications to the real world.",
    lessons: [
      { title: "Advanced CNN Architectures", description: "ResNet, VGG, and modern image architectures", xp: 220 },
      { title: "Object Detection", description: "Locate and identify multiple objects in images", xp: 250 },
      { title: "Image Segmentation", description: "Pixel-by-pixel understanding of images", xp: 230 },
      { title: "Generative Adversarial Networks (GANs)", description: "AI that creates new, realistic content", xp: 280 },
      { title: "Autoencoders", description: "Compress and reconstruct data for various applications", xp: 220 },
      { title: "Transformers and Attention", description: "The architecture behind modern language AI", xp: 280 },
      { title: "Large Language Models", description: "Understand how ChatGPT-like systems work", xp: 260 },
      { title: "Building a Chatbot", description: "Create an intelligent conversational AI", xp: 280 },
      { title: "Reinforcement Learning Basics", description: "AI that learns through trial and error", xp: 250 },
      { title: "Q-Learning and Deep Q-Networks", description: "Train AI to play games and make decisions", xp: 280 },
      { title: "AI Model Deployment", description: "Take your AI from notebook to production", xp: 240 },
      { title: "APIs and Serving Models", description: "Make your AI accessible through web services", xp: 240 },
      { title: "Responsible AI Development", description: "Bias, fairness, and ethical considerations", xp: 200 },
      { title: "Project: Full-Stack AI Application", description: "Build and deploy a complete AI-powered application!", xp: 370 },
    ],
  },

  // LEVEL 5: AI/ML MASTER
  {
    id: "ai-ml-master",
    title: "AI Engineer: Industry Ready",
    level: "master",
    age: "Ages 16-18+",
    xp: 5500,
    hours: 50,
    language: "ai_ml",
    gradient: "from-cyan-500 to-emerald-600",
    description:
      "Become a professional AI engineer! Master MLOps, work with cutting-edge models, understand research papers, and build portfolio-worthy projects used in industry.",
    lessons: [
      { title: "AI Industry Landscape", description: "Career paths, companies, and trends in AI", xp: 250 },
      { title: "MLOps Fundamentals", description: "Production ML systems and infrastructure", xp: 300 },
      { title: "Data Pipelines at Scale", description: "Handle massive datasets for enterprise AI", xp: 280 },
      { title: "Model Versioning and Experiment Tracking", description: "Professional tools for ML development", xp: 280 },
      { title: "Hyperparameter Optimization", description: "Systematically tune models for best performance", xp: 260 },
      { title: "Distributed Training", description: "Train large models across multiple machines", xp: 300 },
      { title: "Model Compression and Optimization", description: "Make AI fast and efficient for deployment", xp: 280 },
      { title: "Edge AI and Mobile Deployment", description: "Run AI on phones and embedded devices", xp: 300 },
      { title: "Advanced NLP: Beyond Basics", description: "Question answering, summarization, and more", xp: 300 },
      { title: "Computer Vision: Advanced Topics", description: "3D vision, video analysis, and pose estimation", xp: 300 },
      { title: "Multimodal AI", description: "Systems that understand text, images, and audio together", xp: 320 },
      { title: "Reading AI Research Papers", description: "Stay current by understanding academic publications", xp: 260 },
      { title: "Contributing to Open Source AI", description: "Join the global AI development community", xp: 280 },
      { title: "Building Your AI Portfolio", description: "Showcase your work to employers", xp: 280 },
      { title: "AI System Design", description: "Architect large-scale AI solutions", xp: 320 },
      { title: "Final Project: Production AI System", description: "Build a complete, industry-grade AI project!", xp: 500 },
    ],
  },

  // Robotics Courses

  // ============================================
  // WEB DEVELOPMENT - Complete Learning Path
  // ============================================

  // LEVEL 1: WEB DEVELOPMENT BEGINNER
  {
    id: "webdev-beginner",
    title: "Web Development Foundations",
    level: "beginner",
    age: "Ages 11-14",
    xp: 1500,
    hours: 15,
    language: "web_development",
    gradient: "from-sky-400 to-blue-500",
    description:
      "Start your journey to become a web developer! Learn the fundamentals of HTML, CSS, and JavaScript to create your first interactive websites from scratch.",
    lessons: [
      { title: "Welcome to Web Development", description: "Discover how the internet works and what web developers do - your journey starts here!", xp: 50 },
      { title: "Setting Up Your Developer Environment", description: "Install VS Code, set up your workspace, and learn essential developer tools", xp: 60 },
      { title: "HTML Fundamentals: Structure", description: "Learn HTML tags, elements, and how to structure a webpage with headings, paragraphs, and lists", xp: 80 },
      { title: "HTML Fundamentals: Content", description: "Add images, links, and multimedia content to your webpages", xp: 80 },
      { title: "HTML Forms & Inputs", description: "Create interactive forms to collect user information", xp: 90 },
      { title: "CSS Basics: Styling Text", description: "Add colors, fonts, and text styling to make your pages beautiful", xp: 80 },
      { title: "CSS Basics: Box Model", description: "Understand margin, padding, borders, and how elements take up space", xp: 100 },
      { title: "CSS Layouts with Flexbox", description: "Arrange elements on your page using the powerful Flexbox system", xp: 120 },
      { title: "Introduction to JavaScript", description: "Write your first JavaScript code - variables, data types, and console output", xp: 100 },
      { title: "JavaScript: Making Decisions", description: "Use if/else statements and comparison operators to add logic to your code", xp: 110 },
      { title: "JavaScript: DOM Basics", description: "Select HTML elements and change them dynamically with JavaScript", xp: 120 },
      { title: "JavaScript: Events", description: "Respond to clicks, keyboard input, and other user interactions", xp: 120 },
      { title: "Project: Personal Portfolio Page", description: "Build a complete personal portfolio showcasing what you've learned!", xp: 200 },
    ],
  },

  // LEVEL 2: WEB DEVELOPMENT INTERMEDIATE
  {
    id: "webdev-intermediate",
    title: "Web Development: Building Real Websites",
    level: "intermediate",
    age: "Ages 12-15",
    xp: 2200,
    hours: 22,
    language: "web_development",
    gradient: "from-blue-500 to-indigo-500",
    description:
      "Take your web skills to the next level! Master responsive design, advanced CSS, JavaScript functions, and build dynamic, mobile-friendly websites.",
    lessons: [
      { title: "Review & Advanced HTML5", description: "Refresh HTML basics and explore semantic HTML5 elements for better structure", xp: 70 },
      { title: "CSS Grid Layouts", description: "Create complex, two-dimensional layouts using CSS Grid", xp: 120 },
      { title: "Responsive Design Principles", description: "Make your websites look great on phones, tablets, and desktops", xp: 130 },
      { title: "Media Queries & Breakpoints", description: "Write CSS that adapts to different screen sizes", xp: 120 },
      { title: "CSS Transitions & Animations", description: "Add smooth animations and hover effects to your elements", xp: 140 },
      { title: "JavaScript Functions Deep Dive", description: "Master function declarations, expressions, arrow functions, and scope", xp: 150 },
      { title: "JavaScript Arrays & Objects", description: "Work with collections of data and complex data structures", xp: 150 },
      { title: "Array Methods: map, filter, reduce", description: "Transform and manipulate data like a pro with powerful array methods", xp: 160 },
      { title: "DOM Manipulation Advanced", description: "Create, remove, and modify elements dynamically - build interactive UIs", xp: 150 },
      { title: "Form Validation with JavaScript", description: "Validate user input and provide helpful feedback before submission", xp: 140 },
      { title: "Local Storage & Session Storage", description: "Save data in the browser to persist user preferences and app state", xp: 130 },
      { title: "Introduction to Version Control", description: "Learn Git basics - commit, push, pull, and collaborate on code", xp: 140 },
      { title: "Project: Responsive Business Website", description: "Build a fully responsive, multi-page business website with a contact form", xp: 250 },
    ],
  },

  // LEVEL 3: WEB DEVELOPMENT ADVANCED
  {
    id: "webdev-advanced",
    title: "Web Development: Modern JavaScript & APIs",
    level: "advanced",
    age: "Ages 14-17",
    xp: 3000,
    hours: 30,
    language: "web_development",
    gradient: "from-indigo-500 to-purple-600",
    description:
      "Master modern JavaScript (ES6+), work with APIs, handle asynchronous code, and start building dynamic web applications that fetch real data.",
    lessons: [
      { title: "ES6+ Modern JavaScript", description: "Destructuring, spread operator, template literals, and modern JS features", xp: 150 },
      { title: "JavaScript Classes & OOP", description: "Object-oriented programming with classes, constructors, and inheritance", xp: 170 },
      { title: "Modules & Code Organization", description: "Import/export modules and organize your code into reusable pieces", xp: 150 },
      { title: "Asynchronous JavaScript: Callbacks", description: "Understand async programming and how JavaScript handles non-blocking code", xp: 160 },
      { title: "Promises in JavaScript", description: "Master Promises for cleaner async code and better error handling", xp: 180 },
      { title: "Async/Await Mastery", description: "Write async code that reads like synchronous code using async/await", xp: 180 },
      { title: "Fetch API: Getting Data", description: "Make HTTP requests and retrieve data from external APIs", xp: 200 },
      { title: "Working with JSON Data", description: "Parse, manipulate, and display JSON data from APIs", xp: 160 },
      { title: "Error Handling & Debugging", description: "Handle errors gracefully and debug like a professional developer", xp: 150 },
      { title: "Building a REST API Client", description: "Create a complete client that communicates with REST APIs", xp: 200 },
      { title: "Introduction to NPM & Packages", description: "Use the Node Package Manager to add powerful libraries to your projects", xp: 150 },
      { title: "Build Tools: Bundlers & Transpilers", description: "Set up Webpack or Vite to bundle and optimize your code", xp: 180 },
      { title: "CSS Preprocessors: Sass/SCSS", description: "Write more powerful CSS with variables, nesting, and mixins", xp: 160 },
      { title: "Project: Weather Dashboard App", description: "Build a real weather app that fetches live data from a weather API", xp: 300 },
    ],
  },

  // LEVEL 4: WEB DEVELOPMENT EXPERT
  {
    id: "webdev-expert",
    title: "Web Development: Full-Stack Foundations",
    level: "expert",
    age: "Ages 15-18",
    xp: 4000,
    hours: 40,
    language: "web_development",
    gradient: "from-purple-500 to-pink-600",
    description:
      "Become a full-stack developer! Learn React for frontend, Node.js for backend, databases, authentication, and deploy real applications to the cloud.",
    lessons: [
      { title: "Introduction to React", description: "Learn component-based architecture and why React dominates modern web development", xp: 200 },
      { title: "React Components & JSX", description: "Create reusable UI components using JSX syntax", xp: 200 },
      { title: "React Props & Data Flow", description: "Pass data between components and understand one-way data flow", xp: 180 },
      { title: "React State & useState Hook", description: "Manage component state and create interactive UIs", xp: 220 },
      { title: "React useEffect & Side Effects", description: "Handle side effects, API calls, and component lifecycle", xp: 220 },
      { title: "React Forms & Controlled Components", description: "Build forms and handle user input in React", xp: 180 },
      { title: "React Router: Multi-Page Apps", description: "Add client-side routing to create single-page applications", xp: 200 },
      { title: "Introduction to Node.js", description: "Run JavaScript on the server and understand the Node.js runtime", xp: 200 },
      { title: "Express.js: Building APIs", description: "Create REST APIs with Express.js - routes, middleware, and responses", xp: 250 },
      { title: "Database Fundamentals: SQL vs NoSQL", description: "Understand database types and when to use each", xp: 180 },
      { title: "MongoDB & Mongoose", description: "Store and retrieve data using MongoDB and the Mongoose ODM", xp: 250 },
      { title: "User Authentication: JWT", description: "Implement secure user login with JSON Web Tokens", xp: 280 },
      { title: "Protecting Routes & Authorization", description: "Secure your API endpoints and implement role-based access", xp: 220 },
      { title: "Connecting Frontend to Backend", description: "Integrate your React app with your Express API", xp: 250 },
      { title: "Deployment: Vercel & Railway", description: "Deploy your full-stack app to production on the cloud", xp: 250 },
      { title: "Project: Full-Stack Task Manager", description: "Build a complete task management app with user auth, database, and deployment", xp: 400 },
    ],
  },

  // LEVEL 5: WEB DEVELOPMENT MASTER
  {
    id: "webdev-master",
    title: "Web Development: Professional Mastery",
    level: "master",
    age: "Ages 16-18+",
    xp: 5500,
    hours: 55,
    language: "web_development",
    gradient: "from-pink-500 to-red-600",
    description:
      "Master professional web development! Learn TypeScript, advanced state management, testing, CI/CD, performance optimization, and industry best practices used by top companies.",
    lessons: [
      { title: "TypeScript Fundamentals", description: "Add static typing to JavaScript for safer, more maintainable code", xp: 250 },
      { title: "TypeScript with React", description: "Build type-safe React applications with TypeScript", xp: 280 },
      { title: "Advanced React Patterns", description: "Higher-order components, render props, compound components, and custom hooks", xp: 300 },
      { title: "State Management: Context & Reducers", description: "Manage complex state with useContext and useReducer", xp: 280 },
      { title: "State Management: Redux Toolkit", description: "Implement global state management for large applications", xp: 300 },
      { title: "React Query & Data Fetching", description: "Advanced data fetching, caching, and server state management", xp: 280 },
      { title: "Testing: Unit Tests with Jest", description: "Write unit tests to ensure your code works correctly", xp: 280 },
      { title: "Testing: React Testing Library", description: "Test React components with user-focused testing strategies", xp: 300 },
      { title: "Testing: E2E with Cypress", description: "Write end-to-end tests that simulate real user behavior", xp: 280 },
      { title: "API Design Best Practices", description: "Design RESTful APIs that are intuitive and scalable", xp: 250 },
      { title: "Database Optimization", description: "Indexing, query optimization, and database performance tuning", xp: 280 },
      { title: "Authentication: OAuth & Social Login", description: "Implement third-party authentication (Google, GitHub, etc.)", xp: 300 },
      { title: "Security Best Practices", description: "Protect against XSS, CSRF, SQL injection, and other vulnerabilities", xp: 300 },
      { title: "Performance Optimization", description: "Lazy loading, code splitting, memoization, and web vitals", xp: 300 },
      { title: "CI/CD Pipelines", description: "Automate testing and deployment with GitHub Actions", xp: 280 },
      { title: "Docker & Containerization", description: "Package your applications in containers for consistent deployment", xp: 300 },
      { title: "System Design Fundamentals", description: "Architecture patterns, scalability, and designing for growth", xp: 320 },
      { title: "Real-time Features: WebSockets", description: "Add real-time updates with WebSockets and Socket.io", xp: 280 },
      { title: "GraphQL Introduction", description: "Query and mutate data efficiently with GraphQL", xp: 280 },
      { title: "Final Project: Production-Ready App", description: "Build a complete, tested, production-ready full-stack application with CI/CD", xp: 500 },
    ],
  },
  // Game Development Courses
  {
    id: "game-dev-intro",
    title: "Introduction to Game Development",
    level: "beginner",
    age: "Ages 7-10",
    xp: 700,
    hours: 8,
    language: "game_development",
    gradient: "from-emerald-500 to-green-600",
    description:
      "Start making games! Learn the basics of game design, characters, levels, and how to bring your game ideas to life.",
    lessons: [
      { title: "What Makes a Great Game?", description: "Explore the elements that make games fun and engaging", xp: 50 },
      { title: "Characters & Stories", description: "Create memorable game characters and storylines", xp: 70 },
      { title: "Level Design Basics", description: "Design exciting levels and environments", xp: 80 },
      { title: "Game Controls", description: "Make characters move and respond to player input", xp: 90 },
      { title: "Your First Game", description: "Build a complete simple game from scratch!", xp: 120 },
    ],
  },
  {
    id: "game-dev-intermediate",
    title: "2D Game Development",
    level: "intermediate",
    age: "Ages 11-14",
    xp: 1100,
    hours: 14,
    language: "game_development",
    gradient: "from-green-500 to-teal-600",
    description:
      "Build awesome 2D games! Learn sprites, animations, physics, and game mechanics to create platformers and arcade games.",
    lessons: [
      { title: "Sprites & Animation", description: "Create and animate game graphics", xp: 100 },
      { title: "Game Physics", description: "Add gravity, collisions, and movement", xp: 120 },
      { title: "Enemies & AI", description: "Create computer-controlled opponents", xp: 130 },
      { title: "Power-ups & Scoring", description: "Add collectibles and keep track of points", xp: 100 },
      { title: "Sound Effects & Music", description: "Make your game come alive with audio", xp: 80 },
      { title: "Complete Game Project", description: "Build a full 2D platformer game", xp: 180 },
    ],
  },
  {
    id: "game-dev-advanced",
    title: "Advanced Game Programming",
    level: "advanced",
    age: "Ages 14-18",
    xp: 1800,
    hours: 20,
    language: "game_development",
    gradient: "from-teal-500 to-cyan-600",
    description:
      "Master game programming! Learn advanced game mechanics, multiplayer systems, and professional game development techniques.",
    lessons: [
      { title: "Game Architecture", description: "Structure your game code like a pro", xp: 150 },
      { title: "Advanced Physics", description: "Realistic movement and collision systems", xp: 180 },
      { title: "AI & Pathfinding", description: "Smart enemies that navigate and strategize", xp: 200 },
      { title: "Multiplayer Basics", description: "Add online multiplayer to your games", xp: 220 },
      { title: "Game Optimization", description: "Make your games run smooth and fast", xp: 150 },
      { title: "Publishing Your Game", description: "Release your game for others to play", xp: 200 },
    ],
  },
  // Mobile Development Courses
  {
    id: "mobile-dev-intro",
    title: "Introduction to Mobile Apps",
    level: "beginner",
    age: "Ages 11-14",
    xp: 800,
    hours: 10,
    language: "mobile_development",
    gradient: "from-pink-500 to-rose-600",
    description:
      "Start building mobile apps! Learn the fundamentals of mobile development and create your first app for phones and tablets.",
    lessons: [
      { title: "What are Mobile Apps?", description: "Understand how apps work on phones and tablets", xp: 60 },
      { title: "App Design Basics", description: "Learn to design user-friendly mobile interfaces", xp: 80 },
      { title: "Your First App", description: "Build a simple mobile app from scratch", xp: 100 },
      { title: "Buttons & Navigation", description: "Add interactive elements and screens", xp: 100 },
      { title: "Publishing Your App", description: "Learn how apps get to the app store", xp: 80 },
    ],
  },
  {
    id: "mobile-dev-intermediate",
    title: "Mobile App Development",
    level: "intermediate",
    age: "Ages 13-16",
    xp: 1200,
    hours: 15,
    language: "mobile_development",
    gradient: "from-rose-500 to-fuchsia-600",
    description:
      "Take your mobile skills further! Build interactive apps with data storage, animations, and real functionality.",
    lessons: [
      { title: "Advanced UI Components", description: "Create lists, cards, and complex layouts", xp: 120 },
      { title: "Working with Data", description: "Store and retrieve app data locally", xp: 140 },
      { title: "APIs & Internet", description: "Connect your app to online services", xp: 150 },
      { title: "Animations & Effects", description: "Make your app feel smooth and responsive", xp: 120 },
      { title: "Complete App Project", description: "Build a fully functional mobile app", xp: 200 },
    ],
  },
  // Career Prep Courses

];

import { PrismaClient, QuestionType } from "../generated/prisma-client";

const prisma = new PrismaClient();

// AI & Machine Learning Courses - Beginner to Master
const aiMlCourses = [
  {
    title: "AI Adventures: Meet the Machines",
    slug: "ai-adventures-meet-the-machines",
    description: "Discover the magical world of Artificial Intelligence! Learn what AI is, how it helps us every day, and start training your first simple AI models through fun, interactive activities.",
    language: "AI_ML",
    level: "BEGINNER",
    ageGroup: "AGES_7_10",
    totalXp: 1200,
    estimatedHours: 10,
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
      { title: "Project: Train Your First AI", description: "Build a simple image classifier that can recognize your drawings!", xp: 150 }
    ]
  },
  {
    title: "Machine Learning Explorers",
    slug: "machine-learning-explorers",
    description: "Dive deeper into Machine Learning! Learn about different types of ML, work with real datasets, and build projects that can classify images, predict outcomes, and understand text.",
    language: "AI_ML",
    level: "INTERMEDIATE",
    ageGroup: "AGES_11_14",
    totalXp: 2000,
    estimatedHours: 18,
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
      { title: "Project: Prediction Machine", description: "Build an AI that predicts outcomes from real-world data!", xp: 220 }
    ]
  },
  {
    title: "Neural Networks & Deep Learning",
    slug: "neural-networks-deep-learning",
    description: "Enter the world of Deep Learning! Understand how neural networks work, build image recognition systems, and create AI that can process natural language.",
    language: "AI_ML",
    level: "ADVANCED",
    ageGroup: "AGES_15_18",
    totalXp: 3000,
    estimatedHours: 28,
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
      { title: "Project: Smart Image Analyzer", description: "Create an advanced image classification system!", xp: 300 }
    ]
  },
  {
    title: "Advanced AI Applications",
    slug: "advanced-ai-applications",
    description: "Master advanced AI techniques! Build generative models, implement reinforcement learning, create chatbots, and deploy AI applications to the real world.",
    language: "AI_ML",
    level: "EXPERT",
    ageGroup: "AGES_15_18",
    totalXp: 4000,
    estimatedHours: 38,
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
      { title: "Project: Full-Stack AI Application", description: "Build and deploy a complete AI-powered application!", xp: 370 }
    ]
  },
  {
    title: "AI Engineer: Industry Ready",
    slug: "ai-engineer-industry-ready",
    description: "Become a professional AI engineer! Master MLOps, work with cutting-edge models, understand research papers, and build portfolio-worthy projects used in industry.",
    language: "AI_ML",
    level: "MASTER",
    ageGroup: "AGES_15_18",
    totalXp: 5500,
    estimatedHours: 50,
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
      { title: "Final Project: Production AI System", description: "Build a complete, industry-grade AI project!", xp: 500 }
    ]
  }
];

// Detailed lesson content for each level
const lessonContentByLevel: Record<string, any[]> = {
  "ai-adventures-meet-the-machines": [
    {
      title: "What is Artificial Intelligence?",
      content: `
<h2>Welcome to the Amazing World of AI!</h2>

<p>Have you ever talked to Siri, Alexa, or Google Assistant? Those are examples of Artificial Intelligence, or AI for short!</p>

<h3>What Makes AI Special?</h3>

<p>Regular computer programs follow exact instructions:</p>
<ul>
<li><strong>Calculator:</strong> "Add 2 + 2" → Always gives 4</li>
<li><strong>Video game:</strong> "Press jump button" → Character jumps</li>
</ul>

<p>But AI is different - it can <strong>learn</strong> and <strong>figure things out</strong>!</p>

<h3>AI Can:</h3>
<ul>
<li>🎨 Recognize your face in photos</li>
<li>🗣️ Understand what you say and talk back</li>
<li>🎮 Play games and get better over time</li>
<li>🔮 Predict what you might like</li>
</ul>

<h3>The Magic of Learning</h3>

<p>Imagine teaching a friend to recognize cats:</p>
<ol>
<li>You show them pictures of cats</li>
<li>They notice patterns: pointy ears, whiskers, fur</li>
<li>Now they can spot cats they've never seen before!</li>
</ol>

<p>That's exactly how AI learns! We show it examples, and it figures out the patterns.</p>

<h3>Fun Fact!</h3>
<p>The term "Artificial Intelligence" was invented in 1956 - that's over 65 years ago! But today's AI is much smarter.</p>
`,
      exampleCode: `# Let's see how AI thinks differently than regular programs!

# REGULAR PROGRAM: Exact rules
def is_it_raining(weather_report):
    if weather_report == "raining":
        return "Bring an umbrella!"
    else:
        return "Enjoy the sunshine!"

# AI APPROACH: Learning from examples
# Instead of writing rules, we SHOW examples:

# Training data (what we teach the AI):
cat_features = ["pointy ears", "whiskers", "meows", "fur"]
dog_features = ["floppy ears", "barks", "fur", "tail wags"]

# The AI learns patterns from these examples!
# Then it can recognize NEW cats and dogs it's never seen.

# This is called MACHINE LEARNING
# The machine learns from examples instead of following rules!

print("AI is different because it LEARNS!")
print("Show it examples → It finds patterns → It makes smart guesses!")`,
      exerciseInstructions: "Think about AI you use every day! List 3 examples of AI in your life and what they help you do.",
      exerciseStarterCode: `# My AI Helpers!

# Example 1: _______________
# What it does: _______________
# How it helps me: _______________

# Example 2: _______________
# What it does: _______________
# How it helps me: _______________

# Example 3: _______________
# What it does: _______________
# How it helps me: _______________

# Bonus: Which one is your favorite and why?
# _______________`,
      quiz: [
        { question: "What makes AI different from regular computer programs?", options: ["AI is faster", "AI can learn from examples", "AI uses more electricity", "AI only works on phones"], correctAnswer: "AI can learn from examples", explanation: "Unlike regular programs that follow exact rules, AI learns patterns from examples and can make smart decisions about new things it's never seen!" },
        { question: "How do we teach AI to recognize cats?", options: ["Write a list of cat rules", "Show it lots of cat pictures", "Tell it cats are fluffy", "Press the cat button"], correctAnswer: "Show it lots of cat pictures", explanation: "We show AI many examples of cats, and it figures out the patterns on its own - like pointy ears and whiskers!" }
      ]
    },
    {
      title: "AI All Around Us",
      content: `
<h2>AI Is Everywhere!</h2>

<p>You might not realize it, but you probably use AI every single day! Let's go on an AI scavenger hunt!</p>

<h3>At Home</h3>
<ul>
<li><strong>Voice Assistants:</strong> Alexa, Siri, Google Assistant understand your voice</li>
<li><strong>Smart Recommendations:</strong> Netflix suggests shows you might like</li>
<li><strong>Photo Organization:</strong> Your phone groups photos by faces</li>
<li><strong>Video Games:</strong> Computer opponents that adapt to how you play</li>
</ul>

<h3>At School</h3>
<ul>
<li><strong>Spelling/Grammar Check:</strong> Suggests corrections as you type</li>
<li><strong>Learning Apps:</strong> Adjust difficulty based on your progress</li>
<li><strong>Language Translation:</strong> Google Translate works in real-time</li>
</ul>

<h3>In Your Pocket</h3>
<ul>
<li><strong>Face Unlock:</strong> Your phone recognizes YOUR face</li>
<li><strong>Autocomplete:</strong> Predicts what you're typing</li>
<li><strong>Photo Filters:</strong> Snapchat filters that follow your face!</li>
</ul>

<h3>Hidden AI</h3>
<ul>
<li><strong>Spam Filters:</strong> Keep junk mail out of your inbox</li>
<li><strong>Search Engines:</strong> Find exactly what you're looking for</li>
<li><strong>Music Playlists:</strong> Spotify creates personalized mixes</li>
</ul>

<h3>Did You Know?</h3>
<p>Every time you search on Google, AI looks through billions of web pages in less than a second to find what you need!</p>
`,
      exampleCode: `# Types of AI You Use Every Day!

# 1. RECOMMENDATION AI
# "If you liked THIS, you might like THAT!"
your_watched_movies = ["Frozen", "Moana", "Encanto"]
# AI notices: You like animated Disney musicals!
# Suggestion: "You might enjoy Coco!"

# 2. VOICE AI
# Converts your voice into text
you_said = "Hey Siri, what's the weather?"
# AI understands: command = "weather", question = True
# Response: "It's sunny and 75 degrees!"

# 3. IMAGE AI
# Recognizes what's in photos
photo_contents = analyze_photo("family_photo.jpg")
# AI finds: ["mom", "dad", "you", "dog", "beach"]

# 4. PREDICTION AI
# Guesses what you'll type next
you_started_typing = "Good mor"
# AI predicts: "Good morning!" or "Good morning, how are you?"

# 5. GAME AI
# Computer opponents that learn!
your_play_style = "aggressive"
# AI adapts: "Player attacks a lot, I should defend more!"

print("AI helps you in ways you might not even notice!")`,
      exerciseInstructions: "Go on an AI scavenger hunt! For each category, find an AI example you've used:",
      exerciseStarterCode: `# AI Scavenger Hunt!

# Find AI in these categories:

# 1. Entertainment (movies, music, games):
# AI Example: _______________
# What it does: _______________

# 2. Communication (texting, calling, email):
# AI Example: _______________
# What it does: _______________

# 3. Photography (camera, photos):
# AI Example: _______________
# What it does: _______________

# 4. Learning (school, homework):
# AI Example: _______________
# What it does: _______________

# 5. Something surprising you didn't expect!
# AI Example: _______________
# What it does: _______________`,
      quiz: [
        { question: "Which of these uses AI?", options: ["A light switch", "Netflix recommendations", "A paper book", "A regular clock"], correctAnswer: "Netflix recommendations", explanation: "Netflix uses AI to learn what shows you like and suggest new ones you might enjoy!" },
        { question: "How does your phone recognize your face?", options: ["Magic", "AI learned what your face looks like", "Someone told it", "Lucky guess"], correctAnswer: "AI learned what your face looks like", explanation: "When you set up Face ID, the AI learns the unique patterns of YOUR face so it can recognize you!" }
      ]
    },
    {
      title: "How Computers Learn",
      content: `
<h2>Teaching Machines to Learn!</h2>

<p>How can a computer learn? It doesn't have a brain! Let's discover the secret...</p>

<h3>Learning Like You Do</h3>

<p>Think about how you learned to recognize dogs:</p>
<ol>
<li>You saw LOTS of dogs (big, small, fluffy, short-haired)</li>
<li>Someone told you "That's a dog!" each time</li>
<li>Your brain noticed patterns (4 legs, fur, barks, tail)</li>
<li>Now you can spot dogs you've never seen before!</li>
</ol>

<h3>Computers Learn the Same Way!</h3>

<ol>
<li><strong>See examples:</strong> We show the computer thousands of pictures</li>
<li><strong>Get labels:</strong> We tell it which ones are dogs</li>
<li><strong>Find patterns:</strong> The computer finds what dogs have in common</li>
<li><strong>Make predictions:</strong> It can now recognize new dogs!</li>
</ol>

<h3>The Three Steps of Machine Learning</h3>

<ul>
<li><strong>1. Training:</strong> Show the AI lots of examples</li>
<li><strong>2. Learning:</strong> AI figures out the patterns</li>
<li><strong>3. Predicting:</strong> AI uses patterns on new data</li>
</ul>

<h3>More Examples = Better Learning</h3>

<p>Just like you get better with practice, AI gets smarter with more examples!</p>
<ul>
<li>10 dog pictures → AI is confused</li>
<li>100 dog pictures → AI is getting it</li>
<li>10,000 dog pictures → AI is a dog expert!</li>
</ul>
`,
      exampleCode: `# Let's see how a computer learns!

# Step 1: TRAINING DATA - Examples we show the AI
training_pictures = [
    {"image": "fluffy_dog.jpg", "label": "dog"},
    {"image": "tabby_cat.jpg", "label": "cat"},
    {"image": "golden_retriever.jpg", "label": "dog"},
    {"image": "siamese_cat.jpg", "label": "cat"},
    {"image": "poodle.jpg", "label": "dog"},
    {"image": "persian_cat.jpg", "label": "cat"},
    # ... imagine 10,000 more examples!
]

# Step 2: LEARNING - AI finds patterns
# AI notices:
# Dogs: often bigger, different ear shapes, bark sounds
# Cats: whiskers more visible, pointy ears, meow sounds

# Step 3: PREDICTING - Test on new pictures
new_picture = "mystery_animal.jpg"

# AI looks at the picture...
# Sees: pointy ears, whiskers, small size
# AI predicts: "This is probably a CAT!"

# The more examples we show, the smarter AI gets!
training_examples = 100
accuracy = "70% correct"

training_examples = 10000
accuracy = "95% correct"

print("Practice makes perfect - for AI too!")`,
      exerciseInstructions: "If you were teaching an AI to recognize ice cream vs. pizza, what patterns would it need to learn?",
      exerciseStarterCode: `# Teaching AI: Ice Cream vs Pizza

# What patterns make ICE CREAM special?
ice_cream_patterns = [
    "cold temperature",
    # Add more patterns:
    "_______________",
    "_______________",
    "_______________",
]

# What patterns make PIZZA special?
pizza_patterns = [
    "round shape",
    # Add more patterns:
    "_______________",
    "_______________",
    "_______________",
]

# What might confuse the AI?
# (What do they have in common?)
confusing_things = [
    "_______________",
    "_______________",
]

# How many examples would you need?
# I think we'd need about ______ pictures to train well!`,
      quiz: [
        { question: "What does an AI need to learn?", options: ["A brain", "Lots of examples", "Electricity only", "A keyboard"], correctAnswer: "Lots of examples", explanation: "AI learns by seeing many examples - the more it sees, the better it gets at finding patterns!" },
        { question: "What happens if you only show AI 10 pictures?", options: ["It becomes an expert", "It gets confused and makes mistakes", "It breaks", "Nothing"], correctAnswer: "It gets confused and makes mistakes", explanation: "Just like you need practice to get good at something, AI needs lots of examples to learn well!" }
      ]
    },
    {
      title: "Teaching by Examples",
      content: `
<h2>You're the Teacher Now!</h2>

<p>When you train AI, YOU become the teacher! Let's learn how to teach AI well.</p>

<h3>Good Teaching = Good AI</h3>

<p>If you want your AI to be smart, you need to be a good teacher:</p>

<ul>
<li><strong>Clear Labels:</strong> Tell the AI exactly what things are</li>
<li><strong>Many Examples:</strong> Show lots of different cases</li>
<li><strong>Variety:</strong> Include different sizes, colors, angles</li>
<li><strong>Balance:</strong> Equal examples of each category</li>
</ul>

<h3>The Training Process</h3>

<ol>
<li><strong>Collect:</strong> Gather lots of examples</li>
<li><strong>Label:</strong> Mark what each example is</li>
<li><strong>Train:</strong> Show everything to the AI</li>
<li><strong>Test:</strong> See if the AI learned correctly</li>
<li><strong>Improve:</strong> Add more examples if needed</li>
</ol>

<h3>Common Mistakes</h3>

<ul>
<li>❌ Only showing one type (only fluffy dogs → confused by short-haired dogs)</li>
<li>❌ Wrong labels (calling a cat a dog → confused AI)</li>
<li>❌ Too few examples (AI guesses instead of knowing)</li>
<li>❌ Unbalanced data (1000 cats, 10 dogs → thinks everything is a cat)</li>
</ul>

<h3>Real Example: Teaching AI to Recognize Fruits</h3>

<p>To teach AI about apples, you'd show:</p>
<ul>
<li>Red apples, green apples, yellow apples</li>
<li>Big apples, small apples</li>
<li>Whole apples, sliced apples</li>
<li>Apples from different angles</li>
</ul>
`,
      exampleCode: `# Let's be AI teachers!

# GOOD Training Data for recognizing apples
good_apple_training = [
    {"image": "red_apple.jpg", "label": "apple"},
    {"image": "green_apple.jpg", "label": "apple"},
    {"image": "yellow_apple.jpg", "label": "apple"},
    {"image": "small_apple.jpg", "label": "apple"},
    {"image": "apple_slice.jpg", "label": "apple"},
    {"image": "apple_on_tree.jpg", "label": "apple"},
]

# BAD Training Data - All the same!
bad_apple_training = [
    {"image": "red_apple_1.jpg", "label": "apple"},
    {"image": "red_apple_2.jpg", "label": "apple"},
    {"image": "red_apple_3.jpg", "label": "apple"},
    # Only red apples! AI won't recognize green ones!
]

# BALANCED Training for cats vs dogs
balanced_training = {
    "cats": 500,  # 500 cat pictures
    "dogs": 500   # 500 dog pictures
}
# Fair and balanced!

# UNBALANCED Training (bad!)
unbalanced_training = {
    "cats": 1000,  # Way too many cats
    "dogs": 50     # Not enough dogs!
}
# AI will think everything is a cat!

# As a teacher, you want:
checklist = [
    "Variety in examples ✓",
    "Correct labels ✓",
    "Lots of examples ✓",
    "Balanced categories ✓",
]

print("Good teachers make smart AI!")`,
      exerciseInstructions: "You're training an AI to tell the difference between happy faces 😊 and sad faces 😢. What examples would you collect?",
      exerciseStarterCode: `# Training AI: Happy vs Sad Faces

# What HAPPY face examples would you include?
happy_examples = [
    "smiling with teeth showing",
    # Add more variety:
    "_______________",
    "_______________",
    "_______________",
    "_______________",
]

# What SAD face examples would you include?
sad_examples = [
    "frowning with tears",
    # Add more variety:
    "_______________",
    "_______________",
    "_______________",
    "_______________",
]

# How many of each would you collect?
num_happy = ___
num_sad = ___

# Are they balanced? (should be equal!)
balanced = num_happy == num_sad  # True or False?

# What other expressions might confuse the AI?
confusing_expressions = [
    "_______________",  # Example: "neutral face"
    "_______________",
]`,
      quiz: [
        { question: "What makes good AI training data?", options: ["Only one type of example", "Variety, correct labels, and lots of examples", "Random pictures", "No labels needed"], correctAnswer: "Variety, correct labels, and lots of examples", explanation: "Good training data has variety (different types), correct labels (accurate information), and lots of examples (for better learning)!" },
        { question: "What happens with unbalanced training data?", options: ["AI works perfectly", "AI becomes biased toward the larger category", "AI stops working", "Nothing"], correctAnswer: "AI becomes biased toward the larger category", explanation: "If you show AI 1000 cats and only 10 dogs, it will think most things are cats because that's what it saw most!" }
      ]
    },
    {
      title: "Pattern Detectives",
      content: `
<h2>Finding Patterns Like AI!</h2>

<p>AI is like a super detective that finds patterns in data. Let's become pattern detectives too!</p>

<h3>What Are Patterns?</h3>

<p>Patterns are things that repeat or have something in common:</p>
<ul>
<li>🔴🔵🔴🔵🔴🔵 (colors alternate)</li>
<li>All cats have whiskers (common feature)</li>
<li>Pizza is usually round (common shape)</li>
</ul>

<h3>How AI Finds Patterns</h3>

<ol>
<li><strong>Look at many examples</strong></li>
<li><strong>Notice what's the same</strong></li>
<li><strong>Notice what's different</strong></li>
<li><strong>Create rules from patterns</strong></li>
</ol>

<h3>Pattern Finding Game!</h3>

<p>Can you find what these have in common?</p>
<ul>
<li>🍎🍊🍋🍇 → All are fruits!</li>
<li>🚗🚕🚌🚙 → All have wheels!</li>
<li>📱💻🖥️⌨️ → All are technology!</li>
</ul>

<h3>Features: The Building Blocks</h3>

<p>AI looks at "features" - specific things about each item:</p>
<ul>
<li><strong>Color:</strong> Is it red, blue, green?</li>
<li><strong>Size:</strong> Is it big or small?</li>
<li><strong>Shape:</strong> Is it round, square, triangular?</li>
<li><strong>Texture:</strong> Is it smooth, rough, fluffy?</li>
</ul>
`,
      exampleCode: `# Be a Pattern Detective!

# AI looks at FEATURES to find patterns

# Cat Features
cat1_features = {
    "has_fur": True,
    "has_whiskers": True,
    "ear_shape": "pointy",
    "sound": "meow",
    "size": "small"
}

cat2_features = {
    "has_fur": True,
    "has_whiskers": True,
    "ear_shape": "pointy",
    "sound": "meow",
    "size": "medium"
}

# AI notices the PATTERN:
# - All cats have fur ✓
# - All cats have whiskers ✓
# - All cats have pointy ears ✓
# - All cats meow ✓
# - Sizes can vary (not a reliable pattern)

# Dog Features
dog1_features = {
    "has_fur": True,
    "has_whiskers": False,  # Dogs have whiskers but less visible
    "ear_shape": "floppy",
    "sound": "bark",
    "size": "large"
}

# AI learns to tell them apart by looking at:
# whiskers? → strong indicator for cats
# sound? → meow = cat, bark = dog
# ear shape? → pointy = cat, floppy = often dog

def detect_animal(features):
    if features["sound"] == "meow":
        return "Probably a CAT!"
    elif features["sound"] == "bark":
        return "Probably a DOG!"
    else:
        return "Not sure, need more clues!"

print("AI finds patterns in features!")`,
      exerciseInstructions: "You're training AI to recognize fruits! What features would help tell an apple from a banana?",
      exerciseStarterCode: `# Fruit Pattern Detective!

# What features would you check?

apple_features = {
    "shape": "round",
    "color": ["red", "green", "yellow"],
    # Add more features:
    "___": "___",
    "___": "___",
    "___": "___",
}

banana_features = {
    "shape": "curved",
    "color": ["yellow", "green"],
    # Add more features:
    "___": "___",
    "___": "___",
    "___": "___",
}

# Which features are MOST helpful to tell them apart?
best_features = [
    "shape",  # round vs curved - very helpful!
    # What else?
    "___",
    "___",
]

# Which features are NOT helpful? (both fruits have it)
unhelpful_features = [
    "___",  # Example: both are fruits
    "___",
]`,
      quiz: [
        { question: "What are features in AI?", options: ["Bonus levels in a game", "Specific characteristics AI looks at", "Computer parts", "Internet connections"], correctAnswer: "Specific characteristics AI looks at", explanation: "Features are specific things like color, size, or shape that AI examines to find patterns and make decisions!" },
        { question: "Why does AI need to find patterns?", options: ["For fun", "To make art", "To make predictions about new things", "To use more electricity"], correctAnswer: "To make predictions about new things", explanation: "By finding patterns in examples it's seen, AI can make smart guesses about new things it hasn't seen before!" }
      ]
    },
    {
      title: "Smart Predictions",
      content: `
<h2>AI Can Predict the Future!</h2>

<p>Well, sort of! AI uses patterns from the past to make smart guesses about what might happen next.</p>

<h3>Predictions Are Everywhere</h3>

<ul>
<li>🌤️ <strong>Weather:</strong> "It will probably rain tomorrow"</li>
<li>🎬 <strong>Movies:</strong> "You might like this movie"</li>
<li>🛒 <strong>Shopping:</strong> "People who bought this also bought..."</li>
<li>⌨️ <strong>Typing:</strong> "Did you mean 'hello'?"</li>
</ul>

<h3>How Predictions Work</h3>

<ol>
<li><strong>Look at past data:</strong> What happened before?</li>
<li><strong>Find patterns:</strong> What usually comes next?</li>
<li><strong>Make a guess:</strong> Based on patterns</li>
<li><strong>Check and improve:</strong> Was the guess right?</li>
</ol>

<h3>Prediction Example: What's Next?</h3>

<p>🔴🔵🔴🔵🔴 → What comes next?</p>
<p>If you guessed 🔵, you made a prediction based on the pattern!</p>

<h3>AI Predictions in Real Life</h3>

<ul>
<li><strong>Autocomplete:</strong> You type "Good mor..." → AI predicts "Good morning!"</li>
<li><strong>Music:</strong> You like pop songs → AI predicts you'll like this new pop song</li>
<li><strong>Games:</strong> Player usually goes left → AI predicts they'll go left again</li>
</ul>

<h3>Predictions Aren't Perfect!</h3>

<p>Sometimes AI guesses wrong - and that's okay! It learns from mistakes.</p>
`,
      exampleCode: `# Making Predictions Like AI!

# Simple prediction: What movie will you like?

# Your watch history
movies_you_liked = [
    {"title": "Frozen", "type": "animated", "has_music": True},
    {"title": "Moana", "type": "animated", "has_music": True},
    {"title": "Encanto", "type": "animated", "has_music": True},
]

# AI finds the pattern:
# - You like animated movies ✓
# - You like movies with music ✓

# New movie options:
new_movies = [
    {"title": "Coco", "type": "animated", "has_music": True},
    {"title": "Jaws", "type": "live-action", "has_music": False},
    {"title": "Luca", "type": "animated", "has_music": True},
]

# AI prediction:
def predict_rating(movie, your_preferences):
    score = 0
    if movie["type"] == "animated":
        score += 50  # You like animated!
    if movie["has_music"] == True:
        score += 50  # You like musicals!
    return score

# Results:
# Coco: 100 points - "You'll LOVE this!"
# Luca: 100 points - "You'll LOVE this!"
# Jaws: 0 points - "Maybe not for you..."

print("AI predicts based on your patterns!")

# Weather prediction example
past_weather = [
    {"clouds": True, "humidity": "high", "result": "rain"},
    {"clouds": True, "humidity": "high", "result": "rain"},
    {"clouds": False, "humidity": "low", "result": "sunny"},
]

today = {"clouds": True, "humidity": "high"}
prediction = "It will probably rain! ☔"`,
      exerciseInstructions: "If someone ate pizza on Monday, Tuesday, and Wednesday, what would AI predict they'll eat on Thursday?",
      exerciseStarterCode: `# Food Prediction Challenge!

# Past eating patterns
eating_history = [
    {"day": "Monday", "food": "pizza"},
    {"day": "Tuesday", "food": "pizza"},
    {"day": "Wednesday", "food": "pizza"},
]

# What pattern does AI see?
pattern = "This person eats ___ every day!"

# AI prediction for Thursday:
thursday_prediction = "___"

# But wait! Is this prediction always right?
# What might make it WRONG?
reasons_prediction_could_be_wrong = [
    "They might get tired of pizza",
    # Add more reasons:
    "___",
    "___",
]

# This teaches us:
# AI predictions are ________, not ________.
# (hints: "guesses" and "guarantees")`,
      quiz: [
        { question: "What does AI use to make predictions?", options: ["Magic crystal ball", "Random guessing", "Patterns from past data", "Asking humans"], correctAnswer: "Patterns from past data", explanation: "AI looks at what happened before, finds patterns, and uses those patterns to guess what might happen next!" },
        { question: "Are AI predictions always correct?", options: ["Yes, always perfect", "No, they're educated guesses that can be wrong", "Only on weekends", "Never"], correctAnswer: "No, they're educated guesses that can be wrong", explanation: "Predictions are smart guesses based on patterns, but they can still be wrong. AI learns from its mistakes to get better!" }
      ]
    },
    {
      title: "Talking to AI",
      content: `
<h2>How AI Understands Your Voice!</h2>

<p>"Hey Siri!" "OK Google!" "Alexa!" - These AI assistants understand what you say. But how?</p>

<h3>The Journey of Your Voice</h3>

<ol>
<li><strong>You speak:</strong> Sound waves travel through the air</li>
<li><strong>Microphone listens:</strong> Converts sound to digital signals</li>
<li><strong>AI processes:</strong> Figures out what words you said</li>
<li><strong>AI understands:</strong> Determines what you want</li>
<li><strong>AI responds:</strong> Gives you an answer!</li>
</ol>

<h3>Two Super Powers</h3>

<ul>
<li><strong>Speech Recognition:</strong> Converting your voice to text</li>
<li><strong>Natural Language Understanding:</strong> Understanding what the text means</li>
</ul>

<h3>Understanding Context</h3>

<p>The same words can mean different things!</p>
<ul>
<li>"It's cold" → Could mean temperature OR unfriendly</li>
<li>"Can you play music?" → A request, not a question about ability</li>
<li>"What's up?" → Greeting, not asking about direction</li>
</ul>

<h3>Teaching AI Language</h3>

<p>AI learns language by:</p>
<ul>
<li>Reading millions of conversations</li>
<li>Learning word meanings and relationships</li>
<li>Understanding common phrases and slang</li>
<li>Practicing with user interactions</li>
</ul>
`,
      exampleCode: `# How Voice AI Works!

# Step 1: Your voice becomes text (Speech Recognition)
your_voice = "🎤 Hey Siri, what's the weather today?"

# AI converts to text:
text_version = "Hey Siri what's the weather today"

# Step 2: AI breaks it down (Natural Language Understanding)
analyzed = {
    "wake_word": "Hey Siri",  # This activates the AI
    "action": "get information",  # You want to know something
    "topic": "weather",  # About the weather
    "time": "today",  # For today
    "location": "current"  # Where you are
}

# Step 3: AI takes action
# Checks weather service for your location
weather_data = {"temp": 72, "condition": "sunny", "location": "Your City"}

# Step 4: AI responds
response = "It's 72 degrees and sunny in Your City today!"

# Understanding different ways to ask the same thing:
weather_questions = [
    "What's the weather?",
    "Is it raining?",
    "Do I need an umbrella?",
    "How hot is it outside?",
    "Will it rain today?",
]

# AI knows these all relate to WEATHER!
# That's the power of understanding language!

# Chatbot conversation example:
def chatbot_response(user_input):
    user_input = user_input.lower()

    if "hello" in user_input or "hi" in user_input:
        return "Hello! How can I help you today?"
    elif "weather" in user_input:
        return "It's a beautiful day! ☀️"
    elif "joke" in user_input:
        return "Why did the AI cross the road? To optimize the other side! 😄"
    else:
        return "Interesting! Tell me more."

print("AI listens, understands, and responds!")`,
      exerciseInstructions: "Create 5 different ways to ask the same question that AI should understand as the same request.",
      exerciseStarterCode: `# Same Question, Different Words!

# Topic: Asking for the time
time_questions = [
    "What time is it?",
    "Do you know the time?",
    # Add 3 more ways to ask:
    "___",
    "___",
    "___",
]

# Topic: Asking to play music
music_requests = [
    "Play some music",
    # Add 4 more ways to ask:
    "___",
    "___",
    "___",
    "___",
]

# Why is this hard for AI?
# Because humans say things in ________ different ways!

# What words are KEY for AI to recognize?
# For time questions, key words might be: "time", "clock", "hour"
# For music requests, key words might be: "___", "___", "___"`,
      quiz: [
        { question: "What is speech recognition?", options: ["AI singing", "Converting voice to text", "Playing music", "A game"], correctAnswer: "Converting voice to text", explanation: "Speech recognition is when AI listens to your voice and converts it into written text that it can analyze!" },
        { question: "Why is understanding language hard for AI?", options: ["Humans speak too fast", "The same words can mean different things", "AI doesn't have ears", "Humans are too quiet"], correctAnswer: "The same words can mean different things", explanation: "Language is tricky because words and phrases can have multiple meanings depending on context!" }
      ]
    },
    {
      title: "AI Art and Creativity",
      content: `
<h2>Can AI Be Creative?</h2>

<p>AI isn't just for solving math problems - it can create art, music, and stories too!</p>

<h3>AI-Made Art</h3>

<ul>
<li>🎨 <strong>Image Generation:</strong> AI creates pictures from descriptions</li>
<li>🎵 <strong>Music Composition:</strong> AI writes songs and melodies</li>
<li>📝 <strong>Story Writing:</strong> AI writes stories and poetry</li>
<li>🎮 <strong>Game Design:</strong> AI creates game levels</li>
</ul>

<h3>How AI Creates Art</h3>

<ol>
<li><strong>Learn from examples:</strong> Study millions of paintings, songs, or stories</li>
<li><strong>Understand patterns:</strong> Learn what makes art "good"</li>
<li><strong>Generate new works:</strong> Combine patterns in new ways</li>
<li><strong>Improve:</strong> Get feedback and get better</li>
</ol>

<h3>Text-to-Image AI</h3>

<p>You type: "A cat riding a skateboard in space"</p>
<p>AI creates: An image that shows exactly that!</p>

<h3>Is It "Real" Art?</h3>

<p>People have different opinions:</p>
<ul>
<li>✅ It's creative - creates new, unique things</li>
<li>✅ It's art - people enjoy looking at it</li>
<li>❌ AI doesn't "feel" - it doesn't have emotions</li>
<li>❓ Who's the artist - the AI or the person who asked?</li>
</ul>

<h3>AI + Human = Best Creativity!</h3>

<p>Many artists use AI as a tool, like a super-powered paintbrush!</p>
`,
      exampleCode: `# AI Creativity Examples!

# Text-to-Image Generation
prompt = "A friendly robot painting a sunset on Mars"
# AI thinks about: robots, painting, sunsets, Mars
# AI creates: A unique image combining all these!

# AI Music Generation
music_style = {
    "genre": "pop",
    "mood": "happy",
    "instruments": ["piano", "guitar", "drums"],
    "tempo": "upbeat"
}
# AI creates a new song matching these preferences!

# AI Story Writing
story_prompt = "A young wizard discovers a magical computer"
# AI might generate:

ai_story = """
Once upon a time, in the land of Technomagic,
young wizard Lily found a glowing laptop in the forest.
When she opened it, the screen flickered with ancient code.
"Hello, young wizard," the computer spoke. "I am Computus,
the magical machine that bridges magic and technology!"
Together, they would save the digital kingdom...
"""

# AI Art Styles
styles_ai_can_mimic = [
    "cartoon",
    "realistic photo",
    "watercolor painting",
    "pixel art",
    "comic book",
    "anime",
]

# You provide: creativity and ideas
# AI provides: execution and endless variations
# Together: Amazing art!

print("AI is a creative partner, not a replacement!")`,
      exerciseInstructions: "Write 3 creative prompts you would give to an AI art generator. Be descriptive!",
      exerciseStarterCode: `# My AI Art Prompts!

# Prompt 1: An imaginary animal
prompt_1 = "_______________________________________________"
# Example: "A fluffy dragon with butterfly wings playing basketball"

# Prompt 2: A magical place
prompt_2 = "_______________________________________________"
# Example: "An underwater city made of crystals with fish traffic"

# Prompt 3: A funny situation
prompt_3 = "_______________________________________________"
# Example: "A penguin teaching math to confused polar bears"

# Tips for good prompts:
# - Be specific (not just "a cat" but "a fluffy orange cat")
# - Add details (what are they doing? where are they?)
# - Include style (cartoon? realistic? watercolor?)
# - Add mood (happy? mysterious? silly?)

# Now describe your DREAM artwork:
dream_art = """
_______________________________________________
_______________________________________________
_______________________________________________
"""`,
      quiz: [
        { question: "What can AI create?", options: ["Only math answers", "Art, music, and stories", "Only text", "Nothing creative"], correctAnswer: "Art, music, and stories", explanation: "AI can be creative! It can generate images, compose music, write stories, and much more!" },
        { question: "How does AI learn to make art?", options: ["Born with creativity", "Studies millions of examples to learn patterns", "Copies exactly", "Randomly guesses"], correctAnswer: "Studies millions of examples to learn patterns", explanation: "AI learns what makes good art by studying millions of examples and learning the patterns that make them work!" }
      ]
    },
    {
      title: "AI Ethics: Being Responsible",
      content: `
<h2>Using AI the Right Way</h2>

<p>AI is powerful, but with great power comes great responsibility! Let's learn how to use AI ethically.</p>

<h3>What Is AI Ethics?</h3>

<p>Ethics means knowing right from wrong. AI ethics is about making sure AI is:</p>
<ul>
<li>✅ <strong>Fair:</strong> Treats everyone equally</li>
<li>✅ <strong>Safe:</strong> Doesn't hurt anyone</li>
<li>✅ <strong>Honest:</strong> Doesn't lie or trick people</li>
<li>✅ <strong>Helpful:</strong> Makes life better, not worse</li>
</ul>

<h3>AI Can Be Unfair (Bias)</h3>

<p>If AI only learns from certain examples, it might be unfair:</p>
<ul>
<li>Face recognition that works better on some skin tones</li>
<li>Job recommendations that favor one gender</li>
<li>Loan approvals that aren't equal</li>
</ul>

<p>This happens when training data isn't diverse enough!</p>

<h3>Privacy Matters</h3>

<ul>
<li>AI should protect your personal information</li>
<li>You should know when AI is collecting data about you</li>
<li>Your data should be kept safe</li>
</ul>

<h3>AI Should Be Honest</h3>

<ul>
<li>AI shouldn't pretend to be human</li>
<li>AI-generated content should be labeled</li>
<li>AI shouldn't spread lies or fake news</li>
</ul>

<h3>You Can Help!</h3>

<ul>
<li>Question what AI tells you</li>
<li>Report unfair AI behavior</li>
<li>Learn more about how AI works</li>
<li>Be a responsible AI user and creator</li>
</ul>
`,
      exampleCode: `# AI Ethics Examples

# BIAS PROBLEM:
# Training data only has certain types of faces
biased_training_data = {
    "faces_included": ["mostly one ethnicity"],
    "faces_missing": ["many ethnicities underrepresented"],
}
# Result: AI works well for some people but not others
# This is UNFAIR!

# BETTER APPROACH:
fair_training_data = {
    "faces_included": [
        "all ethnicities equally",
        "all ages",
        "all genders",
        "different lighting conditions",
    ],
}
# Result: AI works well for EVERYONE!

# PRIVACY CONSIDERATIONS:
user_data = {
    "what_you_collect": "Only what's needed",
    "how_you_store_it": "Safely and securely",
    "who_can_see_it": "Only authorized people",
    "can_users_delete_it": "Yes, always",
}

# HONESTY in AI:
# Bad: AI pretends to be a human
# Good: "Hi! I'm an AI assistant here to help."

# Checklist for responsible AI:
ethics_checklist = [
    "Is it fair to everyone?",
    "Does it protect privacy?",
    "Is it honest about being AI?",
    "Could it be used to harm someone?",
    "Does it have proper oversight?",
]

# Questions to ask about any AI:
def evaluate_ai(ai_system):
    print("Checking if AI is ethical...")
    print("1. Who made this AI and why?")
    print("2. What data was it trained on?")
    print("3. Who might be helped or harmed?")
    print("4. Is there human oversight?")
    print("5. Can mistakes be corrected?")

print("Think carefully about AI's impact!")`,
      exerciseInstructions: "Think about a fairness problem with AI. How would you fix it?",
      exerciseStarterCode: `# AI Ethics Detective!

# Scenario: An AI recommends jobs to people
# Problem: It mostly recommends tech jobs to boys
#          and nursing jobs to girls

# Why might this happen?
the_problem = """
The AI learned from old data where _____________
_____________________________________________
"""

# Why is this unfair?
why_unfair = """
It's unfair because _____________
_____________________________________________
"""

# How would you fix it?
the_solution = """
To make it fair, we should:
1. _____________________________________________
2. _____________________________________________
3. _____________________________________________
"""

# What should we ALWAYS check before using AI?
ethics_checklist = [
    "Is it fair to everyone?",
    # Add more questions to ask:
    "___?",
    "___?",
    "___?",
]`,
      quiz: [
        { question: "What is AI bias?", options: ["When AI is helpful", "When AI treats some groups unfairly", "When AI is fast", "When AI makes art"], correctAnswer: "When AI treats some groups unfairly", explanation: "AI bias happens when AI doesn't work equally well for everyone, often because it learned from unbalanced examples!" },
        { question: "Why should AI be honest about being AI?", options: ["It's the law", "So people know they're not talking to a human", "AI likes being honest", "No reason"], correctAnswer: "So people know they're not talking to a human", explanation: "It's important for people to know when they're interacting with AI so they can make informed decisions!" }
      ]
    },
    {
      title: "Project: Train Your First AI",
      content: `
<h2>Final Project: Build an Image Classifier!</h2>

<p>It's time to put everything together and train your very own AI!</p>

<h3>Your Mission</h3>

<p>Create an AI that can recognize drawings! You'll teach it to tell the difference between different objects you draw.</p>

<h3>What You'll Do</h3>

<ol>
<li><strong>Collect Training Data:</strong> Draw pictures for your AI</li>
<li><strong>Label Your Data:</strong> Tell AI what each drawing is</li>
<li><strong>Train Your Model:</strong> Let AI learn the patterns</li>
<li><strong>Test It Out:</strong> See if AI can recognize new drawings!</li>
</ol>

<h3>Project Ideas</h3>

<ul>
<li>🐱🐶 Cat vs Dog drawings</li>
<li>😊😢 Happy vs Sad faces</li>
<li>🍎🍌 Apple vs Banana</li>
<li>✈️🚗 Plane vs Car</li>
</ul>

<h3>Tips for Success</h3>

<ul>
<li>Draw at least 10 examples of each category</li>
<li>Make your drawings varied (different sizes, angles)</li>
<li>Keep your categories distinct</li>
<li>Test with drawings that are different from your training examples</li>
</ul>

<h3>What You Learned</h3>

<p>By completing this project, you've learned:</p>
<ul>
<li>What AI and machine learning are</li>
<li>How to collect and label training data</li>
<li>How AI finds patterns</li>
<li>How to test and improve your AI</li>
</ul>

<h3>Congratulations! 🎉</h3>

<p>You're now an AI trainer! Keep exploring and building amazing things with AI!</p>
`,
      exampleCode: `# Your First AI Image Classifier!

# Using Teachable Machine or similar platform

# Step 1: Choose your categories
categories = ["cat", "dog"]

# Step 2: Collect training data
training_data = {
    "cat": [
        "Draw a cat face",
        "Draw a sleeping cat",
        "Draw a cat with stripes",
        "Draw a fluffy cat",
        "Draw a small cat",
        "Draw a cat from the side",
        "Draw a jumping cat",
        "Draw a cat playing",
        "Draw a cartoon cat",
        "Draw a realistic cat",
    ],
    "dog": [
        "Draw a dog face",
        "Draw a running dog",
        "Draw a spotted dog",
        "Draw a big dog",
        "Draw a tiny dog",
        "Draw a dog from the side",
        "Draw a barking dog",
        "Draw a sleeping dog",
        "Draw a cartoon dog",
        "Draw a realistic dog",
    ]
}

# Step 3: Train your model
print("Training AI with your drawings...")
print("AI is finding patterns...")
print("Looking for what makes cats and dogs different...")

# Step 4: Test your model!
def test_classifier(drawing):
    # AI analyzes the drawing
    # Returns its prediction and confidence

    # Example results:
    result = {
        "prediction": "cat",
        "confidence": 85,  # 85% sure it's a cat!
    }
    return result

# Test with a new drawing
new_drawing = "my_mystery_animal.jpg"
result = test_classifier(new_drawing)
print(f"AI thinks this is a {result['prediction']}!")
print(f"Confidence: {result['confidence']}%")

# If AI is wrong, add more training examples!
print("\\n🎉 Congratulations! You trained an AI!")`,
      exerciseInstructions: "Plan your image classifier! What will you train it to recognize?",
      exerciseStarterCode: `# My AI Image Classifier Plan!

# What two things will my AI recognize?
category_1 = "_______________"
category_2 = "_______________"

# Training data I'll collect:
# (List 10 different drawings for each)

category_1_drawings = [
    "1. _______________",
    "2. _______________",
    "3. _______________",
    "4. _______________",
    "5. _______________",
    "6. _______________",
    "7. _______________",
    "8. _______________",
    "9. _______________",
    "10. _______________",
]

category_2_drawings = [
    "1. _______________",
    "2. _______________",
    "3. _______________",
    "4. _______________",
    "5. _______________",
    "6. _______________",
    "7. _______________",
    "8. _______________",
    "9. _______________",
    "10. _______________",
]

# What features will help AI tell them apart?
distinctive_features = [
    "_______________",
    "_______________",
    "_______________",
]

# How will I test my AI?
test_plan = "I'll draw 5 new ___ and 5 new ___ that my AI hasn't seen!"

# I'm ready to train my first AI! 🎉`,
      quiz: [
        { question: "How many examples should you show AI to learn well?", options: ["Just 1", "At least 2", "Many! (10 or more of each category)", "Exactly 100"], correctAnswer: "Many! (10 or more of each category)", explanation: "The more varied examples you show AI, the better it learns! Aim for at least 10 examples of each category." },
        { question: "What do you do if your AI makes mistakes?", options: ["Give up", "Add more training examples", "Blame the computer", "Start over completely"], correctAnswer: "Add more training examples", explanation: "If AI makes mistakes, it usually needs more or better examples to learn from. That's how we improve it!" }
      ]
    }
  ],

  "machine-learning-explorers": [
    {
      title: "Types of Machine Learning",
      content: `
<h2>The Three Ways Machines Learn</h2>

<p>Just like there are different ways you learn in school, there are different ways machines can learn!</p>

<h3>1. Supervised Learning (Learning with a Teacher)</h3>

<p>Like having a teacher who shows you the answers:</p>
<ul>
<li>You show AI examples WITH labels</li>
<li>"This picture is a cat" → AI learns what cats look like</li>
<li>Used for: Image recognition, spam detection, predictions</li>
</ul>

<pre><code>Training: photo + "cat" → AI learns
Testing: new photo → AI predicts "cat!"</code></pre>

<h3>2. Unsupervised Learning (Learning on Your Own)</h3>

<p>Like exploring and finding patterns yourself:</p>
<ul>
<li>AI gets data WITHOUT labels</li>
<li>AI finds hidden patterns and groups</li>
<li>Used for: Customer grouping, anomaly detection, recommendations</li>
</ul>

<pre><code>Training: lots of photos (no labels) → AI finds groups
Result: "These look similar, I'll group them together!"</code></pre>

<h3>3. Reinforcement Learning (Learning by Doing)</h3>

<p>Like learning a game through trial and error:</p>
<ul>
<li>AI tries actions and gets rewards or penalties</li>
<li>Good action → reward → do more of this!</li>
<li>Bad action → penalty → try something else</li>
<li>Used for: Games, robotics, self-driving cars</li>
</ul>

<pre><code>Action: move left → +10 points (reward!)
Action: move right → -5 points (penalty)
AI learns: moving left is better!</code></pre>
`,
      exampleCode: `# The Three Types of Machine Learning

# 1. SUPERVISED LEARNING
# Data with labels - like having answer keys!
supervised_data = [
    {"image": "cat1.jpg", "label": "cat"},
    {"image": "dog1.jpg", "label": "dog"},
    {"image": "cat2.jpg", "label": "cat"},
    {"image": "dog2.jpg", "label": "dog"},
]
# AI learns: "These features = cat, those features = dog"

# 2. UNSUPERVISED LEARNING
# Data without labels - find patterns yourself!
unsupervised_data = [
    "customer_1_data",
    "customer_2_data",
    "customer_3_data",
    # No labels! AI must find groups itself
]
# AI might discover: "These 3 customers are similar!"

# 3. REINFORCEMENT LEARNING
# Learn from rewards and penalties!
class GameAI:
    def play_game(self):
        action = self.choose_action()
        reward = game.perform(action)
        self.learn_from_result(action, reward)
        # Good reward? Do this action more!
        # Bad reward? Try something else!

# Real-world examples:
examples = {
    "supervised": [
        "Email spam detection (spam/not spam labels)",
        "Image classification (labeled photos)",
        "Medical diagnosis (labeled patient records)",
    ],
    "unsupervised": [
        "Customer segmentation (group similar buyers)",
        "Anomaly detection (find unusual patterns)",
        "Topic discovery in documents",
    ],
    "reinforcement": [
        "Game playing AI (chess, Go, video games)",
        "Self-driving cars (navigate roads)",
        "Robot control (learn to walk)",
    ]
}

print("Different problems need different learning approaches!")`,
      exerciseInstructions: "For each scenario, identify which type of machine learning would work best.",
      exerciseStarterCode: `# Machine Learning Type Matcher!

# Match each scenario to the best ML type:
# - Supervised (has labels, learns from examples)
# - Unsupervised (no labels, finds patterns)
# - Reinforcement (learns from rewards/penalties)

scenarios = {
    "Teaching AI to recognize handwritten numbers 0-9":
        "___________",  # Type?

    "Training a robot to balance on two wheels":
        "___________",  # Type?

    "Finding groups of similar songs in a music library":
        "___________",  # Type?

    "Predicting house prices based on past sales data":
        "___________",  # Type?

    "Training an AI to play chess better":
        "___________",  # Type?

    "Grouping news articles by topic automatically":
        "___________",  # Type?
}

# Explain your reasoning for one:
my_reasoning = """
I chose ___________ for ___________ because:
_______________________________________________
"""`,
      quiz: [
        { question: "Which type of ML uses labeled training data?", options: ["Reinforcement Learning", "Unsupervised Learning", "Supervised Learning", "All of them"], correctAnswer: "Supervised Learning", explanation: "Supervised learning is like having a teacher - the data comes with labels (answers) that help AI learn!" },
        { question: "How does reinforcement learning work?", options: ["By labeling data", "By trial and error with rewards", "By finding groups", "By copying humans"], correctAnswer: "By trial and error with rewards", explanation: "Reinforcement learning is like playing a game - AI tries actions and learns from rewards (good) and penalties (bad)!" }
      ]
    },
    {
      title: "Data: The Fuel for AI",
      content: `
<h2>No Data, No AI!</h2>

<p>If AI is a car, data is the fuel. Without good data, even the smartest AI can't work!</p>

<h3>Why Data Matters</h3>

<ul>
<li>AI learns ONLY from the data you give it</li>
<li>Good data = Good AI</li>
<li>Bad data = Bad AI (Garbage In, Garbage Out!)</li>
</ul>

<h3>Types of Data</h3>

<ul>
<li><strong>Structured Data:</strong> Organized in tables (like spreadsheets)</li>
<li><strong>Unstructured Data:</strong> Images, text, audio, video</li>
<li><strong>Time Series:</strong> Data over time (stock prices, weather)</li>
</ul>

<h3>Where Data Comes From</h3>

<ul>
<li>Websites and apps</li>
<li>Sensors and devices</li>
<li>Surveys and forms</li>
<li>Public datasets</li>
<li>Your own collection</li>
</ul>

<h3>Data Quality Matters!</h3>

<ul>
<li>✅ <strong>Accurate:</strong> Correct information</li>
<li>✅ <strong>Complete:</strong> No missing pieces</li>
<li>✅ <strong>Consistent:</strong> Same format throughout</li>
<li>✅ <strong>Relevant:</strong> Related to what you're predicting</li>
</ul>

<h3>Data Preparation Steps</h3>

<ol>
<li><strong>Collect:</strong> Gather raw data</li>
<li><strong>Clean:</strong> Fix errors and remove duplicates</li>
<li><strong>Transform:</strong> Convert to usable format</li>
<li><strong>Validate:</strong> Check for quality</li>
</ol>
`,
      exampleCode: `# Working with Data for ML

import pandas as pd

# Sample structured data (like a spreadsheet)
student_data = {
    "name": ["Alice", "Bob", "Charlie", "Diana"],
    "study_hours": [5, 3, 7, 4],
    "sleep_hours": [8, 6, 7, 8],
    "test_score": [85, 70, 95, 80]
}

# Create a DataFrame (table)
df = pd.DataFrame(student_data)
print("Our Data:")
print(df)

# DATA QUALITY CHECKS

# Check for missing values
print("\\nMissing values:", df.isnull().sum().sum())

# Check data statistics
print("\\nData Summary:")
print(df.describe())

# DATA CLEANING EXAMPLES

# Bad data
messy_data = {
    "age": [25, -5, 150, 30],  # -5 and 150 are errors!
    "name": ["Alice", None, "Charlie", "Diana"],  # None is missing!
}

# Clean it up!
def clean_age(age):
    if age < 0 or age > 120:
        return None  # Mark as invalid
    return age

# Feature and target
# Features = what we use to predict
# Target = what we want to predict

features = df[["study_hours", "sleep_hours"]]  # Input
target = df["test_score"]  # What we predict

print("\\nFeatures (inputs):")
print(features)
print("\\nTarget (what we predict):")
print(target)

print("\\nGood data = Good AI predictions!")`,
      exerciseInstructions: "Create a small dataset for predicting whether someone likes a movie.",
      exerciseStarterCode: `# My Movie Preference Dataset

# What information might help predict if someone likes a movie?
# Think about: genre, length, who's in it, etc.

movie_data = {
    "movie_name": [
        "Movie 1",
        "Movie 2",
        "Movie 3",
        "Movie 4",
        "Movie 5",
    ],

    # Add features that might affect preference:
    "genre": ["action", "___", "___", "___", "___"],
    "length_minutes": [120, ___, ___, ___, ___],
    "has_favorite_actor": [True, ___, ___, ___, ___],

    # The target - what we're predicting:
    "liked_movie": [True, ___, ___, ___, ___],
}

# Why did you choose these features?
feature_reasoning = """
I included 'genre' because _______________
I included 'length' because _______________
I included '___' because _______________
"""

# What other features might help?
additional_features = [
    "_______________",
    "_______________",
]`,
      quiz: [
        { question: "What happens with bad quality data?", options: ["AI works better", "AI makes bad predictions", "Nothing changes", "AI gets faster"], correctAnswer: "AI makes bad predictions", explanation: "Garbage In, Garbage Out! If you train AI on bad data, it will make bad predictions." },
        { question: "What is structured data?", options: ["Random text", "Data organized in tables", "Only images", "Spoken words"], correctAnswer: "Data organized in tables", explanation: "Structured data is organized in tables with rows and columns, like a spreadsheet!" }
      ]
    }
  ]
};

// Quiz questions bank for AI/ML
const quizQuestions: Record<string, any[]> = {
  AI_ML: [
    { question: "What makes AI different from regular computer programs?", options: ["AI is faster", "AI can learn from examples", "AI uses more power", "AI is always correct"], answer: "1", explanation: "AI learns from data and improves, unlike traditional programs that just follow fixed rules!" },
    { question: "What is machine learning?", options: ["Teaching machines to move", "Machines learning from data", "Building machines", "Fixing machines"], answer: "1", explanation: "Machine learning is when computers learn patterns from data to make predictions or decisions!" },
    { question: "What is a neural network modeled after?", options: ["Computer chips", "The human brain", "Car engines", "Spiderwebs"], answer: "1", explanation: "Neural networks are inspired by how neurons in our brains connect and work together!" },
    { question: "What does 'training' an AI mean?", options: ["Making it run faster", "Teaching it with examples", "Giving it more memory", "Connecting to internet"], answer: "1", explanation: "Training means showing AI many examples so it can learn patterns and make predictions!" },
    { question: "What is deep learning?", options: ["Learning underwater", "Neural networks with many layers", "Slow learning", "Learning at night"], answer: "1", explanation: "Deep learning uses neural networks with many layers to learn complex patterns!" }
  ]
};

async function seedAIMLCourses() {
  console.log("🤖 Seeding AI & Machine Learning Courses...\n");

  for (const courseData of aiMlCourses) {
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
        orderIndex: aiMlCourses.indexOf(courseData),
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
        const defaultQuestions = quizQuestions.AI_ML.slice(i % 5, (i % 5) + 2);
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

  console.log("🎉 AI & Machine Learning courses seeded successfully!");
  console.log(`   Total courses: ${aiMlCourses.length}`);
  console.log(`   Levels: Beginner → Intermediate → Advanced → Expert → Master`);
}

seedAIMLCourses()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

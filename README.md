# 🤖 AI Repair Lab - Interactive AI Education Experience

A guided repair-lab experience where players restore a malfunctioning AI while learning essential AI concepts and responsible practices

## 🎯 Overview

Players take on the role of new hires helping a glitched AI assistant restore its functions. Through 5 educational modules, participants learn essential AI concepts while solving puzzles.

## 🧩 Learning Modules

1. **🧠 AI Basics Quiz** - Understanding AI capabilities vs limitations
2. **💬 Prompting Challenge** - Learning effective AI communication
3. **🔐 Privacy Puzzle** - Data security and ethical considerations
4. **🤖 Consciousness Puzzle** - AI pattern matching vs human understanding
5. **⚖️ Responsible AI** - Ethical decision-making scenarios

## 🚀 Getting Started

### Prerequisites

You'll need these installed on your computer:
- **Node.js** (version 18 or higher) - Download from [nodejs.org](https://nodejs.org/)
- **Bun** (fast JavaScript runtime) - Install from [bun.sh](https://bun.sh/)
- **Git** (for downloading the code) - Download from [git-scm.com](https://git-scm.com/)

### Step-by-Step Installation

#### 1. Download the Code

**Option A: Download ZIP**
- Click the green "Code" button on GitHub
- Select "Download ZIP"
- Extract the ZIP file to your desired location
- Open terminal/command prompt in the extracted folder

**Option B: Clone with Git**
```bash
# Clone the repository to your computer
git clone [repository-url]
cd ai-escape-room
```

#### 2. Install Dependencies

The game uses React and other libraries that need to be downloaded:

```bash
# Install all required packages (this downloads ~200MB of dependencies)
bun install
```

*Why install dependencies?* The game is built with React, which requires many supporting files. These aren't included in the repository to keep it lightweight.

#### 3. Start the Game

```bash
# Launch the development server
bun dev
```

This will:
- Start a local web server (usually at http://localhost:5173)
- Automatically open your browser
- Show any errors in the terminal if something goes wrong

#### 4. Play the Game!

Once running, you'll see the AI Escape Room in your browser. The game runs entirely on your computer - no internet connection needed after setup.

### Troubleshooting

**"Command not found" errors:**
- Make sure Node.js and Bun are properly installed
- Restart your terminal after installation

**Port already in use:**
- The game will automatically find another port (like 5174, 5175, etc.)

**Installation fails:**
- Try deleting `node_modules` folder and `bun.lockb` file, then run `bun install` again

### Building for Production

```bash
# Create optimized version for deployment
bun run build
```

This creates a `dist` folder with files you can host on any web server.

## 🎮 How to Play

1. Start the diagnostic sequence
2. Complete each module by solving puzzles
3. Receive AI feedback and guidance
4. Progress through all 5 modules
5. Celebrate your AI knowledge mastery!

## 🎨 Features

- **Interactive storyline** with AI assistant guidance
- **Progressive difficulty** with hints and feedback
- **Futuristic UI** with animations and visual effects
- **Educational content** with "Did You Know?" facts
- **Responsive design** for various screen sizes
- **Comprehensive completion** summary

## 🎓 Learning Objectives

- Distinguish AI capabilities from limitations
- Write effective prompts for AI systems
- Understand data privacy in AI contexts
- Recognize AI's pattern-based processing
- Apply responsible AI principles

## 🛠️ Tech Stack

- React 19
- Vite
- CSS3 with animations
- Modern JavaScript (ES6+)

## 📱 Usage

Perfect for:
- Educational workshops
- Corporate training
- Public AI literacy events
- Interactive learning experiences

---

*An interactive way to understand AI while having fun!*

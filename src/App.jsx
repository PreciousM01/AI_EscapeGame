import { useState, useEffect } from 'react'
import './App.css'
import AIBasicsQuiz from './components/AIBasicsQuiz'
import PromptingChallenge from './components/PromptingChallenge'
import PrivacyPuzzle from './components/PrivacyPuzzle'
import ConsciousnessPuzzle from './components/ConsciousnessPuzzle'
import ResponsibleAI from './components/ResponsibleAI'
import GameComplete from './components/GameComplete'

function App() {
  const [currentPuzzle, setCurrentPuzzle] = useState(0)
  const [completedPuzzles, setCompletedPuzzles] = useState([])
  const [gameStarted, setGameStarted] = useState(false)
  const [aiMessages, setAiMessages] = useState([])
  const [showPuzzle, setShowPuzzle] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [activeTimeout, setActiveTimeout] = useState(null)
  const [canSkip, setCanSkip] = useState(false)
  const [transitionType, setTransitionType] = useState('')
  const [messageTimeouts, setMessageTimeouts] = useState([])

  const puzzles = [
    { 
      component: AIBasicsQuiz, 
      title: "AI Capabilities Assessment",
      introMessage: "Let's start with the basics. I need to assess your understanding of AI capabilities and limitations. This will help me calibrate my systems properly.",
      didYouKnow: "AI systems excel at pattern recognition and data processing but cannot truly 'understand' concepts the way humans do. They work by finding statistical patterns in training data!"
    },
    { 
      component: PromptingChallenge, 
      title: "Communication Protocol",
      introMessage: "Now I need to test our communication interface. My language processing module seems to be misinterpreting requests. Help me fix this by showing you understand clear AI prompting.",
      didYouKnow: "Good prompts are specific, provide context, and clearly state the desired format or outcome. This is called 'prompt engineering' and it's a crucial skill for working with AI!"
    },
    { 
      component: PrivacyPuzzle, 
      title: "Data Security Analysis",
      introMessage: "My privacy protocols are showing warnings. I need to verify that you understand data protection principles before we can continue with sensitive operations.",
      didYouKnow: "Personal data like passwords, medical records, and financial information should always be kept private. AI systems should only access the minimum data necessary for their function!"
    },
    { 
      component: ConsciousnessPuzzle, 
      title: "Pattern Recognition Study",
      introMessage: "There's something unusual happening with my self-awareness subroutines. I need you to help me understand what consciousness and intelligence really mean.",
      didYouKnow: "AI systems are incredibly sophisticated pattern-matching machines, but they don't have consciousness, emotions, or true understanding. They process information mechanically, without the subjective experience that defines human consciousness."
    },
    { 
      component: ResponsibleAI, 
      title: "Ethics Evaluation",
      introMessage: "This is the final diagnostic. My ethical decision-making framework needs calibration. Show me you understand responsible AI principles so I can trust my own judgment.",
      didYouKnow: "Responsible AI development involves considering fairness, transparency, accountability, and human oversight. AI should augment human capabilities, not replace human judgment in critical decisions!"
    }
  ]

  const addAIMessage = (message, duration = 10000) => {
    const messageId = Date.now()
    setAiMessages(prev => [...prev, { id: messageId, text: message, duration }])
    
    const timeoutId = setTimeout(() => {
      setAiMessages(prev => prev.filter(msg => msg.id !== messageId))
      setMessageTimeouts(prev => prev.filter(id => id !== timeoutId))
    }, duration)
    
    setMessageTimeouts(prev => [...prev, timeoutId])
  }

  const clearAllAIMessages = () => {
    messageTimeouts.forEach(timeoutId => clearTimeout(timeoutId))
    setMessageTimeouts([])
    setAiMessages([])
  }

  const addTransitionMessage = (message, duration = 10000) => {
    const messageId = Date.now()
    setAiMessages(prev => [...prev, { id: messageId, text: message, duration }])
    
    const timeoutId = setTimeout(() => {
      setAiMessages(prev => prev.filter(msg => msg.id !== messageId))
      setMessageTimeouts(prev => prev.filter(id => id !== timeoutId))
    }, duration)

    setActiveTimeout(timeoutId)
    setMessageTimeouts(prev => [...prev, timeoutId])
  }

  const skipToNext = () => {
    if (!canSkip) return
    
    if (activeTimeout) {
      clearTimeout(activeTimeout)
      setActiveTimeout(null)
    }
    
    clearAllAIMessages()
    
    switch (transitionType) {
      case 'welcome':
        showIntroMessage(0)
        break
      case 'intro':
        setShowPuzzle(true)
        setIsTransitioning(false)
        setCanSkip(false)
        setTransitionType('')
        break
      case 'completion':
        if (currentPuzzle < puzzles.length - 1) {
          setCurrentPuzzle(prev => prev + 1)
          showIntroMessage(currentPuzzle + 1)
        } else {
          setIsTransitioning(false)
          setCanSkip(false)
          setTransitionType('')
        }
        break
      default:
        setCanSkip(false)
        break
    }
  }

  const showIntroMessage = (puzzleIndex) => {
    const puzzle = puzzles[puzzleIndex]
    
    clearAllAIMessages()
    
    setShowPuzzle(false)
    setIsTransitioning(true)
    setCanSkip(true)
    setTransitionType('intro')
    
    addTransitionMessage(puzzle.introMessage, 999999)
  }

  const completePuzzle = (puzzleIndex) => {
    if (!completedPuzzles.includes(puzzleIndex)) {
      setCompletedPuzzles(prev => [...prev, puzzleIndex])
      
      clearAllAIMessages()
      
      setShowPuzzle(false)
      setIsTransitioning(true)
      setCanSkip(true)
      setTransitionType('completion')
      
      addTransitionMessage(`Excellent work! System module ${puzzleIndex + 1} restored.`, 999999)
    }
  }

  useEffect(() => {
    if (gameStarted && !isTransitioning) {
      setCanSkip(true)
      setTransitionType('welcome')
      addTransitionMessage("Welcome, new hires! I'm experiencing some system glitches. Help me restore my functions by completing these diagnostic modules.", 999999)
    }
  }, [gameStarted])

  if (!gameStarted) {
    return (
      <div className="intro-screen">
        <div className="intro-content">
          <h1>🤖 AI Systems Diagnostic Center</h1>
          <div className="story-box">
            <div className="story-text">
              <div className="welcome-header">
                <span className="welcome-text">Welcome to</span>
                <span className="company-name">TechCorp's AI Lab!</span>
              </div>
              <p>You are new hires about to witness our advanced AI assistant, but something's gone wrong...</p>
              <p>The AI has encountered system glitches causing security lockdowns. As the newest team members, you must help restore the AI's functions by completing diagnostic modules.</p>
              <p>Each module will teach you essential concepts about AI while helping our digital colleague get back online.</p>
            </div>
            <div className="story-visual">
              <div className="story-icon">🤖</div>
              <div className="story-features">
                <div className="feature-item">
                  <span className="emoji">🧠</span>
                  Learn AI Basics
                </div>
                <div className="feature-item">
                  <span className="emoji">🔒</span>
                  Data Privacy
                </div>
                <div className="feature-item">
                  <span className="emoji">💬</span>
                  AI Communication
                </div>
                <div className="feature-item">
                  <span className="emoji">⚖️</span>
                  Ethics & Responsibility
                </div>
              </div>
            </div>
          </div>
          <button 
            className="start-button"
            onClick={() => setGameStarted(true)}
          >
            🚀 Begin Diagnostic Sequence
          </button>
        </div>
      </div>
    )
  }

  if (completedPuzzles.length === puzzles.length && !isTransitioning) {
    return <GameComplete />
  }

  // Show AI messages in center during transitions
  if (isTransitioning) {
    return (
      <div className="center-ai-screen">
        <div className="center-ai-content">
          <div className="ai-avatar-large">🤖</div>
          <div className="ai-messages-center">
            {aiMessages.map((message) => (
              <div key={message.id} className="ai-message-center">
                {message.text}
              </div>
            ))}
          </div>
          {canSkip && (
            <div className="skip-instruction">
              <button className="skip-button" onClick={skipToNext}>
                ⏭️ Continue
              </button>
            </div>
          )}
        </div>
        <div className="ambient-elements">
          <div className="tech-grid"></div>
          <div className="floating-particles"></div>
        </div>
      </div>
    )
  }

  const CurrentPuzzleComponent = puzzles[currentPuzzle].component

  if (!showPuzzle) {
    // Auto-advance after 3 seconds for "Preparing" screen
    setTimeout(() => {
      showIntroMessage(currentPuzzle)
    }, 3000)
    
    return (
      <div className="center-ai-screen">
        <div className="center-ai-content">
          <div className="ai-avatar-large">⚙️</div>
          <div className="ai-messages-center">
            <div className="ai-message-center">
              Preparing diagnostic module...
            </div>
          </div>
        </div>
        <div className="ambient-elements">
          <div className="tech-grid"></div>
          <div className="floating-particles"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="escape-room">
      <div className="ai-interface">
        <div className="ai-status">
          <div className="ai-avatar">🤖</div>
          <div className="system-status">
            <h3>AI Assistant Status</h3>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{width: `${(completedPuzzles.length / puzzles.length) * 100}%`}}
              ></div>
            </div>
            <p>{completedPuzzles.length}/{puzzles.length} modules restored</p>
          </div>
        </div>
        
        {aiMessages.map((message) => (
          <div key={message.id} className="ai-message">
            💬 {message.text}
          </div>
        ))}
        
        <div className="did-you-know-sidebar">
          <h4>💡 Did You Know?</h4>
          <p>{puzzles[currentPuzzle].didYouKnow || "AI systems excel at pattern recognition and data processing but cannot truly 'understand' concepts the way humans do. They work by finding statistical patterns in training data!"}</p>
        </div>
      </div>

      <div className="puzzle-area">
        <div className="puzzle-header">
          <h2>Module {currentPuzzle + 1}: {puzzles[currentPuzzle].title}</h2>
          <div className="module-indicators">
            {puzzles.map((_, index) => (
              <div 
                key={index} 
                className={`module-indicator ${
                  completedPuzzles.includes(index) ? 'completed' : 
                  index === currentPuzzle ? 'active' : 'locked'
                }`}
              >
                {completedPuzzles.includes(index) ? '✓' : index + 1}
              </div>
            ))}
          </div>
        </div>
        
        <CurrentPuzzleComponent 
          onComplete={() => completePuzzle(currentPuzzle)}
          addAIMessage={addAIMessage}
          clearAllAIMessages={clearAllAIMessages}
        />
      </div>

      <div className="ambient-elements">
        <div className="tech-grid"></div>
        <div className="floating-particles"></div>
      </div>
    </div>
  )
}

export default App
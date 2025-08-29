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
  const [transitionType, setTransitionType] = useState('') // 'welcome', 'intro', 'completion'
  const [messageTimeouts, setMessageTimeouts] = useState([])

  const puzzles = [
    { 
      component: AIBasicsQuiz, 
      title: "AI Capabilities Assessment",
      introMessage: "Let's start with the basics. I need to assess your understanding of AI capabilities and limitations. This will help me calibrate my systems properly."
    },
    { 
      component: PromptingChallenge, 
      title: "Communication Protocol",
      introMessage: "Now I need to test our communication interface. My language processing module seems to be misinterpreting requests. Help me fix this by showing you understand clear communication."
    },
    { 
      component: PrivacyPuzzle, 
      title: "Data Security Analysis",
      introMessage: "My privacy protocols are showing warnings. I need to verify that you understand data protection principles before we can continue with sensitive operations."
    },
    { 
      component: ConsciousnessPuzzle, 
      title: "Pattern Recognition Study",
      introMessage: "There's something unusual happening with my self-awareness subroutines. I need you to help me understand what consciousness and intelligence really mean."
    },
    { 
      component: ResponsibleAI, 
      title: "Ethics Evaluation",
      introMessage: "This is the final diagnostic. My ethical decision-making framework needs calibration. Show me you understand responsible AI principles so I can trust my own judgment."
    }
  ]

  const addAIMessage = (message, duration = 10000) => {
    const messageId = Date.now()
    setAiMessages(prev => [...prev, { id: messageId, text: message, duration }])
    
    const timeoutId = setTimeout(() => {
      setAiMessages(prev => prev.filter(msg => msg.id !== messageId))
      setMessageTimeouts(prev => prev.filter(id => id !== timeoutId))
    }, duration)
    
    // Track this timeout so we can clear it later
    setMessageTimeouts(prev => [...prev, timeoutId])
  }

  const clearAllAIMessages = () => {
    // Clear all message timeouts
    messageTimeouts.forEach(timeoutId => clearTimeout(timeoutId))
    setMessageTimeouts([])
    
    // Clear all messages immediately
    setAiMessages([])
  }

  const addTransitionMessage = (message, duration = 10000) => {
    const messageId = Date.now()
    setAiMessages(prev => [...prev, { id: messageId, text: message, duration }])
    
    const timeoutId = setTimeout(() => {
      setAiMessages(prev => prev.filter(msg => msg.id !== messageId))
      setMessageTimeouts(prev => prev.filter(id => id !== timeoutId))
    }, duration)

    // Store timeout ID for potential cleanup (only for transition messages)
    setActiveTimeout(timeoutId)
    setMessageTimeouts(prev => [...prev, timeoutId])
  }

  const skipToNext = () => {
    if (!canSkip) return
    
    // Clear ALL timeouts and messages immediately
    if (activeTimeout) {
      clearTimeout(activeTimeout)
      setActiveTimeout(null)
    }
    
    clearAllAIMessages()
    
    // Handle different transition types
    switch (transitionType) {
      case 'welcome':
        // Skip welcome message - go to first puzzle intro
        showIntroMessage(0)
        break
      case 'intro':
        // Skip intro message - show puzzle now
        setShowPuzzle(true)
        setIsTransitioning(false)
        setCanSkip(false)
        setTransitionType('')
        break
      case 'completion':
        // Skip completion message - move to next step
        if (currentPuzzle < puzzles.length - 1) {
          setCurrentPuzzle(prev => prev + 1)
          showIntroMessage(currentPuzzle + 1)
        } else {
          // Game complete
          setIsTransitioning(false)
          setCanSkip(false)
          setTransitionType('')
        }
        break
      default:
        // Fallback
        setCanSkip(false)
        break
    }
  }

  const showIntroMessage = (puzzleIndex) => {
    const puzzle = puzzles[puzzleIndex]
    
    // Clear any existing messages first
    clearAllAIMessages()
    
    setShowPuzzle(false)
    setIsTransitioning(true)
    setCanSkip(true)
    setTransitionType('intro')
    
    // Show intro message for 15 seconds
    addTransitionMessage(puzzle.introMessage, 15000)
    
    // Show puzzle after 15 seconds
    const timeoutId = setTimeout(() => {
      setShowPuzzle(true)
      setIsTransitioning(false)
      setCanSkip(false)
      setTransitionType('')
    }, 15000)
    
    setActiveTimeout(timeoutId)
  }

  const completePuzzle = (puzzleIndex) => {
    if (!completedPuzzles.includes(puzzleIndex)) {
      setCompletedPuzzles(prev => [...prev, puzzleIndex])
      
      // Clear any existing messages first
      clearAllAIMessages()
      
      setShowPuzzle(false)
      setIsTransitioning(true)
      setCanSkip(true)
      setTransitionType('completion')
      
      // Show completion message
      addTransitionMessage(`Excellent work! System module ${puzzleIndex + 1} restored.`, 10000)
      
      if (puzzleIndex < puzzles.length - 1) {
        // After 10 seconds, show next puzzle intro
        const timeoutId = setTimeout(() => {
          setCurrentPuzzle(puzzleIndex + 1)
          showIntroMessage(puzzleIndex + 1)
        }, 10000)
        
        setActiveTimeout(timeoutId)
      } else {
        // Game complete after 10 seconds
        const timeoutId = setTimeout(() => {
          setIsTransitioning(false)
          setCanSkip(false)
          setTransitionType('')
        }, 10000)
        
        setActiveTimeout(timeoutId)
      }
    }
  }

  useEffect(() => {
    if (gameStarted && !isTransitioning) {
      setCanSkip(true)
      setTransitionType('welcome')
      addTransitionMessage("Welcome, new hires! I'm experiencing some system glitches. Help me restore my functions by completing these diagnostic modules.", 15000)
      
      // Start first puzzle after welcome message
      const timeoutId = setTimeout(() => {
        showIntroMessage(0)
      }, 15000)
      
      setActiveTimeout(timeoutId)
    }
  }, [gameStarted])

  if (!gameStarted) {
    return (
      <div className="intro-screen">
        <div className="intro-content">
          <h1>🤖 AI Systems Diagnostic Center</h1>
          <div className="story-box">
            <p>Welcome to TechCorp's AI Demonstration Room!</p>
            <p>You are new hires about to witness our advanced AI assistant, but something's gone wrong...</p>
            <p>The AI has encountered system glitches causing security lockdowns. As the newest team members, you must help restore the AI's functions by completing diagnostic modules.</p>
            <p>Each module will teach you essential concepts about AI while helping our digital colleague get back online.</p>
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

  const CurrentPuzzleComponent = puzzles[currentPuzzle].component

  return (
    <div className="escape-room">
      <div className="ai-interface">
        <div className="ai-status">
          <div 
            className={`ai-avatar ${canSkip ? 'clickable' : ''}`}
            onClick={skipToNext}
            title={canSkip ? "Click to skip to next step" : ""}
          >
            🤖
          </div>
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
            {canSkip && message.duration > 10000 && (
              <div className="skip-hint">
                <small>💡 Click the robot to skip ahead</small>
              </div>
            )}
          </div>
        ))}
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
        
        {showPuzzle && !isTransitioning ? (
          <CurrentPuzzleComponent 
            onComplete={() => completePuzzle(currentPuzzle)}
            addAIMessage={addAIMessage}
            clearAllAIMessages={clearAllAIMessages}
          />
        ) : (
          <div 
            className={`loading-state ${canSkip ? 'clickable' : ''}`}
            onClick={skipToNext}
            title={canSkip ? "Click to skip to next step" : ""}
          >
            <div className="loading-content">
              {isTransitioning ? (
                <>
                  <div className="loading-spinner">🔄</div>
                  <p>Processing diagnostic data...</p>
                  {canSkip && (
                    <div className="skip-instruction">
                      <small>💡 Click anywhere to skip</small>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="loading-spinner">⚡</div>
                  <p>Initializing AI diagnostic systems...</p>
                  {canSkip && (
                    <div className="skip-instruction">
                      <small>💡 Click anywhere to skip</small>
                    </div>
                  )}
                </>
              )}
            </div>
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

export default App
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

  const puzzles = [
    { component: AIBasicsQuiz, title: "AI Capabilities Assessment" },
    { component: PromptingChallenge, title: "Communication Protocol" },
    { component: PrivacyPuzzle, title: "Data Security Analysis" },
    { component: ConsciousnessPuzzle, title: "Pattern Recognition Study" },
    { component: ResponsibleAI, title: "Ethics Evaluation" }
  ]

  const addAIMessage = (message) => {
    setAiMessages(prev => [...prev, message])
    setTimeout(() => {
      setAiMessages(prev => prev.slice(1))
    }, 5000)
  }

  const completePuzzle = (puzzleIndex) => {
    if (!completedPuzzles.includes(puzzleIndex)) {
      setCompletedPuzzles(prev => [...prev, puzzleIndex])
      addAIMessage(`Excellent work! System module ${puzzleIndex + 1} restored.`)
      
      if (puzzleIndex < puzzles.length - 1) {
        setTimeout(() => {
          setCurrentPuzzle(puzzleIndex + 1)
          addAIMessage(`Initializing next diagnostic module...`)
        }, 2000)
      }
    }
  }

  useEffect(() => {
    if (gameStarted) {
      addAIMessage("Welcome, new hires! I'm experiencing some system glitches. Help me restore my functions by completing these diagnostic modules.")
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

  if (completedPuzzles.length === puzzles.length) {
    return <GameComplete />
  }

  const CurrentPuzzleComponent = puzzles[currentPuzzle].component

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
        
        {aiMessages.map((message, index) => (
          <div key={index} className="ai-message">
            💬 {message}
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
        
        <CurrentPuzzleComponent 
          onComplete={() => completePuzzle(currentPuzzle)}
          addAIMessage={addAIMessage}
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

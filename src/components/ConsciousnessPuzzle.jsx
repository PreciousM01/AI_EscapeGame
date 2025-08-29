import { useState } from 'react'

const ConsciousnessPuzzle = ({ onComplete, addAIMessage }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [userAnswers, setUserAnswers] = useState({})
  const [showExplanation, setShowExplanation] = useState(false)
  const [internalMessage, setInternalMessage] = useState('')
  const [showInternalMessage, setShowInternalMessage] = useState(false)
  const [waitingForNext, setWaitingForNext] = useState(false)
  const [nextTimeout, setNextTimeout] = useState(null)

  const puzzleSteps = [
    {
      id: 'pattern1',
      title: "Pattern Recognition Challenge",
      question: "Look at this sequence: 🔴🔵🔴🔵🔴🔵 What comes next?",
      options: [
        { id: 'a', text: '🔴 Red Circle', correct: true },
        { id: 'b', text: '🔵 Blue Circle', correct: false },
        { id: 'c', text: '🟡 Yellow Circle', correct: false },
        { id: 'd', text: '🟢 Green Circle', correct: false }
      ],
      explanation: "You recognized the alternating pattern! This is exactly how AI works - it finds patterns in data.",
      incorrectFeedback: "Think about the pattern - what comes after blue in this sequence?"
    },
    {
      id: 'pattern2', 
      title: "AI Training Simulation",
      question: "An AI was trained on these examples:\n'The cat sat on the mat' → Happy\n'The dog ran in the park' → Happy\n'The bird flew away' → Sad\n\nWhat would it predict for 'The fish swam away'?",
      options: [
        { id: 'a', text: 'Happy - because it mentions an animal', correct: false },
        { id: 'b', text: 'Sad - because it contains the word "away"', correct: true },
        { id: 'c', text: 'Happy - because fish are nice', correct: false },
        { id: 'd', text: 'It would understand the fish is free', correct: false }
      ],
      explanation: "Correct! The AI found the pattern that sentences with 'away' are classified as 'Sad'. It doesn't understand freedom or emotions - just word patterns.",
      incorrectFeedback: "Look at the training examples again. What pattern would the AI notice in the words?"
    },
    {
      id: 'understanding',
      title: "The Understanding Test",
      question: "A human child and an AI both correctly identify 1000 pictures of cats. What's the key difference?",
      options: [
        { id: 'a', text: 'The child is slower at processing', correct: false },
        { id: 'b', text: 'The AI is more accurate', correct: false },
        { id: 'c', text: 'The child understands what "cat" means, the AI just matches patterns', correct: true },
        { id: 'd', text: 'There is no difference', correct: false }
      ],
      explanation: "Exactly! The child knows a cat is a living, breathing animal with feelings. The AI just learned that certain pixel patterns = 'cat' label.",
      incorrectFeedback: "Think about what 'understanding' really means versus pattern recognition."
    },
    {
      id: 'consciousness',
      title: "The Consciousness Question",
      question: "When an AI says 'I understand' or 'I think', what is actually happening?",
      options: [
        { id: 'a', text: 'The AI is genuinely thinking like humans do', correct: false },
        { id: 'b', text: 'The AI has developed consciousness', correct: false },
        { id: 'c', text: 'The AI is reproducing language patterns it learned from training data', correct: true },
        { id: 'd', text: 'The AI is pretending to understand', correct: false }
      ],
      explanation: "Perfect! AI generates human-like responses by predicting what words should come next based on patterns, not because it actually thinks or understands.",
      incorrectFeedback: "Consider how AI generates language - is it thinking or following patterns?"
    }
  ]

  const showInternalFeedback = (message, isCorrect, duration = 5000) => {
    setInternalMessage(message)
    setShowInternalMessage(true)
    setShowExplanation(isCorrect)
    setWaitingForNext(true)
    
    const timeoutId = setTimeout(() => {
      continueAfterMessage()
    }, duration)
    
    setNextTimeout(timeoutId)
  }

  const skipInternalMessage = () => {
    if (!waitingForNext) return
    
    if (nextTimeout) {
      clearTimeout(nextTimeout)
      setNextTimeout(null)
    }
    
    continueAfterMessage()
  }

  const continueAfterMessage = () => {
    setShowInternalMessage(false)
    setInternalMessage('')
    setWaitingForNext(false)
    
    if (showExplanation) {
      // Was a correct answer
      if (currentStep < puzzleSteps.length - 1) {
        setCurrentStep(prev => prev + 1)
        setShowExplanation(false)
      } else {
        // Completed all steps
        addAIMessage("Excellent! You understand that AI processes patterns, not meaning.")
        setTimeout(() => onComplete(), 2000)
      }
    }
    // If incorrect answer, just hide the message and stay on same question
  }

  const handleAnswer = (stepId, optionId) => {
    setUserAnswers(prev => ({
      ...prev,
      [stepId]: optionId
    }))
  }

  const checkCurrentAnswer = () => {
    const currentPuzzle = puzzleSteps[currentStep]
    const userAnswer = userAnswers[currentPuzzle.id]
    const correctOption = currentPuzzle.options.find(opt => opt.correct)
    
    if (userAnswer === correctOption.id) {
      // Correct answer - show explanation in quiz interface
      showInternalFeedback(currentPuzzle.explanation, true, 5000)
    } else {
      // Incorrect answer - show feedback in quiz interface
      showInternalFeedback(currentPuzzle.incorrectFeedback, false, 4000)
    }
  }

  const currentPuzzle = puzzleSteps[currentStep]

  if (waitingForNext) {
    return (
      <div className="puzzle-container">
        <div 
          className="waiting-screen clickable"
          onClick={skipInternalMessage}
          title="Click to continue"
        >
          <div className="feedback-message">
            <div className="feedback-content">
              <div className={showExplanation ? "success-message" : "info-message"}>
                <h4>{showExplanation ? "✅ Correct!" : "💭 Think About It"}</h4>
                <p>{internalMessage}</p>
                {showExplanation && currentStep < puzzleSteps.length - 1 && (
                  <p style={{marginTop: '1rem', fontStyle: 'italic'}}>
                    Moving to next step...
                  </p>
                )}
              </div>
              <div className="skip-instruction">
                <small>💡 Click anywhere to continue</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="puzzle-container">
      <div className="question-card">
        <h3>Step {currentStep + 1} of {puzzleSteps.length}: {currentPuzzle.title}</h3>
        
        <div style={{background: 'rgba(0, 212, 255, 0.1)', padding: '1.5rem', borderRadius: '8px', margin: '1.5rem 0'}}>
          <p style={{fontSize: '1.1rem', lineHeight: '1.6', whiteSpace: 'pre-line'}}>
            {currentPuzzle.question}
          </p>
        </div>

        <div className="options-grid">
          {currentPuzzle.options.map(option => (
            <button
              key={option.id}
              className={`option-button ${
                userAnswers[currentPuzzle.id] === option.id ? 'selected' : ''
              }`}
              onClick={() => handleAnswer(currentPuzzle.id, option.id)}
            >
              {option.text}
            </button>
          ))}
        </div>

        <button 
          className="submit-button"
          onClick={checkCurrentAnswer}
          disabled={!userAnswers[currentPuzzle.id]}
        >
          🧠 Submit Answer
        </button>

        <div style={{marginTop: '2rem', textAlign: 'center'}}>
          <div style={{display: 'flex', justifyContent: 'center', gap: '0.5rem'}}>
            {puzzleSteps.map((_, index) => (
              <div 
                key={index}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: index <= currentStep ? '#00d4ff' : 'rgba(255, 255, 255, 0.3)'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="did-you-know">
        <h4>💡 Did You Know?</h4>
        <p>AI systems are incredibly sophisticated pattern-matching machines, but they don't have consciousness, emotions, or true understanding. They process information mechanically, without the subjective experience that defines human consciousness.</p>
      </div>
    </div>
  )
}

export default ConsciousnessPuzzle
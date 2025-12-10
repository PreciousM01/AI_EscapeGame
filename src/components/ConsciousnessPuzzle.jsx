import { useState } from 'react'

const ConsciousnessPuzzle = ({ onComplete, addAIMessage }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [userAnswers, setUserAnswers] = useState({})
  const [showValidation, setShowValidation] = useState(false)

  const puzzleSteps = [
    {
      id: 'pattern1',
      title: "Pattern Recognition Challenge",
      question: "Look at this sequence: 🔴🔵🔴🔵🔴🔵 What comes next?",
      options: [
        { id: 'a', text: '🟢 Green Circle', correct: false },
        { id: 'b', text: '🔵 Blue Circle', correct: false },
        { id: 'c', text: '🟡 Yellow Circle', correct: false },
        { id: 'd', text: '🔴 Red Circle', correct: true}
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
        { id: 'a', text: 'The AI is reproducing language patterns it learned from training data', correct: true},
        { id: 'b', text: 'The AI has developed consciousness', correct: false },
        { id: 'c', text: 'The AI is genuinely thinking like humans do', correct: false },
        { id: 'd', text: 'The AI is pretending to understand', correct: false }
      ],
      explanation: "Perfect! AI generates human-like responses by predicting what words should come next based on patterns, not because it actually thinks or understands.",
      incorrectFeedback: "Consider how AI generates language - is it thinking or following patterns?"
    }
  ]



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
    
    setShowValidation(true)
    
    if (userAnswer === correctOption.id) {
      // Correct answer - show green and move to next after 3 seconds
      addAIMessage(currentPuzzle.explanation, 4000)
      
      if (currentStep < puzzleSteps.length - 1) {
        setTimeout(() => {
          setCurrentStep(prev => prev + 1)
          setShowValidation(false)
        }, 4000)
      } else {
        setTimeout(() => {
          addAIMessage("Excellent! You understand that AI processes patterns, not meaning.")
          onComplete()
        }, 4000)
      }
    } else {
      // Incorrect answer - show feedback and reset validation after 4 seconds
      addAIMessage(currentPuzzle.incorrectFeedback, 4000)
      setTimeout(() => {
        setShowValidation(false)
      }, 4000)
    }
  }

  const currentPuzzle = puzzleSteps[currentStep]



  return (
    <div className="puzzle-container">
      <div className="question-card">
        <div className="question-change-indicator">
          <h3>Step {currentStep + 1} of {puzzleSteps.length}: {currentPuzzle.title}</h3>
          <div className="question-badge">Question {currentStep + 1}</div>
        </div>
        
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
              } ${
                showValidation ? (
                  option.correct ? 'correct' : 
                  userAnswers[currentPuzzle.id] === option.id ? 'incorrect' : ''
                ) : ''
              }`}
              onClick={() => !showValidation && handleAnswer(currentPuzzle.id, option.id)}
              disabled={showValidation}
            >
              {option.text}
            </button>
          ))}
        </div>

        <button 
          className="submit-button"
          onClick={checkCurrentAnswer}
          disabled={!userAnswers[currentPuzzle.id] || showValidation}
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


    </div>
  )
}

export default ConsciousnessPuzzle
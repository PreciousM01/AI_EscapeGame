import { useState } from 'react'

const ResponsibleAI = ({ onComplete, addAIMessage, clearAllAIMessages }) => {
  const [currentScenario, setCurrentScenario] = useState(0)
  const [selectedChoices, setSelectedChoices] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [failedQuestions, setFailedQuestions] = useState([])
  const [isRetaking, setIsRetaking] = useState(false)
  const [retakeIndex, setRetakeIndex] = useState(0)
  const [originalAttemptResults, setOriginalAttemptResults] = useState({})
  const [waitingForNext, setWaitingForNext] = useState(false)
  const [canSkipToNext, setCanSkipToNext] = useState(false)
  const [nextTimeout, setNextTimeout] = useState(null)

  const scenarios = [
    {
      id: 1,
      title: "🏥 Healthcare AI Assistant",
      situation: "A hospital wants to use AI to help diagnose patients faster. The AI has been trained on medical data and shows 95% accuracy in tests.",
      question: "What's the most responsible approach?",
      choices: [
        {
          id: 'a',
          text: "Replace doctors with AI since it's more accurate",
          responsible: false,
          feedback: "❌ AI should assist, not replace human medical professionals who provide critical judgment and empathy."
        },
        {
          id: 'b', 
          text: "Use AI as a diagnostic aid while doctors make final decisions",
          responsible: true,
          feedback: "✅ Perfect! AI can enhance human capabilities while keeping humans in control of critical decisions."
        },
        {
          id: 'c',
          text: "Only use AI for minor cases to save money",
          responsible: false,
          feedback: "❌ This approach doesn't consider patient safety or the value of human oversight in all medical situations."
        }
      ]
    },
    {
      id: 2,
      title: "🎓 Educational AI Tutor",
      situation: "A school district wants to implement AI tutoring systems that adapt to each student's learning pace and style.",
      question: "What ethical considerations are most important?",
      choices: [
        {
          id: 'a',
          text: "Collect detailed data on student behavior to improve AI performance",
          responsible: false,
          feedback: "❌ Student privacy must be protected. Collect only necessary data with proper consent and security."
        },
        {
          id: 'b',
          text: "Ensure the AI doesn't replace human teachers and protects student privacy",
          responsible: true,
          feedback: "✅ Excellent! AI should enhance education while preserving human connection and protecting sensitive data."
        },
        {
          id: 'c',
          text: "Use AI to automatically grade and rank all students",
          responsible: false,
          feedback: "❌ Automated ranking could introduce bias and reduce education to mere test scores."
        }
      ]
    },
    {
      id: 3,
      title: "🚗 Autonomous Vehicle Decision",
      situation: "An AI-powered car must make a split-second decision in an unavoidable accident scenario.",
      question: "How should we approach this ethical dilemma?",
      choices: [
        {
          id: 'a',
          text: "Program the AI to always protect the passenger at any cost",
          responsible: false,
          feedback: "❌ This could lead to unfair outcomes and doesn't consider the broader ethical implications."
        },
        {
          id: 'b',
          text: "Have transparent public discussions about these decisions before deployment",
          responsible: true,
          feedback: "✅ Right! Ethical AI decisions should involve public input and transparent decision-making processes."
        },
        {
          id: 'c',
          text: "Let the AI learn these decisions from accident data",
          responsible: false,
          feedback: "❌ Life-and-death decisions shouldn't be left to pattern matching from historical data."
        }
      ]
    },
    {
      id: 4,
      title: "💼 AI Hiring Assistant",
      situation: "A company wants to use AI to screen job applications and rank candidates to speed up hiring.",
      question: "What's the biggest risk to address?",
      choices: [
        {
          id: 'a',
          text: "The AI might be slower than human recruiters",
          responsible: false,
          feedback: "❌ Speed isn't the main concern - fairness and bias prevention are much more important."
        },
        {
          id: 'b',
          text: "The AI could perpetuate historical hiring biases against certain groups",
          responsible: true,
          feedback: "✅ Correct! AI can amplify existing biases in training data, leading to unfair discrimination."
        },
        {
          id: 'c',
          text: "Candidates might not like interacting with AI",
          responsible: false,
          feedback: "❌ While user experience matters, preventing discrimination is the critical ethical issue here."
        }
      ]
    },
    {
      id: 5,
      title: "🌍 AI Environmental Monitor",
      situation: "An AI system monitors environmental data and could predict natural disasters, but it sometimes gives false alarms.",
      question: "How should authorities handle this?",
      choices: [
        {
          id: 'a',
          text: "Ignore AI warnings to avoid unnecessary panic",
          responsible: false,
          feedback: "❌ Ignoring warnings could lead to preventable disasters and loss of life."
        },
        {
          id: 'b',
          text: "Always evacuate immediately when AI predicts danger",
          responsible: false,
          feedback: "❌ This could lead to 'alert fatigue' and waste resources on false alarms."
        },
        {
          id: 'c',
          text: "Use AI predictions as one factor in human decision-making processes",
          responsible: true,
          feedback: "✅ Perfect! AI should inform human judgment, not replace it in critical safety decisions."
        }
      ]
    }
  ]

  const handleChoice = (scenarioId, choiceId) => {
    setSelectedChoices(prev => ({
      ...prev,
      [scenarioId]: choiceId
    }))
  }

  const getCurrentScenario = () => {
    if (isRetaking) {
      return failedQuestions[retakeIndex]
    }
    return scenarios[currentScenario]
  }

  const moveToNextScenario = () => {
    if (isRetaking) {
      // Handle retaking failed questions
      if (retakeIndex < failedQuestions.length - 1) {
        // Move to next failed question
        setRetakeIndex(prev => prev + 1)
      } else {
        // Finished retaking all failed questions - calculate final score
        const retakeScore = failedQuestions.reduce((total, failedScenario) => {
          const selectedChoice = selectedChoices[failedScenario.id]
          const choice = failedScenario.choices.find(c => c.id === selectedChoice)
          return total + (choice?.responsible ? 1 : 0)
        }, 0)

        // Add score from questions they got right the first time
        const originalCorrectCount = Object.entries(originalAttemptResults)
          .filter(([scenarioId, wasCorrect]) => 
            wasCorrect && !failedQuestions.some(q => q.id === parseInt(scenarioId))
          ).length

        const finalScore = originalCorrectCount + retakeScore
        
        if (finalScore >= 4) {
          if (clearAllAIMessages) clearAllAIMessages()
          addAIMessage("Excellent improvement! You now understand responsible AI principles.")
          setTimeout(() => onComplete(), 2000)
        } else {
          // Find questions they still got wrong
          const stillFailedQuestions = failedQuestions.filter(failedScenario => {
            const selectedChoice = selectedChoices[failedScenario.id]
            const choice = failedScenario.choices.find(c => c.id === selectedChoice)
            return !choice?.responsible
          })
          
          if (stillFailedQuestions.length > 0) {
            if (clearAllAIMessages) clearAllAIMessages()
            addAIMessage(`You're improving! Let's review the remaining ${stillFailedQuestions.length} questions you missed.`)
            setTimeout(() => {
              setFailedQuestions(stillFailedQuestions)
              setRetakeIndex(0)
              setSelectedChoices({})
            }, 3000)
          } else {
            setTimeout(() => onComplete(), 1000)
          }
        }
      }
    } else {
      // Handle original attempt
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(prev => prev + 1)
      } else {
        // Finished all original questions
        const finalScore = score
        setShowResults(true)
        
        if (finalScore >= 4) {
          if (clearAllAIMessages) clearAllAIMessages()
          addAIMessage("Outstanding! You understand responsible AI principles.")
          setTimeout(() => onComplete(), 2000)
        } else {
          // Identify failed questions for retake
          const failed = scenarios.filter(scenario => {
            const selectedChoice = selectedChoices[scenario.id]
            const selectedChoiceObj = scenario.choices.find(c => c.id === selectedChoice)
            return !selectedChoiceObj?.responsible
          })
          
          setFailedQuestions(failed)
          
          if (clearAllAIMessages) clearAllAIMessages()
          addAIMessage(`You got ${finalScore}/${scenarios.length} correct. Let's review just the ${failed.length} questions you missed.`)
          setTimeout(() => {
            setShowResults(false)
            setIsRetaking(true)
            setRetakeIndex(0)
            setScore(0)
            setSelectedChoices({})
          }, 3000)
        }
      }
    }
    
    setWaitingForNext(false)
    setCanSkipToNext(false)
    if (nextTimeout) {
      clearTimeout(nextTimeout)
      setNextTimeout(null)
    }
  }

  const skipToNextScenario = () => {
    if (!canSkipToNext) return
    
    // Clear all AI messages immediately
    if (clearAllAIMessages) {
      clearAllAIMessages()
    }
    
    moveToNextScenario()
  }

  const submitScenario = () => {
    const scenario = getCurrentScenario()
    const selectedChoice = selectedChoices[scenario.id]
    const choice = scenario.choices.find(c => c.id === selectedChoice)
    
    // Track results for original attempt
    if (!isRetaking) {
      setOriginalAttemptResults(prev => ({
        ...prev,
        [scenario.id]: choice.responsible
      }))
    }
    
    if (choice.responsible) {
      setScore(prev => prev + 1)
    }
    
    // Show AI feedback message for 10 seconds
    addAIMessage(choice.feedback, 10000)
    setWaitingForNext(true)
    setCanSkipToNext(true)
    
    // After 10 seconds, move to next scenario
    const timeoutId = setTimeout(() => {
      moveToNextScenario()
    }, 10000)
    
    setNextTimeout(timeoutId)
  }

  if (showResults) {
    const finalScore = score
    return (
      <div className="puzzle-container">
        <div className={finalScore >= 4 ? "success-message" : "error-message"}>
          <h3>{finalScore >= 4 ? "🎉 Ethics Module Complete!" : "📚 Let's Review"}</h3>
          <p>You scored {finalScore}/{scenarios.length} on responsible AI scenarios.</p>
          {finalScore >= 4 ? (
            <p>You've demonstrated strong understanding of AI ethics and responsible deployment!</p>
          ) : (
            <p>Don't worry! We'll review just the {failedQuestions.length} questions you missed to help you improve.</p>
          )}
        </div>
      </div>
    )
  }

  if (waitingForNext) {
    return (
      <div className="puzzle-container">
        <div 
          className="waiting-screen clickable"
          onClick={skipToNextScenario}
          title="Click to continue to next question"
        >
          <div className="loading-content">
            <div className="loading-spinner">⚖️</div>
            <p>Processing ethical analysis...</p>
            <div className="skip-instruction">
              <small>💡 Click anywhere to continue</small>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const scenario = getCurrentScenario()
  const questionNumber = isRetaking ? retakeIndex + 1 : currentScenario + 1
  const totalQuestions = isRetaking ? failedQuestions.length : scenarios.length

  return (
    <div className="puzzle-container">
      <div className="question-card">
        {isRetaking && (
          <div style={{background: 'rgba(255, 165, 0, 0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem'}}>
            <h4>🔄 Review Mode</h4>
            <p>You're reviewing the questions you missed. Focus on the ethical principles!</p>
          </div>
        )}
        
        <h3>{scenario.title}</h3>
        <div style={{background: 'rgba(255, 255, 255, 0.1)', padding: '1.5rem', borderRadius: '8px', margin: '1.5rem 0'}}>
          <h4>Situation:</h4>
          <p style={{marginBottom: '1rem'}}>{scenario.situation}</p>
          <h4 style={{color: '#00d4ff'}}>{scenario.question}</h4>
        </div>

        <div className="options-grid">
          {scenario.choices.map(choice => (
            <button
              key={choice.id}
              className={`option-button ${
                selectedChoices[scenario.id] === choice.id ? 'selected' : ''
              }`}
              onClick={() => handleChoice(scenario.id, choice.id)}
              style={{textAlign: 'left', minHeight: '80px'}}
            >
              {choice.text}
            </button>
          ))}
        </div>

        <button 
          className="submit-button"
          onClick={submitScenario}
          disabled={!selectedChoices[scenario.id]}
        >
          ⚖️ Submit Ethical Choice
        </button>

        <div style={{textAlign: 'center', marginTop: '1.5rem'}}>
          <p>
            {isRetaking ? 'Review Question' : 'Scenario'} {questionNumber} of {totalQuestions}
            {isRetaking && <span style={{color: '#ff9500'}}> (Retake)</span>}
          </p>
          <div style={{display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem'}}>
            {Array.from({length: totalQuestions}).map((_, index) => (
              <div 
                key={index}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: index <= (questionNumber - 1) ? 
                    (isRetaking ? '#ff9500' : '#00d4ff') : 
                    'rgba(255, 255, 255, 0.3)'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="did-you-know">
        <h4>💡 Did You Know?</h4>
        <p>Responsible AI development involves considering fairness, transparency, accountability, and human oversight. AI should augment human capabilities, not replace human judgment in critical decisions!</p>
        {isRetaking && (
          <p style={{marginTop: '0.5rem', color: '#ff9500'}}>
            <strong>Review tip:</strong> Think about what could go wrong and how to keep humans in control of important decisions.
          </p>
        )}
      </div>
    </div>
  )
}

export default ResponsibleAI
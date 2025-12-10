/*A series of quizes about what AI can and cannot do.
Each question is stored as a struct that has the fields: id (int), question (string), options(struct), multiselect(bool).
*/

import { useState } from 'react'

const AIBasicsQuiz = ({ onComplete, addAIMessage }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showValidation, setShowValidation] = useState(false)

  const questions = [
    {
      id: 1,
      question: "Which of these tasks can AI currently perform well?",
      options: [
        { id: 'a', text: '🖼️ Recognize objects in images', correct: true },
        { id: 'b', text: '🧠 Experience emotions like humans', correct: false },
        { id: 'c', text: '📊 Analyze large datasets for patterns', correct: true },
        { id: 'd', text: '🎯 Make perfect predictions about the future', correct: false }
      ],
      multiSelect: true
    },
    {
      id: 2,
      question: "What is a major limitation of current AI systems?",
      options: [
        { id: 'a', text: 'They can process information faster than humans', correct: false },
        { id: 'b', text: 'They lack true understanding and consciousness', correct: true },
        { id: 'c', text: 'They can work 24/7 without breaks', correct: false },
        { id: 'd', text: 'They can store vast amounts of data', correct: false }
      ],
      multiSelect: false
    },
    {
      id: 3,
      question: "Which scenarios show appropriate AI use?",
      options: [
        { id: 'a', text: '🏥 Assisting doctors in medical diagnosis', correct: true },
        { id: 'b', text: '⚖️ Making final legal judgments without human oversight', correct: false },
        { id: 'c', text: '🎲 Making all important life decisions for people', correct: false  },
        { id: 'd', text: '📝 Helping with writing and editing tasks', correct: true }
      ],
      multiSelect: true
    }
  ]

  const handleAnswerSelect = (questionId, optionId) => {
    const question = questions.find(q => q.id === questionId)
    
    if (question.multiSelect) {
      setSelectedAnswers(prev => ({
        ...prev,
        [questionId]: {
          ...prev[questionId],
          [optionId]: !prev[questionId]?.[optionId]
        }
      }))
    } else {
      setSelectedAnswers(prev => ({
        ...prev,
        [questionId]: { [optionId]: true }
      }))
    }
  }

  const checkAnswers = () => {
    let correct = 0
    questions.forEach(question => {
      const userAnswers = selectedAnswers[question.id] || {}
      const correctAnswers = question.options.filter(opt => opt.correct)
      
      if (question.multiSelect) {
        const userCorrect = question.options.filter(opt => 
          userAnswers[opt.id] && opt.correct
        ).length
        const userIncorrect = question.options.filter(opt => 
          userAnswers[opt.id] && !opt.correct
        ).length
        
        if (userCorrect === correctAnswers.length && userIncorrect === 0) {
          correct++
        }
      } else {
        const userAnswer = Object.keys(userAnswers)[0]
        if (question.options.find(opt => opt.id === userAnswer)?.correct) {
          correct++
        }
      }
    })

    setShowResults(true)
    
    if (correct >= 2) {
      addAIMessage("Excellent! You understand AI capabilities and limitations.")
      setTimeout(() => onComplete(), 2000)
    } else {
      addAIMessage("Review the concepts and try again. Understanding AI basics is crucial!")
    }
  }

  const resetQuiz = () => {
    setSelectedAnswers({})
    setShowResults(false)
    setCurrentQuestion(0)
  }

  const question = questions[currentQuestion]

  return (
    <div className="quiz-container">
      <div className="question-card">
        <h3>Question {currentQuestion + 1} of {questions.length}</h3>
        <p style={{fontSize: '1.2rem', margin: '1rem 0'}}>{question.question}</p>
        
        {question.multiSelect && (
          <p style={{color: '#ffa500', fontSize: '0.9rem'}}>
            💡 Select all correct answers
          </p>
        )}

        <div className="options-grid">
          {question.options.map(option => (
            <button
              key={option.id}
              className={`option-button ${
                selectedAnswers[question.id]?.[option.id] ? 'selected' : ''
              } ${
                (showResults || showValidation) ? (
                  option.correct ? 'correct' : 
                  selectedAnswers[question.id]?.[option.id] ? 'incorrect' : ''
                ) : ''
              }`}
              onClick={() => !showResults && !showValidation && handleAnswerSelect(question.id, option.id)}
              disabled={showResults || showValidation}
            >
              {option.text}
            </button>
          ))}
        </div>

        <div style={{display: 'flex', gap: '1rem', marginTop: '1.5rem'}}>
          {currentQuestion > 0 && !showResults && (
            <button 
              className="submit-button"
              onClick={() => setCurrentQuestion(prev => prev - 1)}
            >
              ← Previous
            </button>
          )}
          
          {currentQuestion < questions.length - 1 && !showResults && (
            <button 
              className="submit-button"
              onClick={() => {
                setShowValidation(true)
                setTimeout(() => {
                  setCurrentQuestion(prev => prev + 1)
                  setShowValidation(false)
                }, 2500)
              }}
              disabled={!selectedAnswers[question.id]}
            >
              Next →
            </button>
          )}
          
          {currentQuestion === questions.length - 1 && !showResults && (
            <button 
              className="submit-button"
              onClick={checkAnswers}
              disabled={Object.keys(selectedAnswers).length < questions.length}
            >
              🔍 Analyze Results
            </button>
          )}
          
          {showResults && (
            <button className="submit-button" onClick={resetQuiz}>
              🔄 Try Again
            </button>
          )}
        </div>
      </div>


    </div>
  )
}

export default AIBasicsQuiz
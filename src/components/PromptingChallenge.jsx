import { useState } from 'react'

const PromptingChallenge = ({ onComplete, addAIMessage }) => {
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [completed, setCompleted] = useState(false)

  const challenges = [
    {
      id: 1,
      scenario: "🤖 AI Response: 'I found many results about fruit.'",
      problem: "The user asked: 'Tell me about Apple'",
      issue: "The AI misunderstood and gave information about the fruit instead of the company.",
      correctPrompts: [
        "tell me abotut apple inc",
        "apple company information",
        "apple inc the technology company",
        "information about apple corporation",
        "apple the tech company"
      ],
      hint: "Be more specific about which 'Apple' you mean. Add context like 'company' or 'Inc.'",
      explanation: "Adding context helps AI distinguish between different meanings of the same word."
    },
    {
      id: 2,
      scenario: "🤖 AI Response: 'Here's a 500-word essay about dogs in general.'",
      problem: "The user asked: 'Write about dogs'",
      issue: "Too vague - the AI provided generic information instead of what the user actually wanted.",
      correctPrompts: [
        "write a 200 word guide on dog training tips",
        "explain how to care for a new puppy",
        "list the best dog breeds for families with children",
        "write about dog nutrition and feeding schedules",
        "describe different dog training methods"
      ],
      hint: "Be specific about what aspect of dogs you want to know about and the format you prefer.",
      explanation: "Specific prompts with clear requirements produce much better, targeted responses."
    }
  ]

  const challenge = challenges[currentChallenge]

  const checkPrompt = () => {
    const input = userInput.toLowerCase().trim()
    const isCorrect = challenge.correctPrompts.some(correct => 
      input.includes(correct.toLowerCase()) || 
      (input.length > 10 && challenge.correctPrompts.some(c => 
        c.split(' ').every(word => input.includes(word.toLowerCase()))
      ))
    )

    setAttempts(prev => prev + 1)

    if (isCorrect) {
      addAIMessage("Perfect! That's a much clearer prompt that would get better results.")
      
      if (currentChallenge < challenges.length - 1) {
        setTimeout(() => {
          setCurrentChallenge(prev => prev + 1)
          setUserInput('')
          setAttempts(0)
          setShowHint(false)
        }, 2000)
      } else {
        setCompleted(true)
        setTimeout(() => onComplete(), 2000)
      }
    } else {
      if (attempts >= 2) {
        setShowHint(true)
        addAIMessage("Try being more specific about what you want. Check the hint below!")
      } else {
        addAIMessage("That prompt might still be unclear. Try being more specific!")
      }
    }
  }

  if (completed) {
    return (
      <div className="challenge-container">
        <div className="success-message">
          <h3>🎉 Communication Protocol Restored!</h3>
          <p>You've mastered the art of clear AI communication. Well done!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="challenge-container">
      <div className="question-card">
        <h3>Scenario {currentChallenge + 1} of {challenges.length}</h3>
        
        <div style={{background: 'rgba(255, 68, 68, 0.1)', padding: '1rem', borderRadius: '8px', margin: '1rem 0'}}>
          <h4>❌ What Went Wrong:</h4>
          <p><strong>User's Request:</strong> "{challenge.problem}"</p>
          <p><strong>AI's Response:</strong> {challenge.scenario}</p>
          <p><strong>Issue:</strong> {challenge.issue}</p>
        </div>

        <div style={{background: 'rgba(0, 212, 255, 0.1)', padding: '1rem', borderRadius: '8px', margin: '1rem 0'}}>
          <h4>🎯 Your Task:</h4>
          <p>Rewrite the user's request to be clearer and more specific so the AI gives the right response:</p>
        </div>

        <input
          type="text"
          className="input-field"
          placeholder="Enter your improved prompt here..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && userInput.trim() && checkPrompt()}
        />

        {showHint && (
          <div style={{background: 'rgba(255, 165, 0, 0.1)', padding: '1rem', borderRadius: '8px', margin: '1rem 0'}}>
            <h4>💡 Hint:</h4>
            <p>{challenge.hint}</p>
          </div>
        )}

        <button 
          className="submit-button"
          onClick={checkPrompt}
          disabled={!userInput.trim()}
        >
          🚀 Test Prompt
        </button>

        <div style={{marginTop: '1rem', fontSize: '0.9rem', color: '#ccc'}}>
          Attempts: {attempts}/3 {attempts >= 2 && "- Hint unlocked!"}
        </div>
      </div>

      <div className="did-you-know">
        <h4>💡 Did You Know?</h4>
        <p>Good prompts are specific, provide context, and clearly state the desired format or outcome. This is called "prompt engineering" and it's a crucial skill for working with AI!</p>
      </div>
    </div>
  )
}

export default PromptingChallenge
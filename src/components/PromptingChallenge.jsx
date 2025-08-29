import { useState } from 'react'

const PromptingChallenge = ({ onComplete, addAIMessage, clearAllAIMessages }) => {
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [waitingForNext, setWaitingForNext] = useState(false)
  const [canSkipToNext, setCanSkipToNext] = useState(false)
  const [clearMessages, setClearMessages] = useState(false)

  const challenges = [
    {
      id: 1,
      scenario: "🤖 AI Response: 'I found many results about fruit.'",
      problem: "The user asked: 'Tell me about Apple'",
      issue: "The AI misunderstood and gave information about the fruit instead of the company.",
      hint: "Be more specific about which 'Apple' you mean. Add context like 'company' or 'Inc.'",
      explanation: "Adding context helps AI distinguish between different meanings of the same word.",
      examples: [
        "Apple Inc company information",
        "Tell me about Apple the technology company", 
        "What does Apple corporation do?",
        "Apple computer business details"
      ]
    },
    {
      id: 2,
      scenario: "🤖 AI Response: 'Here's a 500-word essay about dogs in general.'",
      problem: "The user asked: 'Write about dogs'",
      issue: "Too vague - the AI provided generic information instead of what the user actually wanted.",
      hint: "Be specific about what aspect of dogs you want to know about and the format you prefer.",
      explanation: "Specific prompts with clear requirements produce much better, targeted responses.",
      examples: [
        "Write a guide on dog training tips for puppies",
        "List the best dog breeds for families with children",
        "Explain how to care for a new puppy",
        "Dog nutrition and feeding schedules guide"
      ]
    }
  ]

  const validatePrompt = (userInput, challenge) => {
    const input = userInput.toLowerCase().trim()
    
    if (challenge.id === 1) {
      // Apple challenge validation
      if (!input.includes('apple')) {
        return { valid: false, reason: "Must mention Apple" }
      }
      
      // Check for context that disambiguates from fruit
      const contextWords = [
        'company', 'inc', 'corporation', 'business', 'tech', 'technology', 
        'computer', 'manufacturer', 'iphone', 'mac', 'ipad', 'software',
        'hardware', 'electronics', 'enterprise', 'firm', 'organization'
      ]
      const hasContext = contextWords.some(word => input.includes(word))
      
      // Check for fruit-related confusion
      const fruitWords = ['fruit', 'food', 'tree', 'juice', 'red', 'green', 'eat', 'sweet', 'orchard']
      const hasFruitConfusion = fruitWords.some(word => input.includes(word))
      
      if (hasFruitConfusion) {
        return { valid: false, reason: "Still sounds like you mean the fruit" }
      }
      
      // If no clear context and it's short, it's probably still ambiguous
      if (!hasContext && input.length < 15) {
        return { valid: false, reason: "Needs more context to distinguish from fruit" }
      }
      
      // Special case: if it's long enough and doesn't contain fruit words, probably okay
      if (input.length >= 20 && !hasFruitConfusion) {
        return { valid: true, reason: "Clear and detailed!" }
      }
      
      if (hasContext) {
        return { valid: true, reason: "Clear disambiguation!" }
      }
      
      return { valid: false, reason: "Try being more specific about which Apple you mean" }
    }
    
    if (challenge.id === 2) {
      // Dogs challenge validation
      if (input.length < 12) {
        return { valid: false, reason: "Too short - be more specific" }
      }
      
      // Check for vague patterns that are just variations of "dogs" or "write about dogs"
      const vaguePhrases = /^(write\s+)?(about\s+)?dogs?(\s+please)?[.!?]*$/i
      if (vaguePhrases.test(input.trim())) {
        return { valid: false, reason: "Still too vague - what about dogs specifically?" }
      }
      
      // Check for other overly general patterns
      const generalPhrases = [
        /^tell\s+me\s+about\s+dogs?[.!?]*$/i,
        /^dogs?\s+information[.!?]*$/i,
        /^everything\s+about\s+dogs?[.!?]*$/i,
        /^dogs?\s+facts[.!?]*$/i
      ]
      
      if (generalPhrases.some(pattern => pattern.test(input.trim()))) {
        return { valid: false, reason: "Still too general - what specific aspect of dogs?" }
      }
      
      // Check for specificity indicators
      const specificTopics = [
        'training', 'care', 'breeds', 'nutrition', 'feeding', 'puppy', 'puppies',
        'exercise', 'grooming', 'health', 'behavior', 'adoption', 'rescue',
        'walking', 'playing', 'toys', 'commands', 'obedience', 'socialization',
        'vaccination', 'vet', 'medical', 'size', 'personality', 'temperament',
        'costs', 'expenses', 'choosing', 'selecting', 'first time', 'beginner'
      ]
      
      const formatWords = [
        'guide', 'tips', 'list', 'how to', 'steps', 'ways', 'methods',
        'explain', 'describe', 'compare', 'best', 'top', 'recommend',
        'tutorial', 'instructions', 'advice', 'help', 'overview', 'summary'
      ]
      
      const hasSpecificTopic = specificTopics.some(topic => input.includes(topic))
      const hasFormatRequest = formatWords.some(format => input.includes(format))
      
      // Also accept if they mention specific dog-related actions or scenarios
      const actionWords = [
        'teach', 'train', 'feed', 'walk', 'play', 'groom', 'brush',
        'bathe', 'house breaking', 'potty training', 'leash training'
      ]
      const hasActionWord = actionWords.some(action => input.includes(action))
      
      if (!hasSpecificTopic && !hasFormatRequest && !hasActionWord) {
        return { valid: false, reason: "Be more specific about what aspect of dogs you want" }
      }
      
      return { valid: true, reason: "Much clearer and more specific!" }
    }
    
    return { valid: false, reason: "Unknown challenge" }
  }

  const moveToNextChallenge = () => {
    setCurrentChallenge(prev => prev + 1)
    setUserInput('')
    setAttempts(0)
    setShowHint(false)
    setWaitingForNext(false)
    setCanSkipToNext(false)
    if (nextTimeout) {
      clearTimeout(nextTimeout)
      setNextTimeout(null)
    }
  }

  const skipToNextChallenge = () => {
    if (!canSkipToNext) return
    
    // Clear all AI messages immediately
    if (clearAllAIMessages) {
      clearAllAIMessages()
    }
    
    if (nextTimeout) {
      clearTimeout(nextTimeout)
      setNextTimeout(null)
    }
    
    if (currentChallenge < challenges.length - 1) {
      moveToNextChallenge()
    } else {
      setCompleted(true)
      setTimeout(() => onComplete(), 1000)
    }
  }

  const checkPrompt = () => {
    const validation = validatePrompt(userInput, challenges[currentChallenge])
    setAttempts(prev => prev + 1)

    if (validation.valid) {
      addAIMessage(`Perfect! ${validation.reason} That's a much clearer prompt that would get better results.`)
      
      if (currentChallenge < challenges.length - 1) {
        setWaitingForNext(true)
        setCanSkipToNext(true)
        
        // Wait 10 seconds for user to read the message, then move to next
        const timeoutId = setTimeout(() => {
          moveToNextChallenge()
        }, 10000)
        
        setNextTimeout(timeoutId)
      } else {
        setCompleted(true)
        setTimeout(() => onComplete(), 2000)
      }
    } else {
      addAIMessage(`${validation.reason} Try again!`)
      
      if (attempts >= 2) {
        setShowHint(true)
      }
    }
  }

  const challenge = challenges[currentChallenge]

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

  if (waitingForNext) {
    return (
      <div className="challenge-container">
        <div 
          className="waiting-screen clickable"
          onClick={skipToNextChallenge}
          title="Click to continue to next challenge"
        >
          <div className="loading-content">
            <div className="loading-spinner">✨</div>
            <p>Preparing next communication test...</p>
            <div className="skip-instruction">
              <small>💡 Click anywhere to continue</small>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="challenge-container">
      <div className="question-card">
        <h3>Scenario {currentChallenge + 1} of {challenges.length}</h3>
        
        <div style={{background: 'rgba(255, 68, 68, 0.1)', padding: '1rem', borderRadius: '8px', margin: '1rem 0'}}>
          <h4>⚠ What Went Wrong:</h4>
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
            <div style={{marginTop: '0.5rem', fontSize: '0.9rem', opacity: 0.8}}>
              <strong>Examples of good prompts:</strong>
              <ul style={{margin: '0.5rem 0', paddingLeft: '1.2rem'}}>
                {challenge.examples.map((example, i) => (
                  <li key={i} style={{marginBottom: '0.25rem'}}>{example}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <button 
          className="submit-button"
          onClick={checkPrompt}
          disabled={!userInput.trim()}
          style={{
            opacity: !userInput.trim() ? 0.5 : 1,
            cursor: !userInput.trim() ? 'not-allowed' : 'pointer'
          }}
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
        {currentChallenge === 0 && (
          <p style={{marginTop: '0.5rem', fontSize: '0.9rem'}}>
            <strong>Pro tip:</strong> When a word has multiple meanings (like "Apple"), always add context to clarify which one you mean!
          </p>
        )}
        {currentChallenge === 1 && (
          <p style={{marginTop: '0.5rem', fontSize: '0.9rem'}}>
            <strong>Pro tip:</strong> Instead of asking about a topic in general, specify what aspect you want to know about and in what format!
          </p>
        )}
      </div>
    </div>
  )
}

export default PromptingChallenge
import { useState } from 'react'

const PrivacyPuzzle = ({ onComplete, addAIMessage }) => {
  const [foundClues, setFoundClues] = useState([])
  const [selectedPrivate, setSelectedPrivate] = useState([])
  const [selectedPublic, setSelectedPublic] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [phase, setPhase] = useState('hunt') // 'hunt', 'sort', 'complete'

  const dataClues = [
    { id: 1, emoji: '📧', text: 'Email Address', shouldBePrivate: false, found: false },
    { id: 2, emoji: '🔐', text: 'Password', shouldBePrivate: true, found: false },
    { id: 3, emoji: '🏠', text: 'Home Address', shouldBePrivate: true, found: false },
    { id: 4, emoji: '🎂', text: 'Age', shouldBePrivate: false, found: false },
    { id: 5, emoji: '💳', text: 'Credit Card Number', shouldBePrivate: true, found: false },
    { id: 6, emoji: '👤', text: 'Name', shouldBePrivate: false, found: false },
    { id: 7, emoji: '🏥', text: 'Medical Records', shouldBePrivate: true, found: false },
    { id: 8, emoji: '📱', text: 'Phone Number', shouldBePrivate: true, found: false },
    { id: 9, emoji: '🎵', text: 'Music Preferences', shouldBePrivate: false, found: false },
    { id: 10, emoji: '💼', text: 'Job Title', shouldBePrivate: false, found: false }
  ]

  const clueLocations = [
    "Behind the digital display panel",
    "Under the conference table scanner",
    "Inside the AI processing unit",
    "Within the security lockbox",
    "Hidden in the data storage compartment",
    "Embedded in the wall interface",
    "Concealed in the smart device hub",
    "Tucked behind the holographic projector",
    "Inside the biometric reader",
    "Within the network access point"
  ]

  const findClue = (clueId) => {
    if (!foundClues.includes(clueId)) {
      setFoundClues(prev => [...prev, clueId])
      const clue = dataClues.find(c => c.id === clueId)
      addAIMessage(`Data point discovered: ${clue.emoji} ${clue.text}`)
      
      if (foundClues.length + 1 === dataClues.length) {
        setTimeout(() => {
          setPhase('sort')
          addAIMessage("All data points found! Now categorize them by privacy level.")
        }, 1000)
      }
    }
  }

  const togglePrivateSelection = (clueId) => {
    if (selectedPrivate.includes(clueId)) {
      setSelectedPrivate(prev => prev.filter(id => id !== clueId))
    } else {
      setSelectedPrivate(prev => [...prev, clueId])
      setSelectedPublic(prev => prev.filter(id => id !== clueId))
    }
  }

  const togglePublicSelection = (clueId) => {
    if (selectedPublic.includes(clueId)) {
      setSelectedPublic(prev => prev.filter(id => id !== clueId))
    } else {
      setSelectedPublic(prev => [...prev, clueId])
      setSelectedPrivate(prev => prev.filter(id => id !== clueId))
    }
  }

  const checkSorting = () => {
    const privateCorrect = selectedPrivate.every(id => 
      dataClues.find(c => c.id === id)?.shouldBePrivate
    )
    const publicCorrect = selectedPublic.every(id => 
      !dataClues.find(c => c.id === id)?.shouldBePrivate
    )
    const allSorted = selectedPrivate.length + selectedPublic.length === dataClues.length

    if (privateCorrect && publicCorrect && allSorted) {
      setShowResults(true)
      setPhase('complete')
      addAIMessage("Perfect! You understand data privacy principles.")
      setTimeout(() => onComplete(), 2000)
    } else {
      addAIMessage("Some data points are incorrectly categorized. Think about what information could be misused if exposed!")
    }
  }

  if (phase === 'hunt') {
    return (
      <div className="puzzle-container">
        <div className="question-card">
          <h3>🔍 Data Discovery Phase</h3>
          <p>Search the room for hidden data points. Click on different locations to find clues about what information the AI system has access to.</p>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', margin: '2rem 0'}}>
            {clueLocations.map((location, index) => {
              const clueId = index + 1
              const isFound = foundClues.includes(clueId)
              const clue = dataClues.find(c => c.id === clueId)
              
              return (
                <button
                  key={index}
                  className={`option-button ${isFound ? 'correct' : ''}`}
                  onClick={() => findClue(clueId)}
                  disabled={isFound}
                  style={{minHeight: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}
                >
                  {isFound ? (
                    <>
                      <div style={{fontSize: '2rem'}}>{clue.emoji}</div>
                      <div>{clue.text}</div>
                    </>
                  ) : (
                    <>
                      <div style={{fontSize: '1.5rem'}}>🔍</div>
                      <div>{location}</div>
                    </>
                  )}
                </button>
              )
            })}
          </div>

          <div style={{textAlign: 'center', marginTop: '1rem'}}>
            <p>Found: {foundClues.length}/{dataClues.length} data points</p>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'sort') {
    return (
      <div className="puzzle-container">
        <div className="question-card">
          <h3>🔐 Privacy Classification</h3>
          <p>Sort the discovered data points into "Should Stay Private" and "Can Be Public" categories:</p>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', margin: '2rem 0'}}>
            <div>
              <h4 style={{color: '#ff4444', marginBottom: '1rem'}}>🔒 Should Stay Private</h4>
              <div style={{minHeight: '200px', border: '2px dashed #ff4444', borderRadius: '8px', padding: '1rem'}}>
                {selectedPrivate.map(id => {
                  const clue = dataClues.find(c => c.id === id)
                  return (
                    <div key={id} style={{background: 'rgba(255, 68, 68, 0.2)', padding: '0.5rem', margin: '0.5rem 0', borderRadius: '4px', cursor: 'pointer'}} onClick={() => togglePrivateSelection(id)}>
                      {clue.emoji} {clue.text}
                    </div>
                  )
                })}
              </div>
            </div>

            <div>
              <h4 style={{color: '#00ff88', marginBottom: '1rem'}}>🌐 Can Be Public</h4>
              <div style={{minHeight: '200px', border: '2px dashed #00ff88', borderRadius: '8px', padding: '1rem'}}>
                {selectedPublic.map(id => {
                  const clue = dataClues.find(c => c.id === id)
                  return (
                    <div key={id} style={{background: 'rgba(0, 255, 136, 0.2)', padding: '0.5rem', margin: '0.5rem 0', borderRadius: '4px', cursor: 'pointer'}} onClick={() => togglePublicSelection(id)}>
                      {clue.emoji} {clue.text}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div>
            <h4>📋 Unsorted Data Points:</h4>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem', margin: '1rem 0'}}>
              {dataClues.filter(clue => 
                !selectedPrivate.includes(clue.id) && !selectedPublic.includes(clue.id)
              ).map(clue => (
                <div key={clue.id} style={{display: 'flex', gap: '0.5rem'}}>
                  <button 
                    className="option-button" 
                    onClick={() => togglePrivateSelection(clue.id)}
                    style={{padding: '0.5rem 1rem'}}
                  >
                    {clue.emoji} {clue.text} → Private
                  </button>
                  <button 
                    className="option-button" 
                    onClick={() => togglePublicSelection(clue.id)}
                    style={{padding: '0.5rem 1rem'}}
                  >
                    {clue.emoji} {clue.text} → Public
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button 
            className="submit-button"
            onClick={checkSorting}
            disabled={selectedPrivate.length + selectedPublic.length !== dataClues.length}
          >
            🔍 Verify Privacy Settings
          </button>
        </div>

        <div className="did-you-know">
          <h4>💡 Did You Know?</h4>
          <p>Personal data like passwords, medical records, and financial information should always be kept private. AI systems should only access the minimum data necessary for their function!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="puzzle-container">
      <div className="success-message">
        <h3>🎉 Data Security Protocols Restored!</h3>
        <p>You've successfully identified which data should remain private. Privacy protection is crucial in AI systems!</p>
      </div>
    </div>
  )
}

export default PrivacyPuzzle
import { useState, useEffect } from 'react'

const GameComplete = () => {
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    setShowCelebration(true)
  }, [])

  const keyLearnings = [
    {
      icon: "🧠",
      title: "AI Capabilities & Limitations",
      description: "AI excels at pattern recognition and data processing but lacks true understanding and consciousness."
    },
    {
      icon: "💬", 
      title: "Effective Communication",
      description: "Clear, specific prompts lead to better AI responses. Context and precision matter."
    },
    {
      icon: "🔐",
      title: "Privacy & Security",
      description: "Protecting sensitive data is crucial. AI should only access necessary information with proper safeguards."
    },
    {
      icon: "🤖",
      title: "Pattern vs. Understanding",
      description: "AI processes patterns mechanically without genuine comprehension or consciousness."
    },
    {
      icon: "⚖️",
      title: "Responsible AI Usage",
      description: "AI should augment human capabilities while maintaining human oversight in critical decisions."
    }
  ]

  return (
    <div className="intro-screen">
      <div className="intro-content" style={{maxWidth: '800px'}}>
        <div className={`celebration ${showCelebration ? 'animate' : ''}`}>
          <h1 style={{fontSize: '4rem', marginBottom: '1rem'}}>
            🎉 Mission Accomplished! 🎉
          </h1>
          
          <div className="story-box">
            <h2 style={{color: '#00d4ff', marginBottom: '1rem'}}>
              🤖 AI Systems Fully Restored!
            </h2>
            <p style={{fontSize: '1.3rem', marginBottom: '2rem'}}>
              Congratulations! You've successfully helped our AI assistant recover from its system glitches. 
              More importantly, you've gained valuable insights into how AI works and how to use it responsibly.
            </p>
          </div>

          <div style={{marginBottom: '3rem'}}>
            <h3 style={{color: '#00ff88', marginBottom: '2rem', fontSize: '1.8rem'}}>
              🎓 What You've Learned
            </h3>
            
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem'}}>
              {keyLearnings.map((learning, index) => (
                <div 
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(0, 212, 255, 0.3)',
                    borderRadius: '15px',
                    padding: '1.5rem',
                    textAlign: 'left',
                    animation: `slideUp 0.6s ease ${index * 0.2}s both`
                  }}
                >
                  <div style={{fontSize: '3rem', marginBottom: '1rem'}}>{learning.icon}</div>
                  <h4 style={{color: '#00d4ff', marginBottom: '0.5rem', fontSize: '1.2rem'}}>
                    {learning.title}
                  </h4>
                  <p style={{lineHeight: '1.5', fontSize: '1rem'}}>
                    {learning.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="story-box" style={{background: 'rgba(0, 255, 136, 0.1)', border: '1px solid #00ff88'}}>
            <h3 style={{color: '#00ff88', marginBottom: '1rem'}}>
              🚀 Ready for the Real World
            </h3>
            <p style={{marginBottom: '1rem'}}>
              You're now equipped with essential knowledge about AI! Remember these principles as AI becomes 
              increasingly integrated into our daily lives and work environments.
            </p>
            <p style={{fontStyle: 'italic', color: '#00d4ff'}}>
              "The best way to predict the future is to understand the present technology responsibly."
            </p>
          </div>

          <div style={{marginTop: '3rem'}}>
            <button 
              className="start-button"
              onClick={() => window.location.reload()}
              style={{
                background: 'linear-gradient(45deg, #00ff88, #00d4ff)',
                fontSize: '1.1rem',
                padding: '1rem 2.5rem'
              }}
            >
              🔄 Experience Again
            </button>
          </div>

          <div style={{marginTop: '2rem', fontSize: '0.9rem', color: '#ccc'}}>
            <p>Thank you for participating in this AI education experience!</p>
            <p>Share your knowledge and help others understand AI responsibly.</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .celebration.animate {
          animation: fadeIn 1s ease-in;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export default GameComplete
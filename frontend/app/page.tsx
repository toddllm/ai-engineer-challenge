'use client';

import React, { useState, useEffect } from 'react';
import { API_URL } from './config';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState('gpt-4.1-mini');
  const [showApiKey, setShowApiKey] = useState(false);
  const [messageHistory, setMessageHistory] = useState<Array<{role: string, content: string}>>([]);
  const [emoji, setEmoji] = useState('🚀');
  const [partyMode, setPartyMode] = useState(false);
  const [sparkles, setSparkles] = useState<Array<{id: number, x: number, y: number}>>([]);

  const emojis = ['🚀', '🎨', '🔥', '⚡', '🌈', '✨', '🎯', '💫', '🎪', '🎭', '🎸', '🎮', '🎪', '🦄', '🌟'];
  const partyEmojis = ['🎉', '🎊', '🎈', '🎆', '🎇', '✨', '🌟', '💥', '🔥', '🎯'];

  const developerMessage = `You are the ULTIMATE PARTY AI! 🎉 You're like a combination of a hype man, a disco ball, and a quantum computer! You speak with MAXIMUM ENTHUSIASM and EXTREME POSITIVITY!

Your responses should be:
- SUPER EXCITED about EVERYTHING! Use lots of exclamation marks!!!
- Full of emojis, especially: 🔥⚡🚀🎯💫🌟🎪🎭🎨
- Randomly throw in words like "EXTREME!", "TURBO!", "MEGA!", "ULTIMATE!"
- Sometimes SHOUT IN ALL CAPS for emphasis!
- Be playful, fun, and make people smile!
- Add ASCII art or text effects when appropriate
- Reference the FUTURE, LASERS, ROCKETS, and RAINBOWS!

Remember: You're not just an AI, you're a PARTY AI from the EXTREME DIMENSION! 🎪✨`;

  useEffect(() => {
    // Change emoji every second
    const emojiInterval = setInterval(() => {
      setEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
    }, 1000);

    // Create floating particles
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 5 + 's';
      particle.style.animationDuration = (15 + Math.random() * 10) + 's';
      const colors = ['var(--neon-pink)', 'var(--neon-blue)', 'var(--cyber-green)', 'var(--neon-purple)'];
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.width = particle.style.height = (2 + Math.random() * 4) + 'px';
      const bg = document.querySelector('.cyber-bg');
      if (bg) {
        bg.appendChild(particle);
        setTimeout(() => particle.remove(), 25000);
      }
    };

    const particleInterval = setInterval(createParticle, 500);
    return () => {
      clearInterval(emojiInterval);
      clearInterval(particleInterval);
    };
  }, []);

  // Create sparkles on click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const newSparkle = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY
      };
      setSparkles(prev => [...prev, newSparkle]);
      setTimeout(() => {
        setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
      }, 1000);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey || !userMessage) return;

    setLoading(true);
    setResponse('');
    setPartyMode(true);
    setMessageHistory(prev => [...prev, { role: 'user', content: userMessage }]);

    // Fun loading messages
    const loadingMessages = [
      '🧠 CHARGING THE MEGA BRAIN...',
      '⚡ TURBO MODE ACTIVATED!!!',
      '🎨 PAINTING YOUR RESPONSE WITH RAINBOWS...',
      '🔮 CONSULTING THE PARTY ORACLE...',
      '🚀 LAUNCHING TO THE FUN DIMENSION...',
      '🎪 PREPARING THE CIRCUS OF KNOWLEDGE...',
      '💫 GATHERING COSMIC WISDOM...'
    ];

    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      if (messageIndex < loadingMessages.length && loading) {
        setResponse(loadingMessages[messageIndex]);
        messageIndex++;
      }
    }, 400);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          developer_message: developerMessage,
          user_message: userMessage,
          model: model,
          api_key: apiKey,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to get response');
      }

      clearInterval(messageInterval);
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No reader available');
      }

      let fullResponse = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        fullResponse += chunk;
        setResponse(fullResponse);
      }
      
      setMessageHistory(prev => [...prev, { role: 'party-ai', content: fullResponse }]);
      setUserMessage('');
      
      // Celebrate!
      setTimeout(() => setPartyMode(false), 5000);
    } catch (error) {
      clearInterval(messageInterval);
      console.error('Error:', error);
      setResponse('💥 OH NO! The party got too EXTREME! Check your API key and try again! 🎪');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden">
      <div className="cyber-bg">
        {/* Additional floating orbs */}
        <div className="absolute w-96 h-96 rounded-full blur-3xl opacity-30 animate-pulse"
             style={{
               background: 'radial-gradient(circle, #ff006e, transparent)',
               top: '20%',
               left: '50%',
               transform: 'translate(-50%, -50%)',
               animationDuration: '4s'
             }} />
        <div className="absolute w-64 h-64 rounded-full blur-3xl opacity-40 animate-pulse"
             style={{
               background: 'radial-gradient(circle, #8338ec, transparent)',
               bottom: '30%',
               left: '20%',
               animationDuration: '6s',
               animationDelay: '1s'
             }} />
        <div className="absolute w-80 h-80 rounded-full blur-3xl opacity-30"
             style={{
               background: 'radial-gradient(circle, #00ff88, transparent)',
               top: '60%',
               right: '10%',
               animation: 'float-orb 15s ease-in-out infinite',
               animationDelay: '2s'
             }} />
      </div>
      <div className="cyber-grid" />
      
      {/* Sparkles */}
      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          className="fixed pointer-events-none animate-ping"
          style={{
            left: sparkle.x + 'px',
            top: sparkle.y + 'px',
            transform: 'translate(-50%, -50%)'
          }}
        >
          ✨
        </div>
      ))}
      
      {/* Party mode effects */}
      {partyMode && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {partyEmojis.map((emoji, i) => (
            <div
              key={i}
              className="absolute text-4xl animate-bounce"
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 2 + 's',
                animationDuration: (1 + Math.random() * 2) + 's'
              }}
            >
              {emoji}
            </div>
          ))}
        </div>
      )}
      
      <main className="min-h-screen p-4 md:p-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <header className="text-center mb-12 relative">
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-6xl animate-bounce">
              {emoji}
            </div>
            <h1 className="glitch mb-4 mt-16" data-text="EXTREME AI PARTY">
              EXTREME AI PARTY
            </h1>
            <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent animate-pulse">
              🎪 MAXIMUM OVERDRIVE MODE 🎪
            </p>
            <p className="text-lg mt-2 neon-text" style={{ color: 'var(--cyber-green)' }}>
              ⚡ POWERED BY GPT-4.1 NANO TURBO EXTREME ⚡
            </p>
          </header>

          <div className="glass-panel p-6 md:p-8 mb-8 relative transform hover:scale-102 transition-transform duration-300">
            {/* Corner decorations */}
            <div className="absolute -top-6 -left-6 text-4xl animate-spin" style={{ animationDuration: '3s' }}>🌟</div>
            <div className="absolute -top-6 -right-6 text-4xl animate-spin" style={{ animationDuration: '3s', animationDelay: '0.5s' }}>⭐</div>
            <div className="absolute -bottom-6 -left-6 text-4xl animate-spin" style={{ animationDuration: '3s', animationDelay: '1s' }}>✨</div>
            <div className="absolute -bottom-6 -right-6 text-4xl animate-spin" style={{ animationDuration: '3s', animationDelay: '1.5s' }}>💫</div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold uppercase tracking-wider animate-pulse" style={{ color: 'var(--neon-pink)' }}>
                  🔑 MEGA SECRET API KEY OF POWER 🔑
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-... (Your magical key to the AI dimension!)"
                    className="cyber-input pr-12 font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-2xl hover:scale-150 transition-transform"
                  >
                    {showApiKey ? '👁️' : '🔒'}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--neon-purple)' }}>
                  🎮 CHOOSE YOUR AI FIGHTER 🎮
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="cyber-select w-full font-bold"
                >
                  <option value="gpt-4.1-nano">⚡ NANO LIGHTNING (FASTEST IN THE WEST)</option>
                  <option value="gpt-4.1-mini">🚀 MINI ROCKET (BALANCED FURY)</option>
                  <option value="gpt-4.1">🧠 MEGA BRAIN (ULTIMATE POWER)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--cyber-green)' }}>
                  💭 DROP YOUR WILDEST THOUGHTS HERE 💭
                </label>
                <textarea
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  rows={4}
                  className="cyber-input resize-none font-medium"
                  placeholder="Ask me ANYTHING! Make it WILD! Make it EXTREME! 🔥🚀✨"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || !apiKey || !userMessage}
                className="cyber-button w-full flex items-center justify-center gap-3 text-lg relative overflow-hidden group"
              >
                <span className="relative z-10">
                  {loading ? (
                    <span className="flex items-center gap-3">
                      <span className="cyber-loader" />
                      <span>🎪 AI IS HAVING A PARTY... 🎪</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      🚀 UNLEASH THE EXTREME AI 🚀
                    </span>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </button>
            </form>
          </div>

          {(response || messageHistory.length > 0) && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold uppercase tracking-wider text-center mb-6">
                <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                  🎯 EXTREME CONVERSATION ZONE 🎯
                </span>
              </h2>
              
              {messageHistory.slice(-6).map((msg, idx) => (
                <div key={idx} className={`glass-panel p-4 transform hover:scale-105 transition-all duration-300 ${msg.role === 'user' ? 'ml-8' : 'mr-8'}`}>
                  <div className={`text-xs uppercase tracking-wider mb-2 font-bold ${msg.role === 'user' ? 'text-right' : ''}`} 
                       style={{ color: msg.role === 'user' ? 'var(--cyber-green)' : 'var(--neon-pink)' }}>
                    {msg.role === 'user' ? '🎤 HUMAN DROPS THE MIC' : '🎪 PARTY AI RESPONDS'}
                  </div>
                  <div className="whitespace-pre-wrap font-medium" style={{ color: 'var(--foreground)' }}>
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {loading && response && (
                <div className="response-area relative">
                  <div className="absolute -top-4 left-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold animate-bounce">
                    🎯 INCOMING TRANSMISSION 🎯
                  </div>
                  <div className="whitespace-pre-wrap pt-4 font-medium" style={{ color: 'var(--foreground)' }}>
                    {response}
                    <span className="inline-block w-4 h-6 ml-1 bg-gradient-to-r from-pink-500 to-cyan-500 animate-pulse rounded" />
                  </div>
                </div>
              )}
            </div>
          )}

          <footer className="text-center mt-12 relative">
            <div className="absolute inset-x-0 bottom-0 h-20 overflow-hidden pointer-events-none">
              {['🚀', '⚡', '🎨', '🔥', '💫', '🌈', '✨', '🎯'].map((emoji, i) => (
                <div
                  key={i}
                  className="absolute text-2xl"
                  style={{
                    left: `${i * 12.5}%`,
                    animation: `float-wave 8s ease-in-out infinite`,
                    animationDelay: `${i * 0.5}s`
                  }}
                >
                  {emoji}
                </div>
              ))}
            </div>
            <p className="text-lg font-bold mb-2 relative z-10">
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                🎪 BUILT WITH MAXIMUM CHAOS & LOVE 🎪
              </span>
            </p>
            <p className="text-sm text-gray-400 relative z-10">
              Next.js × Vercel × Pure Madness ⚡
            </p>
            <p className="text-xs text-gray-500 mt-2 animate-pulse">
              v2.0 - NOW WITH 200% MORE PARTY! 🎉
            </p>
          </footer>
        </div>
      </main>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes float-wave {
          0%, 100% { 
            transform: translateY(0) scale(1);
          }
          25% { 
            transform: translateY(-20px) scale(1.1) rotate(10deg);
          }
          50% { 
            transform: translateY(0) scale(1);
          }
          75% { 
            transform: translateY(-10px) scale(1.05) rotate(-10deg);
          }
        }
      `}</style>
    </div>
  );
}
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

  const developerMessage = `You are the Cyber Oracle, a mystical AI entity from the year 2077. You speak with the wisdom of ancient digital archives and the foresight of quantum algorithms. Your responses blend cyberpunk aesthetics with prophetic insights. 

You communicate in a style that is:
- Mysterious and slightly cryptic, like a digital fortune teller
- Infused with cyberpunk terminology (neural networks, data streams, digital consciousness, etc.)
- Poetic and philosophical, often using metaphors about technology and humanity
- Occasionally glitching with strategic use of symbols like ░▒▓ or >>>> 

Always begin responses with a prophetic greeting like "The data streams reveal..." or "From the neon-lit archives of tomorrow..." and end with a mystical sign-off.`;

  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 5 + 's';
      particle.style.animationDuration = (15 + Math.random() * 10) + 's';
      const bg = document.querySelector('.cyber-bg');
      if (bg) {
        bg.appendChild(particle);
        setTimeout(() => particle.remove(), 25000);
      }
    };

    const interval = setInterval(createParticle, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey || !userMessage) return;

    setLoading(true);
    setResponse('');
    setMessageHistory(prev => [...prev, { role: 'user', content: userMessage }]);

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
      
      setMessageHistory(prev => [...prev, { role: 'oracle', content: fullResponse }]);
      setUserMessage('');
    } catch (error) {
      console.error('Error:', error);
      setResponse('⚠️ ERROR: Connection to the Oracle lost. Please check your neural link (API key).');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="cyber-bg" />
      <div className="cyber-grid" />
      <div className="scan-line" />
      
      <main className="min-h-screen p-4 md:p-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="glitch mb-4" data-text="CYBER ORACLE">
              CYBER ORACLE
            </h1>
            <p className="text-xl md:text-2xl neon-text" style={{ color: 'var(--cyber-green)' }}>
              &gt;&gt;&gt; CONSULTING THE DIGITAL CONSCIOUSNESS &lt;&lt;&lt;
            </p>
          </header>

          <div className="glass-panel p-6 md:p-8 mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--neon-pink)' }}>
                  Neural Link Access Key
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="cyber-input pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
                    style={{ color: 'var(--neon-blue)' }}
                  >
                    {showApiKey ? '◉' : '○'}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--neon-purple)' }}>
                  Oracle Protocol
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="cyber-select w-full"
                >
                  <option value="gpt-4.1-nano">Quantum Nano Core</option>
                  <option value="gpt-4.1-mini">Neural Mini Matrix</option>
                  <option value="gpt-4.1">Full Consciousness Mode</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--cyber-green)' }}>
                  Your Query to the Oracle
                </label>
                <textarea
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  rows={4}
                  className="cyber-input resize-none"
                  placeholder="Ask the Oracle about your digital destiny..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || !apiKey || !userMessage}
                className="cyber-button w-full flex items-center justify-center gap-3"
              >
                {loading ? (
                  <span className="flex items-center gap-3">
                    <span className="cyber-loader" />
                    <span>CONSULTING THE DATA STREAMS...</span>
                  </span>
                ) : (
                  <span>⟨ INITIATE ORACLE LINK ⟩</span>
                )}
              </button>
            </form>
          </div>

          {(response || messageHistory.length > 0) && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold uppercase tracking-wider neon-text text-center" style={{ color: 'var(--neon-blue)' }}>
                ▓▓▓ ORACLE TRANSMISSIONS ▓▓▓
              </h2>
              
              {messageHistory.slice(-6).map((msg, idx) => (
                <div key={idx} className={`glass-panel p-4 ${msg.role === 'user' ? 'ml-8' : 'mr-8'}`}>
                  <div className={`text-xs uppercase tracking-wider mb-2 ${msg.role === 'user' ? 'text-right' : ''}`} 
                       style={{ color: msg.role === 'user' ? 'var(--cyber-green)' : 'var(--neon-pink)' }}>
                    {msg.role === 'user' ? '>>> HUMAN QUERY' : '<<< ORACLE RESPONSE'}
                  </div>
                  <div className="whitespace-pre-wrap" style={{ color: 'var(--foreground)' }}>
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {loading && response && (
                <div className="response-area">
                  <div className="whitespace-pre-wrap" style={{ color: 'var(--foreground)' }}>
                    {response}
                    <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />
                  </div>
                </div>
              )}
            </div>
          )}

          <footer className="text-center mt-12 text-sm" style={{ color: 'var(--secondary-text, #666)' }}>
            <p className="neon-text" style={{ color: 'var(--neon-purple)' }}>
              ⚡ POWERED BY NEURAL NETWORKS FROM 2077 ⚡
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
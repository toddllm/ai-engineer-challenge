#!/bin/bash

# Vercel Deployment Script for AI Engineer Challenge

echo "🚀 Starting Vercel deployment process..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Navigate to frontend directory
cd frontend

# Create .env.production file for production API URL
cat > .env.production << EOL
NEXT_PUBLIC_API_URL=https://the-ai-engineer-challenge.vercel.app
EOL

# Update the frontend code to use environment variable for API URL
cat > app/config.ts << 'EOL'
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
EOL

# Update page.tsx to use the config
cat > app/page.tsx << 'EOL'
'use client';

import { useState } from 'react';
import { API_URL } from './config';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [developerMessage, setDeveloperMessage] = useState('You are a helpful AI assistant.');
  const [userMessage, setUserMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState('gpt-4.1-mini');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey || !userMessage) return;

    setLoading(true);
    setResponse('');

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

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        setResponse((prev) => prev + chunk);
      }
    } catch (error) {
      console.error('Error:', error);
      setResponse('Error: Failed to get response from the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        AI Chat Assistant
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium mb-2">
            OpenAI API Key
          </label>
          <input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label htmlFor="model" className="block text-sm font-medium mb-2">
            Model
          </label>
          <select
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="gpt-4.1-mini">GPT-4.1 Mini</option>
            <option value="gpt-4.1-nano">GPT-4.1 Nano</option>
            <option value="gpt-4.1">GPT-4.1</option>
          </select>
        </div>

        <div>
          <label htmlFor="developerMessage" className="block text-sm font-medium mb-2">
            System/Developer Message
          </label>
          <textarea
            id="developerMessage"
            value={developerMessage}
            onChange={(e) => setDeveloperMessage(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Set the behavior of the AI assistant..."
          />
        </div>

        <div>
          <label htmlFor="userMessage" className="block text-sm font-medium mb-2">
            Your Message
          </label>
          <textarea
            id="userMessage"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Ask anything..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || !apiKey || !userMessage}
          className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
        >
          {loading ? 'Generating...' : 'Send Message'}
        </button>
      </form>

      {response && (
        <div className="mt-8 p-6 rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold mb-3">Response:</h2>
          <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">
            {response}
          </div>
        </div>
      )}
    </main>
  );
}
EOL

echo "📝 Configuration files created"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
echo ""
echo "When prompted:"
echo "1. Set up and deploy: Yes"
echo "2. Which scope: Select your account"
echo "3. Link to existing project?: No (create new)"
echo "4. Project name: Press Enter for default or choose custom name"
echo "5. Directory: ./ (current directory)"
echo "6. Build settings: Press Enter to accept defaults"
echo ""

# Run vercel deployment
vercel --prod

echo ""
echo "✅ Deployment script completed!"
echo ""
echo "🔧 Post-deployment steps:"
echo "1. Copy your deployment URL"
echo "2. Update the API backend URL in vercel.json if needed"
echo "3. Set any environment variables in Vercel dashboard if required"
echo ""
echo "📌 Your app should now be live on Vercel!"
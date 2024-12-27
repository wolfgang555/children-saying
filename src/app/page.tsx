'use client';

import { useState, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const speak = async (text: string) => {
    try {
      const response = await fetch('/api/v1/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        await audioRef.current.play();
        
        // 清理 URL 对象
        audioRef.current.onended = () => {
          URL.revokeObjectURL(audioUrl);
        };
      }
    } catch (error) {
      console.error('Failed to generate speech:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY!);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const result = await model.generateContent(input);
      const response = await result.response;
      const text = response.text();

      const assistantMessage = { role: 'assistant' as const, content: text };
      setMessages(prev => [...prev, assistantMessage]);

      // 播放语音
      await speak(text);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-2xl space-y-4">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
          小朋友的AI小伙伴 🌟
        </h1>

        <div className="text-center text-gray-600 mb-4">
          和我聊天吧！我可以陪你玩游戏、讲故事、回答问题 🎈
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-4 h-[500px] overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.role === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="text-center text-gray-500">
              思考中...
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="在这里输入你想说的话..."
            className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            发送 ✨
          </button>
        </form>
      </div>
      
      {/* 隐藏的音频播放器 */}
      <audio ref={audioRef} className="hidden" />
    </main>
  );
}

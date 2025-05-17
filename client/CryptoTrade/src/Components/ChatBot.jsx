
import React, { useState } from 'react';
import { Send } from 'lucide-react';

export default function ChatBot({ onClose, onSuccess }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! How can I assist you with your trades today?' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    try {
        console.log(input)
      const res = await fetch('https://papertrade6.onrender.com/api/v1/agent/query', {
        method: 'POST',
        
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, 
        },
        body: JSON.stringify({ userQuery: input })
      });

      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.statusCode }]);
      console.log(data.statusCode.includes('Congratulations') || data.statusCode.includes('Success'))
      if(data.statusCode.includes('Congratulations') || data.statusCode.includes('Success') || data.statusCode.includes('Successfully')){
      onSuccess?.();
      }
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: 'Error: Unable to respond right now.' }]);
    }
  };

  return (
    <div className="fixed bottom-20 right-6 w-80 h-96 bg-gray-900 text-white rounded-lg shadow-xl flex flex-col overflow-hidden z-50">
      <div className="bg-blue-700 px-4 py-2 flex justify-between items-center">
        <h4 className="font-semibold">AI Trading Assistant</h4>
        <button onClick={onClose} className="text-white text-lg">&times;</button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2 text-sm">
        {messages.map((msg, i) => (
          <div key={i} className={`p-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-600 self-end text-right ml-10' : 'bg-gray-700 self-start mr-10'}`}>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="flex items-center p-2 border-t border-gray-700">
        <input
          type="text"
          className="flex-1 px-3 py-1 bg-gray-800 border border-gray-600 rounded text-sm focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask me anything..."
        />
        <button onClick={sendMessage} className="ml-2 p-2 hover:bg-blue-600 rounded">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

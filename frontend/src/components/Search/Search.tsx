import React, { useState } from 'react';
import { Search as SearchIcon, Image as ImageIcon, Link as LinkIcon, Send } from 'lucide-react';

const Search = () => {
  const [query, setQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Percepta
          </h1>
          <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
            <div className="w-6 h-6 rounded-full border-2 border-gray-400"></div>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4">
        <div className="space-y-6">
          {/* Query Container */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="space-y-4">
              {/* Reference Links */}
              <div className="flex gap-4 flex-wrap">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                  <LinkIcon size={16} />
                  <span>Reference link 1</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                  <LinkIcon size={16} />
                  <span>Reference link 2</span>
                </button>
              </div>

              {/* Response Area */}
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex gap-4">
                  <div className="flex-grow space-y-4">
                    <p className="text-gray-300">FULL RESPONSE</p>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="w-24 h-24 bg-gray-600 rounded-lg flex items-center justify-center">
                      <ImageIcon className="text-gray-400" />
                    </div>
                    <div className="w-24 h-24 bg-gray-600 rounded-lg flex items-center justify-center">
                      <ImageIcon className="text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="bg-gray-800 rounded-lg p-4 flex gap-4 items-center">
            <SearchIcon className="text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything..."
              className="flex-grow bg-transparent focus:outline-none text-gray-100 placeholder-gray-400"
            />
            <button className="p-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors">
              <Send size={20} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Search;
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
// Import our clean character configurations from our new file
import { comicCharacters } from './data/characters';

type Character = {
  name: string;
  role: string;
  power: string;
  description: string;
  color: string;
  bg: string;
};

export default function CharactersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering dynamically using our imported data array
  const filteredCharacters = (comicCharacters as Character[]).filter((char: Character) =>
    char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    char.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    char.power.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12 selection:bg-red-600">
      <div className="max-w-4xl mx-auto">
        
        <Link href="/" className="text-sm text-red-400 hover:text-red-300 transition-colors mb-6 inline-flex items-center gap-1 group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Home
        </Link>
        
        <header className="mb-10 space-y-2">
          <h1 className="text-4xl font-black uppercase tracking-tight text-white">
            Character Roster
          </h1>
          <p className="text-sm text-slate-400">
            Search and query files within the comic database infrastructure.
          </p>
        </header>

        {/* Search Bar Input */}
        <div className="mb-8 relative max-w-md">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search name, role, or abilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg py-3 pl-11 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all shadow-inner"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 px-2 py-1 rounded"
            >
              Clear
            </button>
          )}
        </div>

        {/* Display Profiles */}
        {filteredCharacters.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredCharacters.map((char, index) => (
              <div 
                key={index} 
                className={`p-6 bg-slate-900/40 rounded-xl border border-slate-800/80 border-l-4 ${char.color} ${char.bg} transition-all duration-300 transform hover:-translate-y-1 shadow-lg flex flex-col justify-between`}
              >
                <div>
                  <h2 className="text-xl font-bold text-white tracking-wide">{char.name}</h2>
                  <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 block mt-1 mb-3">
                    {char.role}
                  </span>
                  <p className="text-xs text-slate-400 line-clamp-3 mb-4 italic">
                    "{char.description}"
                  </p>
                </div>
                
                <div className="text-sm text-slate-400 pt-3 border-t border-slate-800/60 space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">Signature Ability</span>
                  <p className="text-slate-300 text-xs font-medium">{char.power}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl bg-slate-900/10">
            <p className="text-slate-500 text-sm">No profiles found matching "{searchQuery}"</p>
          </div>
        )}

      </div>
    </div>
  );
}
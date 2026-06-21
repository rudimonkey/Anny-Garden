"use client";
import React from 'react';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSearch?: () => void;
}

export const SearchBar = ({ value, onChangeText, placeholder = "Buscar plantas...", onSearch }: SearchBarProps) => {
  return (
    <div className="flex gap-2 w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => onChangeText(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-md focus:border-leafGreen9 focus:outline-none"
      />
      <button
        onClick={onSearch}
        className="px-4 py-2 bg-leafGreen9 text-white rounded-md hover:bg-leafGreen11 transition-colors"
      >
        Buscar
      </button>
    </div>
  );
};

"use client";
import React, { FC, useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';

interface DropDownOption {
  id: string;
  label: string;
  value: { [key: string]: any };
}

interface IbisDropdownProps {
  className?: string;
  options: DropDownOption[];
  onChange?: (id: string) => void;
  disabled?: boolean;
  initialValue?: string | null;
}

export const IbisDropdown: FC<IbisDropdownProps> = ({
  className = "",
  options,
  onChange,
  disabled,
  initialValue = null, // Default value for initialValue prop
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(
    initialValue
  );
  const initOption = options.find(o => o.id === initialValue);
  const [selectedOption, setSelectedOption] = useState<DropDownOption | null>(initialValue === null ? null : (initOption ? initOption : null));
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (clickOption: DropDownOption) => {
    const selected = clickOption.id; // pass the option id as the parameter ...
    setSelectedValue(selected);
    setSelectedOption(clickOption);
    onChange?.(selected);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
      >
        {selectedOption ? selectedOption.label : 'Select an option'}
      </button>
      {isOpen && (
        <div className="mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 overflow-auto h-40">
          {options.map(option => (
            <div
              key={option.id}
              className="px-4 py-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleOptionClick(option)}
            >
              <strong>{option.label}</strong>
              {Object.entries(option.value)
                .filter(([key]) => !key.toLowerCase().includes('id') && key !== 'name' && key !== '__typename')
                .map(([key, value]) => (
                  <p key={uuidv4() + key} className="text-sm text-gray-700 pl-4">
                    {`${key.toUpperCase()}:  ${value}`}
                  </p>
                ))}
            </div>
          ))}
        </div>
      )}
      {selectedOption && (
        <div className="p-1 bg-gray-100 border border-gray-300 rounded-md">
          {Object.entries(selectedOption.value)
            .filter(([key]) => !key.toLowerCase().includes('id') && key !== 'name' && key !== '__typename')
            .map(([key, value]) => (
              <p key={key} className="text-sm text-gray-700">
                {`${key.toUpperCase()}: ${value}`}
              </p>
            ))}
        </div>
      )}
    </div>
  );
};

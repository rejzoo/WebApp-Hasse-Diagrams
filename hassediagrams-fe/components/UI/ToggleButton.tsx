"use client";

import React from "react";

interface ToggleButtonProps {
  value: string;
  setValue: (newValue: string) => void;
  option1: string;
  option2: string;
  className?: string;
  activeClass?: string;
  inactiveClass?: string;
}

export default function ToggleButton({
  value,
  setValue,
  option1,
  option2,
  className = "",
  activeClass = "bg-red-500 text-white",
  inactiveClass = "bg-green-500 text-white",
}: ToggleButtonProps) {
  const handleToggle = () => {
    setValue(value === option1 ? option2 : option1);
  };

  return (
    <button
      onClick={handleToggle}
      className={`px-4 py-2 rounded-md transition-colors ${
        value === option1 ? activeClass : inactiveClass
      } ${className}`}
      disabled={true}
    >
      {value === option1 ? option1 : option2}
    </button>
  );
}

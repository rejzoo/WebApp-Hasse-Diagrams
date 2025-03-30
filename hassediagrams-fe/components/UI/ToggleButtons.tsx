import React, { useState } from "react";

interface ToggleButtons {
  onToggle?: (state: boolean) => void;
  firstState: string;
  secondsState: string;
}

export default function ToggleButtons({ onToggle, firstState, secondsState }: ToggleButtons) {
  const [editing, setEditing] = useState<boolean>(false);

  const handleToggle = (state: boolean) => {
    setEditing(state);
    if (onToggle) {
      onToggle(state);
    }
  };

  return (
    <div>
      <div>
        <span>Mode:</span>
      </div>
      <div className="flex w-48 rounded-md overflow-hidden text-white">
        <button
          onClick={() => handleToggle(false)}
          className={`flex-1 py-2 text-center transition-colors 
                focus:outline-none focus:ring-0 focus:shadow-none appearance-none
                ${
                  editing === false
                    ? "bg-red-500"
                    : "bg-[var(--itemsbackground)]"
                }`}
        >
          {firstState}
        </button>
        <button
          onClick={() => handleToggle(true)}
          className={`flex-1 py-2 text-center transition-colors 
                focus:outline-none focus:ring-0 focus:shadow-none appearance-none
                ${
                  editing === true
                    ? "bg-red-500"
                    : "bg-[var(--itemsbackground)]"
                }`}
        >
          {secondsState}
        </button>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { CiEdit } from "react-icons/ci";

export type ControlType = "text" | "dropdown";

interface EditableFieldProps {
  value: string;
  onChange?: (newValue: string) => void;
  controlType?: ControlType;
  options?: string[];
}

export default function EditableField({
  value,
  onChange,
  controlType = "text",
  options = [],
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const toggleEditing = () => {
    if (isEditing && onChange) {
      onChange(internalValue);
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="flex items-center space-x-2">
      {isEditing ? (
        controlType === "dropdown" ? (
          <select
            value={internalValue}
            onChange={(e) => setInternalValue(e.target.value)}
            className="w-15 px-2 py-1 rounded-md focus:outline-none bg-[var(--itemsbackground)] text-[var(--foreground)] text-lg"
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={internalValue}
            onChange={(e) => setInternalValue(e.target.value)}
            className="rounded-md h-8 px-2 max-w-56 text-white bg-[var(--itemsbackground)] focus:outline-none focus:ring-1"
          />
        )
      ) : (
        <p>{internalValue}</p>
      )}
      <button onClick={toggleEditing} className="text-blue-500 text-xl">
        {isEditing ? (
          "Save"
        ) : (
          <span className="text-[25px]">
            <CiEdit />
          </span>
        )}
      </button>
    </div>
  );
}

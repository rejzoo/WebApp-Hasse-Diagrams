"use client";

import { isValidName } from "@/utils/tableUtils";
import React, { useState, useEffect, useRef } from "react";
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
  const [internalValue, setInternalValue] = useState<string>(value);
  const [hasError, setHasError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const toggleEditing = () => {
    if (isEditing) {
      if (controlType === "text" && !isValidName(internalValue)) {
        setHasError(true);
        inputRef.current?.focus();
        return;
      }

      if (onChange) {
        setHasError(false);
        onChange(internalValue);
      }
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
            ref={inputRef}
            type="text"
            value={internalValue}
            onChange={(e) => setInternalValue(e.target.value)}
            className={`rounded-md h-8 px-2 max-w-56 text-white bg-[var(--itemsbackground)] focus:outline-none focus:ring-1 ${
              hasError ? "border-2 border-red-500" : ""
            }`}
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

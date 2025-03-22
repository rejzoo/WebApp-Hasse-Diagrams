"use client";

import InputTable from "@/components/InputTable/InputTable";
import { useState } from "react";

export default function CreatePage() {
  const [numberOfElements, setNumberOfElements] = useState<number>(2);
  const [manualElementsInput, setManualElementsInput] =
    useState<boolean>(false);

  return (
    <div>
      <div className="flex flex-col px-4 pb-4">
        <div className="space-x-4 items-center">
          <span className="text-xl">Manual elements input</span>
          <input
            type="checkbox"
            checked={manualElementsInput}
            onChange={(e) => setManualElementsInput(e.target.checked)}
            style={{ transform: "scale(1.5)" }}
          />
        </div>

        <div className="mt-4 space-x-4 items-center">
          <span className="text-xl">Number of elements</span>
          <select
            value={numberOfElements}
            onChange={(e) => setNumberOfElements(Number(e.target.value))}
            className="w-15 px-2 py-1 rounded-md focus:outline-none bg-[var(--itemsbackground)] text-[var(--foreground)] text-lg"
          >
            {Array.from({ length: 9 }, (_, i) => (
              <option key={i} value={i + 2}>
                {i + 2}
              </option>
            ))}
          </select>
        </div>
      </div>

      <InputTable
        numberOfElements={numberOfElements}
        manualInput={manualElementsInput}
      />
    </div>
  );
}

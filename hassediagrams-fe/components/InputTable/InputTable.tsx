"use client";

import React, { useEffect, useRef, useState } from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import {
  calculateRows,
  calculateCombinations,
  isValidName,
  allSystemInputFilled,
} from "@/utils/tableUtils";
import { RowData } from "@/types/table";
import ToggleButton from "../UI/ToggleButton";
import ToggleButtonBoolean from "../UI/ToggleButton";

interface TableProps {
  numberOfElements: number;
  manualInput: boolean;
}

export default function InputTable({
  numberOfElements,
  manualInput,
}: TableProps) {
  const [responseMsg, setResponseMsg] = useState("");
  const [responseErr, setResponseErr] = useState(false);
  const [combinations, setCombinations] = useState<number[][]>([]);
  const [rows, setRows] = useState<RowData[]>(calculateRows(numberOfElements));
  const headers = Array.from(
    { length: numberOfElements },
    (_, i) => `X${i + 1}`
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const [diagramName, setDiagramName] = useState<string>("");
  const [error, setError] = useState(false);
  const [highlightSystem, setHighlightSystem] = useState(false);
  const [visibility, setVisibility] = useState<string>("private");

  useEffect(() => {
    setRows(calculateRows(numberOfElements));
    const combos = calculateCombinations(numberOfElements);
    setCombinations(combos);
  }, [numberOfElements]);

  const handleElementClick = (
    rowIndex: number,
    colIndex: number,
    value: number | null
  ) => {
    const newRows = [...rows];
    newRows[rowIndex].elements[colIndex] = value;
    setRows(newRows);
    setResponseMsg("");
  };

  const handleSystemClick = (rowIndex: number, value: number | null) => {
    const newRows = [...rows];
    newRows[rowIndex].system = value;
    setRows(newRows);
    setResponseMsg("");
  };

  const fillMissingSystemWith = (value: number) => {
    const newRows = rows.map((row) =>
      row.system === null ? { ...row, system: value } : row
    );
    setRows(newRows);
  };

  const canCreateDiagram = () => {
    const validName = isValidName(diagramName);
    const systemsFilled = allSystemInputFilled(rows);

    return validName && systemsFilled;
  };

  const validInput = () => {
    setResponseMsg("");

    let result = true;
    if (!isValidName(diagramName)) {
      if (inputRef.current) {
        setError(true);
        inputRef.current.focus();
      }
      setResponseMsg("Input the valid name");
      setResponseErr(true);
      result = false;
    }
    if (!allSystemInputFilled(rows)) {
      setHighlightSystem(true);
      if (result) {
        setResponseMsg("Input all of the functionality rows");
      }
      setResponseErr(true);
      result = false;
    }
    return result;
  };

  const createFunction = async () => {
    setResponseMsg("");

    if (!validInput()) {
      return;
    }

    const data = rows.map((row, index) => ({
      [`elements${index + 1}`]: manualInput
        ? row.elements.map((val) => (val === null ? 0 : val))
        : combinations[index],
      [`functional${index + 1}`]: row.system === null ? 0 : row.system,
    }));

    const finalData = {
      diagramName,
      numberOfElements,
      visibility,
      data,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/diagrams/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalData),
        }
      );
      console.log(finalData);
console.log(JSON.stringify(finalData));
      if (response.ok) {
        const res = await response.text();
        setResponseMsg(res);
        setResponseErr(false);
      } else if (!response.ok) {
        const errorResponse = await response.text();
        setResponseErr(true);
        setResponseMsg(errorResponse);
      }
    } catch (error) {
      setResponseMsg("Error submitting data: " + error);
      setResponseErr(true);
    }

    clearValues(false);
  };

  const clearValues = (isClearButton: boolean) => {
    setRows(calculateRows(numberOfElements));
    setDiagramName("");
    setError(false);
    setHighlightSystem(false);

    if (isClearButton) {
      setResponseMsg("");
    }
  };

  return (
    <>
      <div className="pb-4 px-4 items-center space-y-4">
        <div className="space-x-4">
          <span className="text-xl">Name of the diagram</span>
          <input
            ref={inputRef}
            inputMode="text"
            placeholder="Name"
            required
            value={diagramName}
            onChange={(e) => {
              setResponseMsg("");
              setDiagramName(e.target.value);
              setError(false);
            }}
            className={`rounded-md h-8 px-2 max-w-96 text-white bg-[var(--itemsbackground)] focus:outline-none focus:ring-1 ${
              error ? "border-red-500 focus:ring-red-500" : "focus:ring-white"
            }`}
          />
        </div>
        <div className="space-x-2">
          <span className="text-xl">Fill missing SYSTEM values with</span>
          <button
            className="rounded-md h-9 w-9 px-2 bg-[var(--itemsbackground)] text-xl hover:bg-red-500"
            onClick={() => fillMissingSystemWith(0)}
          >
            0
          </button>
          <button
            className="rounded-md h-9 w-9 px-2 bg-[var(--itemsbackground)] text-xl hover:bg-red-500"
            onClick={() => fillMissingSystemWith(1)}
          >
            1
          </button>
        </div>
        
        <div className="space-x-4">
          <span className="text-xl">Visibility of diagram</span>
          <ToggleButton
            value={visibility}
            setValue={setVisibility}
            option1="private"
            option2="public"
          />
        </div>
      </div>

      <p
        className={`px-4 pb-4 min-h-10 ${
          responseErr ? "text-red-600" : "text-green-500"
        }`}
      >
        {responseMsg}
      </p>

      <div className="flex justify-center">
        <div className="custom-scrollbar inline-block overflow-auto max-h-[50vh] bg-[var(--itemsbackground)]/15 rounded-2xl shadow-md shadow-gray-800">
          <table className="w-auto border-collapse">
            <TableHeader headers={headers} />
            <tbody>
              {rows.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  rowIndex={rowIndex}
                  row={row}
                  headers={headers}
                  manualInput={manualInput}
                  combinations={combinations}
                  onElementClick={handleElementClick}
                  onSystemClick={handleSystemClick}
                  highlight={highlightSystem}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-center rounded-md transition-colors text-lg pt-5 space-x-5">
        <button
          className={`w-20 h-10 rounded-md transition-colors ${
            canCreateDiagram()
              ? "bg-green-500 hover:bg-green-600"
              : "bg-[var(--itemsbackground)]"
          }`}
          onClick={createFunction}
        >
          Create
        </button>
        <button
          className="w-20 h-10 bg-[var(--itemsbackground)] rounded-md"
          onClick={() => clearValues(true)}
        >
          Clear All
        </button>
      </div>
    </>
  );
}

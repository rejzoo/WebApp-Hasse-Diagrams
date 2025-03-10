'use client';

import React, { useEffect, useRef, useState } from 'react';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import { calculateRows, calculateCombinations, RowData } from '@/utils/tableUtils';

interface TableProps {
  numberOfElements: number;
  manualInput: boolean;
}

export default function InputTable({ numberOfElements, manualInput }: TableProps) {
  const [responseMsg, setResponseMsg] = useState('');
  const [combinations, setCombinations] = useState<number[][]>([]);
  const [rows, setRows] = useState<RowData[]>(calculateRows(numberOfElements));
  const headers = Array.from({ length: numberOfElements }, (_, i) => `X${i + 1}`);
  const inputRef = useRef<HTMLInputElement>(null);
  const [diagramName, setDiagramName] = useState<string>('');
  const [error, setError] = useState(false);

  useEffect(() => {
    setRows(calculateRows(numberOfElements));
    const combos = calculateCombinations(numberOfElements);
    setCombinations(combos);
  }, [numberOfElements]);

  const handleElementClick = (rowIndex: number, colIndex: number, value: number | null) => {
    const newRows = [...rows];
    newRows[rowIndex].elements[colIndex] = value;
    setRows(newRows);
  };

  const handleSystemClick = (rowIndex: number, value: number | null) => {
    const newRows = [...rows];
    newRows[rowIndex].system = value;
    setRows(newRows);
  };

  const createFunction = async () => {
    if (!diagramName.trim()) {
      if (inputRef.current) {
        setError(true);
        inputRef.current.focus();
      }
      return;
    }

    setDiagramName('');
    setError(false);

    const data = rows.map((row, index) => ({
      [`elements${index + 1}`]: manualInput
        ? row.elements.map(val => (val === null ? 0 : val))
        : combinations[index],
      [`functional${index + 1}`]: row.system === null ? 0 : row.system,
    }));

    const finalData = {
      diagramName,
      numberOfElements,
      data,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND_URL}/diagrams/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });

      const text = await res.text();
      setResponseMsg(text);
    } catch (error) {
      console.error('Error submitting data:', error);
      setResponseMsg('Error submitting data');
    }
    
    clearValues();
  };

  const clearValues = () => {
    setRows(calculateRows(numberOfElements));
    setDiagramName('');
    setError(false);
  };

  return (
    <>
      <div className="space-x-4 pb-6 px-4 items-center">
        <span className="text-xl">Name of the diagram</span>
        <input
          ref={inputRef}
          inputMode="text"
          placeholder="Name"
          required
          value={diagramName}
          onChange={(e) => setDiagramName(e.target.value)}
          className={`rounded-md h-8 px-2 max-w-96 text-white bg-[var(--itemsbackground)] focus:outline-none focus:ring-1 ${
            error ? 'border-red-500 focus:ring-red-500' : 'focus:ring-white'
          }`}
        />
      </div>

      <div className="flex justify-center">
        <div className="custom-scrollbar inline-block overflow-auto max-h-[60vh] bg-[var(--itemsbackground)]/15 rounded-2xl shadow-md shadow-gray-800">
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
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-center rounded-md transition-colors text-lg pt-5 space-x-5">
        <button
          className="w-20 h-10 bg-[var(--itemsbackground)] rounded-md"
          onClick={createFunction}
        >
          Create
        </button>
        <button
          className="w-20 h-10 bg-[var(--itemsbackground)] rounded-md"
          onClick={clearValues}
        >
          Clear All
        </button>
      </div>

      <p>{responseMsg}</p>
    </>
  );
}

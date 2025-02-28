'use client'

import React, { useEffect, useState, WheelEvent } from 'react';

interface RowData {
  elements: (number | null)[];
  system: number | null;
}

interface TableProps {
    numberOfElements: number
}

export default function InputTable({ numberOfElements }: TableProps) {
  const calculateRows = (numElements: number): RowData[] =>
    Array.from({ length: 2 ** numElements }, () => ({
      elements: Array.from({ length: numElements }, () => null),
      system: null,
    }));

  const [rows, setRows] = useState<RowData[]>(calculateRows(numberOfElements));

  useEffect(() => {
    setRows(calculateRows(numberOfElements));
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

  const headers = Array.from({ length: numberOfElements }, (_, i) => `X${i + 1}`);

  const ToggleCell = ({
    currentValue,
    onSelect,
  }: {
    currentValue: number | null;
    onSelect: (value: number | null) => void;
  }) => (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => onSelect(0)}
        className={`w-14 h-10 flex items-center justify-center rounded-md transition-colors text-xl
          ${
            currentValue === 0
              ? 'bg-gray-500 text-white'
              : 'bg-[var(--itemsbackground)]/20 text-[var(--foreground)] hover:bg-red-500'
          }`}
      >0</button>

      <button
        onClick={() => onSelect(1)}
        className={`w-14 h-10 flex items-center justify-center rounded-md transition-colors text-xl
          ${
            currentValue === 1
              ? 'bg-gray-500 text-white'
              : 'bg-[var(--itemsbackground)]/20 text-[var(--foreground)] hover:bg-red-500'
          }`}
      >1</button>

      <button
        onClick={() => onSelect(null)}
        className={`w-14 h-10 flex items-center justify-center rounded-md transition-colors text-medium 
          ${
            currentValue === null
              ? 'bg-gray-500 text-white'
              : 'bg-[var(--itemsbackground)]/20 text-[var(--foreground)] hover:bg-red-500'
          }`}
      >Clear</button>
    </div>
  );

  const createFunction = () => {
    console.log(rows);
  }

  return (
    <><div className="custom-scrollbar overflow-x-auto max-h-[70vh] bg-[var(--itemsbackground)]/15 rounded-2xl shadow-md shadow-gray-800 pb-4">
      <table className="min-w-full border-collapse">
        <thead className="sticky top-0 z-20 bg-[var(--itemsbackground)]">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="h-12 px-4 text-center text-xl font-light uppercase tracking-wider whitespace-nowrap"
              >
                {header}
              </th>
            ))}
            <th className="h-12 px-4 text-center text-xl font-light uppercase tracking-wider whitespace-nowrap">
              System
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-[var(--itemsbackground)]/10 transition-colors"
            >
              {row.elements.map((value, colIndex) => (
                <td key={colIndex} className="px-4 py-2 text-center">
                  <ToggleCell
                    currentValue={value}
                    onSelect={(val) => handleElementClick(rowIndex, colIndex, val)} />
                </td>
              ))}
              <td className="px-4 py-2 text-center">
                <ToggleCell
                  currentValue={row.system}
                  onSelect={(val) => handleSystemClick(rowIndex, val)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      </div><div className="flex items-center justify-center rounded-md transition-colors text-lg pt-5">
        <button className="w-20 h-10 bg-[var(--itemsbackground)] rounded-md" onClick={createFunction}>
          Create
        </button>
      </div>
    </>
  );
}
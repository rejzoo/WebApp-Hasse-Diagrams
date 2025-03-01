'use client'

import React, { useEffect, useState } from 'react';
import ToggleCell from './ToggleCell';

interface RowData {
  elements: (number | null)[];
  system: number | null;
}

interface TableProps {
  numberOfElements: number;
  manualInput: boolean;
}

function calculateRows(numElements: number): RowData[] {
  return Array.from({ length: 2 ** numElements }, () => ({
    elements: Array.from({ length: numElements }, () => null),
    system: null,
  }));
}

function calculateCombinations(numberOfElements: number) {
  const total = 2 ** numberOfElements;
  const combinations = [];
  
  for (let i = 0; i < total; i++) {
    const combo = [];
    for (let j = numberOfElements - 1; j >= 0; j--) {
      combo.push((i >> j) & 1);
    }
    combinations.push(combo);
  }
  return combinations;
}

export default function InputTable({ numberOfElements, manualInput }: TableProps) {
  const [responseMsg, setResponseMsg] = useState('');
  const [combinations, setCombinations] = useState<number[][]>([]);
  const [rows, setRows] = useState<RowData[]>(calculateRows(numberOfElements));
  const headers = Array.from({ length: numberOfElements }, (_, i) => `X${i + 1}`);

  useEffect(() => {
    setRows(calculateRows(numberOfElements));

    // Calculate combinations - maybe move into the backend ?
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
    const finalData = rows.map((row, index) => ({
      [`elementsRow${index + 1}`]: row.elements.map(val => (val === null ? 0 : val)),
      [`systemRow${index + 1}`]: row.system === null ? 0 : row.system
    }));
  
    const jsonData = JSON.stringify(finalData);
  
    console.log(jsonData);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND_URL}/diagrams/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: jsonData
      });

      const text = await res.text();
      setResponseMsg(text);
    } catch (error) {
      console.error('Error submitting data:', error);
      setResponseMsg('Error submitting data');
    }
    
    clearValues();
  }

  const clearValues = () => {
    setRows(calculateRows(numberOfElements));
  }

  return (
    <>
      <div className="flex justify-center">
        <div className="custom-scrollbar inline-block overflow-auto max-h-[60vh] bg-[var(--itemsbackground)]/15 rounded-2xl shadow-md shadow-gray-800">
          <table className="w-auto border-collapse">
            <thead className="sticky top-0 z-20 bg-[var(--itemsbackground)]">
              <tr>
                <th className="h-12 px-4 text-center text-xl font-light uppercase tracking-wider whitespace-nowrap sticky left-0 bg-[var(--itemsbackground)] w-10">
                  #
                </th>
                <th className="h-12 px-4 text-center text-xl font-light uppercase w-[170px]">
                  System
                </th>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className="h-12 px-4 text-center text-xl font-light uppercase w-[170px]"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-[var(--itemsbackground)]/10 transition-colors"
                >
                  <td className="text-center sticky left-0 bg-[var(--itemsbackground)] w-10">
                    {rowIndex + 1}
                  </td>
                  <td className="py-2 text-center">
                    <ToggleCell
                      currentValue={row.system}
                      onSelect={(val) => handleSystemClick(rowIndex, val)}
                    />
                  </td>
                  {row.elements.map((value, colIndex) => (
                    <td key={colIndex} className="py-2 text-center">
                      {manualInput ? (
                        <ToggleCell
                          currentValue={value}
                          onSelect={(val) =>
                            handleElementClick(rowIndex, colIndex, val)
                          }
                        />
                      ) : (
                        <span className="text-lg text-[var(--foreground)]">
                          {combinations[rowIndex]
                            ? combinations[rowIndex][colIndex]
                            : ''}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
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
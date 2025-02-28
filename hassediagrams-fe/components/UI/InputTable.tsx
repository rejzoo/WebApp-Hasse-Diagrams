'use client'

import React, { useEffect, useState, WheelEvent } from 'react';
import ToggleCell from './ToggleCell';

interface RowData {
  elements: (number | null)[];
  system: number | null;
}

interface TableProps {
    numberOfElements: number
}

export default function InputTable({ numberOfElements }: TableProps) {
  const [responseMsg, setResponseMsg] = useState('');

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

  const createFunction = async () => {
    const finalData = rows.map((row) => ({
      elements: row.elements.map((val) => (val === null ? 0 : val)),
      system: row.system === null ? 0 : row.system,
    }));
  
    const jsonData = JSON.stringify(finalData);
  
    console.log("Sending data:", jsonData);
    
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
      <div className="custom-scrollbar overflow-x-auto max-h-[70vh] bg-[var(--itemsbackground)]/15 rounded-2xl shadow-md shadow-gray-800 pb-4">
        <table className="min-w-full border-collapse">
          <thead className="sticky top-0 z-20 bg-[var(--itemsbackground)]">
            <tr>
              <th className="h-12 px-4 text-center text-xl font-light uppercase tracking-wider whitespace-nowrap sticky left-0 bg-[var(--itemsbackground)] w-10">
                #
              </th>
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
                <td className="px-4 text-center sticky left-0 bg-[var(--itemsbackground)] w-10">
                  {rowIndex + 1}
                </td>
                {row.elements.map((value, colIndex) => (
                  <td key={colIndex} className="px-4 py-2 text-center">
                    <ToggleCell
                      currentValue={value}
                      onSelect={(val) => handleElementClick(rowIndex, colIndex, val)}
                    />
                  </td>
                ))}
                <td className="px-4 py-2 text-center">
                  <ToggleCell
                    currentValue={row.system}
                    onSelect={(val) => handleSystemClick(rowIndex, val)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex items-center justify-center rounded-md transition-colors text-lg pt-5 space-x-5">
        <button className="w-20 h-10 bg-[var(--itemsbackground)] rounded-md" onClick={createFunction}>
          Create
        </button>
        <button className="w-20 h-10 bg-[var(--itemsbackground)] rounded-md" onClick={clearValues}>
          Clear All
        </button>
      </div>
      <p>{responseMsg}</p>
    </>
  );
}
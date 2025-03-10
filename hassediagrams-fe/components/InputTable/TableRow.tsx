import React from 'react';
import { RowData } from '@/utils/tableUtils';
import ToggleCell from '../UI/ToggleCell';

interface TableRowProps {
  rowIndex: number;
  row: RowData;
  headers: string[];
  manualInput: boolean;
  combinations: number[][];
  onElementClick: (rowIndex: number, colIndex: number, value: number | null) => void;
  onSystemClick: (rowIndex: number, value: number | null) => void;
}

export default function TableRow({
  rowIndex,
  row,
  headers,
  manualInput,
  combinations,
  onElementClick,
  onSystemClick,
}: TableRowProps) {
  return (
    <tr className="hover:bg-[var(--itemsbackground)]/10 transition-colors">
      <td className="text-center sticky left-0 bg-[var(--itemsbackground)] w-10">
        {rowIndex + 1}
      </td>
      <td className="py-2 text-center">
        <ToggleCell
          currentValue={row.system}
          onSelect={(val) => onSystemClick(rowIndex, val)}
        />
      </td>
      {row.elements.map((value, colIndex) => (
        <td key={colIndex} className="py-2 text-center">
          {manualInput ? (
            <ToggleCell
              currentValue={value}
              onSelect={(val) => onElementClick(rowIndex, colIndex, val)}
            />
          ) : (
            <span className="text-lg text-[var(--foreground)]">
              {combinations[rowIndex] ? combinations[rowIndex][colIndex] : ''}
            </span>
          )}
        </td>
      ))}
    </tr>
  );
}

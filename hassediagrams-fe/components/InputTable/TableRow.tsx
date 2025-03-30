import React from "react";
import { RowData } from "@/types/table";
import ToggleCell from "../UI/ToggleCell";

interface TableRowProps {
  rowIndex: number;
  row: RowData;
  headers: string[];
  manualInput: boolean;
  combinations: number[][];
  onElementClick: (
    rowIndex: number,
    colIndex: number,
    value: number | null
  ) => void;
  onSystemClick: (rowIndex: number, value: number | null) => void;
  highlight: boolean;
}

export default function TableRow({
  rowIndex,
  row,
  headers,
  manualInput,
  combinations,
  onElementClick,
  onSystemClick,
  highlight,
}: TableRowProps) {
  return (
    <tr className="hover:bg-[var(--itemsbackground)]/10 transition-colors">
      <td className="sticky left-0 bg-[var(--itemsbackground)] w-10 text-center align-middle">
        {rowIndex + 1}
      </td>

      <td
        className={`py-2 text-center transition duration-200 ${
          highlight && row.system === null ? "bg-red-500/20" : ""
        }`}
      >
        <div className="inline-flex items-center justify-center">
          <ToggleCell
            currentValue={row.system}
            onSelect={(val) => onSystemClick(rowIndex, val)}
          />
        </div>
      </td>

      {row.elements.map((value, colIndex) => (
        <td key={colIndex} className="py-2 text-center ">
          <div className="inline-flex items-center justify-center">
            {manualInput ? (
              <ToggleCell
                currentValue={value}
                onSelect={(val) => onElementClick(rowIndex, colIndex, val)}
              />
            ) : (
              <span className="text-lg text-[var(--foreground)]">
                {combinations[rowIndex] ? combinations[rowIndex][colIndex] : ""}
              </span>
            )}
          </div>
        </td>
      ))}
    </tr>
  );
}

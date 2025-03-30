import { RowData } from "@/types/table";
import { diagramNameRegex } from "./regex";

/**
 * Calculates and creates number of rows for input table
 * 
 * @param numElements 
 * @returns 
 */
export function calculateRows(numElements: number): RowData[] {
  return Array.from({ length: 2 ** numElements }, () => ({
    elements: Array.from({ length: numElements }, () => null),
    system: null,
  }));
}

/**
 * Calculates binary combinations
 * 
 * @param numberOfElements 
 * @returns 
 */
export function calculateCombinations(numberOfElements: number): number[][] {
  const total = 2 ** numberOfElements;
  const combinations: number[][] = [];

  for (let i = 0; i < total; i++) {
    const combo: number[] = [];
    for (let j = numberOfElements - 1; j >= 0; j--) {
      combo.push((i >> j) & 1);
    }
    combinations.push(combo);
  }
  return combinations.reverse();
}

/**
 * Validation function for diagram name
 * 
 * @param diagramName 
 * @returns 
 */
export const isValidName = (diagramName: string): boolean => {
  const trimmedName = diagramName.trim();
  return trimmedName !== "" && diagramNameRegex.test(trimmedName);
};

/**
 * Validation function for table input
 * 
 * @param diagramName 
 * @returns 
 */
export const allSystemInputFilled = (rows: RowData[]): boolean => {
  return !rows.some((row) => row.system === null);
};
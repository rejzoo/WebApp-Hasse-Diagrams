import { RowData } from "@/types/table";

export function calculateRows(numElements: number): RowData[] {
  return Array.from({ length: 2 ** numElements }, () => ({
    elements: Array.from({ length: numElements }, () => null),
    system: null,
  }));
}
  
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
  return combinations;
}
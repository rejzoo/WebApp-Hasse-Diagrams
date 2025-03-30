"use client";

import { Diagram, DiagramData } from "@/types/diagram";
import ToggleCell from "../UI/ToggleCell";
import { RefObject } from "react";

interface EditTableProps {
  diagram: Diagram;
  baselineDiagram: RefObject<Diagram | null>;
  onChange?: (updatedDiagramData: DiagramData) => void;
  numberOfElements?: number;
}

export default function EditTable({
  diagram,
  onChange,
  numberOfElements,
  baselineDiagram,
}: EditTableProps) {
  const numElements = numberOfElements!;
  const columns = Array.from({ length: numElements }, (_, i) => i + 1);
  const diagramData = diagram.diagram_data;

  const updateFunctionality = (nodeId: string, newValue: number) => {
    const updatedNodes = diagram.diagram_data.nodes.map((n) =>
      n.id === nodeId ? { ...n, functionality: newValue } : n
    );

    if (onChange) {
      onChange({ ...diagram.diagram_data, nodes: updatedNodes });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <div className="custom-scrollbar inline-block overflow-auto max-h-[50vh] bg-[var(--itemsbackground)]/15 rounded-2xl shadow-md shadow-gray-800">
          <table className="w-auto border-collapse font-light">
            <thead className="sticky top-0 z-20 bg-[var(--itemsbackground)]">
              <tr>
                <th className="h-12 px-4 text-center text-xl font-light uppercase tracking-wider whitespace-nowrap sticky left-0 bg-[var(--itemsbackground)] w-10">
                  #
                </th>
                <th className="h-12 px-4 text-center text-xl font-light uppercase w-[170px]">
                  SYSTEM
                </th>
                {columns.map((col) => (
                  <th
                    key={col}
                    className="h-12 px-4 text-center text-xl font-light uppercase w-[170px]"
                  >
                    x{col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-xl">
              {diagram.diagram_data.nodes.map((node, i) => {
                const baselineNode =
                  baselineDiagram.current!.diagram_data.nodes[i];
                const isChanged =
                  baselineNode &&
                  node.functionality !== baselineNode.functionality;

                return (
                  <tr
                    key={node.id}
                    className="hover:bg-[var(--itemsbackground)]/10 transition-colors"
                  >
                    <td className="sticky left-0 bg-[var(--itemsbackground)] w-10 text-center align-middle">
                      {i + 1}
                    </td>
                    <td
                      className={`py-2 text-center transition duration-200 ${
                        isChanged ? "bg-green-500/20" : ""
                      }`}
                    >
                      <ToggleCell
                        currentValue={node.functionality}
                        onSelect={(val) => updateFunctionality(node.id, val!)}
                      />
                    </td>
                    {node.elements.map((number, j) => (
                      <td key={j} className="py-2 text-center">
                        {number}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

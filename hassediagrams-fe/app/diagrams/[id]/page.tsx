"use client";

import HasseDiagram from "@/components/Diagram/HasseDiagram";
import { use, useEffect, useRef, useState } from "react";
import { CriticalElements, Diagram, DiagramData } from "@/types/diagram";
import ToggleButton from "@/components/UI/ToggleButton";
import Collapsible from "@/components/UI/Collapsible";
import CriticalElementsLevel from "@/components/Diagram/CriticalElementsLevel";

export default function DiagramPage({
  params,
}: {
  params: Promise<{ id: String }>;
}) {
  const { id } = use<{ id: String }>(params);
  const [diagram, setDiagram] = useState<Diagram>();
  const [editing, setEditing] = useState<boolean>(false);
  const [responseMsg, setResponseMsg] = useState<String>("");
  const [responseErr, setResponseErr] = useState<boolean>(false);
  const [criticalElements, setCriticalElements] =
    useState<CriticalElements | null>(null);

  const baselineDiagramRef = useRef<Diagram | null>(null);

  const handleToggle = (state: boolean) => {
    setEditing(state);
  };

  useEffect(() => {
    const fetchDiagrams = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/diagrams/${id}`,
          {
            method: "GET",
          }
        );
        const result = await response.json();

        setDiagram(result);
        if (!baselineDiagramRef.current) {
          baselineDiagramRef.current = JSON.parse(JSON.stringify(result));
        }
      } catch (error) {
        console.error("Error fetching diagram:", error);
      }
    };

    // TODO
    const fetchCriticalElements = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/diagrams/critElements/${id}`,
          {
            method: "GET",
          }
        );
        const data: CriticalElements = await response.json();
        setCriticalElements(data);
        console.log(data);
      } catch (error: any) {}
    };

    fetchDiagrams();
    fetchCriticalElements();
  }, [baselineDiagramRef]);

  const handleDiagramChange = (updatedDiagramData: any) => {
    setDiagram({ ...diagram!, diagram_data: updatedDiagramData });
  };

  const isDiagramChanged = (): boolean => {
    if (!diagram || !baselineDiagramRef.current) return false;

    const currentNodes = diagram.diagram_data.nodes;
    const baselineNodes = baselineDiagramRef.current.diagram_data.nodes;
    if (currentNodes.length !== baselineNodes.length) return true;

    for (let i = 0; i < currentNodes.length; i++) {
      if (currentNodes[i].functionality !== baselineNodes[i].functionality) {
        return true;
      }
    }
    return false;
  };

  const prepareDiagramData = (data: DiagramData): DiagramData => ({
    ...data,
    nodes: data.nodes.map(({ x, y, ...rest }) => rest),
  });

  const handleSave = async () => {
    if (isDiagramChanged() && diagram) {
      try {
        const strippedData = prepareDiagramData(diagram.diagram_data);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/diagrams/update/${id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(strippedData),
          }
        );

        if (response.ok) {
          baselineDiagramRef.current = JSON.parse(JSON.stringify(diagram));
          setDiagram({ ...diagram });

          const res = await response.text();
          setResponseMsg(res);
          setResponseErr(false);
        } else if (!response.ok) {
          baselineDiagramRef.current = JSON.parse(JSON.stringify(diagram));
          setDiagram({ ...diagram });

          const errorResponse = await response.text();
          setResponseMsg(errorResponse);
          setResponseErr(true);
        }
      } catch (error) {
        console.error("Error updating diagram:", error);
        setResponseMsg("Error updating diagram: " + error);
        setResponseErr(true);
      }
    }
  };

  return (
    <div className="space-y-10">
      <Collapsible title="Diagram information" opened={false}>
        <div className="flex flex-row space-x-10 text-ml font-mono">
          <div className="flex flex-col">
            <p>Diagram name:</p>
            <p>Created by:</p>
            <p>Number of elements:</p>
            <p>Number of nodes:</p>
            <p>Number of edges:</p>
          </div>

          <div className="flex flex-col">
            <p>{diagram?.diagram_name}</p>
            <p>{diagram?.user_id}</p>
            <p>{diagram?.diagram_elements_count}</p>
            <p>{diagram?.diagram_data.nodes.length}</p>
            <p>{diagram?.diagram_data.edges.length}</p>
          </div>
        </div>
      </Collapsible>

      <Collapsible title="Diagram" opened={true}>
        {baselineDiagramRef.current &&
        baselineDiagramRef.current?.diagram_elements_count <= 6 ? (
          <>
            <div className="flex pb-8 justify-between">
              <ToggleButton onToggle={handleToggle} />
              <button
                onClick={handleSave}
                disabled={!isDiagramChanged()}
                className={`items-center w-20 py-2 rounded-md bg-[var(--itemsbackground)] hover:bg-[#26233d] ${
                  !isDiagramChanged() ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                SAVE
              </button>
            </div>

            <p
              className={`px-4 pb-4 min-h-10 ${
                responseErr ? "text-red-600" : "text-green-500"
              }`}
            >
              {responseMsg}
            </p>

            <div className="flex justify-center">
              {diagram && (
                <HasseDiagram
                  diagramData={diagram.diagram_data}
                  editing={editing}
                  onChange={handleDiagramChange}
                />
              )}
            </div>
          </>
        ) : (
          <div className="font-bold flex justify-center flex-col space-y-3">
            <p>Diagrams with elements count {">"} 6 are not clear to read.</p>
            <p>
              This diagram has{" "}
              {baselineDiagramRef.current?.diagram_elements_count} elements and
              is not rendered.
            </p>
          </div>
        )}
      </Collapsible>

      <Collapsible title="Critical elements" opened={false}>
        <div className="font-mono text-ml">
          {criticalElements &&
            Object.entries(criticalElements).map(([level, elementsList]) => (
              <CriticalElementsLevel
                key={level}
                level={level}
                elements={elementsList}
              />
            ))}
        </div>
      </Collapsible>
    </div>
  );
}

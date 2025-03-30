"use client";

import HasseDiagram from "@/components/Diagram/HasseDiagram";
import { use, useEffect, useRef, useState } from "react";
import { CriticalStates, Diagram, DiagramData } from "@/types/diagram";
import ToggleButtons from "@/components/UI/ToggleButtons";
import Collapsible from "@/components/UI/Collapsible";
import CriticalStatesLevel from "@/components/Diagram/CriticalElementsLevel";
import EditableField from "@/components/UI/EditableField";

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
  const [criticalStates, setCriticalElements] = useState<CriticalStates | null>(
    null
  );

  const baselineDiagramRef = useRef<Diagram | null>(null);
  const retriedRef = useRef(false);

  const handleToggle = (state: boolean) => {
    setEditing(state);
  };

  const fetchCriticalElements = async () => {
    const delay: number = 5000;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/diagrams/critElements/${id}`,
        {
          method: "GET",
        }
      );

      const data: CriticalStates = await response.json();

      if (!data || Object.keys(data).length === 0) {
        setCriticalElements(null);
        if (!retriedRef.current) {
          retriedRef.current = true;
          setTimeout(fetchCriticalElements, delay);
        }
      } else {
        setCriticalElements(data);
      }

      console.log(data);
    } catch (error: any) {
      console.error("Error fetching critical elements:", error);
      setCriticalElements(null);
      if (!retriedRef.current) {
        retriedRef.current = true;
        setTimeout(fetchCriticalElements, delay);
      }
    }
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
          `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/diagrams/update/func/${id}`,
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

    retriedRef.current = false;
    fetchCriticalElements();
  };

  const cancelEdit = () => {
    setDiagram(JSON.parse(JSON.stringify(baselineDiagramRef.current)));
  };

  const updateInformation = async (newDiagramName: string, newVisibility: string) => {
    if (!diagram) {
      return;
    }

    console.log("NAME ", diagram?.diagram_name);
    try {
      const data = {
        diagram_name: newDiagramName,
        visibility: newVisibility,
      };

      console.log(data);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/diagrams/update/info/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        console.log("Update successful");
      } else {
        console.error("Update failed", await response.text());
      }
    } catch (error) {
      console.error("Error updating information:", error);
    }
  };

  return (
    <div className="space-y-10">
      <Collapsible title="Diagram information" opened={false}>
        <div className="flex flex-row space-x-10 text-xl font-mono">
          <div className="flex flex-col">
            <p>Diagram name:</p>
            <p>Created by:</p>
            <p>Visibility:</p>
            <p>Number of elements:</p>
            <p>Number of nodes:</p>
            <p>Number of edges:</p>
          </div>

          <div className="flex flex-col">
            <EditableField
              value={diagram?.diagram_name || ""}
              onChange={(newName) => {
                setDiagram((prev) =>
                  prev ? { ...prev, diagram_name: newName } : prev
                );
                updateInformation(newName, diagram?.visibility || "");
              }}
            />
            <p>{diagram?.user_id}</p>
            <EditableField
              value={diagram?.visibility || ""}
              controlType="dropdown"
              options={["private", "public"]}
              onChange={(newVisibility) => {
                setDiagram((prev) =>
                  prev ? { ...prev, visibility: newVisibility } : prev
                );
                updateInformation(diagram?.diagram_name || "", newVisibility);
              }}
            />
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
              <ToggleButtons
                onToggle={handleToggle}
                firstState="View"
                secondsState="Edit"
              />
              <div className="mt-auto space-x-4">
                <button
                  onClick={handleSave}
                  disabled={!isDiagramChanged()}
                  className={`items-center w-20 py-2 rounded-md bg-[var(--itemsbackground)] hover:bg-[#26233d] ${
                    !isDiagramChanged()
                      ? "opacity-50 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  SAVE
                </button>
                <button
                  onClick={cancelEdit}
                  disabled={!isDiagramChanged()}
                  className={`items-center w-20 py-2 rounded-md bg-[var(--itemsbackground)] hover:bg-[#26233d] ${
                    !isDiagramChanged()
                      ? "opacity-50 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  CANCEL
                </button>
              </div>
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

      <Collapsible title="Critical states" opened={false}>
        <div className="font-mono text-ml">
          {criticalStates ? (
            Object.entries(criticalStates).map(([level, elementsList]) => (
              <CriticalStatesLevel
                key={level}
                level={level}
                elements={elementsList}
              />
            ))
          ) : (
            <p>No critical states available. Trying again in 5 seconds.</p>
          )}
        </div>
      </Collapsible>
    </div>
  );
}

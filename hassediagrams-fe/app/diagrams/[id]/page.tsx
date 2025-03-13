'use client'

import HasseDiagram from "@/components/UI/HasseDiagram";
import { use, useEffect, useRef, useState } from "react";
import { Diagram } from "@/types/diagram";
import ToggleButton from "@/components/UI/ToggleButton";

export default function DiagramPage({ params }: { params: Promise<{id: String}> }) {
    const { id } = use<{id: String}>(params); 
    const [diagram, setDiagram] = useState<Diagram>();
    const [editing, setEditing] = useState<boolean>(false);

    const baselineDiagramRef = useRef<Diagram | null>(null);

    const handleToggle = (state: boolean) => {
        setEditing(state);
    };

    useEffect(() => {
        const fetchDiagrams = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND_URL}/diagrams/${id}`, { 
                    method: "GET" 
                });
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
    }, []);

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

    const handleSave = () => {
        if (isDiagramChanged()) {
          console.log("Diagram has changed:", diagram);
        } else {
          console.log("No changes detected.");
        }
    };

    return (
        <div>
            <div className="flex pb-8 justify-between ">
                <ToggleButton onToggle={handleToggle}/>
                <button 
                    onClick={handleSave}
                    disabled={!isDiagramChanged()}
                    className={`items-center w-20 py-2 rounded-md bg-[var(--itemsbackground)] hover:bg-[#26233d] ${
                        !isDiagramChanged() ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                >SAVE</button>
            </div>
            <div className="flex justify-center">
            
                { diagram &&
                    <HasseDiagram 
                        diagramData={diagram.diagram_data} 
                        editing={editing}
                        onChange={handleDiagramChange}
                    />
                }
            </div>
        </div>
    );
}
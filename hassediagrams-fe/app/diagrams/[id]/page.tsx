'use client'

import HasseDiagram from "@/components/UI/HasseDiagram";
import { use, useEffect, useState } from "react";
import { Diagram } from "@/types/diagram";
import ToggleButton from "@/components/UI/ToggleButton";

export default function DiagramPage({ params }: { params: Promise<{id: String}> }) {
    const { id } = use<{id: String}>(params); 
    const [diagram, setDiagram] = useState<Diagram>();
    const [editing, setEditing] = useState<boolean>(false);

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
                console.log("GET", result);
            
                setDiagram(result);
            } catch (error) {
                console.error("Error fetching diagram:", error);
            }
        };

        fetchDiagrams();
      }, []);

    return (
        <div >
            <div className="pb-8">
                <ToggleButton onToggle={handleToggle}/>

            </div>
            <div className="flex justify-center">
            
                { diagram &&
                    <HasseDiagram diagramData={diagram.diagram_data} editing={editing} />
                }
            </div>
        </div>
    );
}
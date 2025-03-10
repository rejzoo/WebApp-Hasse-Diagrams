'use client';

import { useEffect, useState } from "react";
import { Diagram } from "@/types/diagram";
import HasseDiagramCard from "@/components/UI/HasseDiagramCard";

export default function DiagramsPage() {
    const [diagramData, setDiagramData] = useState<Diagram[] | null>(null);

  useEffect(() => {
    const fetchDiagrams = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND_URL}/diagrams/fetchAll`, { 
                method: "GET" 
            });

            const result = await response.json();
        
            console.log("GET", result);

            const transformed: Diagram[] = result.map((diagramObj: any) => diagramObj);
            setDiagramData(transformed);
        } catch (error) {
            console.error("Error fetching diagram:", error);
        }
    };

    fetchDiagrams();
  }, []);

  return (
    <div>
        {diagramData ? (
            diagramData.map((diagram) => (
                <HasseDiagramCard 
                    key={diagram.diagram_id} 
                    diagramID={diagram.diagram_id}
                    userID={diagram.user_id}
                    numberOfNodes={diagram.diagram_data.nodes.length}
                    numberOfEdges={diagram.diagram_data.edges.length}
                    diagramName={diagram.diagram_name}
                />
            ))
        ) : (
            <p>Loading diagrams...</p>
        )}
    </div>
  );
}
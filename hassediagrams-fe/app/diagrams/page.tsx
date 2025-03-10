'use client';

import { useEffect, useState } from "react";
import { Diagram } from "@/types/diagram";

export default function DiagramsPage() {
    const [diagramData, setDiagramData] = useState<Diagram[] | null>(null);

  useEffect(() => {
    const fetchDiagrams = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND_URL}/diagrams/fetchAll`, { 
                method: "GET" 
            });

            const result = await response.json();
            console.log(result);
        
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
            diagramData.map((diagram, index) => (
                <div key={index}>
                    <pre>{JSON.stringify(diagram, null, 2)}</pre>
                </div>
            ))
        ) : (
            <p>Loading diagrams...</p>
        )}
    </div>
  );
}
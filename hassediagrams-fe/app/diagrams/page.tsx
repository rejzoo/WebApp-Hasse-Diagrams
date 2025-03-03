'use client';

import HasseDiagram from "@/components/UI/HasseDiagram";
import { useEffect, useState } from "react";
import { DiagramData } from "@/types/diagram";

export default function DiagramsPage() {
  const [diagramData, setDiagramData] = useState<DiagramData | null>(null);

  useEffect(() => {
    const fetchDiagrams = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND_URL}/diagrams/fetchAll`, { 
                method: "GET" 
            });

            const result = await response.json();
        
            const transformed: DiagramData = {
                nodes: result.nodes.map((node: any) => ({
                    id: node.id,
                    elements: node.elements,
                    system: node.functionality,
                })),
          
                edges: result.edges.map((edge: any) => ({
                    source: edge.from,
                    target: edge.to,
                })),
            };
            
            setDiagramData(transformed);
        } catch (error) {
            console.error("Error fetching diagram:", error);
        }
    };

    fetchDiagrams();
  }, []);

  return (
    <div>
        { diagramData &&
            <HasseDiagram diagramData={diagramData} />
        }
    </div>
  );
}
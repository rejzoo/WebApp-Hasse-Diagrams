"use client";

import { useEffect, useState } from "react";
import { Diagram } from "@/types/diagram";
import HasseDiagramCard from "@/components/Diagram/HasseDiagramCard";

export default function DiagramsPage() {
  const [diagramData, setDiagramData] = useState<Diagram[] | null>(null);

  useEffect(() => {
    const fetchDiagrams = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/diagrams/fetchAll`,
          {
            method: "GET",
          }
        );

        const result = await response.json();

        console.log("GET", result);

        const transformed: Diagram[] = result.map(
          (diagramObj: any) => diagramObj
        );

        if (transformed.length == 0) {
          setDiagramData(null);
        } else {
          setDiagramData(transformed);
        }
      } catch (error) {
        console.error("Error fetching diagram:", error);
      }
    };

    fetchDiagrams();
  }, []);

  return (
    <div className="flex flex-wrap justify-center items-center gap-4">
      {diagramData ? (
        diagramData.map((diagram) => (
          <HasseDiagramCard
            key={diagram.diagram_id}
            diagramID={diagram.diagram_id}
            userID={diagram.user_id}
            numberOfElements={diagram.diagram_elements_count}
            numberOfNodes={diagram.diagram_data.nodes.length}
            numberOfEdges={diagram.diagram_data.edges.length}
            diagramName={diagram.diagram_name}
          />
        ))
      ) : (
        <div className="flex flex-col justify-center text-center text-xl mt-16">
          <p>No diagrams :{"("}</p>
          <p>To create diagram navigate to Create page.</p>
        </div>
      )}
    </div>
  );
}

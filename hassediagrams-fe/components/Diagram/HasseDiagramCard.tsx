import Link from "next/link";

interface CardProps {
  diagramID: number;
  userID: number;
  numberOfElements: number;
  numberOfNodes: number;
  numberOfEdges: number;
  diagramName: string;
}

export default function HasseDiagramCard({
  diagramID,
  userID,
  numberOfElements,
  numberOfNodes,
  numberOfEdges,
  diagramName,
}: CardProps) {
  return (
    <Link
      href={`/diagrams/${encodeURIComponent(diagramID)}`}
      className="inline-block m-4"
    >
      <div
        className="w-72 flex flex-col bg-[var(--itemsbackground)] p-4 rounded-lg 
            shadow-md transition duration-200 transform hover:-translate-y-1 hover:shadow-lg hover:bg-[#26233d]"
      >
        <span className="text-2xl font-semibold">{diagramName}</span>
        <span>Created by: {userID}</span>
        <span>Number of elements: {numberOfElements}</span>
        <span>Nodes: {numberOfNodes}</span>
        <span>Edges: {numberOfEdges}</span>
      </div>
    </Link>
  );
}

export interface NodeData {
    id: string;
    elements: number[];
    system: number;
    x?: number;
    y?: number;
}

export interface EdgeData {
    source: string;
    target: string;
}

export interface DiagramData {
    nodes: NodeData[];
    edges: EdgeData[];
}
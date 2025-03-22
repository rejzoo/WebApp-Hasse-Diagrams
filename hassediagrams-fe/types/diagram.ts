export interface NodeData {
    id: string;
    elements: number[];
    functionality: number;
    x?: number;
    y?: number;
}

export interface EdgeData {
    from: string;
    to: string;
}

export interface DiagramData {
    nodes: NodeData[];
    edges: EdgeData[];
}

export interface Diagram {
    diagram_id: number;
    user_id: number;
    diagram_name: string;
    diagram_elements_count: number;
    diagram_data: DiagramData;
}
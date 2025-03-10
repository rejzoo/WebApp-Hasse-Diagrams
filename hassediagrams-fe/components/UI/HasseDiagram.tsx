'use client'

import React, { useRef, useEffect } from "react";
import { NodeData, DiagramData } from "@/types/diagram";
import * as d3 from "d3";

interface HasseDiagramProps {
  diagramData: DiagramData;
}

export default function HasseDiagram({ diagramData }: HasseDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  console.log("COMP", diagramData);

  useEffect(() => {
    if (!diagramData) return;

    const { nodes, edges } = diagramData;

    const width = 800;
    const height = 700;
    const svg = d3.select(svgRef.current!)
      .attr('width', width)
      .attr('height', height)
      .style('border', '2px solid darkgray');

    svg.selectAll('*').remove();

    const container = svg.append('g')
      .attr('class', 'diagram-container');

    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 5])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
      });
    svg.call(zoomBehavior);

    // Group nodes by level
    const levels: { [level: number]: NodeData[] } = {};
    nodes.forEach(node => {
      const level = node.elements.reduce((sum, x) => sum + x, 0);
      if (!levels[level]) levels[level] = [];
      levels[level].push(node);
    });

    // Sort levels
    const sortedLevels = Object.keys(levels)
      .map(l => parseInt(l, 10))
      .sort((a, b) => a - b);

    const levelSpacing = 100;
    const nodeSpacing = 80;
    const totalLevels = sortedLevels.length;

    // Calculate coordinates for each node
    sortedLevels.forEach((level, idx) => {
      const rowNodes = levels[level];
      const y = 50 + (totalLevels - 1 - idx) * levelSpacing;
      const rowCount = rowNodes.length;
      const startX = (width / 2) - ((rowCount - 1) / 2) * nodeSpacing;

      rowNodes.forEach((node, i) => {
        node.x = startX + i * nodeSpacing;
        node.y = y;
      });
    });

    // Lookup by node ID
    const nodeById: { [id: string]: NodeData } = {};
    nodes.forEach(n => {
      nodeById[n.id] = n;
    });
    
    // Draw edges
    container.selectAll('line.edge')
      .data(edges)
      .enter()
      .append('line')
      .attr('class', 'edge')
      .attr('x1', d => nodeById[d.from].x!)
      .attr('y1', d => nodeById[d.from].y!)
      .attr('x2', d => nodeById[d.to].x!)
      .attr('y2', d => nodeById[d.to].y!)
      .attr('stroke', 'gray')
      .attr('stroke-width', 2);

    // Draw nodes as rectangles
    const nodeGroup = container.selectAll('g.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`);

    // Append rectangles
    nodeGroup.append('rect')
      .attr('width', 40)
      .attr('height', 30)
      .attr('x', -20)
      .attr('y', -15)
      .attr('fill', d => d.functionality === 1 ? 'lightgreen' : 'lightcoral')
      .attr('stroke', 'black')
      .attr('stroke-width', 1.5);

    // Append labels
    nodeGroup.append('text')
      .attr('dy', 4)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .text(d => d.id);

    nodeGroup.on('click', (event, d: NodeData) => {
      d.functionality = d.functionality === 1 ? 0 : 1;
      d3.select(event.currentTarget)
        .select('rect')
        .attr('fill', d.functionality === 1 ? 'lightgreen' : 'lightcoral');
        console.log(diagramData);
    });

    nodeGroup
      .on('mouseover', (event, d: NodeData) => {
        d3.select(event.currentTarget)
          .select('rect')
          .attr('stroke', 'blue')
          .attr('stroke-width', 3);
      })
      .on('mouseout', (event, d: NodeData) => {
        d3.select(event.currentTarget)
          .select('rect')
          .attr('stroke', 'black')
          .attr('stroke-width', 1.5);
      });


      console.log(diagramData);
  }, [diagramData]);

  return <svg ref={svgRef}></svg>;
};
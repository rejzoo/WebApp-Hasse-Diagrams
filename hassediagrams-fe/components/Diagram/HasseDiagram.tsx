"use client";

import React, { useRef, useEffect } from "react";
import { NodeData, DiagramData } from "@/types/diagram";
import * as d3 from "d3";

interface HasseDiagramProps {
  diagramData: DiagramData;
  editing: boolean;
  onChange?: (updatedDiagramData: DiagramData) => void;
}

export default function HasseDiagram({
  diagramData,
  editing,
  onChange,
}: HasseDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<d3.ZoomTransform | null>(null);

  // Init once
  useEffect(() => {
    const svg = d3.select(svgRef.current!);
    svg
      .attr("width", 800)
      .attr("height", 600)
      .style("border", "2px solid darkgray")
      .style("touch-action", "none")
      .style("cursor", editing ? "default" : "move");

    svg.append("g").attr("class", "diagram-container");
  }, []);

  // Update cursor on mode change
  useEffect(() => {
    const svg = d3.select(svgRef.current!);
    svg.style("cursor", editing ? "default" : "move");
  }, [editing]);

  // Redraw when data changes
  useEffect(() => {
    if (!diagramData) return;

    const svg = d3.select(svgRef.current!);
    const container = svg.select(".diagram-container");

    container.selectAll(".node").remove();
    container.selectAll(".edge").remove();

    const { nodes, edges } = diagramData;
    const width = 800;
    const levelSpacing = 100;
    const nodeSpacing = 80;

    // Level grouping
    const levels: { [level: number]: NodeData[] } = {};
    nodes.forEach((node) => {
      const level = node.elements.reduce((sum, x) => sum + x, 0);
      if (!levels[level]) levels[level] = [];
      levels[level].push(node);
    });
    const sortedLevels = Object.keys(levels)
      .map(Number)
      .sort((a, b) => a - b);
    const totalLevels = sortedLevels.length;

    // Cords calculating
    sortedLevels.forEach((level, idx) => {
      const rowNodes = levels[level];
      const y = 50 + (totalLevels - 1 - idx) * levelSpacing;
      const rowCount = rowNodes.length;
      const startX = width / 2 - ((rowCount - 1) / 2) * nodeSpacing;
      rowNodes.forEach((node, i) => {
        node.x = startX + i * nodeSpacing;
        node.y = y;
      });
    });

    const nodeById: { [id: string]: NodeData } = {};
    nodes.forEach((n) => {
      nodeById[n.id] = n;
    });

    // Draw edges
    container
      .selectAll("line.edge")
      .data(edges, (d: any) => `${d.from}-${d.to}`)
      .enter()
      .append("line")
      .attr("class", "edge")
      .attr("x1", (d) => nodeById[d.from].x!)
      .attr("y1", (d) => nodeById[d.from].y!)
      .attr("x2", (d) => nodeById[d.to].x!)
      .attr("y2", (d) => nodeById[d.to].y!)
      .attr("stroke", "gray")
      .attr("stroke-width", 2);

    // Draw nodes
    const nodeSelection = container
      .selectAll<SVGGElement, NodeData>("g.node")
      .data(nodes, (d) => d.id);

    // Remove old nodes
    nodeSelection.exit().remove();

    // Append new nodes
    const nodeEnter = nodeSelection
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.x},${d.y})`);
    nodeEnter
      .append("rect")
      .attr("width", 40)
      .attr("height", 30)
      .attr("x", -20)
      .attr("y", -15)
      .attr("fill", (d) =>
        d.functionality === 1 ? "lightgreen" : "lightcoral"
      )
      .attr("stroke", "gray")
      .attr("stroke-width", 1.5);
    nodeEnter
      .append("text")
      .attr("dy", 4)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .text((d) => d.id);

    // Reapply zoom
    if (zoomRef.current) {
      container.attr("transform", zoomRef.current.toString());
    }
  }, [diagramData]);

  // Update zoom
  useEffect(() => {
    const svg = d3.select(svgRef.current!);
    svg.on(".zoom", null);

    const zoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 5])
      .filter((event) => {
        return !editing;
      })
      .on("zoom", (event) => {
        zoomRef.current = event.transform;
        const container = svg.select(".diagram-container");
        container.attr("transform", event.transform.toString());
      });
    svg.call(zoomBehavior);

    if (zoomRef.current) {
      const container = svg.select(".diagram-container");
      container.attr("transform", zoomRef.current.toString());
    }
  }, [editing]);

  // Update node event handlers
  useEffect(() => {
    const svg = d3.select(svgRef.current!);
    const container = svg.select(".diagram-container");
    const nodeSelection = container.selectAll<SVGGElement, NodeData>("g.node");

    if (editing) {
      nodeSelection
        .on("click", (event, d) => {
          event.stopPropagation();
          d.functionality = d.functionality === 1 ? 0 : 1;
          d3.select(event.currentTarget)
            .select("rect")
            .attr("fill", d.functionality === 1 ? "lightgreen" : "lightcoral");
          if (onChange) {
            onChange(diagramData);
          }
        })
        .on("mouseover", (event, d) => {
          d3.select(event.currentTarget)
            .select("rect")
            .attr("stroke", d.functionality === 1 ? "lightcoral" : "lightgreen")
            .attr("stroke-width", 3);
        })
        .on("mouseout", (event, d) => {
          d3.select(event.currentTarget)
            .select("rect")
            .attr("stroke", "gray")
            .attr("stroke-width", 1.5);
        })
        .style("pointer-events", "all");
    } else {
      nodeSelection
        .on("click", null)
        .on("mouseover", null)
        .on("mouseout", null)
        .style("pointer-events", "none");
    }
  }, [editing]);

  return <svg ref={svgRef}></svg>;
}

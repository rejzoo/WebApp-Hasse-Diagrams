package com.hassediagrams.rejzo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Class which holds lists of nodes and edges
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class DiagramDataDTO {
    private List<NodeDTO> nodes;
    private List<EdgeDTO> edges;
}
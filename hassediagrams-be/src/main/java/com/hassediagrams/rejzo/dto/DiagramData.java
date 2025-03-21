package com.hassediagrams.rejzo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@AllArgsConstructor
@Getter
public class DiagramData {
    private List<NodeDTO> nodes;
    private List<EdgeDTO> edges;
}
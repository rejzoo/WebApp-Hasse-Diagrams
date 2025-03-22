package com.hassediagrams.rejzo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

/**
 * Class representing Node in the diagram
 */
@AllArgsConstructor
@Getter
public class NodeDTO {
    private String id;
    private List<Integer> elements;
    private int functionality;
}

package com.hassediagrams.rejzo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Class representing edge in the diagram
 */
@AllArgsConstructor
@Getter
public class EdgeDTO {
    private String from;
    private String to;
}

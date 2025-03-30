package com.hassediagrams.rejzo.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    /**
     * Counts in which level the node is
     *
     * @return node level
     */
    @JsonIgnore
    public int getLevel() {
        int numberOfZeros = 1;

        for (Integer functionality : elements) {
            if (functionality == 0) {
                numberOfZeros++;
            }
        }

        return numberOfZeros;
    }
}

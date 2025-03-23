package com.hassediagrams.rejzo.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.ArrayList;
import java.util.Collections;
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

    /**
     * Formats and returns functional elements
     *
     * @return list of functional elements
     */
    @JsonIgnore
    public List<String> getFunctionalElements() {
        List<String> functionalElements = new ArrayList<>();

        for (int i = 0; i < elements.size(); i++) {
            if (elements.get(i) == 1) {
                functionalElements.add("x" + (i + 1));
            }
        }

        functionalElements.sort((s1, s2) -> {
            int num1 = Integer.parseInt(s1.substring(1));
            int num2 = Integer.parseInt(s2.substring(1));
            return Integer.compare(num1, num2);
        });

        return functionalElements;
    }
}

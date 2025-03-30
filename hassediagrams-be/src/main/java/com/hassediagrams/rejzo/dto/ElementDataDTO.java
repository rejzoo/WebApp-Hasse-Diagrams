package com.hassediagrams.rejzo.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.Getter;

import java.util.List;
import java.util.Map;

/**
 * Class representing data for 1 element for 1 combination
 */
@Getter
public class ElementDataDTO {
    private List<Integer> elements;
    private Integer system;

    @JsonCreator
    public ElementDataDTO(Map<String, Object> props) {
        for (Map.Entry<String, Object> entry : props.entrySet()) {
            if (entry.getKey().startsWith("elements")) {
                this.elements = (List<Integer>) entry.getValue();
            } else if (entry.getKey().startsWith("functional")) {
                this.system = (Integer) entry.getValue();
            }
        }
    }
}

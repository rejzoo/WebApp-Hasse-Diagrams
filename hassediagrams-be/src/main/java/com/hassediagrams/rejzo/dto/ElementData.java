package com.hassediagrams.rejzo.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.Getter;

import java.util.List;
import java.util.Map;

@Getter
public class ElementData {
    private List<Integer> elements;
    private Integer system;

    @JsonCreator
    public ElementData(Map<String, Object> props) {
        for (Map.Entry<String, Object> entry : props.entrySet()) {
            if (entry.getKey().startsWith("elements")) {
                this.elements = (List<Integer>) entry.getValue();
            } else if (entry.getKey().startsWith("functional")) {
                this.system = (Integer) entry.getValue();
            }
        }
    }
}

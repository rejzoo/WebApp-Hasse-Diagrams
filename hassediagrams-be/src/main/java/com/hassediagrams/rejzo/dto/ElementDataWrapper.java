package com.hassediagrams.rejzo.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

import java.util.List;

@Getter
public class ElementDataWrapper {
    private final String diagramName;
    private final int numberOfElements;
    private final List<ElementData> elementData;

    @JsonCreator
    public ElementDataWrapper(String diagramName, @JsonProperty("numberOfElements") int numberOfElements,
                              @JsonProperty("data") List<ElementData> elementData) {
        this.diagramName = diagramName;
        this.numberOfElements = numberOfElements;
        this.elementData = elementData;
    }
}

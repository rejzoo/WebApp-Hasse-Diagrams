package com.hassediagrams.rejzo.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

import java.util.List;

@Getter
public class ElementDataWrapper {
    private final int numberOfElements;
    private final List<ElementData> elementData;

    @JsonCreator
    public ElementDataWrapper(@JsonProperty("numberOfElements") int numberOfElements,
                              @JsonProperty("data") List<ElementData> elementData) {
        this.numberOfElements = numberOfElements;
        this.elementData = elementData;
    }
}

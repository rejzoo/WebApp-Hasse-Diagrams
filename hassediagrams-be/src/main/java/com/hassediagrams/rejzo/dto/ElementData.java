package com.hassediagrams.rejzo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ElementData {
    private List<Integer> elements;
    private int system;

    public ElementData() {}

    public ElementData(List<Integer> elements, int system) {
        this.elements = elements;
        this.system = system;
    }
}

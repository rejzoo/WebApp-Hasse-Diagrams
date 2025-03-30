package com.hassediagrams.rejzo.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import jakarta.validation.constraints.Pattern;

import java.util.List;

/**
 * Class which wraps receiving data from FE
 */
@Getter
public class ElementDataWrapper {

    @Pattern(
            regexp = "^(?=.{1,50}$)[A-Za-z0-9][A-Za-z0-9 _-]*$",
            message = "Diagram name must be 1-50 characters long, start with an alphanumeric character, and may only contain letters, numbers, spaces, underscores, and hyphens."
    )
    private final String diagramName;
    private final int numberOfElements;
    private final String visibility;
    private final List<ElementDataDTO> elementDatumDTOS;

    @JsonCreator
    public ElementDataWrapper(String diagramName, @JsonProperty("numberOfElements") int numberOfElements, String visibility,
                              @JsonProperty("data") List<ElementDataDTO> elementDatumDTOS) {
        this.diagramName = diagramName;
        this.numberOfElements = numberOfElements;
        this.visibility = visibility;
        this.elementDatumDTOS = elementDatumDTOS;
    }
}
